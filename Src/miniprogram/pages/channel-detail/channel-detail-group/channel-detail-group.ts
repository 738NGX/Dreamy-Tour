/**
 * 频道-群组页面，展示频道内的群组，根据已加入和未加入分类
 * 搜索群组功能
 */
import { Channel, joinWayText } from "../../../utils/channel/channel";
import { GroupBasic } from "../../../utils/channel/group"
import { Currency, currencyList } from "../../../utils/tour/expense";

const app = getApp<IAppOption>()

type TourTemplate = {
  value: number,
  label: string,
}

Component({
  properties: {
    tourView: {
      type: Boolean,
      value: false,
    },
    currentChannel: {
      type: Object,
      value: {},
    },
    fabStyle: {
      type: String,
      value: 'right: 16px; bottom: 32px;',
    },
    height: {
      type: Number,
      value: 75,
    }
  },
  data: {
    mainCurrencies: currencyList,
    subCurrencies: currencyList.filter(currency => currency.value !== Currency.CNY),
    tourTemplates: [] as TourTemplate[],
    joinWayText: joinWayText,

    refreshEnable: false,

    createGroupVisible: false,
    currencySelectorVisible: false,
    currencyText: '主货币:人民币\n辅货币:日元',
    newTourCurrency: [Currency.CNY, Currency.JPY],
    tourTemplateSelectorVisible: false,
    tourTemplateId: [-1],
    tourTemplateText: '不选择',
    joinedGroups: [] as GroupBasic[],
    unJoinedGroups: [] as GroupBasic[],
    fullJoinedGroups: [] as GroupBasic[],
    fullUnJoinedGroups: [] as GroupBasic[],
    searchingValue: '',
    inputTitle: '',
    inputValue: '',
  },
  lifetimes: {
    async ready() {
      await this.classifyGroups();
      await this.getTourTemplates();
    },
  },
  methods: {
    async onRefresh() {
      this.setData({ refreshEnable: true });
      await this.classifyGroups();
      this.setData({
        joinedGroups: this.data.fullJoinedGroups.filter(group => group.name.includes(this.data.searchingValue)),
        unJoinedGroups: this.data.fullUnJoinedGroups.filter(group => group.name.includes(this.data.searchingValue)),
      });
      await this.getTourTemplates();
      this.setData({ refreshEnable: false });
    },
    async getTourTemplates() {
      const currentChannel = this.properties.currentChannel as Channel;
      if (currentChannel.id < 0) return;
      const tourSaves = await app.generateTourSaves(currentChannel.id);
      const tourTemplates = [{ value: -1, label: '不选择' }].concat(
        tourSaves.map(tour => {
          return { value: tour.id, label: tour.title, }
        })) as TourTemplate[];
      this.setData({ tourTemplates });
    },
    onSearch(e: WechatMiniprogram.CustomEvent) {
      const { value } = e.detail;
      this.setData({
        searchingValue: value,
        joinedGroups: this.data.fullJoinedGroups.filter(group => group.name.includes(value)),
        unJoinedGroups: this.data.fullUnJoinedGroups.filter(group => group.name.includes(value)),
      });
    },
    onSearchClear() {
      this.setData({
        searchingValue: '',
        joinedGroups: this.data.fullJoinedGroups,
        unJoinedGroups: this.data.fullUnJoinedGroups,
      });
    },
    async classifyGroups() {
      const { joinedGroups, unJoinedGroups } = await app.classifyGroups(this.properties.currentChannel.id);
      this.setData({
        joinedGroups,
        unJoinedGroups,
        fullJoinedGroups: joinedGroups,
        fullUnJoinedGroups: unJoinedGroups,
      })
    },
    onGroupClick(e: WechatMiniprogram.CustomEvent) {
      const id = e.currentTarget.dataset.index
      wx.navigateTo({
        url: `/pages/group/group?groupId=${id}`,
      })
    },
    handleCreateGroup() {
      this.setData({ createGroupVisible: !this.data.createGroupVisible })
    },
    handleTitleInput(e: WechatMiniprogram.CustomEvent) {
      this.setData({ inputTitle: e.detail.value })
    },
    handleInput(e: WechatMiniprogram.CustomEvent) {
      this.setData({ inputValue: e.detail.value })
    },
    // 控制货币变更
    onCurrencyColumnChange(e: WechatMiniprogram.CustomEvent) {
      const { column, index } = e.detail;
      const newTourMainCurrency = currencyList[index].value;
      if (column === 0) {
        const subCurrencies = currencyList.filter(currency => currency.value !== newTourMainCurrency)
        this.setData({ subCurrencies: subCurrencies });
      }
    },
    onCurrencyPickerChange(e: WechatMiniprogram.CustomEvent) {
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
    onTourTemplatePickerChange(e: WechatMiniprogram.CustomEvent) {
      this.setData({
        tourTemplateId: e.detail.value,
        tourTemplateText: e.detail.label[0],
      });
    },
    onTourTemplateColumnChange(e: WechatMiniprogram.CustomEvent) {
      this.setData({
        tourTemplateId: e.detail.value,
        tourTemplateText: e.detail.label[0],
      });
    },
    async handleCreateGroupConfirm() {
      const { inputTitle, inputValue } = this.data
      if (await app.createGroup(
        this.properties.currentChannel.id,
        inputTitle,
        inputValue,
        this.data.newTourCurrency,
        this.data.tourTemplateId[0])
      ) {
        this.setData({
          createGroupVisible: false,
          inputTitle: '',
          inputValue: '',
        })
        await this.onRefresh()
      }
    },
    async joinGroup(e: WechatMiniprogram.CustomEvent) {
      const groupId = parseInt(e.currentTarget.dataset.index);
      if (await app.joinGroup(groupId)) {
        await this.onRefresh();
      }
    }
  }
})