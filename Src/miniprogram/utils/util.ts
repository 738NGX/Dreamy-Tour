import HttpUtil from "./httpUtil";
import { User, UserBasic } from "./user/user";

export const MILLISECONDS = {
  SECOND: 1e+3,
  MINUTE: 6e+4,
  HOUR: 3.6e+6,
  DAY: 8.64e+7
};

export const formatTime: {
  (date: Date, timeOffset?: number): string;
  (timestamp: number, timeOffset?: number): string;
} = (input: Date | number, timeOffset?: number): string => {
  const usingDate = new Date(typeof input === 'number' ? input : input.getTime());

  if (timeOffset !== undefined) {
    usingDate.setTime(
      usingDate.getTime() + new Date().getTimezoneOffset() * MILLISECONDS.MINUTE
      - timeOffset * MILLISECONDS.MINUTE
    );
  }

  const year = usingDate.getFullYear();
  const month = usingDate.getMonth() + 1;
  const day = usingDate.getDate();
  const hour = usingDate.getHours();
  const minute = usingDate.getMinutes();

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute].map(formatNumber).join(':')
  );
};


export const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

export const formatDate: {
  (date: Date, timeOffset?: number): string;
  (timestamp: number, timeOffset?: number): string;
} = (input: Date | number, timeOffset?: number): string => {
  const usingDate = new Date(typeof input === 'number' ? input : input.getTime());

  if (timeOffset !== undefined) {
    usingDate.setTime(
      usingDate.getTime() + new Date().getTimezoneOffset() * MILLISECONDS.MINUTE
      - timeOffset * MILLISECONDS.MINUTE
    );
  }

  const year = usingDate.getFullYear();
  const month = usingDate.getMonth() + 1;
  const day = usingDate.getDate();
  const arr = ['(日)', '(一)', '(二)', '(三)', '(四)', '(五)', '(六)'];

  return [year, month, day].map(formatNumber).join('/') + arr[usingDate.getDay()];
};

export function timeToMilliseconds(time: string) {
  const match = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    throw new Error("Invalid time format. Please use 'HH:mm'.");
  }

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);

  const milliseconds = (hours * MILLISECONDS.HOUR) + (minutes * MILLISECONDS.MINUTE);
  return milliseconds;
}

export async function exchangeCurrency(amount: number, from: string, to: string) {
  try {
    const res = await HttpUtil.get({
      url: "/currency/exchange-rate",
      jsonData: {
        fromCurrencyISO: from,
        toCurrencyISO: to
      }
    })
    console.log(res);
    const rate = res.data.data.exchangeRate;
    return rate * amount;
  } catch (err) {
    wx.showToast({
      title: '获取汇率失败',
      icon: 'error',
    });
    return 1;
  }
}

export function getChartData(data: any) {
  let res = { series: [{ data: data }] };
  return JSON.parse(JSON.stringify(res));
}

//返回类型为echarts.opts.series.data的JSON，便于在需要定制series内容时插入数据
export function getEChartData(data: any) {
  let res = Array.isArray(data) ? data : [data];
  return JSON.parse(JSON.stringify(res));
}

const userGroupName = ['Lv.0船客', 'Lv.1水手', 'Lv.2水手长', 'Lv.3轮机长', 'Lv.4大副', 'Lv.5船长', 'Lv.6探险家'];
export const userRoleName = ['PASSENGER', 'SAILOR', 'BOATSWAIN', 'CHIEF_ENGINEER', 'FIRST_MATE', 'CAPTAIN', 'EXPLORER', 'ADMIN'];

export const userExpTarget = {
  [userGroupName[0]]: 20,
  [userGroupName[1]]: 150,
  [userGroupName[2]]: 450,
  [userGroupName[3]]: 1080,
  [userGroupName[4]]: 2880,
  [userGroupName[5]]: 10000,
  [userGroupName[6]]: 10000,
}

export function getUserGroupName(user: User | UserBasic): string {
  if (user.isAdmin) {
    return '系统管理员';
  } else if (user.exp >= userExpTarget[userGroupName[5]]) {
    return userGroupName[6];
  } else if (user.exp >= userExpTarget[userGroupName[4]]) {
    return userGroupName[5];
  } else if (user.exp >= userExpTarget[userGroupName[3]]) {
    return userGroupName[4];
  } else if (user.exp >= userExpTarget[userGroupName[2]]) {
    return userGroupName[3];
  } else if (user.exp >= userExpTarget[userGroupName[1]]) {
    return userGroupName[2];
  } else if (user.exp >= userExpTarget[userGroupName[0]]) {
    return userGroupName[1];
  } else {
    return userGroupName[0];
  }
}

export function getUserGroupNameInChannel(user: User, channelId: number): string {
  if (user.isAdmin) {
    return '系统管理员';
  } else if (user.havingChannel.includes(channelId)) {
    return '频道主';
  } else if (user.adminingChannel.includes(channelId)) {
    return '频道管理员';
  } else {
    return getUserGroupName(user);
  }
}

export function getUserGroupNameInGroup(user: User, groupId: number): string {
  if (user.isAdmin) {
    return '系统管理员';
  } else if (user.havingGroup.includes(groupId)) {
    return '群主';
  } else if (user.adminingGroup.includes(groupId)) {
    return '群管理员';
  } else {
    return getUserGroupName(user);
  }
}

export function formatPostTime(timestamp: number): string {
  const now = new Date();
  const target = new Date(timestamp);
  const diffSeconds = Math.floor((now.getTime() - timestamp) / 1000);

  if (diffSeconds < 3) {
    return `刚刚`;
  }

  if (diffSeconds < 60) {
    return `${diffSeconds}秒前`;
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}小时前`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) {
    return `昨天${target.getHours().toString().padStart(2, '0')}:${target.getMinutes().toString().padStart(2, '0')}`;
  }

  if (diffDays < 7) {
    return `${diffDays}天前`;
  }

  return `${target.getFullYear()}-${(target.getMonth() + 1).toString().padStart(2, '0')}-${target.getDate().toString().padStart(2, '0')}`;
}

export function isSameDay(date1: number, date2: number): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

export function getUser(userList: any[], id: number): User | undefined {
  const result = userList.find(user => user.id === id);
  return !result ? undefined : new User(result);
}

export function getNewId(arr: any[]): number {
  const maxId = arr.length > 0
    ? Math.max(...arr.map((group: any) => group.id))
    : 0;
  return maxId + 1;
}

export function displayNumber(num: number): String {
  const number = num;
  if (number < 1000) return number.toString()
  return (number / 1000).toString() + 'k'
}

export async function getImageBase64(tempFilePath: string): Promise<string> {
  const base64 = await new Promise(resolve => {
    wx.getFileSystemManager().readFile({
      filePath: tempFilePath,
      encoding: 'base64',
      success: ({
        data
      }) => {
        return resolve('data:image/png;base64,' + data);
      }
    });
  });
  return base64 as string;
}

export const getByteLength = (str: string): number =>
  str.replace(/[^\x00-\xff]/g, 'aa').length;

export function getExpFromRole(role: string): number {
  switch (role) {
    case userRoleName[1]:
      return 20;
    case userRoleName[2]:
      return 150;
    case userRoleName[3]:
      return 450;
    case userRoleName[4]:
      return 1080;
    case userRoleName[5]:
      return 2880;
    case userRoleName[6]:
      return 10000;
    default:
      return 0;
  }
}