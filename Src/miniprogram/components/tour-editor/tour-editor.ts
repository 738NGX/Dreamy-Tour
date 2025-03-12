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
import { transportList, expenseList, budgetList, TransportExpense, currencyList, AmountType } from '../../utils/tour/expense';
import { timezoneList } from '../../utils/tour/timezone';
import { MILLISECONDS, formatDate, formatNumber, formatTime, timeToMilliseconds } from '../../utils/util';
import { isSameDate } from '../../miniprogram_npm/tdesign-miniprogram/common/shared/date';
import { User } from '../../utils/user/user';
import { Photo } from '../../utils/tour/photo';

enum DatetimeEditMode { None, StartDate, EndDate };

const app = getApp<IAppOption>();

Component({
  properties: {
    tour: {
      type: Object,
      value: {},
      observer(newVal: any) {
        if (newVal) {
          this.init(newVal);
          this.filterNodeByDate(this.properties.dateFilter);
        }
      }
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
    photoUploadVisible: false,
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

    uploadedPhotos: [] as any[],
  },
  lifetimes: {
    created() {

    },
    ready() {
      this.setData({
        currentTour: new Tour(this.properties.tour),
      });
      if (this.properties.tour) {
        this.init(this.properties.tour);
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
    init(value: any) {
      const currentTour = new Tour(value);
      this.setData({
        currentTour: currentTour,
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
        currentUserList: app.globalData.currentData.userList.map((user: any) => {
          if (currentTour.users.includes(user.id)) return new User(user);
          else return null;
        }).filter((user: any) => user !== null)
      });
    },
    onCurrentTourChange(value: Tour) {
      this.triggerEvent('currentTourChange', { value: value });
    },
    /**
     * 位置节点标题修改
     */
    handleLocationTitleInput(e: any) {
      const currentTour = this.data.currentTour;
      if (!currentTour) return;

      const id = e.currentTarget.dataset.index;
      if (id === undefined) return;

      currentTour.locations[this.data.currentTourCopyIndex][id].title = e.detail.value;
      this.setData({ currentTour: currentTour });
      app.updateTour(currentTour);
      this.onCurrentTourChange(currentTour);
    },
    /**
     * 位置节点起始日期修改
     */
    handleNodeStartDateSelect(e: any) {
      const currentTour = this.data.currentTour;
      if (!currentTour) return;
      if (e.currentTarget.dataset.index != undefined) {
        this.setData({ editingLocationId: e.currentTarget.dataset.index });
      }
      if (!this.data.currentTour || this.data.editingLocationId < 0) return;
      const editingLocation = this.data.currentTour.locations[this.data.currentTourCopyIndex][this.data.editingLocationId];
      const selectingDatetime = (
        this.data.currentTour.startDate + editingLocation.startOffset
        + new Date().getTimezoneOffset() * MILLISECONDS.MINUTE
        - editingLocation.timeOffset * MILLISECONDS.MINUTE
      );
      this.setData({
        datetimeVisible: true,
        selectingDatetime: selectingDatetime,
        datetimeEditMode: DatetimeEditMode.StartDate
      });
      app.updateTour(currentTour);
      this.onCurrentTourChange(currentTour);
    },
    /**
     * 位置节点结束日期修改
     */
    handleNodeEndDateSelect(e: any) {
      const currentTour = this.data.currentTour;
      if (!currentTour) return;
      if (e.currentTarget.dataset.index != undefined) {
        this.setData({ editingLocationId: e.currentTarget.dataset.index });
      }
      if (!this.data.currentTour || this.data.editingLocationId < 0) return;
      const editingLocation = this.data.currentTour.locations[this.data.currentTourCopyIndex][this.data.editingLocationId];
      const selectingDatetime = (
        this.data.currentTour.startDate + editingLocation.endOffset
        + new Date().getTimezoneOffset() * MILLISECONDS.MINUTE
        - editingLocation.timeOffset * MILLISECONDS.MINUTE
      );
      this.setData({
        datetimeVisible: true,
        selectingDatetime: selectingDatetime,
        datetimeEditMode: DatetimeEditMode.EndDate
      });
      app.updateTour(currentTour);
      this.onCurrentTourChange(currentTour);
    },
    /**
     * 修改datetime的值
     */
    onDatetimeColumnChange(e: any) {
      this.setData({ selectingDatetime: new Date(e.detail.value + ":00").getTime() });
    },
    /**
     * 确认修改datetime
     */
    onDatetimeConfirm() {
      if (
        !this.data.currentTour ||
        !this.data.currentStartDateStrList ||
        !this.data.currentEndDateStrList ||
        this.data.editingLocationId < 0
      ) return;

      const id = this.data.editingLocationId;

      const currentTour = this.data.currentTour;
      if (!currentTour) return;

      const editingLocation = currentTour.locations[this.data.currentTourCopyIndex][id];
      const selectingDatetime = this.data.selectingDatetime
        - new Date().getTimezoneOffset() * MILLISECONDS.MINUTE
        + editingLocation.timeOffset * MILLISECONDS.MINUTE;

      if (this.data.datetimeEditMode === DatetimeEditMode.StartDate) {
        editingLocation.startOffset = selectingDatetime - currentTour.startDate;
        if (id > 0) {
          const associatedTransportation = currentTour.transportations[this.data.currentTourCopyIndex][id - 1];
          associatedTransportation.endOffset = editingLocation.startOffset;
          const newDurationStrList = this.data.currentDurationStrList;
          if (newDurationStrList) {
            newDurationStrList[this.data.currentTourCopyIndex][id - 1] = associatedTransportation.getDurationString();
          }
          this.setData({ currentDurationStrList: newDurationStrList });
        }
        const newStartDateStrList = this.data.currentStartDateStrList;
        newStartDateStrList[this.data.currentTourCopyIndex][id] = formatTime(currentTour.startDate + editingLocation.startOffset, editingLocation.timeOffset);
        this.setData({ currentStartDateStrList: newStartDateStrList });
      }
      else if (this.data.datetimeEditMode === DatetimeEditMode.EndDate) {
        editingLocation.endOffset = selectingDatetime - currentTour.startDate;
        if (id < currentTour.locations[this.data.currentTourCopyIndex].length - 1) {
          const associatedTransportation = currentTour.transportations[this.data.currentTourCopyIndex][id];
          associatedTransportation.startOffset = editingLocation.endOffset;
          const newDurationStrList = this.data.currentDurationStrList;
          if (newDurationStrList) {
            newDurationStrList[this.data.currentTourCopyIndex][id] = associatedTransportation.getDurationString();
          }
          this.setData({ currentDurationStrList: newDurationStrList });
        }
        const newEndDateStrList = this.data.currentEndDateStrList;
        newEndDateStrList[this.data.currentTourCopyIndex][id] = formatTime(currentTour.startDate + editingLocation.endOffset, editingLocation.timeOffset);
        this.setData({ currentEndDateStrList: newEndDateStrList });
      }

      this.setData({
        currentTour: currentTour,
        editingLocationId: -1,
        datetimeVisible: false,
        datetimeEditMode: DatetimeEditMode.None
      });
      app.updateTour(currentTour);
      this.onCurrentTourChange(currentTour);
    },
    /**
     * 取消修改datetime
     */
    onDatetimeCancel() {
      this.setData({
        datetimeVisible: false,
        editingLocationId: -1,
        datetimeEditMode: DatetimeEditMode.None
      });
    },
    /**
     * 时区修改
     */
    handleNodeTimezoneSelect(e: any) {
      if (e.currentTarget.dataset.index != undefined) {
        this.setData({ editingLocationId: e.currentTarget.dataset.index });
      }
      if (!this.data.currentTour || this.data.editingLocationId < 0) return;
      const editingLocation = this.data.currentTour.locations[this.data.currentTourCopyIndex][this.data.editingLocationId];
      this.setData({
        timezoneVisible: true,
        selectingTimeOffset: editingLocation.timeOffset
      });
    },
    onTimezoneColumnChange(e: any) {
      this.setData({ selectingTimeOffset: Number(e.detail.value[0]) });
    },
    /**
     * 更换时区后切换datetime
     */
    onTimezonePickerChange() {
      if (
        !this.data.currentTour ||
        !this.data.currentTimezoneStrList ||
        !this.data.currentStartDateStrList ||
        !this.data.currentEndDateStrList ||
        this.data.editingLocationId < 0
      ) return;

      const currentTour = this.data.currentTour;
      if (!currentTour) return;

      const newStartDateStrList = this.data.currentStartDateStrList;
      const newEndDateStrList = this.data.currentEndDateStrList;
      const newTimezoneStrList = this.data.currentTimezoneStrList;
      const id = this.data.editingLocationId;

      // 时区值&显示更新
      currentTour.locations[this.data.currentTourCopyIndex][id].timeOffset = this.data.selectingTimeOffset;
      const timezone = timezoneList.find(tz => tz.value === this.data.selectingTimeOffset);
      newTimezoneStrList[this.data.currentTourCopyIndex][id] = timezone ? timezone.label : '';
      // 起止时间显示更新
      newStartDateStrList[this.data.currentTourCopyIndex][id] = formatTime(
        currentTour.startDate + currentTour.locations[this.data.currentTourCopyIndex][id].startOffset,
        currentTour.locations[this.data.currentTourCopyIndex][id].timeOffset
      );
      newEndDateStrList[this.data.currentTourCopyIndex][id] = formatTime(
        currentTour.startDate + currentTour.locations[this.data.currentTourCopyIndex][id].endOffset,
        currentTour.locations[this.data.currentTourCopyIndex][id].timeOffset
      );

      this.setData({
        currentTour: currentTour,
        timezoneVisible: false,
        editingLocationId: -1,
        selectingTimeOffset: -480,
        currentTimezoneStrList: newTimezoneStrList,
        currentStartDateStrList: newStartDateStrList,
        currentEndDateStrList: newEndDateStrList
      });
      app.updateTour(currentTour);
      this.onCurrentTourChange(currentTour);
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
      const editingTransportation = this.data.currentTour.transportations[this.data.currentTourCopyIndex][id];

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

      const currentTour = this.data.currentTour;
      if (!currentTour) return;

      const editingTransportation = currentTour.transportations[this.data.currentTourCopyIndex][id];
      const milliseconds = timeToMilliseconds(this.data.selectingDuration);
      editingTransportation.endOffset = editingTransportation.startOffset + milliseconds;

      const associatedLocation = currentTour.locations[this.data.currentTourCopyIndex][id + 1];
      associatedLocation.startOffset = editingTransportation.endOffset;

      const currentDurationStrList = this.data.currentDurationStrList;
      const currentStartDateStrList = this.data.currentStartDateStrList;
      currentDurationStrList[this.data.currentTourCopyIndex][id] = editingTransportation.getDurationString();
      currentStartDateStrList[this.data.currentTourCopyIndex][id + 1] = formatTime(
        currentTour.startDate + associatedLocation.startOffset,
        associatedLocation.timeOffset
      );

      this.setData({
        currentTour: currentTour,
        currentStartDateStrList: currentStartDateStrList,
        currentDurationStrList: currentDurationStrList,
        durationVisible: false,
        editingTransportationId: -1
      });
      app.updateTour(currentTour);
      this.onCurrentTourChange(currentTour);
    },
    onDurationCancel() {
      this.setData({ durationVisible: false, editingTransportationId: -1 });
    },
    /**
     * 地图位置修改
     */
    onMapVisibleChange(e: any) {
      if (!this.data.currentTour) return;

      const currentTour = this.data.currentTour;
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
    onTapMap(e: any) {
      const latitude = e.detail.latitude.toFixed(6);
      const longitude = e.detail.longitude.toFixed(6);
      this.setData({
        mapLocation: [latitude, longitude],
        markers: [{
          id: 0,
          iconPath: `${CDN_PATH}/Marker1_Activated@3x.png`,
          latitude: latitude,
          longitude: longitude,
          width: 30,
          height: 30
        }]
      });
    },
    changeLocation() {
      if (!this.data.currentTour) return;

      const currentTour = this.data.currentTour;
      if (!currentTour) return;

      const id = this.data.editingLocationId;
      if (id === -1) return;

      currentTour.locations[this.data.currentTourCopyIndex][id].latitude = this.data.mapLocation[0];
      currentTour.locations[this.data.currentTourCopyIndex][id].longitude = this.data.mapLocation[1];
      app.updateTour(currentTour);
      this.onCurrentTourChange(currentTour);
      this.setData({ currentTour: currentTour, mapVisible: false });
    },
    onPhotoVisibleChange(e: any) {
      if (!this.data.currentTour) return;

      const currentTour = this.data.currentTour;
      if (!currentTour) return;

      const id = e.currentTarget.dataset.index;
      if (id === undefined) {
        this.setData({ 
          editingLocationId: -1,
          editingLocation: null,
          photoVisible: !this.data.photoVisible 
        });
        return;
      }

      this.setData({
        editingLocationId: id,
        editingLocation: id === -1 ? null : new Location(currentTour.locations[this.data.currentTourCopyIndex][id]),
        photoVisible: !this.data.photoVisible
      });
    },
    onPhotoUploadVisibleChange() {
      this.setData({
        photoUploadVisible: !this.data.photoUploadVisible
      });
    },
    handlePhotoAdd(e: any) {
      const { uploadedPhotos } = this.data;
      const { files } = e.detail;

      this.setData({
        uploadedPhotos: [...uploadedPhotos, ...files],
      });
    },
    handlePhotoRemove(e: any) {
      const { index } = e.detail;
      const { uploadedPhotos } = this.data;

      uploadedPhotos.splice(index, 1);
      this.setData({
        fileList: uploadedPhotos,
      });
    },
    onPhotoUploadConfirm() {
      if (this.data.uploadedPhotos.length === 0) return;
      const { editingLocation } = this.data;
      if (editingLocation) {
        editingLocation.photos = editingLocation.photos.concat(
          this.data.uploadedPhotos.map((photo: any) => new Photo({ value: photo.url, ariaLabel: photo.name }))
        );
      }
      this.setData({
        editingLocation: editingLocation,
        uploadedPhotos: [],
        photoUploadVisible: false,
      });
    },
    onPhotoConfirm() {
      const { currentTour, currentTourCopyIndex, editingLocationId, editingLocation } = this.data;
      if (!currentTour || !editingLocation) return;
      currentTour.locations[currentTourCopyIndex][editingLocationId] = editingLocation
      app.updateTour(currentTour);
      this.onCurrentTourChange(currentTour);
      this.setData({ 
        currentTour: currentTour, 
        photoVisible: false, 
        editingLocationId: -1,
        editingLocation: null
      });
    },
    /**
     * 消费编辑
     */
    addExpense() {
      if (!this.data.currentTour || !this.data.editingLocation) return;

      const currentTour = this.data.currentTour;
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
    onExpenseVisibleChange(e: any) {
      if (!this.data.currentTour) return;
      const id = e.currentTarget.dataset.index === undefined ? -1 : e.currentTarget.dataset.index;

      const currentTour = this.data.currentTour;
      if (!currentTour) return;

      this.setData({
        editingLocationId: id,
        editingLocation: id === -1 ? null : new Location(currentTour.locations[this.data.currentTourCopyIndex][id]),
        editingExpenseId: -1,
        expenseVisible: !this.data.expenseVisible
      });
    },
    changeExpense() {
      if (!this.data.currentTour || !this.data.editingLocation) return;

      const currentTour = this.data.currentTour;
      if (!currentTour) return;

      const id = this.data.editingLocationId;
      if (id === -1) return;

      currentTour.locations[this.data.currentTourCopyIndex][id] = this.data.editingLocation;
      app.updateTour(currentTour);
      this.onCurrentTourChange(currentTour);
      this.setData({ currentTour: currentTour, expenseVisible: false });
    },
    onExpenseIdChange(e: any) {
      const id = e.detail.value[0] === undefined ? -1 : e.detail.value[0];
      this.setData({ editingExpenseId: id });
    },
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
    exchangeExpenseAmountType() {
      if (!this.data.editingLocation) return;
      this.setData({
        'editingLocation.expenses': this.data.editingLocation.expenses.map((expense: any, index: number) => {
          if (index === this.data.editingExpenseId) {
            expense.amountType = expense.amountType === AmountType.Total ? AmountType.Average : AmountType.Total;
          }
          return expense;
        })
      });
    },
    handleExpenseUserChange(e: any) {
      if (!this.data.editingLocation) return;
      const user = e.detail.value;
      this.setData({
        'editingLocation.expenses': this.data.editingLocation.expenses.map((expense: any, index: number) => {
          if (index === this.data.editingExpenseId) {
            expense.user = user;
          }
          return expense;
        })
      });
    },
    handleExpenseBudgetChange(e: any) {
      if (!this.data.editingLocation) return;
      const budget = e.detail.value;
      this.setData({
        'editingLocation.expenses': this.data.editingLocation.expenses.map((expense: any, index: number) => {
          if (index === this.data.editingExpenseId) {
            expense.budget = budget;
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
    onNoteVisibleChange(e: any) {
      if (!this.data.currentTour) return;

      const currentTour = this.data.currentTour;
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
    onNoteInput(e: any) {
      this.setData({ editingNote: e.detail.value });
    },
    changeNote() {
      if (!this.data.currentTour || this.data.editingLocationId < 0) return;

      const currentTour = this.data.currentTour;
      if (!currentTour) return;

      currentTour.locations[this.data.currentTourCopyIndex][this.data.editingLocationId].note = this.data.editingNote;
      this.setData({
        currentTour: currentTour,
        noteVisible: false,
        editingLocationId: -1,
        editingNote: ''
      });
      app.updateTour(currentTour);
      this.onCurrentTourChange(currentTour);
    },
    /**
     * 编辑交通花费
     */
    addTransportExpense(e: any) {
      if (e.currentTarget.dataset.index != undefined) {
        this.setData({ editingTransportationId: e.currentTarget.dataset.index });
      }
      if (!this.data.currentTour || this.data.editingTransportationId < 0) return;

      const currentTour = this.data.currentTour;
      if (!currentTour) return;

      const id = this.data.editingTransportationId;
      const editingTransportation = currentTour.transportations[this.data.currentTourCopyIndex][id];
      editingTransportation.addTransportExpense(currentTour.mainCurrency);

      this.setData({ currentTour: currentTour });
      app.updateTour(currentTour);
      this.onCurrentTourChange(currentTour);
    },
    removeTransportExpense(e: any) {
      if (e.currentTarget.dataset.index != undefined) {
        this.setData({
          editingTransportationId: e.currentTarget.dataset.index[0],
          editingExpenseId: e.currentTarget.dataset.index[1]
        });
      }
      if (!this.data.currentTour || this.data.editingTransportationId < 0) return;

      const currentTour = this.data.currentTour;
      if (!currentTour) return;

      const trans_id = this.data.editingTransportationId;
      const expense_id = this.data.editingExpenseId;
      const editingTransportation = currentTour.transportations[this.data.currentTourCopyIndex][trans_id];
      editingTransportation.removeTransportExpense(expense_id);

      this.setData({ currentTour: currentTour });
      app.updateTour(currentTour);
      this.onCurrentTourChange(currentTour);
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

      const currentTour = this.data.currentTour;
      if (!currentTour) return;

      const trans_id = this.data.editingTransportationId;
      const expense_id = this.data.editingExpenseId;
      const editingTransportation = currentTour.transportations[this.data.currentTourCopyIndex][trans_id];
      this.setData({
        editingTransExpense: new TransportExpense(editingTransportation.transportExpenses[expense_id]),
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
    onTransExpenseNoteInput(e: any) {
      if (!this.data.editingTransExpense) return;
      this.setData({
        'editingTransExpense.note': e.detail.value
      });
    },
    handleTransExpenseTypeChange(e: any) {
      if (!this.data.editingTransExpense) return;
      this.setData({
        'editingTransExpense.transportType': e.detail.value
      });
    },
    handleTransExpenseUserChange(e: any) {
      if (!this.data.editingTransExpense) return;
      const user = this.data.editingTransExpense.user;
      if (user.includes(e.detail.value[0])) {
        user.splice(user.indexOf(e.detail.value[0]), 1);
      }
      else {
        user.push(e.detail.value[0]);
      }
      this.setData({
        'editingTransExpense.user': user
      });
    },
    handleTransExpenseBudgetChange(e: any) {
      if (!this.data.editingTransExpense) return;
      const budget = this.data.editingTransExpense.budget;
      if (budget.includes(e.detail.value[0])) {
        budget.splice(budget.indexOf(e.detail.value[0]), 1);
      }
      else {
        budget.push(e.detail.value[0]);
      }
      this.setData({
        'editingTransExpense.budget': budget
      });
    },
    exchangeTransExpenseCurrency() {
      if (!this.data.editingTransExpense) return;
      if (!this.data.currentTour || this.data.editingTransportationId < 0) return;
      const mainCurrency = this.data.currentTour.mainCurrency;
      const subCurrency = this.data.currentTour.subCurrency;
      this.setData({
        'editingTransExpense.currency': this.data.editingTransExpense.currency ===
          mainCurrency ? subCurrency : mainCurrency
      });
    },
    exchangeTransExpenseAmountType() {
      if (!this.data.editingTransExpense) return;
      this.setData({
        'editingTransExpense.amountType': this.data.editingTransExpense.amountType ==
          AmountType.Average ? AmountType.Total : AmountType.Average
      });
    },
    changeTransExpense() {
      if (!this.data.editingTransExpense) return;
      if (!this.data.currentTour || this.data.editingTransportationId < 0) return;

      const currentTour = this.data.currentTour;
      if (!currentTour) return;

      const trans_id = this.data.editingTransportationId;
      const expense_id = this.data.editingExpenseId;
      const editingTransportation = currentTour.transportations[this.data.currentTourCopyIndex][trans_id];
      editingTransportation.transportExpenses[expense_id] = this.data.editingTransExpense;

      app.updateTour(currentTour);
      this.onCurrentTourChange(currentTour);
      this.setData({
        currentTour: currentTour,
        editingTransportationId: -1,
        editingExpenseId: -1,
        transExpenseVisible: false,
        editingTransExpense: null
      });
    },
    /**
     * 日期筛选
     */
    filterNodeByDate(dateFilter: any) {
      if (!this.data.currentTour) return;
      const currentTour = this.data.currentTour;
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
    handleLocationInsert(e: any) {
      const currentTour = this.data.currentTour;
      const index = e.currentTarget.dataset.index;
      if (!currentTour || index === undefined) return;
      currentTour.insertLocation(index, this.data.currentTourCopyIndex);
      app.updateTour(currentTour);
      this.onCurrentTourChange(currentTour);
      this.setData({
        currentTour: currentTour,
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
      });
      this.filterNodeByDate(this.properties.dateFilter);
    },
    handleLocationRemove(e: any) {
      if (!this.data.currentTour
        || !this.data.currentStartDateStrList
        || !this.data.currentEndDateStrList
        || !this.data.currentTimezoneStrList
        || !this.data.currentDurationStrList
      ) return;
      const id = e.currentTarget.dataset.index;
      const copyIndex = this.data.currentTourCopyIndex;

      const currentTour = this.data.currentTour;
      if (!currentTour) return;

      const currentStartDateStrList = this.data.currentStartDateStrList;
      const currentEndDateStrList = this.data.currentEndDateStrList;
      const currentTimezoneStrList = this.data.currentTimezoneStrList;
      const currentDurationStrList = this.data.currentDurationStrList;
      currentStartDateStrList[copyIndex].splice(id, 1);
      currentEndDateStrList[copyIndex].splice(id, 1);
      currentTimezoneStrList[copyIndex].splice(id, 1);
      if (id > 1) {
        currentDurationStrList[copyIndex][id - 1] = currentTour.transportations[copyIndex][id - 2].getDurationString();
      }
      currentDurationStrList[copyIndex]?.splice(id, 1);
      currentStartDateStrList[copyIndex][id] = formatTime(
        currentTour.startDate + currentTour.locations[copyIndex][id].startOffset,
        currentTour.locations[copyIndex][id].timeOffset
      );
      currentTour.removeLocation(id, this.data.currentTourCopyIndex);

      app.updateTour(currentTour);
      this.onCurrentTourChange(currentTour);
      this.filterNodeByDate(this.properties.dateFilter);
      this.setData({
        currentTour: currentTour,
        currentStartDateStrList: currentStartDateStrList,
        currentEndDateStrList: currentEndDateStrList,
        currentTimezoneStrList: currentTimezoneStrList,
        currentDurationStrList: currentDurationStrList
      });
    },
  },
})
