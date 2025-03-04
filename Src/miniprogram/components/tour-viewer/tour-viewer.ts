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
import { transportList, expenseList, tagList, TransportExpense, currencyList } from '../../utils/tour/expense';
import { timezoneList } from '../../utils/tour/timezone';
import { MILLISECONDS, formatDate, formatNumber, formatTime, timeToMilliseconds } from '../../utils/util';

enum DatetimeEditMode { None, StartDate, EndDate };

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
          this.filterNodeByDate();
        }
      }
    },
  },
  data: {
    transiconList: [
      'bus', 'metro', 'train', 'flight', 'walk', 'cycle', 'car', 'taxi', 'ship', 'other'
    ],
    transportList: transportList,
    expenseList: expenseList,
    currencyList: currencyList,
    tagList: tagList,
    timezoneList: timezoneList,
    minDate: new Date(new Date().getTime() - 365 * MILLISECONDS.DAY).getTime(),
    maxDate: new Date(new Date().getTime() + 365 * MILLISECONDS.DAY).getTime(),
    currentStartDateStr: '',
    currentEndDateStr: '',
    currentTimezoneStr: '',
    currentDateRange: null as number[] | null,
    currentStartDateStrList: null as string[] | null,
    currentEndDateStrList: null as string[] | null,
    currentTimezoneStrList: null as string[] | null,
    currentDurationStrList: null as string[] | null,

    // 页面状态
    selectingTour: false,
    datetimeVisible: false,
    mapVisible: false,
    expenseVisible: false,
    noteVisible: false,
    transExpenseVisible: false,
    priceError: false,
    timezoneVisible: false,

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
          currentStartDateStrList: currentTour.locations.map(location => formatTime(
            currentTour.startDate + location.startOffset, location.timeOffset
          )),
          currentEndDateStrList: currentTour.locations.map(location => formatTime(
            currentTour.startDate + location.endOffset, location.timeOffset
          )),
          currentTimezoneStrList: currentTour.locations.map(location => {
            const timezone = timezoneList.find(tz => tz.value === location.timeOffset);
            return timezone ? timezone.label : '未知时区'
          }),
          currentDurationStrList: currentTour.transportations.map(transportation => {
            return new Transportation(transportation).getDurationString();
          })
        });
      }
      else {
        this.setData({ currentDateRange: null });
      }
      this.filterNodeByDate();
    },
    moved() {

    },
    detached() {

    },
  },
  methods: {
    getLatestTour() {
      //使用最新数据创建实例
      if (!this.data.currentTour) return;
      const latestTour = this.properties.tour || this.data.currentTour;
      const currentTour = new Tour(latestTour);
      return currentTour;
    },
    /**
     * 位置节点地图位置修改
     */
    onMapVisibleChange(e: any) {
      if (!this.data.currentTour) return;

      const currentTour = this.getLatestTour();
      if (!currentTour) return;

      const id = e.currentTarget.dataset.index;
      if (id === undefined) {
        this.setData({ mapVisible: !this.data.mapVisible });
        return;
      }

      const currentLocation = currentTour.locations[id];
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
    /**
     * 消费弹窗
     */
    onExpenseVisibleChange(e: any) {
      if (!this.data.currentTour) return;
      const id = e.currentTarget.dataset.index === undefined ? -1 : e.currentTarget.dataset.index;

      const currentTour = this.getLatestTour();
      if (!currentTour) return;

      this.setData({
        editingLocationId: id,
        editingLocation: id === -1 ? null : currentTour.locations[id],
        editingExpenseId: -1,
        expenseVisible: !this.data.expenseVisible
      });
    },
    changeExpense() {
      if (!this.data.editingLocation) return;
      if (!this.data.currentTour || this.data.editingLocationId < 0) return;

      const currentTour = this.getLatestTour();
      if (!currentTour) return;

      const id = this.data.editingLocationId;
      currentTour.locations[id] = this.data.editingLocation;

      this.properties.tour = currentTour;
      this.setData({
        currentTour: currentTour,
        editingLocationId: -1,
        expenseVisible: false,
        editingLocation: null
      });
      wx.setStorageSync('tour-' + currentTour.id, currentTour);
    },
    /**
     * 增减消费
     */
    addExpense() {
      if (!this.data.currentTour || !this.data.editingLocation) return;

      const currentTour = this.getLatestTour();
      if (!currentTour) return;

      const editingLocation = this.data.editingLocation;
      editingLocation.addExpense(currentTour.mainCurrency);
      this.setData({ editingLocation: editingLocation });
    },
    removeExpense(e: any) {
      if (!this.data.currentTour || !this.data.editingLocation) return;
      if (e.currentTarget.dataset.index === undefined) return;
      const id = e.currentTarget.dataset.index;
      const editingLocation = this.data.editingLocation;
      editingLocation.removeExpense(id);
      this.setData({ editingLocation: editingLocation });
    },
    onExpenseIdChange(e: any) {
      const id = e.detail.value[0] === undefined ? -1 : e.detail.value[0];
      this.setData({ editingExpenseId: id });
    },
    /**
     * 编辑消费
     */
    onExpenseTitleInput(e: any) {
      if (!this.data.editingLocation) return;
      this.setData({
        'editingLocation.expenses': this.data.editingLocation.expenses.map((expense: any, index: number) => {
          if (index === this.data.editingExpenseId) {
            expense.title = e.detail.value;
          }
          return expense;
        })
      });
    },
    onExpensePriceInput(e: any) {
      if (!this.data.editingLocation) return;
      const { priceError } = this.data;
      const isNumber = /^\d+(\.\d+)?$/.test(e.detail.value);
      if (priceError === isNumber) {
        this.setData({
          priceError: !isNumber,
        });
      }
      if (isNumber) {
        this.setData({
          'editingLocation.expenses': this.data.editingLocation.expenses.map((expense: any, index: number) => {
            if (index === this.data.editingExpenseId) {
              expense.amount = Number(e.detail.value);
            }
            return expense;
          })
        });
      }
    },
    exchangeExpenseCurrency() {
      if (!this.data.editingLocation) return;
      if (!this.data.currentTour || this.data.editingLocationId < 0) return;
      const mainCurrency = this.data.currentTour.mainCurrency;
      const subCurrency = this.data.currentTour.subCurrency;
      this.setData({
        'editingLocation.expenses': this.data.editingLocation.expenses.map((expense: any, index: number) => {
          if (index === this.data.editingExpenseId) {
            expense.currency = expense.currency === mainCurrency ? subCurrency : mainCurrency;
          }
          return expense;
        })
      });
    },
    handleExpenseTypeChange(e: any) {
      if (!this.data.editingLocation) return;
      this.setData({
        'editingLocation.expenses': this.data.editingLocation.expenses.map((expense: any, index: number) => {
          if (index === this.data.editingExpenseId) {
            expense.type = e.detail.value;
          }
          return expense;
        })
      });
    },
    onExpenseTagChange(e: any) {
      if (!this.data.editingLocation) return;
      this.setData({
        'editingLocation.expenses': this.data.editingLocation.expenses.map((expense: any, index: number) => {
          if (index === this.data.editingExpenseId) {
            expense.tag = e.detail.value;
          }
          return expense;
        })
      });
    },
    onExpenseNoteInput(e: any) {
      if (!this.data.editingLocation) return;
      this.setData({
        'editingLocation.expenses': this.data.editingLocation.expenses.map((expense: any, index: number) => {
          if (index === this.data.editingExpenseId) {
            expense.note = e.detail.value;
          }
          return expense;
        })
      });
    },
    /**
     * 位置节点备注修改
     */
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
        editingNote: currentTour.locations[id].note,
        noteVisible: !this.data.noteVisible
      });
    },
    onNoteInput(e: any) {
      this.setData({ editingNote: e.detail.value });
    },
    changeNote() {
      if (!this.data.currentTour || this.data.editingLocationId < 0) return;

      const currentTour = this.getLatestTour();
      if (!currentTour) return;

      currentTour.locations[this.data.editingLocationId].note = this.data.editingNote;
      console.log(currentTour.locations[this.data.editingLocationId].note);

      this.properties.tour = currentTour;
      this.setData({
        currentTour: currentTour,
        noteVisible: false,
        editingLocationId: -1,
        editingNote: ''
      });
      wx.setStorageSync('tour-' + currentTour.id, currentTour);
    },

    /**
     * 交通节点持续时间修改
     */
    handleDuartionSelect(e: any) {
      if (e.currentTarget.dataset.index != undefined) {
        this.setData({ editingTransportationId: e.currentTarget.dataset.index });
      }
      if (!this.data.currentTour || this.data.editingTransportationId < 0) return;
      const id = this.data.editingTransportationId;
      const editingTransportation = this.data.currentTour.transportations[id];

      const duration = editingTransportation.endOffset - editingTransportation.startOffset;
      const durationStr = formatNumber(Math.floor(duration / MILLISECONDS.HOUR))
        + ':' +
        formatNumber(Math.floor(duration % MILLISECONDS.HOUR / MILLISECONDS.MINUTE))

      this.setData({
        durationVisible: true,
        selectingDuration: durationStr,
      });
    },
    onDurationColumnChange(e: any) {
      this.setData({ selectingDuration: e.detail.value });
    },
    onDurationConfirm() {
      if (
        !this.data.currentTour ||
        !this.data.currentStartDateStrList ||
        !this.data.currentDurationStrList ||
        this.data.editingTransportationId < 0
      ) return;

      const id = this.data.editingTransportationId;

      const currentTour = this.getLatestTour();
      if (!currentTour) return;

      const editingTransportation = currentTour.transportations[id];
      const milliseconds = timeToMilliseconds(this.data.selectingDuration);
      editingTransportation.endOffset = editingTransportation.startOffset + milliseconds;

      const associatedLocation = currentTour.locations[id + 1];
      associatedLocation.startOffset = editingTransportation.endOffset;

      const currentDurationStrList = this.data.currentDurationStrList;
      const currentStartDateStrList = this.data.currentStartDateStrList;
      currentDurationStrList[id] = editingTransportation.getDurationString();
      currentStartDateStrList[id + 1] = formatTime(
        currentTour.startDate + associatedLocation.startOffset,
        associatedLocation.timeOffset
      );

      this.properties.tour = currentTour;
      this.setData({
        currentTour: currentTour,
        currentStartDateStrList: currentStartDateStrList,
        currentDurationStrList: currentDurationStrList,
        durationVisible: false,
        editingTransportationId: -1
      });
      wx.setStorageSync('tour-' + currentTour.id, currentTour);
    },
    onDurationCancel() {
      this.setData({ durationVisible: false, editingTransportationId: -1 });
    },
    /**
     * 增减位置节点
     */
    addNode() {
      if (!this.data.currentTour
        || !this.data.currentStartDateStrList
        || !this.data.currentEndDateStrList
        || !this.data.currentTimezoneStrList
        || !this.data.currentDurationStrList
      ) return;

      const currentTour = this.getLatestTour();
      if (!currentTour) return;

      currentTour.addLocation();

      const currentStartDateStrList = this.data.currentStartDateStrList;
      const currentEndDateStrList = this.data.currentEndDateStrList;
      const currentTimezoneStrList = this.data.currentTimezoneStrList;
      const currentDurationStrList = this.data.currentDurationStrList;

      const newNode = currentTour.locations[currentTour.locations.length - 1];
      const newTransportNode = currentTour.transportations[currentTour.transportations.length - 1];
      currentStartDateStrList.push(
        formatTime(currentTour.startDate + newNode.startOffset, newNode.timeOffset)
      );
      currentEndDateStrList.push(
        formatTime(currentTour.startDate + newNode.endOffset, newNode.timeOffset)
      );
      currentTimezoneStrList.push(
        timezoneList.find(tz => tz.value === newNode.timeOffset)?.label || '未知时区'
      );
      currentDurationStrList.push(newTransportNode.getDurationString());
      this.properties.tour = currentTour;
      this.setData({
        currentTour: currentTour,
        currentStartDateStrList: currentStartDateStrList,
        currentEndDateStrList: currentEndDateStrList,
        currentTimezoneStrList: currentTimezoneStrList,
        currentDurationStrList: currentDurationStrList
      });
      wx.setStorageSync('tour-' + currentTour.id, currentTour);
    },
    removeNode(e: any) {
      if (!this.data.currentTour
        || !this.data.currentStartDateStrList
        || !this.data.currentEndDateStrList
        || !this.data.currentTimezoneStrList
        || !this.data.currentDurationStrList
      ) return;
      const id = e.currentTarget.dataset.index;

      const currentTour = this.getLatestTour();
      if (!currentTour) return;


      const currentStartDateStrList = this.data.currentStartDateStrList;
      const currentEndDateStrList = this.data.currentEndDateStrList;
      const currentTimezoneStrList = this.data.currentTimezoneStrList;
      const currentDurationStrList = this.data.currentDurationStrList;
      currentStartDateStrList.splice(id, 1);
      currentEndDateStrList.splice(id, 1);
      currentTimezoneStrList.splice(id, 1);
      if (id > 1) {
        currentDurationStrList[id - 1] = currentTour.transportations[id - 2].getDurationString();
      }
      currentDurationStrList?.splice(id, 1);
      currentStartDateStrList[id] = formatTime(
        currentTour.startDate + currentTour.locations[id].startOffset,
        currentTour.locations[id].timeOffset
      );
      currentTour.removeLocation(id);
      this.properties.tour = currentTour;
      this.setData({
        currentTour: currentTour,
        currentStartDateStrList: currentStartDateStrList,
        currentEndDateStrList: currentEndDateStrList,
        currentTimezoneStrList: currentTimezoneStrList,
        currentDurationStrList: currentDurationStrList
      });
      wx.setStorageSync('tour-' + currentTour.id, currentTour);
    },

    /**
     * 增减交通花费
     */
    addTransportExpense(e: any) {
      if (e.currentTarget.dataset.index != undefined) {
        this.setData({ editingTransportationId: e.currentTarget.dataset.index });
      }
      if (!this.data.currentTour || this.data.editingTransportationId < 0) return;

      const currentTour = this.getLatestTour();
      if (!currentTour) return;

      const id = this.data.editingTransportationId;
      const editingTransportation = currentTour.transportations[id];
      editingTransportation.addTransportExpense(currentTour.mainCurrency);

      this.properties.tour = currentTour;
      this.setData({ currentTour: currentTour });
      wx.setStorageSync('tour-' + currentTour.id, currentTour);
    },
    removeTransportExpense(e: any) {
      if (e.currentTarget.dataset.index != undefined) {
        this.setData({
          editingTransportationId: e.currentTarget.dataset.index[0],
          editingExpenseId: e.currentTarget.dataset.index[1]
        });
      }
      if (!this.data.currentTour || this.data.editingTransportationId < 0) return;

      const currentTour = this.getLatestTour();
      if (!currentTour) return;

      const trans_id = this.data.editingTransportationId;
      const expense_id = this.data.editingExpenseId;
      const editingTransportation = currentTour.transportations[trans_id];
      editingTransportation.removeTransportExpense(expense_id);

      this.properties.tour = currentTour;
      this.setData({ currentTour: currentTour });
      wx.setStorageSync('tour-' + currentTour.id, currentTour);
    },
    /**
     * 编辑交通花费
     */
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
      const editingTransportation = currentTour.transportations[trans_id];
      this.setData({
        editingTransExpense: editingTransportation.transportExpenses[expense_id],
        transExpenseVisible: !this.data.transExpenseVisible
      });
    },
    onTransExpenseTitleInput(e: any) {
      if (!this.data.editingTransExpense) return;
      this.setData({
        'editingTransExpense.title': e.detail.value
      });
    },
    onTransExpensePriceInput(e: any) {
      if (!this.data.editingTransExpense) return;
      const { priceError } = this.data;
      const isNumber = /^\d+(\.\d+)?$/.test(e.detail.value);
      if (priceError === isNumber) {
        this.setData({
          priceError: !isNumber,
        });
      }
      if (isNumber) {
        this.setData({
          'editingTransExpense.amount': Number(e.detail.value)
        });
      }
    },
    handleTransExpenseTypeChange(e: any) {
      if (!this.data.editingTransExpense) return;
      this.setData({
        'editingTransExpense.transportType': e.detail.value
      });
    },
    filterNodeByDate() {
      if (!this.data.currentTour) return;
      const currentTour = this.getLatestTour();
      if (!currentTour) return;

      const dateFilter = this.properties.dateFilter;
      if (dateFilter.value[0] === 0) {
        this.setData({
          displayingLocationId: currentTour.locations.map(location => location.index),
          displayingTransportationId: currentTour.transportations.map(transportation => transportation.index)
        });
      }
      else {
        const startDate = new Date(dateFilter.value[0], dateFilter.value[1] - 1, dateFilter.value[2]).getTime();
        const endDate = new Date(dateFilter.value[0], dateFilter.value[1] - 1, dateFilter.value[2] + 1).getTime();
        const displayingLocationId = currentTour.locations.filter(location => {
          return currentTour.startDate + location.startOffset >= startDate && currentTour.startDate + location.endOffset < endDate;
        }).map(location => location.index);
        const displayingTransportationId = currentTour.transportations.filter(transportation => {
          return currentTour.startDate + transportation.startOffset >= startDate && currentTour.startDate + transportation.endOffset < endDate;
        }).map(transportation => transportation.index);
        this.setData({ displayingLocationId, displayingTransportationId });
      }
    }
  },
})
