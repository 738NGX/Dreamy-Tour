import dbPromise from "@/config/databaseConfig";
import ChannelConstant from "@/constant/channelConstant";
import RoleConstant from "@/constant/RoleConstant";
import ParamsError from "@/exception/paramsError";

/*
 * 帖子相关的工具类
 * @Author: Franctoryer 
 * @Date: 2025-03-29 14:15:57 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-29 15:37:01
 */
class PostUtil {
  /**
   * 判断是否有权限置顶该帖子
   * @param uid 用户 ID
   * @param roleId 角色 ID
   * @param postId 帖子 ID
   */
  static async hasTopPermission(
    uid: number, roleId: number, postId: number
  ): Promise<boolean> {
    // 系统管理员一定可以置顶
    if (roleId === RoleConstant.ADMIN) {
      return true;
    }
    // 频道管理员和频道主也可以
    // 查询帖子所在的频道
    const db = await dbPromise;
    const row = await db.get<{ channelId: number }>(
      `
      SELECT channelId FROM posts
      WHERE postId = ?
      `,
      [postId]
    )
    if (!row) {
      throw new ParamsError("该帖子不存在")
    }
    // 判断该用户是否是该频道的频道主或者频道管理员
    const exists = await db.get<{ _: number }>(
      `SELECT 1 WHERE EXISTS (
        SELECT 1 FROM channels 
        WHERE channelId = ? AND masterId = ?
        UNION ALL
        SELECT 1 FROM channel_admins 
        WHERE channelId = ? AND uid = ?
      )`,
      [row.channelId, uid, row.channelId, uid]
    );

    return typeof exists !== 'undefined';
  }

  /**
   * 判断是否有权限删除帖子
   * 只有该帖子的发帖者、系统管理员、频道主、频道管理员可以删除帖子
   * @param uid 用户 ID
   * @param roleId 角色 ID
   * @param postId 帖子 ID
   * @returns 
   */
  static async hasDeletePermission(
    uid: number, roleId: number, postId: number
  ): Promise<boolean> {
    // 系统管理员一定可以删除
    if (roleId === RoleConstant.ADMIN) {
      return true;
    }
    const db = await dbPromise;
    // 查询帖子所在的频道
    const row = await db.get<{ channelId: number; uid: number }>(
      `
      SELECT channelId, uid FROM posts
      WHERE postId = ?
      `,
      [postId]
    )
    if (!row) {
      throw new ParamsError("该帖子不存在")
    }
    // 判断该用户是不是发帖者
    if (uid === row.uid) {
      return true;
    }
    // 判断该用户是否是该频道的频道主或者频道管理员
    const exists = await db.get<{ _: number }>(
      `SELECT 1 WHERE EXISTS (
        SELECT 1 FROM channels 
        WHERE channelId = ? AND masterId = ?
        UNION ALL
        SELECT 1 FROM channel_admins 
        WHERE channelId = ? AND uid = ?
      )`,
      [row.channelId, uid, row.channelId, uid]
    );

    return typeof exists !== 'undefined';
  }

  /**
   * 是否有权限发布帖子
   * @param uid 用户 ID
   * @param channelId 频道 ID
   */
  static async hasPublishPermission(
    uid: number, channelId: number
  ): Promise<boolean> {
    // 世界频道都可以发
    if (channelId === ChannelConstant.WORLD_CHANNEL_ID) {
      return true;
    }
    // 查询用户是否已经加入该频道
    const db = await dbPromise;
    const exists = await db.get<{ _: any }>(
      `
      SELECT 1 FROM channel_users
      WHERE channelId = ? AND uid = ?
      `,
      [
        channelId,
        uid
      ]
    )
    return typeof exists !== 'undefined';
  }
}

export default PostUtil;