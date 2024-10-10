import { formatDate, formatTime, MILLISECONDS,exchangeCurrency } from './util';

export enum TransportType { Bus, Metro, Train, Flight, Walk, Cycle, Car, Taxi, Ship, Other };
export enum Currency { CNY, USD, EUR, JPY, HKD };
export enum ExpenseType { Hotel, Meal, Transportation, Ticket, Shopping, Other };

export const currencyList = [
    { label: '人民币-CNY', symbol: 'CNY', value: Currency.CNY },
    { label: '美元-USD', symbol: 'USD', value: Currency.USD },
    { label: '欧元-EUR', symbol: 'EUR', value: Currency.EUR },
    { label: '日元-JPY', symbol: 'JPY', value: Currency.JPY },
    { label: '港币-HKD', symbol: 'HKD', value: Currency.HKD },
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
    { value: 0, color: 'fbfbfb' },
    { value: 1, color: 'ff9547' },
    { value: 2, color: 'ff9eac' },
    { value: 3, color: '27c1b7' },
    { value: 4, color: 'db0839' },
    { value: 5, color: '66c0ff' },
    { value: 6, color: 'c1cad4' },
    { value: 7, color: 'ffd010' },
    { value: 8, color: 'c252c6' },
    { value: 9, color: 'ff6fbe' },
]

/**
 * 行程类
 */
export class Tour {
    // 基本信息
    id: number;
    title: string;
    // 日期信息
    startDate: Date;
    endDate: Date;
    startDateStr: String;
    endDateStr: String;
    // 货币信息
    mainCurrency: Currency;
    subCurrency: Currency;
    currencyExchangeRate: number;
    // 节点信息
    locations: Location[];
    transportations: Transportation[];

    constructor(
        idOrData: number | any,
        title?: string,
        startDate?: Date,
        endDate?: Date,
        mainCurrency?: Currency,
        subCurrency?: Currency,
        locations?: Location[],
        transportations?: Transportation[]
    ) {
        if (typeof idOrData === 'number') {
            this.id = idOrData;
            this.title = title!;
            this.startDate = startDate!;
            this.endDate = endDate!;
            this.startDateStr = formatDate(startDate!);
            this.endDateStr = formatDate(endDate!);
            this.mainCurrency = mainCurrency ? mainCurrency : Currency.CNY;
            this.subCurrency = subCurrency ? subCurrency : Currency.JPY;
            this.currencyExchangeRate = 1;
            this.locations = locations ? locations : [new Location(0, startDate!, startDate!)];
            this.transportations = transportations ? transportations : [];
        } else {
            const data = idOrData;
            this.id = data.id;
            this.title = data.title;
            this.startDate = new Date(data.startDate);
            this.endDate = new Date(data.endDate);
            this.startDateStr = formatDate(this.startDate);
            this.endDateStr = formatDate(this.endDate);
            this.mainCurrency = data.mainCurrency;
            this.subCurrency = data.subCurrency;
            this.currencyExchangeRate = data.currencyExchangeRate;
            this.locations = data.locations.map((location: any) => new Location(location));
            this.transportations = data.transportations.map((transportation: any) => new Transportation(transportation));
        }
    }

    async getExchangeRate() {
        try {
            const rate = await exchangeCurrency(
                1,
                currencyList[this.subCurrency].symbol,
                currencyList[this.mainCurrency].symbol
            );
            this.currencyExchangeRate = rate as number;
        } catch (err) {
            console.error('Error:', err);
        }
    }

    addLocation() {
        const lastLoaction = this.locations[this.locations.length - 1];
        const nextTime = new Date(lastLoaction.endDate.getTime() + 1000 * 30 * 60);
        this.transportations.push(new Transportation(this.transportations.length, lastLoaction.endDate, nextTime));
        this.locations.push(new Location(this.locations.length, nextTime, nextTime));
    }

    removeLocation(index: number) {
        if (index == 0 || this.locations.length <= 1) {
            return;
        }
        if (index == this.locations.length - 1) {
            this.locations.pop();
            this.transportations.pop();
            return;
        }
        this.locations.splice(index, 1);
        this.transportations.splice(index, 1);
        for (let i = index; i < this.transportations.length; i++) {
            this.locations[i].index = i;
            this.transportations[i].index = i;
        }
        this.locations[this.locations.length - 1].index = this.locations.length - 1;
        this.locations[index].startDate = this.transportations[index - 1].endDate;
        this.locations[index].startDateStr = formatTime(this.locations[index].startDate);
        this.locations[index].updateDuration();
    }
};

/**
 * 行程节点类
 */
export class TourNode {
    index: number;
    startDate: Date;
    endDate: Date;
    startDateStr: string = '';
    endDateStr: string = '';
    duration: number = 0;
    durationStr: string = '';
    note: string = '';

    constructor(index: number, startDate: Date, endDate: Date) {
        this.index = index;
        this.startDate = startDate;
        this.endDate = endDate;
        this.startDateStr = formatTime(startDate);
        this.endDateStr = formatTime(endDate);
        this.updateDuration();
    }

    updateDuration() {
        this.duration = this.endDate.getTime() - this.startDate.getTime();
        const hours = Math.floor(this.duration / MILLISECONDS.HOUR);
        const minutes = Math.floor(this.duration % MILLISECONDS.HOUR / MILLISECONDS.MINUTE);
        if (this.duration < 0) {
            this.durationStr = '结束时间早于开始时间';
        }
        else if (hours > 0) {
            this.durationStr = hours + '小时' + minutes + '分钟';
        }
        else {
            this.durationStr = minutes + '分钟';
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

    constructor(dataOrIndex: any, startDate?: Date, endDate?: Date) {
        let index: number;
        let start: Date;
        let end: Date;
        let title: string = '';
        let longitude: number = 121.496300;
        let latitude: number = 31.307627;
        let expenses: Expense[] = [];

        if (typeof dataOrIndex === 'number') {
            index = dataOrIndex;
            start = startDate!;
            end = endDate!;
        } else {
            const data = dataOrIndex;
            index = data.index;
            start = new Date(data.startDate);
            end = new Date(data.endDate);
            title = data.title;
            longitude = data.longitude;
            latitude = data.latitude;
            expenses = data.expenses.map((expense: any) => new Expense(expense));
        }
        super(index, start, end);
        this.title = title;
        this.longitude = longitude;
        this.latitude = latitude;
        this.expenses = expenses;
    }

    setPosition(longitude: number, latitude: number) {
        this.longitude = longitude;
        this.latitude = latitude;
    }

    addExpense(currency: Currency) {
        this.expenses.push(
            new Expense(this.expenses.length, currency, ExpenseType.Other)
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

    constructor(dataOrIndex: any, startDate?: Date, endDate?: Date) {
        let index: number;
        let start: Date;
        let end: Date;
        let expenses: TransportExpense[] = [];

        if (typeof dataOrIndex === 'number') {
            index = dataOrIndex;
            start = startDate!;
            end = endDate!;
        } else {
            const data = dataOrIndex;
            index = data.index;
            start = new Date(data.startDate);
            end = new Date(data.endDate);
            expenses = data.transportExpenses.map((expense: any) => new TransportExpense(expense));
        }
        super(index, start, end);
        this.transportExpenses = expenses;
    }

    addTransportExpense(currency: Currency) {
        this.transportExpenses.push(
            new TransportExpense(this.transportExpenses.length, currency, TransportType.Other)
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