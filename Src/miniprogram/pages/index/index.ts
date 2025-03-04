/**
 * 此文件为主页的页面文件
 * 用于处理加载子页面的逻辑
 */
Component({
    data: {
        // 页面显示内容
        tabList: [
            { icon: 'list', label: '行程列表', value: 0 },
            { icon: 'map-add', label: '新建行程', value: 1 },
        ],
      
        tourList: [] as { id: number; title: string; startDate: string; endDate: string; }[],

        // 页面状态
        childPage: 0,

        // 数据缓存
        containsTour: false,
        tourHashMap: new Map(),
    },
    methods: {
        onLoad() {
          wx.request({
            url: 'https://www.mastercard.com.cn/settlement/currencyrate/conversion-rate',
            method: 'GET',
            success: (res) => {
              console.log(res.data);
            }
          })
            this.setData({
                tourHashMap: new Map<number, string>(),
            });
            this.loadTourHashMap();
        },
        onShow() {
            //console.log("index-onShow触发,containsTour:",this.data.containsTour)
            //页面展示时调用refreshData刷新子组件index-tourlist的数据，使数据更新后tourList正常显示
            const tourListComponent = this.selectComponent('#index-tourlist');
            if (tourListComponent) {
            tourListComponent.refreshData();
            }
            //tabbar路由定向
            if (typeof this.getTabBar === 'function' && this.getTabBar()) {
                const page: any = getCurrentPages().pop();
                this.getTabBar().setData({ value: '/' + page.route })
            }
            //加载hashmap，刷新containsTour
            this.loadTourHashMap();
        },
        /**
         * loadTourHashMap()
         * 从缓存中加载旅程的hashmap，并更新containsTour
         */
        loadTourHashMap() {
            wx.getStorage({
                key: 'tourHashMap',
                success: (res) => {
                    const tourHashMap = new Map(res.data || []);
                    //console.log("tourhashmapsize:",tourHashMap.size)
                    this.setData({ 
                        containsTour: tourHashMap.size > 0
                    });
                    //console.log("Page-index loaded,containstour:", this.data.containsTour);
                },
                fail: () => {
                   console.log("Page-index:tourHashMap load failed")
                }
            });
        },
        /**
         *  onTourListUpdate()
         *  接收子组件更改信息后的触发器，调用loadTourHashMap更新containsTour刷新页面
         */

        onContainsTourUpdate(){
            //console.log("index-containsTourUpdate触发")
            this.loadTourHashMap();  //更新containsTour
        },
        onChildPageChange(e: any) {
            this.setData({ childPage: e.detail.value })
        },
    },
})
