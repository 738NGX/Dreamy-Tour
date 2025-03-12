/*
 * 频道的实体类
 * @Author: Franctoryer 
 * @Date: 2025-03-08 15:08:10 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-08 15:31:23
 */

class Channel {
  // 频道 ID
  channelId: number

  // 频道名称
  name: string

  // 频道描述
  description: string

  // 频道主 ID
  masterId: number

  // 频道管理员 ID（每个用逗号隔开）
  adminIds: string

  // 频道状态
  status: number

  // 频道内的人数
  humanCount: number

  // 频道等级：A类频道（上限3000人）；B类频道（上限500人）；C类频道（上限100人）
  level: number

  // 创建时间
  createdAt: number

  // 更新时间
  updatedAt: number
}

export default Channel;