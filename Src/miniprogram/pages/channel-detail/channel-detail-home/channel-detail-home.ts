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
import { Channel } from "../../../utils/channel/channel";
import { timezoneList } from '../../../utils/tour/timezone';
import { Tour, TourStatus } from '../../../utils/tour/tour';
import { Location } from '../../../utils/tour/tourNode';
import { User } from '../../../utils/user/user';
import { formatDate, formatTime, MILLISECONDS } from "../../../utils/util";

const app = getApp<IAppOption>();

Component({
  properties: {
    currentChannel: {
      type: Object,
      value: {},
    },
  },

  data: {
    tourSaves: [] as any[],
    fullFootprints: [] as any[],
    fullMarkers: [] as any[],
    footprints: [] as any[],
    markers: [] as any[],
    photoSwiperList: [] as any[],

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
    } as any,

    userRankings: [] as any[],
  },

  lifetimes: {
    ready() {
      this.generateTourSaves();
      this.generateFullFootprints();
      this.generateFullMarkers();
      this.generateUserRankings();
    },
  },

  methods: {
    generateTourSaves() {
      const currentChannel = this.properties.currentChannel as Channel;
      const tourSaves = (app.globalData.currentData.tourList as unknown as Tour[])
        .map(tour => new Tour(tour))
        .filter(tour => tour.linkedChannel == currentChannel.id && tour.status == TourStatus.Finished && tour.channelVisible)
        .sort((a: any, b: any) => b.startDate - a.startDate);
      this.setData({ tourSaves: tourSaves });
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
      const markers = this.data.tourSaves.reduce((acc: any[], tour) => {
        tour.locations.forEach((copy: Location[]) => copy.forEach((location: Location) => {
          if (location.photos.length > 0) {
            acc.push({
              id: tour.id * 1000000 + copy.indexOf(location) * 10000 + location.index,
              latitude: location.latitude,
              longitude: location.longitude,
              iconPath: `${CDN_PATH}/Marker1_Activated@3x.png`,
              width: 30,
              height: 30,
              info: {
                tourTitle: tour.title,
                locationTitle: location.title,
                time: formatTime(tour.startDate + location.startOffset, location.timeOffset),
                timezone: timezoneList.find(timezone => timezone.value == location.timeOffset)?.label,
              }
            });
          }
        }));
        return acc;
      }, []);
      this.setData({ fullMarkers: markers, markers: markers });
    },
    generateUserRankings() {
      const userTourCount: Map<number, number> = new Map();

      this.data.footprints.forEach(tour => {
        tour.users.forEach((userId: any) => {
          userTourCount.set(userId, (userTourCount.get(userId) || 0) + 1);
        });
      });
      const rankList = app.globalData.currentData.userList.map((user: User) => {
        const count = userTourCount.get(user.id) || 0;
        return { rank: 0, name: user.name, count };
      }).filter((user: any) => user.count > 0);
      rankList.sort((a: any, b: any) => b.count - a.count);
      rankList.forEach((user: any, index: any) => {
        user.rank = index + 1;
      });
      this.setData({ userRankings: rankList });
    },
    onRankingVisibleChange() {
      this.setData({
        rankingVisible: !this.data.rankingVisible,
      });
    },
    onMarkerDetailVisibleChange(e: any) {
      let id = e.detail.markerId;
      if (id === undefined) { id = -1; }
      this.setData({
        markerDetailVisible: !this.data.markerDetailVisible,
      });
      if (id != -1) {
        this.setData({
          currentPhotoIndex: 0,
          photoSwiperList: this.data.tourSaves.find(
            (tour: any) => tour.id == Math.floor(id / 1000000))?.locations.find(
              (location: any) => location[Math.floor(id % 1000000 / 10000)].index == id % 10000)?.photos ?? [],
          selectingMarkerInfo: this.data.markers.find((marker: any) => marker.id == id)?.info ?? {},
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
        const tourId = Math.floor(marker.id / 10000);
        const locationIndex = marker.id % 10000;
        const tour = this.data.tourSaves.find((tour: any) => tour.id == tourId);
        const location = tour?.locations.find((location: any) => location.index == locationIndex);
        return tour?.startDate + location?.startOffset <= filterDate[1] && tour?.endDate + location?.endOffset >= filterDate[0];
      });
      this.setData({ markers: markers });
    },
    handleFilter() {
      this.setData({ filterVisible: true });
    },
    handleFilterConfirm(e: any) {
      const filterDate = e.detail.value;
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
    handleTourView(e: any) {
      const tourId = e.currentTarget.dataset.index;
      wx.navigateTo({
        url: `/pages/tour-view/tour-view?tourId=${tourId}`,
      });
    }
  }
});
