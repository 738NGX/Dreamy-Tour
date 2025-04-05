/**
 * 个人的分类报告，复用reporter
 * expense.user[].includes(currentUserId)
 */

import { AmountType } from "../tour/expense";
import { Tour } from "../tour/tour";
import { ExpenseProcessor, MultiplierFunc, ExpenseFilter } from "./expenseProcessor";

export class ReporterForUser {
  expenseProcessor: ExpenseProcessor;
  selectedUserId: number;

  constructor(tour: Tour, copyIndex: number, selectedUserId: number) {
    this.selectedUserId = selectedUserId;
    // 对于个人报告：若费用类型为 Average，则不做乘法（因费用已为单人费用）；否则将总费用均摊到每个参与者
    const personalMultiplier: MultiplierFunc = (expense) =>
      expense.user && expense.amountType === AmountType.Average ? 1 : 1 / expense.user.length;
    // 仅处理当前用户参与的费用
    const personalFilter: ExpenseFilter = (expense) => expense.user.includes(selectedUserId);

    this.expenseProcessor = new ExpenseProcessor(
      tour,
      copyIndex,
      tour.mainCurrency,
      tour.subCurrency,
      tour.currencyExchangeRate,
      personalMultiplier,
      personalFilter
    );
    this.expenseProcessor.processExpenses();
  }
}
