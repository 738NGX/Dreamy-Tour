import { User } from '../../../utils/user/user';

const app = getApp<IAppOption>();

Component({
  properties: {

  },
  data: {
    channelList: [] as any[],
  },
  lifetimes: {
    attached() {
      const channelList = app.globalData.currentData.channelList
        .filter((channel: any) => new User(app.globalData.currentData.userList
          .find((user: any) => user.id == app.globalData.currentUserId)).joinedChannel
          .includes(channel.id) && channel.id != 1
        );
      this.setData({
        channelList,
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