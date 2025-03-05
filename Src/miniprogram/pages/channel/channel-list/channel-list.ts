import { ChannelLevel, channelLevelInfo } from '../../../utils/channel/channel';

const app = getApp<IAppOption>();

Component({
  properties: {

  },
  data: {
    channelList: app.globalData.currentData.channelList,
    channelLevelList: [''],
  },
  lifetimes: {
    attached() {
      this.setData({
        channelLevelList: this.data.channelList.map((channel:any) => {
          return channelLevelInfo[(channel.level as ChannelLevel)].text;
        }),
      });
    },
    detached() {
      
    },
  },
  methods: {
    onChannelClick(e: any) {
      const channelId = e.currentTarget.dataset.index;
      wx.navigateTo({
        url: `/pages/channel-detail/channel-detail?channelId=${channelId}`,
      });
    },
  }
});