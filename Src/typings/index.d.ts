/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    selectingTour: boolean;
    currentTour: any;
    tourList: any;
    currentUserId: number;
    currentData: any;
  },
  updateTour(tour: any): void;
}