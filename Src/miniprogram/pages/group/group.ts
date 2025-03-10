import { Group } from "../../utils/channel/group";
import { timezoneList } from "../../utils/tour/timezone";
import { Tour } from "../../utils/tour/tour";
import { User } from "../../utils/user/user";
import { formatDate, getUser, getUserGroupNameInGroup } from "../../utils/util";

const app = getApp<IAppOption>();

Component({
  properties: {

  },
  data: {
    timezoneList: timezoneList,
    
    groupId: -1,
    currentGroup: {} as Group,
    currentUser: {} as User,
    isGroupAdmin: false,
    members: [] as any[],

    linkedTour: {} as Tour,
    dateRange: ['',''],
    timezoneVisible: false,
    selectingTimeOffset: 0,
    timeOffsetStr: ''
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
      const userGroup = getUserGroupNameInGroup(
        this.data.currentUser,
        parseInt(groupId)
      );
      this.setData({ isGroupAdmin: userGroup === "系统管理员" || userGroup === "群主" || userGroup === "群管理员" });
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
        dateRange: [formatDate(linkedTour.startDate), formatDate(linkedTour.endDate)],
        timeOffsetStr: timezoneList.find(tz => tz.value === linkedTour.timeOffset)?.label ?? '未知时区'
      });
      this.getMembers();
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
    }
  }
})