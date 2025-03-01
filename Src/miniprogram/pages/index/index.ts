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
            { image: '../../resources/ruby2.png', text: '复制一个已有的行程.', button: '拷贝', action: 'onTourSelectorVisibleChange' },
            { image: '../../resources/you2.png', text: '从外部复制的文本数据导入行程.', button: '导入', action: 'onImporterVisibleChange' },
        ],
        tourList: [] as { id: number; title: string; startDate: string; endDate: string; }[],
        displayTourList: [] as { label: string; value: number }[],
        mainCurrencies: currencyList,
        subCurrencies: currencyList,
        minDate: new Date(new Date().getTime() - 365 * MILLISECONDS.DAY).getTime(),
        maxDate: new Date(new Date().getTime() + 365 * MILLISECONDS.DAY).getTime(),
        currencyText: '主货币:人民币-CNY\n辅货币:日元-JPY',

        // 页面状态
        childPage: 0,
        creatorVisible: false,
        importerVisible: false,
        calendarVisible: false,
        currencySelectorVisible: false,
        tourSelectorVisible: false,

        // 数据缓存
        containsTour: false,
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
    methods: {
        onLoad() {
            this.setData({
                tourHashMap: new Map<number, string>(),
                subCurrencies: currencyList.filter(currency => currency.value !== this.data.newTourCurrency[0]),
            });
            this.loadTourHashMap();
        },
        onShow() {
            console.log("index-onShow触发,containsTour:",this.data.containsTour)
            const tourListComponent = this.selectComponent('#tour-list-id');
            if (tourListComponent) {
            tourListComponent.refreshData();
            }
            if (typeof this.getTabBar === 'function' && this.getTabBar()) {
                const page: any = getCurrentPages().pop();
                this.getTabBar().setData({ value: '/' + page.route })
            }
            this.loadTourHashMap();
        },
        //从缓存中加载旅程的hashmap，并更新containsTour
        loadTourHashMap() {
            wx.getStorage({
                key: 'tourHashMap',
                success: (res) => {
                    const tourHashMap = new Map(res.data || []);
                    console.log("tourhashmapsize:",tourHashMap.size)
                    this.setData({ 
                        tourHashMap,
                        containsTour: tourHashMap.size > 0
                    });
                    console.log("tourHashMap loaded:", this.data.tourHashMap,"containstour:", this.data.containsTour);
                },
                fail: () => {
                    this.setData({ tourHashMap: new Map() });
                }
            });
        },
        onTourListUpdate(){
            console.log("index-tourlistupdate触发")
            this.loadTourHashMap();
        },
        onChildPageChange(e: any) {
            this.setData({ childPage: e.detail.value })
        },
    },
})
