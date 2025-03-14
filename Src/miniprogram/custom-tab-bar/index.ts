Component({
    //  组件的属性列表
    properties: {},
    //  组件的初始数据
    data: {
        value: '/pages/index/index',
        tabBar: [
            {
                value: '/pages/channel/channel',
                icon: 'chat-double',
                label: '频道'
            },
            {
                value: '/pages/public-group/public-group',
                icon: 'usergroup',
                label: '群组'
            },
            {
                value: '/pages/public-post/public-post',
                icon: 'shutter',
                label: '讨论'
            },
            //{
            //    value: '/pages/notice/notice',
            //    icon: 'notification',
            //    label: '消息'
            //},
            {
                value: '/pages/user/user',
                icon: 'user-1',
                label: '用户'
            },
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
