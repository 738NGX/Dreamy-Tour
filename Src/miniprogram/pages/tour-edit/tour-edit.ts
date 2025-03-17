import { budgetList, currencyList } from "../../utils/tour/expense";
import { Tour } from "../../utils/tour/tour";
import { Location, Transportation } from "../../utils/tour/tourNode";

const app = getApp<IAppOption>();

Component({
  data: {
    budgetList: budgetList,
    currencyList: currencyList,

    currentTour: {} as Tour,

    settingsVisible: false,

    dateRange: [] as any[],
    currentDateFilter: { label: "全部", value: [0, 0, 0] } as any,

    copyOptions: [] as any[],
    currentCopyIndex: 0,

    currentChildPage: 0,
  },
  methods: {
    onLoad(options: any) {
      const { tourId } = options;
      const currentTour = app.getTour(parseInt(tourId)) as Tour;
      const dateRange = this.getDateRange(currentTour!.startDate, currentTour!.endDate);
      const copyOptions = currentTour.nodeCopyNames.map((name: string, index: number) => ({ label: name, value: index }));
      this.setData({ currentTour, dateRange, copyOptions });
    },
    handleCurrentTourChange(e: any) {
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
    onCopyChange(e: any) {
      const { value } = e.detail;
      this.setData({ currentCopyIndex: value });
    },
    addCopy() {
      const { currentTour } = this.data;
      currentTour.addCopy();
      const copyOptions = currentTour.nodeCopyNames.map((name: string, index: number) => ({ label: name, value: index }));
      this.setData({ currentTour, copyOptions });
      app.updateTour(currentTour);
    },
    changeCopyName(e: any) {
      const { value } = e.detail;
      const index = e.currentTarget.dataset.index;
      const { currentTour, copyOptions } = this.data;
      currentTour.nodeCopyNames[index] = value;
      copyOptions[index].label = value;
      this.setData({ currentTour, copyOptions });
      app.updateTour(currentTour);
    },
    syncCopy() {
      const that = this;
      wx.showModal({
        title: '警告',
        content: '是否将当前行程版本同步为默认版本？',
        success(res) {
          if (res.confirm) {
            const index = that.data.currentCopyIndex;
            const { currentTour } = that.data;
            currentTour.locations[index] = currentTour.locations[0].map((location: Location) => new Location(location));
            currentTour.transportations[index] = currentTour.transportations[0].map((transportation: Transportation) => new Transportation(transportation));
            that.setData({ currentTour });
            app.updateTour(currentTour);
          }
        }
      });
    },
    removeCopy(e: any) {
      const index = e.currentTarget.dataset.index;
      const { currentTour } = this.data;
      currentTour.removeCopy(index);
      const copyOptions = currentTour.nodeCopyNames.map((name: string, index: number) => ({ label: name, value: index }));
      this.setData({ currentTour, copyOptions, currentCopyIndex: 0 });
      app.updateTour(currentTour);
    },
    changeBudgetName(e: any) {
      const { value } = e.detail;
      const index = e.currentTarget.dataset.index;
      const { currentTour } = this.data;
      currentTour.budgets[index].title = value;
      this.setData({ currentTour });
      app.updateTour(currentTour);
    },
    changeBudgetAmount(e: any) {
      const { value } = e.detail;
      const index = e.currentTarget.dataset.index;
      const { currentTour } = this.data;
      currentTour.budgets[index].amount = Number(value);
      this.setData({ currentTour });
      app.updateTour(currentTour);
    },
    exchangeBudgetCurrency(e: any) {
      const index = e.currentTarget.dataset.index;
      const { currentTour } = this.data;
      const currentCurrency = currentTour.budgets[index].currency;
      const nextCurrency = currentCurrency == currentTour.mainCurrency ? currentTour.subCurrency : currentTour.mainCurrency;
      currentTour.budgets[index].currency = nextCurrency;
      this.setData({ currentTour });
      app.updateTour(currentTour);
    },

    handleChildPageChange(){
      const currentChildPage = this.data.currentChildPage;
      if(currentChildPage === 0){
        this.setData({
          currentChildPage: 1,
        })
      }
      else { 
        this.setData({
          currentChildPage: 0,
        })
      }
    }
  }
})