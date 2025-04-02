import dbPromise from "@/config/databaseConfig";
import GroupConstant from "@/constant/groupConstant";
import MessageConstant from "@/constant/messageConstant";
import RoleConstant from "@/constant/RoleConstant";
import InternalError from "@/exception/internalError";
import NotFoundError from "@/exception/notFoundError";
import ParamsError from "@/exception/paramsError";


class GroupUtil {
  /**
   * 判断该角色是否有权限创建该等级的群组
   * @param roleId 角色 ID
   * @param groupLevel 群组 ID
   * @returns 
   */
  static hasCreatePermission(roleId: number, groupLevel: number): boolean {
    // 角色与可创建群组等级的映射
    const createLevelMap: Map<number, number | null> = new Map([
      [RoleConstant.PASSENGER, null],
      [RoleConstant.SAILOR, GroupConstant.LEVEL_C],         // 水手可创建 C 类       
      [RoleConstant.BOATSWAIN, GroupConstant.LEVEL_C],      // 水手长可创建 C 类     
      [RoleConstant.CHIEF_ENGINEER, GroupConstant.LEVEL_B], // 轮机长可创建 B 类及以上
      [RoleConstant.FIRST_MATE, GroupConstant.LEVEL_B],     // 大副可创建 B 类及以上
      [RoleConstant.CAPTAIN, GroupConstant.LEVEL_B],        // 船长可创建 B 类及以上
      [RoleConstant.EXPLORER, GroupConstant.LEVEL_A],       // 探险家可创建 A 类及以上
      [RoleConstant.ADMIN, -Number.MAX_SAFE_INTEGER]          // 系统管理员可创建所有类型的群组
    ]);

    // 判断当前群组等级是否匹配允许创建的等级
    return (createLevelMap.get(roleId) ?? Number.MAX_SAFE_INTEGER)  <= groupLevel;
  }

  /**
   * 判断该用户是否有权限修改该群组
   * @param uid 
   * @param roleId 
   * @param groupId 
   */
  static async hasModifyPermission(uid: number, roleId: number, groupId: number): Promise<boolean> {
    // 只有该群组的群组主、群组管理员、系统管理员可以修改群组信息
    // 如果是系统管理员，返回 true
    if (roleId === RoleConstant.ADMIN) {
      return true;
    }
    // 如果是该群组的群组主或者群组管理员，返回 true（用联合查询介绍数据库查询次数）
    const db = await dbPromise;
    const exists = await db.get<{ _: number }>(
      `SELECT 1 WHERE EXISTS (
        SELECT 1 FROM groups 
        WHERE groupId = ? AND masterId = ?
        UNION ALL
        SELECT 1 FROM group_admins 
        WHERE groupId = ? AND uid = ?
      )`,
      [groupId, uid, groupId, uid]
    );

    return typeof exists !== 'undefined';
  }

   /**
   * 判断该用户是否有权限转让该群组
   * @param uid 用户 ID
   * @param roleId 角色 ID
   * @param groupId 群组 ID
   */
  static async hasTransferPermission(uid: number, roleId: number, groupId: number): Promise<boolean> {
    // 只有该群组的群组主和系统管理员可以转让该群组
    // 如果是系统管理员，返回 true
    if (roleId === RoleConstant.ADMIN) {
      return true;
    }
    // 如果是该群组的群组主，返回 true
    const db = await dbPromise;
    const row = await db.get<number>(
      `SELECT groupId FROM groups
       WHERE groupId = ? AND masterId = ?`,
      [
        groupId,
        uid
      ]
    )
    return typeof row !== 'undefined';  
  }

   /**
   * 判断该用户是否有权限解散该群组
   * @param uid 用户 ID
   * @param roleId 角色 ID
   * @param groupId 群组 ID
   */
  static async hasDissolvePermission(uid: number, roleId: number, groupId: number): Promise<boolean> {
    // 只有该群组的群组主和系统管理员可以解散该群组
    // 如果是系统管理员，返回 true
    if (roleId === RoleConstant.ADMIN) {
      return true;
    }
    // 如果是该群组的群组主，返回 true
    const db = await dbPromise;
    const row = await db.get<{ _: number }>(
      `SELECT groupId FROM groups
       WHERE groupId = ? AND masterId = ?`,
      [
        groupId,
        uid
      ]
    )
    return typeof row !== 'undefined'; 
  }

  /**
   * 判断该用户是否有权限退出该群组
   * @param uid 用户 ID
   * @param groupId 群组 ID
   */
  static async hasExitPermission(uid: number, groupId: number) {
    // 如果该用户是群组主，没有权限退出群组；只有将群组主转让给别人后，才可以退出
    const db = await dbPromise;
    const row = await db.get<{ _: number }>(
      `SELECT groupId FROM groups
       WHERE groupId = ? AND masterId = ?`,
      [
        groupId,
        uid
      ]
    )
    return typeof row === 'undefined';
  }

  /**
   * 判断该用户是否有权限授予其他用户群组管理员的身份
   * @param grantorId 授权者 ID
   * @param grantorRoleId 授权者角色 ID
   * @param groupId 群组 ID
   */
  static async hasGrantAdminstratorPermission(
    grantorId: number, 
    grantorRoleId: number, 
    groupId: number,
  ): Promise<boolean> {
    // 只有该群组的群组主和系统管理员可以授权其他用户成为群组管理员
    if (grantorRoleId === RoleConstant.ADMIN) {
      return true;
    }
    const db = await dbPromise;
    const exists = await db.get<{ _: number }>(
      `SELECT 1 WHERE EXISTS (
        SELECT 1 FROM groups 
        WHERE groupId = ? AND masterId = ?
        UNION ALL
        SELECT 1 FROM group_admins 
        WHERE groupId = ? AND uid = ?
      )`,
      [groupId, grantorId, groupId, grantorId]
    );

    return typeof exists !== 'undefined';
  }

   /**
   * 判断该用户是否有权限收回其他用户群组管理员的身份
   * @param grantorId 授权者 ID
   * @param grantorRoleId 授权者角色 ID
   * @param groupId 群组 ID
   */
   static async hasRevokeAdminstratorPermission(
    grantorId: number, 
    grantorRoleId: number, 
    groupId: number,
  ): Promise<boolean> {
    // 只有该群组的群组主和系统管理员可以授权其他用户成为群组管理员
    if (grantorRoleId === RoleConstant.ADMIN) {
      return true;
    }
    const db = await dbPromise;
    const exists = await db.get<{ _: number }>(
      `SELECT 1 WHERE EXISTS (
        SELECT 1 FROM groups 
        WHERE groupId = ? AND masterId = ?
        UNION ALL
        SELECT 1 FROM group_admins 
        WHERE groupId = ? AND uid = ?
      )`,
      [groupId, grantorId, groupId, grantorId]
    );

    return typeof exists !== 'undefined';
  }

  /**
   * 检查是否有加入该群组的权限
   * @param groupId 群组 ID
   * @returns 
   */
  static async hasJoinPermission(
    groupId: number
  ): Promise<boolean> {
    const db = await dbPromise;
    const row = await db.get<{ joinWay: number }>(
      `
      SELECT joinWay FROM groups WHERE groupId = ?
      `,
      [groupId]
    )
    if (!row) {
      throw new NotFoundError("该群组不存在！");
    }
    // 检查加入方式是否是free
    return row.joinWay === GroupConstant.JOINWAY_FREE;
  }

  static async hasJoinedLinkedChannel(groupId: number, uid: number): Promise<boolean> {
    const db = await dbPromise;
    const row = await db.get<{ _: number }>(
      `SELECT 1
       FROM channel_users
       WHERE channelId = (
       SELECT linkedChannel FROM groups WHERE groupId = ?
       )
       AND uid = ?`,
      [groupId, uid]
    );
    return typeof row !== 'undefined';
  }

  /**
   * 群组类型字母转数字
   * @param levelLetter 群组类型字母
   * @returns 群组类型数字
   */
  static levelLetterToNumber(levelLetter: string): number {
    switch (levelLetter) {
      case 'A':
        return GroupConstant.LEVEL_A;
      case 'B':
        return GroupConstant.LEVEL_B;
      case 'C':
        return GroupConstant.LEVEL_C;
      default:
        throw new InternalError(MessageConstant.NONEXISTENT_CHANNEL);
    }
  }

  /**
   * 群组类型数字转字母
   * @param levelNumber 群组类型数字
   * @returns 群组类型字母
   */
  static levelNumberToLetter(levelNumber: number): string {
    switch (levelNumber) {
      case GroupConstant.LEVEL_A:
        return 'A';
      case GroupConstant.LEVEL_B:
        return 'B';
      case GroupConstant.LEVEL_C:
        return 'C';
      default:
        throw new InternalError(MessageConstant.NONEXISTENT_CHANNEL);
    }
  }

  /**
   * 通过群组等级（字母）获取对应的人数上限
   * @param level 群组等级字母
   */
  static getLimitByLevel(level: string): number;
  /**
   * 通过群组等级（数字）获取对应的人数上限
   * @param level 群组等级数字
   */
  static getLimitByLevel(level: number): number;

  static getLimitByLevel(level: any): number {
    if (typeof level === 'string') {
      switch (level) {
        case 'A':
          return GroupConstant.LEVEL_A_LIMIT;
        case 'B':
          return GroupConstant.LEVEL_B_LIMIT;
        case 'C':
          return GroupConstant.LEVEL_C_LIMIT;
        default:
          throw new InternalError(MessageConstant.NONEXISTENT_CHANNEL);
      }
    } else if (typeof level === 'number') {
      switch (level) {
        case GroupConstant.LEVEL_A:
          return GroupConstant.LEVEL_A_LIMIT;
        case GroupConstant.LEVEL_B:
          return GroupConstant.LEVEL_B_LIMIT;
        case GroupConstant.LEVEL_C:
          return GroupConstant.LEVEL_C_LIMIT;
        default:
          throw new InternalError(MessageConstant.NONEXISTENT_CHANNEL);
      }
    } else {
      throw new InternalError(MessageConstant.NONEXISTENT_CHANNEL);
    }
  }

  /**
   * 将加入方式的数字转成字符串
   * @param joinWay 加入方式
   */
  static joinWayNumberToStr(joinWay: number): string {
    switch(joinWay) {
      case 0:
        return "FREE";
      case 1:
        return "INVITE";
      default:
        throw new ParamsError("该加入方式不存在！");
    }
  }

  /**
   * 将加入方式的字符串转成数字
   * @param joinWay 加入方式
   */
  static joinWayStrToNumber(joinWay: string): number {
    switch(joinWay.toUpperCase()) {
      case "FREE":
        return GroupConstant.JOINWAY_FREE;
      case "INVITE":
        return GroupConstant.JOINWAY_INVITE;
      default:
        throw new ParamsError("该加入方式不存在");
    }
  }
}

export default GroupUtil;