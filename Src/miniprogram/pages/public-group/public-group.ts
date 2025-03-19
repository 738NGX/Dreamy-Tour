/**
 * 公共频道下的群组
 */

Component({
  properties: {

  },
  data: {
    currentChannel: getApp().getChannel(1),
  },
  methods: {
    onShow() {
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        const page: any = getCurrentPages().pop();
        this.getTabBar().setData({ value: '/' + page.route })
      }
    },
  }
})