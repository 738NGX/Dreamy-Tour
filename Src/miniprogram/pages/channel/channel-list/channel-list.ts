const app = getApp<IAppOption>();

Component({
  properties: {

  },
  data: {
    channelList: [] as any[],
  },
  lifetimes: {
    attached() {
      const channelList = getApp<IAppOption>().getChannelListCopy().filter(
        channel => getApp<IAppOption>().currentUser().joinedChannel
          .includes(channel.id) && channel.id != 1
      );
      this.setData({ channelList });
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