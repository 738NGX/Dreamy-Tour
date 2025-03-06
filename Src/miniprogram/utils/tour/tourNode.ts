import { MILLISECONDS } from "../util";
import { Currency, Expense, ExpenseType, TransportExpense, TransportType } from "./expense";
import { Photo } from "./photo";

/**
 * 行程节点类
 */
export class TourNode {
  index: number;
  startOffset: number;
  endOffset: number;
  timeOffset: number = -480;
  note: string = '';

  constructor(index: number, startOffset: number, endOffset: number, timeOffset: number) {
    this.index = index;
    this.startOffset = startOffset;
    this.endOffset = endOffset;
    this.timeOffset = timeOffset;
  }

  getDurationString(): string {
    const duration = this.endOffset - this.startOffset;
    const hours = Math.floor(duration / MILLISECONDS.HOUR);
    const minutes = Math.floor(duration % MILLISECONDS.HOUR / MILLISECONDS.MINUTE);
    if (duration < 0) {
      return '结束时间早于开始时间';
    }
    else if (hours > 0) {
      return hours + '小时' + minutes + '分钟';
    }
    else {
      return minutes + '分钟';
    }
  }
};

/**
 * 位置节点类
 */
export class Location extends TourNode {
  title: string = '';
  longitude: number = 121.496300;
  latitude: number = 31.307627;
  expenses: Expense[] = [];
  photos: Photo[] = [];

  constructor(data: any) {
    super(data.index ?? -1, data.startOffset ?? 0, data.endOffset ?? 0, data.timeOffset ?? -480);
    this.title = data.title ?? '';
    this.longitude = data.longitude ?? 121.496300;
    this.latitude = data.latitude ?? 31.307627;
    this.expenses = data.expenses ? data.expenses.map((expense: any) => new Expense(expense)) : [];
    this.photos = data.photos ? data.photos.map((photo: any) => new Photo(photo)) : [];
    this.note = data.note ?? '';
  }

  setPosition(longitude: number, latitude: number) {
    this.longitude = longitude;
    this.latitude = latitude;
  }

  addExpense(currency: Currency) {
    this.expenses.push(
      new Expense({ index: this.expenses.length, currency: currency, type: ExpenseType.Other })
    );
  }

  removeExpense(index: number) {
    if (index < 0 || index >= this.expenses.length) {
      return;
    }
    if (index < this.expenses.length - 1) {
      this.expenses.splice(index, 1);
      for (let i = index; i < this.expenses.length; i++) {
        this.expenses[i].index = i;
      }
    }
    else {
      this.expenses.pop();
    }
  }
};

/**
 * 交通节点类
 */
export class Transportation extends TourNode {
  transportExpenses: TransportExpense[] = [];

  constructor(data: any) {
    super(data.index ?? -1, data.startOffset ?? 0, data.endOffset ?? 0, data.timeOffset ?? -480);
    this.transportExpenses = data.transportExpenses ? data.transportExpenses.map((expense: any) => new TransportExpense(expense)) : [];
  }

  addTransportExpense(currency: Currency) {
    this.transportExpenses.push(
      new TransportExpense({ index: this.transportExpenses.length, currency: currency, type: TransportType.Other })
    );
  }
  removeTransportExpense(index: number) {
    if (index < 0 || index >= this.transportExpenses.length) {
      return;
    }
    if (index < this.transportExpenses.length - 1) {
      this.transportExpenses.splice(index, 1);
      for (let i = index; i < this.transportExpenses.length; i++) {
        this.transportExpenses[i].index = i;
      }
    }
    else {
      this.transportExpenses.pop();
    }
  }
}