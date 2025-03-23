import { Channel, JoinWay } from "../../../utils/channel/channel";
import { User } from "../../../utils/user/user"
import { getUser, getUserGroupName, getUserGroupNameInChannel } from "../../../utils/util";

const app = getApp<IAppOption>()

Component({
  properties: {
    currentChannel: {
      type: Object,
      value: {},
    },
  },
  data: {
    joinWays: [
      { value: JoinWay.Free, label: '自由加入' },
      { value: JoinWay.Approval, label: '需要审核' },
      { value: JoinWay.Invite, label: '仅限邀请' }
    ],

    members: [] as any[],
    waitingUsers: [] as any[],

    isChannelOwner: false,
    isChannelAdmin: false,
    newMemberId: '',
  },
  lifetimes: {
    ready() {
      this.getMembers();
      this.getAuthority();
    },
  },
  methods: {
    onCurrentChannelChange(value: Channel) {
      this.triggerEvent('currentChannelChange', { value: value });
    },
    getMembers() {
      const userList = app.getUserListCopy();
      const memberList = userList.filter(
        (user: User) => user.joinedChannel.includes(this.properties.currentChannel.id)
      );
      const waitingUsersList = this.properties.currentChannel.waitingUsers.map(
        (userId: number) => getUser(userList, userId)
      ).filter((user: any) => user != undefined);
      const members = memberList.map((member: User) => {
        return {
          ...member,
          userGroup: getUserGroupNameInChannel(member, this.properties.currentChannel.id),
        };
      }).sort((a: any, b: any) => {
        const getPriority = (channel: string) => {
          if (channel === "系统管理员") return 0;
          if (channel === "频道主") return 1;
          if (channel === "频道管理员") return 2;
          return 3;
        };
        return getPriority(a.userGroup) - getPriority(b.userGroup);
      });
      const waitingUsers = waitingUsersList.map((user: any) => {
        return { ...user, userGroup: getUserGroupName(user) };
      });
      this.setData({ members, waitingUsers });
    },
    getAuthority() {
      const userGroup = getUserGroupNameInChannel(
        app.currentUser(),
        this.properties.currentChannel.id
      );
      this.setData({
        isChannelOwner: userGroup === "频道主",
        isChannelAdmin: userGroup === "系统管理员" || userGroup === "频道主" || userGroup === "频道管理员"
      });
    },
    onNewMemberIdInput(e: WechatMiniprogram.CustomEvent) {
      this.setData({ newMemberId: e.detail.value });
    },
    addMember() {
      if (this.data.newMemberId === '') {
        wx.showToast({
          title: '请输入用户ID',
          icon: 'none'
        });
        return;
      }
      const newMemberId = parseInt(this.data.newMemberId, 10);
      const user = app.getUser(newMemberId);
      if (!user || user.id === 0) {
        wx.showToast({
          title: '用户不存在',
          icon: 'none'
        });
        return;
      }
      if (user.joinedChannel.includes(this.properties.currentChannel.id)) {
        wx.showToast({
          title: '用户已在频道内',
          icon: 'none'
        });
        return;
      }
      user.joinedChannel.push(this.properties.currentChannel.id);
      app.updateUser(user);
      this.getMembers();
      this.setData({ newMemberId: '' });
    },
    handleTitleUpdate(e: WechatMiniprogram.CustomEvent) {
      const currentChannel = new Channel(this.properties.currentChannel);
      currentChannel.name = e.detail.value;
      app.updateChannel(currentChannel);
      this.onCurrentChannelChange(currentChannel);
    },
    handleDescriptionUpdate(e: WechatMiniprogram.CustomEvent) {
      const currentChannel = new Channel(this.properties.currentChannel);
      currentChannel.description = e.detail.value;
      app.updateChannel(currentChannel);
      this.onCurrentChannelChange(currentChannel);
    },
    onJoinWayChange(e: WechatMiniprogram.CustomEvent) {
      const currentChannel = new Channel(this.properties.currentChannel);
      currentChannel.joinWay = e.detail.value;
      app.updateChannel(currentChannel);
      this.onCurrentChannelChange(currentChannel);
    },
    approveUser(e: WechatMiniprogram.CustomEvent) {
      const userId = parseInt(e.currentTarget.dataset.index);
      const user = app.getUser(userId);
      if (!user) { return; }
      user.joinedChannel.push(this.properties.currentChannel.id);
      app.updateUser(user);
      const currentChannel = new Channel(this.properties.currentChannel);
      currentChannel.waitingUsers = currentChannel.waitingUsers.filter(
        (id: number) => id !== userId
      );
      app.updateChannel(currentChannel);
      this.onCurrentChannelChange(currentChannel);
      this.getMembers();
    },
    rejectUser(e: WechatMiniprogram.CustomEvent) {
      const userId = parseInt(e.currentTarget.dataset.index);
      const currentChannel = new Channel(this.properties.currentChannel);
      currentChannel.waitingUsers = currentChannel.waitingUsers.filter(
        (id: number) => id !== userId
      );
      app.updateChannel(currentChannel);
      this.onCurrentChannelChange(currentChannel);
      this.getMembers();
    },
    async handleUserAdminChange(e: WechatMiniprogram.CustomEvent) {
      const userId = e.currentTarget.dataset.index;
      const currentChannel = this.properties.currentChannel as Channel;
      if (await app.userAdminChangeInChannel(currentChannel.id, userId)) {
        this.getMembers();
      }
    },
    async removeMember(e: WechatMiniprogram.CustomEvent) {
      const currentChannel = this.properties.currentChannel as Channel;
      const userId = parseInt(e.currentTarget.dataset.index);
      if(await app.removeMemberInChannel(currentChannel.id, userId)) {
        this.getMembers();
      }
    },
    async transferChannelOwner(e: WechatMiniprogram.CustomEvent) {
      const newOwnerId = parseInt(e.currentTarget.dataset.index);
      const currentChannel = this.properties.currentChannel as Channel;
      if (await app.transferChannelOwner(currentChannel.id, newOwnerId)) {
        this.getMembers();
        this.getAuthority();
      }
    },
    async quitChannel() {
      const currentChannel = this.properties.currentChannel as Channel;
      if (await app.quitChannel(currentChannel.id)) {
        wx.navigateBack();
      }
    },
    async disbandChannel() {
      const currentChannel = this.properties.currentChannel as Channel;
      if (await app.disbandChannel(currentChannel.id)) {
        wx.navigateBack();
      }
    },
  }
})