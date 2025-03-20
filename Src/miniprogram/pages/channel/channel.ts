/**
 * 频道主页面
 */
Component({
  data: {
    // 页面显示内容
    tabList: [
      { icon: 'list', label: '频道列表', value: 0 },
      { icon: 'chat-add', label: '添加频道', value: 1 },
    ],

    // 页面状态
    childPage: 0,
  },
  methods: {
    onLoad() {

    },
    onShow() {
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        const page: any = getCurrentPages().pop();
        this.getTabBar().setData({ value: '/' + page.route })
      }
      if (this.data.childPage === 0) {
        this.selectComponent('#list').loadChannelList();
      }
      else {
        this.selectComponent('#adder').loadChannelList();
      }
    },
    onChildPageChange(e: any) {
      console.log(e.detail.value)
      this.setData({ childPage: e.detail.value })
    },
  },
})