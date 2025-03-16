/**
 * 用户状态
 */
export class User {
  id: number;
  name: string;
  exp: number;
  isAdmin: boolean;
  havingChannel: number[];
  adminingChannel: number[];
  joinedChannel: number[];
  havingGroup: number[];
  adminingGroup: number[];
  joinedGroup: number[];
  constructor(data: any) {
    this.id = data.id ?? -1;
    this.name = data.name ?? 'Unknown';
    this.exp = data.exp ?? 0;
    this.isAdmin = data.isAdmin ?? false;
    this.havingChannel = data.havingChannel ?? [];
    this.adminingChannel = data.adminingChannel ?? [];
    this.joinedChannel = data.joinedChannel ?? [1];
    this.havingGroup = data.havingGroup ?? [];
    this.adminingGroup = data.adminingGroup ?? [];
    this.joinedGroup = data.joinedGroup ?? [];
  }
}