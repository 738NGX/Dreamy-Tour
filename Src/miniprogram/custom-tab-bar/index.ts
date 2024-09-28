Component({
    //  组件的属性列表
    properties: {},
    //  组件的初始数据
    data: {
        value: '/pages/index/index',
        tabBar: [
            {
                value: '/pages/index/index',
                icon: 'home',
                label: '主页'
            },
            {
                value: '/pages/edit/edit',
                icon: 'map-edit',
                label: '编辑规划'
            },
            {
                value: '/pages/report/report',
                icon: 'chart-combo',
                label: '规划结果'
            },
            {
                value: '/pages/calculator/calculator',
                icon: 'calculation',
                label: '计算器'
            },
            {
                value: '/pages/menu/menu',
                icon: 'app',
                label: '更多'
            }
        ]
    },
    //  组件的方法列表
    methods: {
        onChange(e: any) {
            wx.switchTab({
                url: e.detail.value
            });
        }
    }
})
