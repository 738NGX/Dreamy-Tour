const app = getApp<IAppOption>()

Component({
    data: {
        // 页面显示内容
        tabList: [
            { icon: 'map-search', label: '计划', value: 0 },
            { icon: 'map-location', label: '复盘', value: 1 },
            { icon: 'map-setting', label: '设置', value: 2 },
        ],

        // 页面状态
        childPage: 0,
        selectingTour: false,
        currentTour: null,
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
        },
        onChildPageChange(e: any) {
            this.setData({ childPage: e.detail.value })
        },
    },
})
