import { Channel } from "../../utils/channel/channel";

const app = getApp<IAppOption>();

Component({
  properties: {

  },
  data: {
    currentChannel: new Channel(app.globalData.currentData.channelList[0])
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