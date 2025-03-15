import { Channel } from "../../utils/channel/channel";
import { getUser, getUserGroupNameInChannel } from "../../utils/util";

const app = getApp<IAppOption>();

Component({
  data: {
    // 页面显示内容
    tabList: [
      { icon: 'map-location', label: '足迹', value: 0 },
      { icon: 'chat-bubble', label: '讨论', value: 1 },
      { icon: 'usergroup', label: '群组', value: 2 },
    ],

    // 页面状态
    childPage: 0,

    // 数据缓存
    currentChannel: null as Channel | null,
  },
  methods: {
    onLoad(options: any) {
      const { channelId } = options;
      this.setData({
        currentChannel: new Channel(app.globalData.currentData.channelList.find((channel: Channel) => channel.id === parseInt(channelId))),
      });
      const userGroup = getUserGroupNameInChannel(
        getUser(
          app.globalData.currentData.userList,
          app.globalData.currentUserId
        )!,
        parseInt(channelId)
      )
      this.setData({
        tabList: userGroup === '系统管理员' || userGroup === '频道主' || userGroup === '频道管理员'
          ? [
            { icon: 'map-location', label: '足迹', value: 0 },
            { icon: 'shutter', label: '讨论', value: 1 },
            { icon: 'usergroup', label: '群组', value: 2 },
            { icon: 'setting-1', label: '管理', value: 3 },
          ]
          : [
            { icon: 'map-location', label: '足迹', value: 0 },
            { icon: 'shutter', label: '讨论', value: 1 },
            { icon: 'usergroup', label: '群组', value: 2 },
          ]
      });
    },
    onShow() {
      const postsComponent = this.selectComponent('#posts');
      if (postsComponent) {
        postsComponent.sortPosts();
      }
      const groupsComponent = this.selectComponent('#groups');
      if (groupsComponent) {
        groupsComponent.classifyGroups();
        groupsComponent.getTourTemplates();
      }
    },
    onChildPageChange(e: any) {
      this.setData({ childPage: e.detail.value })
    },
  },
})