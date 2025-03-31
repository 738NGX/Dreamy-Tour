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
  static async join(uid: number, groupId: number): Promise<void> {
    const db = await dbPromise;
    // 先检查是否有权限加入该群组
    if (!await GroupUtil.hasJoinPermission(groupId)) {
      throw new ForbiddenError("该群组仅限邀请，您没有权限加入！");
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
    // 使用 EXISTS 代替 JOIN，性能更好
    const rows = await db.all<Partial<Group>[]>(
      `
      SELECT groups.groupId, name, description, level, 
        joinWay, humanCount, groups.createdAt, groups.updatedAt
      FROM groups
      WHERE EXISTS (
        SELECT 1 FROM group_users 
        WHERE
          group_users.groupId = groups.groupId AND
          group_users.uid = ? AND 
          groups.linkedChannel = ?
      )
      `,
      [uid, channelId]
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
      WHERE NOT EXISTS (
        SELECT 1 FROM group_users
        WHERE
          group_users.groupId = groups.groupId AND
          group_users.uid = ? AND 
          groups.linkedChannel = ?
      )
      `,
      [uid, channelId]
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
}

export default GroupService;