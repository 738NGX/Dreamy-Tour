import { Channel } from "../../utils/channel/channel";

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
    },
    onChildPageChange(e: any) {
      this.setData({ childPage: e.detail.value })
    },
  },
})