export enum JoinWay { Free, Approval, Invite }

export const joinWayText = {
  [JoinWay.Free]: '自由加入',
  [JoinWay.Approval]: '需要审核',
  [JoinWay.Invite]: '仅限邀请',
}

export class Channel {
  id: number;
  name: string;
  description: string;
  joinWay: JoinWay;
  constructor(data: any) {
    this.id = data.id ?? -1;
    this.name = data.name ?? '新频道';
    this.description = data.description ?? '这是一个新频道';
    this.joinWay = data.joinWay ?? JoinWay.Free;
  }
}