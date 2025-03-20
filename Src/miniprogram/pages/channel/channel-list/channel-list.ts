Component({
  properties: {

  },
  data: {
    channelList: [] as any[],
    searchingValue: '',
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
          .includes(channel.id) && channel.id != 1 && channel.name.includes(this.data.searchingValue)
      );
      this.setData({ channelList });
    },
    onSearch(e: any) {
      const { value } = e.detail;
      this.setData({ searchingValue: value });
      this.loadChannelList();
    },
    onSearchClear() {
      this.setData({ searchingValue: '' });
      this.loadChannelList();
    },
  }
});