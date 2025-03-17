import { Channel } from "../miniprogram/utils/channel/channel";
import { Group } from "../miniprogram/utils/channel/group";
import { Comment, Post } from "../miniprogram/utils/channel/post";
import { Tour } from "../miniprogram/utils/tour/tour";
import { User } from "../miniprogram/utils/user/user";

/// <reference path="./types/index.d.ts" />

declare global {
  interface IAppOption {
    globalData: {
      currentUserId: number;
      currentData: any;
    },
    currentUser(): User;
    getUserListCopy(): User[];
    getTourListCopy(): Tour[];
    getGroupListCopy(): Group[];
    getChannelListCopy(): Channel[];
    getPostListCopy(): Post[];
    getCommentListCopy(): Comment[];
    getData(dataId: number, dataList: any[]): any;
    addData(data: any, dataList: any[]): any[];
    updateData(data: any, dataList: any[]): any[];
    removeData(data: any, dataList: any[]): any[];
    getUser(userId: number): User | undefined;
    getTour(tourId: number): Tour | undefined;
    getGroup(groupId: number): Group | undefined;
    getChannel(channelId: number): Channel | undefined;
    getPost(postId: number): Post | undefined;
    getComment(commentId: number): Comment | undefined;
    addUser(user: User): void;
    addTour(tour: Tour): void;
    addGroup(group: Group): void;
    addChannel(channel: Channel): void;
    addPost(post: Post): void;
    addComment(comment: Comment): void
    updateUser(user: User): void;
    updateTour(tour: Tour): void;
    updateGroup(group: Group): void;
    updateChannel(channel: Channel): void;
    updatePost(post: Post): void;
    updateComment(comment: Comment): void;
    removeUser(user: User | number): void;
    removeTour(tour: Tour | number): void;
    removeGroup(group: Group | number): void;
    removeChannel(channel: Channel | number): void;
    removePost(post: Post | number): void;
    removeComment(comment: Comment | number): void;
  }
}