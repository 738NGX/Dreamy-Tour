import { Channel, ChannelBasic, JoinWay } from "./utils/channel/channel";
import { Group, GroupBasic } from "./utils/channel/group";
import { Comment, Post, PostCard, StructedComment } from "./utils/channel/post";
import { UserRanking } from "./utils/channel/userRanking";
import HttpUtil, { apiUrl } from "./utils/httpUtil";
import { testData } from "./utils/testData";
import { Budget } from "./utils/tour/budget";
import { Currency, currencyList } from "./utils/tour/expense";
import { FootPrint } from "./utils/tour/footprint";
import { File, Photo } from "./utils/tour/photo";
import { Tour, TourBasic, TourStatus } from "./utils/tour/tour";
import { Location, Transportation } from "./utils/tour/tourNode";
import { Member, User, UserBasic } from "./utils/user/user";
import { formatPostTime, getExpFromRole, getImageBase64, getNewId, getUser, getUserGroupName, getUserGroupNameInChannel, getUserGroupNameInGroup } from "./utils/util";

// app.ts
App<IAppOption>({
  globalData: {
    currentUserId: 1,
    testMode: true,
    currentData: testData,
    baseUrl: apiUrl,
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
        const res = await HttpUtil.get({ url: "/channel/unjoined/list" });
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
        const res = await HttpUtil.get({ url: "/channel/joined/list" });
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
      return [];
    } else {
      const tourSaves = (this.globalData.currentData.tourList as Tour[])
        .filter(tour => tour.linkedChannel == channelId && tour.status == TourStatus.Finished && tour.channelVisible)
        .sort((a, b) => b.startDate - a.startDate);
      return tourSaves;
    }
  },
  async generateUserRankings(footprints: FootPrint[]): Promise<UserRanking[]> {
    if (!this.globalData.testMode) {
      return [];
    } else {
      const userTourCount: Map<number, number> = new Map();

      footprints.forEach(tour => {
        tour.users.forEach((userId) => {
          userTourCount.set(userId, (userTourCount.get(userId) || 0) + 1);
        });
      });
      const rankList = (this.globalData.currentData.userList as User[]).map(user => {
        const count = userTourCount.get(user.id) || 0;
        return { rank: 0, name: user.name, avatarUrl: user.avatarUrl, count } as UserRanking;
      }).filter((user) => user.count > 0);
      rankList.sort((a, b) => b.count - a.count);
      rankList.forEach((user, index) => {
        user.rank = index + 1;
      });
      return rankList;
    }
  },

  // for channel-detail-post.ts
  async getFullPostsInChannel(channelId: number): Promise<PostCard[]> {
    if (!this.globalData.testMode) {
      try {
        const url = channelId == 1 ? '/post/list' : `/channel/${channelId}/post/list`;
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
      } catch(err: any) {
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
        group.linkedChannel == channelId &&
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
      return false;
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
      return { members: [], waitingUsers: [] };
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
    }
  },
  async getUserAuthorityInChannel(channelId: number): Promise<{ isChannelOwner: boolean, isChannelAdmin: boolean }> {
    if (!this.globalData.testMode) {
      return { isChannelOwner: false, isChannelAdmin: false };
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
      return false;
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
      return false;
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
      return false;
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
      return false;
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
    if (!this.globalData.testMode) {
      return false;
    } else {
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
                  icon: "error"
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
    if (!this.globalData.testMode) {
      return false;
    } else {
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
    }
  },

  // for channel-post.ts
  async getFullPost(postId: number): Promise<Post | undefined> {
    if (!this.globalData.testMode) {
      try {
        const res = await HttpUtil.get({ url: `/post/${postId}/detail` });
        const post = res.data.data as Post;
        console.log(post);
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
      return [];
    } else {
      return this.getCommentListCopy().filter(
        comment => comment.linkedPost === postId
      )
    }
  },
  async handlePostLike(postId: number): Promise<Post | undefined> {
    if (!this.globalData.testMode) {
      return undefined;
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
  async handleCommentLike(commentId: number, structedComments: StructedComment[]): Promise<StructedComment[]> {
    if (!this.globalData.testMode) {
      return structedComments;
    } else {
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
    }
  },
  async handleReplyLike(commentId: number, replyId: number, structedComments: StructedComment[]): Promise<{ structedComments: StructedComment[], replies: StructedComment[] }> {
    if (!this.globalData.testMode) {
      return { structedComments, replies: [] };
    } else {
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

      const newComment = this.getComment(replyId) as Comment;
      newComment.likes = reply.likes;
      this.updateComment(newComment);

      return { structedComments: _structedComments, replies: comment.replies };
    }
  },
  async handleCommentSend(comment: Comment): Promise<boolean> {
    if (!this.globalData.testMode) {
      return false;
    } else {
      comment.id = getNewId(this.globalData.currentData.commentList);
      this.addComment(comment);
      return true;
    }
  },
  async handleCommentDelete(commentId: number): Promise<boolean> {
    if (!this.globalData.testMode) {
      return false;
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
      return false;
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
      return false;
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
        const { groupId: currentGroupId, ...groupRest } = currentGroupRes.data.data;
        const currentGroup = new GroupBasic({ id: currentGroupId, ...groupRest });
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
      return { members: [], waitingUsers: [] };
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
        const getPriority = (group: string) => {
          if (group === "系统管理员") return 0;
          if (group === "群主") return 1;
          if (group === "群管理员") return 2;
          return 3;
        };
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
      return { isGroupOwner: false, isGroupAdmin: false };
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
      return false;
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
      return false;
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
      return false;
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
      return false;
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
      return false;
    } else {
      const currentGroup = this.getGroup(groupBasic.id) as Group;
      const { id, ...rest } = groupBasic;
      Object.assign(currentGroup, rest);
      this.updateGroup(currentGroup);
      return true;
    }
  },
  async changeTourBasic(tour: TourBasic): Promise<boolean> {
    if (!this.globalData.testMode) {
      return false;
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
      return false;
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
      return false;
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
      return false;
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
          exp: getExpFromRole(res.data.data.role),
          isAdmin: res.data.data.role == 'ADMIN',
          gender: res.data.data.gender,
          avatarUrl: res.data.data.avatarUrl,
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
      return false;
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
      return false;
    } else {
      const currentUser = this.currentUser();
      currentUser.avatarUrl = avatar;
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
  async changeFullTour(tour: Tour): Promise<boolean> {
    if (!this.globalData.testMode) {
      return false;
    } else {
      this.updateTour(tour);
      return true;
    }
  },
  async changeTourLocationPhotos(tourId: number, copyIndex: number, location: Location): Promise<boolean> {
    if (!this.globalData.testMode) {
      return false;
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
})