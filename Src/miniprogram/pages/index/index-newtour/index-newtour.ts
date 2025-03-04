/**
 * 此页面为新建/复制/导入行程界面
 * 主要功能为创建行程并将行程信息持久化存储
 */
import { Tour } from '../../../utils/tour/tour';
import { Currency, currencyList } from '../../../utils/tour/expense';
import { formatDate, MILLISECONDS } from '../../../utils/util';

Component({
  behaviors: [],
  properties: {

  },
  data: {
      creatorArray: [
      { image: '../../../resources/chika2.png', text: '从零开始创建一个空白行程.', button: '创建', action: 'onCreatorVisibleChange' },
      { image: '../../../resources/ruby2.png', text: '复制一个已有的行程.', button: '拷贝', action: 'onTourSelectorVisibleChange' },
      { image: '../../../resources/you2.png', text: '从外部复制的文本数据导入行程.', button: '导入', action: 'onImporterVisibleChange' },
      ],

      tourList: [] as { id: number; title: string; startDate: string; endDate: string; }[],
      displayTourList: [] as { label: string; value: number }[],
      mainCurrencies: currencyList,
      subCurrencies: currencyList,
      minDate: new Date(new Date().getTime() - 365 * MILLISECONDS.DAY).getTime(),
      maxDate: new Date(new Date().getTime() + 365 * MILLISECONDS.DAY).getTime(),
      currencyText: '主货币:人民币-CNY\n辅货币:日元-JPY',

      creatorVisible: false,
      importerVisible: false,
      calendarVisible: false,
      currencySelectorVisible: false,
      tourSelectorVisible: false,

      tourHashMap: new Map(),

      // 创建新行程数据
      newTourName: '新的旅程',
      newTourDate: [new Date().getTime(), new Date(new Date().getTime() + MILLISECONDS.DAY).getTime()],
      newTourStartDateStr: formatDate(new Date()),
      newTourEndDateStr: formatDate(new Date(new Date().getTime() + MILLISECONDS.DAY)),
      newTourCurrency: [Currency.CNY, Currency.JPY],
      newTourTimeOffset: -480,

      // 复制行程数据
      selectingTourId: 0,

      // 导入行程数据
      importedTourData: '',
  },
  lifetimes: {
    created() {

    },
    attached() {
           this.updateTourHashMap();
           this.updateTourList;
    },
    
    moved() {

    },
    detached() {

    },
  },
  methods: {
        /**
         *  updateTourHashMap()
         * //从wxstorage中获取tourhashmap并赋值给组件
         */
        updateTourHashMap() {
          return new Promise((resolve) => {
              wx.getStorage({
                  key: 'tourHashMap',
                  success: (res) => {
                      this.setData({ tourHashMap: new Map(res.data) });
                      resolve(true);
                  },
                  fail: () => {
                      this.setData({ tourHashMap: new Map() }); // 初始化为空 Map
                      resolve(true);
                  },
              });
          });
        },
        /**
         * 
         * //新行程弹窗
         */
        onCreatorVisibleChange() {
            this.setData({
                creatorVisible: !this.data.creatorVisible,
            });
        },
        //控制日历弹窗显现
        handleCalendar() {
            this.setData({ calendarVisible: true });
        },
        //控制日历弹窗的确定，给组件存储的newTour赋值
        handleCalendarConfirm(e: any) {
            this.setData({
                newTourDate: e.detail.value,
                newTourStartDateStr: formatDate(new Date(e.detail.value[0])),
                newTourEndDateStr: formatDate(new Date(e.detail.value[1])),
            });
        },
        //行程名字变更
        handleTitleInput(e: any) {
            this.setData({ newTourName: e.detail.value, });
        },
        //控制货币变更
        onCurrencyColumnChange(e: any) {
            const { column, index } = e.detail;
            const newTourMainCurrency = currencyList[index].value;

            if (column === 0) {
                const subCurrencies = currencyList.filter(currency => currency.value !== newTourMainCurrency)
                this.setData({ subCurrencies: subCurrencies });
            }
        },
        //确定，更新主/辅货币
        onCurrencyPickerChange(e: any) {
            const { value, label } = e.detail;

            this.setData({
                currencySelectorVisible: false,
                newTourCurrency: value,
                currencyText: '主货币:' + label[0] + '\n辅货币:' + label[1],
            });
        },
        onCurrencyPickerCancel() {
            this.setData({
                currencySelectorVisible: false,
            });
        },
        onCurrencyPicker() {
            this.setData({ currencySelectorVisible: true });
        },
        /** 
        * 创建新行程，提取最新数据后同步更新tourHaspMap
        */
        async createTour() {
          await this.updateTourHashMap();
            this.setData({
                newTourName: this.data.newTourName
            }, async () => {
              const tourHashMap = this.data.tourHashMap;
              const existingIds = Array.from(tourHashMap.keys());
              const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 0;
                const newTour = new Tour({
                    id: newId,
                    title: this.data.newTourName,
                    startDate: this.data.newTourDate[0],
                    endDate: this.data.newTourDate[1],
                    timeOffset: this.data.newTourTimeOffset,
                    mainCurrency: this.data.newTourCurrency[0],
                    subCurrency: this.data.newTourCurrency[1],
                });
                await newTour.getExchangeRate();
                tourHashMap.set(newId, 'tour-' + newTour.id);

                this.setData({
                    tourHashMap: tourHashMap,
                    creatorVisible: false,
                });

                Promise.all([
                    new Promise((resolve, reject) => {
                        wx.setStorage({
                            key: 'tour-' + newTour.id,
                            data: newTour,
                            success: resolve,
                            fail: reject,
                        });
                    }),
                    new Promise((resolve, reject) => {
                        wx.setStorage({
                            key: 'tourHashMap',
                            data: Array.from(tourHashMap),
                            success: resolve,
                            fail: reject,
                        });
                    })
                ]).then(() => {
                    console.log("创建成功");
                    this.triggerEvent('containsTourUpdate');
                }).catch((err) => {
                    console.error('存储 tour 数据时出错: ', err);
                });
            });
        },
        /** 
        //根据hashmap值，更新组件内tourlist，displayTourlist，
        */
        async updateTourList() {
            await this.updateTourHashMap(); // 等待 tourHashMap 更新
            const tourHashMap = this.data.tourHashMap;
          
            if (tourHashMap.size === 0) {
              this.setData({
                tourList: [],
                displayTourList: [],
              });
              this.triggerEvent('containsTourUpdate');
              return; // 提前返回，外部 await 会立即完成
            }
          
            const tourList = [] as any[];
            const promises = Array.from(tourHashMap.values()).map(tour_id => {
              return new Promise((resolve, reject) => {
                wx.getStorage({
                  key: tour_id,
                  success: (res) => {
                    const tour = res.data as Tour;
                    tourList.push({
                      id: tour.id,
                      title: tour.title,
                      startDate: formatDate(tour.startDate),
                      endDate: formatDate(tour.endDate),
                    });
                    resolve(true);
                  },
                  fail: (err) => {
                    reject(err);
                  }
                });
              });
            });
          
            return Promise.all(promises)
              .then(() => {
                const displayTourList = tourList.map((tour: any) => {
                  return { label: tour.title, value: tour.id };
                });
                this.setData({
                  tourList: tourList,
                  displayTourList: displayTourList,
                });
                // console.log("tourList updated", this.data.tourList);
                this.triggerEvent('containsTourUpdate');
              })
              .catch((err) => {
                console.error('读取 tour 数据时出错: ', err);
                throw err; // 抛出错误，让外部 await 能捕获
              });
          },
         async onTourSelectorVisibleChange() {
            await this.updateTourList();
            console.log("tourList",this.data.tourList)
            if (this.data.tourList.length == 0) {
                wx.showToast({
                    title: '没有行程',
                    icon: 'error',
                    duration: 2000
                });
                return;
            }
            this.setData({
                tourSelectorVisible: !this.data.tourSelectorVisible,
                selectingTourId: this.data.tourList[0].id,
            });
        },
        onTourColumnChange(e: any) {
            this.setData({ selectingTourId: e.detail.value[0] });
        },

        /**
         * 复制行程
         */
        async copyTour() {
          await this.updateTourHashMap();
          const tourHashMap = this.data.tourHashMap;
          const existingIds = Array.from(tourHashMap.keys());
          const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 0;
          const selectingTourId = this.data.selectingTourId;

            wx.getStorage({
                key: 'tour-' + selectingTourId,
                success: (res) => {
                    const selectingTour = res.data as Tour;
                    const newTour = new Tour(selectingTour);
                    newTour.id = newId;

                    tourHashMap.set(newId, 'tour-' + newId);

                    this.setData({
                        tourHashMap: tourHashMap,
                    });

                    Promise.all([
                        new Promise((resolve, reject) => {
                            wx.setStorage({
                                key: 'tour-' + newId,
                                data: newTour,
                                success: resolve,
                                fail: reject,
                            });
                        }),
                        new Promise((resolve, reject) => {
                            wx.setStorage({
                                key: 'tourHashMap',
                                data: Array.from(tourHashMap),
                                success: resolve,
                                fail: reject,
                            });
                        })
                    ]).then(() => {
                        console.log("复制成功");
                        this.triggerEvent('containsTourUpdate');
                    }).catch((err) => {
                        console.error('存储 tour 数据时出错: ', err);
                    });
                },
            });
        },
        //导入行程
        onImporterVisibleChange() {
            this.setData({
                importerVisible: !this.data.importerVisible,
            });
        },
        handleImporterInput(e: any) {
            this.setData({ importedTourData: e.detail.value });
        },
        /**
        //同步更新hashmap
        */
        async importTour() {
          await this.updateTourHashMap();
            const tourData = Tour.fromString(this.data.importedTourData);
            if (tourData instanceof Tour) {
                const tourHashMap = this.data.tourHashMap;
                const existingIds = Array.from(tourHashMap.keys());
                const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 0;
                tourHashMap.set(newId, 'tour-' + newId);
                tourData.id = newId;

                this.setData({
                    tourHashMap: tourHashMap,

                    importerVisible: false,
                });

                Promise.all([
                    new Promise((resolve, reject) => {
                        wx.setStorage({
                            key: 'tour-' + newId,
                            data: tourData,
                            success: resolve,
                            fail: reject,
                        });
                    }),
                    new Promise((resolve, reject) => {
                        wx.setStorage({
                            key: 'tourHashMap',
                            data: Array.from(tourHashMap),
                            success: resolve,
                            fail: reject,
                        });
                    })
                ]).then(() => {
                    console.log("导入成功");
                    this.triggerEvent('containsTourUpdate');
                }).catch((err) => {
                    console.error('存储 tour 数据时出错: ', err);
                });
            }
        }
  },
});