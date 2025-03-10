/*
 * 频道相关业务
 * @Author: Franctoryer 
 * @Date: 2025-03-08 20:09:17 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-09 19:53:48
 */
import dbPromise from "@/config/databaseConfig";
import ChannelConstant from "@/constant/channelConstant";
import ChannelDto from "@/dto/channel/channelDto";
import ChannelModifyDto from "@/dto/channel/channelModifyDto";
import ChannelTransferDto from "@/dto/channel/channelTransferDto";
import Channel from "@/entity/channel";
import ForbiddenError from "@/exception/forbiddenError";
import ChannelUtil from "@/util/channelUtil";
import ChannelListVo from "@/vo/channel/channelListVo";


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
    if (!ChannelUtil.hasCreatePermission(roleId, level)) {
      throw new ForbiddenError('您没有权限创建该等级的频道');
    }
    const db = await dbPromise;
    // 插入新频道
    const newChannel = await db.run(
      `INSERT INTO channels(
        name, description, uid, status, 
        humanCount, level, createdAt, updatedAt
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ? 
      )`,
      [
        channelDto.name,
        channelDto.description,
        uid,
        ChannelConstant.ENABLED,
        0,
        ChannelUtil.levelLetterToNumber(channelDto.level),
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
  static async join(uid: number, channelId: number): Promise<void> {
    const db = await dbPromise;
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
      `UPDATE channels SET uid = ? WHERE channelId = ?`,
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
    const rows = await db.all<Partial<Channel>[]>(
      `SELECT channels.channelId, name, description, level, 
       humanCount, channels.createdAt, channels.updatedAt
       FROM channels
       JOIN channel_users ON channels.channelId = channel_users.channelId
       WHERE channel_users.uid = ?`,
      [uid]
    );
    // 定义一个 VO 列表作为返回值
    const channelListVos = rows.map(row => ({
      ...row,
      level: ChannelUtil.levelNumberToLetter(row.level as number)
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
      `SELECT channelId, name, description, level, 
       humanCount, createdAt, updatedAt
       FROM channels`
    );
    // 定义一个 VO 列表作为返回值
    const channelListVos = rows.map(row => ({
      ...row,
      level: ChannelUtil.levelNumberToLetter(row.level as number)
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
       name = ?, description = ?
       WHERE channelId = ?`,
      [
        channelModifyDto.name,
        channelModifyDto.description,
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
}

export default ChannelService;