import { formatDate } from './util';

export enum TransportType { None, Bus, Metro, Train, Flight, Walk, Cycle, Car, Taxi, Ship, Other };
export enum Currency { CNY, USD, EUR, JPY, HKD };
export enum ExpenseType { Accommodation, Meal, Transportation, Ticket, Shopping, Other };

export const currencyList = [
    { label: '人民币-CNY', value: Currency.CNY },
    { label: '美元-USD', value: Currency.USD },
    { label: '日元-JPY', value: Currency.JPY },
    { label: '欧元-EUR', value: Currency.EUR },
    { label: '港币-HKD', value: Currency.HKD },
];

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
    // 节点信息
    locations: Location[];
    transportations: Transportation[];

    constructor(
        id: number,
        title: string,
        startDate: Date,
        endDate: Date,
        mainCurrency?: Currency,
        subCurrency?: Currency,
        locations?: Location[],
        transportations?: Transportation[]
    ) {
        this.id = id;
        this.title = title;
        this.startDate = startDate;
        this.endDate = endDate;
        this.startDateStr = formatDate(startDate);
        this.endDateStr = formatDate(endDate);
        this.mainCurrency = mainCurrency ? mainCurrency : Currency.CNY;
        this.subCurrency = subCurrency ? subCurrency : Currency.JPY;
        this.locations = locations ? locations : [new Location(0, startDate, startDate)];
        this.transportations = transportations ? transportations : [];
    }

    addLocation() {
        const lastLoaction = this.locations[this.locations.length - 1];
        const nextTime = new Date(lastLoaction.endDate.getTime() + 1000 * 30 * 60);
        this.transportations.push(new Transportation(this.transportations.length, lastLoaction.endDate, nextTime));
        this.locations.push(new Location(this.locations.length, nextTime, nextTime));
    }
};

/**
 * 行程节点类
 */
export class TourNode {
    index: number;
    startDate: Date;
    endDate: Date;
    note: string = '';
    expenses: Expense[];

    constructor(index: number, startDate: Date, endDate: Date, expenses?: Expense[]) {
        this.index = index;
        this.startDate = startDate;
        this.endDate = endDate;
        this.expenses = expenses ? expenses : [];
    }

    getDuration() {
        const duration = this.endDate.getTime() - this.startDate.getTime();
        const days = Math.floor(duration / (1000 * 60 * 60 * 24));
        const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
        return { 'days': days, 'hours': hours, 'minutes': minutes };
    }

    getDurationValue() {
        return this.endDate.getTime() - this.startDate.getTime();
    }
};

/**
 * 位置节点类
 */
export class Location extends TourNode {
    title: string = '';
    longitude: number = 0.0;
    latitude: number = 0.0;

    setPosition(longitude: number, latitude: number) {
        this.longitude = longitude;
        this.latitude = latitude;
    }
};

/**
 * 交通节点类
 */
export class Transportation extends TourNode {
    type: TransportType = TransportType.None;

    setTransportType(type: TransportType) {
        this.type = type;
    }
};

/**
 * 消费类
 */
export class Expense {
    title: string;
    amount: number;
    currency: Currency;
    type: ExpenseType;
    note: string = '';

    constructor(title: string, amount: number, currency: Currency, type?: ExpenseType) {
        this.title = title;
        this.amount = amount;
        this.currency = currency;
        this.type = type ? type : ExpenseType.Other;
    }
}