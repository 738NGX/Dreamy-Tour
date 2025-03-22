/**
 * 群组界面，展示群成员、群行程、聊天群二维码信息
 */
import { JoinWay } from "../../utils/channel/channel";
import { Group } from "../../utils/channel/group";
import { currencyList } from "../../utils/tour/expense";
import { timezoneList } from "../../utils/tour/timezone";
import { Tour, TourStatus } from "../../utils/tour/tour";
import { User } from "../../utils/user/user";
import { formatDate, getUser, getUserGroupName, getUserGroupNameInGroup, MILLISECONDS } from "../../utils/util";

const app = getApp<IAppOption>();

Component({
  properties: {

  },
  data: {
    timezoneList: timezoneList,
    currencyList: currencyList,
    joinWays: [
      { value: JoinWay.Free, label: '自由加入' },
      { value: JoinWay.Approval, label: '需要审核' },
      { value: JoinWay.Invite, label: '仅限邀请' }
    ],

    groupId: -1,
    currentGroup: {} as Group,
    currentUser: {} as User,
    isGroupOwner: false,
    isGroupAdmin: false,
    members: [] as any[],
    waitingUsers: [] as any[],

    newMemberId: '',

    linkedTour: {} as Tour,
    calendarVisible: false,
    dateRange: [0, 0],
    calendarRange: [0, 0],
    dateRangeStr: ['', ''],
    timezoneVisible: false,
    selectingTimeOffset: 0,
    timeOffsetStr: '',
    rateError: false,
    rateFormat: (v: string) => {
      const isNumber = /^\d+(\.\d+)?$/.test(v);
      if (isNumber) {
        return parseFloat(v).toFixed(2);
      }
      return v;
    },

    photoUploadVisible: false,
    uploadedPhotos: [] as any[],
  },
  methods: {
    onLoad(options: any) {
      const { groupId } = options;
      this.setData({
        groupId: parseInt(groupId),
        currentUser: app.currentUser(),
      });
      this.getAuthority();
    },
    onShow() {
      const currentGroup = app.getGroup(this.data.groupId) as Group;
      const linkedTour = new Tour(app.getTourListCopy().find(
        (tour) => tour.linkedGroup == currentGroup.id
      ));
      this.setData({
        currentGroup: currentGroup,
        linkedTour: linkedTour,
        dateRange: [linkedTour.startDate, linkedTour.endDate],
        calendarRange: [linkedTour.startDate - MILLISECONDS.DAY * 365, linkedTour.endDate + MILLISECONDS.DAY * 365],
        dateRangeStr: [formatDate(linkedTour.startDate), formatDate(linkedTour.endDate)],
        timeOffsetStr: timezoneList.find(tz => tz.value === linkedTour.timeOffset)?.label ?? '未知时区'
      });
      this.getMembers();
    },
    getAuthority() {
      const userGroup = getUserGroupNameInGroup(
        this.data.currentUser,
        this.data.groupId
      );
      this.setData({
        isGroupOwner: userGroup === "群主",
        isGroupAdmin: userGroup === "系统管理员" || userGroup === "群主" || userGroup === "群管理员"
      });
    },
    getMembers() {
      const userList = app.getUserListCopy();
      const memberList = userList.filter(
        (user: User) => user.joinedGroup.includes(this.data.groupId)
      );
      const waitingUsersList = this.data.currentGroup.waitingUsers.map(
        (userId: number) => getUser(userList, userId)
      ).filter((user: any) => user != undefined);
      const members = memberList.map((member: User) => {
        return {
          ...member,
          userGroup: getUserGroupNameInGroup(member, this.data.groupId),
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
      this.setData({ members, waitingUsers });
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
      if (user.joinedGroup.includes(this.data.groupId)) {
        wx.showToast({
          title: '用户已在群内',
          icon: 'none'
        });
        return;
      }
      if(!user.joinedChannel.includes(this.data.currentGroup.linkedChannel)) {
        wx.showToast({
          title: '用户不在频道中',
          icon: 'none'
        });
        return;
      }
      const { linkedTour } = this.data;
      linkedTour.users.push(newMemberId);
      app.updateTour(linkedTour);
      this.setData({ linkedTour });
      user.joinedGroup.push(this.data.groupId);
      app.updateUser(user);
      this.getMembers();
      this.setData({ newMemberId: '' });
    },
    approveUser(e: WechatMiniprogram.CustomEvent) {
      const userId = parseInt(e.currentTarget.dataset.index);
      const user = app.getUser(userId);
      if (!user) { return; }
      user.joinedGroup.push(this.data.groupId);
      app.updateUser(user);
      const { currentGroup, linkedTour } = this.data;
      currentGroup.waitingUsers = currentGroup.waitingUsers.filter(
        (id: number) => id !== userId
      );
      linkedTour.users.push(userId);
      app.updateGroup(currentGroup);
      app.updateTour(linkedTour);
      this.setData({ currentGroup, linkedTour });
      this.getMembers();
    },
    rejectUser(e: WechatMiniprogram.CustomEvent) {
      const userId = parseInt(e.currentTarget.dataset.index);
      const { currentGroup } = this.data;
      currentGroup.waitingUsers = currentGroup.waitingUsers.filter(
        (id: number) => id !== userId
      );
      app.updateGroup(currentGroup);
      this.setData({ currentGroup });
      this.getMembers();
    },
    handleUserAdminChange(e: WechatMiniprogram.CustomEvent) {
      const userId = e.currentTarget.dataset.index;
      const currentGroup = this.data.currentGroup;
      const user = app.getUser(userId);
      if (!user) { return; }
      const userGroup = getUserGroupNameInGroup(user, currentGroup.id);
      if (userGroup === "群主") { return; }
      if (userGroup === "群管理员") {
        user.adminingGroup = user.adminingGroup.filter(
          (groupId: number) => groupId !== currentGroup.id
        );
      } else {
        user.adminingGroup.push(currentGroup.id);
      }
      app.updateUser(user);
      this.getMembers();
    },
    removeMember(e: WechatMiniprogram.CustomEvent) {
      const that = this;
      wx.showModal({
        title: '警告',
        content: '确定要移除该成员吗？与该成员相关的行程信息将会一起被移除。',
        success(res) {
          if (res.confirm) {
            const userId = e.currentTarget.dataset.index;
            const currentGroup = that.data.currentGroup;
            const user = app.getUser(userId);
            if (!user) { return; }
            user.joinedGroup = user.joinedGroup.filter(
              (groupId: number) => groupId !== currentGroup.id
            );
            user.adminingGroup = user.adminingGroup.filter(
              (groupId: number) => groupId !== currentGroup.id
            );
            const { linkedTour } = that.data;
            linkedTour.deleteUser(userId);
            that.setData({ linkedTour });
            app.updateTour(linkedTour);
            app.updateUser(user);
            that.getMembers();
          }
        }
      });
    },
    transferGroupOwner(e: WechatMiniprogram.CustomEvent) {
      const that = this;
      wx.showModal({
        title: '警告',
        content: '确定要转让群主身份给该成员吗？',
        success(res) {
          if (res.confirm) {
            const userId = e.currentTarget.dataset.index;
            const newOwner = app.getUser(userId);
            const currentOwner = app.getUser(that.data.currentUser.id);
            if (!newOwner || !currentOwner) { return; }
            currentOwner.havingGroup = currentOwner.havingGroup.filter(
              (groupId: number) => groupId !== that.data.groupId
            );
            newOwner.adminingGroup = newOwner.adminingGroup.filter(
              (groupId: number) => groupId !== that.data.groupId
            );
            newOwner.havingGroup.push(that.data.groupId);
            that.setData({ currentUser: currentOwner });
            app.updateUser(newOwner);
            app.updateUser(currentOwner);
            that.getAuthority();
            that.getMembers();
          }
        }
      });
    },
    handleTourEditor() {
      wx.navigateTo({
        url: `/pages/tour-edit/tour-edit?tourId=${this.data.linkedTour.id}`,
      });
    },
    handleDateRangeChange() {
      this.setData({ calendarVisible: true });
    },
    handleCalendarConfirm(e: WechatMiniprogram.CustomEvent) {
      const { value } = e.detail;
      const linkedTour = this.data.linkedTour;
      linkedTour.startDate = value[0];
      linkedTour.endDate = value[1];
      app.updateTour(linkedTour);
      this.setData({
        linkedTour: linkedTour,
        dateRange: value,
        calendarRange: [value[0] - MILLISECONDS.DAY * 365, value[1] + MILLISECONDS.DAY * 365],
        dateRangeStr: [formatDate(value[0]), formatDate(value[1])],
        calendarVisible: false
      });
    },
    onTimezonePickerClick() {
      this.setData({
        selectingTimeOffset: this.data.linkedTour.timeOffset,
        timezoneVisible: !this.data.timezoneVisible
      });
    },
    onTimezoneColumnChange(e: WechatMiniprogram.CustomEvent) {
      this.setData({ selectingTimeOffset: Number(e.detail.value[0]) });
    },
    onTourTimezonePickerChange() {
      const linkedTour = this.data.linkedTour;
      linkedTour.timeOffset = this.data.selectingTimeOffset;
      this.setData({
        linkedTour: linkedTour,
        timeOffsetStr: timezoneList.find(tz => tz.value === linkedTour.timeOffset)?.label || '未知时区',
      });
      app.updateTour(linkedTour);
      this.onTimezonePickerClick();
    },
    exchangeTourCurrency() {
      const linkedTour = this.data.linkedTour;
      const newMainCurrency = linkedTour.subCurrency;
      const newSubCurrency = linkedTour.mainCurrency;
      linkedTour.mainCurrency = newMainCurrency;
      linkedTour.subCurrency = newSubCurrency;
      linkedTour.currencyExchangeRate = Number((1 / linkedTour.currencyExchangeRate).toFixed(7));
      this.setData({ linkedTour });
      app.updateTour(linkedTour);
    },
    onRateInput(e: WechatMiniprogram.CustomEvent) {
      const { rateError } = this.data;
      const isNumber = /^\d+(\.\d+)?$/.test(e.detail.value);
      if (rateError === isNumber) {
        this.setData({
          rateError: !isNumber,
        });
      }
    },
    onRateUpdate(e: WechatMiniprogram.CustomEvent) {
      if (this.data.rateError) {
        return;
      }
      const linkedTour = this.data.linkedTour;
      linkedTour.currencyExchangeRate = Number(e.detail.value);
      this.setData({ linkedTour });
      app.updateTour(linkedTour);
    },
    onPhotoUploadVisibleChange() {
      this.setData({
        photoUploadVisible: !this.data.photoUploadVisible
      });
    },
    handlePhotoAdd(e: WechatMiniprogram.CustomEvent) {
      const { uploadedPhotos } = this.data;
      const { files } = e.detail;

      this.setData({
        uploadedPhotos: [...uploadedPhotos, ...files],
      });
    },
    handlePhotoRemove(e: WechatMiniprogram.CustomEvent) {
      const { index } = e.detail;
      const { uploadedPhotos } = this.data;

      uploadedPhotos.splice(index, 1);
      this.setData({
        fileList: uploadedPhotos,
      });
    },
    onPhotoUploadConfirm() {
      if (this.data.uploadedPhotos.length === 0) return;
      const { currentGroup } = this.data;
      currentGroup.qrCode = this.data.uploadedPhotos[0].url;
      this.setData({ currentGroup, photoUploadVisible: false });
      app.updateGroup(currentGroup);
    },
    handleTitleUpdate(e: WechatMiniprogram.CustomEvent) {
      const { currentGroup, linkedTour } = this.data;
      currentGroup.name = e.detail.value;
      linkedTour.title = e.detail.value;
      this.setData({ currentGroup, linkedTour });
      app.updateGroup(currentGroup);
      app.updateTour(linkedTour);
    },
    handleDescriptionUpdate(e: WechatMiniprogram.CustomEvent) {
      const { currentGroup } = this.data;
      currentGroup.description = e.detail.value;
      this.setData({ currentGroup });
      app.updateGroup(currentGroup);
    },
    onJoinWayChange(e: WechatMiniprogram.CustomEvent) {
      const { currentGroup } = this.data;
      currentGroup.joinWay = e.detail.value;
      this.setData({ currentGroup });
      app.updateGroup(currentGroup);
    },
    quitGroup() {
      const that = this;
      wx.showModal({
        title: '警告',
        content: '确定要退出该群组吗？',
        success(res) {
          if (res.confirm) {
            const { currentUser, linkedTour } = that.data;
            currentUser.joinedGroup = currentUser.joinedGroup.filter(
              (groupId: number) => groupId !== that.data.groupId
            );
            currentUser.adminingGroup = currentUser.adminingGroup.filter(
              (groupId: number) => groupId !== that.data.groupId
            );
            linkedTour.users = linkedTour.users.filter(
              (userId: number) => userId !== currentUser.id
            );
            app.updateTour(linkedTour);
            app.updateUser(currentUser);
            wx.navigateBack();
          }
        }
      });
    },
    disbandGroup() {
      const that = this;
      wx.showModal({
        title: '警告',
        content: '确定要解散该群组吗？',
        success(res) {
          if (res.confirm) {
            const userList = app.getUserListCopy();
            userList.forEach((user: User) => {
              user.joinedGroup = user.joinedGroup.filter(
                (groupId: number) => groupId !== that.data.groupId
              );
              user.adminingGroup = user.adminingGroup.filter(
                (groupId: number) => groupId !== that.data.groupId
              );
              user.havingGroup = user.havingGroup.filter(
                (groupId: number) => groupId !== that.data.groupId
              );
              app.updateUser(user);
            });
            app.removeGroup(that.data.currentGroup);
            app.removeTour(that.data.linkedTour);
            that.setData({ currentGroup: {} as Group, linkedTour: {} as Tour });
            wx.navigateBack();
          }
        }
      });
    },
    endGroup() {
      const that = this;
      wx.showModal({
        title: '警告',
        content: '确定要结束此次行程吗？行程将会保存到频道足迹,同时解散该群组。',
        success(res) {
          if (res.confirm) {
            const userList = app.getUserListCopy();
            userList.forEach((user: User) => {
              user.joinedGroup = user.joinedGroup.filter(
                (groupId: number) => groupId !== that.data.groupId
              );
              user.adminingGroup = user.adminingGroup.filter(
                (groupId: number) => groupId !== that.data.groupId
              );
              user.havingGroup = user.havingGroup.filter(
                (groupId: number) => groupId !== that.data.groupId
              );
              app.updateUser(user);
            });
            app.removeGroup(that.data.currentGroup);
            const { linkedTour } = that.data;
            linkedTour.linkedGroup = -1;
            linkedTour.status = TourStatus.Finished;
            app.updateTour(linkedTour);
            that.setData({ currentGroup: {} as Group, linkedTour: {} as Tour });
            wx.navigateBack();
          }
        }
      });
    },
  }
})