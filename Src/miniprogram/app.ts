import { testData } from "./utils/testData";
import { Tour } from "./utils/tour/tour";

// app.ts
App<IAppOption>({
  globalData: {
    selectingTour: false,
    currentTour: null,
    tourList: [] as { id: number; title: string; startDate: string; endDate: string; }[],
    currentUserId: 1,
    currentData: testData,
  },
  onLaunch() {

  },
  watch: function (variate: any, method: any) {
    var obj = getApp().globalData;
    let val = obj[variate];
    Object.defineProperty(obj, variate, {
      set: function (value) {
        val = value;
        method(variate, value);
      },
      get: function () {
        return val;
      }
    })
  },
  updateTour(tour: Tour) {
    const tourList = this.globalData.currentData.tourList;
    const index = tourList.findIndex((item: any) => item.id == tour.id);
    if (index === -1) {
      console.error('Tour not found');
      return;
    } else {
      tourList[index] = tour;
    }
    this.globalData.tourList = tourList;
  }
})