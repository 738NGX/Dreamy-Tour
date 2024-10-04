// report.ts

Component({
    data: {
        // 页面显示内容
        tabList: [
            { icon: 'assignment', label: '文字报告', value: 0 },
            { icon: 'calendar-1', label: '时间可视化', value: 1 },
            { icon: 'location', label: '空间可视化', value: 2 },
        ],

        // 页面状态
        childPage: 0,
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
            this.setData({
                childPage: e.detail.value
            })
        },
    },
})
