/**
 * 此组件为主页-行程列表
 * 负责：
 * 选中行程
 * 删除行程
 * 展示行程（tourlist）
 * 页面刷新时，自动调用函数从wxstorage的tourhashmap进行数据更新
 */
import { Tour } from '../../../utils/tour/tour';
import { formatDate } from '../../../utils/util';

const app = getApp<IAppOption>();

Component({
  behaviors: [],
  pageLifetimes: {
    show() {
      // console.log('index-tourlist pageLifetimes.show 被触发');
      // index页面显示时，刷新组件数据
      this.refreshData();
    },
  },
  properties: {

  },
  data: {
    //存储展示的信息
      tourList: [] as { id: number; title: string; startDate: string; endDate: string; }[],
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
        /**
         * refreshData()
         * 更新组件展示信息，在页面显示时调用
         */
        refreshData(){
          this.updateTourHashMap().then(() => {
          this.updateTourList();
          console.log("currenttourlist:",app.globalData.tourList)
          })
        },
        /**
         * updateTourHashMap()
         * 同步更新组件内tourhashmap
         */
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
        /**
         * selectTour(e: any)
         * @param e 
         * 选中组件并存储到app.globalData,等待edit调用
         */

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
        /**
         * removeTour(e: any)
         * @param e 
         * 将当前行程从globalData中删除，从wxstorage中移除
         */ 
        removeTour(e: any) {
            const id = e.currentTarget.dataset.index;
            const tourHashMap = this.data.tourHashMap;

            if (app.globalData.currentTour && app.globalData.currentTour.id == id) {
                app.globalData.selectingTour = false;
                app.globalData.currentTour = null;
            }

            tourHashMap.delete(id);
            this.setData({ tourHashMap: tourHashMap });
            wx.setStorage({
                key: 'tourHashMap',
                data: Array.from(tourHashMap),
               });
               this.setData({ 
                 tourHashMap,

               });

            wx.removeStorageSync('tour-' + id);

            this.updateTourList();
        },
        /**
         * updateTourList()
         * 在tourhashmap变更后调用
         * //从tourhashmap更新tourlist，返回给appglobaldata，并触发index-containstour的更新
         */

        updateTourList() {
            const tourHashMap = this.data.tourHashMap;

            if (tourHashMap.size == 0 || tourHashMap.size == null) {
              this.setData({ tourList: [] });
              app.globalData.tourList = [];
              // console.log("tourhashmap内容为空")
              this.triggerEvent('containsTourUpdate');
              return;
            };
            const tourList = [] as any[];
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
                this.triggerEvent('containsTourUpdate');
            }).catch((err) => {
                console.error('读取 tour 数据时出错: ', err);
            });
        },
  },
});