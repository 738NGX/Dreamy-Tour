import { Channel } from "../../../utils/channel/channel";

const app = getApp<IAppOption>();

Component({
  properties: {
    selectedUserId:{
      type: Number,
      value: -1,
      observer: function () {
        this.onRefresh()
      }
    }
  },
  data: {
    refreshEnable: false,
    currentUserId: -2,
    fullChannelList: [] as Channel[],
    channelList: [] as Channel[],
    searchingValue: '',
    loading: true,
  },
  lifetimes: {
    attached() {
      this.getCurrentUserId();
      this.loadChannelList();
    },
    detached() {

    },
    ready() {
      this.setData({
        loading: false
      })
    }
  },
  methods: {
    onRefresh() {
      console.log("频道列表刷新")
      this.setData({
        loading: true
      })
      this.setData({ refreshEnable: true });
      setTimeout(() => {
        this.setData({ refreshEnable: false });
      }, 500);
      this.loadChannelList();
      this.setData({
        channelList: this.data.fullChannelList.filter(
        channel => channel.name.includes(this.data.searchingValue))
      });
      this.setData({
        loading: false
      })
    },
    onChannelClick(e: WechatMiniprogram.CustomEvent) {
      const channelId = e.currentTarget.dataset.index;
      wx.navigateTo({
        url: `/pages/channel-detail/channel-detail?channelId=${channelId}`,
      });
    },
    async loadChannelList() {
      const channelList = this.properties.selectedUserId > 0 ? await app.getSelectedUserJoinedChannels(this.properties.selectedUserId) : await app.getCurrentUserJoinedChannels()
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
    async getCurrentUserId(){
      const currentUserBasic = await app.getCurrentUser()
      const currentUserId = currentUserBasic?.id
      this.setData({currentUserId})
    }
  }
});