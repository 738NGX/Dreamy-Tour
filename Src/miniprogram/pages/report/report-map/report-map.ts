import { Reporter } from '../../../utils/reporter';
import { Tour } from '../../../utils/tour/tour';
import { currencyList } from '../../../utils/tour/expense'

const app = getApp<IAppOption>();

Component({
  behaviors: [],
  pageLifetimes: {
    show() {
      // 页面显示时，刷新组件数据
      this.initMap();
    },
  },
  properties: {

  },
  data: {
    markerDetailVisible: false,
    selectingMarkerId: 0,
    reporter: null as Reporter | null,
    activeCollapses: [[], [], [], [], [], []],
  },
  lifetimes: {
    created() {

    },
    attached() {
      console.log("加载地图")
      this.initMap()
    },
    ready(){
      
    },
    moved() {

    },
    detached() {

    },
  },
  methods: {
      onShow() {
        this.initMap()
      },
      initMap(){
        if (app.globalData.currentTour) {
          const currentTour = new Tour(app.globalData.currentTour);
          const reporter = new Reporter(currentTour);

          this.setData({
            reporter: reporter,
          });
          console.log("locations:",reporter.tourData.locations)
        } else {
          this.setData({
            reporter: null,
          });
        }
      },
      onMarkerDetailVisibleChange(e: any) {
        let id = e.detail.markerId;
        if (id === undefined) { id = -1; }
        this.setData({
            markerDetailVisible: !this.data.markerDetailVisible,
            selectingMarkerId: id,
        });
      },
      handleCollapsesChange(e: any) {
        this.setData({
            activeCollapses: {
                ...this.data.activeCollapses,
                [e.currentTarget.dataset.index]: e.detail.value
            }
        });
    },
    },
});

//       <report-map style="height:100%"></report-map>