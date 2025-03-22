import { Channel, JoinWay } from "../../../utils/channel/channel";
import { getNewId } from "../../../utils/util";

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
      const channelList = app.getCurrentUserUnjoinedChannels();
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
    handleCreateChannel() {
      this.setData({ createChannelVisible: !this.data.createChannelVisible })
    },
    handleTitleInput(e: WechatMiniprogram.CustomEvent) {
      this.setData({ inputTitle: e.detail.value })
    },
    handleInput(e: WechatMiniprogram.CustomEvent) {
      this.setData({ inputValue: e.detail.value })
    },
    handleCreateChannelConfirm() {
      const { inputTitle, inputValue } = this.data
      if (!inputTitle || !inputValue) {
        wx.showToast({
          title: '请填写完整信息',
          icon: 'none',
        })
        return
      }
      const newChannelId = getNewId(app.globalData.currentData.channelList);
      const channel = new Channel({
        id: newChannelId,
        name: inputTitle,
        description: inputValue,
      });
      const thisUser = app.currentUser();
      thisUser.joinedChannel.push(newChannelId);
      thisUser.havingChannel.push(newChannelId);
      app.addChannel(channel);
      app.updateUser(thisUser);
      this.setData({
        createChannelVisible: false,
        inputTitle: '',
        inputValue: '',
      })
      this.loadChannelList();
      wx.showToast({
        title: '创建成功,请返回频道列表查看',
        icon: 'none',
      });
    },
    joinChannel(e: WechatMiniprogram.CustomEvent) {
      const channelId = parseInt(e.currentTarget.dataset.index);
      const channel = app.getChannel(channelId) as Channel;
      if (channel.joinWay == JoinWay.Approval) {
        if (channel.waitingUsers.includes(app.globalData.currentUserId)) {
          wx.showToast({
            title: '您已经申请过了,请耐心等待',
            icon: 'none',
          });
          return;
        }
        else {
          channel.waitingUsers.push(app.globalData.currentUserId);
          app.updateChannel(channel);
          wx.showToast({
            title: '已发送加入申请,请耐心等待',
            icon: 'none',
          });
          return;
        }
      }
      if (channel.joinWay == JoinWay.Invite) {
        wx.showToast({
          title: '该频道仅限邀请加入',
          icon: 'none',
        });
        return;
      }
      const thisUser = app.currentUser();
      thisUser.joinedChannel.push(channelId);
      app.updateUser(thisUser);
      this.loadChannelList();
      wx.showToast({
        title: '加入成功,请返回频道列表查看',
        icon: 'none',
      });
    }
  }
});