import { Channel, ChannelBasic, JoinWay } from "./utils/channel/channel";
import { Group, GroupBasic } from "./utils/channel/group";
import { Comment, Post, PostCard, StructedComment } from "./utils/channel/post";
import { UserRanking } from "./utils/channel/userRanking";
import HttpUtil, { apiUrl } from "./utils/httpUtil";
import { testData } from "./utils/testData";
import { Budget } from "./utils/tour/budget";
import { Currency, currencyList, ExpenseType, TransportExpense } from "./utils/tour/expense";
import { FootPrint } from "./utils/tour/footprint";
import { File, Photo } from "./utils/tour/photo";
import { Tour, TourBasic, TourStatus } from "./utils/tour/tour";
import { Location, Transportation } from "./utils/tour/tourNode";
import { Member, User, UserBasic } from "./utils/user/user";
import { formatDate, formatPostTime, formatTime, getExpFromRole, getImageBase64, getNewId, getPriority, getUser, getUserGroupName, getUserGroupNameInChannel, getUserGroupNameInGroup, translateUserRole } from "./utils/util";

// app.ts
App<IAppOption>({
  globalData: {
    currentUserId: 1,
    localDebug: true,
    testMode: true,
    currentData: testData,
    baseUrl: apiUrl,
    version: "1.0.3",
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
  async privilege(role: string) {
    await HttpUtil.post({
      url: `/user/privilege`,
      jsonData: { role }
    });
    wx.showToast({
      title: '权限提升成功',
      icon: 'none'
    });
    wx.reLaunch({
      url: '/pages/login/login'
    });
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
    if (!this.globalData.testMode) {
      try {
        const res = await HttpUtil.get({ url: "/v1/channel/unjoined/list" });
        const channelList = res.data.data.map((res: any) => {
          return new Channel({
            id: res.channelId,
            name: res.name,
            description: res.description,
            joinWay: res.joinWay == "FREE" ? JoinWay.Free : res.joinWay == "APPROVAL" ? JoinWay.Approval : JoinWay.Invite,
          })
        }) as Channel[];
        return channelList;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return [];
      }
    } else {
      return this.getChannelListCopy().filter(
        channel => !this.currentUser().joinedChannel
          .includes(channel.id) && channel.id != 1
      );
    }
  },
  async createChannel(name: string, description: string): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        await HttpUtil.post({
          url: "/channel",
          jsonData: {
            name: name,
            description: description,
            joinWay: "free",
            level: "A"
          }
        });
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
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
    }
  },
  async joinChannel(channelId: number): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        await HttpUtil.post({ url: `/channel/${channelId}/join` });
        wx.showToast({
          title: '加入成功,请返回频道列表查看',
          icon: 'none'
        });
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
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
    }
  },

  // for channel-list.ts
  async getCurrentUserJoinedChannels(): Promise<Channel[]> {
    if (!this.globalData.testMode) {
      try {
        const res = await HttpUtil.get({ url: "/v1/channel/joined/list" });
        const channelList = res.data.data.map((res: any) => {
          return new Channel({
            id: res.channelId,
            name: res.name,
            description: res.description,
            joinWay: res.joinWay == "FREE" ? JoinWay.Free : res.joinWay == "APPROVAL" ? JoinWay.Approval : JoinWay.Invite,
          })
        }) as Channel[];
        return channelList;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return [];
      }
    } else {
      return this.getChannelListCopy().filter(
        channel => this.currentUser().joinedChannel
          .includes(channel.id) && channel.id != 1
      );
    }
  },

  // for channel-detail.ts
  async loadChannel(channelId: number): Promise<ChannelBasic | undefined> {
    if (!this.globalData.testMode) {
      try {
        const res = await HttpUtil.get({ url: `/channel/${channelId}/detail` });
        const channel = {
          id: res.data.data.channelId,
          name: res.data.data.name,
          description: res.data.data.description,
          joinWay: res.data.data.joinWay == "FREE" ? JoinWay.Free : res.data.data.joinWay == "APPROVAL" ? JoinWay.Approval : JoinWay.Invite,
        };
        return new ChannelBasic(channel);
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return undefined;
      }
    } else {
      const channel = this.getChannel(channelId);
      if (channel) {
        return new ChannelBasic(channel);
      } else {
        return undefined;
      }
    }
  },
  async loadPublicChannel(): Promise<ChannelBasic | undefined> {
    if (!this.globalData.testMode) {
      try {
        const res = await HttpUtil.get({ url: `/world-channel/detail` });
        const channel = {
          id: res.data.data.channelId,
          name: res.data.data.name,
          description: res.data.data.description,
          joinWay: res.data.data.joinWay == "FREE" ? JoinWay.Free : res.data.data.joinWay == "APPROVAL" ? JoinWay.Approval : JoinWay.Invite,
        };
        return new ChannelBasic(channel);
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return undefined;
      }
    } else {
      const channel = this.getChannel(1);
      if (channel) {
        return new ChannelBasic(channel);
      } else {
        return undefined;
      }
    }
  },

  // for channel-detail-home.ts
  async generateTourSaves(channelId: number): Promise<Tour[]> {
    if (!this.globalData.testMode) {
      try {
        const res = await HttpUtil.get({ url: `/channel/${channelId}/toursaves` });
        const constructTour = (data: any): Tour => {
          const { tourId: id, ...tourRest } = data;
          if (tourRest && Array.isArray(tourRest.children)) {
            tourRest.children = tourRest.children.map(constructTour);
          }
          return new Tour({ id, ...tourRest });
        }
        return res.data.data.map(constructTour);
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return [];
      }
    } else {
      const tourSaves = (this.globalData.currentData.tourList as Tour[])
        .filter(tour => tour.linkedChannel == channelId && tour.status == TourStatus.Finished && tour.channelVisible)
        .sort((a, b) => b.startDate - a.startDate);
      return tourSaves;
    }
  },
  async generateUserRankings(channelId: number, footprints: FootPrint[]): Promise<UserRanking[]> {
    //if (!this.globalData.testMode) {
    //  return [];
    //} else {
    const userTourCount: Map<number, number> = new Map();

    footprints.forEach(tour => {
      tour.users.forEach((userId) => {
        userTourCount.set(userId, (userTourCount.get(userId) || 0) + 1);
      });
    });
    const rankList = (await this.getMembersInChannel(channelId)).members.map(user => {
      const count = userTourCount.get(user.id) || 0;
      return { rank: 0, name: user.name, avatarUrl: user.avatarUrl, count } as UserRanking;
    }).filter((user) => user.count > 0);
    rankList.sort((a, b) => b.count - a.count);
    rankList.forEach((user, index) => {
      user.rank = index + 1;
    });
    return rankList;
    //}
  },

  // for channel-detail-post.ts
  async getFullPostsInChannel(channelId: number): Promise<PostCard[]> {
    if (!this.globalData.testMode) {
      try {
        const url = channelId == 1 ? '/v1/post/list' : `/v1/channel/${channelId}/post/list`;
        const results = await HttpUtil.get({ url });
        const fullPosts = results.data.data.map((res: any) => {
          return {
            id: res.postId,
            title: res.title,
            content: '',
            linkedChannel: res.channelId,
            user: res.user.uid,
            time: res.createdAt,
            likes: Array(res.likeSum).fill(0),
            photos: [new Photo({ value: res.pictureUrl })],
            isSticky: res.isSticky,
            username: res.user.nickname,
            avatarUrl: res.user.avatarUrl,
            timeStr: formatPostTime(res.createdAt) ?? '',
            isLiked: res.action.isLiked,
          } as PostCard;
        });
        return fullPosts;
      } catch (err: any) {
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return [];
      }
    } else {
      const currentUserId = this.globalData.currentUserId
      return this.getPostListCopy()
        .map((post) => {
          return {
            ...post,
            username: this.getUser(post.user)?.name ?? '未知用户',
            avatarUrl: this.getUser(post.user)?.avatarUrl ?? '',
            timeStr: formatPostTime(post.time) ?? '',
            isLiked: post.likes.includes(currentUserId) ? true : false,
          }
        })
        .filter((post) =>
          post.linkedChannel == channelId
        )
        .sort((a, b) =>
          (b.isSticky ? 1 : 0) - (a.isSticky ? 1 : 0) || b.time - a.time
        );
    }
  },
  async createPost(channelId: number, title: string, content: string, originFiles: File[]): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        await HttpUtil.post({
          url: "/post",
          jsonData: {
            title,
            content,
            channelId: channelId.toString(),
            pictures: await Promise.all(originFiles.map(async (file) => await getImageBase64(file.url)))
          }
        });
        return true;
      } catch (err: any) {
        wx.showToast({
          title: err.response.data.msg,
          icon: 'none',
          time: 2000,
        });
        return false;
      }
    } else {
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
          photos: await Promise.all(originFiles.map(async (file) => ({ value: await getImageBase64(file.url), ariaLabel: file.name }))),
        });
        this.addPost(newPost);
        return true;
      }
      return false;
    }
  },

  // for channel-detail-group.ts
  async classifyGroups(channelId: number): Promise<{ joinedGroups: GroupBasic[], unJoinedGroups: GroupBasic[] }> {
    if (!this.globalData.testMode) {
      try {
        const joinedRes = await HttpUtil.get({ url: `/group/${channelId}/joined/list` });
        const joinedGroups = joinedRes.data.data.map((res: any) => {
          return new GroupBasic({
            id: res.groupId,
            name: res.name,
            description: res.description,
            linkedChannel: res.linkedChannel,
            qrCode: res.qrCode,
            joinWay: res.joinWay == "FREE" ? JoinWay.Free : res.joinWay == "APPROVAL" ? JoinWay.Approval : JoinWay.Invite,
          })
        }) as GroupBasic[];
        if (channelId === -1) {
          return { joinedGroups: joinedGroups, unJoinedGroups: [] };
        }
        const unjoinedRes = await HttpUtil.get({ url: `/group/${channelId}/unjoined/list` });
        const unJoinedGroups = unjoinedRes.data.data.map((res: any) => {
          return new GroupBasic({
            id: res.groupId,
            name: res.name,
            description: res.description,
            linkedChannel: res.linkedChannel,
            qrCode: res.qrCode,
            joinWay: res.joinWay == "FREE" ? JoinWay.Free : res.joinWay == "APPROVAL" ? JoinWay.Approval : JoinWay.Invite,
          })
        }) as GroupBasic[];
        return { joinedGroups, unJoinedGroups };
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return { joinedGroups: [], unJoinedGroups: [] };
      }
    } else {
      const groups = this.getGroupListCopy();
      const currentUser = this.currentUser();
      const joinedGroups = groups.filter(group =>
        (channelId == -1 || group.linkedChannel == channelId) &&
        currentUser?.joinedGroup.includes(group.id)
      ).map(group => new GroupBasic(group));
      const unJoinedGroups = groups.filter(group =>
        group.linkedChannel == channelId &&
        !currentUser.joinedGroup.includes(group.id)
      ).map(group => new GroupBasic(group));
      return { joinedGroups, unJoinedGroups };
    }
  },
  async createGroup(channelId: number, name: string, description: string, newTourCurrency: Currency[], tourTemplateId: number): Promise<boolean> {
    if (!name || !description) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
      })
      return false;
    }
    if (!this.globalData.testMode) {
      try {
        await HttpUtil.post({
          url: "/group",
          jsonData: {
            name: name,
            description: description,
            linkedChannel: channelId,
            mainCurrency: currencyList.find(c => c.value == newTourCurrency[0])!.symbol,
            subCurrency: currencyList.find(c => c.value == newTourCurrency[1])!.symbol,
            tourTemplateId: tourTemplateId,
            level: "A",
            joinWay: "free",
          }
        });
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
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
      await newTour.getExchangeRate();
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
    }
  },
  async joinGroup(groupId: number): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        await HttpUtil.post({ url: `/group/${groupId}/join` });
        wx.showToast({
          title: '加入成功',
          icon: 'none'
        });
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
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
    }
  },

  // for channel-detail-setting.ts
  async getMembersInChannel(channelId: number): Promise<{ members: Member[], waitingUsers: Member[] }> {
    if (!this.globalData.testMode) {
      try {
        const membersRes = await HttpUtil.get({ url: `/channel/${channelId}/members` });
        const members = membersRes.data.data.map((res: any) => {
          return new Member({
            id: res.uid,
            name: res.nickname,
            exp: res.exp,
            isAdmin: res.role == 'ADMIN',
            gender: res.gender,
            avatarUrl: res.avatarUrl,
            email: res.email,
            phone: res.phone,
            signature: res.signature,
            birthday: res.birthday,
            userGroup: translateUserRole(res.role),
          });
        }).sort((a: any, b: any) => {
          return getPriority(a.userGroup) - getPriority(b.userGroup);
        }) as Member[];
        return { members, waitingUsers: [] };
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return { members: [], waitingUsers: [] };
      }
    } else {
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
        return getPriority(a.userGroup) - getPriority(b.userGroup);
      });
      const waitingUsers = waitingUsersList.map((user) => {
        return new Member({ ...user, userGroup: getUserGroupName(user) });
      });
      return { members, waitingUsers };
    }
  },
  async getUserAuthorityInChannel(channelId: number): Promise<{ isChannelOwner: boolean, isChannelAdmin: boolean }> {
    if (!this.globalData.testMode) {
      try {
        const res = await HttpUtil.get({ url: `/channel/${channelId}/authority` });
        return { isChannelOwner: res.data.data.isOwner, isChannelAdmin: res.data.data.isAdmin };
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return { isChannelOwner: false, isChannelAdmin: false };
      }
    } else {
      const userGroup = getUserGroupNameInChannel(this.currentUser(), channelId);
      return {
        isChannelOwner: userGroup === "频道主",
        isChannelAdmin: userGroup === "系统管理员" || userGroup === "频道主" || userGroup === "频道管理员"
      };
    }
  },
  async addMemberInChannel(channelId: number, newMemberIdInput: string): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        await HttpUtil.put({
          url: `/channel/${channelId}/join/${newMemberIdInput}`,
          jsonData: { userId: newMemberIdInput }
        });
        wx.showToast({
          title: '添加成功',
          icon: 'none'
        });
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
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
    }
  },
  async changeChannelBasic(channel: ChannelBasic): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        await HttpUtil.put({
          url: `/channel/${channel.id}`,
          jsonData: {
            name: channel.name,
            description: channel.description,
            joinWay: channel.joinWay == JoinWay.Free ? "FREE" : channel.joinWay == JoinWay.Approval ? "INVITE" : "INVITE",
          }
        });
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
      const currentChannel = this.getChannel(channel.id) as Channel;
      currentChannel.name = channel.name;
      currentChannel.description = channel.description;
      currentChannel.joinWay = channel.joinWay;
      this.updateChannel(currentChannel);
      return true;
    }
  },
  async approveUserInChannel(channelId: number, userId: number): Promise<boolean> {
    if (!this.globalData.testMode) {
      return false;
    } else {
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
    }
  },
  async rejectUserInChannel(channelId: number, userId: number): Promise<boolean> {
    if (!this.globalData.testMode) {
      return false;
    } else {
      const currentChannel = this.getChannel(channelId) as Channel;
      currentChannel.waitingUsers = currentChannel.waitingUsers.filter(
        (id: number) => id !== userId
      );
      this.updateChannel(currentChannel);
      return true;
    }
  },
  async userAdminChangeInChannel(channelId: number, userId: number): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        const res = await HttpUtil.get({ url: `/channel/${channelId}/authority/${userId}` });
        const isChannelAdmin = res.data.data.isAdmin;
        if (isChannelAdmin) {
          await HttpUtil.delete({
            url: `/channel/grant-admin`,
            jsonData: { channelId: channelId, granteeId: userId }
          });
        } else {
          await HttpUtil.post({
            url: `/channel/grant-admin`,
            jsonData: { channelId: channelId, granteeId: userId }
          });
        }
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
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
    }
  },
  async removeMemberInChannel(channelId: number, userId: number): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        await HttpUtil.delete({
          url: `/channel/${channelId}/join/${userId}`,
          jsonData: { userId: userId }
        });
        wx.showToast({
          title: '添加成功',
          icon: 'none'
        });
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
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
    }
  },
  async transferChannelOwner(channelId: number, newOwnerId: number): Promise<boolean> {
    const that = this;
    if (!this.globalData.testMode) {
      return new Promise((resolve) => {
        wx.showModal({
          title: '警告',
          content: '确定要转让频道主身份给该成员吗？',
          success(res) {
            if (res.confirm) {
              try {
                HttpUtil.post({
                  url: `/channel/transfer`,
                  jsonData: { channelId: channelId, masterId: newOwnerId }
                });
                resolve(true);
              } catch (err: any) {
                console.error(err);
                wx.showToast({
                  title: err.response.data.msg,
                  icon: "none"
                });
                resolve(true);
              }
            } else {
              resolve(false);
            }
          },
          fail() {
            resolve(false);
          }
        });
      });
    } else {
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
    }
  },
  async quitChannel(channelId: number): Promise<boolean> {
    if (!this.globalData.testMode) {
      return new Promise((resolve) => {
        wx.showModal({
          title: '警告',
          content: '确定要退出该频道吗？同时将退出频道中你加入的所有群组',
          async success(res) {
            if (res.confirm) {
              try {
                await HttpUtil.delete({ url: `/channel/${channelId}/join` });
                wx.showToast({
                  title: '退出成功',
                  icon: 'success',
                  time: 2000,
                });
                resolve(true);
              } catch (err: any) {
                wx.showToast({
                  title: err.response.data.msg,
                  icon: "none"
                });
                resolve(false);
              }
            } else {
              resolve(false);
            }
          },
          fail() {
            resolve(false);
          }
        });
      });
    } else {
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
    }
  },
  async disbandChannel(channelId: number): Promise<boolean> {
    const that = this;
    if (!this.globalData.testMode) {
      return new Promise((resolve) => {
        wx.showModal({
          title: '警告',
          content: '确定要解散该频道吗？',
          success(res) {
            if (res.confirm) {
              try {
                HttpUtil.delete({ url: `/channel/${channelId}` });
                wx.showToast({
                  title: '解散成功',
                  icon: 'success',
                  time: 2000,
                });
                resolve(true);
              } catch (err: any) {
                wx.showToast({
                  title: err.response.data.msg,
                  icon: "none"
                });
                resolve(false);
              }
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
    } else {
      return new Promise((resolve) => {
        wx.showModal({
          title: '警告',
          content: '确定要解散该频道吗？',
          success(res) {
            if (res.confirm) {
              const userList = that.getUserListCopy();
              const groupList = that.getGroupListCopy();
              const tourList = that.getTourListCopy();
              const postList = that.getPostListCopy();
              const commentList = that.getCommentListCopy();
              userList.forEach(user => {
                user.joinedChannel = user.joinedChannel.filter(
                  _channelId => _channelId != channelId
                );
                user.adminingChannel = user.adminingChannel.filter(
                  _channelId => _channelId != channelId
                );
                user.havingChannel = user.havingChannel.filter(
                  _channelId => _channelId != channelId
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
    }
  },

  // for channel-post.ts
  async getFullPost(postId: number): Promise<Post | undefined> {
    if (!this.globalData.testMode) {
      try {
        const res = (await HttpUtil.get({ url: `/post/${postId}/detail` })).data.data;
        const post = new Post({
          id: res.postId,
          title: res.title,
          content: res.content,
          user: res.user.uid,
          linkedChannel: res.channelId,
          isSticky: res.isSticky,
          likes: res.action.isLiked
            ? [this.globalData.currentUserId, ...Array(Math.max(res.likeSum - 1, 0)).fill(0)]
            : Array(res.likeSum).fill(0),
          time: res.createdAt,
          photos: res.pictureUrls.map((photo: any) => new Photo({ value: photo })),
        });
        return post;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        wx.navigateBack();
        return undefined;
      }
    } else {
      return this.getPost(postId);
    }
  },
  async getFullCommentsInPost(postId: number): Promise<Comment[]> {
    if (!this.globalData.testMode) {
      try {
        const res = await HttpUtil.get({ url: `/post/${postId}/comments` });
        const comments = res.data.data.map((res: any) => {
          return new Comment({
            id: res.commentId,
            content: res.content,
            linkedPost: postId,
            user: res.uid,
            time: res.createdAt,
            likes: res.isLiked
              ? [this.globalData.currentUserId, ...Array(Math.max(res.likeSum - 1, 0)).fill(0)]
              : Array(res.likeSum).fill(0),
            photos: res.pictureUrls.map((photo: any) => new Photo({ value: photo })),
            parentComment: (res.rootId == 0 && res.parentId == 0) ? -1 : res.parentId,
          });
        });
        return comments;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return [];
      }
    } else {
      return this.getCommentListCopy().filter(
        comment => comment.linkedPost === postId
      )
    }
  },
  async getMembersInPost(postId: number): Promise<Member[]> {
    if (!this.globalData.testMode) {
      try {
        const res = await HttpUtil.get({ url: `/post/${postId}/members` });
        const members = res.data.data.map((res: any) => {
          return new Member({
            id: res.uid,
            name: res.nickname,
            exp: res.exp,
            isAdmin: res.role == 'ADMIN',
            gender: res.gender,
            avatarUrl: res.avatarUrl,
            email: res.email,
            phone: res.phone,
            signature: res.signature,
            birthday: res.birthday,
            userGroup: translateUserRole(res.role),
          });
        })
        return members;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return [];
      }
    } else {
      return (await this.getMembersInChannel(this.getPost(postId)?.linkedChannel!)).members;
    }
  },
  async handlePostLike(postId: number, isLiked: boolean): Promise<Post | undefined> {
    if (!this.globalData.testMode) {
      try {
        if (!isLiked) await HttpUtil.post({ url: `/post/${postId}/like` });
        else await HttpUtil.delete({ url: `/post/${postId}/like` });
        return await this.getFullPost(postId);
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return undefined;
      }
    } else {
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
    }
  },
  async handlePostStick(post: Post): Promise<Post | undefined> {
    if (!this.globalData.testMode) {
      try {
        if (!post.isSticky) await HttpUtil.post({ url: `/post/${post.id}/top`, });
        else await HttpUtil.delete({ url: `/post/${post.id}/top`, });
        post.isSticky = !post.isSticky;
        return post;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return post;
      }
    } else {
      post.isSticky = !post.isSticky;
      this.updatePost(post);
      return post;
    }
  },
  async handleCommentLike(commentId: number, structedComments: StructedComment[]): Promise<StructedComment[]> {
    const _structedComments = JSON.parse(JSON.stringify(structedComments)) as StructedComment[];
    const currentUserId = this.globalData.currentUserId;
    const comment = _structedComments.find((comment: any) => comment.id == commentId);
    if (!comment) { return _structedComments; }
    if (comment.likes.includes(currentUserId)) {
      comment.likes = comment.likes.filter((id: any) => id !== currentUserId);
    } else {
      comment.likes.push(currentUserId);
    }
    if (!this.globalData.testMode) {
      try {
        if (comment.likes.includes(currentUserId)) {
          await HttpUtil.post({ url: `/comment/${commentId}/like` });
        } else {
          await HttpUtil.delete({ url: `/comment/${commentId}/like` });
        }
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return structedComments;
      }
    } else {
      const newComment = this.getComment(commentId) as Comment;
      newComment.likes = comment.likes;
      this.updateComment(newComment);
    }
    return _structedComments;
  },
  async handleReplyLike(commentId: number, replyId: number, structedComments: StructedComment[]): Promise<{ structedComments: StructedComment[], replies: StructedComment[] }> {
    const _structedComments = JSON.parse(JSON.stringify(structedComments)) as StructedComment[];
    const currentUserId = this.globalData.currentUserId;
    const comment = _structedComments.find((comment: any) => comment.id == commentId);
    if (!comment) { return { structedComments: _structedComments, replies: [] }; }
    const reply = comment.replies.find((reply: any) => reply.id == replyId);
    if (!reply) { return { structedComments: _structedComments, replies: [] }; }
    if (reply.likes.includes(currentUserId)) {
      reply.likes = reply.likes.filter((id: any) => id !== currentUserId);
    } else {
      reply.likes.push(currentUserId);
    }
    if (!this.globalData.testMode) {
      try {
        if (comment.likes.includes(currentUserId)) {
          await HttpUtil.post({ url: `/comment/${replyId}/like` });
        } else {
          await HttpUtil.delete({ url: `/comment/${replyId}/like` });
        }
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return { structedComments, replies: [] };
      }
    } else {
      const newComment = this.getComment(replyId) as Comment;
      newComment.likes = reply.likes;
      this.updateComment(newComment);
    }
    return { structedComments: _structedComments, replies: comment.replies };
  },
  async handleCommentSend(comment: Comment): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        if (comment.parentComment > 0) {
          console.log("开始发送1");
          const pictures = comment.photos.map((file) => (file.value));
          console.log(pictures);
          await HttpUtil.post({
            url: `/comment/${comment.parentComment}/reply`,
            jsonData: {
              content: comment.content,
              pictures: pictures,
            }
          });
          console.log("已发送1");
        } else {
          console.log("开始发送2");
          console.log(comment.photos);
          const pictures = comment.photos.map((file) => (file.value));
          console.log(pictures);
          await HttpUtil.post({
            url: `/post/${comment.linkedPost}/comment`,
            jsonData: {
              content: comment.content,
              pictures: pictures,
            }
          });
          console.log("已发送2");
        }
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
      comment.id = getNewId(this.globalData.currentData.commentList);
      this.addComment(comment);
      return true;
    }
  },
  async handleCommentDelete(commentId: number): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        await HttpUtil.delete({ url: `/comment/${commentId}` });
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
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
    }
  },
  async handleReplyDelete(replyId: number): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        await HttpUtil.delete({ url: `/comment/${replyId}` });
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
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
    }
  },
  async handlePostDelete(postId: number): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        await HttpUtil.delete({ url: `/post/${postId}` });
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
      this.getCommentListCopy().forEach((comment: any) => {
        if (comment.linkedPost === postId) {
          this.removeComment(comment.id);
        }
      });
      this.removePost(postId);
      return true;
    }
  },

  // for channel-detail-group.ts
  async loadGroup(groupId: number): Promise<{ currentGroup: GroupBasic, linkedTour: TourBasic }> {
    if (!this.globalData.testMode) {
      try {
        const currentGroupRes = await HttpUtil.get({ url: `/group/${groupId}/detail` });
        const { groupId: currentGroupId, joinWay: joinWayStr, ...groupRest } = currentGroupRes.data.data;
        const joinWay = joinWayStr == "FREE" ? JoinWay.Free : joinWayStr == "APPROVAL" ? JoinWay.Approval : JoinWay.Invite;
        const currentGroup = new GroupBasic({ id: currentGroupId, joinWay, ...groupRest });
        const linkedTourRes = await HttpUtil.get({ url: `/tour/${currentGroup.id}/detailByGroup` });
        const { tourId, ...tourRest } = linkedTourRes.data.data;
        const linkedTour = new TourBasic({ id: tourId, ...tourRest });
        return { currentGroup, linkedTour };
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return { currentGroup: {} as GroupBasic, linkedTour: {} as TourBasic };
      }
    } else {
      const currentGroup = new GroupBasic(this.getGroup(groupId));
      const linkedTour = new TourBasic(this.getTourListCopy().find(
        (tour) => tour.linkedGroup == currentGroup.id
      ));
      return { currentGroup, linkedTour };
    }
  },
  async getMembersInGroup(groupId: number): Promise<{ members: Member[], waitingUsers: Member[] }> {
    if (!this.globalData.testMode) {
      try {
        const membersRes = await HttpUtil.get({ url: `/group/${groupId}/members` });
        const members = membersRes.data.data.map((res: any) => {
          return new Member({
            id: res.uid,
            name: res.nickname,
            exp: res.exp,
            isAdmin: res.role == 'ADMIN',
            gender: res.gender,
            avatarUrl: res.avatarUrl,
            email: res.email,
            phone: res.phone,
            signature: res.signature,
            birthday: res.birthday,
            userGroup: translateUserRole(res.role),
          });
        }).sort((a: any, b: any) => {
          return getPriority(a.userGroup) - getPriority(b.userGroup);
        }) as Member[];
        return { members, waitingUsers: [] };
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return { members: [], waitingUsers: [] };
      }
    } else {
      const userList = this.getUserListCopy();
      const currentGroup = this.getGroup(groupId) as Group;
      const memberList = userList.filter(
        (user: User) => user.joinedGroup.includes(groupId)
      );
      const waitingUsersList = currentGroup.waitingUsers.map(
        (userId: number) => getUser(userList, userId)
      ).filter((user: any) => user != undefined);
      const members = memberList.map((member: User) => {
        return {
          ...member,
          userGroup: getUserGroupNameInGroup(member, groupId),
        };
      }).sort((a: any, b: any) => {
        return getPriority(a.userGroup) - getPriority(b.userGroup);
      });
      const waitingUsers = waitingUsersList.map((user: any) => {
        return { ...user, userGroup: getUserGroupName(user) };
      });
      return { members, waitingUsers };
    }
  },
  async getUserAuthorityInGroup(groupId: number): Promise<{ isGroupOwner: boolean, isGroupAdmin: boolean }> {
    if (!this.globalData.testMode) {
      try {
        const res = await HttpUtil.get({ url: `/group/${groupId}/authority` });
        return { isGroupOwner: res.data.data.isOwner, isGroupAdmin: res.data.data.isAdmin };
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return { isGroupOwner: false, isGroupAdmin: false };
      }
    } else {
      const userGroup = getUserGroupNameInGroup(this.currentUser(), groupId);
      return {
        isGroupOwner: userGroup === "群主",
        isGroupAdmin: userGroup === "系统管理员" || userGroup === "群主" || userGroup === "群管理员"
      };
    }
  },
  async addMemberInGroup(groupId: number, linkedTourId: number, newMemberIdInput: string): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        await HttpUtil.put({
          url: `/group/${groupId}/join/${newMemberIdInput}/${linkedTourId}`,
          jsonData: { userId: newMemberIdInput }
        });
        wx.showToast({
          title: '添加成功',
          icon: 'none'
        });
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
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
      if (user.joinedGroup.includes(groupId)) {
        wx.showToast({
          title: '用户已在群内',
          icon: 'none'
        });
        return false;
      }
      const currentGroup = this.getGroup(groupId) as Group;
      if (!user.joinedChannel.includes(currentGroup.linkedChannel)) {
        wx.showToast({
          title: '用户不在频道中',
          icon: 'none'
        });
        return false;
      }
      const linkedTour = this.getTour(linkedTourId) as Tour;
      linkedTour.users.push(newMemberId);
      this.updateTour(linkedTour);
      user.joinedGroup.push(groupId);
      this.updateUser(user);
      return true;
    }
  },
  async approveUserInGroup(groupId: number, linkedTourId: number, userId: number): Promise<boolean> {
    if (!this.globalData.testMode) {
      return false;
    } else {
      const user = this.getUser(userId);
      if (!user) { return false; }
      user.joinedGroup.push(groupId);
      this.updateUser(user);
      const currentGroup = this.getGroup(groupId) as Group;
      const linkedTour = this.getTour(linkedTourId) as Tour;
      currentGroup.waitingUsers = currentGroup.waitingUsers.filter(
        (id: number) => id !== userId
      );
      linkedTour.users.push(userId);
      this.updateGroup(currentGroup);
      this.updateTour(linkedTour);
      return true;
    }
  },
  async rejectUserInGroup(groupId: number, userId: number): Promise<boolean> {
    if (!this.globalData.testMode) {
      return false;
    } else {
      const currentGroup = this.getGroup(groupId) as Group;
      currentGroup.waitingUsers = currentGroup.waitingUsers.filter(
        (id: number) => id !== userId
      );
      this.updateGroup(currentGroup);
      return true;
    }
  },
  async userAdminChangeInGroup(groupId: number, userId: number): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        const res = await HttpUtil.get({ url: `/group/${groupId}/authority/${userId}` });
        const isGroupAdmin = res.data.data.isAdmin;
        if (isGroupAdmin) {
          await HttpUtil.delete({
            url: `/group/grant-admin`,
            jsonData: { groupId: groupId, granteeId: userId }
          });
        } else {
          await HttpUtil.post({
            url: `/group/grant-admin`,
            jsonData: { groupId: groupId, granteeId: userId }
          });
        }
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
      const currentGroup = this.getGroup(groupId) as Group;
      const user = this.getUser(userId);
      if (!user) { return false; }
      const userGroup = getUserGroupNameInGroup(user, currentGroup.id);
      if (userGroup === "群主") { return false; }
      if (userGroup === "群管理员") {
        user.adminingGroup = user.adminingGroup.filter(
          (groupId: number) => groupId !== currentGroup.id
        );
      } else {
        user.adminingGroup.push(currentGroup.id);
      }
      this.updateUser(user);
      return true;
    }
  },
  async removeMemberInGroup(groupId: number, linkedTourId: number, userId: number): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        await HttpUtil.delete({
          url: `/group/${groupId}/join/${userId}/${linkedTourId}`,
          jsonData: { userId: userId }
        });
        wx.showToast({
          title: '添加成功',
          icon: 'none'
        });
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
      const currentGroup = this.getGroup(groupId) as Group;
      const user = this.getUser(userId);
      if (!user) { return false; }
      user.joinedGroup = user.joinedGroup.filter(
        (groupId: number) => groupId !== currentGroup.id
      );
      user.adminingGroup = user.adminingGroup.filter(
        (groupId: number) => groupId !== currentGroup.id
      );
      const linkedTour = this.getTour(linkedTourId) as Tour;
      linkedTour.deleteUser(userId);
      this.updateTour(linkedTour);
      this.updateUser(user);
      return true;
    }
  },
  async transferGroupOwner(groupId: number, newOwnerId: number): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        HttpUtil.post({
          url: `/group/transfer`,
          jsonData: { groupId: groupId, masterId: newOwnerId }
        });
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
      const newOwner = this.getUser(newOwnerId);
      const currentOwner = this.currentUser();
      if (!newOwner || !currentOwner) { return false; }
      currentOwner.havingGroup = currentOwner.havingGroup.filter(
        (groupId: number) => groupId !== groupId
      );
      newOwner.adminingGroup = newOwner.adminingGroup.filter(
        (groupId: number) => groupId !== groupId
      );
      newOwner.havingGroup.push(groupId);
      this.updateUser(newOwner);
      this.updateUser(currentOwner);
      return true;
    }
  },
  async changeGroupBasic(groupBasic: GroupBasic): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        await HttpUtil.put({
          url: `/group/${groupBasic.id}`,
          jsonData: {
            name: groupBasic.name,
            description: groupBasic.description,
            joinWay: groupBasic.joinWay == JoinWay.Free ? "FREE" : groupBasic.joinWay == JoinWay.Approval ? "INVITE" : "INVITE"
          }
        });
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
      const currentGroup = this.getGroup(groupBasic.id) as Group;
      const { id, ...rest } = groupBasic;
      Object.assign(currentGroup, rest);
      this.updateGroup(currentGroup);
      return true;
    }
  },
  async changeGroupQrCode(groupId: number, qrCodeUrl: string): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        await HttpUtil.put({ url: `/group/qrCode/${groupId}`, jsonData: { base64: qrCodeUrl } });
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
      const currentGroup = this.getGroup(groupId) as Group;
      currentGroup.qrCode = qrCodeUrl;
      this.updateGroup(currentGroup);
      return true;
    }
  },
  async changeTourBasic(tour: TourBasic): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        await HttpUtil.put({ url: `/tour`, jsonData: tour });
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
      const currentTour = this.getTour(tour.id) as Tour;
      const { id, ...rest } = tour;
      Object.assign(currentTour, rest);
      this.updateTour(currentTour);
      return true;
    }
  },
  async quitGroup(groupId: number, linkedTourId: number): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        await HttpUtil.delete({ url: `/group/${groupId}/join` });
        wx.showToast({
          title: '退出成功',
          icon: 'success',
          time: 2000,
        });
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
      const currentUser = this.currentUser();
      const linkedTour = this.getTour(linkedTourId) as Tour;
      currentUser.joinedGroup = currentUser.joinedGroup.filter(
        (_groupId) => _groupId !== groupId
      );
      currentUser.adminingGroup = currentUser.adminingGroup.filter(
        (_groupId) => _groupId !== groupId
      );
      linkedTour.users = linkedTour.users.filter(
        (userId) => userId !== currentUser.id
      );
      this.updateTour(linkedTour);
      this.updateUser(currentUser);
      return true;
    }
  },
  async disbandGroup(groupId: number, linkedTourId: number): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        HttpUtil.delete({ url: `/group/${groupId}` });
        wx.showToast({
          title: '解散成功',
          icon: 'success',
          time: 2000,
        });
        return true;
      } catch (err: any) {
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
      const userList = this.getUserListCopy();
      userList.forEach((user) => {
        user.joinedGroup = user.joinedGroup.filter(
          (_groupId) => _groupId !== groupId
        );
        user.adminingGroup = user.adminingGroup.filter(
          (_groupId) => _groupId !== groupId
        );
        user.havingGroup = user.havingGroup.filter(
          (_groupId) => _groupId !== groupId
        );
        this.updateUser(user);
      });
      this.removeGroup(groupId);
      this.removeTour(linkedTourId);
      return true;
    }
  },
  async endGroupTour(groupId: number, linkedTourId: number): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        await HttpUtil.post({ url: `/endTour/${groupId}/${linkedTourId}` });
        wx.showToast({
          title: '结束成功',
          icon: 'success',
          time: 2000,
        });
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
      const userList = this.getUserListCopy();
      userList.forEach((user: User) => {
        user.joinedGroup = user.joinedGroup.filter(
          (_groupId: number) => _groupId !== groupId
        );
        user.adminingGroup = user.adminingGroup.filter(
          (_groupId: number) => _groupId !== groupId
        );
        user.havingGroup = user.havingGroup.filter(
          (_groupId: number) => _groupId !== groupId
        );
        this.updateUser(user);
      });
      this.removeGroup(groupId);
      const linkedTour = this.getTour(linkedTourId) as Tour;
      linkedTour.linkedGroup = -1;
      linkedTour.status = TourStatus.Finished;
      this.updateTour(linkedTour);
      return true;
    }
  },

  // for user.ts
  async getCurrentUser(): Promise<UserBasic | undefined> {
    if (!this.globalData.testMode) {
      try {
        const res = await HttpUtil.get({ url: `/user/detail` });
        const user = new UserBasic({
          id: res.data.data.uid,
          name: res.data.data.nickname,
          exp: res.data.data.exp,
          isAdmin: res.data.data.role == 'ADMIN',
          gender: res.data.data.gender,
          avatarUrl: res.data.data.avatarUrl,
          backgroundImageUrl: res.data.data.backgroundImageUrl,
          email: res.data.data.email,
          phone: res.data.data.phone,
          signature: res.data.data.signature,
          birthday: res.data.data.birthday,
        });
        return user;
      }
      catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return undefined;
      }
    } else {
      return this.currentUser();
    }
  },
  async changeUserName(nickname: string): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        await HttpUtil.put({ url: '/user/nickname', jsonData: { nickname } });
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
      const currentUser = this.currentUser();
      currentUser.name = nickname;
      this.updateUser(currentUser);
      return true;
    }
  },
  async changeUserBasic(user: UserBasic): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        await HttpUtil.put({
          url: '/user/info',
          jsonData: {
            gender: user.gender == '女' ? 0 : user.gender == '男' ? 1 : 2,
            email: user.email,
            phone: user.phone,
            signature: user.signature,
            birthday: user.birthday,
          }
        });
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
      const currentUser = this.currentUser();
      const { id, name, ...rest } = user;
      Object.assign(currentUser, rest);
      this.updateUser(currentUser);
      return true;
    }
  },
  async changeUserAvatar(avatar: string): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        await HttpUtil.put({ url: '/user/avatar', jsonData: { base64: avatar } });
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
      const currentUser = this.currentUser();
      currentUser.avatarUrl = avatar;
      this.updateUser(currentUser);
      return true;
    }
  },
  async changeUserBackgroundImage(backgroundImageUrl: string): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        await HttpUtil.put({ url: '/user/backgroundImage', jsonData: { base64: backgroundImageUrl } });
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
      const currentUser = this.currentUser();
      currentUser.backgroundImageUrl = backgroundImageUrl;
      this.updateUser(currentUser);
      return true;
    }
  },

  //for tour-editor.ts
  async loadFullTour(tourId: number): Promise<Tour> {
    if (!this.globalData.testMode) {
      try {
        const res = await HttpUtil.get({ url: `/tour/${tourId}/full` });
        const { tourId: id, ...tourRest } = res.data.data;
        const tour = new Tour({ id: id, ...tourRest });
        return tour;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return {} as Tour;
      }
    }
    else {
      return this.getTour(tourId) as Tour;
    }
  },
  async getMembersInTour(tourId: number): Promise<Member[]> {
    if (!this.globalData.testMode) {
      try {
        const membersRes = await HttpUtil.get({ url: `/tour/${tourId}/members` });
        const members = membersRes.data.data.map((res: any) => {
          return new Member({
            id: res.uid,
            name: res.nickname,
            exp: getExpFromRole(res.role),
            isAdmin: res.role == 'ADMIN',
            gender: res.gender,
            avatarUrl: res.avatarUrl,
            email: res.email,
            phone: res.phone,
            signature: res.signature,
            birthday: res.birthday,
            userGroup: translateUserRole(res.role),
          });
        }).sort((a: any, b: any) => {
          return getPriority(a.userGroup) - getPriority(b.userGroup);
        }) as Member[];
        return members;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return [];
      }
    } else {
      const userList = this.getUserListCopy();
      const currentTour = this.getTour(tourId) as Tour;
      const memberList = userList.filter(
        (user: User) => currentTour.users.includes(user.id)
      );
      const members = memberList.map((member: User) => {
        return new Member({
          ...member,
          userGroup: getUserGroupName(member),
        });
      }).sort((a, b) => {
        return getPriority(a.userGroup) - getPriority(b.userGroup);
      });
      return members;
    }
  },
  async changeFullTour(tour: Tour): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        await HttpUtil.put({ url: `/tour/full`, jsonData: tour });
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
      this.updateTour(tour);
      return true;
    }
  },
  async changeTourLocationPhotos(tourId: number, copyIndex: number, location: Location): Promise<boolean> {
    if (!this.globalData.testMode) {
      try {
        await HttpUtil.put({
          url: '/tour/photos',
          jsonData: {
            tourId: tourId,
            copyIndex: copyIndex,
            locationIndex: location.index,
            photos: location.photos.map(photo => photo.value)
          }
        })
        return true;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return false;
      }
    } else {
      const currentTour = this.getTour(tourId) as Tour;
      if (location.index !== -1) {
        currentTour.locations[copyIndex][location.index].photos = location.photos;
        this.updateTour(currentTour);
        return true;
      } else {
        return false;
      }
    }
  },

  // for userinfo.ts
  async getSelectedUserJoinedChannels(uid: number): Promise<Channel[]> {
    if (!this.globalData.testMode) {
      try {
        const res = await HttpUtil.get({ url: `/user/${uid}/joined-channel-list` });
        const channelList = res.data.data.map((res: any) => {
          return new Channel({
            id: res.channelId,
            name: res.name,
            description: res.description,
            joinWay: res.joinWay == "FREE" ? JoinWay.Free : res.joinWay == "APPROVAL" ? JoinWay.Approval : JoinWay.Invite,
          })
        }) as Channel[];
        return channelList;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return [];
      }
    } else {
      try {
        const user = this.getUser(uid)
        if (user) {
          return this.getChannelListCopy().filter(
            channel => user.joinedChannel
              .includes(channel.id) && channel.id != 1
          );
        }
        return [];
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return [];
      }
    }
  },
  async getFullPostsByUid(uid: number): Promise<PostCard[]> {
    if (!this.globalData.testMode) {
      try {
        const results = await HttpUtil.get({ url: `/user/${uid}/post-list` });
        const fullPosts = results.data.data.map((res: any) => {
          return {
            id: res.postId,
            title: res.title,
            content: '',
            linkedChannel: res.channelId,
            user: res.user.uid,
            time: res.createdAt,
            likes: Array(res.likeSum).fill(0),
            photos: [new Photo({ value: res.pictureUrl })],
            isSticky: res.isSticky,
            username: res.user.nickname,
            avatarUrl: res.user.avatarUrl,
            timeStr: formatPostTime(res.createdAt) ?? '',
            isLiked: res.action.isLiked,
          } as PostCard;
        });
        return fullPosts;
      } catch (err: any) {
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return [];
      }
    } else {
      const currentUserId = this.globalData.currentUserId
      return this.getPostListCopy()
        .map((post) => {
          return {
            ...post,
            username: this.getUser(post.user)?.name ?? '未知用户',
            avatarUrl: this.getUser(post.user)?.avatarUrl ?? '',
            timeStr: formatPostTime(post.time) ?? '',
            isLiked: post.likes.includes(currentUserId) ? true : false,
          }
        })
        .filter((post) =>
          post.user == uid
        )
        .sort((a, b) =>
          (b.isSticky ? 1 : 0) - (a.isSticky ? 1 : 0) || b.time - a.time
        );
    }
  },
  async getTransitDirections(origin: Location, destination: Location, startDate: number, strategy: number): Promise<{ duration: number[], walking_distance: number[], amount: number[], route: Transportation[] }> {
    const originLoc = `${Number(origin.longitude).toFixed(6)},${Number(origin.latitude).toFixed(6)}`;
    const destinationLoc = `${Number(destination.longitude).toFixed(6)},${Number(destination.latitude).toFixed(6)}`;
    const date = formatDate(startDate + origin.endOffset).replace(/\//g, '-').split('(')[0];
    const time = formatTime(startDate + origin.endOffset).split(' ')[1].replace(':', '-');

    try {
      const res = await HttpUtil.get({
        url: `/map/direction/transit?origin=${originLoc}&destination=${destinationLoc}&date=${date}&time=${time}&strategy=${strategy}`,
      })
      const plans = res.data.data.plans;
      const routes = plans.map((plan: any) => {
        return new Transportation({
          index: -1,
          startOffset: origin.endOffset,
          endOffset: origin.endOffset + plan.duration * 1000,
          timeOffset: origin.timeOffset,
          transportExpenses: plan.route.map((node: any, index: number) => new TransportExpense({
            index: index,
            title: node.title,
            amount: node.amount,
            currency: Currency.CNY,
            type: ExpenseType.Transportation,
            note: node.note,
            transportType: node.type,
          }))
        })
      }) as Transportation[];
      return { route: routes, amount: plans.map((plan: any) => plan.route[0].amount), duration: plans.map((plan: any) => plan.duration), walking_distance: plans.map((plan: any) => plan.walking_distance) };
    } catch (err: any) {
      console.error(err);
      wx.showToast({
        title: err.response.data.msg,
        icon: "none"
      });
      return { route: [], duration: [], amount: [], walking_distance: [] };
    }
  },

  async getUserDetail(userId: number): Promise<Member> {
    if (!this.globalData.testMode) {
      try {
        const res = await HttpUtil.get({ url: `/user/${userId}/detail` });
        const user = new Member({
          id: res.data.data.uid,
          name: res.data.data.nickname,
          exp: res.data.data.exp,
          isAdmin: res.data.data.role == 'ADMIN',
          gender: res.data.data.gender,
          avatarUrl: res.data.data.avatarUrl,
          backgroundImageUrl: res.data.data.backgroundImageUrl,
          email: res.data.data.email,
          phone: res.data.data.phone,
          signature: res.data.data.signature,
          birthday: res.data.data.birthday,
          userGroup: translateUserRole(res.data.data.role),
        });
        return user;
      } catch (err: any) {
        console.error(err);
        wx.showToast({
          title: err.response.data.msg,
          icon: "none"
        });
        return {} as Member;
      }
    } else {
      const user = this.getUser(userId) as User;
      return new Member({ userGroup: getUserGroupName(user), ...user });
    }
  },
})