import { Currency, currencyList, ExpenseType, expenseList } from "../tour/expense";
import { getEChartData } from "../util";

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
  /** 
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
  */
  //返回前十条消费数据，利用JSON进行深拷贝
  private updateEChartData() {
    const data = this.data.slice(0, 10);
    let res = {
      categories: data.map(item => item.title),
      series: [
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
        emphasis: {
        focus: 'series'
        },
        data: data.map(item => item.subCurrency)
      }
      ]
    };
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

  getChartDataInBudget(nameList: string[]) {
    return getEChartData([
      { value: this.totalInBudget[0].allCurrency, name: nameList[0], labelShow: this.totalInBudget[0].allCurrency > 0 },
      { value: this.totalInBudget[1].allCurrency, name: nameList[1], labelShow: this.totalInBudget[1].allCurrency > 0 },
      { value: this.totalInBudget[2].allCurrency, name: nameList[2], labelShow: this.totalInBudget[2].allCurrency > 0 },
      { value: this.totalInBudget[3].allCurrency, name: nameList[3], labelShow: this.totalInBudget[3].allCurrency > 0 },
      { value: this.totalInBudget[4].allCurrency, name: nameList[4], labelShow: this.totalInBudget[4].allCurrency > 0 },
      { value: this.totalInBudget[5].allCurrency, name: nameList[5], labelShow: this.totalInBudget[5].allCurrency > 0 },
      { value: this.totalInBudget[6].allCurrency, name: nameList[6], labelShow: this.totalInBudget[6].allCurrency > 0 },
      { value: this.totalInBudget[7].allCurrency, name: nameList[7], labelShow: this.totalInBudget[7].allCurrency > 0 },
      { value: this.totalInBudget[8].allCurrency, name: nameList[8], labelShow: this.totalInBudget[8].allCurrency > 0 },
      { value: this.totalInBudget[9].allCurrency, name: nameList[9], labelShow: this.totalInBudget[9].allCurrency > 0 },
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