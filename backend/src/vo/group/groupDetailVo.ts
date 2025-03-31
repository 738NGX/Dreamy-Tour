import VO from "@/base/vo";

class GroupDetailVo extends VO<GroupDetailVo> {
  // 群组 ID
  groupId: number

  // 群组名称
  name: string

  // 群组描述
  description: string

  // 群组等级
  level: string

  // 关联频道
  linkedChannel: number

  // 群组二维码
  qrCode: string

  // 群组人数
  humanCount: number

  // 加入方式
  joinWay: string

  // 群组创建时间
  createdAt: number

  // 群组更新时间
  updatedAt: number
}

export default GroupDetailVo;