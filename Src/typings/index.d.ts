/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    selectingTour: boolean;
    currentTour: any;
    tourList: any;
    currentUserId: number;
    currentData: any;
  },
  getData(dataId: any, dataList: any[]): any;
  addData(data: any, dataList: any[]): any[];
  updateData(data: any, dataList: any[]): any[];
  removeData(data: any, dataList: any[]): any[];
  getUser(userId: number): any;
  getTour(tourId: number): any;
  getGroup(groupId: number): any;
  getChannel(channelId: number): any;
  addUser(user: any): void;
  addTour(tour: any): void;
  addGroup(group: any): void;
  addChannel(channel: any): void;
  updateUser(user: any): void;
  updateTour(tour: any): void;
  updateGroup(group: any): void;
  updateChannel(channel: any): void;
  removeUser(user: any): void;
  removeTour(tour: any): void;
  removeGroup(group: any): void;
  removeChannel(channel: any): void;
}