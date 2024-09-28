// edit.ts

Component({
    data: {
        
    },
    methods: {
        onShow() {
            if (typeof this.getTabBar === 'function' && this.getTabBar()) {
                const page: any = getCurrentPages().pop();
                this.getTabBar().setData({
                    value: '/' + page.route
                })
            }
        }
    },
})
