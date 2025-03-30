/*
 * 频道详情展示的数据
 * @Author: Franctoryer 
 * @Date: 2025-03-30 01:33:11 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-30 01:34:54
 */
import VO from "@/base/vo";

class ChannelDetailVo extends VO<ChannelDetailVo> {
    // 频道 ID
    channelId: number

    // 频道名称
    name: string
  
    // 频道描述
    description: string
  
    // 频道等级
    level: string
  
    // 频道人数
    humanCount: number
  
    // 加入方式
    joinWay: string
  
    // 频道创建时间
    createdAt: number
  
    // 频道更新时间
    updatedAt: number
}

export default ChannelDetailVo;