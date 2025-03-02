import { Location,  Transportation } from '../../../utils/tour/tourNode';
import { Tour } from '../../../utils/tour/tour';
import { currencyList, transportList, expenseList, tagList, TransportExpense } from '../../../utils/tour/expense';
import { timezoneList } from '../../../utils/tour/timezone';
import { MILLISECONDS, formatDate, formatNumber, formatTime, timeToMilliseconds } from '../../../utils/util';

const app = getApp<IAppOption>();


Component({
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
            console.log("加载行程默认设置...");
                    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
                        const page: any = getCurrentPages().pop();
                        this.getTabBar().setData({ value: '/' + page.route })
                    }
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
                    console.log("加载完毕！")
        },
        moved() {
    
        },
        detached() {
    
        },
      },
    methods:{
            getLatestTour(){
                       //使用最新数据创建实例
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
            async getCurrencyExchangeRate() {
                if (!this.data.currentTour) return;

               const currentTour = this.getLatestTour();
                if(!currentTour) return;

                await currentTour.getExchangeRate();

                app.globalData.currentTour = currentTour;
                this.setData({ currentTour: currentTour });
                wx.setStorageSync('tour-' + currentTour.id, currentTour);
            },
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