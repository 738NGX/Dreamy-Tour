import { ChannelLevel, channelLevelInfo } from '../../../utils/channel/channel';
import { User } from '../../../utils/user/user';

const app = getApp<IAppOption>();

Component({
  properties: {

  },
  data: {
    channelList: [] as any[],
    channelLevelList: [''],
  },
  lifetimes: {
    attached() {
      const channelList = app.globalData.currentData.channelList
        .filter((channel: any) => new User(app.globalData.currentData.userList
          .find((user: any) => user.id == app.globalData.currentUserId)).joinedChannel
          .includes(channel.id)
        );
      this.setData({
        channelList,
        channelLevelList: channelList.map((channel: any) => {
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