import { Channel, ChannelBasic } from "../miniprogram/utils/channel/channel";
import { Group, GroupBasic } from "../miniprogram/utils/channel/group";
import { Comment, Post, PostCard, StructedComment } from "../miniprogram/utils/channel/post";
import { UserRanking } from "../miniprogram/utils/channel/userRanking";
import { Currency } from "../miniprogram/utils/tour/expense";
import { FootPrint } from "../miniprogram/utils/tour/footprint";
import { File } from "../miniprogram/utils/tour/photo";
import { Tour, TourBasic } from "../miniprogram/utils/tour/tour";
import { Location, Transportation } from "../miniprogram/utils/tour/tourNode";
import { Member, User, UserBasic } from "../miniprogram/utils/user/user";

/// <reference path="./types/index.d.ts" />

declare global {
  interface IAppOption {
    globalData: {
      currentUserId: number;
      localDebug: boolean;
      testMode: boolean;
      currentData: any;
      baseUrl: string;
      version: string;
    },
    /**
     * 获取当前用户的实例（目前仅供前端测试）
     */
    currentUser(): User;
    /**
     * 提升当前用户的权限（目前仅供开发测试）
     */
    privilege(role: string): Promise<void>;

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
    getCurrentUserUnjoinedChannels(): Promise<Channel[]>;
    /**
     * 创建一个新频道
     * @param name 新频道的名称
     * @param description 新频道的描述
     */
    createChannel(name: string, description: string): Promise<boolean>;
    /**
     * 加入一个频道
     * @param channelId 频道ID
     * @returns 是否需要刷新页面
     */
    joinChannel(channelId: number): Promise<boolean>;

    // for channel-list.ts
    /**
     * @returns 当前用户加入的频道列表, 不包括世界频道
     */
    getCurrentUserJoinedChannels(): Promise<Channel[]>;

    // for channel-detail.ts
    /**
     * 加载频道的基本信息
     * @param channelId 频道ID
     * @returns 一个频道的基本信息
     */
    loadChannel(channelId: number): Promise<ChannelBasic | undefined>;
    /**
     * 加载世界频道的基本信息
     * @returns 世界频道的基本信息
     */
    loadPublicChannel(): Promise<ChannelBasic | undefined>;

    // for channel-detail-home.ts
    /**
     * @param channelId 频道ID
     * @returns 生成频道中的行程列表
     */
    generateTourSaves(channelId: number): Promise<Tour[]>;
    /**
     * @param footprints 行程足迹列表
     * @returns 一个频道中的用户行程次数排名
     */
    generateUserRankings(channelId: number, footprints: FootPrint[]): Promise<UserRanking[]>;

    // for channel-detail-post.ts
    /**
     * 
     * @param channelId 
     */
    getFullPostsInChannel(channelId: number): Promise<PostCard[]>;
    /**
     * 
     * @param channelId 
     * @param title 
     * @param content 
     * @param originFiles 
     */
    createPost(channelId: number, title: string, content: string, originFiles: File[]): Promise<boolean>;

    // for channel-detail-group.ts
    /**
     * 对频道中当前用户已加入和未加入的群组进行分类
     * @param channelId 频道ID
     * @returns 一个频道中的群组列表
     */
    classifyGroups(channelId: number): Promise<{ joinedGroups: GroupBasic[], unJoinedGroups: GroupBasic[] }>;
    /**
     * 创建一个群组
     * @param channelId 新群组所属的频道ID
     * @param name 新群组名称
     * @param description 新群组描述
     * @param newTourCurrency 新群组使用的货币列表(与行程模板互斥)
     * @param tourTemplateId 新群组吗使用的行程模板ID(与货币列表互斥)
     * @returns 是否需要刷新页面
     */
    createGroup(channelId: number, name: string, description: string, newTourCurrency: Currency[], tourTemplateId: number): Promise<boolean>;
    /**
     * 加入一个群组
     * @param groupId 群组ID
     * @returns 是否需要刷新页面
     */
    joinGroup(groupId: number): Promise<boolean>;

    // for channel-detail-setting.ts
    /**
     * 获得频道中的成员列表和待审核用户列表
     * @param channelId 频道ID
     * @returns 一个频道中的成员列表和待审核用户列表
     */
    getMembersInChannel(channelId: number): Promise<{ members: Member[], waitingUsers: Member[] }>;
    /**
     * 获得当前用户在频道中的权限
     * @param channelId 频道ID
     * @returns 当前用户在频道中的权限
     */
    getUserAuthorityInChannel(channelId: number): Promise<{ isChannelOwner: boolean, isChannelAdmin: boolean }>;
    /**
     * 添加一个新成员
     * @param channelId 频道ID
     * @param newMemberId 新成员ID
     * @returns 是否成功添加新成员
     */
    addMemberInChannel(channelId: number, newMemberIdInput: string): Promise<boolean>;
    /**
     * 修改频道基本信息
     * @param channel 频道基本信息实例
     * @returns 是否成功改变频道基本信息
     */
    changeChannelBasic(channel: ChannelBasic): Promise<boolean>;
    /**
     * 允许目标用户加入频道
     * @param channelId 频道ID
     * @param userId 用户ID
     * @returns 是否成功允许将目标用户加入频道, 成功则返回频道实例
     */
    approveUserInChannel(channelId: number, userId: number): Promise<boolean>;
    /**
     * 拒绝目标用户加入频道
     * @param channelId 频道ID
     * @param userId 用户ID
     * @returns 是否成功拒绝目标用户加入频道, 成功则返回频道实例
     */
    rejectUserInChannel(channelId: number, userId: number): Promise<boolean>;
    /**
     * 改变目标用户的频道管理员权限
     * @param channelId 频道ID
     * @param userId 目标用户ID
     * @returns 是否成功改变目标用户的频道管理员权限
     */
    userAdminChangeInChannel(channelId: number, userId: number): Promise<boolean>;
    /**
     * 从频道移除目标用户
     * @param channelId 频道ID
     * @param userId 目标用户ID
     * * @returns 是否成功从频道移除目标用户
     */
    removeMemberInChannel(channelId: number, userId: number): Promise<boolean>;
    /**
     * 转让当前频道
     * @param channelId 频道ID
     * @param newOwnerId 新频道主ID
     * @returns 是否转让成功
     */
    transferChannelOwner(channelId: number, newOwnerId: number): Promise<boolean>;
    /**
     * 退出当前频道
     * @param channelId 频道ID
     * @returns 是否退出成功
     */
    quitChannel(channelId: number): Promise<boolean>;
    /**
     * 解散目标频道
     * @param channelId 频道ID
     * @returns 是否解散成功
     */
    disbandChannel(channelId: number): Promise<boolean>;

    // for channel-post.ts
    /**
     * 获取完整的帖子实例
     * @param postId 帖子ID
     * @returns 完整的帖子实例
     */
    getFullPost(postId: number): Promise<Post | undefined>;
    /**
     * 获取帖子中的评论列表
     * @param postId 
     */
    getFullCommentsInPost(postId: number): Promise<Comment[]>
    getMembersInPost(postId: number): Promise<Member[]>;
    /**
     * 对帖子进行点赞或取消点赞
     * @param postId 帖子id
     * @returns 操作后的帖子实例
     */
    handlePostLike(postId: number, isLiked: boolean): Promise<Post | undefined>;
    handlePostStick(post: Post): Promise<Post | undefined>;
    /**
     * 对评论进行点赞或取消点赞
     * @param commentId 评论id
     * @returns 操作后的评论实例
     */
    handleCommentLike(commentId: number, structedComments: StructedComment[]): Promise<StructedComment[]>;
    /**
     * 对回复进行点赞或取消点赞
     * @param commentId 评论id
     * @param replyId 回复id
     * @returns 操作后的评论实例
     */
    handleReplyLike(commentId: number, replyId: number, structedComments: StructedComment[]): Promise<{ structedComments: StructedComment[], replies: StructedComment[] }>;
    /**
     * 增加一条评论
     * @param comment 评论实例, ID会被重新指定
     * @returns 是否成功增加评论, 成功则刷新页面
     */
    handleCommentSend(comment: Comment): Promise<boolean>;
    /**
     * 删除评论
     * @param commentId 
     */
    handleCommentDelete(commentId: number): Promise<boolean>;
    /**
     * 删除回复
     * @param replyId 
     */
    handleReplyDelete(replyId: number): Promise<boolean>;
    /**
     * 删除帖子
     * @param postId 
     */
    handlePostDelete(postId: number): Promise<boolean>;

    // for userinfo.ts
    /**
     * @returns 选择的用户加入的频道列表, 不包括世界频道
     */
    getSelectedUserJoinedChannels(uid: number): Promise<Channel[]>;
    /**
     * 获取用户发布的全部帖子
     * @param uid 
     */
    getFullPostsByUid(uid: number): Promise<PostCard[]>;
    // for group.ts
    loadGroup(groupId: number): Promise<{ currentGroup: GroupBasic, linkedTour: TourBasic }>;
    getMembersInGroup(groupId: number): Promise<{ members: Member[], waitingUsers: Member[] }>;
    getUserAuthorityInGroup(groupId: number): Promise<{ isGroupOwner: boolean, isGroupAdmin: boolean }>;
    addMemberInGroup(groupId: number, linkedTourId: number, newMemberIdInput: string): Promise<boolean>;
    approveUserInGroup(groupId: number, linkedTourId: number, userId: number): Promise<boolean>;
    rejectUserInGroup(groupId: number, userId: number): Promise<boolean>;
    userAdminChangeInGroup(groupId: number, userId: number): Promise<boolean>;
    removeMemberInGroup(groupId: number, linkedTourId: number, userId: number): Promise<boolean>;
    transferGroupOwner(groupId: number, newOwnerId: number): Promise<boolean>;
    changeGroupBasic(group: GroupBasic): Promise<boolean>;
    changeGroupQrCode(groupId: number, qrCodeUrl: string): Promise<boolean>;
    changeTourBasic(tour: TourBasic): Promise<boolean>;
    quitGroup(groupId: number, linkedTourId: number): Promise<boolean>;
    disbandGroup(groupId: number, linkedTourId: number): Promise<boolean>;
    endGroupTour(groupId: number, linkedTourId: number): Promise<boolean>;

    // for user.ts
    getCurrentUser(): Promise<UserBasic | undefined>;
    changeUserName(name: string): Promise<boolean>;
    changeUserBasic(user: UserBasic): Promise<boolean>;
    changeUserAvatar(url: string): Promise<boolean>;
    changeUserBackgroundImage(url: string): Promise<boolean>;
    //for tour-editor.ts
    loadFullTour(tourId: number): Promise<Tour>;
    getMembersInTour(tourId: number): Promise<Member[]>;
    changeFullTour(tour: Tour): Promise<boolean>;
    changeTourLocationPhotos(tourId: number, copyIndex: number, location: Location): Promise<boolean>;
    getTransitDirections(origin: Location, destination: Location, startDate: number, strategy: number): Promise<Transportation[]>;

    getUserDetail(userId: number): Promise<Member | undefined>;
  }
}