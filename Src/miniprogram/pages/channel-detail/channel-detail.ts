/**
 * （单个）频道主页，下分为频道足迹、讨论区、频道群组
 * 根据用户群权限加载管理页面
 */
import { ChannelBasic } from "../../utils/channel/channel";

const app = getApp<IAppOption>();

Component({
  data: {
    // 页面显示内容
    tabList: [
      { icon: 'map-location', label: '足迹', value: 0 },
      { icon: 'shutter', label: '讨论', value: 1 },
      { icon: 'usergroup', label: '群组', value: 2 },
      { icon: 'setting-1', label: '选项', value: 3 },
    ],

    // 页面状态
    childPage: 0,

    // 数据缓存
    currentChannel: undefined as ChannelBasic | undefined,
  },
  methods: {
    onLoad(options: any) {
      const { channelId } = options;
      this.setData({
        currentChannel: app.getChannel(parseInt(channelId)),
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
    onChildPageChange(e: WechatMiniprogram.CustomEvent) {
      this.setData({ childPage: e.detail.value })
    },
    handleCurrentChannelChange(e: WechatMiniprogram.CustomEvent) {
      this.setData({ currentChannel: new ChannelBasic(e.detail.value) })
    },
  },
})