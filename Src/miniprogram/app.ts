import { Channel } from "./utils/channel/channel";
import { Group } from "./utils/channel/group";
import { Comment, Post } from "./utils/channel/post";
import { testData } from "./utils/testData";
import { Tour } from "./utils/tour/tour";
import { User } from "./utils/user/user";

// app.ts
App<IAppOption>({
  globalData: {
    currentUserId: 1,
    currentData: testData,
  },
  onLaunch() {

  },
  currentUser() {
    return this.getUser(this.globalData.currentUserId) as User;
  },
  getUserListCopy() {
    return this.globalData.currentData.userList.map((item: any) => new User(item));
  },
  getTourListCopy() {
    return this.globalData.currentData.tourList.map((item: any) => new Tour(item));
  },
  getGroupListCopy() {
    return this.globalData.currentData.groupList.map((item: any) => new Group(item));
  },
  getChannelListCopy() {
    return this.globalData.currentData.channelList.map((item: any) => new Channel(item));
  },
  getPostListCopy() {
    return this.globalData.currentData.postList.map((item: any) => new Post(item));
  },
  getCommentListCopy() {
    return this.globalData.currentData.commentList.map((item: any) => new Comment(item));
  },
  getData(dataId: any, dataList: any[]): any {
    return dataList.find((item: any) => item.id == dataId);
  },
  addData(data: any, dataList: any[]): any[] {
    const newDataList = dataList;
    newDataList.push(data);
    return newDataList;
  },
  updateData(data: any, dataList: any[]): any[] {
    const newDataList = dataList;
    const index = newDataList.findIndex((item: any) => item.id == data.id);
    if (index === -1) {
      console.error('Data not found');
    } else {
      newDataList[index] = data;
    }
    return newDataList;
  },
  removeData(data: any, dataList: any[]): any[] {
    const newDataList = dataList;
    const index = typeof data === 'number'
      ? newDataList.findIndex((item: any) => item.id == data)
      : newDataList.findIndex((item: any) => item.id == data.id);
    if (index === -1) {
      console.error('Data not found');
    } else {
      newDataList.splice(index, 1);
    }
    return newDataList;
  },
  getUser(userId: number) {
    const result = this.getData(userId, this.globalData.currentData.userList);
    if (result) {
      return new User(result);
    } else {
      return undefined;
    }
  },
  getTour(tourId: number) {
    const result = this.getData(tourId, this.globalData.currentData.tourList);
    if (result) {
      return new Tour(result);
    } else {
      return undefined;
    }
  },
  getGroup(groupId: number) {
    const result = this.getData(groupId, this.globalData.currentData.groupList);
    if (result) {
      return new Group(result);
    } else {
      return undefined;
    }
  },
  getChannel(channelId: number) {
    const result = this.getData(channelId, this.globalData.currentData.channelList);
    if (result) {
      return new Channel(result);
    } else {
      return undefined;
    }
  },
  getPost(postId: number) {
    const result = this.getData(postId, this.globalData.currentData.postList);
    if (result) {
      return new Post(result);
    } else {
      return undefined;
    }
  },
  getComment(commentId: number) {
    const result = this.getData(commentId, this.globalData.currentData.commentList);
    if (result) {
      return new Comment(result);
    } else {
      return undefined;
    }
  },
  addUser(user: User) {
    const userList = this.globalData.currentData.userList;
    this.globalData.currentData.userList = this.addData(user, userList);
  },
  addTour(tour: Tour) {
    const tourList = this.globalData.currentData.tourList;
    this.globalData.currentData.tourList = this.addData(tour, tourList);
  },
  addGroup(group: Group) {
    const groupList = this.globalData.currentData.groupList;
    this.globalData.currentData.groupList = this.addData(group, groupList);
  },
  addChannel(channel: Channel) {
    const channelList = this.globalData.currentData.channelList;
    this.globalData.currentData.channelList = this.addData(channel, channelList);
  },
  addPost(post: Post) {
    const postList = this.globalData.currentData.postList;
    this.globalData.currentData.postList = this.addData(post, postList);
  },
  addComment(comment: Comment) {
    const commentList = this.globalData.currentData.commentList;
    this.globalData.currentData.commentList = this.addData(comment, commentList);
  },
  updateUser(user: User) {
    const userList = this.globalData.currentData.userList;
    this.globalData.currentData.userList = this.updateData(user, userList);
  },
  updateTour(tour: Tour) {
    const tourList = this.globalData.currentData.tourList;
    this.globalData.currentData.tourList = this.updateData(tour, tourList);
  },
  updateGroup(group: Group) {
    const groupList = this.globalData.currentData.groupList;
    this.globalData.currentData.groupList = this.updateData(group, groupList);
  },
  updateChannel(channel: Channel) {
    const channelList = this.globalData.currentData.channelList;
    this.globalData.currentData.channelList = this.updateData(channel, channelList);
  },
  updatePost(post: Post) {
    const postList = this.globalData.currentData.postList;
    this.globalData.currentData.postList = this.updateData(post, postList);
  },
  updateComment(comment: Comment) {
    const commentList = this.globalData.currentData.commentList;
    this.globalData.currentData.commentList = this.updateData(comment, commentList);
  },
  removeUser(user: User | number) {
    const userList = this.globalData.currentData.userList;
    this.globalData.currentData.userList = this.removeData(user, userList);
  },
  removeTour(tour: Tour | number) {
    const tourList = this.globalData.currentData.tourList;
    this.globalData.currentData.tourList = this.removeData(tour, tourList);
  },
  removeGroup(group: Group | number) {
    const groupList = this.globalData.currentData.groupList;
    this.globalData.currentData.groupList = this.removeData(group, groupList);
  },
  removeChannel(channel: Channel | number) {
    const channelList = this.globalData.currentData.channelList;
    this.globalData.currentData.channelList = this.removeData(channel, channelList);
  },
  removePost(post: Post | number) {
    const postList = this.globalData.currentData.postList;
    this.globalData.currentData.postList = this.removeData(post, postList);
  },
  removeComment(comment: Comment | number) {
    const commentList = this.globalData.currentData.commentList;
    this.globalData.currentData.commentList = this.removeData(comment, commentList);
  },
})