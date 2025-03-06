const app = getApp<IAppOption>();

Component({
    data: {
        // 页面显示内容
        tabList: [
            { icon: 'map-search', label: '计划', value: 0 },
            { icon: 'map-setting', label: '设置', value: 1 },
        ],
      
        // 页面状态
        childPage: 0,
        selectingTour: false,

    },
    methods: {
        /**
         * 行程初始化
         */
        onShow() {
            if (typeof this.getTabBar === 'function' && this.getTabBar()) {
                const page: any = getCurrentPages().pop();
                this.getTabBar().setData({ value: '/' + page.route })
            }
            this.setData({
                selectingTour: app.globalData.selectingTour,
            });
            const tourplanComponent = this.selectComponent('#edit-tourplan');
            if (tourplanComponent) {
                tourplanComponent.loadCurrentTourPlan();
            }
            const settingsComponent = this.selectComponent('#edit-settings');
            if (settingsComponent) {
                settingsComponent.loadCurrentTourPlan();
            }
        },
        onChildPageChange(e: any) {
            this.setData({ childPage: e.detail.value })
        },
    },
})
