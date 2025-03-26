import { UserBasic } from "../../utils/user/user";
import { getUserGroupName, userExpTarget } from "../../utils/util";

const app = getApp<IAppOption>();

Component({
  properties: {

  },
  data: {
    testUserList: app.getUserListCopy(),
    currentUser: {} as UserBasic,
    userGroup: '',
    expPercentage: 0,
    expLabel: '',
  },
  methods: {
    onShow() {
      this.setData({
        currentUser: app.currentUser(),
      });
      this.caluculateExp();
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        const page: any = getCurrentPages().pop();
        this.getTabBar().setData({
          value: '/' + page.route
        })
      }
    },
    changeTestUser(e: any) {
      const userId = e.currentTarget.dataset.index;
      const user = app.getUser(userId);
      if (user) {
        app.globalData.currentUserId = userId;
        this.setData({
          currentUser: user
        })
        this.caluculateExp();
      }
    },
    caluculateExp() {
      const exp = this.data.currentUser.exp;
      const userGroup = getUserGroupName(this.data.currentUser);
      const target = userGroup == '系统管理员' ? 1 : userExpTarget[userGroup];
      this.setData({
        userGroup,
        expPercentage: Math.min(100, exp / target * 100),
        expLabel: `${exp}/${target}`
      })
    },
    signIn(){
      const user = app.currentUser();
      user.exp += 10;
      this.setData({
        currentUser: user
      })
      app.updateUser(user);
      this.caluculateExp();
    }
  }
})