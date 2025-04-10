//===============================================
/**
 * @@@@@@@@@@@@@@ :用以区分模块子功能  
 * 行程编辑模块
 * 群组内对行程进行编辑
 * 功能列表：
 * 1.位置节点（时间、时区）
 * 2.交通节点（持续时间、交通编辑）
 * 3.位置节点（地图坐标修改）
 * 4.位置节点照片编辑
 * 5.位置节点消费编辑
 * 6.交通节点消费编辑
 * 7.日期筛选
 * 8.行程版本切换
 * 9.位置节点（新增、插入与删除）
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
import { transportList, expenseList, budgetList, TransportExpense, currencyList, AmountType } from '../../utils/tour/expense';
import { timezoneList } from '../../utils/tour/timezone';
import { MILLISECONDS, formatDate, formatNumber, formatTime, getImageBase64, timeToMilliseconds } from '../../utils/util';
import { isSameDate } from '../../miniprogram_npm/tdesign-miniprogram/common/shared/date';
import { Photo } from '../../utils/tour/photo';

enum DatetimeEditMode { None, StartDate, EndDate };

const app = getApp<IAppOption>();

Component({
  properties: {
    //接收行程对象，日期信息和版本信息，初始化行程并处理版本切换和筛选逻辑
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
    },
    readonly: {
      type: Boolean,
      value: false
    },
  },
  data: {
    //静态数据
    transiconList: [
      'bus', 'metro', 'train', 'flight', 'walk', 'cycle', 'car', 'taxi', 'ship', 'other'
    ],
    transportList: transportList,
    expenseList: expenseList,
    currencyList: currencyList,
    budgetList: budgetList,
    timezoneList: timezoneList,

    //关联用户
    currentUserList: [] as any[],
    //起止日期选择限制
    minDate: new Date(new Date().getTime() - 365 * MILLISECONDS.DAY).getTime(),
    maxDate: new Date(new Date().getTime() + 365 * MILLISECONDS.DAY).getTime(),
    //日期、时区数据
    currentStartDateStr: '',
    currentEndDateStr: '',
    currentTimezoneStr: '',
    //起止时间
    currentDateRange: null as number[] | null,
    //节点时间数据结构，一级表示版本索引，二级表示行程内各节点
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
    currentTour: null as Tour | null,     // 当前行程对象，类型为 Tour 或 null，表示当前选中的行程信息
    selectingDatetime: new Date().getTime(),      // 当前选中的日期时间戳（毫秒），默认值为当前时间，用于选择行程或费用的时间点
    selectingTimeOffset: -480,           // 当前选中的时区/时间偏移量，默认值为 -480（东八区）
    selectingDuration: '',               // 当前选中的持续时间
    editingNote: '',                     // 当前正在编辑的备注内容（字符串），用于记录行程或费用的附加说明
    editingLocationId: -1,               // 当前正在编辑的位置节点ID（数字）
    editingTransportationId: -1,         // 当前正在编辑的交通节点ID（数字）
    editingExpenseId: -1,                // 当前正在编辑的费用ID（数字）
    editingLocation: null as Location | null,     // 当前正在编辑的位置节点对象
    editingTransExpense: null as TransportExpense | null,  // 当前正在编辑的交通费用对象
    datetimeEditMode: DatetimeEditMode.None,      // 日期时间编辑模式，区分起止时间
    markers: [] as any[],                 // 地图标记数组，存储标记点信息
    mapLocation: [] as number[],          // 地图中心点位置坐标

    //日期筛选
    displayingLocationId: [] as number[], // 当前显示的地点ID数组，类型为 number[]，用于存储需要显示的多个位置节点ID
    displayingTransportationId: [] as number[],  // 当前显示的交通工具ID数组，类型为 number[]，用于存储需要显示的多个交通节点ID

    uploadedPhotos: [] as any[],
  },
  lifetimes: {
    created() {

    },
    async ready() {
      //采用传入的tour初始化行程信息
      this.setData({
        currentTour: new Tour(this.properties.tour),
      });
      if (this.data.currentTour) {
        await this.init(this.data.currentTour);
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
    /**
     * 初始化行程信息与关联用户到缓存
     * @param value 
     */
    async init(value: any) {
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
        currentUserList: await app.getMembersInTour(currentTour.id),
      });
    },
    /**
     * 对接tour-edit页面的触发器，更新当前行程信息
      */
    onCurrentTourChange(value: Tour) {
      this.triggerEvent('currentTourChange', { value: value });
    },

    //@@@@@@@@@@@@@
    //位置节点（时间、时区）
    //@@@@@@@@@@@@@
    /**
     * 位置节点标题修改
     */
    async handleLocationTitleInput(e: WechatMiniprogram.CustomEvent) {
      const currentTour = this.data.currentTour;
      if (!currentTour) return;

      const id = e.currentTarget.dataset.index;
      if (id === undefined) return;

      currentTour.locations[this.data.currentTourCopyIndex][id].title = e.detail.value;
      this.setData({ currentTour: currentTour });
      await app.changeFullTour(currentTour);
      this.onCurrentTourChange(currentTour);
    },
    async getTitleByLocation(e: WechatMiniprogram.CustomEvent) {
      const currentTour = this.data.currentTour;
      if (!currentTour) return;

      const id = e.currentTarget.dataset.index;
      if (id === undefined) return;

      const editingLocation = currentTour.locations[this.data.currentTourCopyIndex][id];
      const newTitle = await app.getAddressByLocation(`${Number(editingLocation.longitude).toFixed(6)},${Number(editingLocation.latitude).toFixed(6)}`);
      if (newTitle) {
        editingLocation.title = newTitle;
        this.setData({ currentTour: currentTour });
        await app.changeFullTour(currentTour);
        this.onCurrentTourChange(currentTour);
      }
    },
    /**
     * 位置节点起始日期修改
     */
    async handleNodeStartDateSelect(e: WechatMiniprogram.CustomEvent) {
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
      await app.changeFullTour(currentTour);
      this.onCurrentTourChange(currentTour);
    },
    /**
     * 位置节点结束日期修改
     */
    async handleNodeEndDateSelect(e: WechatMiniprogram.CustomEvent) {
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
      await app.changeFullTour(currentTour);
      this.onCurrentTourChange(currentTour);
    },
    /**
     * 修改datetime的值
     */
    onDatetimeColumnChange(e: WechatMiniprogram.CustomEvent) {
      this.setData({ selectingDatetime: new Date(e.detail.value + ":00").getTime() });
    },
    /**
     * 确认修改datetime
     */
    async onDatetimeConfirm() {
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
      await app.changeFullTour(currentTour);
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
    handleNodeTimezoneSelect(e: WechatMiniprogram.CustomEvent) {
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
    onTimezoneColumnChange(e: WechatMiniprogram.CustomEvent) {
      this.setData({ selectingTimeOffset: Number(e.detail.value[0]) });
    },
    /**
     * 更换时区后更新datetime
     */
    async onTimezonePickerChange() {
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
      await app.changeFullTour(currentTour);
      this.onCurrentTourChange(currentTour);
    },

    //@@@@@@@@@@@@@
    //交通节点（持续时间、交通编辑）
    //@@@@@@@@@@@@@
    /**
     * 交通节点持续时间修改
     */
    handleDuartionSelect(e: WechatMiniprogram.CustomEvent) {
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
    onDurationColumnChange(e: WechatMiniprogram.CustomEvent) {
      this.setData({ selectingDuration: e.detail.value });
    },
    async onDurationConfirm() {
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
      await app.changeFullTour(currentTour);
      this.onCurrentTourChange(currentTour);
    },
    onDurationCancel() {
      this.setData({ durationVisible: false, editingTransportationId: -1 });
    },

    //@@@@@@@@@@@@@
    //位置节点（地图坐标修改）
    //@@@@@@@@@@@@@
    /**
     * 显示地图
     */
    onMapVisibleChange(e: WechatMiniprogram.CustomEvent) {
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
    /**
     * 点击地图、更改位置
     * @param e 
     */
    onTapMap(e: WechatMiniprogram.CustomEvent) {
      if (this.properties.readonly) return;
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
    async getLocationByTitle() {
      if (!this.data.currentTour) return;

      const currentTour = this.data.currentTour;
      if (!currentTour) return;

      const id = this.data.editingLocationId;
      if (id === -1) return;

      const editingLocation = currentTour.locations[this.data.currentTourCopyIndex][id];
      const locations = await app.getLocationByAddress(editingLocation.title, '');
      const itemList = locations.map((item) => {
        return `${item.address}:位于${item.province}·${item.city}·${item.district}`;
      })
      const that = this;
      wx.showActionSheet({
        alertText: '搜索到以下位置,请选择',
        itemList: itemList,
        success(res) {
          const latitude = locations[res.tapIndex].latitude.toFixed(6);
          const longitude = locations[res.tapIndex].longitude.toFixed(6);
          that.setData({
            mapLocation: [Number(latitude), Number(longitude)],
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
      })
    },
    /**
     * 更新节点位置信息
     * @returns 
     */
    async changeLocation() {
      if (this.properties.readonly) {
        this.setData({ mapVisible: false });
        return;
      }

      if (!this.data.currentTour) return;

      const currentTour = this.data.currentTour;
      if (!currentTour) return;

      const id = this.data.editingLocationId;
      if (id === -1) return;

      currentTour.locations[this.data.currentTourCopyIndex][id].latitude = this.data.mapLocation[0];
      currentTour.locations[this.data.currentTourCopyIndex][id].longitude = this.data.mapLocation[1];
      await app.changeFullTour(currentTour);
      this.onCurrentTourChange(currentTour);
      this.setData({ currentTour: currentTour, mapVisible: false });
    },

    //@@@@@@@@@@@@@
    //位置节点照片编辑
    //@@@@@@@@@@@@@
    /**
     * 照片编辑弹窗
     * @param e 
     * @returns 
     */
    onPhotoVisibleChange(e: WechatMiniprogram.CustomEvent) {
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
    handlePhotoAdd(e: WechatMiniprogram.CustomEvent) {
      const { uploadedPhotos } = this.data;
      const { files } = e.detail;

      this.setData({
        uploadedPhotos: [...uploadedPhotos, ...files],
      });
    },
    handlePhotoRemove(e: WechatMiniprogram.CustomEvent) {
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
    onPhotoUpload() {
      const that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        async success(res) {
          const src = res.tempFilePaths[0]
          const { editingLocation } = that.data;
          if (editingLocation) {
            editingLocation.photos.push(new Photo({ value: await getImageBase64(src), ariaLabel: '' }));
          }
          that.setData({
            editingLocation: editingLocation,
            uploadedPhotos: [],
            photoUploadVisible: false,
          });
        }
      });
    },
    removePhoto(e: WechatMiniprogram.CustomEvent) {
      if (!this.data.currentTour || !this.data.editingLocation) return;
      if (e.currentTarget.dataset.index === undefined) return;
      const id = e.currentTarget.dataset.index;
      const editingLocation = this.data.editingLocation;
      editingLocation.photos.splice(id, 1);
      this.setData({ editingLocation: editingLocation });
    },
    async onPhotoConfirm() {
      if (this.properties.readonly) {
        this.setData({ photoVisible: false });
        return;
      }
      const { currentTour, currentTourCopyIndex, editingLocationId, editingLocation } = this.data;
      if (!currentTour || !editingLocation) return;
      currentTour.locations[currentTourCopyIndex][editingLocationId] = editingLocation
      await app.changeFullTour(currentTour);
      this.onCurrentTourChange(currentTour);
      this.setData({
        currentTour: currentTour,
        photoVisible: false,
        editingLocationId: -1,
        editingLocation: null
      });
    },
    //@@@@@@@@@@@@@
    //位置节点消费编辑
    //@@@@@@@@@@@@@
    /**
     * 添加消费
     */
    addExpense() {
      if (!this.data.currentTour || !this.data.editingLocation) return;

      const currentTour = this.data.currentTour;
      if (!currentTour) return;

      const editingLocation = this.data.editingLocation;
      editingLocation.addExpense(currentTour.mainCurrency);
      this.setData({ editingLocation: editingLocation });
    },
    /**
     * 删除消费
     */
    removeExpense(e: WechatMiniprogram.CustomEvent) {
      if (!this.data.currentTour || !this.data.editingLocation) return;
      if (e.currentTarget.dataset.index === undefined) return;
      const id = e.currentTarget.dataset.index;
      const editingLocation = this.data.editingLocation;
      editingLocation.removeExpense(id);
      this.setData({ editingLocation: editingLocation });
    },
    /**
     * 消费编辑弹窗
     */
    onExpenseVisibleChange(e: WechatMiniprogram.CustomEvent) {
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
    /**
     * 主辅货币切换金额显示更新
     * @returns 
     */
    async changeExpense() {
      if (this.properties.readonly) {
        this.setData({ expenseVisible: false });
        return;
      }
      if (!this.data.currentTour || !this.data.editingLocation) return;

      const currentTour = this.data.currentTour;
      if (!currentTour) return;

      const id = this.data.editingLocationId;
      if (id === -1) return;

      currentTour.locations[this.data.currentTourCopyIndex][id] = this.data.editingLocation;
      await app.changeFullTour(currentTour);
      this.onCurrentTourChange(currentTour);
      this.setData({ currentTour: currentTour, expenseVisible: false });
    },
    /**
     * 切换消费
     */
    onExpenseIdChange(e: WechatMiniprogram.CustomEvent) {
      const id = e.detail.value[0] === undefined ? -1 : e.detail.value[0];
      this.setData({ editingExpenseId: id });
    },
    /**
     * 消费标题更改
     * @param e 
     * @returns 
     */
    onExpenseTitleInput(e: WechatMiniprogram.CustomEvent) {
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
    /**
     * 消费金额更改
     */
    onExpensePriceInput(e: WechatMiniprogram.CustomEvent) {
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
    /**
     * 更换主辅货币
     * @returns 
     */
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
    /**
     * 消费类型变更
     * @param e 
     * @returns 
     */
    handleExpenseTypeChange(e: WechatMiniprogram.CustomEvent) {
      if (!this.data.editingLocation) return;
      this.setData({
        'editingLocation.expenses': this.data.editingLocation.expenses.map((expense: any, index: number) => {
          if (index === this.data.editingExpenseId) {
            expense.type = e.detail.value;
          }
          return expense;
        })
      });
      // console.log("editinglocexpenses",this.data.editingLocation.expenses)
    },
    /**
     * 消费金额显示类型（总价/人均）
     * @returns 
     */
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
    /**
     * 消费关联用户更改
     * @param e 
     * @returns 
     */
    handleExpenseUserChange(e: WechatMiniprogram.CustomEvent) {
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
    /**
     * 消费关联预算表更改
     * @param e 
     * @returns 
     */
    handleExpenseBudgetChange(e: WechatMiniprogram.CustomEvent) {
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
    /**
     * 消费备注更改
     * @param e 
     * @returns 
     */
    onExpenseNoteInput(e: WechatMiniprogram.CustomEvent) {
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
     * 消费备注弹窗
     * @param e 
     * @returns 
     */
    onNoteVisibleChange(e: WechatMiniprogram.CustomEvent) {
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
    /**
     * 填写备注
     * @param e 
     */
    onNoteInput(e: WechatMiniprogram.CustomEvent) {
      this.setData({ editingNote: e.detail.value });
    },
    async changeNote() {
      if (this.properties.readonly) {
        this.setData({ noteVisible: false });
        return;
      }
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
      await app.changeFullTour(currentTour);
      this.onCurrentTourChange(currentTour);
    },

    //@@@@@@@@@@@@@
    //交通节点消费编辑
    //@@@@@@@@@@@@@
    /**
     * 添加消费
     */
    async addTransportExpense(e: WechatMiniprogram.CustomEvent) {
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
      await app.changeFullTour(currentTour);
      this.onCurrentTourChange(currentTour);
      //  console.log("editingtrans", editingTransportation)
    },
    async getTransitDirection(e: WechatMiniprogram.CustomEvent) {
      if (e.currentTarget.dataset.index != undefined) {
        this.setData({ editingTransportationId: e.currentTarget.dataset.index });
      }
      if (!this.data.currentTour || this.data.editingTransportationId < 0) return;

      const currentTour = this.data.currentTour;
      const currentTourCopyIndex = this.data.currentTourCopyIndex;
      if (!currentTour) return;

      const id = this.data.editingTransportationId;
      const origin = currentTour.locations[currentTourCopyIndex][id];
      const destination = currentTour.locations[currentTourCopyIndex][id + 1];
      const startDate = currentTour.startDate;
      const that = this;

      wx.showModal({
        title: '公交导航',
        content: '是否使用公交导航？获得的路径将覆盖当前节点交通信息',
        success: async (res) => {
          if (res.confirm) {
            wx.showActionSheet({
              alertText: '请选择你的乘坐策略:',
              itemList: ['推荐模式', '最低票价', '最少换乘', '最少步行', '最短时间', '地铁优先'],
              async success(res) {
                const strategyList = [0, 1, 2, 3, 8, 7];
                const { walking_distance, duration, amount, route: transportations } = await app.getTransitDirections(origin, destination, startDate, strategyList[res.tapIndex]);
                const routeItemList = transportations.map((_, index) => {
                  return `${Math.floor(duration[index] / 3600)}小时${Math.round(duration[index] % 3600 / 60)}分钟,步行距离${walking_distance[index]}米,费用${amount[index]}元`;
                })
                if (transportList.length === 0) {
                  wx.showToast({
                    title: '获取公交信息失败',
                    icon: 'none'
                  });
                  return;
                }
                wx.showActionSheet({
                  alertText: '查询到以下路线,请选择:',
                  itemList: routeItemList,
                  async success(res) {
                    const newTransportation = new Transportation({ ...transportations[res.tapIndex], index: id });
                    currentTour.transportations[currentTourCopyIndex][id] = newTransportation;
                    destination.startOffset = newTransportation.endOffset;
                    that.setData({ currentTour: currentTour });
                    await app.changeFullTour(currentTour);
                    that.onCurrentTourChange(currentTour);
                  }
                });
              }
            });
          }
        }
      })
    },
    /**
     * 删除消费
     * @param e 
     * @returns 
     */
    async removeTransportExpense(e: WechatMiniprogram.CustomEvent) {
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
      await app.changeFullTour(currentTour);
      this.onCurrentTourChange(currentTour);
    },
    /**
     * 消费编辑弹窗
     * @param e 
     * @returns 
     */
    onTransExpenseVisibleChange(e: WechatMiniprogram.CustomEvent) {
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
      //  console.log("editingtrans", editingTransportation)
    },
    /**
     * 消费标题更改
     */
    onTransExpenseTitleInput(e: WechatMiniprogram.CustomEvent) {
      if (!this.data.editingTransExpense) return;
      this.setData({
        'editingTransExpense.title': e.detail.value
      });
    },
    /**
     * 消费金额更改
     */
    onTransExpensePriceInput(e: WechatMiniprogram.CustomEvent) {
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
    /**
     * 消费备注更改
     * @param e 
     * @returns 
     */
    onTransExpenseNoteInput(e: WechatMiniprogram.CustomEvent) {
      if (!this.data.editingTransExpense) return;
      this.setData({
        'editingTransExpense.note': e.detail.value
      });
    },
    /**
     * 消费类型更改
     * @param e 
     * @returns 
     */
    handleTransExpenseTypeChange(e: WechatMiniprogram.CustomEvent) {
      if (!this.data.editingTransExpense) return;
      this.setData({
        'editingTransExpense.transportType': e.detail.value
      });
    },
    /**
     * 消费关联用户更改
     * @param e 
     * @returns 
     */
    handleTransExpenseUserChange(e: WechatMiniprogram.CustomEvent) {
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
    /**
     * 消费关联预算表更改
     * @param e 
     * @returns 
     */
    handleTransExpenseBudgetChange(e: WechatMiniprogram.CustomEvent) {
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
    /**
     * 消费主辅货币切换
     * @returns 
     */
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
    /**
     * 消费金额显示切换（总体/平均）
     * @returns 
     */
    exchangeTransExpenseAmountType() {
      if (!this.data.editingTransExpense) return;
      this.setData({
        'editingTransExpense.amountType': this.data.editingTransExpense.amountType ==
          AmountType.Average ? AmountType.Total : AmountType.Average
      });
    },
    /**
     * 切换消费
     */
    async changeTransExpense() {
      if (this.properties.readonly) {
        this.setData({ transExpenseVisible: false });
        return;
      }
      if (!this.data.editingTransExpense) return;
      if (!this.data.currentTour || this.data.editingTransportationId < 0) return;

      const currentTour = this.data.currentTour;
      if (!currentTour) return;

      const trans_id = this.data.editingTransportationId;
      const expense_id = this.data.editingExpenseId;
      const editingTransportation = currentTour.transportations[this.data.currentTourCopyIndex][trans_id];
      editingTransportation.transportExpenses[expense_id] = this.data.editingTransExpense;

      await app.changeFullTour(currentTour);
      this.onCurrentTourChange(currentTour);
      this.setData({
        currentTour: currentTour,
        editingTransportationId: -1,
        editingExpenseId: -1,
        transExpenseVisible: false,
        editingTransExpense: null
      });
    },

    //@@@@@@@@@@@@@
    //日期筛选
    //@@@@@@@@@@@@@
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
    //@@@@@@@@@@@@@
    //行程版本切换
    //@@@@@@@@@@@@@
    onCopyChange(index: number) {
      this.setData({ currentTourCopyIndex: index });
      this.filterNodeByDate(this.properties.dateFilter);
    },
    //@@@@@@@@@@@@@
    //位置节点（新增、插入与删除）
    //@@@@@@@@@@@@@
    /**
     * 插入位置节点
     * @param e 
     * @returns 
     */
    async handleLocationInsert(e: WechatMiniprogram.CustomEvent) {
      const currentTour = this.data.currentTour;
      const index = e.currentTarget.dataset.index;
      if (!currentTour || index === undefined) return;
      currentTour.insertLocation(index, this.data.currentTourCopyIndex);
      await app.changeFullTour(currentTour);
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
    /**
     * 删除位置节点
     * @param e 
     * @returns 
     */
    async handleLocationRemove(e: WechatMiniprogram.CustomEvent) {
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

      await app.changeFullTour(currentTour);
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
