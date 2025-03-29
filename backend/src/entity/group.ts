class Group {
  // 群组 ID
  groupId: number;
  // 群组名称
  name: string;
  // 群组描述
  description: string;
  // 群主 ID
  masterId: number;
  status: number;
  humanCount: number;
  linkedChannel: number;
  qrCode: string;
  level: number;
  joinWay: number;
  createdAt: number;
  updatedAt: number;
}

export default Group;