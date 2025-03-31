import VO from "@/base/vo";

class GroupListVo extends VO<GroupListVo> {
  // 频道 ID
  groupId: number

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

export default GroupListVo;