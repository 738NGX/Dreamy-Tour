import HttpUtil from "../../utils/httpUtil";
import { budgetList, currencyList } from "../../utils/tour/expense";
import { Tour } from "../../utils/tour/tour";
import { Location, Transportation } from "../../utils/tour/tourNode";

const app = getApp<IAppOption>();

Component({
  data: {
    budgetList: budgetList,
    currencyList: currencyList,

    currentTour: {} as Tour,
    currentTourId: 0 as number,
    settingsVisible: false,

    dateRange: [] as any[],
    currentDateFilter: { label: "全部", value: [0, 0, 0] } as any,

    copyOptions: [] as any[],
    currentCopyIndex: 0,

    showUserReport: true,

    generatorVisible: false,
    generatorText: "",
    generatorResult: "",
  },
  methods: {
    async onLoad(options: any) {
      const { tourId } = options;
      const currentTour = await app.loadFullTour(parseInt(tourId)) as Tour;
      const dateRange = this.getDateRange(currentTour!.startDate, currentTour!.endDate);
      const copyOptions = currentTour.nodeCopyNames.map((name: string, index: number) => ({ label: name, value: index }));
      this.setData({
        currentTour, dateRange, copyOptions,
        currentTourId: tourId
      });
      await this.onShow();
    },
    async onShow() {
      const viewerComponent = this.selectComponent('#viewer');
      if (viewerComponent && this.data.currentTourId > 0) {
        await viewerComponent.init(this.data.currentTour);
      }
    },
    handleCurrentTourChange(e: WechatMiniprogram.CustomEvent) {
      const { value } = e.detail;
      this.setData({ currentTour: new Tour(value) });
    },
    getDateRange(startTimestamp: number, endTimestamp: number): number[][] {
      const startDate = new Date(startTimestamp);
      const endDate = new Date(endTimestamp);
      const result: any[] = [{ label: "全部", value: [0, 0, 0] }];
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      while (startDate <= endDate) {
        result.push({
          label: `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`,
          value: [startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate()]
        });
        startDate.setDate(startDate.getDate() + 1);
      }
      return result;
    },
    handleSettings() {
      this.setData({ settingsVisible: !this.data.settingsVisible });
    },
    handleDateFilterStep() {
      const { dateRange, currentDateFilter } = this.data;
      const currentFilterIndex = dateRange.findIndex((date: any) => date.label === currentDateFilter.label);
      const nextFilterIndex = currentFilterIndex + 1;
      const nextFilter = dateRange[nextFilterIndex] || dateRange[0];
      this.setData({ currentDateFilter: nextFilter });
    },
    onCopyChange(e: WechatMiniprogram.CustomEvent) {
      const { value } = e.detail;
      this.setData({ currentCopyIndex: value });
    },
    async addCopy() {
      const { currentTour } = this.data;
      currentTour.pullCopy();
      const copyOptions = currentTour.nodeCopyNames.map((name: string, index: number) => ({ label: name, value: index }));
      this.setData({ currentTour, copyOptions });
      await app.changeFullTour(currentTour);
    },
    handleGenerateCopyFromText() {
      this.setData({ settingsVisible: false, generatorVisible: !this.data.generatorVisible });
    },
    onGeneratorTextChange(e: WechatMiniprogram.CustomEvent) {
      const { value } = e.detail;
      this.setData({ generatorText: value });
    },
    async generateCopyFromText(needLocations: boolean = false) {
      const task = `
旅行计划的开始时间是${this.data.currentTour.startDate}(数字为时间戳),以下是我的旅行计划概述:
${this.data.generatorText}
请根据这个概述生成一个新的旅行计划,返回形如{locations:[{title:'',start:'',end:'',note:''},...]}的json格式,其中title为位置的地址文字,start和end为在这个位置的起始时间时间戳和结束时间时间戳,note为在这个位置的备注文字,locations是一个数组,每个元素都是一个位置的对象,请注意,生成的旅行计划应该是一个新的旅行计划,而不是对原始旅行计划的修改.请不要返回任何其他内容.
`;
      const res = await HttpUtil.requestStream(
        {
          url: `/llm/json`,
          jsonData: {
            task: task,
            temperature: 0.5,
            max_tokens: 3000,
          }
        },
        this, 'generatorResult'
      )
      try {
        this.setData({ generatorVisible: false });
        const resObj = JSON.parse(res.join(''));
        const { currentTour } = this.data;
        currentTour.addCopy();
        const copyOptions = currentTour.nodeCopyNames.map((name: string, index: number) => ({ label: name, value: index }));
        const copyIndex = currentTour.nodeCopyNames.length - 1;
        this.setData({ currentTour, copyOptions, currentCopyIndex: copyIndex });
        for (const location of resObj.locations) {
          currentTour.pushLocation(copyIndex);
          const newLocation = currentTour.locations[copyIndex][currentTour.locations[copyIndex].length - 1];
          const newTransportation = currentTour.transportations[copyIndex][currentTour.transportations[copyIndex].length - 1];
          newLocation.title = location.title;
          newLocation.startOffset = parseInt(location.start) - currentTour.startDate;
          newLocation.endOffset = parseInt(location.end) - currentTour.startDate;
          newTransportation.endOffset = newLocation.startOffset;
          newLocation.note = location.note;
          this.setData({ currentTour });
        }
        await app.changeFullTour(currentTour);
      } catch (err) {
        console.error('生成失败:', err);
        wx.showToast({
          title: '生成失败',
          icon: 'error',
        });
        return;
      }
      if (!needLocations) return;
    },
    async changeCopyName(e: WechatMiniprogram.CustomEvent) {
      const { value } = e.detail;
      const index = e.currentTarget.dataset.index;
      const { currentTour, copyOptions } = this.data;
      currentTour.nodeCopyNames[index] = value;
      copyOptions[index].label = value;
      this.setData({ currentTour, copyOptions });
      await app.changeFullTour(currentTour);
    },
    syncCopy() {
      const that = this;
      wx.showModal({
        title: '警告',
        content: '是否将当前行程版本同步为默认版本？',
        async success(res) {
          if (res.confirm) {
            const index = that.data.currentCopyIndex;
            const { currentTour } = that.data;
            currentTour.locations[index] = currentTour.locations[0].map((location: Location) => new Location(location));
            currentTour.transportations[index] = currentTour.transportations[0].map((transportation: Transportation) => new Transportation(transportation));
            that.setData({ currentTour });
            await app.changeFullTour(currentTour);
          }
        }
      });
    },
    pushCopy() {
      const that = this;
      wx.showModal({
        title: '警告',
        content: '是否将当前行程版本推送为默认版本？',
        async success(res) {
          if (res.confirm) {
            const index = that.data.currentCopyIndex;
            const { currentTour } = that.data;
            currentTour.locations[0] = currentTour.locations[index].map((location: Location) => new Location(location));
            currentTour.transportations[0] = currentTour.transportations[index].map((transportation: Transportation) => new Transportation(transportation));
            that.setData({ currentTour });
            await app.changeFullTour(currentTour);
          }
        }
      });
    },
    async removeCopy(e: WechatMiniprogram.CustomEvent) {
      const index = e.currentTarget.dataset.index;
      const { currentTour } = this.data;
      currentTour.removeCopy(index);
      const copyOptions = currentTour.nodeCopyNames.map((name: string, index: number) => ({ label: name, value: index }));
      this.setData({ currentTour, copyOptions, currentCopyIndex: 0 });
      await app.changeFullTour(currentTour);
    },
    async changeBudgetName(e: WechatMiniprogram.CustomEvent) {
      const { value } = e.detail;
      const index = e.currentTarget.dataset.index;
      const { currentTour } = this.data;
      currentTour.budgets[index].title = value;
      this.setData({ currentTour });
      await app.changeFullTour(currentTour);
    },
    async changeBudgetAmount(e: WechatMiniprogram.CustomEvent) {
      const { value } = e.detail;
      const index = e.currentTarget.dataset.index;
      const { currentTour } = this.data;
      currentTour.budgets[index].amount = Number(value);
      this.setData({ currentTour });
      await app.changeFullTour(currentTour);
    },
    async exchangeBudgetCurrency(e: WechatMiniprogram.CustomEvent) {
      const index = e.currentTarget.dataset.index;
      const { currentTour } = this.data;
      const currentCurrency = currentTour.budgets[index].currency;
      const nextCurrency = currentCurrency == currentTour.mainCurrency ? currentTour.subCurrency : currentTour.mainCurrency;
      currentTour.budgets[index].currency = nextCurrency;
      this.setData({ currentTour });
      await app.changeFullTour(currentTour);
    },
    showTourReport() {
      wx.navigateTo({
        url: `/pages/report/report?tourId=${this.data.currentTourId}&currentTourCopyIndex=${this.data.currentCopyIndex}&showUserReport=${this.data.showUserReport}`
      })
    }
  }
})