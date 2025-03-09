export enum GroupLevel { A, B, C }

export const GroupLevelInfo = {
  [GroupLevel.A]: { text: 'A级', maxMembers: 100 },
  [GroupLevel.B]: { text: 'B级', maxMembers: 20 },
  [GroupLevel.C]: { text: 'C级', maxMembers: 5 },
}

export class Group {
  id: number;
  name: string;
  description: string;
  level: GroupLevel;
  userCount: number;
  linkedGroup: number;
  constructor(data: any) {
    this.id = data.id ?? -1;
    this.name = data.name ?? '新群组';
    this.description = data.description ?? '这是一个新群组';
    this.level = data.level ?? GroupLevel.C;
    this.userCount = data.userCount ?? 0;
    this.linkedGroup = data.linkedGroup ?? -1;
  }
}