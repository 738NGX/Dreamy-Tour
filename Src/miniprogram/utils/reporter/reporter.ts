/**
 * 生成行程的分类列表，存放expenseItem，表示某一统计类别下的总消费
 */

import { AmountType } from "../tour/expense";
import { Tour } from "../tour/tour";
import { ExpenseProcessor, MultiplierFunc, ExpenseFilter } from "./expenseProcessor";



export class Reporter {
  expenseProcessor: ExpenseProcessor;
  // 地图相关属性
  polyline: any = {
    level: 'abovebuildings',
    points: [] as { latitude: number, longitude: number }[],
    color: '#0052D9',
    width: 8,
    arrowLine: true,
    segmentTexts: [] as { name: string, startIndex: number, endIndex: number }[],
    textStyle: {
      fontSize: 20,
      textColor: '#000000',
      strokeColor: '#ffffff'
    }
  };
  markers: any[] = [];
  // 预算图表数据
  titleOfBudgets: string[] = [];
  budgets: number[] = [];
  costs: number[] = [];
  diff: number[] = [];

  constructor(tour: Tour, copyIndex: number) {
    // 对于群体报告：若费用类型为 Average，则乘以参与人数；否则按原值计算
    const groupMultiplier: MultiplierFunc = (expense) =>
      expense.user && expense.amountType === AmountType.Average ? expense.user.length : 1;
    // 群体报告不过滤任何费用
    const groupFilter: ExpenseFilter = (_expense) => true;

    this.expenseProcessor = new ExpenseProcessor(
      tour,
      copyIndex,
      tour.mainCurrency,
      tour.subCurrency,
      tour.currencyExchangeRate,
      groupMultiplier,
      groupFilter
    );
    this.expenseProcessor.processExpenses();

    // 以下示例代码演示如何处理地点数据生成地图 marker 和 polyline 信息
    for (const location of tour.locations[copyIndex]) {
      this.polyline.points.push({
        latitude: Number(location.latitude),
        longitude: Number(location.longitude)
      });
      this.markers.push({
        id: location.index,
        latitude: Number(location.latitude),
        longitude: Number(location.longitude),
        width: 30,
        height: 30
      });
    }
    // 生成预算图表数据
    let i = 0;
    for (const budget of tour.budgets) {
      const exchange = budget.currency === tour.subCurrency ? tour.currencyExchangeRate : 1;
      const budgetAmount = budget.amount * exchange;
      this.titleOfBudgets.push(budget.title);
      this.budgets.push(budgetAmount);
      this.costs.push(0 - this.expenseProcessor.expenseCalculator.totalInBudget[i].allCurrency);
      this.diff.push(this.budgets[i] + this.costs[i]);
      i++;
    }
  }
}




