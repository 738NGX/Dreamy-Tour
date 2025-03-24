/**
 * 公共频道下的群组
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
      const groupsComponent = this.selectComponent('#groups');
      if (groupsComponent) {
        await groupsComponent.classifyGroups();
        await groupsComponent.getTourTemplates();
      }
    },
  }
})