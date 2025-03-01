export enum ChannelLevel { S, A, B, C }

export const channelLevelInfo = {
  [ChannelLevel.S]: { text: 'S级', maxMembers: Number.MAX_SAFE_INTEGER },
  [ChannelLevel.A]: { text: 'A级', maxMembers: 3000 },
  [ChannelLevel.B]: { text: 'B级', maxMembers: 500 },
  [ChannelLevel.C]: { text: 'C级', maxMembers: 100 },
}

export class Channel {
  id: number;
  name: string;
  description: string;
  level: ChannelLevel;
  constructor(data: any) {
    this.id = data.id ?? -1;
    this.name = data.name ?? '新频道';
    this.description = data.description ?? '这是一个新频道';
    this.level = data.level ?? ChannelLevel.C;
  }
}