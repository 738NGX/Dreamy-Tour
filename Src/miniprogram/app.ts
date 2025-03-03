// app.ts
App<IAppOption>({
  globalData: {
    selectingTour: false,
    currentTour: null,
    tourList: [] as { id: number; title: string; startDate: string; endDate: string; }[],
    currentUserId: 1,
  },
  onLaunch() {

  },
})