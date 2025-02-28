import { channelLevelInfo } from '../../../utils/channel/channel';
import { channelList } from '../../../utils/testData';

Component({
  properties: {

  },
  data: {
    channelList: channelList,
    channelLevelList: [''],
  },
  lifetimes: {
    attached() {
      this.setData({
        channelLevelList: this.data.channelList.map(channel => {
          return channelLevelInfo[channel.level].text;
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
