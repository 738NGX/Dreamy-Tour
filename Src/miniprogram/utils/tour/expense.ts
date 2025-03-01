export enum TransportType { Bus, Metro, Train, Flight, Walk, Cycle, Car, Taxi, Ship, Other };
export enum Currency { CNY, USD, EUR, JPY, HKD, MOP, TWD, GBP, KRW, SGD, THB, RUB, CAD, INR, AUD, VND };
export enum ExpenseType { Hotel, Meal, Transportation, Ticket, Shopping, Other };

export const currencyList = [
  { label: '人民币-CNY', symbol: 'CNY', value: Currency.CNY },
  { label: '美元-USD', symbol: 'USD', value: Currency.USD },
  { label: '欧元-EUR', symbol: 'EUR', value: Currency.EUR },
  { label: '日元-JPY', symbol: 'JPY', value: Currency.JPY },
  { label: '港元-HKD', symbol: 'HKD', value: Currency.HKD },
  { label: '澳元-MOP', symbol: 'MOP', value: Currency.MOP },
  { label: '新台币-TWD', symbol: 'TWD', value: Currency.TWD },
  { label: '英镑-GBP', symbol: 'GBP', value: Currency.GBP },
  { label: '韩元-KRW', symbol: 'KRW', value: Currency.KRW },
  { label: '新加坡元-SGD', symbol: 'SGD', value: Currency.SGD },
  { label: '泰铢-THB', symbol: 'THB', value: Currency.THB },
  { label: '俄罗斯卢布-RUB', symbol: 'RUB', value: Currency.RUB },
  { label: '加元-CAD', symbol: 'CAD', value: Currency.CAD },
  { label: '印度卢比-INR', symbol: 'INR', value: Currency.INR },
  { label: '澳元-AUD', symbol: 'AUD', value: Currency.AUD },
  { label: '越南盾-VND', symbol: 'VND', value: Currency.VND },
];

export const transportList = [
  { label: "公交", icon: 'bus', value: TransportType.Bus },
  { label: "轨交", icon: 'metro', value: TransportType.Metro },
  { label: "铁路", icon: 'train', value: TransportType.Train },
  { label: "飞机", icon: 'flight', value: TransportType.Flight },
  { label: "步行", icon: 'walk', value: TransportType.Walk },
  { label: "骑行", icon: 'cycle', value: TransportType.Cycle },
  { label: "驾车", icon: 'car', value: TransportType.Car },
  { label: "打车", icon: 'taxi', value: TransportType.Taxi },
  { label: "船舶", icon: 'ship', value: TransportType.Ship },
  { label: "其他", icon: 'other', value: TransportType.Other },
];

export const expenseList = [
  { label: "住宿", icon: 'hotel', value: ExpenseType.Hotel },
  { label: "餐饮", icon: 'meal', value: ExpenseType.Meal },
  { label: "交通", icon: 'bus', value: ExpenseType.Transportation },
  { label: "门票", icon: 'ticket', value: ExpenseType.Ticket },
  { label: "购物", icon: 'shop', value: ExpenseType.Shopping },
  { label: "其他", icon: 'other', value: ExpenseType.Other },
];

export const tagList = [
  { value: 0, color: 'f0f0f0' },
  { value: 1, color: 'ff9547' },
  { value: 2, color: 'ff9eac' },
  { value: 3, color: '27c1b7' },
  { value: 4, color: 'db0839' },
  { value: 5, color: '66c0ff' },
  { value: 6, color: 'c1cad4' },
  { value: 7, color: 'ffd010' },
  { value: 8, color: 'c252c6' },
  { value: 9, color: 'ff6fbe' },
];

/**
 * 消费类
 */
export class Expense {
  index: number;
  title: string;
  amount: number;
  currency: Currency;
  type: ExpenseType = ExpenseType.Other;
  note: string = '';
  tag: number = 0;

  constructor(indexOrData: number | any, currency?: Currency, type?: ExpenseType) {
    if (typeof indexOrData === 'number') {
      this.index = indexOrData;
      this.title = '新消费';
      this.amount = 0;
      this.currency = currency!;
      this.type = type!;
    }
    else {
      const data = indexOrData;
      this.index = data.index;
      this.title = data.title;
      this.amount = data.amount;
      this.currency = data.currency;
      this.type = data.type;
      this.note = data.note;
      this.tag = data.tag;
    }
  }
}

/**
 * 交通消费类
 */
export class TransportExpense extends Expense {
  transportType: TransportType;

  constructor(indexOrData: number | any, currency?: Currency, transportType?: TransportType) {
    super(indexOrData, currency, ExpenseType.Transportation);
    if (indexOrData.transportType !== undefined) {
      this.transportType = indexOrData.transportType;
    }
    else {
      this.transportType = transportType ? transportType : TransportType.Other;
    }
    if (indexOrData.title === undefined) {
      this.title = "(右滑可删除该交通)";
    }
  }
};