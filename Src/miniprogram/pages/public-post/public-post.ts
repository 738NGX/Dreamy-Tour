/**
 * 公共频道讨论区
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
      const postsComponent = this.selectComponent('#posts');
      if (postsComponent && typeof postsComponent.sortPosts === 'function') {
        postsComponent.sortPosts();
      }
    },
  }
})