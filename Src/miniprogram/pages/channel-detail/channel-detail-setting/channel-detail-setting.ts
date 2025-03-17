import { Channel } from "../../../utils/channel/channel";
import { TourStatus } from "../../../utils/tour/tour";
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
    currentUser: {} as User,
    members: [] as any[],
    waitingUsers: [] as any[],

    isChannelOwner: false,
    isChannelAdmin: false,
    newMemberId: '',
  },
  lifetimes: {
    ready() {
      this.setData({
        currentUser: app.currentUser(),
      });
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
        this.data.currentUser,
        this.properties.currentChannel.id
      );
      this.setData({
        isChannelOwner: userGroup === "频道主",
        isChannelAdmin: userGroup === "系统管理员" || userGroup === "频道主" || userGroup === "频道管理员"
      });
    },
    onNewMemberIdInput(e: any) {
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
    approveUser(e: any) {
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
    rejectUser(e: any) {
      const userId = parseInt(e.currentTarget.dataset.index);
      const currentChannel = new Channel(this.properties.currentChannel);
      currentChannel.waitingUsers = currentChannel.waitingUsers.filter(
        (id: number) => id !== userId
      );
      app.updateChannel(currentChannel);
      this.onCurrentChannelChange(currentChannel);
      this.getMembers();
    },
    handleUserAdminChange(e: any) {
      const userId = e.currentTarget.dataset.index;
      const currentChannelId = this.properties.currentChannel.id as number;
      const user = app.getUser(userId);
      if (!user) { return; }
      const userGroup = getUserGroupNameInChannel(user, currentChannelId);
      if (userGroup === "频道主") { return; }
      if (userGroup === "频道管理员") {
        user.adminingChannel = user.adminingChannel.filter(
          (channelId: number) => channelId !== currentChannelId
        );
      } else {
        user.adminingChannel.push(currentChannelId);
      }
      app.updateUser(user);
      this.getMembers();
    },
    removeMember(e: any) {
      const that = this;
      wx.showModal({
        title: '警告',
        content: '确定要移除该成员吗？与该成员相关的行程信息将会一起被移除。',
        success(res) {
          if (res.confirm) {
            const userId = e.currentTarget.dataset.index;
            const currentChannelId = that.properties.currentChannel.id as number;
            const user = app.getUser(userId);
            if (!user) { return; }
            user.joinedChannel = user.joinedChannel.filter(
              (channelId: number) => channelId !== currentChannelId
            );
            user.adminingChannel = user.adminingChannel.filter(
              (channelId: number) => channelId !== currentChannelId
            );
            app.updateUser(user);
            that.getMembers();
          }
        }
      });
    },
    transferChannelOwner(e: any) {
      const that = this;
      const newOwnerId = e.currentTarget.dataset.index;
      const currentChannel = that.properties.currentChannel as Channel;
      wx.showModal({
        title: '警告',
        content: '确定要转让频道主身份给该成员吗？',
        success(res) {
          if (res.confirm) {
            const currentOwner = that.data.currentUser;
            const newOwner = app.getUser(newOwnerId) as User;
            currentOwner.havingChannel = currentOwner.havingChannel.filter(channel => channel !== currentChannel.id);
            newOwner.adminingChannel = newOwner.adminingChannel.filter(channel => channel !== currentChannel.id);
            newOwner.havingChannel.push(currentChannel.id);
            app.updateUser(currentOwner);
            app.updateUser(newOwner);
            that.setData({ currentUser: currentOwner });
            that.getMembers();
            that.getAuthority();
          }
        }
      });
    },
    quitChannel() {
      const that = this;
      const currentChannel = that.properties.currentChannel as Channel;
      const currentUser = that.data.currentUser;
      if (currentUser.havingGroup
        .map(group => app.getGroup(group)?.linkedChannel)
        .includes(currentChannel.id)
      ) {
        wx.showToast({
          title: '你还在频道中拥有群组，请先结束行程、解散或转让群组',
          icon: 'none',
        });
        return;
      }
      wx.showModal({
        title: '警告',
        content: '确定要退出该频道吗？同时将退出频道中你加入的所有群组',
        success(res) {
          if (res.confirm) {
            currentUser.joinedChannel = currentUser.joinedChannel.filter(channel => channel !== currentChannel.id);
            currentUser.adminingChannel = currentUser.adminingChannel.filter(channel => channel !== currentChannel.id);
            for (const tour of app.getTourListCopy()) {
              if (tour.linkedChannel === currentChannel.id && tour.status != TourStatus.Finished) {
                tour.users = tour.users.filter(user => user !== currentUser.id);
              }
              app.updateTour(tour);
            }
            currentUser.joinedGroup = currentUser.joinedGroup.filter(group => app.getGroup(group)?.linkedChannel !== currentChannel.id);
            currentUser.adminingGroup = currentUser.adminingGroup.filter(group => app.getGroup(group)?.linkedChannel !== currentChannel.id);
            app.updateUser(currentUser);
            wx.navigateBack();
          }
        }
      });
    },
    disbandChannel() {
      const that = this;
      const currentChannel = that.properties.currentChannel as Channel;
      wx.showModal({
        title: '警告',
        content: '确定要解散该频道吗？',
        success(res) {
          if (res.confirm) {
            const userList = app.getUserListCopy();
            const groupList = app.getGroupListCopy();
            const tourList = app.getTourListCopy();
            const postList = app.getPostListCopy();
            const commentList = app.getCommentListCopy();
            userList.forEach(user => {
              user.joinedChannel = user.joinedChannel.filter(
                channelId => channelId !== currentChannel.id
              );
              user.adminingChannel = user.adminingChannel.filter(
                channelId => channelId !== currentChannel.id
              );
              user.havingChannel = user.havingChannel.filter(
                channelId => channelId !== currentChannel.id
              );
              user.joinedGroup = user.joinedGroup.filter(
                groupId => app.getGroup(groupId)?.linkedChannel !== currentChannel.id
              );
              user.adminingGroup = user.adminingGroup.filter(
                groupId => app.getGroup(groupId)?.linkedChannel !== currentChannel.id
              );
              user.havingGroup = user.havingGroup.filter(
                groupId => app.getGroup(groupId)?.linkedChannel !== currentChannel.id
              );
              app.updateUser(user);
            });
            groupList.forEach(group => {
              if (group.linkedChannel === currentChannel.id) {
                app.removeGroup(group);
              }
            });
            tourList.forEach(tour => {
              if (tour.linkedChannel === currentChannel.id) {
                app.removeTour(tour);
              }
            });
            commentList.forEach(comment => {
              if (postList.some(post => post.id === comment.linkedPost)) {
                app.removeComment(comment);
              }
            });
            postList.forEach(post => {
              if (post.linkedChannel === currentChannel.id) {
                app.removePost(post);
              }
            });
            app.removeChannel(currentChannel);
            wx.navigateBack();
          }
        }
      });
    },
  }
})