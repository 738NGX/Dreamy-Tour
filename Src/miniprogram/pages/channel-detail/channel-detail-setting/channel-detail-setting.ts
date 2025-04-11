import { ChannelBasic, JoinWay } from "../../../utils/channel/channel";
import { Member } from "../../../utils/user/user";

const app = getApp<IAppOption>()

Component({
  properties: {
    currentChannel: {
      type: Object,
      value: {},
    },
  },
  data: {
    channelId: -1,
    joinWays: [
      { value: JoinWay.Free, label: '自由加入' },
      { value: JoinWay.Approval, label: '需要审核' },
      { value: JoinWay.Invite, label: '仅限邀请' }
    ],

    members: [] as Member[],
    waitingUsers: [] as Member[],

    isChannelOwner: false,
    isChannelAdmin: false,
    newMemberId: '',

    usercardVisible: false,
    usercardInfos: {} as Member,
  },
  lifetimes: {
    async ready() {
      this.setData({ channelId: this.properties.currentChannel.id });
      await this.getAuthority();
      await this.getMembers();
    },
  },
  methods: {
    onCurrentChannelChange(value: ChannelBasic) {
      this.triggerEvent('currentChannelChange', { value: value });
    },
    async getMembers() {
      const { members, waitingUsers } = await app.getMembersInChannel(this.data.channelId);
      this.setData({ members, waitingUsers });
    },
    async getAuthority() {
      const { isChannelOwner, isChannelAdmin } = await app.getUserAuthorityInChannel(this.data.channelId);
      this.setData({ isChannelOwner, isChannelAdmin });
    },
    showUsercard(e: WechatMiniprogram.CustomEvent) {
      const userId = e.currentTarget.dataset.index;
      if (!userId) {
        this.setData({ usercardVisible: false });
        return;
      }
      const user = this.data.members.find((m) => m.id === userId);
      if (!user) return;
      this.setData({
        usercardVisible: true,
        usercardInfos: user
      })
    },
    onNewMemberIdInput(e: WechatMiniprogram.CustomEvent) {
      this.setData({ newMemberId: e.detail.value });
    },
    async addMember() {
      if (await app.addMemberInChannel(this.data.channelId, this.data.newMemberId)) {
        await this.getMembers();
        this.setData({ newMemberId: '' });
      }
    },
    async handleTitleUpdate(e: WechatMiniprogram.CustomEvent) {
      const currentChannel = new ChannelBasic(this.properties.currentChannel);
      currentChannel.name = e.detail.value;
      if (await app.changeChannelBasic(currentChannel)) {
        this.onCurrentChannelChange(currentChannel);
      }
    },
    async handleDescriptionUpdate(e: WechatMiniprogram.CustomEvent) {
      const currentChannel = new ChannelBasic(this.properties.currentChannel);
      currentChannel.description = e.detail.value;
      if (await app.changeChannelBasic(currentChannel)) {
        this.onCurrentChannelChange(currentChannel);
      }
    },
    async onJoinWayChange(e: WechatMiniprogram.CustomEvent) {
      const currentChannel = new ChannelBasic(this.properties.currentChannel);
      currentChannel.joinWay = e.detail.value;
      if (await app.changeChannelBasic(currentChannel)) {
        this.onCurrentChannelChange(currentChannel);
      }
    },
    async approveUser(e: WechatMiniprogram.CustomEvent) {
      const userId = parseInt(e.currentTarget.dataset.index);
      if (await app.approveUserInChannel(this.data.channelId, userId)) {
        await this.getMembers();
      }
    },
    async rejectUser(e: WechatMiniprogram.CustomEvent) {
      const userId = parseInt(e.currentTarget.dataset.index);
      if (await app.rejectUserInChannel(this.data.channelId, userId)) {
        await this.getMembers();
      }
    },
    async handleUserAdminChange(e: WechatMiniprogram.CustomEvent) {
      const userId = e.currentTarget.dataset.index;
      if (await app.userAdminChangeInChannel(this.data.channelId, userId)) {
        await this.getMembers();
      }
    },
    async removeMember(e: WechatMiniprogram.CustomEvent) {
      const userId = parseInt(e.currentTarget.dataset.index);
      if (await app.removeMemberInChannel(this.data.channelId, userId)) {
        await this.getMembers();
      }
    },
    async transferChannelOwner(e: WechatMiniprogram.CustomEvent) {
      const newOwnerId = parseInt(e.currentTarget.dataset.index);
      if (await app.transferChannelOwner(this.data.channelId, newOwnerId)) {
        await this.getMembers();
        await this.getAuthority();
      }
    },
    async quitChannel() {
      if (await app.quitChannel(this.data.channelId)) {
        wx.navigateBack();
      }
    },
    async disbandChannel() {
      if (await app.disbandChannel(this.data.channelId)) {
        wx.navigateBack();
      }
    },
  }
})