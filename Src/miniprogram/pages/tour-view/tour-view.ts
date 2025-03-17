import { budgetList, currencyList } from "../../utils/tour/expense";
import { Tour } from "../../utils/tour/tour";

const app = getApp<IAppOption>();

Component({
  data: {
    budgetList: budgetList,
    currencyList: currencyList,

    currentTour: {} as any,

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
      const currentTour = new Tour(app.globalData.currentData.tourList.find((tour: any) => tour.id == tourId));
      const dateRange = this.getDateRange(currentTour!.startDate, currentTour!.endDate);
      const copyOptions = currentTour.nodeCopyNames.map((name: string, index: number) => ({ label: name, value: index }));
      this.setData({ currentTour, dateRange, copyOptions });
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
    onCopyChange(event: any) {
      const { value } = event.detail;
      this.setData({ currentCopyIndex: value });
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