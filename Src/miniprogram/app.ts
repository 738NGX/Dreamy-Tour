import { Channel, ChannelBasic, JoinWay } from "./utils/channel/channel";
import { Group, GroupBasic } from "./utils/channel/group";
import { Comment, Post, PostCard, StructedComment } from "./utils/channel/post";
import { UserRanking } from "./utils/channel/userRanking";
import HttpUtil from "./utils/httpUtil";
import { testData } from "./utils/testData";
import { Budget } from "./utils/tour/budget";
import { Currency } from "./utils/tour/expense";
import { FootPrint } from "./utils/tour/footprint";
import { File } from "./utils/tour/photo";
import { Tour, TourStatus } from "./utils/tour/tour";
import { Location, Transportation } from "./utils/tour/tourNode";
import { Member, User } from "./utils/user/user";
import { getNewId, getUser, getUserGroupName, getUserGroupNameInChannel } from "./utils/util";

// app.ts
App<IAppOption>({
  globalData: {
    currentUserId: 1,
    currentData: testData,
    baseUrl: "http://117.72.15.170/api",
  },
  onLaunch() {
    // 开屏进入登录页面
    wx.redirectTo({
      url: "/pages/login/login"
    })
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

  // for channel-adder.ts
  /**
   * 获取用户未参加的频道列表
   * @returns 频道列表
   */
  async getCurrentUserUnjoinedChannels(): Promise<Channel[]> {
    /** 后端逻辑 */
    try {
      const res = await HttpUtil.get({ url: "/channel/unjoined/list" });
      const channelList = res.data.data as Channel[];
      return channelList;
    } catch {
      wx.showToast({
        title: "加载失败",
        icon: "error"
      });
      return [];
    }
    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    // return this.getChannelListCopy().filter(
    //   channel => !this.currentUser().joinedChannel
    //     .includes(channel.id) && channel.id != 1
    // );
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },
  async createChannel(name: string, description: string): Promise<boolean> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    const newChannelId = getNewId(this.globalData.currentData.channelList);
    const channel = new Channel({
      id: newChannelId,
      name: name,
      description: description,
    });
    const thisUser = this.currentUser();
    thisUser.joinedChannel.push(newChannelId);
    thisUser.havingChannel.push(newChannelId);
    this.addChannel(channel);
    this.updateUser(thisUser);
    return true;
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },
  async joinChannel(channelId: number): Promise<boolean> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    const channel = this.getChannel(channelId) as Channel;
    if (channel.joinWay == JoinWay.Approval) {
      if (channel.waitingUsers.includes(this.globalData.currentUserId)) {
        wx.showToast({
          title: '您已经申请过了,请耐心等待',
          icon: 'none',
        });
        return false;
      }
      else {
        channel.waitingUsers.push(this.globalData.currentUserId);
        this.updateChannel(channel);
        wx.showToast({
          title: '已发送加入申请,请耐心等待',
          icon: 'none',
        });
        return false;
      }
    }
    if (channel.joinWay == JoinWay.Invite) {
      wx.showToast({
        title: '该频道仅限邀请加入',
        icon: 'none',
      });
      return false;
    }
    const thisUser = this.currentUser();
    thisUser.joinedChannel.push(channelId);
    this.updateUser(thisUser);
    wx.showToast({
      title: '加入成功,请返回频道列表查看',
      icon: 'none',
    });
    return true;
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },

  // for channel-list.ts
  async getCurrentUserJoinedChannels(): Promise<Channel[]> {
    /** 后端逻辑 */
    try {
      const res = await HttpUtil.get({ url: "/channel/joined/list" });
      const channelList = res.data.data as Channel[]
      return channelList;
    } catch {
      wx.showToast({
        title: "加载失败",
        icon: "error"
      });
      return [];
    }
    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    // return this.getChannelListCopy().filter(
    //   channel => this.currentUser().joinedChannel
    //     .includes(channel.id) && channel.id != 1
    // );
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },

  // for channel-detail-home.ts
  async generateTourSaves(channelId: number): Promise<Tour[]> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    const tourSaves = (this.globalData.currentData.tourList as Tour[])
      .filter(tour => tour.linkedChannel == channelId && tour.status == TourStatus.Finished && tour.channelVisible)
      .sort((a, b) => b.startDate - a.startDate);
    return tourSaves;
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },
  async generateUserRankings(footprints: FootPrint[]): Promise<UserRanking[]> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    const userTourCount: Map<number, number> = new Map();

    footprints.forEach(tour => {
      tour.users.forEach((userId) => {
        userTourCount.set(userId, (userTourCount.get(userId) || 0) + 1);
      });
    });
    const rankList = (this.globalData.currentData.userList as User[]).map(user => {
      const count = userTourCount.get(user.id) || 0;
      return { rank: 0, name: user.name, count } as UserRanking;
    }).filter((user) => user.count > 0);
    rankList.sort((a, b) => b.count - a.count);
    rankList.forEach((user, index) => {
      user.rank = index + 1;
    });
    return rankList;
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },

  // for channel-detail-post.ts
  async getFullPostsInChannel(channelId: number): Promise<PostCard[]> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    return this.getPostListCopy()
      .map((post) => {
        return {
          ...post,
          username: this.getUser(post.user)?.name ?? '未知用户',
        }
      })
      .filter((post) =>
        post.linkedChannel == channelId
      )
      .sort((a, b) =>
        (b.isSticky ? 1 : 0) - (a.isSticky ? 1 : 0) || b.time - a.time
      );
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },
  async createPost(channelId: number, title: string, content: string, originFiles: File[]): Promise<boolean> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    if (title !== null && content !== null) {
      if (title.length === 0) {
        wx.showToast({
          title: '标题不能为空',
          icon: 'none',
        });
        return false;
      }
      const newPostId = getNewId(this.globalData.currentData.postList);
      const newPost = new Post({
        id: newPostId,
        title: title,
        content: content,
        linkedChannel: channelId,
        user: this.globalData.currentUserId,
        time: Date.now(),
        isSticky: false,
        photos: originFiles.map((file) => ({ value: file.url, ariaLabel: file.name })),
      });
      this.addPost(newPost);
      return true;
    }
    return false;
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },

  // for channel-detail-group.ts
  async classifyGroups(channelId: number): Promise<{ joinedGroups: GroupBasic[], unJoinedGroups: GroupBasic[] }> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    const groups = this.getGroupListCopy();
    const currentUser = this.currentUser();
    const joinedGroups = groups.filter(group =>
      group.linkedChannel == channelId &&
      currentUser?.joinedGroup.includes(group.id)
    ).map(group => new GroupBasic(group));
    const unJoinedGroups = groups.filter(group =>
      group.linkedChannel == channelId &&
      !currentUser.joinedGroup.includes(group.id)
    ).map(group => new GroupBasic(group));
    return { joinedGroups, unJoinedGroups };
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },
  async createGroup(channelId: number, name: string, description: string, newTourCurrency: Currency[], tourTemplateId: number): Promise<boolean> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    if (!name || !description) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
      })
      return false;
    }
    const newGroupId = getNewId(this.globalData.currentData.groupList);
    const group = new Group({
      id: newGroupId,
      name: name,
      description: description,
      linkedChannel: channelId
    });
    const thisUser = this.currentUser();
    const tourTemplate = this.getTour(tourTemplateId);
    const newTour = new Tour({
      id: getNewId(this.globalData.currentData.tourList),
      title: name,
      linkedChannel: channelId,
      linkedGroup: newGroupId,
      users: [thisUser.id],
      mainCurrency: newTourCurrency[0],
      subCurrency: newTourCurrency[1],
    })
    if (tourTemplate) {
      newTour.startDate = tourTemplate.startDate;
      newTour.endDate = tourTemplate.endDate;
      newTour.timeOffset = tourTemplate.timeOffset;
      newTour.mainCurrency = tourTemplate.mainCurrency;
      newTour.subCurrency = tourTemplate.subCurrency;
      newTour.currencyExchangeRate = tourTemplate.currencyExchangeRate;
      newTour.nodeCopyNames = tourTemplate.nodeCopyNames.map((name: string) => name);
      newTour.budgets = tourTemplate.budgets.map((budget: Budget) => new Budget(budget));
      newTour.locations = tourTemplate.locations.map((copy: Location[]) => copy.map((location: Location) => new Location(location)));
      newTour.transportations = tourTemplate.transportations.map((copy: Transportation[]) => copy.map((transportation: Transportation) => new Transportation(transportation)));
    }
    thisUser.joinedGroup.push(newGroupId);
    thisUser.havingGroup.push(newGroupId);
    this.addGroup(group);
    this.addTour(newTour);
    this.updateUser(thisUser);
    return true;
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },
  async joinGroup(groupId: number): Promise<boolean> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    const group = this.getGroup(groupId) as Group;
    if (group.joinWay == JoinWay.Approval) {
      if (group.waitingUsers.includes(this.globalData.currentUserId)) {
        wx.showToast({
          title: '您已经申请过了,请耐心等待',
          icon: 'none',
        });
        return false;
      }
      else {
        group.waitingUsers.push(this.globalData.currentUserId);
        this.updateGroup(group);
        wx.showToast({
          title: '已发送加入申请,请耐心等待',
          icon: 'none',
        });
        return false;
      }
    }
    if (group.joinWay == JoinWay.Invite) {
      wx.showToast({
        title: '该群组仅限邀请加入',
        icon: 'none',
      });
      return false;
    }
    const thisUser = this.currentUser() as User;
    thisUser.joinedGroup.push(groupId);
    this.updateUser(thisUser);
    return true;
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },

  // for channel-detail-setting.ts
  async getMembersInChannel(channelId: number): Promise<{ members: Member[], waitingUsers: Member[] }> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    const userList = this.getUserListCopy();
    const memberList = userList.filter(
      (user: User) => user.joinedChannel.includes(channelId)
    );
    const waitingUsersList = (this.getChannel(channelId) as Channel).waitingUsers.map(
      (userId: number) => getUser(userList, userId)
    ).filter((user: any) => user != undefined) as User[];
    const members = memberList.map((member: User) => {
      return new Member({
        ...member,
        userGroup: getUserGroupNameInChannel(member, channelId),
      });
    }).sort((a, b) => {
      const getPriority = (group: string) => {
        if (group === "系统管理员") return 0;
        if (group === "频道主") return 1;
        if (group === "频道管理员") return 2;
        return 3;
      };
      return getPriority(a.userGroup) - getPriority(b.userGroup);
    });
    const waitingUsers = waitingUsersList.map((user) => {
      return new Member({ ...user, userGroup: getUserGroupName(user) });
    });
    return { members, waitingUsers };
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },
  async getUserAuthorityInChannel(channelId: number): Promise<{ isChannelOwner: boolean, isChannelAdmin: boolean }> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    const userGroup = getUserGroupNameInChannel(this.currentUser(), channelId);
    return {
      isChannelOwner: userGroup === "频道主",
      isChannelAdmin: userGroup === "系统管理员" || userGroup === "频道主" || userGroup === "频道管理员"
    };
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },
  async addMemberInChannel(channelId: number, newMemberIdInput: string): Promise<boolean> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    if (newMemberIdInput === '') {
      wx.showToast({
        title: '请输入用户ID',
        icon: 'none'
      });
      return false;
    }
    const newMemberId = parseInt(newMemberIdInput, 10);
    const user = this.getUser(newMemberId);
    if (!user || user.id === 0) {
      wx.showToast({
        title: '用户不存在',
        icon: 'none'
      });
      return false;
    }
    if (user.joinedChannel.includes(channelId)) {
      wx.showToast({
        title: '用户已在频道内',
        icon: 'none'
      });
      return false;
    }
    user.joinedChannel.push(channelId);
    this.updateUser(user);
    return true;
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },
  async changeChannelBasic(channel: ChannelBasic): Promise<boolean> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    const currentChannel = this.getChannel(channel.id) as Channel;
    currentChannel.name = channel.name;
    currentChannel.description = channel.description;
    currentChannel.joinWay = channel.joinWay;
    this.updateChannel(currentChannel);
    return true;
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },
  async approveUserInChannel(channelId: number, userId: number): Promise<boolean> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    const user = this.getUser(userId);
    if (!user) { return false; }
    user.joinedChannel.push(channelId);
    this.updateUser(user);
    const currentChannel = this.getChannel(channelId) as Channel;
    currentChannel.waitingUsers = currentChannel.waitingUsers.filter(
      (id: number) => id !== userId
    );
    this.updateChannel(currentChannel);
    return true;
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },
  async rejectUserInChannel(channelId: number, userId: number): Promise<boolean> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    const currentChannel = this.getChannel(channelId) as Channel;
    currentChannel.waitingUsers = currentChannel.waitingUsers.filter(
      (id: number) => id !== userId
    );
    this.updateChannel(currentChannel);
    return true;
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },
  async userAdminChangeInChannel(channelId: number, userId: number): Promise<boolean> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    const user = this.getUser(userId);
    if (!user) { return false; }
    const userGroup = getUserGroupNameInChannel(user, channelId);
    if (userGroup === "频道主") { return false; }
    if (userGroup === "频道管理员") {
      user.adminingChannel = user.adminingChannel.filter(
        (_channelId: number) => _channelId !== channelId
      );
    } else {
      user.adminingChannel.push(channelId);
    }
    this.updateUser(user);
    return true;
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },
  async removeMemberInChannel(channelId: number, userId: number): Promise<boolean> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    const that = this;
    return new Promise((resolve) => {
      wx.showModal({
        title: '警告',
        content: '确定要移除该成员吗？与该成员相关的行程信息将会一起被移除。',
        success(res) {
          if (res.confirm) {
            const user = that.getUser(userId);
            if (!user) { resolve(false); return; }
            user.joinedChannel = user.joinedChannel.filter(
              (_channelId) => _channelId !== channelId
            );
            user.adminingChannel = user.adminingChannel.filter(
              (_channelId) => _channelId !== channelId
            );
            that.updateUser(user);
            resolve(true);
          } else {
            resolve(false);
          }
        },
        fail() {
          resolve(false);
        }
      });
    });
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },
  async transferChannelOwner(channelId: number, newOwnerId: number): Promise<boolean> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    const that = this;
    return new Promise((resolve) => {
      wx.showModal({
        title: '警告',
        content: '确定要转让频道主身份给该成员吗？',
        success(res) {
          if (res.confirm) {
            const currentOwner = that.currentUser();
            const newOwner = that.getUser(newOwnerId) as User;
            currentOwner.havingChannel = currentOwner.havingChannel.filter(channel => channel !== channelId);
            newOwner.adminingChannel = newOwner.adminingChannel.filter(channel => channel !== channelId);
            newOwner.havingChannel.push(channelId);
            that.updateUser(currentOwner);
            that.updateUser(newOwner);
            resolve(true);
          } else {
            resolve(false);
          }
        },
        fail() {
          resolve(false);
        }
      });
    });
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },
  async quitChannel(channelId: number): Promise<boolean> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    const that = this;
    const currentUser = that.currentUser();
    if (currentUser.havingGroup
      .map(group => that.getGroup(group)?.linkedChannel)
      .includes(channelId)
    ) {
      wx.showToast({
        title: '你还在频道中拥有群组，请先结束行程、解散或转让群组',
        icon: 'none',
      });
      return false;
    }
    return new Promise((resolve) => {
      wx.showModal({
        title: '警告',
        content: '确定要退出该频道吗？同时将退出频道中你加入的所有群组',
        success(res) {
          if (res.confirm) {
            currentUser.joinedChannel = currentUser.joinedChannel.filter(channel => channel !== channelId);
            currentUser.adminingChannel = currentUser.adminingChannel.filter(channel => channel !== channelId);
            for (const tour of that.getTourListCopy()) {
              if (tour.linkedChannel === channelId && tour.status != TourStatus.Finished) {
                tour.users = tour.users.filter(user => user !== currentUser.id);
              }
              that.updateTour(tour);
            }
            currentUser.joinedGroup = currentUser.joinedGroup.filter(group => that.getGroup(group)?.linkedChannel !== channelId);
            currentUser.adminingGroup = currentUser.adminingGroup.filter(group => that.getGroup(group)?.linkedChannel !== channelId);
            that.updateUser(currentUser);
            resolve(true);
          } else {
            resolve(false);
          }
        },
        fail() {
          resolve(false);
        }
      });
    });
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },
  async disbandChannel(channelId: number): Promise<boolean> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    const that = this;
    return new Promise((resolve) => {
      wx.showModal({
        title: '警告',
        content: '确定要解散该频道吗？',
        success(res) {
          if (res.confirm) {
            const userList = that.globalData.currentData.userList as User[];
            const groupList = that.globalData.currentData.groupList as Group[];
            const tourList = that.globalData.currentData.tourList as Tour[];
            const postList = that.globalData.currentData.postList as Post[];
            const commentList = that.globalData.currentData.commentList as Comment[];
            userList.forEach(user => {
              user.joinedChannel = user.joinedChannel.filter(
                channelId => channelId !== channelId
              );
              user.adminingChannel = user.adminingChannel.filter(
                channelId => channelId !== channelId
              );
              user.havingChannel = user.havingChannel.filter(
                channelId => channelId !== channelId
              );
              user.joinedGroup = user.joinedGroup.filter(
                groupId => that.getGroup(groupId)?.linkedChannel !== channelId
              );
              user.adminingGroup = user.adminingGroup.filter(
                groupId => that.getGroup(groupId)?.linkedChannel !== channelId
              );
              user.havingGroup = user.havingGroup.filter(
                groupId => that.getGroup(groupId)?.linkedChannel !== channelId
              );
              that.updateUser(user);
            });
            groupList.forEach(group => {
              if (group.linkedChannel === channelId) {
                that.removeGroup(group);
              }
            });
            tourList.forEach(tour => {
              if (tour.linkedChannel === channelId) {
                that.removeTour(tour);
              }
            });
            commentList.forEach(comment => {
              if (postList.some(post => post.id === comment.linkedPost)) {
                that.removeComment(comment);
              }
            });
            postList.forEach(post => {
              if (post.linkedChannel === channelId) {
                that.removePost(post);
              }
            });
            that.removeChannel(channelId);
            resolve(true);
          } else {
            resolve(false);
          }
        },
        fail() {
          resolve(false);
        }
      });
    });
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },

  // for channel-post.ts
  async getFullPost(postId: number): Promise<Post | undefined> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    return this.getPost(postId);
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },
  async getFullCommentsInPost(postId: number): Promise<Comment[]> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    return this.getCommentListCopy().filter(
      comment => comment.linkedPost === postId
    )
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },
  async handlePostLike(postId: number): Promise<Post | undefined> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    const currentPost = this.getPost(postId);
    const currentUserId = this.globalData.currentUserId;
    if (!currentPost) { return undefined; }
    if (currentPost.likes.includes(currentUserId)) {
      currentPost.likes = currentPost.likes.filter(id => id !== currentUserId);
    } else {
      currentPost.likes.push(currentUserId);
    }
    this.updatePost(currentPost);
    return currentPost;
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },
  async handleCommentLike(commentId: number, structedComments: StructedComment[]): Promise<StructedComment[]> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    const _structedComments = JSON.parse(JSON.stringify(structedComments)) as StructedComment[];
    const currentUserId = this.globalData.currentUserId;
    const comment = _structedComments.find((comment: any) => comment.id == commentId);
    if (!comment) { return _structedComments; }
    if (comment.likes.includes(currentUserId)) {
      comment.likes = comment.likes.filter((id: any) => id !== currentUserId);
    } else {
      comment.likes.push(currentUserId);
    }
    const newComment = this.getComment(commentId) as Comment;
    newComment.likes = comment.likes;
    this.updateComment(newComment);
    return _structedComments;
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },
  async handleReplyLike(commentId: number, replyId: number, structedComments: StructedComment[]): Promise<{ structedComments: StructedComment[], replies: StructedComment[] }> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    const _structedComments = JSON.parse(JSON.stringify(structedComments)) as StructedComment[];
    const currentUserId = this.globalData.currentUserId;

    const comment = structedComments.find((comment: any) => comment.id == commentId);
    if (!comment) { return { structedComments: _structedComments, replies: [] }; }
    const reply = comment.replies.find((reply: any) => reply.id == replyId);
    if (!reply) { return { structedComments: _structedComments, replies: [] }; }

    if (reply.likes.includes(currentUserId)) {
      reply.likes = reply.likes.filter((id: any) => id !== currentUserId);
    } else {
      reply.likes.push(currentUserId);
    }

    const newComment = this.getComment(replyId) as Comment;
    newComment.likes = reply.likes;
    this.updateComment(newComment);

    return { structedComments: _structedComments, replies: comment.replies };
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },
  async handleCommentSend(comment: Comment): Promise<boolean> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    comment.id = getNewId(this.globalData.currentData.commentList);
    this.addComment(comment);
    return true;
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },
  async handleCommentDelete(commentId: number): Promise<boolean> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    const that = this;
    // 递归移除指定评论及其所有回复
    function removeRecursively(commentId: number) {
      const commentList = that.getCommentListCopy();
      const childReplies = commentList.filter((c: any) => c.parentComment === commentId);
      childReplies.forEach(reply => removeRecursively(reply.id));
      that.removeComment(commentId);
    }
    removeRecursively(commentId);
    return true;
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },
  async handleReplyDelete(replyId: number): Promise<boolean> {
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    const commentList = this.getCommentListCopy();
    // 递归获取所有子回复的 id
    function getAllDescendantIds(parentId: number): number[] {
      const childReplies = commentList.filter((c) => c.parentComment === parentId);
      return childReplies.reduce((acc: number[], current) => {
        return acc.concat(current.id, getAllDescendantIds(current.id));
      }, []);
    }
    const idsToDelete = [replyId, ...getAllDescendantIds(replyId)];
    idsToDelete.forEach(id => { this.removeComment(id); });
    return true;
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  },
  async handlePostDelete(postId: number): Promise<boolean>{
    /** 后端逻辑 */

    /** 前端测试逻辑, 接入后端后从此处开始全部注释 */
    this.getCommentListCopy().forEach((comment: any) => {
      if (comment.linkedPost === postId) {
        this.removeComment(comment.id);
      }
    });
    this.removePost(postId);
    return true;
    /** 前端测试逻辑, 接入后端后到此处结束全部注释 */
  }
})