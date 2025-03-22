import { Channel } from "../miniprogram/utils/channel/channel";
import { Group } from "../miniprogram/utils/channel/group";
import { Comment, Post } from "../miniprogram/utils/channel/post";
import { UserRanking } from "../miniprogram/utils/channel/userRanking";
import { FootPrint } from "../miniprogram/utils/tour/footprint";
import { Tour } from "../miniprogram/utils/tour/tour";
import { User } from "../miniprogram/utils/user/user";

/// <reference path="./types/index.d.ts" />

declare global {
  interface IAppOption {
    globalData: {
      currentUserId: number;
      currentData: any;
      baseUrl: string;
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

    // for channel-adder.ts
    /**
     * @returns 当前用户未加入的频道列表
     */
    getCurrentUserUnjoinedChannels(callback: (channels: Channel[]) => void): void;
    /**
     * 创建一个新频道
     * @param name 新频道的名称
     * @param description 新频道的描述
     */
    createChannel(name: string, description: string): void;
    /**
     * 加入一个频道
     * @param channelId 频道ID
     * @returns 是否需要刷新页面
     */
    joinChannel(channelId: number): boolean;

    // for channel-list.ts
    /**
     * @returns 当前用户加入的频道列表, 不包括世界频道
     */
    getCurrentUserJoinedChannels(callback: (channels: Channel[]) => void): void;

    // for channel-detail-home.ts
    /**
     * @param channelId 频道ID
     * @returns 生成频道中的行程列表
     */
    generateTourSaves(channelId: number): Tour[];
    /**
     * @param footprints 行程足迹列表
     * @returns 一个频道中的用户行程次数排名
     */
    generateUserRankings(footprints: FootPrint[]): UserRanking[];

    // for channel-detail-setting.ts
    /**
     * 解散目标频道
     * @param channelId 频道ID
     */
    disbandChannel(channelId: number): void;
  }
}