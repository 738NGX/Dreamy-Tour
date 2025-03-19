import { Channel, JoinWay } from "../../../utils/channel/channel";
import { getNewId } from "../../../utils/util";

const app = getApp<IAppOption>();

Component({
  properties: {

  },
  data: {
    channelList: [] as any[],

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
    loadChannelList() {
      const channelList = app.getChannelListCopy().filter(
        channel => !app.currentUser().joinedChannel
          .includes(channel.id) && channel.id != 1
      );
      this.setData({ channelList });
    },
    handleCreateChannel() {
      this.setData({ createChannelVisible: !this.data.createChannelVisible })
    },
    handleTitleInput(e: any) {
      this.setData({ inputTitle: e.detail.value })
    },
    handleInput(e: any) {
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
    joinChannel(e: any) {
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