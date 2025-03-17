import { Channel } from "../../../utils/channel/channel";
import { Group } from "../../../utils/channel/group";
import { Comment, Post } from "../../../utils/channel/post";
import { Tour, TourStatus } from "../../../utils/tour/tour";
import { User } from "../../../utils/user/user"

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
  },
  lifetimes: {
    ready() {
      this.setData({
        currentUser: app.getUser(app.globalData.currentUserId),
      });
    },
  },
  methods: {
    quitChannel() {
      const that = this;
      const currentChannel = that.properties.currentChannel as Channel;
      const currentUser = that.data.currentUser;
      if(currentUser.havingGroup
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
            for(const tour of app.globalData.currentData.tourList as Tour[]) {
              if(tour.linkedChannel === currentChannel.id && tour.status != TourStatus.Finished) {
                tour.users= tour.users.filter(user => user !== currentUser.id);
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
            const userList = app.globalData.currentData.userList.map(
              (user: any) => new User(user)
            ) as User[];
            const groupList = app.globalData.currentData.groupList.map(
              (group: any) => new Group(group)
            ) as Group[];
            const tourList = app.globalData.currentData.tourList.map(
              (tour: any) => new Tour(tour)
            ) as Tour[];
            const postList = app.globalData.currentData.postList.map(
              (post: any) => new Post(post)
            ) as Post[];
            const commentList = app.globalData.currentData.commentList.map(
              (comment: any) => new Comment(comment)
            ) as Comment[];
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
              if(group.linkedChannel === currentChannel.id) {
                app.removeGroup(group);
              }
            });
            tourList.forEach(tour => {
              if(tour.linkedChannel === currentChannel.id) {
                app.removeTour(tour);
              }
            });
            commentList.forEach(comment => {
              if(postList.some(post => post.id === comment.linkedPost)) {
                app.removeComment(comment);
              }
            });
            postList.forEach(post => {
              if(post.linkedChannel === currentChannel.id) {
                app.removePost(post);
              }
            });
            app.removeChannel(currentChannel);
            wx.navigateBack();
          }
        }
      });
    },
    transferChannel() {
      const that = this;
      const currentChannel = that.properties.currentChannel as Channel;
      wx.showModal({
        title: '警告',
        content: '确定要转让频道给该成员吗？',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: `/pages/channel-detail/channel-detail-transfer/channel-detail-transfer?channelId=${currentChannel.id}`,
            });
          }
        }
      });
    },
  }
})