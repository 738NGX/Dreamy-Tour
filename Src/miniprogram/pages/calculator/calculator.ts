import { evaluateExpression } from "../../utils/calculator";
import { Currency, currencyList, timezoneList } from "../../utils/tour";
import { exchangeCurrency, formatDate, formatTime, MILLISECONDS } from "../../utils/util";


Component({
    data: {
        // 页面显示内容
        keyList: [
            { value: 'C', class: 'key-d' },
            { value: '(', class: 'key-p' },
            { value: ')', class: 'key-p' },
            { value: 'D', class: 'key-d' },
            { value: '7', class: 'key-1' },
            { value: '8', class: 'key-1' },
            { value: '9', class: 'key-1' },
            { value: '÷', class: 'key-p' },
            { value: '4', class: 'key-1' },
            { value: '5', class: 'key-1' },
            { value: '6', class: 'key-1' },
            { value: '×', class: 'key-p' },
            { value: '1', class: 'key-1' },
            { value: '2', class: 'key-1' },
            { value: '3', class: 'key-1' },
            { value: '-', class: 'key-p' },
            { value: '.', class: 'key-1' },
            { value: '0', class: 'key-1' },
            { value: '=', class: 'key-m' },
            { value: '+', class: 'key-p' },
        ],
        mainCurrencies: currencyList,
        subCurrencies: currencyList,
        timezoneList: timezoneList,
        minDate: new Date(new Date().getTime() - 365 * MILLISECONDS.DAY).getTime(),
        maxDate: new Date(new Date().getTime() + 365 * MILLISECONDS.DAY).getTime(),

        // 页面状态
        childPage: 0,
        priceError: false,
        currencySelectorVisible: false,
        datetimeVisible: false,
        timezoneVisible: false,
        editingTimezoneId: -1,
        calendarVisible: false,
        dateIndex: -1,

        // 数据缓存
        screenData: '',
        isScreenDisplayResult: false,
        currencyExchangeAmount: 0,
        currencyData: [Currency.JPY, Currency.CNY],
        currencyText: '输入货币:日元-JPY\n目标货币:人民币-CNY',
        currencyExchangeRate: 0,
        currencyExchangeResult: 0,
        datetime: new Date().getTime(),
        datetimeText: formatTime(new Date(), new Date().getTimezoneOffset()),
        selectingTimeOffset: 0,
        baseTimeOffset: new Date().getTimezoneOffset(),
        baseTimezone: timezoneList.find(timezone => timezone.value === new Date().getTimezoneOffset())?.label,
        targetTimeOffset: new Date().getTimezoneOffset(),
        targetTimezone: timezoneList.find(timezone => timezone.value === new Date().getTimezoneOffset())?.label,
        targetDatetimeText: formatTime(new Date(), new Date().getTimezoneOffset()),
        date: [new Date().getTime(), new Date().getTime()],
        dateStr: [formatDate(new Date(), new Date().getTimezoneOffset()), formatDate(new Date(), new Date().getTimezoneOffset())],
        dateInterval: 0,
    },
    methods: {
        onShow() {
            if (typeof this.getTabBar === 'function' && this.getTabBar()) {
                const page: any = getCurrentPages().pop();
                this.getTabBar().setData({
                    value: '/' + page.route
                })
            }
        },
        onChildPageChange(e: any) {
            this.setData({ childPage: e.detail.value })
        },
        onKeyClick(e: any) {
            const key = e.currentTarget.dataset.index;
            if (this.data.isScreenDisplayResult) {
                this.setData({ screenData: '', isScreenDisplayResult: false });
            }
            if (key == 'C') {
                this.setData({ screenData: '' });
            }
            else if (key == 'D') {
                const screenData = this.data.screenData.slice(0, -1);
                this.setData({ screenData: screenData });
            }
            else if (key == '=') {
                const result = evaluateExpression(this.data.screenData);
                this.setData({ screenData: result, isScreenDisplayResult: true });
            }
            else {
                const screenData = this.data.screenData + key;
                this.setData({ screenData: screenData });
            }
        },
        onCurrencyExchangeAmountInput(e: any) {
            const { priceError } = this.data;
            const isNumber = /^\d+(\.\d+)?$/.test(e.detail.value);
            if (priceError === isNumber) {
                this.setData({
                    priceError: !isNumber,
                });
            }
            if (isNumber) {
                const amount = Number(e.detail.value);
                this.setData({
                    currencyExchangeAmount: amount,
                    currencyExchangeResult: amount * this.data.currencyExchangeRate,
                });
            }
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
                currencyData: value,
                currencyText: '输入货币:' + label[0] + '\n目标货币:' + label[1],
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
        async getCurrencyExchangeRate() {
            try {
                const rate = await exchangeCurrency(
                    1,
                    currencyList[this.data.currencyData[0]].symbol,
                    currencyList[this.data.currencyData[1]].symbol
                ) as number;
                this.setData({
                    currencyExchangeRate: rate,
                    currencyExchangeResult: this.data.currencyExchangeAmount * rate,
                });
            } catch (err) {
                console.error('Error:', err);
            }
        },
        onCurrencyExchangeRateInput(e: any) {
            const { priceError } = this.data;
            const isNumber = /^\d+(\.\d+)?$/.test(e.detail.value);
            if (priceError === isNumber) {
                this.setData({
                    priceError: !isNumber,
                });
            }
            if (isNumber) {
                const rate = Number(e.detail.value);
                this.setData({
                    currencyExchangeRate: rate,
                    currencyExchangeResult: this.data.currencyExchangeAmount * rate,
                });
            }
        },
        showDatetimePicker() {
            const datetime = (
                new Date(this.data.datetime).getTime()
                + new Date().getTimezoneOffset() * MILLISECONDS.MINUTE
                - this.data.baseTimeOffset * MILLISECONDS.MINUTE
            );

            this.setData({ datetimeVisible: true, datetime: datetime });
        },
        onDatetimeConfirm() {
            const datetime = new Date(
                this.data.datetime
                - new Date().getTimezoneOffset() * MILLISECONDS.MINUTE
                + this.data.baseTimeOffset * MILLISECONDS.MINUTE
            );
            this.setData({
                datetimeVisible: false,
                datetime: datetime.getTime(),
                datetimeText: formatTime(new Date(datetime), this.data.baseTimeOffset),
                targetDatetimeText: formatTime(new Date(datetime), this.data.targetTimeOffset),
            });
        },
        onDatetimeCancel() {
            const datetime = (
                new Date(this.data.datetime).getTime()
                - new Date().getTimezoneOffset() * MILLISECONDS.MINUTE
                + this.data.baseTimeOffset * MILLISECONDS.MINUTE
            );
            this.setData({
                datetimeVisible: false,
                datetime: datetime,
            });
        },
        onDatetimeColumnChange(e: any) {
            this.setData({ datetime: new Date(e.detail.value + ':00').getTime() });
        },
        showTimezonePicker(e: any) {
            this.setData({
                timezoneVisible: true,
                editingTimezoneId: e.currentTarget.dataset.index,
                selectingTimeOffset: e.currentTarget.dataset.index === 0 ? this.data.baseTimeOffset : this.data.targetTimeOffset,
            });
        },
        onTimezoneColumnChange(e: any) {
            this.setData({ selectingTimeOffset: Number(e.detail.value[0]) });
        },
        onTimezonePickerCancel() {
            this.setData({
                timezoneVisible: false,
            });
        },
        onTourTimezonePickerChange() {
            const { editingTimezoneId, selectingTimeOffset } = this.data;

            if (editingTimezoneId === 0) {
                this.setData({
                    baseTimeOffset: selectingTimeOffset,
                    baseTimezone: timezoneList.find(timezone => timezone.value === selectingTimeOffset)?.label,
                });
            } else {
                this.setData({
                    targetTimeOffset: selectingTimeOffset,
                    targetTimezone: timezoneList.find(timezone => timezone.value === selectingTimeOffset)?.label,
                });
            }

            const datetime = new Date(
                this.data.datetime
                - new Date().getTimezoneOffset() * MILLISECONDS.MINUTE
                + this.data.baseTimeOffset * MILLISECONDS.MINUTE
            );
            this.setData({
                targetDatetimeText: formatTime(new Date(datetime), this.data.targetTimeOffset),
                timezoneVisible: false,
            });
        },
        callCalendar(e: any) {
            this.setData({ calendarVisible: true, dateIndex: e.currentTarget.dataset.index });
        },
        handleCalendarConfirm(e: any) {
            const { dateIndex } = this.data;
            const date = new Date(e.detail.value).getTime();
            const dateStr = formatDate(new Date(date), new Date().getTimezoneOffset());
            if (dateIndex === 0) {
                this.setData({ date: [date, this.data.date[1]], dateStr: [dateStr, this.data.dateStr[1]] });
            } else {
                this.setData({ date: [this.data.date[0], date], dateStr: [this.data.dateStr[0], dateStr] });
            }
            const dateInterval = Number(((this.data.date[1] - this.data.date[0]) / MILLISECONDS.DAY).toFixed(0));
            this.setData({ calendarVisible: false, dateInterval: dateInterval });
        },
        updateDateInterval(e: any) {
            const dateInterval = Number(e.detail.value);
            const date = [this.data.date[0], this.data.date[0] + dateInterval * MILLISECONDS.DAY];
            const dateStr = [formatDate(new Date(date[0]), new Date().getTimezoneOffset()), formatDate(new Date(date[1]), new Date().getTimezoneOffset())];
            this.setData({ dateInterval: dateInterval, date: date, dateStr: dateStr });
        }
    },
})
