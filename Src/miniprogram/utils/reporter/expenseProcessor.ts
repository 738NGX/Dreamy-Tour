// expenseProcessor.ts
import { Currency, AmountType } from "../tour/expense";
import { Tour } from "../tour/tour";
import { formatDate } from "../util";
import { ExpenseCalculator, ExpenseItemList, ExpenseItem } from "./expenseUtil";

// 定义一个费用过滤函数类型，用于决定当前费用是否参与处理
export type ExpenseFilter = (expense: any) => boolean;

// 定义一个转换函数类型，用于根据不同场景计算费用的倍率
export type MultiplierFunc = (expense: any) => number;

/**
 * ExpenseProcessor 负责处理地点和交通的费用，将处理结果记录到各个列表中，
 * 并更新费用计算器。它通过传入的 multiplierFunc 决定对每笔费用是乘还是除，
 * 通过 expenseFilter 决定是否需要处理该费用。
 */
export class ExpenseProcessor {
  tourData: Tour;
  copyIndex: number;
  mainCurrency: Currency;
  subCurrency: Currency;
  currencyExchangeRate: number;
  multiplierFunc: MultiplierFunc;
  expenseFilter: ExpenseFilter;

  expenseCalculator: ExpenseCalculator;
  typeList: ExpenseItemList[];
  budgetList: ExpenseItemList[];
  locationList: ExpenseItemList[];

  constructor(
    tour: Tour,
    copyIndex: number,
    mainCurrency: Currency,
    subCurrency: Currency,
    currencyExchangeRate: number,
    multiplierFunc: MultiplierFunc,
    expenseFilter: ExpenseFilter
  ) {
    this.tourData = tour;
    this.copyIndex = copyIndex;
    this.mainCurrency = mainCurrency;
    this.subCurrency = subCurrency;
    this.currencyExchangeRate = currencyExchangeRate;
    this.multiplierFunc = multiplierFunc;
    this.expenseFilter = expenseFilter;

    this.expenseCalculator = new ExpenseCalculator();
    this.expenseCalculator.setUsers(tour.users);

    // 初始化各个列表（类别、预算、地点）
    this.typeList = Array(6)
      .fill(null)
      .map(() => new ExpenseItemList(mainCurrency, subCurrency));
    this.budgetList = Array(10)
      .fill(null)
      .map(() => new ExpenseItemList(mainCurrency, subCurrency));
    this.locationList = Array(tour.locations[copyIndex].length)
      .fill(null)
      .map(() => new ExpenseItemList(mainCurrency, subCurrency));
  }

  processExpenses() {
    const rate = this.currencyExchangeRate;
    // 处理各个地点的费用
    for (const location of this.tourData.locations[this.copyIndex]) {
      for (const expense of location.expenses) {
        if (this.expenseFilter(expense)) {
          const multiplier = this.multiplierFunc(expense);
          const budgetNum = expense.budget && expense.budget.length ? expense.budget.length : 1;

          if (expense.currency === this.mainCurrency) {
            const effectiveAmount = expense.amount * multiplier;
            const expenseItem = new ExpenseItem(
              effectiveAmount,
              0,
              rate,
              expense.title,
              location.title,
              formatDate(this.tourData.startDate + location.startOffset, location.timeOffset),
              expense.type
            );
            this.expenseCalculator.total.addMain(effectiveAmount, rate);
            this.expenseCalculator.totalInType[expense.type].addMain(effectiveAmount, rate);
            if (expense.budget && expense.budget.length > 0) {
              const uniqueBudgets = new Set(expense.budget);
              for (let budget of uniqueBudgets) {
                const effectiveBudgetAmount = effectiveAmount / budgetNum;
                this.expenseCalculator.totalInBudget[budget].addMain(effectiveBudgetAmount, rate);
                this.budgetList[budget].data.push(
                  new ExpenseItem(
                    effectiveBudgetAmount,
                    0,
                    rate,
                    expense.title,
                    location.title,
                    formatDate(this.tourData.startDate + location.startOffset, location.timeOffset),
                    expense.type
                  )
                );
              }
            }
            if (expense.user && expense.user.length > 0) {
              for (const userId of expense.user) {
                const userIndex = this.tourData.users.indexOf(userId);
                const userAmount =
                  expense.amountType === AmountType.Total
                    ? expense.amount / expense.user.length
                    : effectiveAmount;
                this.expenseCalculator.totalInUser[userIndex].addMain(userAmount, rate);
              }
            }
            this.typeList[expense.type].data.push(expenseItem);
            // 假设 location.index 与数组下标一致
            this.locationList[location.index].data.push(expenseItem);
          } else {
            // 同理处理辅币种的费用
            const effectiveAmount = expense.amount * multiplier;
            const expenseItem = new ExpenseItem(
              0,
              effectiveAmount,
              rate,
              expense.title,
              location.title,
              formatDate(this.tourData.startDate + location.startOffset, location.timeOffset),
              expense.type
            );
            this.expenseCalculator.total.addSub(effectiveAmount, rate);
            this.expenseCalculator.totalInType[expense.type].addSub(effectiveAmount, rate);
            if (expense.budget && expense.budget.length > 0) {
              const uniqueBudgets = new Set(expense.budget);
              for (let budget of uniqueBudgets) {
                const effectiveBudgetAmount = effectiveAmount / budgetNum;
                this.expenseCalculator.totalInBudget[budget].addSub(effectiveBudgetAmount, rate);
                this.budgetList[budget].data.push(
                  new ExpenseItem(
                    0,
                    effectiveBudgetAmount,
                    rate,
                    expense.title,
                    location.title,
                    formatDate(this.tourData.startDate + location.startOffset, location.timeOffset),
                    expense.type
                  )
                );
              }
            }
            if (expense.user && expense.user.length > 0) {
              for (const userId of expense.user) {
                const userIndex = this.tourData.users.indexOf(userId);
                const userAmount =
                  expense.amountType === AmountType.Total
                    ? expense.amount / expense.user.length
                    : effectiveAmount;
                this.expenseCalculator.totalInUser[userIndex].addSub(userAmount, rate);
              }
            }
            this.typeList[expense.type].data.push(expenseItem);
            this.locationList[location.index].data.push(expenseItem);
          }
        }
      }
    }

    // 处理交通费用（类似地点处理，不过“from”字段为空）
    for (const transportation of this.tourData.transportations[this.copyIndex]) {
      for (const expense of transportation.transportExpenses) {
        if (this.expenseFilter(expense)) {
          const multiplier = this.multiplierFunc(expense);
          const budgetNum = expense.budget && expense.budget.length ? expense.budget.length : 1;
          if (expense.currency === this.mainCurrency) {
            const effectiveAmount = expense.amount * multiplier;
            const expenseItem = new ExpenseItem(
              effectiveAmount,
              0,
              rate,
              expense.title,
              '',
              formatDate(this.tourData.startDate + transportation.startOffset, transportation.timeOffset),
              expense.type
            );
            this.expenseCalculator.total.addMain(effectiveAmount, rate);
            this.expenseCalculator.totalInType[expense.type].addMain(effectiveAmount, rate);
            this.expenseCalculator.totalInTransportType[expense.transportType].addMain(effectiveAmount, rate);
            if (expense.budget && expense.budget.length > 0) {
              const uniqueBudgets = new Set(expense.budget);
              for (let budget of uniqueBudgets) {
                const effectiveBudgetAmount = effectiveAmount / budgetNum;
                this.expenseCalculator.totalInBudget[budget].addMain(effectiveBudgetAmount, rate);
                this.budgetList[budget].data.push(
                  new ExpenseItem(
                    effectiveBudgetAmount,
                    0,
                    rate,
                    expense.title,
                    '',
                    formatDate(this.tourData.startDate + transportation.startOffset, transportation.timeOffset),
                    expense.type
                  )
                );
              }
            }
            if (expense.user && expense.user.length > 0) {
              for (const userId of expense.user) {
                const userIndex = this.tourData.users.indexOf(userId);
                const userAmount =
                  expense.amountType === AmountType.Total
                    ? expense.amount / expense.user.length
                    : effectiveAmount;
                this.expenseCalculator.totalInUser[userIndex].addMain(userAmount, rate);
              }
            }
            this.typeList[expense.type].data.push(expenseItem);
          } else {
            const effectiveAmount = expense.amount * multiplier;
            const expenseItem = new ExpenseItem(
              0,
              effectiveAmount,
              rate,
              expense.title,
              '',
              formatDate(this.tourData.startDate + transportation.startOffset, transportation.timeOffset),
              expense.type
            );
            this.expenseCalculator.total.addSub(effectiveAmount, rate);
            this.expenseCalculator.totalInType[expense.type].addSub(effectiveAmount, rate);
            this.expenseCalculator.totalInTransportType[expense.transportType].addSub(effectiveAmount, rate);
            if (expense.budget && expense.budget.length > 0) {
              const uniqueBudgets = new Set(expense.budget);
              for (let budget of uniqueBudgets) {
                const effectiveBudgetAmount = effectiveAmount / budgetNum;
                this.expenseCalculator.totalInBudget[budget].addSub(effectiveBudgetAmount, rate);
                this.budgetList[budget].data.push(
                  new ExpenseItem(
                    0,
                    effectiveBudgetAmount,
                    rate,
                    expense.title,
                    '',
                    formatDate(this.tourData.startDate + transportation.startOffset, transportation.timeOffset),
                    expense.type
                  )
                );
              }
            }
            if (expense.user && expense.user.length > 0) {
              for (const userId of expense.user) {
                const userIndex = this.tourData.users.indexOf(userId);
                const userAmount =
                  expense.amountType === AmountType.Total
                    ? expense.amount / expense.user.length
                    : effectiveAmount;
                this.expenseCalculator.totalInUser[userIndex].addSub(userAmount, rate);
              }
            }
            this.typeList[expense.type].data.push(expenseItem);
          }
        }
      }
    }

    // 更新各个列表（排序、生成展示数据、图表数据等）
    this.typeList.forEach(list => list.update());
    this.budgetList.forEach(list => list.update());
    this.locationList.forEach(list => list.update());
  }
}
