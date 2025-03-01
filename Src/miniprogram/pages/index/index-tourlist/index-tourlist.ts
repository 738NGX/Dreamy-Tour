import { Tour } from '../../../utils/tour';
import { formatDate } from '../../../utils/util';

const app = getApp<IAppOption>();

Component({
  behaviors: [],
  pageLifetimes: {
    show() {
      console.log('index-tourlist pageLifetimes.show 被触发');
      // 页面显示时刷新数据
      this.refreshData();
    },
  },
  properties: {

  },
  data: {
    //存储展示的信息
      tourList: [] as { id: number; title: string; startDate: string; endDate: string; }[],
      containsTour: false,
      tourHashMap: new Map(),
    },
  lifetimes: {
    created() {

    },
    attached() {
      this.refreshData();
    },
    moved() {

    },
    detached() {

    },
  },
  methods: {
        //更新组件展示信息
        refreshData(){
          this.updateTourHashMap();
          console.log("currenttourlist:",app.globalData.tourList)
          this.setData({ tourList: app.globalData.tourList });
        },
        //同步更新组件内tourhashmap
        updateTourHashMap() {
          return new Promise((resolve, reject) => {
              wx.getStorage({
                  key: 'tourHashMap',
                  success: (res) => {
                      this.setData({ tourHashMap: new Map(res.data) });
                      resolve(true);
                  },
                  fail: (err) => {
                      this.setData({ tourHashMap: new Map() }); // 初始化为空 Map
                      reject(err);
                  },
              });
          });
        },
        selectTour(e: any) {
            const id = e.currentTarget.dataset.index;
            wx.getStorage({
                key: 'tour-' + id,
                success: (res) => {
                    app.globalData.selectingTour = true;
                    app.globalData.currentTour = res.data as Tour;
                },
            })
        },
        removeTour(e: any) {
            const id = e.currentTarget.dataset.index;
            const tourHashMap = this.data.tourHashMap;

            if (app.globalData.currentTour && app.globalData.currentTour.id == id) {
                app.globalData.selectingTour = false;
                app.globalData.currentTour = null;
            }

            tourHashMap.delete(id);

            if (tourHashMap.size == 0) {
                this.setData({ containsTour: false });
            }

            this.setData({ tourHashMap: tourHashMap });

            wx.setStorage({
                key: 'tourHashMap',
                data: Array.from(tourHashMap),
               });
               const newContainsTour = tourHashMap.size > 0;
               this.setData({ 
                 tourHashMap,
                 containsTour: newContainsTour
               });
               wx.setStorage({
                 key: 'containsTour',
                 data: newContainsTour,
               });
            wx.removeStorageSync('tour-' + id);

            this.updateTourList();
        },
        //将更新后的tourlist返回到wxstorage并触发index的更新
        updateTourList() {
            const tourHashMap = this.data.tourHashMap;

            if (tourHashMap.size == 0 || tourHashMap.size == null) {
              this.setData({ tourList: [], containsTour: false });
              app.globalData.tourList = [];
              console.log("hashmap内容为空")
              this.triggerEvent('tourListUpdate');
              return;
            };
            const tourList = [] as any[];
            console.log("tourhashmapsize:",tourHashMap.size)
            const promises = Array.from(tourHashMap.values()).map(tour_id => {
                return new Promise((resolve, reject) => {
                    wx.getStorage({
                        key: tour_id,
                        success: (res) => {
                            const tour = res.data as Tour;
                            tourList.push({
                                id: tour.id,
                                title: tour.title,
                                startDate: formatDate(tour.startDate),
                                endDate: formatDate(tour.endDate),
                            });
                            resolve(true);
                        },
                        fail: (err) => {
                            reject(err);
                        }
                    });
                });
            });

            Promise.all(promises).then(() => {
                this.setData({
                    tourList: tourList,
                });
                app.globalData.tourList = tourList;
                this.triggerEvent('tourListUpdate');
            }).catch((err) => {
                console.error('读取 tour 数据时出错: ', err);
            });
        },
  },
});