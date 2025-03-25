import { UserBasic } from "../../utils/user/user";

const app = getApp<IAppOption>();

Component({
  properties: {

  },
  data: {
    currentUser: {} as UserBasic,
  },
  methods: {
    onShow() {
      this.setData({
        currentUser: app.currentUser(),
      })
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        const page: any = getCurrentPages().pop();
        this.getTabBar().setData({
          value: '/' + page.route
        })
      }
    }
  }
})