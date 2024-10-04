import { Currency, Tour, currencyList } from '../../utils/tour';
import { formatDate, MILLISECONDS } from '../../utils/util';

const app = getApp<IAppOption>();

Component({
    data: {
        // 页面显示内容
        tabList: [
            { icon: 'list', label: '行程列表', value: 0 },
            { icon: 'map-add', label: '新建行程', value: 1 },
        ],
        creatorArray: [
            { image: '../../resources/chika2.png', text: '从零开始创建一个空白行程.', button: '创建', action: 'onCreatorVisibleChange' },
            { image: '../../resources/ruby2.png', text: '复制一个已有的行程.', button: '拷贝', action: '' },
            { image: '../../resources/you2.png', text: '从外部复制的文本数据导入行程.', button: '导入', action: '' },
        ],
        tourList: [] as { id: number; title: string; startDate: string; endDate: string; }[],
        mainCurrencies: currencyList,
        subCurrencies: currencyList,
        minDate: new Date(new Date().getTime() - 365 * MILLISECONDS.DAY).getTime(),
        maxDate: new Date(new Date().getTime() + 365 * MILLISECONDS.DAY).getTime(),

        // 页面状态
        childPage: 0,
        creatorVisible: false,
        calendarVisible: false,
        currencySelectorVisible: false,
        currencyText: '主货币:人民币-CNY\n辅货币:日元-JPY',

        // 数据缓存
        containsTour: false,
        tourHashMap: new Map(),

        // 创建新行程数据
        newTourName: '新的旅程',
        newTourDate: [new Date().getTime(), new Date(new Date().getTime() + MILLISECONDS.DAY).getTime()],
        newTourStartDateStr: formatDate(new Date()),
        newTourEndDateStr: formatDate(new Date(new Date().getTime() + MILLISECONDS.DAY)),
        newTourCurrency: [Currency.CNY, Currency.JPY],
    },
    methods: {
        onLoad() {
            this.setData({
                tourHashMap: new Map<number, string>(),
                subCurrencies: currencyList.filter(currency => currency.value !== this.data.newTourCurrency[0]),
            });
            wx.getStorage({
                key: 'tourHashMap',
                success: (res) => {
                    this.setData({ tourHashMap: new Map(res.data) });
                    if (res.data.length > 0) {
                        this.setData({ containsTour: true });
                    }
                    this.updateTourList();
                },
            })
        },
        onShow() {
            if (typeof this.getTabBar === 'function' && this.getTabBar()) {
                const page: any = getCurrentPages().pop();
                this.getTabBar().setData({ value: '/' + page.route })
            }
        },
        onChildPageChange(e: any) {
            this.setData({ childPage: e.detail.value })
        },
        onCreatorVisibleChange() {
            this.setData({
                creatorVisible: !this.data.creatorVisible,
            });
        },
        handleCalendar() {
            this.setData({ calendarVisible: true });
        },
        handleCalendarConfirm(e: any) {
            this.setData({
                newTourDate: e.detail.value,
                newTourStartDateStr: formatDate(new Date(e.detail.value[0])),
                newTourEndDateStr: formatDate(new Date(e.detail.value[1])),
            });
        },
        handleTitleInput(e: any) {
            this.setData({ newTourName: e.detail.value, });
        },
        onCurrencyColumnChange(e: any) {
            const { column, index } = e.detail;
            const newTourMainCurrency = currencyList[index].value;

            if (column === 0) {
                const subCurrencies = currencyList.filter(currency => currency.value !== newTourMainCurrency)
                this.setData({ subCurrencies: subCurrencies });
            }
        },
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
        createTour() {
            this.setData({
                newTourName: this.data.newTourName
            }, () => {
                const tourHashMap = this.data.tourHashMap;
                const newId = this.data.containsTour ? Math.max(...Array.from(tourHashMap.keys())) + 1 : 0;
                const newTour = new Tour(
                    newId,
                    this.data.newTourName,
                    new Date(this.data.newTourDate[0]),
                    new Date(this.data.newTourDate[1]),
                    this.data.newTourCurrency[0],
                    this.data.newTourCurrency[1],
                );
                tourHashMap.set(newId, 'tour-' + newTour.id);

                this.setData({
                    tourHashMap: tourHashMap,
                    containsTour: true,
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
                    this.updateTourList();
                }).catch((err) => {
                    console.error('存储 tour 数据时出错: ', err);
                });
            });
        },
        selectTour(e: any) {
            const id = e.currentTarget.dataset.index;
            wx.getStorage({
                key: 'tour-' + id,
                success: (res) => {
                    app.globalData.selectingTour = true;
                    app.globalData.currentTour = res.data as Tour;
                },
            })
        },
        removeTour(e: any) {
            const id = e.currentTarget.dataset.index;
            const tourHashMap = this.data.tourHashMap;

            if (app.globalData.currentTour && app.globalData.currentTour.id == id) {
                app.globalData.selectingTour = false;
                app.globalData.currentTour = null;
            }

            tourHashMap.delete(id);

            if (tourHashMap.size == 0) {
                this.setData({ containsTour: false });
            }

            this.setData({ tourHashMap: tourHashMap });

            wx.setStorage({
                key: 'tourHashMap',
                data: Array.from(tourHashMap),
            });
            wx.removeStorageSync('tour-' + id);

            this.updateTourList();
        },
        updateTourList() {
            const tourHashMap = this.data.tourHashMap;

            if (tourHashMap.size == 0) return;
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
                                startDate: tour.startDateStr,
                                endDate: tour.endDateStr,
                            });
                            resolve(true);
                        },
                        fail: (err) => {
                            reject(err);
                        }
                    });
                });
            });

            Promise.all(promises).then(() => {
                this.setData({
                    tourList: tourList,
                });
            }).catch((err) => {
                console.error('读取 tour 数据时出错: ', err);
            });
        }
    },
})
