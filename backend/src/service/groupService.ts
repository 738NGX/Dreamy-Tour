import dbPromise from "@/config/databaseConfig";
import GroupConstant from "@/constant/groupConstant";
import GroupDto from "@/dto/group/groupDto";
import Group from "@/entity/group";
import ForbiddenError from "@/exception/forbiddenError";
import NotFoundError from "@/exception/notFoundError";
import GroupUtil from "@/util/groupUtil";
import GroupDetailVo from "@/vo/group/groupDetailVo";
import GroupListVo from "@/vo/group/groupListVo";
import TourService from "./tourService";
import UserDetailVo from "@/vo/user/userDetailVo";
import User from "@/entity/user";
import AuthorityVo from "@/vo/user/authorityVo";
import { UserUtil } from "@/util/userUtil";
import RoleUtil from "@/util/roleUtil";
import GroupTransferDto from "@/dto/group/groupTransferDto";
import GroupGrantAdminDto from "@/dto/group/groupGrantAdminDto";
import GroupModifyDto from "@/dto/group/groupModifyDto";
import CosUtil from "@/util/cosUtil";
import CosConstant from "@/constant/cosConstant";
import UserService from "./userService";
import ParamsError from "@/exception/paramsError";
import ExpConstant from "@/constant/expConstant";
import ExpUtil from "@/util/expUtil";

class GroupService {
  /**
   * 创建一个群组
   * @param groupDto 创建群组需要的参数
   * @param uid 用户 ID
   */
  static async createGroup(groupDto: GroupDto, uid: number, roleId: number): Promise<void> {
    // 获取群组类型数字
    const level = GroupUtil.levelLetterToNumber(groupDto.level);
    // 判断用户是否有权限，如果没有权限，抛出权限异常
    // if (!GroupUtil.hasCreatePermission(roleId, level)) {
    //   throw new ForbiddenError('您没有权限创建该等级的群组');
    // }
    const db = await dbPromise;
    // 插入新群组
    const newGroup = await db.run(
      `INSERT INTO groups(
        name, description, masterId, status, humanCount,
        linkedChannel, qrCode, level, joinWay, createdAt, updatedAt
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )`,
      [
        groupDto.name,
        groupDto.description,
        uid,
        GroupConstant.ENABLED,
        0,
        groupDto.linkedChannel,
        '',
        GroupUtil.levelLetterToNumber(groupDto.level),
        GroupUtil.joinWayStrToNumber(groupDto.joinWay),
        Date.now(),
        Date.now()
      ]
    )
    // 获得刚刚插入群组的ID
    const groupId = newGroup.lastID as number;
    // 群组创建者一定要加入该群组
    await this.join(uid, groupId);
    // 创建关联行程
    await TourService.createTour(groupId, groupDto, uid);
  }

  /**
   * 某个用户加入某个群组
   * @param uid 用户 ID
   * @param groupId 群组 ID
   */
  static async join(uid: number, groupId: number, needCheck = true): Promise<void> {
    const db = await dbPromise;
    // 先检查是否有权限加入该群组
    if (needCheck && !await GroupUtil.hasJoinPermission(groupId)) {
      throw new ForbiddenError("该群组仅限邀请，您没有权限加入！");
    }
    if (!await GroupUtil.hasJoinedLinkedChannel(groupId, uid)) {
      throw new ForbiddenError("用户并不在当前频道中，无法加入该群组！");
    }
    // 插入用户加入群组的记录，如果之前已经加入过了，就更新 updatedAt
    await db.run(
      `INSERT INTO group_users (uid, groupId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(uid, groupId) DO UPDATE SET updatedAt = excluded.updatedAt`,
      [
        uid,
        groupId,
        Date.now(),
        Date.now()
      ]
    );
  }

  /**
   * 
   * @param uid 
   * @param roleId 
   * @param groupId 
   */
  static async addMemberToGroup(uid: number, roleId: number, memberId: number, groupId: number, linkedTourId: number): Promise<void> {
    if (!await GroupUtil.hasModifyPermission(uid, roleId, groupId)) {
      throw new ForbiddenError('您没有权限增加成员');
    }
    try {
      await UserService.getUserDetailByUid(memberId);
      await this.join(memberId, groupId, false);
      await TourService.join(memberId, linkedTourId);
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw new ParamsError('该用户不存在');
      } else {
        throw e;
      }
    }
  }

  /**
   * 
   * @param uid 
   * @param roleId 
   * @param groupId 
   */
  static async removeMemberFromGroup(uid: number, roleId: number, memberId: number, groupId: number, linkedTourId: number): Promise<void> {
    if (!await GroupUtil.hasModifyPermission(uid, roleId, groupId)) {
      throw new ForbiddenError('您没有权限删除成员');
    }
    await this.exit(memberId, groupId);
    await TourService.exit(memberId, linkedTourId);
  }

  /**
   * 转让某个群组
   * @param GroupTransferDto 转让需要的参数
   * @param uid 用户 ID
   */
  static async transfer(GroupTransferDto: GroupTransferDto, uid: number, roleId: number): Promise<void> {
    // 先判断是否有权限转让
    if (!await GroupUtil.hasTransferPermission(uid, roleId, GroupTransferDto.groupId)) {
      throw new ForbiddenError('您没有权限转让该群组');
    }
    // 更新数据库
    const db = await dbPromise;
    await db.run(
      `UPDATE groups SET masterId = ? WHERE groupId = ?`,
      [
        GroupTransferDto.masterId,
        GroupTransferDto.groupId
      ]
    )
  }

  /**
   * 退出该群组
   * @param uid 用户 ID
   * @param groupId 群组 ID
   */
  static async exit(uid: number, groupId: number): Promise<void> {
    if (!await GroupUtil.hasExitPermission(uid, groupId)) {
      throw new ForbiddenError('您是该群组的群主，请转让后再退出');
    }
    const db = await dbPromise;
    // 删除该用户的加入记录
    db.run(
      `DELETE FROM group_users
       WHERE uid = ? AND groupId = ?`,
      [uid, groupId]
    );
    // 删除该用户的管理员记录
    db.run(
      `DELETE FROM group_admins
       WHERE uid = ? AND groupId = ?`,
      [uid, groupId]
    );
    // 删除该用户的行程记录
    db.run(
      `DELETE FROM tour_users
       WHERE uid = ? AND tourId IN (
         SELECT tourId FROM tours WHERE linkedGroup = ?
        )
      `,
      [uid, groupId]
    );
  }

  /**
   * 获取某一群组的详情
   * @param groupId 群组 ID
   * @returns 
   */
  static async getDetailByGroupId(groupId: number): Promise<GroupDetailVo> {
    const db = await dbPromise;
    const row = await db.get<Partial<Group>>(
      `
      SELECT groupId, name, description, level, linkedChannel, qrCode,
        humanCount, joinWay, createdAt, updatedAt
      FROM groups
      WHERE groupId = ?
      `,
      [groupId]
    );
    if (!row) {
      throw new NotFoundError("该群组不存在");
    }
    return new GroupDetailVo({
      groupId: row.groupId,
      name: row.name,
      description: row.description,
      level: GroupUtil.levelNumberToLetter(row.level as number),
      linkedChannel: row.linkedChannel,
      qrCode: row.qrCode,
      humanCount: row.humanCount,
      joinWay: GroupUtil.joinWayNumberToStr(row.joinWay as number),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    })
  }

  /**
   * 获取用户加入的群组列表
   * @param uid 用户 ID
   * @returns 用户加入的群组列表
   */
  static async getJoinedGroupList(channelId: number, uid: number): Promise<GroupListVo[]> {
    const db = await dbPromise;
    const rows = channelId === -1 ? await db.all<Partial<Group>[]>(
      `
        SELECT groups.groupId, name, description, level, 
          joinWay, humanCount, groups.createdAt, groups.updatedAt
        FROM groups
        WHERE EXISTS (
          SELECT 1 FROM group_users 
          WHERE
            group_users.groupId = groups.groupId AND
            group_users.uid = ?
        )
        `,
      [uid]
    ) : await db.all<Partial<Group>[]>(
      `
      SELECT groups.groupId, name, description, level, 
        joinWay, humanCount, groups.createdAt, groups.updatedAt
      FROM groups
      WHERE groups.linkedChannel = ?
      AND EXISTS (
        SELECT 1 FROM group_users 
        WHERE
          group_users.groupId = groups.groupId AND
          group_users.uid = ?
      )
      `,
      [channelId, uid]
    );
    // 定义一个 VO 列表作为返回值
    const groupListVos = rows.map(row => ({
      ...row,
      level: GroupUtil.levelNumberToLetter(row.level as number),
      joinWay: GroupUtil.joinWayNumberToStr(row.joinWay as number)
    })) as GroupListVo[];
    // 返回结果
    return groupListVos;
  }

  /**
   * 获取用户没有参加过的群组列表
   * @param uid 用户 ID
   */
  static async getUnjoinedGroupList(channelId: number, uid: number): Promise<GroupListVo[]> {
    const db = await dbPromise;
    const rows = await db.all<Partial<Group>[]>(
      `
      SELECT groups.groupId, name, description, level, 
        joinWay, humanCount, groups.createdAt, groups.updatedAt
      FROM groups
      WHERE groups.linkedChannel = ?
      AND NOT EXISTS (
        SELECT 1 FROM group_users
        WHERE
          group_users.groupId = groups.groupId AND
          group_users.uid = ?
      )
      `,
      [channelId, uid]
    );
    // 定义一个 VO 列表作为返回值
    const groupListVos = rows.map(row => ({
      ...row,
      level: GroupUtil.levelNumberToLetter(row.level as number),
      joinWay: GroupUtil.joinWayNumberToStr(row.joinWay as number)
    })) as GroupListVo[];
    // 返回结果
    return groupListVos;
  }

  /**
   * 更新群组的基本信息
   * @param groupModifyDto 群组基本信息
   */
  static async modifyGroupInfo(groupModifyDto: GroupModifyDto, uid: number, roleId: number, groupId: number): Promise<void> {
    // 先检查是否有权限修改
    if (!await GroupUtil.hasModifyPermission(uid, roleId, groupId)) {
      throw new ForbiddenError('您没有权限修改该群组');
    }
    // 更新数据库
    const db = await dbPromise;
    await db.run(
      `UPDATE groups SET
       name = ?, description = ?, joinWay = ?
       WHERE groupId = ?`,
      [
        groupModifyDto.name,
        groupModifyDto.description,
        GroupUtil.joinWayStrToNumber(groupModifyDto.joinWay),
        groupId
      ]
    )
    // 找到关联的行程并修改行程名
    await db.run(
      `UPDATE tours SET name = ? WHERE linkedGroup = ?`,
      [
        groupModifyDto.name,
        groupId
      ]
    )
  }

  /**
   * 解散某个群组
   * @param uid 用户 ID
   * @param roleId 角色 ID
   * @param groupId 群组 ID
   */
  static async dissolveGroup(uid: number, roleId: number, groupId: number): Promise<void> {
    // 先判断是否有权限解散该群组
    if (!await GroupUtil.hasDissolvePermission(uid, roleId, groupId)) {
      throw new ForbiddenError('您没有权限解散该群组');
    }
    // 更新数据库
    const db = await dbPromise;
    await db.run(
      `DELETE FROM groups WHERE groupId = ?`,
      [groupId]
    )
  }

  /**
   * 
   * @param uid 
   * @param roleId 
   * @param groupId 
   */
  static async endGroupTour(uid: number, roleId: number, groupId: number, linkedTourId: number): Promise<void> {
    if (!await GroupUtil.hasDissolvePermission(uid, roleId, groupId)) {
      throw new ForbiddenError('您没有权限结束行程');
    }

    const db = await dbPromise;
    // 改成联合查询，用集合判断更新
    // 给群组中的成员加经验值,群主和管理员加80，普通成员加50
    // 查询群成员、群管理员和群主
    const groupMembers = await db.all(`SELECT uid FROM group_users WHERE groupId = ?`, [groupId]);
    const groupAdmins = await db.all(`SELECT uid FROM group_admins WHERE groupId = ?`, [groupId]);
    const groupOwner = await db.get(`SELECT masterId AS uid FROM groups WHERE groupId = ?`, [groupId]);

    // 将管理员和群主合并为一个集合（经验80）
    const adminOrOwnerSet = new Set(groupAdmins.map(row => row.uid));
    adminOrOwnerSet.add(groupOwner.uid);

    // 合并所有用户 uid
    const allUserIds = new Set([
      ...groupMembers.map(row => row.uid),
      ...adminOrOwnerSet
    ]);

    // 遍历更新经验值：管理员/群主加80，普通成员加50
    for (const uid of allUserIds) {
      const experience = adminOrOwnerSet.has(uid) ? ExpConstant.LEAD_TOUR : ExpConstant.END_TOUR;
      ExpUtil.add(uid, experience);
    }


    // 找到关联的行程并解除关联
    db.run(
      `UPDATE tours SET linkedGroup = NULL, status = 2 WHERE tourId = ?`,
      [linkedTourId]
    )

    db.run(
      `DELETE FROM groups WHERE groupId = ?`,
      [groupId]
    )
  }

  /**
   * 赋予某用户群组管理员身份
   * @param grantorId 授权者
   * @param granteeId 被授权者
   * @param groupId 群组 ID
   */
  static async grantAdministrator(
    grantorId: number,
    grantorRoleId: number,
    grantAdminDto: GroupGrantAdminDto,
  ): Promise<void> {
    // 获取参数
    const { granteeId, groupId } = grantAdminDto;
    // 只有群主和系统管理员有这个权限
    if (!await GroupUtil.hasGrantAdminstratorPermission(grantorId, grantorRoleId, groupId)) {
      throw new ForbiddenError("您没有权限授予其他成为群组管理员！");
    }
    // 在群组管理员表添加记录，如果之前添加过了，就更新 updatedAt 字段
    const db = await dbPromise;
    await db.run(
      `
        INSERT INTO group_admins (uid, groupId, createdAt, updatedAt)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(uid, groupId) DO UPDATE SET updatedAt = excluded.updatedAt
      `,
      [
        granteeId,
        groupId,
        Date.now(),
        Date.now()
      ]
    )
  }

  /**
   * 收回群组管理员权限
   * @param grantorId 授权者用户 ID
   * @param grantorRoleId 授权者角色 ID
   * @param grantAdminDto 授权需要的传参（被授权者和群组 ID）
   */
  static async revokeAdministrator(
    grantorId: number,
    grantorRoleId: number,
    grantAdminDto: GroupGrantAdminDto,
  ): Promise<void> {
    // 获取参数
    const { granteeId, groupId } = grantAdminDto;
    // 只有该群组的群主和系统管理员有这个权限
    if (!await GroupUtil.hasRevokeAdminstratorPermission(grantorId, grantorRoleId, groupId)) {
      throw new ForbiddenError("您没有权限收回其他用户群组管理员的身份！");
    }
    // 在 group_admins 中删除记录
    const db = await dbPromise;
    await db.run(
      `
        DELETE FROM group_admins
        WHERE uid = ? AND groupId = ?
      `,
      [
        granteeId,
        groupId
      ]
    )
  }

  /**
   * 
   * @param groupId 
   * @param uid 
   * @returns 
   */
  static async getUserAuthorityInGroup(groupId: number, uid: number): Promise<AuthorityVo> {
    const db = await dbPromise;
    const groupRow = await db.get<Partial<Group>>(
      `
      SELECT masterId
      FROM groups
      WHERE groupId = ?
      `,
      [groupId]
    )
    if (!groupRow) {
      throw new NotFoundError("该群组不存在");
    }
    const isOwner = groupRow.masterId === uid;
    const adminRows = await db.all<Partial<{ uid: number }>[]>(
      `
      SELECT uid FROM group_admins WHERE groupId = ?
      `,
      [groupId]
    );
    const isAdmin = isOwner || adminRows.some(row => row.uid === uid);
    return new AuthorityVo({ isOwner, isAdmin });
  }

  /**
   * 
   * @param groupId 
   * @returns 
   */
  static async getMembersInGroup(groupId: number): Promise<UserDetailVo[]> {
    const db = await dbPromise;
    // 获取群主
    const groupInfo = await db.get<Partial<{ masterId: number }>>(
      `SELECT masterId FROM groups WHERE groupId = ?`,
      [groupId]
    );
    if (!groupInfo) {
      throw new NotFoundError("群组不存在");
    }
    // 获取群管理员列表
    const adminRows = await db.all<Partial<{ uid: number }>[]>(
      `SELECT uid FROM group_admins WHERE groupId = ?`,
      [groupId]
    );
    const adminSet = new Set(adminRows.map(row => row.uid));
    // 查询群组成员
    const rows = await db.all<Partial<User>[]>(
      `
      SELECT uid, nickname, gender, avatarUrl, email,
      phone, signature, birthday, roleId
      FROM users
      WHERE EXISTS (
        SELECT 1 FROM group_users
        WHERE group_users.uid = users.uid AND groupId = ?
      )
      `,
      [groupId]
    );
    // 根据群主和管理员信息判断角色
    const memberList = rows.map(row => {
      let role: string;
      if (row.uid === groupInfo.masterId) {
        role = 'GROUP_OWNER';
      } else if (adminSet.has(row.uid!)) {
        role = 'GROUP_ADMIN';
      } else {
        role = RoleUtil.roleNumberToString(row.roleId as number);
      }
      return {
        uid: row.uid,
        nickname: row.nickname,
        gender: UserUtil.getGenderStr(row.gender),
        avatarUrl: row.avatarUrl,
        email: row.email,
        phone: row.phone,
        signature: row.signature,
        birthday: row.birthday,
        role
      } as UserDetailVo;
    });
    return memberList;
  }

  static async updateQrCode(base64: string, groupId: number): Promise<string> {
    // 上传新二维码到 COS
    const freshQrCodeUrl = await CosUtil.uploadBase64Picture(CosConstant.QRCODE_FOLDER, base64);
    // 获取旧的二维码地址
    const db = await dbPromise;
    const row = await db.get<Pick<Group, 'qrCode'>>(
      'SELECT qrCode FROM groups WHERE groupId = ?',
      [groupId]
    );
    if (!row) throw new NotFoundError(`群组 ${groupId} 不存在`);
    const oldQrCodeUrl = row.qrCode;
    // 更新数据库中的二维码 url
    await db.run(
      'UPDATE groups SET qrCode = ? WHERE groupId = ?',
      [freshQrCodeUrl, groupId]
    )
    // 异步删除 COS 上原来的头像，不影响主线程（没有await），较少IO时长（当旧头像地址不为空，且是合法的图片路径）
    if (typeof oldQrCodeUrl !== 'undefined' && CosUtil.isValidCosUrl(oldQrCodeUrl)) {
      CosUtil.deleteFile(oldQrCodeUrl)
    }
    // 返回新头像 url
    return freshQrCodeUrl;
  }
}

export default GroupService;