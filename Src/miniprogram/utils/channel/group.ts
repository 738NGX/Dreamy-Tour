export class Group {
  id: number;
  name: string;
  description: string;
  linkedChannel: number;
  qrCode: string;
  constructor(data: any) {
    this.id = data.id ?? -1;
    this.name = data.name ?? '新群组';
    this.description = data.description ?? '这是一个新群组';
    this.linkedChannel = data.linkedChannel ?? -1;
    this.qrCode = data.qrCode ?? '';
  }
}