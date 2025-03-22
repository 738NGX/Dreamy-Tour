import { Channel } from "../../../utils/channel/channel";

const app = getApp<IAppOption>();

Component({
  properties: {

  },
  data: {
    refreshEnable: false,
    
    fullChannelList: [] as Channel[],
    channelList: [] as Channel[],
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
    onRefresh() {
      this.setData({ refreshEnable: true });
      setTimeout(() => {
        this.setData({ refreshEnable: false });
      }, 500);
      this.loadChannelList();
      this.setData({
        channelList: this.data.fullChannelList.filter(
          channel => channel.name.includes(this.data.searchingValue))
      });
    },
    onChannelClick(e: WechatMiniprogram.CustomEvent) {
      const channelId = e.currentTarget.dataset.index;
      wx.navigateTo({
        url: `/pages/channel-detail/channel-detail?channelId=${channelId}`,
      });
    },
    loadChannelList() {
      const channelList = app.getCurrentUserJoinedChannels();
      this.setData({ channelList, fullChannelList: channelList });
    },
    onSearch(e: WechatMiniprogram.CustomEvent) {
      const { value } = e.detail;
      this.setData({
        searchingValue: value,
        channelList: this.data.fullChannelList.filter(channel => channel.name.includes(value)),
      });
    },
    onSearchClear() {
      this.setData({
        searchingValue: '',
        channelList: this.data.fullChannelList,
      });
    },
  }
});