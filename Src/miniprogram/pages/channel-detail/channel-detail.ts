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
    async onLoad(options: any) {
      const { channelId } = options;
      this.setData({
        currentChannel: await app.loadChannel(parseInt(channelId)),
      });
      await this.onShow();
    },
    async onShow() {
      const homeComponent = this.selectComponent('#home');
      if (homeComponent) {
        await homeComponent.generateTourSaves();
        homeComponent.generateFullFootprints();
        homeComponent.generateFullMarkers();
        await homeComponent.generateUserRankings();
      }
      const postsComponent = this.selectComponent('#posts');
      if (postsComponent) {
        await postsComponent.getFullPosts();
        postsComponent.searchPosts(postsComponent.data.searchingValue);
      }
      const groupsComponent = this.selectComponent('#groups');
      if (groupsComponent) {
        await groupsComponent.classifyGroups();
        await groupsComponent.getTourTemplates();
      }
      const settingsComponent = this.selectComponent('#settings');
      if (settingsComponent) {
        settingsComponent.setData({ channelId: this.data.currentChannel?.id });
        await settingsComponent.getMembers();
        await settingsComponent.getAuthority();
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