import { exchangeCurrency, MILLISECONDS } from '../util';
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
  locations: Location[];
  transportations: Transportation[];

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
    this.locations = data.locations ? data.locations.map((location: any) => new Location(location)) : [new Location({
      index: 0,
      startOffset: 0,
      endOffset: 0,
      timeOffset: this.timeOffset
    })];
    this.transportations = data.transportations ? data.transportations.map((transportation: any) => new Transportation(transportation)) : [];
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
      new Transportation({
        index: this.transportations.length,
        startOffset: lastLoaction.endOffset,
        endOffset: nextTime,
        timeOffset: this.timeOffset
      })
    );
    this.locations.push(
      new Location({
        index: this.locations.length,
        startOffset: nextTime,
        endOffset: nextTime,
        timeOffset: this.timeOffset
      })
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
