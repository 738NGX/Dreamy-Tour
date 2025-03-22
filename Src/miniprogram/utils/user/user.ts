export interface UserBasic {
  id: number;
  name: string;
  exp: number;
  isAdmin: boolean;
  gender: string;
  avatarUrl: string;
  email: string;
  phone: string;
  signature: string;
  birthday: string;
}

/**
 * 用户状态
 */
export class User implements UserBasic {
  id: number;
  name: string;
  exp: number;
  isAdmin: boolean;
  gender: string;
  avatarUrl: string;
  email: string;
  phone: string;
  signature: string;
  birthday: string;
  havingChannel: number[];
  adminingChannel: number[];
  joinedChannel: number[];
  havingGroup: number[];
  adminingGroup: number[];
  joinedGroup: number[];
  constructor(data: any) {
    this.id = data.id ?? -1;
    this.name = data.name ?? '未知用户';
    this.exp = data.exp ?? 0;
    this.isAdmin = data.isAdmin ?? false;
    this.gender = data.gender ?? '保密';
    this.avatarUrl = data.avatarUrl ?? '';
    this.email = data.email ?? '';
    this.phone = data.phone ?? '';
    this.signature = data.signature ?? '';
    this.birthday = data.birthday ?? '';
    this.havingChannel = data.havingChannel ?? [];
    this.adminingChannel = data.adminingChannel ?? [];
    this.joinedChannel = data.joinedChannel ?? [1];
    this.havingGroup = data.havingGroup ?? [];
    this.adminingGroup = data.adminingGroup ?? [];
    this.joinedGroup = data.joinedGroup ?? [];
  }
}