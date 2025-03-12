/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    selectingTour: boolean;
    currentTour: any;
    tourList: any;
    currentUserId: number;
    currentData: any;
  },
  watch(variate: any, method: any): void;
  updateTour(tour: any): void;
}