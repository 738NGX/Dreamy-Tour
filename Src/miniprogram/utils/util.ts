import { Tour } from "./tour/tour";
import { User } from "./user/user";

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

export function exchangeCurrency(amount: number, from: string, to: string) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://books.738ngx.site/exchange-currency',
      method: 'GET',
      data: {
        amount: amount,
        from: from,
        to: to
      },
      success(res) {
        if (res.data && typeof res.data === 'object' && 'crdhldBillAmt' in res.data) {
          resolve(res.data.crdhldBillAmt);
        } else {
          reject('No conversion data available');
        }
      },
      fail(err) {
        reject(err);
      }
    });
  });
}

export function getChartData(data: any) {
  let res = { series: [{ data: data }] };
  return JSON.parse(JSON.stringify(res));
}

export function getUserGroupName(user: User): string {
  if (user.isAdmin) {
    return '系统管理员';
  } else if (user.exp >= 10000) {
    return 'Lv.6探险家';
  } else if (user.exp >= 2880) {
    return 'Lv.5船长';
  } else if (user.exp >= 1080) {
    return 'Lv.4大副';
  } else if (user.exp >= 450) {
    return 'Lv.3轮机长';
  } else if (user.exp >= 150) {
    return 'Lv.2水手长';
  } else if (user.exp >= 20) {
    return 'Lv.1水手';
  } else {
    return 'Lv.0船客';
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

  return `${target.getFullYear()}/${(target.getMonth() + 1).toString().padStart(2, '0')}/${target.getDate().toString().padStart(2, '0')}`;
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

export function getTour(tourList: any[], id: number): Tour | undefined {
  const result = tourList.find(tour => tour.id === id);
  return !result ? undefined : new Tour(result);
}

export function getNewId(arr: any[]): number {
  const maxId = arr.length > 0
    ? Math.max(...arr.map((group: any) => group.id))
    : 0;
  return maxId + 1;
}