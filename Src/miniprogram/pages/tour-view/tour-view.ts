import { testData } from "../../utils/testData";

// pages/tour-view/tour-view.ts
Component({
  data: {
    currentTour: {} as any,
    dateRange: [] as any[],
    currentDateFilter: { label: "全部", value: [0, 0, 0] } as any
  },
  methods: {
    onLoad(options: any) {
      const { tourId } = options;
      const currentTour = testData.tourList.find(tour => tour.id == tourId);
      const dateRange = this.getDateRange(currentTour!.startDate, currentTour!.endDate);
      this.setData({ currentTour, dateRange });
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
    handleDateFilterStep() {
      const { dateRange, currentDateFilter } = this.data;
      const currentFilterIndex = dateRange.findIndex((date: any) => date.label === currentDateFilter.label);
      const nextFilterIndex = currentFilterIndex + 1;
      const nextFilter = dateRange[nextFilterIndex] || dateRange[0];
      this.setData({ currentDateFilter: nextFilter });
    }
  }
})