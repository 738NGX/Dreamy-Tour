import { Channel, JoinWay, joinWayText } from "../../../utils/channel/channel";
import { Group } from "../../../utils/channel/group"
import { Budget } from "../../../utils/tour/budget";
import { Currency, currencyList } from "../../../utils/tour/expense";
import { Tour, TourStatus } from "../../../utils/tour/tour";
import { Location, Transportation } from "../../../utils/tour/tourNode";
import { User } from "../../../utils/user/user";
import { getNewId, getTour, getUser } from "../../../utils/util"

const app = getApp<IAppOption>()

Component({
  properties: {
    currentChannel: {
      type: Object,
      value: {},
    },
    fabStyle: {
      type: String,
      value: 'right: 16px; bottom: 32px;',
    }
  },
  data: {
    mainCurrencies: currencyList,
    subCurrencies: currencyList.filter(currency => currency.value !== Currency.CNY),
    tourTemplates: [] as any[],
    joinWayText: joinWayText,

    refreshEnable: false,

    currentUser: {} as User,
    createGroupVisible: false,
    currencySelectorVisible: false,
    currencyText: '主货币:人民币\n辅货币:日元',
    newTourCurrency: [Currency.CNY, Currency.JPY],
    tourTemplateSelectorVisible: false,
    tourTemplateId: [-1],
    tourTemplateText: '不选择',
    joinedGroups: [] as any[],
    unJoinedGroups: [] as any[],
    searchingValue: '',
    inputTitle: '',
    inputValue: '',
  },
  lifetimes: {
    ready() {
      this.classifyGroups();
      this.getTourTemplates();
    },
  },
  methods: {
    onRefresh() {
      this.setData({ refreshEnable: true });
      setTimeout(() => {
        this.setData({ refreshEnable: false });
      }, 500);
      this.classifyGroups(this.data.searchingValue);
      this.getTourTemplates();
    },
    getTourTemplates() {
      const currentChannel = this.properties.currentChannel as Channel;
      const tourSaves = (app.globalData.currentData.tourList as unknown as Tour[])
        .map(tour => new Tour(tour))
        .filter(tour => tour.linkedChannel == currentChannel.id && tour.status == TourStatus.Finished && tour.channelVisible)
        .sort((a: any, b: any) => b.startDate - a.startDate);
      const tourTemplates = [{ value: -1, label: '不选择' }].concat(tourSaves.map(tour => {
        return {
          value: tour.id,
          label: tour.title,
        }
      }));
      this.setData({ tourTemplates });
    },
    onSearch(e: any) {
      const { value } = e.detail;
      this.setData({ searchingValue: value });
      this.classifyGroups(value);
    },
    onSearchClear() {
      this.setData({ searchingValue: '' });
      this.classifyGroups();
    },
    classifyGroups(searchValue: string = '') {
      const groups = app.globalData.currentData.groupList.map((group: any) => new Group(group)) as Group[];
      const currentChannelId = this.properties.currentChannel.id
      const currentUser = getUser(app.globalData.currentData.userList, app.globalData.currentUserId);
      const joinedGroups = groups.filter(group =>
        group.linkedChannel == currentChannelId &&
        group.name.includes(searchValue) &&
        currentUser?.joinedGroup.includes(group.id)
      )
      const unJoinedGroups = groups.filter(group =>
        group.linkedChannel == currentChannelId &&
        group.name.includes(searchValue) &&
        !currentUser?.joinedGroup.includes(group.id)
      )
      this.setData({ currentUser, joinedGroups, unJoinedGroups })
    },
    onGroupClick(e: any) {
      const id = e.currentTarget.dataset.index
      wx.navigateTo({
        url: `/pages/group/group?groupId=${id}`,
      })
    },
    handleCreateGroup() {
      this.setData({ createGroupVisible: !this.data.createGroupVisible })
    },
    handleTitleInput(e: any) {
      this.setData({ inputTitle: e.detail.value })
    },
    handleInput(e: any) {
      this.setData({ inputValue: e.detail.value })
    },
    // 控制货币变更
    onCurrencyColumnChange(e: any) {
      const { column, index } = e.detail;
      const newTourMainCurrency = currencyList[index].value;

      if (column === 0) {
        const subCurrencies = currencyList.filter(currency => currency.value !== newTourMainCurrency)
        this.setData({ subCurrencies: subCurrencies });
      }
    },
    onCurrencyPickerChange(e: any) {
      const { value, label } = e.detail;

      this.setData({
        currencySelectorVisible: false,
        newTourCurrency: value,
        currencyText: '主货币:' + label[0] + '\n辅货币:' + label[1],
      });
    },
    handleCurrencyPicker() {
      this.setData({ currencySelectorVisible: !this.data.currencySelectorVisible });
    },
    // 控制模板选择
    handleTourTemplatePicker() {
      this.setData({ tourTemplateSelectorVisible: !this.data.tourTemplateSelectorVisible });
    },
    onTourTemplatePickerChange(e: any) {
      this.setData({
        tourTemplateId: e.detail.value,
        tourTemplateText: e.detail.label[0],
      });
    },
    onTourTemplateColumnChange(e: any) {
      this.setData({
        tourTemplateId: e.detail.value,
        tourTemplateText: e.detail.label[0],
      });
    },
    handleCreateGroupConfirm() {
      const { inputTitle, inputValue } = this.data
      if (!inputTitle || !inputValue) {
        wx.showToast({
          title: '请填写完整信息',
          icon: 'none',
        })
        return
      }
      const newGroupId = getNewId(app.globalData.currentData.groupList);
      const group = new Group({
        id: newGroupId,
        name: inputTitle,
        description: inputValue,
        linkedChannel: this.properties.currentChannel.id
      });
      const thisUser = getUser(app.globalData.currentData.userList, app.globalData.currentUserId) as User;
      const tourTemplate = getTour(app.globalData.currentData.tourList, this.data.tourTemplateId[0]);
      const newTour = new Tour({
        id: getNewId(app.globalData.currentData.tourList),
        title: inputTitle,
        linkedChannel: this.properties.currentChannel.id,
        linkedGroup: newGroupId,
        users: [thisUser.id],
        mainCurrency: this.data.newTourCurrency[0],
        subCurrency: this.data.newTourCurrency[1],
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
      app.addGroup(group);
      app.addTour(newTour);
      app.updateUser(thisUser);
      this.setData({
        createGroupVisible: false,
        inputTitle: '',
        inputValue: '',
        currentUser: thisUser,
      })
      this.onRefresh()
    },
    joinGroup(e: any) {
      const groupId = parseInt(e.currentTarget.dataset.index);
      const group = app.getGroup(groupId) as Group;
      if (group.joinWay == JoinWay.Approval) {
        if(group.waitingUsers.includes(app.globalData.currentUserId)) {
          wx.showToast({
            title: '您已经申请过了,请耐心等待',
            icon: 'none',
          });
          return;
        }
        else {
          group.waitingUsers.push(app.globalData.currentUserId);
          app.updateGroup(group);
          wx.showToast({
            title: '已发送加入申请,请耐心等待',
            icon: 'none',
          });
          return;
        }
      }
      if (group.joinWay == JoinWay.Invite) {
        wx.showToast({
          title: '该群组仅限邀请加入',
          icon: 'none',
        });
        return;
      }
      const thisUser = app.getUser(this.data.currentUser.id) as User;
      thisUser.joinedGroup.push(groupId);
      app.updateUser(thisUser);
      this.setData({ currentUser: thisUser });
      this.onRefresh()
    }
  }
})