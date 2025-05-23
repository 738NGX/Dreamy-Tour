/**
 * 小程序全局底部tabbar
 */
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
                icon: 'map',
                label: '行程'
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
                label: '我的'
            }
            // {
            //     value: '/pages/userinfo/userinfo',
            //     icon: 'user-1',
            //     label: '测试'
            // }
        ]
    },
    //  组件的方法列表
    methods: {
        onChange(e: WechatMiniprogram.CustomEvent) {
            wx.switchTab({
                url: e.detail.value
            });
        }
    }
})
