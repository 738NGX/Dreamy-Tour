import { Channel } from "../../../utils/channel/channel";

const app = getApp<IAppOption>();

Component({
  properties: {

  },
  data: {
    refreshEnable: false,

    channelList: [] as Channel[],
    fullChannelList: [] as Channel[],

    createChannelVisible: false,

    searchingValue: '',
    inputTitle: '',
    inputValue: '',
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
    loadChannelList() {
      app.getCurrentUserUnjoinedChannels(channelList => {
        this.setData({ channelList, fullChannelList: channelList });
      });
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
    handleCreateChannel() {
      this.setData({ createChannelVisible: !this.data.createChannelVisible })
    },
    handleTitleInput(e: WechatMiniprogram.CustomEvent) {
      this.setData({ inputTitle: e.detail.value })
    },
    handleInput(e: WechatMiniprogram.CustomEvent) {
      this.setData({ inputValue: e.detail.value })
    },
    async handleCreateChannelConfirm() {
      const { inputTitle, inputValue } = this.data
      if (!inputTitle || !inputValue) {
        wx.showToast({
          title: '请填写完整信息',
          icon: 'none',
        })
        return;
      }
      await app.createChannel(inputTitle, inputValue);
      this.setData({
        createChannelVisible: false,
        inputTitle: '',
        inputValue: '',
      })
      this.onRefresh();
      wx.showToast({
        title: '创建成功,请返回频道列表查看',
        icon: 'none',
      });
    },
    async joinChannel(e: WechatMiniprogram.CustomEvent) {
      const channelId = parseInt(e.currentTarget.dataset.index);
      if (await app.joinChannel(channelId)) { this.onRefresh(); }
    }
  }
});