import { Transportation } from '../../../utils/tour/tourNode';
import { Tour } from '../../../utils/tour/tour';
import { currencyList } from '../../../utils/tour/expense';
import { timezoneList } from '../../../utils/tour/timezone';
import { MILLISECONDS, formatDate, formatTime, } from '../../../utils/util';

const app = getApp<IAppOption>();


Component({
    pageLifetimes: {
        show() {
          // console.log('edit-settings pageLifetimes.show 被触发');
          
          // edit页面显示时，刷新组件数据
          this. loadCurrentTourSettings();
        },
    },
    data: {
           currencyList: currencyList,
           timezoneList: timezoneList,
          
           currentStartDateStr: '',
           currentEndDateStr: '',
           currentTimezoneStr: '',
   
           // 数据缓存
           currentTour: null as Tour | null,
           selectingTimeOffset: -480,
       },
       lifetimes: {
        created() {

        },
        attached() {
            this.loadCurrentTourSettings();
        },
        moved() {
    
        },
        detached() {
    
        },
      },
    methods:{
            loadCurrentTourSettings(){
                // console.log("加载行程默认设置...");
                this.setData({
                    selectingTour: app.globalData.selectingTour,
                    currentTour: app.globalData.currentTour,
                });
                if (app.globalData.currentTour) {
                    const currentTour = app.globalData.currentTour as Tour;
                    this.setData({
                        currentStartDateStr: formatDate(currentTour.startDate, currentTour.timeOffset),
                        currentEndDateStr: formatDate(currentTour.endDate, currentTour.timeOffset),
                        currentTimezoneStr: timezoneList.find(tz => tz.value === currentTour.timeOffset)?.label || '未知时区',
                        currentDateRange: [
                            new Date(currentTour.startDate).getTime(),
                            new Date(currentTour.endDate).getTime() + MILLISECONDS.DAY - MILLISECONDS.MINUTE
                        ],
                    });
                }
                else {
                    this.setData({ currentDateRange: null });
                }
                // console.log("加载完毕！")
            },
            //使用最新数据创建currentTour实例
            getLatestTour(){
                if (!this.data.currentTour) return;
                const latestTour = app.globalData.currentTour || this.data.currentTour;
                const currentTour = new Tour(latestTour);
                return currentTour;
            },
            /**
             * 行程整体编辑
             */
            handleTitleInput(e: any) {
                if (!this.data.currentTour) return;

                const currentTour = this.getLatestTour();
                if(!currentTour) return;

                currentTour.title = e.detail.value;
                app.globalData.currentTour = currentTour;
                app.globalData.tourList = app.globalData.tourList.map((tour: any) => {
                    if (tour.id === currentTour.id) {
                        tour.title = currentTour.title;
                    }
                    return tour;
                });
                this.setData({ currentTour: currentTour });
                wx.setStorageSync('tour-' + currentTour.id, currentTour);
            },
            /**
             * 交换主辅货币
             */
            exchangeTourCurrency() {
                if (!this.data.currentTour) return;

                const currentTour = this.getLatestTour();
                if(!currentTour) return;

                const newMainCurrency = currentTour.subCurrency;
                const newSubCurrency = currentTour.mainCurrency;
                currentTour.mainCurrency = newMainCurrency;
                currentTour.subCurrency = newSubCurrency;
                currentTour.currencyExchangeRate = Number((1 / currentTour.currencyExchangeRate).toFixed(7));

                app.globalData.currentTour = currentTour;
                this.setData({ currentTour: currentTour });
                wx.setStorageSync('tour-' + currentTour.id, currentTour);
            },
            /**
             * 获取汇率
             */
            async getCurrencyExchangeRate() {
                if (!this.data.currentTour) return;

               const currentTour = this.getLatestTour();
                if(!currentTour) return;

                await currentTour.getExchangeRate();

                app.globalData.currentTour = currentTour;
                this.setData({ currentTour: currentTour });
                wx.setStorageSync('tour-' + currentTour.id, currentTour);
            },
            /**
             * 手动输入汇率
             * @param e 
             * @returns 
             */
            onTourCurrencyExchangeRateInput(e: any) {
                if (!this.data.currentTour) return;

                const currentTour = this.getLatestTour();
                if(!currentTour) return;

                const { priceError } = this.data;
                const isNumber = /^\d+(\.\d+)?$/.test(e.detail.value);
                if (priceError === isNumber) {
                    this.setData({
                        priceError: !isNumber,
                    });
                }
                if (!isNumber) return;
                currentTour.currencyExchangeRate = Number(e.detail.value);
                app.globalData.currentTour = currentTour;
                this.setData({ currentTour: currentTour });
                wx.setStorageSync('tour-' + currentTour.id, currentTour);
            },
            handleCalendar() {
                this.setData({ calendarVisible: true });
            },
            /**
             * 更改起止日期
             * @param e 
             * @returns 
             */
            handleCalendarConfirm(e: any) {
                if (!this.data.currentTour) return;

                const currentTour = this.getLatestTour();
                if(!currentTour) return;

                currentTour.startDate = new Date(e.detail.value[0]).getTime();
                currentTour.endDate = new Date(e.detail.value[1]).getTime();
                this.setData({
                    currentDateRange: [
                        new Date(currentTour.startDate).getTime(),
                        new Date(currentTour.endDate).getTime() + MILLISECONDS.DAY - MILLISECONDS.MINUTE
                    ]
                });

                app.globalData.currentTour = currentTour;
                app.globalData.tourList = app.globalData.tourList.map((tour: any) => {
                    if (tour.id === currentTour.id) {
                        tour.startDate = formatDate(currentTour.startDate, currentTour.timeOffset);
                        tour.endDate = formatDate(currentTour.endDate, currentTour.timeOffset);
                    }
                    return tour;
                });
                this.setData({
                    currentTour: currentTour,
                    currentStartDateStr: formatDate(currentTour.startDate, currentTour.timeOffset),
                    currentEndDateStr: formatDate(currentTour.endDate, currentTour.timeOffset),
                    calendarVisible: false
                });
                wx.setStorageSync('tour-' + currentTour.id, currentTour);
            },
            /**
             * 更改时区
             * @returns 
             */
            handleTourTimezoneSelector() {
                if (!this.data.currentTour) return;
                this.setData({
                    selectingTimeOffset: this.data.currentTour.timeOffset,
                    timezoneVisible: true
                });
            },
            onTimezoneColumnChange(e: any) {
                this.setData({ selectingTimeOffset: Number(e.detail.value[0]) });
            },
            onTimezonePickerCancel() {
                this.setData({
                    timezoneVisible: false,
                    selectingTimeOffset: -480,
                });
            },
            onTourTimezonePickerChange() {
                if (!this.data.currentTour) return;

                const currentTour = this.getLatestTour();
                if(!currentTour) return;

                currentTour.timeOffset = this.data.selectingTimeOffset;

                app.globalData.currentTour = currentTour;
                this.setData({
                    currentTour: currentTour,
                    currentTimezoneStr: timezoneList.find(tz => tz.value === currentTour.timeOffset)?.label || '未知时区',
                    timezoneVisible: false,
                });
                wx.setStorageSync('tour-' + currentTour.id, currentTour);
            },
            /**
             * 导出行程到剪贴板
             * @returns 
             */
            exportTourToClipboard() {
                if (!this.data.currentTour) return;

                const currentTour = this.getLatestTour();
                if(!currentTour) return;
                const exportText = currentTour.toString();
                wx.setClipboardData({
                    data: exportText,
                    success: () => {
                        wx.showToast({
                            title: '导出成功',
                            icon: 'success',
                            duration: 2000
                        });
                    }
                });
            },

    },

})