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
    },
    onChildPageChange(e: any) {
      this.setData({ childPage: e.detail.value })
    },
  },
})