import { exchangeCurrency, MILLISECONDS } from '../util';
import { Budget } from './budget';
import { Currency, currencyList } from './expense';
import { Location, Transportation } from './tourNode';

export enum TourStatus { Planning, Ongoing, Finished, Cancelled };

export const tourStatusList = [
  { value: TourStatus.Planning, label: '计划中' },
  { value: TourStatus.Ongoing, label: '进行中' },
  { value: TourStatus.Finished, label: '已结束' },
  { value: TourStatus.Cancelled, label: '已取消' }
];

export class Tour {
  id: number;
  title: string;
  status: TourStatus;
  linkedChannel: number;
  channelVisible: boolean;
  linkedGroup: number;
  users: number[];
  startDate: number;
  endDate: number;
  timeOffset: number;
  mainCurrency: Currency;
  subCurrency: Currency;
  currencyExchangeRate: number;
  nodeCopyNames: string[];
  budgets: Budget[];
  locations: Location[][];
  transportations: Transportation[][];

  constructor(data: any) {
    this.id = data.id ?? -1;
    this.title = data.title ?? '新行程';
    this.status = data.status ?? TourStatus.Planning;
    this.linkedChannel = data.linkedChannel ?? -1;
    this.channelVisible = data.channelVisible ?? true;
    this.linkedGroup = data.linkedGroup ?? -1;
    this.users = data.users ?? [];
    this.startDate = data.startDate ?? Date.now();
    this.endDate = data.endDate ?? Date.now();
    this.timeOffset = data.timeOffset ?? -480;
    this.mainCurrency = data.mainCurrency ?? Currency.CNY;
    this.subCurrency = data.subCurrency ?? Currency.JPY;
    this.currencyExchangeRate = data.currencyExchangeRate ?? 1;
    this.nodeCopyNames = data.nodeCopyNames ?? ['默认'];
    this.budgets = (Array.isArray(data.budgets) && data.budgets.length)
      ? data.budgets.map((budget: any) => new Budget(budget))
      : Array.from({ length: 10 }, (_, index) => new Budget({ title: `预算表${index}`, currency: this.mainCurrency }));
    this.locations = (Array.isArray(data.locations) && data.locations.length)
      ? data.locations.map((copy: any[]) => copy.map((location: any) => new Location(location)))
      : [[new Location({ index: 0, startOffset: 0, endOffset: 0, timeOffset: this.timeOffset, })]];
    this.transportations = (Array.isArray(data.transportations) && data.transportations.length)
      ? data.transportations.map((copy: any[]) => copy.map((transportation: any) => new Transportation(transportation)))
      : [[]];
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

  pushLocation(copyIndex: number = 0) {
    const lastLoaction = this.locations[copyIndex][this.locations.length - 1];
    const nextTime = lastLoaction.endOffset + 30 * MILLISECONDS.MINUTE;
    this.transportations[copyIndex].push(
      new Transportation({
        index: this.transportations.length,
        startOffset: lastLoaction.endOffset,
        endOffset: nextTime,
        timeOffset: this.timeOffset
      })
    );
    this.locations[copyIndex].push(
      new Location({
        index: this.locations.length,
        startOffset: nextTime,
        endOffset: nextTime,
        timeOffset: this.timeOffset
      })
    );
    this.locations[copyIndex][this.locations.length - 1].setPosition(lastLoaction.longitude, lastLoaction.latitude);
  }

  insertLocation(index: number, copyIndex: number = 0) {
    if (index == this.locations.length - 1) {
      this.pushLocation(copyIndex);
      return;
    }
    this.locations.splice(index + 1, 0, new Array<Location>());
    this.transportations.splice(index + 1, 0, new Array<Transportation>());
    for (let i = index + 1; i < this.locations.length; i++) {
      this.locations[copyIndex][i].index = i;
      this.transportations[copyIndex][i].index = i;
    }
    this.locations[copyIndex][index + 1].startOffset = this.transportations[copyIndex][index].endOffset;
    this.locations[copyIndex][index + 1].endOffset = this.locations[copyIndex][index + 1].startOffset + 30 * MILLISECONDS.MINUTE;
    this.transportations[copyIndex][index + 1].startOffset = this.locations[copyIndex][index + 1].startOffset;
    this.transportations[copyIndex][index + 1].endOffset = this.locations[copyIndex][index + 1].endOffset;
  }

  removeLocation(index: number, copyIndex: number = 0) {
    if (index == 0 || this.locations.length <= 1) {
      return;
    }
    if (index == this.locations.length - 1) {
      this.locations[copyIndex].pop();
      this.transportations[copyIndex].pop();
      return;
    }
    this.locations.splice(index, 1);
    this.transportations.splice(index, 1);
    for (let i = index; i < this.transportations.length; i++) {
      this.locations[copyIndex][i].index = i;
      this.transportations[copyIndex][i].index = i;
    }
    this.locations[copyIndex][this.locations.length - 1].index = this.locations.length - 1;
    this.locations[copyIndex][index].startOffset = this.transportations[copyIndex][index - 1].endOffset;
  }

  toString(): string {
    return JSON.stringify(this);
  }

  static fromString(serializedString: string): Tour {
    const obj = JSON.parse(serializedString);
    return new Tour(obj);
  }
};
