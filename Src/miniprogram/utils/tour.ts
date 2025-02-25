import { exchangeCurrency, MILLISECONDS } from './util';

export enum TransportType { Bus, Metro, Train, Flight, Walk, Cycle, Car, Taxi, Ship, Other };
export enum Currency { CNY, USD, EUR, JPY, HKD, MOP,TWD,GBP,KRW,SGD,THB,RUB,CAD,INR,AUD,VND };
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

export const timezoneList = [
    { label: 'UTC-12(IDLW:国际换日线)', value: 720 },
    { label: 'UTC-11(SST:美属萨摩亚标准时间)', value: 660 },
    { label: 'UTC-10(HST:夏威夷标准时间)', value: 600 },
    { label: 'UTC-9:30(MIT:马克萨斯群岛标准时间)', value: 570 },
    { label: 'UTC-9(AKST:阿拉斯加标准时间)', value: 540 },
    { label: 'UTC-8(PST:太平洋标准时间)', value: 480 },
    { label: 'UTC-7(MST:山地标准时间)', value: 420 },
    { label: 'UTC-6(CST:中部标准时间)', value: 360 },
    { label: 'UTC-5(EST:东部标准时间)', value: 300 },
    { label: 'UTC-4(AST:大西洋标准时间)', value: 240 },
    { label: 'UTC-3:30(NST:纽芬兰标准时间)', value: 210 },
    { label: 'UTC-3(BRT:巴西利亚标准时间)', value: 180 },
    { label: 'UTC-2(FNT:中大西洋标准时间)', value: 120 },
    { label: 'UTC-1(CVT:佛得角标准时间)', value: 60 },
    { label: 'UTC+0(GMT:格林尼治标准时间)', value: 0 },
    { label: 'UTC+1(CET:中欧标准时间)', value: -60 },
    { label: 'UTC+2(EET:东欧标准时间)', value: -120 },
    { label: 'UTC+3(MSK:莫斯科标准时间)', value: -180 },
    { label: 'UTC+3:30(IRST:伊朗标准时间)', value: -210 },
    { label: 'UTC+4(GST:波斯湾标准时间)', value: -240 },
    { label: 'UTC+4:30(AFT:阿富汗标准时间)', value: -270 },
    { label: 'UTC+5(PKT:巴基斯坦标准时间)', value: -300 },
    { label: 'UTC+5:30(IST:印度标准时间)', value: -330 },
    { label: 'UTC+5:45(NPT:尼泊尔标准时间)', value: -345 },
    { label: 'UTC+6(BST:孟加拉标准时间)', value: -360 },
    { label: 'UTC+6:30(MMT:缅甸标准时间)', value: -390 },
    { label: 'UTC+7(ICT:中南半岛标准时间)', value: -420 },
    { label: 'UTC+8(CST:中国标准时间)', value: -480 },
    { label: 'UTC+9(JST:日本标准时间)', value: -540 },
    { label: 'UTC+9:30(ACST:澳大利亚中部标准时间)', value: -570 },
    { label: 'UTC+10(AEST:澳大利亚东部标准时间)', value: -600 },
    { label: 'UTC+10:30(LHST:豪勋爵群岛标准时间)', value: -630 },
    { label: 'UTC+11(NFT:诺福克岛标准时间)', value: -660 },
    { label: 'UTC+12(NZST:新西兰标准时间)', value: -720 },
    { label: 'UTC+12:45(CHAST:查塔姆群岛标准时间)', value: -765 },
    { label: 'UTC+13(PET:太平洋标准时间)', value: -780 },
    { label: 'UTC+14(LINT:莱恩群岛标准时间)', value: -840 },
];

/**
 * 行程类
 */
export class Tour {
    // 基本信息
    id: number;
    title: string;
    // 日期信息
    startDate: number;
    endDate: number;
    timeOffset: number;
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
        startDate?: number,
        endDate?: number,
        timeOffset?: number,
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
            this.timeOffset = timeOffset ? timeOffset : -480;
            this.mainCurrency = mainCurrency ? mainCurrency : Currency.CNY;
            this.subCurrency = subCurrency ? subCurrency : Currency.JPY;
            this.currencyExchangeRate = 1;
            this.locations = locations ? locations : [new Location(0, 0, 0, this.timeOffset)];
            this.transportations = transportations ? transportations : [];
        } else {
            const data = idOrData;
            this.id = data.id;
            this.title = data.title;
            this.startDate = data.startDate;
            this.endDate = data.endDate;
            this.timeOffset = data.timeOffset;
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
        const nextTime = lastLoaction.endOffset + 30 * MILLISECONDS.MINUTE;
        this.transportations.push(
            new Transportation(this.transportations.length, lastLoaction.endOffset, nextTime, this.timeOffset)
        );
        this.locations.push(
            new Location(this.locations.length, nextTime, nextTime, this.timeOffset)
        );
        this.locations[this.locations.length - 1].setPosition(lastLoaction.longitude, lastLoaction.latitude);
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
        this.locations[index].startOffset = this.transportations[index - 1].endOffset;
    }

    toString(): string {
        return JSON.stringify(this);
    }

    static fromString(serializedString: string): Tour {
        const obj = JSON.parse(serializedString);
        return new Tour(obj);
    }
};

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

    constructor(dataOrIndex: any, startOffset?: number, endOffset?: number, timeOffset?: number) {
        let index: number;
        let start: number;
        let end: number;
        let offset: number;
        let title: string = '';
        let note: string = '';
        let longitude: number = 121.496300;
        let latitude: number = 31.307627;
        let expenses: Expense[] = [];

        if (typeof dataOrIndex === 'number') {
            index = dataOrIndex;
            start = startOffset!;
            end = endOffset!;
            offset = timeOffset!;
        } else {
            const data = dataOrIndex;
            index = data.index;
            start = data.startOffset;
            end = data.endOffset;
            offset = data.timeOffset;
            title = data.title;
            note = data.note;
            longitude = data.longitude;
            latitude = data.latitude;
            expenses = data.expenses.map((expense: any) => new Expense(expense));
        }
        super(index, start, end, offset);
        this.title = title;
        this.longitude = longitude;
        this.latitude = latitude;
        this.expenses = expenses;
        this.note = note;
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

    constructor(dataOrIndex: any, startOffset?: number, endOffset?: number, timeOffset?: number) {
        let index: number;
        let start: number;
        let end: number;
        let offset: number;
        let expenses: TransportExpense[] = [];

        if (typeof dataOrIndex === 'number') {
            index = dataOrIndex;
            start = startOffset!;
            end = endOffset!;
            offset = timeOffset!;
        } else {
            const data = dataOrIndex;
            index = data.index;
            start = data.startOffset;
            end = data.endOffset;
            offset = data.timeOffset;
            expenses = data.transportExpenses.map((expense: any) => new TransportExpense(expense));
        }
        super(index, start, end, offset);
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
