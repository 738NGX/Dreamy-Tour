class Group {
  // 群组 ID
  groupId: number;
  // 群组名称
  name: string;
  // 群组描述
  description: string;
  // 群主 ID
  masterId: number;
  // 群组状态
  status: number;
  // 群组人数
  humanCount: number;
  // 绑定的频道 ID
  linkedChannel: number;
  // 群组二维码
  qrCode: string;
  // 群组等级
  level: number;
  // 群组加入方式
  joinWay: number;
  // 群组创建时间
  createdAt: number;
  // 群组更新时间
  updatedAt: number;
}

export default Group;