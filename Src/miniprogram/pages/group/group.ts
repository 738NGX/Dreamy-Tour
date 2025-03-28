/**
 * 群组界面，展示群成员、群行程、聊天群二维码信息
 */
import { JoinWay } from "../../utils/channel/channel";
import { Group, GroupBasic } from "../../utils/channel/group";
import { currencyList } from "../../utils/tour/expense";
import { timezoneList } from "../../utils/tour/timezone";
import { Tour, TourBasic } from "../../utils/tour/tour";
import { Member } from "../../utils/user/user";
import { formatDate, getImageBase64, MILLISECONDS } from "../../utils/util";

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
    currentGroup: {} as GroupBasic,
    isGroupOwner: false,
    isGroupAdmin: false,
    members: [] as Member[],
    waitingUsers: [] as Member[],

    newMemberId: '',

    linkedTour: {} as TourBasic,
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

    usercardVisible: false,
    usercardInfos: {} as Member,
  },
  methods: {
    async onLoad(options: any) {
      const { groupId } = options;
      this.setData({ groupId: parseInt(groupId), });
      await this.getAuthority();
    },
    async onShow() {
      const { currentGroup, linkedTour } = await app.loadGroup(this.data.groupId);
      this.setData({
        currentGroup: currentGroup,
        linkedTour: linkedTour,
        dateRange: [linkedTour.startDate, linkedTour.endDate],
        calendarRange: [linkedTour.startDate - MILLISECONDS.DAY * 365, linkedTour.endDate + MILLISECONDS.DAY * 365],
        dateRangeStr: [formatDate(linkedTour.startDate), formatDate(linkedTour.endDate)],
        timeOffsetStr: timezoneList.find(tz => tz.value === linkedTour.timeOffset)?.label ?? '未知时区'
      });
      await this.getMembers();
    },
    async getAuthority() {
      const { isGroupOwner, isGroupAdmin } = await app.getUserAuthorityInGroup(this.data.groupId);
      this.setData({ isGroupOwner, isGroupAdmin });
    },
    async getMembers() {
      const { members, waitingUsers } = await app.getMembersInGroup(this.data.groupId);
      this.setData({ members, waitingUsers });
    },
    onNewMemberIdInput(e: WechatMiniprogram.CustomEvent) {
      this.setData({ newMemberId: e.detail.value });
    },
    showUsercard(e: WechatMiniprogram.CustomEvent) {
      const userId = e.currentTarget.dataset.index;
      if (!userId) {
        this.setData({ usercardVisible: false });
        return;
      }
      const user = this.data.members.find((m) => m.id === userId);
      if (!user) return;
      this.setData({
        usercardVisible: true,
        usercardInfos: user
      })
    },
    async addMember() {
      if (await app.addMemberInGroup(
        this.data.groupId,
        this.data.linkedTour.id,
        this.data.newMemberId)
      ) {
        await this.getMembers();
        this.setData({ newMemberId: '' });
      }
    },
    async approveUser(e: WechatMiniprogram.CustomEvent) {
      const userId = parseInt(e.currentTarget.dataset.index);
      if (await app.approveUserInGroup(this.data.groupId, this.data.linkedTour.id, userId)) {
        await this.getMembers();
      }
    },
    async rejectUser(e: WechatMiniprogram.CustomEvent) {
      const userId = parseInt(e.currentTarget.dataset.index);
      if (await app.rejectUserInGroup(this.data.groupId, userId)) {
        await this.getMembers();
      }
    },
    async handleUserAdminChange(e: WechatMiniprogram.CustomEvent) {
      const userId = e.currentTarget.dataset.index;
      if (await app.userAdminChangeInGroup(this.data.groupId, userId)) {
        await this.getMembers();
      }
    },
    removeMember(e: WechatMiniprogram.CustomEvent) {
      const that = this;
      wx.showModal({
        title: '警告',
        content: '确定要移除该成员吗？与该成员相关的行程信息将会一起被移除。',
        async success(res) {
          if (res.confirm) {
            const userId = e.currentTarget.dataset.index;
            if (await app.removeMemberInGroup(that.data.groupId, that.data.linkedTour.id, userId)) {
              await that.getMembers();
            }
          }
        }
      });
    },
    transferGroupOwner(e: WechatMiniprogram.CustomEvent) {
      const that = this;
      wx.showModal({
        title: '警告',
        content: '确定要转让群主身份给该成员吗？',
        async success(res) {
          if (res.confirm) {
            const userId = e.currentTarget.dataset.index;
            if (await app.transferGroupOwner(that.data.groupId, userId)) {
              await that.getAuthority();
              await that.getMembers();
            }
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
    async handleCalendarConfirm(e: WechatMiniprogram.CustomEvent) {
      const { value } = e.detail;
      const linkedTour = this.data.linkedTour;
      linkedTour.startDate = value[0];
      linkedTour.endDate = value[1];
      await app.changeTourBasic(linkedTour);
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
    async onTourTimezonePickerChange() {
      const linkedTour = this.data.linkedTour;
      linkedTour.timeOffset = this.data.selectingTimeOffset;
      this.setData({
        linkedTour: linkedTour,
        timeOffsetStr: timezoneList.find(tz => tz.value === linkedTour.timeOffset)?.label || '未知时区',
      });
      await app.changeTourBasic(linkedTour);
      this.onTimezonePickerClick();
    },
    async exchangeTourCurrency() {
      const linkedTour = this.data.linkedTour;
      const newMainCurrency = linkedTour.subCurrency;
      const newSubCurrency = linkedTour.mainCurrency;
      linkedTour.mainCurrency = newMainCurrency;
      linkedTour.subCurrency = newSubCurrency;
      linkedTour.currencyExchangeRate = Number((1 / linkedTour.currencyExchangeRate).toFixed(7));
      this.setData({ linkedTour });
      await app.changeTourBasic(linkedTour);
    },
    onRateInput(e: WechatMiniprogram.CustomEvent) {
      const { rateError } = this.data;
      const isNumber = /^\d+(\.\d+)?$/.test(e.detail.value);
      if (rateError === isNumber) {
        this.setData({ rateError: !isNumber });
      }
    },
    async onRateUpdate(e: WechatMiniprogram.CustomEvent) {
      if (this.data.rateError) {
        return;
      }
      const linkedTour = this.data.linkedTour;
      linkedTour.currencyExchangeRate = Number(e.detail.value);
      this.setData({ linkedTour });
      await app.changeTourBasic(linkedTour);
    },
    async getRate() {
      const linkedTour = this.data.linkedTour;
      await linkedTour.getExchangeRate();
      this.setData({ linkedTour });
      await app.changeTourBasic(linkedTour);
    },
    onPhotoUploadVisibleChange() {
      const that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        async success(res) {
          const src = res.tempFilePaths[0]
          const { currentGroup } = that.data;
          currentGroup.qrCode = await getImageBase64(src);
          that.setData({ currentGroup, photoUploadVisible: false });
          await app.changeGroupBasic(currentGroup);
        }
      })
      //this.setData({
      //  photoUploadVisible: !this.data.photoUploadVisible
      //});
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
    async onPhotoUploadConfirm() {
      if (this.data.uploadedPhotos.length === 0) return;
      const { currentGroup } = this.data;
      currentGroup.qrCode = await getImageBase64(this.data.uploadedPhotos[0].url);
      this.setData({ currentGroup, photoUploadVisible: false });
      await app.changeGroupBasic(currentGroup);
    },
    async handleTitleUpdate(e: WechatMiniprogram.CustomEvent) {
      const { currentGroup, linkedTour } = this.data;
      currentGroup.name = e.detail.value;
      linkedTour.title = e.detail.value;
      this.setData({ currentGroup, linkedTour });
      await app.changeGroupBasic(currentGroup);
      await app.changeTourBasic(linkedTour);
    },
    async handleDescriptionUpdate(e: WechatMiniprogram.CustomEvent) {
      const { currentGroup } = this.data;
      currentGroup.description = e.detail.value;
      this.setData({ currentGroup });
      await app.changeGroupBasic(currentGroup);
    },
    async onJoinWayChange(e: WechatMiniprogram.CustomEvent) {
      const { currentGroup } = this.data;
      currentGroup.joinWay = e.detail.value;
      this.setData({ currentGroup });
      await app.changeGroupBasic(currentGroup);
    },
    quitGroup() {
      const that = this;
      wx.showModal({
        title: '警告',
        content: '确定要退出该群组吗？',
        async success(res) {
          if (res.confirm) {
            if (await app.quitGroup(that.data.currentGroup.id, that.data.linkedTour.id)) {
              wx.navigateBack();
            }
          }
        }
      });
    },
    disbandGroup() {
      const that = this;
      wx.showModal({
        title: '警告',
        content: '确定要解散该群组吗？',
        async success(res) {
          if (res.confirm) {
            if (await app.disbandGroup(that.data.currentGroup.id, that.data.linkedTour.id)) {
              that.setData({ currentGroup: {} as Group, linkedTour: {} as Tour });
              wx.navigateBack();
            }
          }
        }
      });
    },
    endGroup() {
      const that = this;
      wx.showModal({
        title: '警告',
        content: '确定要结束此次行程吗？行程将会保存到频道足迹,同时解散该群组。',
        async success(res) {
          if (res.confirm) {
            if (await app.endGroupTour(that.data.currentGroup.id, that.data.linkedTour.id)) {
              that.setData({ currentGroup: {} as Group, linkedTour: {} as Tour });
              wx.navigateBack();
            }
          }
        }
      });
    },
  }
})