Component({
  properties: {

  },
  data: {
    channelList: [] as any[],
  },
  lifetimes: {
    attached() {
      this.loadChannelList();
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
    loadChannelList() {
      const channelList = getApp<IAppOption>().getChannelListCopy().filter(
        channel => getApp<IAppOption>().currentUser().joinedChannel
          .includes(channel.id) && channel.id != 1
      );
      this.setData({ channelList });
    },
  }
});