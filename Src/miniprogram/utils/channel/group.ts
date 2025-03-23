import { JoinWay } from "./channel";

export class GroupBasic {
  id: number;
  name: string;
  description: string;
  linkedChannel: number;
  qrCode: string;
  joinWay: JoinWay;
  constructor(data: any) {
    this.id = data.id ?? -1;
    this.name = data.name ?? '新群组';
    this.description = data.description ?? '这是一个新群组';
    this.linkedChannel = data.linkedChannel ?? -1;
    this.joinWay = data.joinWay ?? JoinWay.Free;
    this.qrCode = data.qrCode ?? '';
  }
}

export class Group extends GroupBasic {
  waitingUsers: number[];
  constructor(data: any) {
    super(data);
    this.waitingUsers = data.waitingUsers ?? [];
  }
}