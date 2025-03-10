import { Group } from "../../../utils/channel/group"
import { Tour } from "../../../utils/tour/tour";
import { User } from "../../../utils/user/user";
import { getNewId, getUser } from "../../../utils/util"

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
    refreshEnable: false,
    
    currentUser: getUser(app.globalData.currentData.userList, app.globalData.currentUserId),
    createGroupVisible: false,
    joinedGroups: [] as any[],
    unJoinedGroups: [] as any[],
    searchingValue: '',
    inputTitle: '',
    inputValue: '',
  },
  lifetimes: {
    ready() {
      this.classifyGroups();
    },
  },
  methods: {
    onRefresh() {
      this.setData({ refreshEnable: true });
      setTimeout(() => {
        this.setData({ refreshEnable: false });
      }, 500);
      this.classifyGroups(this.data.searchingValue);
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
      const groups = app.globalData.currentData.groupList as Group[]
      const currentChannelId = this.properties.currentChannel.id
      const currentUser = this.data.currentUser
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
      this.setData({ joinedGroups, unJoinedGroups })
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
      })
      const newUserList = app.globalData.currentData.userList.map((user: any) => new User(user));
      const thisUser = newUserList.find((user: User) => user.id == this.data.currentUser?.id) as User;
      const newTour = new Tour({
        id: getNewId(app.globalData.currentData.tourList),
        title: inputTitle,
        linkedChannel: this.properties.currentChannel.id,
        linkedGroup: newGroupId,
        users: [thisUser.id],
      })
      thisUser.joinedGroup.push(newGroupId);
      thisUser.havingGroup.push(newGroupId);
      app.globalData.currentData.groupList.push(group);
      app.globalData.currentData.tourList.push(newTour);
      app.globalData.currentData.userList = newUserList;
      this.setData({ 
        createGroupVisible: false, 
        inputTitle: '', 
        inputValue: '' ,
        currentUser: thisUser,
      })
      this.onRefresh()
    },
  }
})