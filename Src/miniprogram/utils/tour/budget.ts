import { Currency } from "./expense";

export class Budget {
  title: string;
  amount: number;
  currency: Currency;
  constructor(data: any) {
    this.title = data.title ?? '新预算';
    this.amount = data.amount ?? 0;
    this.currency = data.currency ?? Currency.CNY;
  }
}