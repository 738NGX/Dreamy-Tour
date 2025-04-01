/*
 * 频道相关业务
 * @Author: Franctoryer 
 * @Date: 2025-03-08 20:09:17 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-30 01:48:26
 */
import dbPromise from "@/config/databaseConfig";
import ChannelConstant from "@/constant/channelConstant";
import ChannelDto from "@/dto/channel/channelDto";
import ChannelModifyDto from "@/dto/channel/channelModifyDto";
import ChannelTransferDto from "@/dto/channel/channelTransferDto";
import ChannelGrantAdminDto from "@/dto/channel/channelGrantAdminDto";
import Channel from "@/entity/channel";
import User from "@/entity/user";
import ForbiddenError from "@/exception/forbiddenError";
import NotFoundError from "@/exception/notFoundError";
import ParamsError from "@/exception/paramsError";
import ChannelUtil from "@/util/channelUtil";
import JwtUtil from "@/util/jwtUtil";
import RoleUtil from "@/util/roleUtil";
import { UserUtil } from "@/util/userUtil";
import ChannelDetailVo from "@/vo/channel/channelDetailVo";
import ChannelListVo from "@/vo/channel/channelListVo";
import PostDetailVo from "@/vo/post/postDetailVo";
import AuthorityVo from "@/vo/user/authorityVo";
import UserDetailVo from "@/vo/user/userDetailVo";


class ChannelService {
  /**
   * 创建一个频道
   * @param ChannelDto 创建频道需要的参数
   * @param uid 用户 ID
   */
  static async createChannel(channelDto: ChannelDto, uid: number, roleId: number): Promise<void> {
    // 获取频道类型数字
    const level = ChannelUtil.levelLetterToNumber(channelDto.level);
    // 判断用户是否有权限，如果没有权限，抛出权限异常
    // if (!ChannelUtil.hasCreatePermission(roleId, level)) {
    //   throw new ForbiddenError('您没有权限创建该等级的频道');
    // }
    const db = await dbPromise;
    // 插入新频道
    const newChannel = await db.run(
      `INSERT INTO channels(
        name, description, masterId, status, 
        humanCount, level, joinWay, createdAt, updatedAt
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?
      )`,
      [
        channelDto.name,
        channelDto.description,
        uid,
        ChannelConstant.ENABLED,
        0,
        ChannelUtil.levelLetterToNumber(channelDto.level),
        ChannelUtil.joinWayStrToNumber(channelDto.joinWay),
        Date.now(),
        Date.now()
      ]
    )
    // 频道创建者一定要加入该频道
    await this.join(uid, newChannel.lastID as number)
  }

  /**
   * 某个用户加入某个频道
   * @param uid 用户 ID
   * @param channelId 频道 ID
   */
  static async join(uid: number, channelId: number, needCheck = true): Promise<void> {
    const db = await dbPromise;
    // 先检查是否有权限加入该频道
    if (needCheck && !await ChannelUtil.hasJoinPermission(channelId)) {
      throw new ForbiddenError("该频道仅限邀请，您没有权限加入！");
    }
    // 插入用户加入频道的记录，如果之前已经加入过了，就更新 updatedAt
    await db.run(
      `INSERT INTO channel_users (uid, channelId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(uid, channelId) DO UPDATE SET updatedAt = excluded.updatedAt`,
      [
        uid,
        channelId,
        Date.now(),
        Date.now()
      ]
    );
  }

  /**
   * 获取某一频道的详情
   * @param channelId 频道 ID
   * @returns 
   */
  static async getDetailByChannelId(channelId: number): Promise<ChannelDetailVo> {
    const db = await dbPromise;
    const row = await db.get<Partial<Channel>>(
      `
      SELECT channelId, name, description, level,
        humanCount, joinWay, createdAt, updatedAt
      FROM channels
      WHERE channelId = ?
      `,
      [channelId]
    );
    if (!row) {
      throw new NotFoundError("该频道不存在");
    }
    return new ChannelDetailVo({
      channelId: row.channelId,
      name: row.name,
      description: row.description,
      level: ChannelUtil.levelNumberToLetter(row.level as number),
      humanCount: row.humanCount,
      joinWay: ChannelUtil.joinWayNumberToStr(row.joinWay as number),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    })
  }

  /**
   * 获取世界频道详情
   * @returns 
   */
  static async getWorldChannelDetail(): Promise<ChannelDetailVo> {
    return await this.getDetailByChannelId(ChannelConstant.WORLD_CHANNEL_ID);
  }

  /**
   * 
   * @param uid 
   * @param roleId 
   * @param channelId 
   */
  static async addMemberToChannel(uid: number, roleId: number, memberId: number, channelId: number): Promise<void> {
    if (!await ChannelUtil.hasModifyPermission(uid, roleId, channelId)) {
      throw new ForbiddenError('您没有权限增加成员');
    }
    await this.join(memberId, channelId, false);
  }

  /**
   * 
   * @param uid 
   * @param roleId 
   * @param channelId 
   */
  static async removeMemberFromChannel(uid: number, roleId: number, memberId: number, channelId: number): Promise<void> {
    if (!await ChannelUtil.hasModifyPermission(uid, roleId, channelId)) {
      throw new ForbiddenError('您没有权限删除成员');
    }
    await this.exit(memberId, channelId);
  }

  /**
   * 转让某个频道
   * @param ChannelTransferDto 转让需要的参数
   * @param uid 用户 ID
   */
  static async transfer(ChannelTransferDto: ChannelTransferDto, uid: number, roleId: number): Promise<void> {
    // 先判断是否有权限转让
    if (!await ChannelUtil.hasTransferPermission(uid, roleId, ChannelTransferDto.channelId)) {
      throw new ForbiddenError('您没有权限转让该频道');
    }
    // 更新数据库
    const db = await dbPromise;
    await db.run(
      `UPDATE channels SET masterId = ? WHERE channelId = ?`,
      [
        ChannelTransferDto.masterId,
        ChannelTransferDto.channelId
      ]
    )
  }

  /**
   * 退出该频道
   * @param uid 用户 ID
   * @param channelId 频道 ID
   */
  static async exit(uid: number, channelId: number): Promise<void> {
    if (!await ChannelUtil.hasExitPermission(uid, channelId)) {
      throw new ForbiddenError('您是该频道的频道主，请转让后再退出');
    }
    const db = await dbPromise;
    // 删除该用户的加入记录
    await db.run(
      `DELETE FROM channel_users
       WHERE uid = ? AND channelId = ?`,
      [uid, channelId]
    );
  }

  /**
   * 获取用户加入的频道列表
   * @param uid 用户 ID
   * @returns 用户加入的频道列表
   */
  static async getJoinedChannelList(uid: number): Promise<ChannelListVo[]> {
    const db = await dbPromise;
    // 使用 EXISTS 代替 JOIN，性能更好
    const rows = await db.all<Partial<Channel>[]>(
      `
      SELECT channels.channelId, name, description, level, 
        joinWay, humanCount, channels.createdAt, channels.updatedAt
      FROM channels
      WHERE EXISTS (
        SELECT 1 FROM channel_users 
        WHERE
          channels.channelId <> 1 AND
          channel_users.channelId = channels.channelId AND
          channel_users.uid = ?
      )
      `,
      [uid]
    );
    // 定义一个 VO 列表作为返回值
    const channelListVos = rows.map(row => ({
      ...row,
      level: ChannelUtil.levelNumberToLetter(row.level as number),
      joinWay: ChannelUtil.joinWayNumberToStr(row.joinWay as number)
    })) as ChannelListVo[];
    // 返回结果
    return channelListVos;
  }

  /**
   * 获取用户没有参加过的频道列表
   * @param uid 用户 ID
   */
  static async getUnjoinedChannelList(uid: number): Promise<ChannelListVo[]> {
    const db = await dbPromise;
    const rows = await db.all<Partial<Channel>[]>(
      `
      SELECT channels.channelId, name, description, level, 
        joinWay, humanCount, channels.createdAt, channels.updatedAt
      FROM channels
      WHERE NOT EXISTS (
        SELECT 1 FROM channel_users
        WHERE
          channel_users.channelId = channels.channelId AND
          channel_users.uid = ?
      )
      `,
      [uid]
    );
    // 定义一个 VO 列表作为返回值
    const channelListVos = rows.map(row => ({
      ...row,
      level: ChannelUtil.levelNumberToLetter(row.level as number),
      joinWay: ChannelUtil.joinWayNumberToStr(row.joinWay as number)
    })) as ChannelListVo[];
    // 返回结果
    return channelListVos;
  }

  /**
   * 获取所有的帖子列表
   * @return 所有的帖子列表
   */
  static async getChannelList(): Promise<ChannelListVo[]> {
    const db = await dbPromise;
    const rows = await db.all<Partial<Channel>[]>(
      `
      SELECT channelId, name, description, level, 
        joinWay, humanCount, createdAt, updatedAt
      FROM channels
      `
    );
    // 定义一个 VO 列表作为返回值
    const channelListVos = rows.map(row => ({
      ...row,
      level: ChannelUtil.levelNumberToLetter(row.level as number),
      joinWay: ChannelUtil.joinWayNumberToStr(row.joinWay as number)
    })) as ChannelListVo[];
    // 返回结果
    return channelListVos;
  }

  /**
   * 更新频道的基本信息
   * @param channelDto 频道基本信息
   */
  static async modifyChannelInfo(channelModifyDto: ChannelModifyDto, uid: number, roleId: number, channelId: number): Promise<void> {
    // 先检查是否有权限修改
    if (!await ChannelUtil.hasModifyPermission(uid, roleId, channelId)) {
      throw new ForbiddenError('您没有权限修改该频道');
    }
    // 更新数据库
    const db = await dbPromise;
    await db.run(
      `UPDATE channels SET
       name = ?, description = ?, joinWay = ?
       WHERE channelId = ?`,
      [
        channelModifyDto.name,
        channelModifyDto.description,
        ChannelUtil.joinWayStrToNumber(channelModifyDto.joinWay),
        channelId
      ]
    )
  }

  /**
   * 解散某个频道
   * @param uid 用户 ID
   * @param roleId 角色 ID
   * @param channelId 频道 ID
   */
  static async dissolveChannel(uid: number, roleId: number, channelId: number) {
    // 先判断是否有权限解散该频道
    if (!await ChannelUtil.hasDissolvePermission(uid, roleId, channelId)) {
      throw new ForbiddenError('您没有权限解散该频道');
    }
    // 更新数据库
    const db = await dbPromise;
    await db.run(
      `DELETE FROM channels WHERE channelId = ?`,
      [channelId]
    )
  }

  /**
   * 赋予某用户频道管理员身份
   * @param grantorId 授权者
   * @param granteeId 被授权者
   * @param channelId 频道 ID
   */
  static async grantAdministrator(
    grantorId: number,
    grantorRoleId: number,
    grantAdminDto: ChannelGrantAdminDto,
  ): Promise<void> {
    // 获取参数
    const { granteeId, channelId } = grantAdminDto;
    // 只有频道主和系统管理员有这个权限
    if (!await ChannelUtil.hasGrantAdminstratorPermission(grantorId, grantorRoleId, channelId)) {
      throw new ForbiddenError("您没有权限授予其他成为用户频道管理员！");
    }
    // 在频道管理员表添加记录，如果之前添加过了，就更新 updated_at 字段
    const db = await dbPromise;
    await db.run(
      `
        INSERT INTO channel_admins (uid, channelId, createdAt, updatedAt)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(uid, channelId) DO UPDATE SET updatedAt = excluded.updatedAt
      `,
      [
        granteeId,
        channelId,
        Date.now(),
        Date.now()
      ]
    )
  }

  /**
   * 收回频道管理员权限
   * @param grantorId 授权者用户 ID
   * @param grantorRoleId 授权者角色 ID
   * @param grantAdminDto 授权需要的传参（被授权者和频道 ID）
   */
  static async revokeAdministrator(
    grantorId: number,
    grantorRoleId: number,
    grantAdminDto: ChannelGrantAdminDto,
  ): Promise<void> {
    // 获取参数
    const { granteeId, channelId } = grantAdminDto;
    // 只有该频道的频道主和系统管理员有这个权限
    if (!await ChannelUtil.hasRevokeAdminstratorPermission(grantorId, grantorRoleId, channelId)) {
      throw new ForbiddenError("您没有权限授予收回其他用户频道管理员的身份！");
    }
    // 在 channel_admins 中删除记录
    const db = await dbPromise;
    await db.run(
      `
        DELETE FROM channel_admins
        WHERE uid = ? AND channelId = ?
      `,
      [
        granteeId,
        channelId
      ]
    )
  }

  static async getUserAuthorityInChannel(channelId: number, uid: number): Promise<AuthorityVo> {
    const db = await dbPromise;
    const channelRow = await db.get<Partial<Channel>>(
      `
      SELECT masterId
      FROM channels
      WHERE channelId = ?
      `,
      [channelId]
    );
    if (!channelRow) {
      throw new NotFoundError("该频道不存在");
    }
    const isOwner = channelRow.masterId === uid;
    const adminRows = await db.all<Partial<{ uid: number }>[]>(
      `
      SELECT uid FROM channel_admins WHERE channelId = ?
      `,
      [channelId]
    );
    const isAdmin = isOwner || adminRows.some(row => row.uid === uid);
    return new AuthorityVo({ isOwner, isAdmin });
  }

  static async getMembersInChannel(channelId: number): Promise<UserDetailVo[]> {
    const db = await dbPromise;
    // 获取频道主
    const channelInfo = await db.get<Partial<{ masterId: number }>>(
      `SELECT masterId FROM channels WHERE channelId = ?`,
      [channelId]
    );
    if (!channelInfo) {
      throw new NotFoundError("频道不存在");
    }
    // 获取频道管理员列表
    const adminRows = await db.all<Partial<{ uid: number }>[]>(
      `SELECT uid FROM channel_admins WHERE channelId = ?`,
      [channelId]
    );
    const adminSet = new Set(adminRows.map(row => row.uid));
    // 查询频道成员
    const rows = await db.all<Partial<User>[]>(
      `
      SELECT uid, nickname, gender, avatarUrl, email,
      phone, signature, birthday, roleId
      FROM users
      WHERE EXISTS (
        SELECT 1 FROM channel_users
        WHERE channel_users.uid = users.uid AND channelId = ?
      )
      `,
      [channelId]
    );
    // 根据频道主和管理员信息判断角色
    const memberList = rows.map(row => {
      let role: string;
      if (row.uid === channelInfo.masterId) {
        role = 'CHANNEL_OWNER';
      } else if (adminSet.has(row.uid!)) {
        role = 'CHANNEL_ADMIN';
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
}

export default ChannelService;