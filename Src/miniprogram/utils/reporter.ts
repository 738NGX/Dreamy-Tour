import { Tour, Currency, currencyList } from './tour';
import { getChartData } from './util';

export class Reporter {
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
    tagList: ExpenseItemList[];

    constructor(tour: Tour) {
        this.tourData = tour;

        this.currencyExchangeRate = tour.currencyExchangeRate;
        this.mainCurrency = tour.mainCurrency;
        this.subCurrency = tour.subCurrency;

        this.typeList = Array(6).fill(null).map(() =>
            new ExpenseItemList(this.mainCurrency, this.subCurrency)
        );
        this.tagList = Array(10).fill(null).map(() =>
            new ExpenseItemList(this.mainCurrency, this.subCurrency)
        );

        this.expenseCalculator = new ExpenseCalculator();

        this.dealLocations();
        this.dealTransportations();
        this.updateAllLists();
    }

    private dealLocations() {
        const rate = this.currencyExchangeRate;

        for (const location of this.tourData.locations) {
            for (const expense of location.expenses) {
                if (expense.currency === this.mainCurrency) {
                    this.expenseCalculator.total.addMain(expense.amount, rate);
                    this.expenseCalculator.totalInType[expense.type].addMain(expense.amount, rate);
                    this.expenseCalculator.totalInTag[expense.tag].addMain(expense.amount, rate);

                    this.typeList[expense.type].data.push(new ExpenseItem(expense.amount, 0, rate, expense.title, location.title, location.startDateStr));
                    this.tagList[expense.tag].data.push(new ExpenseItem(expense.amount, 0, rate, expense.title, location.title, location.startDateStr));
                }
                else {
                    this.expenseCalculator.total.addSub(expense.amount, rate);
                    this.expenseCalculator.totalInType[expense.type].addSub(expense.amount, rate);
                    this.expenseCalculator.totalInTag[expense.tag].addSub(expense.amount, rate);

                    this.typeList[expense.type].data.push(new ExpenseItem(0, expense.amount, rate, expense.title, location.title, location.startDateStr));
                    this.tagList[expense.tag].data.push(new ExpenseItem(0, expense.amount, rate, expense.title, location.title, location.startDateStr));
                }
            }
        }
    }

    private dealTransportations() {
        const rate = this.currencyExchangeRate;

        for (const transportation of this.tourData.transportations) {
            for (const expense of transportation.transportExpenses) {
                if (expense.currency === this.mainCurrency) {
                    this.expenseCalculator.total.addMain(expense.amount, rate);
                    this.expenseCalculator.totalInType[expense.type].addMain(expense.amount, rate);
                    this.expenseCalculator.totalInTransportType[expense.transportType].addMain(expense.amount, rate);
                    this.expenseCalculator.totalInTag[expense.tag].addMain(expense.amount, rate);

                    this.typeList[expense.type].data.push(new ExpenseItem(expense.amount, 0, rate, expense.title, '', transportation.startDateStr));
                    this.tagList[expense.tag].data.push(new ExpenseItem(expense.amount, 0, rate, expense.title, '', transportation.startDateStr));
                }
                else {
                    this.expenseCalculator.total.addSub(expense.amount, rate);
                    this.expenseCalculator.totalInType[expense.type].addSub(expense.amount, rate);
                    this.expenseCalculator.totalInTransportType[expense.transportType].addSub(expense.amount, rate);
                    this.expenseCalculator.totalInTag[expense.tag].addSub(expense.amount, rate);

                    this.typeList[expense.type].data.push(new ExpenseItem(0, expense.amount, rate, expense.title, '', transportation.startDateStr));
                    this.tagList[expense.tag].data.push(new ExpenseItem(0, expense.amount, rate, expense.title, '', transportation.startDateStr));
                }
            }
        }
    }

    private updateAllLists() {
        for (const list of this.typeList) {
            list.update();
        }
        for (const list of this.tagList) {
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
        this.updateChartData();
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
}

export class ExpenseCalculator {
    // 总和
    total: ExpenseItem = new ExpenseItem();

    // 按类别分类
    totalInType: ExpenseItem[] = Array(6).fill(null).map(() => new ExpenseItem());

    // 按标签分类
    totalInTag: ExpenseItem[] = Array(10).fill(null).map(() => new ExpenseItem());

    // 按交通类别分类
    totalInTransportType: ExpenseItem[] = Array(10).fill(null).map(() => new ExpenseItem());

    getChartDataInType() {
        return getChartData([
            { value: this.totalInType[0].allCurrency, name: '住宿', labelShow: this.totalInType[0].allCurrency > 0 },
            { value: this.totalInType[1].allCurrency, name: '餐饮', labelShow: this.totalInType[1].allCurrency > 0 },
            { value: this.totalInType[2].allCurrency, name: '交通', labelShow: this.totalInType[2].allCurrency > 0 },
            { value: this.totalInType[3].allCurrency, name: '门票', labelShow: this.totalInType[3].allCurrency > 0 },
            { value: this.totalInType[4].allCurrency, name: '购物', labelShow: this.totalInType[4].allCurrency > 0 },
            { value: this.totalInType[5].allCurrency, name: '其他', labelShow: this.totalInType[5].allCurrency > 0 },
        ]);
    }

    getChartDataInTag() {
        return getChartData([
            { value: this.totalInTag[0].allCurrency, name: '未标签', labelShow: this.totalInTag[0].allCurrency > 0 },
            { value: this.totalInTag[1].allCurrency, name: '1', labelShow: this.totalInTag[1].allCurrency > 0 },
            { value: this.totalInTag[2].allCurrency, name: '2', labelShow: this.totalInTag[2].allCurrency > 0 },
            { value: this.totalInTag[3].allCurrency, name: '3', labelShow: this.totalInTag[3].allCurrency > 0 },
            { value: this.totalInTag[4].allCurrency, name: '4', labelShow: this.totalInTag[4].allCurrency > 0 },
            { value: this.totalInTag[5].allCurrency, name: '5', labelShow: this.totalInTag[5].allCurrency > 0 },
            { value: this.totalInTag[6].allCurrency, name: '6', labelShow: this.totalInTag[6].allCurrency > 0 },
            { value: this.totalInTag[7].allCurrency, name: '7', labelShow: this.totalInTag[7].allCurrency > 0 },
            { value: this.totalInTag[8].allCurrency, name: '8', labelShow: this.totalInTag[8].allCurrency > 0 },
            { value: this.totalInTag[9].allCurrency, name: '9', labelShow: this.totalInTag[9].allCurrency > 0 },
        ]);
    }

    getChartDataInTransportType() {
        return getChartData([
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
}

export class ExpenseItem {
    mainCurrency: number = 0;
    subCurrency: number = 0;
    allCurrency: number = 0;
    title: string = '';
    from: string = '';
    time: string = '';

    constructor(
        mainCurrency?: number,
        subCurrency?: number,
        rate?: number,
        title?: string,
        from?: string,
        time?: string
    ) {
        this.mainCurrency = mainCurrency || 0;
        this.subCurrency = subCurrency || 0;
        this.allCurrency = rate ? Number((this.mainCurrency + this.subCurrency * rate).toFixed(2)) : 0;
        this.title = title || '';
        this.from = from || '';
        this.time = time || '';
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