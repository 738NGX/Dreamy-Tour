/**
 * 个人的分类报告，复用reporter
 * expense.user[].includes(currentUserId)
 */
import {
  CDN_PATH,
  PLUGIN_KEY
} from '../config/appConfig';
import { AmountType, Currency, currencyList, expenseList, ExpenseType } from './tour/expense';
if (PLUGIN_KEY) {
  const QQMapWX = require('../components/qqmap-wx-jssdk');
  const qqmapsdk = new QQMapWX({
    key: PLUGIN_KEY // 必填
  });
  qqmapsdk
}
import { Tour } from './tour/tour';
import { formatDate, getEChartData } from './util';

const app = getApp<IAppOption>();

export class ReporterForUser {
  tourData: Tour;

  // 货币
  mainCurrency: Currency;
  subCurrency: Currency;
  currencyExchangeRate: number;

  // 消费计算
  expenseCalculator: ExpenseCalculator;

  // 分类列表
  typeList: ExpenseItemList[];

  // 分标签列表
  budgetList: ExpenseItemList[];

  // 分位置列表
  locationList: ExpenseItemList[];

  currentUserId: number;

  // 地图路径
  markers: any[] = [];
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

  constructor(tour: Tour,copyIndex:number) {
    this.tourData = tour;
    this.currentUserId = app.globalData.currentUserId;

    this.currencyExchangeRate = tour.currencyExchangeRate;
    this.mainCurrency = tour.mainCurrency;
    this.subCurrency = tour.subCurrency;

    this.typeList = Array(6).fill(null).map(() =>
      new ExpenseItemList(this.mainCurrency, this.subCurrency)
    );
    this.budgetList = Array(10).fill(null).map(() =>
      new ExpenseItemList(this.mainCurrency, this.subCurrency)
    );
    this.locationList = Array(tour.locations.length).fill(null).map(() =>
      new ExpenseItemList(this.mainCurrency, this.subCurrency)
    );
    this.expenseCalculator = new ExpenseCalculator();
    this.expenseCalculator.setUsers(this.tourData.users);

    this.dealLocations(copyIndex);
    this.dealTransportations(copyIndex);
    this.updateAllLists();
  }

  private dealLocations(copyIndex: number) {
    const rate = this.currencyExchangeRate;

    for (const location of this.tourData.locations[copyIndex]) {
      // this.polyline.points.push({ latitude: Number(location.latitude), longitude: Number(location.longitude) });
      // this.markers.push(
      //   {
      //     id: location.index,
      //     iconPath: `${CDN_PATH}/Marker1_Activated@3x.png`,
      //     latitude: Number(location.latitude),
      //     longitude: Number(location.longitude),
      //     width: 30,
      //     height: 30,
      //   }
      // );

        //expenseItem存储单笔消费记录，如果为总价，则除以人数
        //平均存入budgetlist
      for (const expense of location.expenses) {
        if(expense.user.includes(this.currentUserId)){
          const userNumForCalc = expense.user && expense.amountType == AmountType.Average ? 1 : expense.user.length;
          const budgetNumForCalc = expense.budget ? expense.budget.length : 1;

          if (expense.currency === this.mainCurrency) {

            const expenseItem = new ExpenseItem(
              expense.amount / userNumForCalc,
              0,
              rate,
              expense.title,
              location.title,
              formatDate(this.tourData.startDate + location.startOffset, location.timeOffset),
              expense.type,
            );
            this.expenseCalculator.total.addMain(expense.amount / userNumForCalc, rate);
            this.expenseCalculator.totalInType[expense.type].addMain(expense.amount / userNumForCalc, rate);
            let budgets = new Set(expense.budget)
            for(let budget of budgets){
              this.expenseCalculator.totalInBudget[budget].addMain(expense.amount / userNumForCalc / budgetNumForCalc, rate);
              this.budgetList[budget].data.push(new ExpenseItem(
                expense.amount / userNumForCalc / budgetNumForCalc,
                0,
                rate,
                expense.title,
                location.title,
                formatDate(this.tourData.startDate + location.startOffset, location.timeOffset),
                expense.type,
              ));
            //总价平均分摊给每个参与成员
            for(const userId of expense.user){
              const userIndex = this.tourData.users.indexOf(userId);
              const userAmount = expense.amountType == AmountType.Total ? expense.amount / expense.user.length : expense.amount;
              this.expenseCalculator.totalInUser[userIndex].addMain(userAmount,rate);
            }
            this.typeList[expense.type].data.push(expenseItem);
            this.locationList[location.index].data.push(expenseItem);
            }
          }
          else {
            const expenseItem = new ExpenseItem(
              0,
              expense.amount / userNumForCalc,
              rate,
              expense.title,
              location.title,
              formatDate(this.tourData.startDate + location.startOffset, location.timeOffset),
              expense.type,
            );

            this.expenseCalculator.total.addSub(expense.amount / userNumForCalc, rate);
            this.expenseCalculator.totalInType[expense.type].addSub(expense.amount / userNumForCalc, rate);
            let budgets = new Set(expense.budget)
            for(let budget of budgets){
              this.expenseCalculator.totalInBudget[budget].addSub(expense.amount / userNumForCalc / budgetNumForCalc, rate);
              this.budgetList[budget].data.push(new ExpenseItem(
                  0,
                  expense.amount / userNumForCalc / budgetNumForCalc,
                  rate,
                  expense.title,
                  location.title,
                  formatDate(this.tourData.startDate + location.startOffset, location.timeOffset),
                  expense.type,
                ));
            }

            for(const userId of expense.user){
              const userIndex = this.tourData.users.indexOf(userId);
              const userAmount = expense.amountType == AmountType.Total ? expense.amount / expense.user.length : expense.amount;
              this.expenseCalculator.totalInUser[userIndex].addSub(userAmount,rate);
            }
          
            this.typeList[expense.type].data.push(expenseItem);
            this.locationList[location.index].data.push(expenseItem);
          }
        }
      }
    }
  }

  private dealTransportations(copyIndex: number) {
    const rate = this.currencyExchangeRate;

    for (const transportation of this.tourData.transportations[copyIndex]) {
      this.polyline.segmentTexts.push({ name: transportation.getDurationString(), startIndex: transportation.index, endIndex: transportation.index + 1 });

      for (const expense of transportation.transportExpenses) {
        if(expense.user.includes(this.currentUserId)){
          const userNumForCalc = expense.user && expense.amountType == AmountType.Average ? 1 : expense.user.length;
          const budgetNumForCalc = expense.budget ? expense.budget.length : 1;

          if (expense.currency === this.mainCurrency) {
            const expenseItem = new ExpenseItem(
              expense.amount / userNumForCalc,
              0,
              rate,
              expense.title,
              '',
              formatDate(this.tourData.startDate + transportation.startOffset, transportation.timeOffset),
              expense.type,
            );

            this.expenseCalculator.total.addMain(expense.amount / userNumForCalc, rate);
            this.expenseCalculator.totalInType[expense.type].addMain(expense.amount / userNumForCalc, rate);
            this.expenseCalculator.totalInTransportType[expense.transportType].addMain(expense.amount / userNumForCalc, rate);

            this.typeList[expense.type].data.push(expenseItem);
            let budgets = new Set(expense.budget)
            for(let budget of budgets){
              this.expenseCalculator.totalInBudget[budget].addMain(expense.amount / userNumForCalc / budgetNumForCalc, rate);
              this.budgetList[budget].data.push(new ExpenseItem(
                expense.amount / userNumForCalc / budgetNumForCalc,
                0,
                rate,
                expense.title,
                '',
                formatDate(this.tourData.startDate + transportation.startOffset, transportation.timeOffset),
              ));
            }

            for(const userId of expense.user){
              const userIndex = this.tourData.users.indexOf(userId);
              const userAmount = expense.amountType == AmountType.Total ? expense.amount / expense.user.length : expense.amount;
              this.expenseCalculator.totalInUser[userIndex].addMain(userAmount,rate)
            }
          }
          else {
            const expenseItem = new ExpenseItem(
              0,
              expense.amount / userNumForCalc,
              rate,
              expense.title,
              '',
              formatDate(this.tourData.startDate + transportation.startOffset, transportation.timeOffset),
              expense.type,
            )

            this.expenseCalculator.total.addSub(expense.amount / userNumForCalc, rate);
            this.expenseCalculator.totalInType[expense.type].addSub(expense.amount / userNumForCalc, rate);
            this.expenseCalculator.totalInTransportType[expense.transportType].addSub(expense.amount / userNumForCalc, rate);

            this.typeList[expense.type].data.push(expenseItem);
            let budgets = new Set(expense.budget)
            for(let budget of budgets){
              this.expenseCalculator.totalInBudget[budget].addSub(expense.amount / userNumForCalc / budgetNumForCalc, rate);
              this.budgetList[budget].data.push(new ExpenseItem(
                0,
                expense.amount / userNumForCalc / budgetNumForCalc,
                rate,
                expense.title,
                '',
                formatDate(this.tourData.startDate + transportation.startOffset, transportation.timeOffset),
              ));
            }

            for(const userId of expense.user){
              const userIndex = this.tourData.users.indexOf(userId);
              const userAmount = expense.amountType == AmountType.Total ? expense.amount / expense.user.length : expense.amount;
              this.expenseCalculator.totalInUser[userIndex].addSub(userAmount,rate);
            }
          }
        }
      }
    }
  }

  private updateAllLists() {
    for (const list of this.typeList) {
      list.update();
    }
    for (const list of this.budgetList) {
      list.update();
    }
    for (const list of this.locationList) {
      list.update();
    }
  }
}

export class ExpenseItemList {
  data: ExpenseItem[] = [];
  displayData: any[] = [];
  chartData: any = {};
  mainCurrency: string;
  subCurrency: string;

  constructor(mainCurrency: Currency, subCurrency: Currency) {
    this.mainCurrency = currencyList[mainCurrency].symbol;
    this.subCurrency = currencyList[subCurrency].symbol;
  }

  update() {
    this.sort();
    this.updateDisplayData();
  //  this.updateChartData();
    this.updateEChartData();
  }

  private sort() {
    this.data.sort((a, b) => b.allCurrency - a.allCurrency);
  }

  private updateDisplayData() {
    this.displayData = this.data.map(item => {
      return {
        title: item.title,
        usingCurrency: item.usingCurrencyValue(),
        usingCurrencySymbol: item.isUsingMainCurrency() ? this.mainCurrency : this.subCurrency,
        allCurrency: item.allCurrency
      };
    });
  }

  private updateChartData() {
    const data = this.data.slice(0, 10);
    let res = {
      categories: data.map(item => item.title),
      series: [
        {
          name: "合计消费",
          index: 0,
          data: data.map(item => item.allCurrency)
        },
        {
          name: this.mainCurrency + "消费",
          index: 0,
          data: data.map(item => item.mainCurrency)
        },
        {
          name: this.subCurrency + "消费",
          index: 1,
          data: data.map(item => item.subCurrency)
        }
      ]
    };
    this.chartData = JSON.parse(JSON.stringify(res));
  }

  private updateEChartData(){
    const data = this.data.slice(0, 10);
    let res = [
        {
          name: "合计消费",
          type: 'bar',
          data: data.map(item => item.allCurrency),
          emphasis: {
            focus: 'series'
          },
        },
        {
          name: this.mainCurrency + "消费",
          type: 'bar',
          yAxisIndex: 1,
          // barWidth: 5,
          // stack: '合计消费',
          emphasis: {
            focus: 'series'
          },
          data: data.map(item => item.mainCurrency)
        },
        {
          name: this.subCurrency + "消费",
          type: 'bar',
          yAxisIndex: 2,
          offset: 10,
          // barWidth: 5,
          // stack: '合计消费',
          emphasis: {
            focus: 'series'
          },
          data: data.map(item => item.subCurrency)
        }
      ]
    this.chartData = JSON.parse(JSON.stringify(res));
  }
}

export class ExpenseCalculator {

  users: number[] = [];

  // 总和
  total: ExpenseItem = new ExpenseItem();

  // 按类别分类
  totalInType: ExpenseItem[] = Array(6).fill(null).map(() => new ExpenseItem());

  // 按预算表分类
  totalInBudget: ExpenseItem[] = Array(10).fill(null).map(() => new ExpenseItem());

  // 按交通类别分类
  totalInTransportType: ExpenseItem[] = Array(10).fill(null).map(() => new ExpenseItem());

  //按用户分类
  totalInUser: ExpenseItem[] = Array(10).fill(null).map(() => new ExpenseItem())

  setUsers(users: number[]) {
    this.users = users;
    if (this.totalInUser.length != users.length) {
      this.totalInUser = new Array(users.length).fill(null).map(() => new ExpenseItem());
    }
  }
  getChartDataInType() {
    return getEChartData([
      { value: this.totalInType[0].allCurrency, name: '住宿', labelShow: this.totalInType[0].allCurrency > 0 },
      { value: this.totalInType[1].allCurrency, name: '餐饮', labelShow: this.totalInType[1].allCurrency > 0 },
      { value: this.totalInType[2].allCurrency, name: '交通', labelShow: this.totalInType[2].allCurrency > 0 },
      { value: this.totalInType[3].allCurrency, name: '门票', labelShow: this.totalInType[3].allCurrency > 0 },
      { value: this.totalInType[4].allCurrency, name: '购物', labelShow: this.totalInType[4].allCurrency > 0 },
      { value: this.totalInType[5].allCurrency, name: '其他', labelShow: this.totalInType[5].allCurrency > 0 },
    ]);
  }

  getChartDataInBudget() {
    return getEChartData([
      { value: this.totalInBudget[0].allCurrency, name: '预算表0', labelShow: this.totalInBudget[0].allCurrency > 0 },
      { value: this.totalInBudget[1].allCurrency, name: '预算表1', labelShow: this.totalInBudget[1].allCurrency > 0 },
      { value: this.totalInBudget[2].allCurrency, name: '预算表2', labelShow: this.totalInBudget[2].allCurrency > 0 },
      { value: this.totalInBudget[3].allCurrency, name: '预算表3', labelShow: this.totalInBudget[3].allCurrency > 0 },
      { value: this.totalInBudget[4].allCurrency, name: '预算表4', labelShow: this.totalInBudget[4].allCurrency > 0 },
      { value: this.totalInBudget[5].allCurrency, name: '预算表5', labelShow: this.totalInBudget[5].allCurrency > 0 },
      { value: this.totalInBudget[6].allCurrency, name: '预算表6', labelShow: this.totalInBudget[6].allCurrency > 0 },
      { value: this.totalInBudget[7].allCurrency, name: '预算表7', labelShow: this.totalInBudget[7].allCurrency > 0 },
      { value: this.totalInBudget[8].allCurrency, name: '预算表8', labelShow: this.totalInBudget[8].allCurrency > 0 },
      { value: this.totalInBudget[9].allCurrency, name: '预算表9', labelShow: this.totalInBudget[9].allCurrency > 0 },
    ]);
  }

  getChartDataInTransportType() {
    return getEChartData([
      { value: this.totalInTransportType[0].allCurrency, name: '公交', labelShow: this.totalInTransportType[0].allCurrency > 0 },
      { value: this.totalInTransportType[1].allCurrency, name: '轨交', labelShow: this.totalInTransportType[1].allCurrency > 0 },
      { value: this.totalInTransportType[2].allCurrency, name: '铁路', labelShow: this.totalInTransportType[2].allCurrency > 0 },
      { value: this.totalInTransportType[3].allCurrency, name: '飞机', labelShow: this.totalInTransportType[3].allCurrency > 0 },
      //{ value: this.totalInTransportType[4].allCurrency, name: '步行', labelShow: this.totalInTransportType[4].allCurrency > 0 },
      { value: this.totalInTransportType[5].allCurrency, name: '骑行', labelShow: this.totalInTransportType[5].allCurrency > 0 },
      { value: this.totalInTransportType[6].allCurrency, name: '驾车', labelShow: this.totalInTransportType[6].allCurrency > 0 },
      { value: this.totalInTransportType[7].allCurrency, name: '打车', labelShow: this.totalInTransportType[7].allCurrency > 0 },
      { value: this.totalInTransportType[8].allCurrency, name: '船舶', labelShow: this.totalInTransportType[8].allCurrency > 0 },
      { value: this.totalInTransportType[9].allCurrency, name: '其他', labelShow: this.totalInTransportType[9].allCurrency > 0 },
    ]);
  }
  
  calculateTotalTransportCurrency(): number {
    const total = this.totalInTransportType.reduce((sum, item) => {
      return sum + item.allCurrency;
    }, 0); 
    return total;
  }

  //待修改
  /**
  getChartDataInUser() {
    const data = [];
    for (let i = 0; i < this.users.length; i++) {
      const userId = this.users[i];
      const user = getUserById(userId)
      const expenseItemList = this.totalInUser[i];
      data.push({ value: expenseItemList.allCurrency, name: user.name, labelShow: expenseItemList.allCurrency > 0 });
    }
    return getEChartData(data);
  }
   */
}


export class ExpenseItem {
  mainCurrency: number = 0;
  subCurrency: number = 0;
  allCurrency: number = 0;
  title: string = '';
  from: string = '';
  time: string = '';
  type: string = '';

  constructor(
    mainCurrency?: number,
    subCurrency?: number,
    rate?: number,
    title?: string,
    from?: string,
    time?: string,
    type?: ExpenseType,
  ) {
    this.mainCurrency = mainCurrency ?? 0;
    this.subCurrency = subCurrency ?? 0;
    this.allCurrency = rate ? Number((this.mainCurrency + this.subCurrency * rate).toFixed(2)) : 0;
    this.title = title ?? '';
    this.from = from ?? '';
    this.time = time ?? '';
    this.type = type !== undefined ? expenseList[type].icon : '';
  }

  set(main: number, sub: number, rate: number) {
    this.mainCurrency = main;
    this.subCurrency = sub;
    this.allCurrency = Number((main + sub * rate).toFixed(2));
  }

  addMain(main: number, rate: number) {
    this.mainCurrency += main;
    this.allCurrency = Number((this.mainCurrency + this.subCurrency * rate).toFixed(2));
  }

  addSub(sub: number, rate: number) {
    this.subCurrency += sub;
    this.allCurrency = Number((this.mainCurrency + this.subCurrency * rate).toFixed(2));
  }

  usingCurrencyValue() {
    return this.subCurrency > 0 ? this.subCurrency : this.mainCurrency;
  }

  isUsingMainCurrency() {
    return this.subCurrency === 0;
  }
}
