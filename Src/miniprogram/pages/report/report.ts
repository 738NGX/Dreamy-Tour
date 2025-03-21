import { Tour } from "../../utils/tour/tour";

const app = getApp<IAppOption>();

Component({
  behaviors: [],
  properties: {

  },
  data: {
    tabList: [
      { icon: 'list', label: '群组报告', value: 0 },
      { icon: 'map-add', label: '个人报告', value: 1 },
    ],

    // 页面状态
    childPage: 0,
    currentTour : null as Tour | null,

    currentTourCopyIndex : 0,

    currentUserId: 0,

  },
  lifetimes: {
    created() {

    },
    attached() {
    },
    moved() {

    },
    detached() {

    },
  },
  methods: {
    onLoad(options:any){
      const tourId = options.tourId;
        const currentTourCopyIndex = options.currentTourCopyIndex
        this.setData({
          currentTour: app.getTour(parseInt(tourId)) as Tour,
          currentTourCopyIndex: currentTourCopyIndex
        })
        console.log("currenttourinreport",this.data.currentTour)
    },
    onChildPageChange(e: any) {
      this.setData({ childPage: e.detail.value })
  },

  },
});