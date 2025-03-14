import { Group } from "../../utils/channel/group";
import { currencyList } from "../../utils/tour/expense";
import { timezoneList } from "../../utils/tour/timezone";
import { Tour } from "../../utils/tour/tour";
import { User } from "../../utils/user/user";
import { formatDate, getUser, getUserGroupNameInGroup, MILLISECONDS } from "../../utils/util";

const app = getApp<IAppOption>();

Component({
  properties: {

  },
  data: {
    timezoneList: timezoneList,
    currencyList: currencyList,

    groupId: -1,
    currentGroup: {} as Group,
    currentUser: {} as User,
    isGroupOwner: false,
    isGroupAdmin: false,
    members: [] as any[],

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
  },
  methods: {
    onLoad(options: any) {
      const { groupId } = options;
      this.setData({
        groupId: parseInt(groupId),
        currentUser: getUser(
          app.globalData.currentData.userList,
          app.globalData.currentUserId
        )
      });
      this.getAuthority();
    },
    onShow() {
      const currentGroup = new Group(app.globalData.currentData.groupList.find(
        (group: Group) => group.id == this.data.groupId
      ));
      const linkedTour = new Tour(app.globalData.currentData.tourList.find(
        (tour: Tour) => tour.linkedGroup == currentGroup.id
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
      const userList = app.globalData.currentData.userList.map(
        (user: any) => new User(user)
      );
      const memberList = userList.filter(
        (user: User) => user.joinedGroup.includes(this.data.groupId)
      );
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
      this.setData({ members });
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
      console.log(newMemberId);
      const user = getUser(app.globalData.currentData.userList, newMemberId);
      if (!user) {
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
      user.joinedGroup.push(this.data.groupId);
      app.updateUser(user);
      this.getMembers();
    },
    handleUserAdminChange(e: any) {
      const userId = e.currentTarget.dataset.index;
      const currentGroup = this.data.currentGroup;
      const user = getUser(app.globalData.currentData.userList, userId);
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
    removeMember(e: any) {
      const that = this;
      wx.showModal({
        title: '警告',
        content: '确定要移除该成员吗？与该成员相关的行程信息将会一起被移除。',
        success(res) {
          if (res.confirm) {
            const userId = e.currentTarget.dataset.index;
            const currentGroup = that.data.currentGroup;
            const user = getUser(app.globalData.currentData.userList, userId);
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
    transferGroupOwner(e: any) {
      const that = this;
      wx.showModal({
        title: '警告',
        content: '确定要转让群主身份给该成员吗？',
        success(res) {
          if (res.confirm) {
            const userId = e.currentTarget.dataset.index;
            const newOwner = getUser(app.globalData.currentData.userList, userId);
            const currentOwner = getUser(app.globalData.currentData.userList, that.data.currentUser.id);
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
    handleCalendarConfirm(e: any) {
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
    onTimezoneColumnChange(e: any) {
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
    onRateInput(e: any) {
      const { rateError } = this.data;
      const isNumber = /^\d+(\.\d+)?$/.test(e.detail.value);
      if (rateError === isNumber) {
        this.setData({
          rateError: !isNumber,
        });
      }
    },
    onRateUpdate(e: any) {
      if (this.data.rateError) {
        return;
      }
      const linkedTour = this.data.linkedTour;
      linkedTour.currencyExchangeRate = Number(e.detail.value);
      this.setData({ linkedTour });
      app.updateTour(linkedTour);
    },
  }
})