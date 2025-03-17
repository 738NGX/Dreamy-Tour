//===============================================
/**
 * @@@@@@@@@@@@@@ :用以区分模块子功能  
 * 行程查看模块
 * 继承自行程编辑模块，删除了编辑功能，在足迹中进行信息展示
 */
//===============================================
import {
  CDN_PATH,
  PLUGIN_KEY
} from '../../config/appConfig';
if (PLUGIN_KEY) {
  const QQMapWX = require('../../components/qqmap-wx-jssdk');
  const qqmapsdk = new QQMapWX({
    key: PLUGIN_KEY // 必填
  });
  qqmapsdk
}
import { Location, Transportation } from '../../utils/tour/tourNode';
import { Tour } from '../../utils/tour/tour';
import { transportList, expenseList, budgetList, TransportExpense, currencyList } from '../../utils/tour/expense';
import { timezoneList } from '../../utils/tour/timezone';
import { MILLISECONDS, formatDate, formatTime } from '../../utils/util';
import { isSameDate } from '../../miniprogram_npm/tdesign-miniprogram/common/shared/date';
import { User } from '../../utils/user/user';

enum DatetimeEditMode { None, StartDate, EndDate };

const app = getApp<IAppOption>();

Component({
  properties: {
    tour: {
      type: Object,
      value: {},
    },
    dateFilter: {
      type: Object,
      value: {},
      observer(newVal: any) {
        if (newVal) {
          this.filterNodeByDate(newVal);
        }
      }
    },
    copyIndex: {
      type: Number,
      value: 0,
      observer(newVal: number) {
        this.onCopyChange(newVal);
      }
    }
  },
  data: {
    transiconList: [
      'bus', 'metro', 'train', 'flight', 'walk', 'cycle', 'car', 'taxi', 'ship', 'other'
    ],
    transportList: transportList,
    expenseList: expenseList,
    currencyList: currencyList,
    budgetList: budgetList,
    timezoneList: timezoneList,
    currentUserList: [] as any[],
    minDate: new Date(new Date().getTime() - 365 * MILLISECONDS.DAY).getTime(),
    maxDate: new Date(new Date().getTime() + 365 * MILLISECONDS.DAY).getTime(),
    currentStartDateStr: '',
    currentEndDateStr: '',
    currentTimezoneStr: '',
    currentDateRange: null as number[] | null,
    currentStartDateStrList: null as string[][] | null,
    currentEndDateStrList: null as string[][] | null,
    currentTimezoneStrList: null as string[][] | null,
    currentDurationStrList: null as string[][] | null,

    // 页面状态
    currentTourCopyIndex: 0,
    selectingTour: false,
    mapVisible: false,
    expenseVisible: false,
    noteVisible: false,
    photoVisible: false,
    transExpenseVisible: false,
    priceError: false,

    // 数据缓存
    currentTour: null as Tour | null,
    selectingDatetime: new Date().getTime(),
    selectingTimeOffset: -480,
    selectingDuration: '',
    editingNote: '',
    editingLocationId: -1,
    editingTransportationId: -1,
    editingExpenseId: -1,
    editingLocation: null as Location | null,
    editingTransExpense: null as TransportExpense | null,
    datetimeEditMode: DatetimeEditMode.None,
    markers: [] as any[],
    mapLocation: [] as number[],

    displayingLocationId: [] as number[],
    displayingTransportationId: [] as number[],
  },
  lifetimes: {
    created() {

    },
    ready() {
      this.setData({
        currentTour: new Tour(this.properties.tour),
      });
      if (this.properties.tour) {
        const currentTour = new Tour(this.properties.tour);
        this.setData({
          currentStartDateStr: formatDate(currentTour.startDate, currentTour.timeOffset),
          currentEndDateStr: formatDate(currentTour.endDate, currentTour.timeOffset),
          currentTimezoneStr: timezoneList.find(tz => tz.value === currentTour.timeOffset)?.label || '未知时区',
          currentDateRange: [
            new Date(currentTour.startDate).getTime(),
            new Date(currentTour.endDate).getTime() + MILLISECONDS.DAY - MILLISECONDS.MINUTE
          ],
          currentStartDateStrList: currentTour.locations.map(
            copy => copy.map(location => formatTime(
              currentTour.startDate + location.startOffset, location.timeOffset
            ))),

          currentEndDateStrList: currentTour.locations.map(
            copy => copy.map(location => formatTime(
              currentTour.startDate + location.endOffset, location.timeOffset
            ))),
          currentTimezoneStrList: currentTour.locations.map(
            copy => copy.map(location => {
              const timezone = timezoneList.find(tz => tz.value === location.timeOffset);
              return timezone ? timezone.label : '未知时区'
            })),
          currentDurationStrList: currentTour.transportations.map(
            copy => copy.map(transportation => {
              return new Transportation(transportation).getDurationString();
            })),
          currentUserList: app.getUserListCopy().map(user => {
            if (currentTour.users.includes(user.id)) return new User(user);
            else return null;
          }).filter((user: any) => user !== null)
        });
      }
      else {
        this.setData({ currentDateRange: null });
      }
      this.filterNodeByDate(this.properties.dateFilter);
    },
    moved() {

    },
    detached() {

    },
  },
  methods: {
    getLatestTour() {
      // 使用最新数据创建实例
      if (!this.data.currentTour) return;
      const latestTour = this.properties.tour || this.data.currentTour;
      const currentTour = new Tour(latestTour);
      return currentTour;
    },
    onMapVisibleChange(e: any) {
      if (!this.data.currentTour) return;

      const currentTour = this.getLatestTour();
      if (!currentTour) return;

      const id = e.currentTarget.dataset.index;
      if (id === undefined) {
        this.setData({ mapVisible: !this.data.mapVisible });
        return;
      }

      const currentLocation = currentTour.locations[this.data.currentTourCopyIndex][id];
      this.setData({
        editingLocationId: id,
        mapLocation: [currentLocation.latitude, currentLocation.longitude],
        mapVisible: !this.data.mapVisible,
        markers: [{
          id: 0,
          iconPath: `${CDN_PATH}/Marker1_Activated@3x.png`,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          width: 30,
          height: 30
        }]
      });
    },
    onPhotoVisibleChange(e: any) {
      if (!this.data.currentTour) return;

      const currentTour = this.getLatestTour();
      if (!currentTour) return;

      const id = e.currentTarget.dataset.index;
      if (id === undefined) {
        this.setData({ photoVisible: !this.data.photoVisible });
        return;
      }

      this.setData({
        editingLocationId: id,
        editingLocation: id === -1 ? null : currentTour.locations[this.data.currentTourCopyIndex][id],
        photoVisible: !this.data.photoVisible
      });
    },
    onExpenseVisibleChange(e: any) {
      if (!this.data.currentTour) return;
      const id = e.currentTarget.dataset.index === undefined ? -1 : e.currentTarget.dataset.index;

      const currentTour = this.getLatestTour();
      if (!currentTour) return;

      this.setData({
        editingLocationId: id,
        editingLocation: id === -1 ? null : currentTour.locations[this.data.currentTourCopyIndex][id],
        editingExpenseId: -1,
        expenseVisible: !this.data.expenseVisible
      });
    },
    onExpenseIdChange(e: any) {
      const id = e.detail.value[0] === undefined ? -1 : e.detail.value[0];
      this.setData({ editingExpenseId: id });
    },
    onNoteVisibleChange(e: any) {
      if (!this.data.currentTour) return;

      const currentTour = this.getLatestTour();
      if (!currentTour) return;

      const id = e.currentTarget.dataset.index;

      if (id === undefined) {
        this.setData({
          editingLocationId: -1,
          editingNote: '',
          noteVisible: !this.data.noteVisible
        });
        return;
      }
      this.setData({
        editingLocationId: id,
        editingNote: currentTour.locations[this.data.currentTourCopyIndex][id].note,
        noteVisible: !this.data.noteVisible
      });
    },
    onTransExpenseVisibleChange(e: any) {
      if (e.currentTarget.dataset.index != undefined) {
        this.setData({
          editingTransportationId: e.currentTarget.dataset.index[0],
          editingExpenseId: e.currentTarget.dataset.index[1]
        });
      }
      else {
        this.setData({
          editingTransportationId: -1,
          editingExpenseId: -1,
          transExpenseVisible: false,
          editingTransExpense: null
        });
        return;
      }
      if (!this.data.currentTour || this.data.editingTransportationId < 0) return;

      const currentTour = this.getLatestTour();
      if (!currentTour) return;

      const trans_id = this.data.editingTransportationId;
      const expense_id = this.data.editingExpenseId;
      const editingTransportation = currentTour.transportations[this.data.currentTourCopyIndex][trans_id];
      this.setData({
        editingTransExpense: editingTransportation.transportExpenses[expense_id],
        transExpenseVisible: !this.data.transExpenseVisible
      });
    },
    filterNodeByDate(dateFilter: any) {
      if (!this.data.currentTour) return;
      const currentTour = this.getLatestTour();
      if (!currentTour) return;

      if (dateFilter.value[0] === 0) {
        this.setData({
          displayingLocationId: currentTour.locations[this.data.currentTourCopyIndex].map(location => location.index),
          displayingTransportationId: currentTour.transportations[this.data.currentTourCopyIndex].map(transportation => transportation.index)
        });
      }
      else {
        const filterDate = new Date(dateFilter.value[0], dateFilter.value[1] - 1, dateFilter.value[2]).getTime();
        const displayingLocationId = currentTour.locations[this.data.currentTourCopyIndex].filter(location => {
          return isSameDate(currentTour.startDate + location.startOffset, filterDate) ||
            isSameDate(currentTour.startDate + location.endOffset, filterDate);
        }).map(location => location.index);
        const displayingTransportationId = currentTour.transportations[this.data.currentTourCopyIndex].filter(transportation => {
          return isSameDate(currentTour.startDate + transportation.startOffset, filterDate) ||
            isSameDate(currentTour.startDate + transportation.endOffset, filterDate);
        }).map(transportation => transportation.index);
        this.setData({ displayingLocationId, displayingTransportationId });
      }
    },
    onCopyChange(index: number) {
      this.setData({ currentTourCopyIndex: index });
      this.filterNodeByDate(this.properties.dateFilter);
    },
  },
})
