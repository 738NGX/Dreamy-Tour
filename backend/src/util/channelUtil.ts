/*
 * 频道相关工具类
 * @Author: Franctoryer 
 * @Date: 2025-03-08 20:31:05 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-09 19:27:20
 */

import dbPromise from "@/config/databaseConfig";
import ChannelConstant from "@/constant/channelConstant";
import MessageConstant from "@/constant/messageConstant";
import RoleConstant from "@/constant/RoleConstant";
import InternalError from "@/exception/internalError";


class ChannelUtil {
  /**
   * 判断该角色是否有权限创建该等级的频道
   * @param roleId 角色 ID
   * @param channelLevel 频道 ID
   * @returns 
   */
  static hasCreatePermission(roleId: number, channelLevel: number): boolean {
    // 角色与可创建频道等级的映射
    const createLevelMap: Map<number, number | null> = new Map([
      [RoleConstant.PASSENGER, null],
      [RoleConstant.SAILOR, ChannelConstant.LEVEL_C],         // 水手可创建 C 类       
      [RoleConstant.BOATSWAIN, ChannelConstant.LEVEL_C],      // 水手长可创建 C 类     
      [RoleConstant.CHIEF_ENGINEER, ChannelConstant.LEVEL_B], // 轮机长可创建 B 类及以上
      [RoleConstant.FIRST_MATE, ChannelConstant.LEVEL_B],     // 大副可创建 B 类及以上
      [RoleConstant.CAPTAIN, ChannelConstant.LEVEL_B],        // 船长可创建 B 类及以上
      [RoleConstant.EXPLORER, ChannelConstant.LEVEL_A],       // 探险家可创建 A 类及以上
      [RoleConstant.ADMIN, -Number.MAX_SAFE_INTEGER]          // 系统管理员可创建所有类型的频道
    ]);

    // 判断当前频道等级是否匹配允许创建的等级
    return (createLevelMap.get(roleId) ?? Number.MAX_SAFE_INTEGER)  <= channelLevel;
  }

  /**
   * 判断该用户是否有权限修改该频道
   * @param uid 
   * @param roleId 
   * @param channelId 
   */
  static async hasModifyPermission(uid: number, roleId: number, channelId: number): Promise<boolean> {
    // 只有该频道的频道主、频道管理员、系统管理员可以修改频道信息
    // 如果是系统管理员，返回 true
    if (roleId === RoleConstant.ADMIN) {
      return true;
    }
    // 如果是该频道的频道主或者频道管理员，返回 true（用联合查询介绍数据库查询次数）
    const db = await dbPromise;
    const exists = await db.get<number>(
      `SELECT 1 WHERE EXISTS (
        SELECT 1 FROM channels 
        WHERE channelId = ? AND masterId = ?
        UNION ALL
        SELECT 1 FROM channel_admins 
        WHERE channelId = ? AND uid = ?
      )`,
      [channelId, uid, channelId, uid]
    );

    return typeof exists !== 'undefined';
  }

   /**
   * 判断该用户是否有权限转让该频道
   * @param uid 用户 ID
   * @param roleId 角色 ID
   * @param channelId 频道 ID
   */
  static async hasTransferPermission(uid: number, roleId: number, channelId: number): Promise<boolean> {
    // 只有该频道的频道主和系统管理员可以转让该频道
    // 如果是系统管理员，返回 true
    if (roleId === RoleConstant.ADMIN) {
      return true;
    }
    // 如果是该频道的频道主，返回 true
    const db = await dbPromise;
    const row = await db.get<number>(
      `SELECT channelId FROM channels
       WHERE channelId = ? AND masterId = ?`,
      [
        channelId,
        uid
      ]
    )
    return typeof row !== 'undefined';  
  }

   /**
   * 判断该用户是否有权限解散该频道
   * @param uid 用户 ID
   * @param roleId 角色 ID
   * @param channelId 频道 ID
   */
  static async hasDissolvePermission(uid: number, roleId: number, channelId: number): Promise<boolean> {
    // 只有该频道的频道主和系统管理员可以解散该频道
    // 如果是系统管理员，返回 true
    if (roleId === RoleConstant.ADMIN) {
      return true;
    }
    // 如果是该频道的频道主，返回 true
    const db = await dbPromise;
    const row = await db.get<number>(
      `SELECT channelId FROM channels
       WHERE channelId = ? AND masterId = ?`,
      [
        channelId,
        uid
      ]
    )
    return typeof row !== 'undefined'; 
  }

  /**
   * 判断该用户是否有权限退出该频道
   * @param uid 用户 ID
   * @param channelId 频道 ID
   */
  static async hasExitPermission(uid: number, channelId: number) {
    // 如果该用户是频道主，没有权限退出频道；只有将频道主转让给别人后，才可以退出
    const db = await dbPromise;
    const row = await db.get<number>(
      `SELECT channelId FROM channels
       WHERE channelId = ? AND masterId = ?`,
      [
        channelId,
        uid
      ]
    )
    return typeof row === 'undefined';
  }

  /**
   * 频道类型字母转数字
   * @param levelLetter 频道类型字母
   * @returns 频道类型数字
   */
  static levelLetterToNumber(levelLetter: string): number {
    switch (levelLetter) {
      case 'S':
        return ChannelConstant.LEVEL_S;
      case 'A':
        return ChannelConstant.LEVEL_A;
      case 'B':
        return ChannelConstant.LEVEL_B;
      case 'C':
        return ChannelConstant.LEVEL_C;
      default:
        throw new InternalError(MessageConstant.NONEXISTENT_CHANNEL);
    }
  }

  /**
   * 频道类型数字转字母
   * @param levelNumber 频道类型数字
   * @returns 频道类型字母
   */
  static levelNumberToLetter(levelNumber: number): string {
    switch (levelNumber) {
      case ChannelConstant.LEVEL_S:
        return 'S';
      case ChannelConstant.LEVEL_A:
        return 'A';
      case ChannelConstant.LEVEL_B:
        return 'B';
      case ChannelConstant.LEVEL_C:
        return 'C';
      default:
        throw new InternalError(MessageConstant.NONEXISTENT_CHANNEL);
    }
  }

  /**
   * 通过频道等级（字母）获取对应的人数上限
   * @param level 频道等级字母
   */
  static getLimitByLevel(level: string): number;
  /**
   * 通过频道等级（数字）获取对应的人数上限
   * @param level 频道等级数字
   */
  static getLimitByLevel(level: number): number;

  static getLimitByLevel(level: any): number {
    if (typeof level === 'string') {
      switch (level) {
        case 'S':
          return ChannelConstant.LEVEL_S_LIMIT;
        case 'A':
          return ChannelConstant.LEVEL_A_LIMIT;
        case 'B':
          return ChannelConstant.LEVEL_B_LIMIT;
        case 'C':
          return ChannelConstant.LEVEL_C_LIMIT;
        default:
          throw new InternalError(MessageConstant.NONEXISTENT_CHANNEL);
      }
    } else if (typeof level === 'number') {
      switch (level) {
        case ChannelConstant.LEVEL_S:
          return ChannelConstant.LEVEL_S_LIMIT;
        case ChannelConstant.LEVEL_A:
          return ChannelConstant.LEVEL_A_LIMIT;
        case ChannelConstant.LEVEL_B:
          return ChannelConstant.LEVEL_B_LIMIT;
        case ChannelConstant.LEVEL_C:
          return ChannelConstant.LEVEL_C_LIMIT;
        default:
          throw new InternalError(MessageConstant.NONEXISTENT_CHANNEL);
      }
    } else {
      throw new InternalError(MessageConstant.NONEXISTENT_CHANNEL);
    }
  }
}

export default ChannelUtil;