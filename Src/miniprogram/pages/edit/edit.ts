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
import { currencyList, transportList, expenseList, tagList, Tour, Location, TransportExpense } from '../../utils/tour';
import { MILLISECONDS, formatTime, formatNumber, timeToMilliseconds, formatDate } from '../../utils/util';

const app = getApp<IAppOption>();
enum DatetimeEditMode { None, StartDate, EndDate };

Component({
    data: {
        // 页面显示内容
        tabList: [
            { icon: 'map-search', label: '计划', value: 0 },
            { icon: 'map-setting', label: '设置', value: 1 },
        ],
        transiconList: [
            'bus', 'metro', 'train', 'flight', 'walk', 'cycle', 'car', 'taxi', 'ship', 'other'
        ],
        currencyList: currencyList,
        transportList: transportList,
        expenseList: expenseList,
        tagList: tagList,
        minDate: new Date(new Date().getTime() - 365 * MILLISECONDS.DAY).getTime(),
        maxDate: new Date(new Date().getTime() + 365 * MILLISECONDS.DAY).getTime(),

        // 页面状态
        childPage: 0,
        selectingTour: false,
        datetimeVisible: false,
        mapVisible: false,
        expenseVisible: false,
        noteVisible: false,
        transExpenseVisible: false,
        priceError: false,
        calendarVisible: false,

        // 数据缓存
        currentTour: null as Tour | null,
        currentDateRange: null as number[] | null,
        selectingDatetime: new Date().getTime(),
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
    },
    methods: {
        onShow() {
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
                    currentDateRange: [
                        new Date(currentTour.startDate).getTime(),
                        new Date(currentTour.endDate).getTime() + MILLISECONDS.DAY - MILLISECONDS.MINUTE
                    ]
                });
            }
            else {
                this.setData({ currentDateRange: null });
            }
        },
        onChildPageChange(e: any) {
            this.setData({ childPage: e.detail.value })
        },
        /**
         * 位置节点标题修改
         */
        handleLocationTitleInput(e: any) {
            if (!this.data.currentTour) return;

            const currentTour = new Tour(this.data.currentTour);
            const id = e.currentTarget.dataset.index;
            if (id === undefined) return;

            currentTour.locations[id].title = e.detail.value;
            app.globalData.currentTour = currentTour;
            this.setData({ currentTour: currentTour });
            wx.setStorageSync('tour-' + currentTour.id, currentTour);
        },
        /**
         * 位置节点起始日期修改
         */
        handleNodeStartDateSelect(e: any) {
            if (e.currentTarget.dataset.index != undefined) {
                this.setData({ editingLocationId: e.currentTarget.dataset.index });
            }
            if (!this.data.currentTour || this.data.editingLocationId < 0) return;
            const editingLocation = this.data.currentTour.locations[this.data.editingLocationId];
            this.setData({
                datetimeVisible: true,
                selectingDatetime: new Date(editingLocation.startDate).getTime(),
                datetimeEditMode: DatetimeEditMode.StartDate
            });
        },
        handleNodeEndDateSelect(e: any) {
            if (e.currentTarget.dataset.index != undefined) {
                this.setData({ editingLocationId: e.currentTarget.dataset.index });
            }
            if (!this.data.currentTour || this.data.editingLocationId < 0) return;
            const editingLocation = this.data.currentTour.locations[this.data.editingLocationId];
            this.setData({
                datetimeVisible: true,
                selectingDatetime: new Date(editingLocation.endDate).getTime(),
                datetimeEditMode: DatetimeEditMode.EndDate
            });
        },
        onDatetimeColumnChange(e: any) {
            this.setData({ selectingDatetime: new Date(e.detail.value + ":00").getTime() });
        },
        onDatetimeConfirm() {
            if (!this.data.currentTour || this.data.editingLocationId < 0) return;

            const id = this.data.editingLocationId;
            const currentTour = new Tour(this.data.currentTour);
            const editingLocation = currentTour.locations[id];

            if (this.data.datetimeEditMode === DatetimeEditMode.StartDate) {
                editingLocation.startDate = new Date(this.data.selectingDatetime);
                editingLocation.startDateStr = formatTime(editingLocation.startDate);
                editingLocation.updateDuration();
                if (id > 0) {
                    const associatedTransportation = currentTour.transportations[id - 1];
                    associatedTransportation.endDate = editingLocation.startDate;
                    associatedTransportation.endDateStr = editingLocation.startDateStr;
                    associatedTransportation.updateDuration();
                }
            }
            else if (this.data.datetimeEditMode === DatetimeEditMode.EndDate) {
                editingLocation.endDate = new Date(this.data.selectingDatetime);
                editingLocation.endDateStr = formatTime(editingLocation.endDate);
                editingLocation.updateDuration();
                if (id < currentTour.locations.length - 1) {
                    const associatedTransportation = currentTour.transportations[id];
                    associatedTransportation.startDate = editingLocation.endDate;
                    associatedTransportation.startDateStr = editingLocation.endDateStr;
                    associatedTransportation.updateDuration();
                }
            }

            app.globalData.currentTour = currentTour;
            this.setData({
                currentTour: currentTour,
                editingLocationId: -1,
                datetimeVisible: false,
                datetimeEditMode: DatetimeEditMode.None
            });
            wx.setStorageSync('tour-' + currentTour.id, currentTour);
        },
        onDatetimeCancel() {
            this.setData({
                datetimeVisible: false,
                editingLocationId: -1,
                datetimeEditMode: DatetimeEditMode.None
            });
        },
        /**
         * 位置节点备注修改
         */
        onNoteVisibleChange(e: any) {
            if (!this.data.currentTour) return;

            const currentTour = new Tour(this.data.currentTour);
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

            const currentTour = new Tour(this.data.currentTour);
            currentTour.locations[this.data.editingLocationId].note = this.data.editingNote;

            app.globalData.currentTour = currentTour;
            this.setData({
                currentTour: currentTour,
                noteVisible: false,
                editingLocationId: -1,
                editingNote: ''
            });
            wx.setStorageSync('tour-' + currentTour.id, currentTour);
        },
        /**
         * 位置节点地图位置修改
         */
        onMapVisibleChange(e: any) {
            if (!this.data.currentTour) return;

            const currentTour = new Tour(this.data.currentTour);
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

            const currentTour = new Tour(this.data.currentTour);
            const id = this.data.editingLocationId;
            if (id === -1) return;

            currentTour.locations[id].latitude = this.data.mapLocation[0];
            currentTour.locations[id].longitude = this.data.mapLocation[1];
            app.globalData.currentTour = currentTour;
            this.setData({ currentTour: currentTour, mapVisible: false });
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
            const durationStr = (
                formatNumber(Math.floor(editingTransportation.duration / MILLISECONDS.HOUR))
                + ':' +
                formatNumber(Math.floor(editingTransportation.duration % MILLISECONDS.HOUR / MILLISECONDS.MINUTE))
            );
            this.setData({
                durationVisible: true,
                selectingDuration: durationStr,
            });
        },
        onDurationColumnChange(e: any) {
            this.setData({ selectingDuration: e.detail.value });
        },
        onDurationConfirm() {
            if (!this.data.currentTour || this.data.editingTransportationId < 0) return;

            const id = this.data.editingTransportationId;
            const currentTour = new Tour(this.data.currentTour);
            const editingTransportation = currentTour.transportations[id];
            const milliseconds = timeToMilliseconds(this.data.selectingDuration);
            editingTransportation.endDate = new Date(editingTransportation.startDate.getTime() + milliseconds);
            editingTransportation.endDateStr = formatTime(editingTransportation.endDate);
            editingTransportation.updateDuration();

            const associatedLocation = currentTour.locations[id + 1];
            associatedLocation.startDate = editingTransportation.endDate;
            associatedLocation.startDateStr = editingTransportation.endDateStr;
            associatedLocation.updateDuration();

            app.globalData.currentTour = currentTour;
            this.setData({
                currentTour: currentTour,
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
            if (!this.data.currentTour) return;

            const currentTour = new Tour(this.data.currentTour);
            currentTour.addLocation();
            app.globalData.currentTour = currentTour;
            this.setData({ currentTour: currentTour });
            wx.setStorageSync('tour-' + currentTour.id, currentTour);
        },
        removeNode(e: any) {
            if (!this.data.currentTour) return;

            const currentTour = new Tour(this.data.currentTour);
            currentTour.removeLocation(e.currentTarget.dataset.index);
            app.globalData.currentTour = currentTour;
            this.setData({ currentTour: currentTour });
            wx.setStorageSync('tour-' + currentTour.id, currentTour);
        },
        /**
         * 消费弹窗
         */
        onExpenseVisibleChange(e: any) {
            if (!this.data.currentTour) return;
            const id = e.currentTarget.dataset.index === undefined ? -1 : e.currentTarget.dataset.index;
            const currentTour = new Tour(this.data.currentTour);
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

            const currentTour = new Tour(this.data.currentTour);
            const id = this.data.editingLocationId;
            currentTour.locations[id] = this.data.editingLocation;

            app.globalData.currentTour = currentTour;
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
            const currentTour = new Tour(this.data.currentTour);
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
                            expense.amount = e.detail.value;
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
         * 增减交通花费
         */
        addTransportExpense(e: any) {
            if (e.currentTarget.dataset.index != undefined) {
                this.setData({ editingTransportationId: e.currentTarget.dataset.index });
            }
            if (!this.data.currentTour || this.data.editingTransportationId < 0) return;

            const currentTour = new Tour(this.data.currentTour);
            const id = this.data.editingTransportationId;
            const editingTransportation = currentTour.transportations[id];
            editingTransportation.addTransportExpense(currentTour.mainCurrency);

            app.globalData.currentTour = currentTour;
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

            const currentTour = new Tour(this.data.currentTour);
            const trans_id = this.data.editingTransportationId;
            const expense_id = this.data.editingExpenseId;
            const editingTransportation = currentTour.transportations[trans_id];
            editingTransportation.removeTransportExpense(expense_id);

            app.globalData.currentTour = currentTour;
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

            const currentTour = new Tour(this.data.currentTour);
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
                    'editingTransExpense.amount': e.detail.value
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
        exchangeTransExpenseCurrency() {
            if (!this.data.editingTransExpense) return;
            if (!this.data.currentTour || this.data.editingTransportationId < 0) return;
            const mainCurrency = this.data.currentTour.mainCurrency;
            const subCurrency = this.data.currentTour.subCurrency;
            this.setData({
                'editingTransExpense.currency': this.data.editingTransExpense.currency === mainCurrency ? subCurrency : mainCurrency
            });
        },
        changeTransExpense() {
            if (!this.data.editingTransExpense) return;
            if (!this.data.currentTour || this.data.editingTransportationId < 0) return;

            const currentTour = new Tour(this.data.currentTour);
            const trans_id = this.data.editingTransportationId;
            const expense_id = this.data.editingExpenseId;
            const editingTransportation = currentTour.transportations[trans_id];
            editingTransportation.transportExpenses[expense_id] = this.data.editingTransExpense;

            app.globalData.currentTour = currentTour;
            this.setData({
                currentTour: currentTour,
                editingTransportationId: -1,
                editingExpenseId: -1,
                transExpenseVisible: false,
                editingTransExpense: null
            });
            wx.setStorageSync('tour-' + currentTour.id, currentTour);
        },
        /**
         * 行程整体编辑
         */
        handleTitleInput(e: any) {
            if (!this.data.currentTour) return;

            const currentTour = new Tour(this.data.currentTour);
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
        async exchangeTourCurrency(){
            if (!this.data.currentTour) return;

            const currentTour = new Tour(this.data.currentTour);
            const newMainCurrency = currentTour.subCurrency;
            const newSubCurrency = currentTour.mainCurrency;
            currentTour.mainCurrency = newMainCurrency;
            currentTour.subCurrency = newSubCurrency;
            await currentTour.getExchangeRate();

            app.globalData.currentTour = currentTour;
            this.setData({ currentTour: currentTour });
            wx.setStorageSync('tour-' + currentTour.id, currentTour);
        },
        async getCurrencyExchangeRate() {
            if (!this.data.currentTour) return;

            const currentTour = new Tour(this.data.currentTour);
            await currentTour.getExchangeRate();

            app.globalData.currentTour = currentTour;
            this.setData({ currentTour: currentTour });
            wx.setStorageSync('tour-' + currentTour.id, currentTour);
        },
        onTourCurrencyExchangeRateInput(e: any) {
            if (!this.data.currentTour) return;

            const currentTour = new Tour(this.data.currentTour);
            const { priceError } = this.data;
            const isNumber = /^\d+(\.\d+)?$/.test(e.detail.value);
            if (priceError === isNumber) {
                this.setData({
                    priceError: !isNumber,
                });
            }
            if (!isNumber) return;
            currentTour.currencyExchangeRate = e.detail.value;
            app.globalData.currentTour = currentTour;
            this.setData({ currentTour: currentTour });
            wx.setStorageSync('tour-' + currentTour.id, currentTour);
        },
        handleCalendar() {
            this.setData({ calendarVisible: true });
        },
        handleCalendarConfirm(e: any) {
            if (!this.data.currentTour) return;

            const currentTour = new Tour(this.data.currentTour);
            currentTour.startDate = new Date(e.detail.value[0]);
            currentTour.endDate = new Date(e.detail.value[1]);
            currentTour.startDateStr = formatDate(currentTour.startDate);
            currentTour.endDateStr = formatDate(currentTour.endDate);
            this.setData({
                currentDateRange: [
                    new Date(currentTour.startDate).getTime(),
                    new Date(currentTour.endDate).getTime() + MILLISECONDS.DAY - MILLISECONDS.MINUTE
                ]
            });

            app.globalData.currentTour = currentTour;
            app.globalData.tourList = app.globalData.tourList.map((tour: any) => {
                if (tour.id === currentTour.id) {
                    tour.startDate = currentTour.startDateStr;
                    tour.endDate = currentTour.endDateStr;
                }
                return tour;
            });
            this.setData({
                currentTour: currentTour,
                calendarVisible: false
            });
            wx.setStorageSync('tour-' + currentTour.id, currentTour);
        }
    },
})
