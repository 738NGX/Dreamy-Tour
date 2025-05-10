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

export class TourBasic {
  id: number;
  title: string;
  status: TourStatus;
  linkedChannel: number;
  channelVisible: boolean;
  linkedGroup: number;
  startDate: number;
  endDate: number;
  timeOffset: number;
  mainCurrency: Currency;
  subCurrency: Currency;
  currencyExchangeRate: number;
  constructor(data: any) {
    this.id = data.id ?? -1;
    this.title = data.title ?? '新行程';
    this.status = data.status ?? TourStatus.Planning;
    this.linkedChannel = data.linkedChannel ?? -1;
    this.channelVisible = data.channelVisible ?? true;
    this.linkedGroup = data.linkedGroup ?? -1;
    this.startDate = data.startDate ?? Date.now();
    this.endDate = data.endDate ?? Date.now() + MILLISECONDS.DAY;
    this.timeOffset = data.timeOffset ?? -480;
    this.mainCurrency = data.mainCurrency ?? Currency.CNY;
    this.subCurrency = data.subCurrency ?? Currency.JPY;
    this.currencyExchangeRate = data.currencyExchangeRate ?? 1;
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
}

export class Tour extends TourBasic {
  users: number[];
  nodeCopyNames: string[];
  budgets: Budget[];
  locations: Location[][];
  transportations: Transportation[][];

  constructor(data: any) {
    super(data);
    this.users = data.users ?? [];
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

  pushLocation(copyIndex: number = 0) {
    const lastLoaction = this.locations[copyIndex][this.locations[copyIndex].length - 1];
    const nextTime = lastLoaction.endOffset + 30 * MILLISECONDS.MINUTE;
    this.transportations[copyIndex].push(
      new Transportation({
        index: this.transportations[copyIndex].length,
        startOffset: lastLoaction.endOffset,
        endOffset: nextTime,
        timeOffset: this.timeOffset
      })
    );
    this.locations[copyIndex].push(
      new Location({
        index: this.locations[copyIndex].length,
        startOffset: nextTime,
        endOffset: nextTime,
        timeOffset: this.timeOffset
      })
    );
    this.locations[copyIndex][this.locations[copyIndex].length - 1].setPosition(lastLoaction.longitude, lastLoaction.latitude);
  }

  insertLocation(index: number, copyIndex: number = 0) {
    const locArr = this.locations[copyIndex];
    const transArr = this.transportations[copyIndex];

    if (index === locArr.length - 1) {
      this.pushLocation(copyIndex);
      return;
    }

    if (index === locArr.length - 2) {
      const lastTrans = transArr[index];
      const midOffset = (lastTrans.startOffset + lastTrans.endOffset) / 2;

      const newLoc = new Location({
        index: index + 1,
        startOffset: lastTrans.startOffset,
        endOffset: midOffset,
        timeOffset: this.timeOffset
      });
      lastTrans.endOffset = midOffset;
      const newTrans = new Transportation({
        index: index + 1,
        startOffset: midOffset,
        endOffset: lastTrans.endOffset,  // 这里使用拆分前的 lastTrans.endOffset 已经被更新，所以可直接使用 midOffset
        timeOffset: this.timeOffset
      });

      locArr.splice(index + 1, 0, newLoc);
      transArr.splice(index + 1, 0, newTrans);

      for (let i = index + 1; i < locArr.length; i++) {
        locArr[i].index = i;
      }
      for (let i = index + 1; i < transArr.length; i++) {
        transArr[i].index = i;
      }

      newLoc.setPosition(
        locArr[index].longitude,
        locArr[index].latitude
      );
      return;
    }

    if (index + 1 < transArr.length) {
      const newLoc = new Location({
        index: index + 1,
        startOffset: transArr[index].endOffset,
        endOffset: transArr[index + 1].startOffset,
        timeOffset: this.timeOffset
      });
      const newTrans = new Transportation({
        index: index + 1,
        startOffset: transArr[index].endOffset,
        endOffset: transArr[index + 1].startOffset,
        timeOffset: this.timeOffset
      });

      locArr.splice(index + 1, 0, newLoc);
      transArr.splice(index + 1, 0, newTrans);

      for (let i = index + 1; i < locArr.length; i++) {
        locArr[i].index = i;
      }
      for (let i = index + 1; i < transArr.length; i++) {
        transArr[i].index = i;
      }

      newLoc.setPosition(
        locArr[index].longitude,
        locArr[index].latitude
      );
    }
  }

  async removeLocation(index: number, copyIndex: number = 0) {
    if (index == 0 || this.locations[copyIndex].length <= 1) {
      return;
    }
    this.locations[copyIndex][index].photos = [];
    await getApp<IAppOption>().changeTourLocationPhotos(this.id, copyIndex, this.locations[copyIndex][index]);
    if (index == this.locations[copyIndex].length - 1) {
      this.locations[copyIndex].pop();
      this.transportations[copyIndex].pop();
      return;
    }
    this.locations[copyIndex].splice(index, 1);
    this.transportations[copyIndex].splice(index, 1);
    for (let i = index - 1; i < this.transportations[copyIndex].length; i++) {
      this.locations[copyIndex][i].index = i;
      this.transportations[copyIndex][i].index = i;
    }
    this.locations[copyIndex][this.locations[copyIndex].length - 1].index = this.locations[copyIndex].length - 1;
    this.locations[copyIndex][index].startOffset = this.transportations[copyIndex][index - 1].endOffset;
  }

  pullCopy() {
    this.nodeCopyNames.push(`新行程版本`);
    this.locations.push(
      this.locations[0].map(
        (location: Location) => new Location({ ...location, photos: [] })
      )
    );
    this.transportations.push(
      this.transportations[0].map(
        (transportation: Transportation) => new Transportation({ ...transportation })
      )
    );
  }

  addCopy() {
    this.nodeCopyNames.push(`新行程版本`);
    this.locations.push([new Location({ ...this.locations[0][0], photos: [] })]);
    this.transportations.push([]);
  }

  async removeCopy(index: number) {
    if (this.nodeCopyNames.length <= 1) {
      return;
    }
    this.nodeCopyNames.splice(index, 1);
    // 删除locations中的所有照片
    for (const loc of this.locations[index]) {
      loc.photos = [];
      await getApp<IAppOption>().changeTourLocationPhotos(this.id, index, loc);
    }
    this.locations.splice(index, 1);
    this.transportations.splice(index, 1);
  }

  deleteUser(id: number) {
    const index = this.users.indexOf(id);
    if (index >= 0) {
      this.users.splice(index, 1);
    }
    for (const locArr of this.locations) {
      for (const loc of locArr) { loc.deleteUser(id); }
    }
    for (const transArr of this.transportations) {
      for (const trans of transArr) { trans.deleteUser(id); }
    }
  }

  toString(): string {
    return JSON.stringify(this);
  }

  static fromString(serializedString: string): Tour {
    const obj = JSON.parse(serializedString);
    return new Tour(obj);
  }
};
