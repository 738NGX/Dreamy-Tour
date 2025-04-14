/**
 * 频道足迹界面，展示频道足迹
 * 1.地图可视化展示各行程的所在地
 * 2.进行行程日期筛选展示
 * 3.频道成员旅行次数排行
 */

import {
  CDN_PATH,
  PLUGIN_KEY
} from '../../../config/appConfig';
if (PLUGIN_KEY) {
  const QQMapWX = require('../../../components/qqmap-wx-jssdk');
  const qqmapsdk = new QQMapWX({
    key: PLUGIN_KEY // 必填
  });
  qqmapsdk
}
import { UserRanking } from '../../../utils/channel/userRanking';
import { FootPrint } from '../../../utils/tour/footprint';
import { Photo } from '../../../utils/tour/photo';
import { timezoneList } from '../../../utils/tour/timezone';
import { Tour } from '../../../utils/tour/tour';
import { formatDate, formatTime, MILLISECONDS } from "../../../utils/util";

const app = getApp<IAppOption>();

type Marker = {
  id: number;
  latitude: number;
  longitude: number;
  iconPath: string;
  width: number;
  height: number;
  info: MarkerInfo;
}

type MarkerInfo = {
  tourTitle: string;
  locationTitle: string;
  timeValue: number;
  time: string;
  timezone: string;
  photos: Photo[];
}

Component({
  properties: {
    currentChannel: {
      type: Object,
      value: {},
    },
    selectedUserId: {
      type: Number,
      value: -1,
      observer: function () {
        this.onRefresh()
      }
    }
  },

  data: {
    tourSaves: [] as Tour[],
    fullFootprints: [] as FootPrint[],
    fullMarkers: [] as Marker[],
    footprints: [] as FootPrint[],
    markers: [] as Marker[],
    photoSwiperList: [] as Marker[],

    filterVisible: false,
    filterDate: [0, 0],
    filterDateStr: ['', ''],
    filterMinDate: 0,
    filterMaxDate: 0,

    rankingVisible: false,

    markerDetailVisible: false,
    currentPhotoIndex: 0,
    selectingMarkerInfo: {
      tourTitle: '',
      locationTitle: '',
      time: '',
      timezone: '',
    } as MarkerInfo,

    userRankings: [] as UserRanking[],
  },

  lifetimes: {
    async ready() {
      await this.onRefresh();
    },
  },

  methods: {
    async onRefresh() {
      await this.generateTourSaves();
      this.generateFullFootprints();
      this.generateFullMarkers();
      await this.generateUserRankings();
    },
    async generateTourSaves() {
      if (this.properties.selectedUserId >= 0) {
        const tourSaves = await app.generateTourSaves(this.properties.selectedUserId, true);
        this.setData({ tourSaves: tourSaves });
      } else {
        if (!this.properties.currentChannel) return;
        const tourSaves = await app.generateTourSaves(this.properties.currentChannel.id, false);
        this.setData({ tourSaves: tourSaves });
      }
    },
    generateFullFootprints() {
      const footprints = this.data.tourSaves.map(tour => {
        return {
          id: tour.id,
          title: tour.title,
          startDate: tour.startDate,
          endDate: tour.endDate,
          startDateStr: formatDate(tour.startDate),
          endDateStr: formatDate(tour.endDate),
          users: tour.users
        }
      });
      let filterMinDate = new Date().getTime();
      let filterMaxDate = new Date().getTime() + MILLISECONDS.DAY;
      if (footprints.length > 0) {
        filterMinDate = footprints[footprints.length - 1].startDate;
        filterMaxDate = footprints[0].endDate;
      }
      this.setData({
        fullFootprints: footprints,
        footprints: footprints,
        filterMinDate: filterMinDate,
        filterMaxDate: filterMaxDate,
        filterDate: [filterMinDate, filterMaxDate],
        filterDateStr: [formatDate(filterMinDate), formatDate(filterMaxDate)],
      });
    },
    generateFullMarkers() {
      const markers = this.data.tourSaves.reduce((acc: Marker[], tour) => {
        tour.locations.forEach((copy) => copy.forEach((location) => {
          if (location.photos.length > 0) {
            acc.push({
              id: tour.id * 1000000 + tour.locations.indexOf(copy) * 10000 + location.index,
              latitude: location.latitude,
              longitude: location.longitude,
              iconPath: `${CDN_PATH}/Marker1_Activated@3x.png`,
              width: 30,
              height: 30,
              info: {
                tourTitle: tour.title,
                locationTitle: location.title,
                timeValue: tour.startDate + location.startOffset,
                time: formatTime(tour.startDate + location.startOffset, location.timeOffset),
                timezone: timezoneList.find(timezone => timezone.value == location.timeOffset)?.label ?? '未知时区',
                photos: location.photos,
              }
            });
          }
        }));
        return acc;
      }, []);
      this.setData({ fullMarkers: markers, markers: markers });
    },
    async generateUserRankings() {
      if (this.properties.selectedUserId >= 0) return;
      if (!this.properties.currentChannel) return;
      const rankList = await app.generateUserRankings(this.properties.currentChannel.id, this.data.footprints);
      this.setData({ userRankings: rankList });
    },
    onRankingVisibleChange() {
      this.setData({
        rankingVisible: !this.data.rankingVisible,
      });
    },
    onMarkerDetailVisibleChange(e: WechatMiniprogram.CustomEvent) {
      let id = e.detail.markerId;
      if (id === undefined) { id = -1; }
      this.setData({
        markerDetailVisible: !this.data.markerDetailVisible,
      });
      if (id != -1) {
        this.setData({
          currentPhotoIndex: 0,
          selectingMarkerInfo: this.data.markers.find((marker) => marker.id == id)?.info ?? {} as MarkerInfo,
        });
      }
    },
    filterFootprints() {
      const fullFootprints = this.data.fullFootprints;
      const filterDate = this.data.filterDate;
      const footprints = fullFootprints.filter(footprint => {
        return footprint.startDate <= filterDate[1] && footprint.endDate >= filterDate[0];
      });
      this.setData({ footprints: footprints });
    },
    filterMarkers() {
      const fullMarkers = this.data.fullMarkers;
      const filterDate = this.data.filterDate;
      const markers = fullMarkers.filter(marker => {
        return marker.info.timeValue <= filterDate[1] && marker.info.timeValue >= filterDate[0];
      });
      this.setData({ markers: markers });
    },
    handleFilter() {
      this.setData({ filterVisible: !this.data.filterVisible });
    },
    handleFilterConfirm(e: WechatMiniprogram.CustomEvent) {
      const filterDate = e.detail.value;
      if (!filterDate[0] || !filterDate[1]) return;
      this.setData({
        filterDate: filterDate,
        filterDateStr: [formatDate(filterDate[0]), formatDate(filterDate[1])],
      });
      this.filterFootprints();
      this.filterMarkers();
      this.generateUserRankings();
    },
    clearFilter() {
      this.setData({
        filterDate: [this.data.filterMinDate, this.data.filterMaxDate],
        filterDateStr: [formatDate(this.data.filterMinDate), formatDate(this.data.filterMaxDate)],
      });
      this.filterFootprints();
      this.filterMarkers();
      this.generateUserRankings();
    },
    handleTourView(e: WechatMiniprogram.CustomEvent) {
      const tourId = e.currentTarget.dataset.index;
      wx.navigateTo({
        url: `/pages/tour-view/tour-view?tourId=${tourId}`,
      });
    }
  }
});
