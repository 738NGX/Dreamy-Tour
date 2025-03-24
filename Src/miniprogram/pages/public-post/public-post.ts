/**
 * 公共频道讨论区
 */

import { ChannelBasic } from "../../utils/channel/channel";

Component({
  properties: {

  },
  data: {
    currentChannel: {} as ChannelBasic,
  },
  methods: {
    async onShow() {
      this.setData({
        currentChannel: await getApp<IAppOption>().loadPublicChannel()
      });
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        const page: any = getCurrentPages().pop();
        this.getTabBar().setData({ value: '/' + page.route })
      }
      const postsComponent = this.selectComponent('#posts');
      if (postsComponent) {
        await postsComponent.getFullPosts();
        postsComponent.searchPosts(postsComponent.data.searchingValue);
      }
    },
  }
})