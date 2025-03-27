import { UserBasic } from "../../utils/user/user";
import { getUserGroupName, userExpTarget } from "../../utils/util";

const app = getApp<IAppOption>();

Component({
  properties: {

  },
  data: {
    isTestMode: app.globalData.testMode,
    testUserList: [] as UserBasic[],
    currentUser: {} as UserBasic,
    userGroup: '',
    expPercentage: 0,
    expLabel: '',
  },
  methods: {
    onShow() {
      this.setData({
        currentUser: app.currentUser(),
        testUserList: app.getUserListCopy()
      });
      this.caluculateExp();
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        const page: any = getCurrentPages().pop();
        this.getTabBar().setData({
          value: '/' + page.route
        })
      }
    },
    copyUid() {
      wx.setClipboardData({
        data: this.data.currentUser.id.toString(),
        success() {
          wx.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 1000
          })
        }
      })
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
    async signIn() {
      const { currentUser } = this.data;
      currentUser.exp += 10;
      this.setData({
        currentUser: currentUser
      })
      await app.changeUserBasic(currentUser);
      this.caluculateExp();
    },
    handleNickNameChange(e: WechatMiniprogram.CustomEvent) {
      const { currentUser } = this.data;
      currentUser.name = e.detail.value;
      this.setData({ currentUser })
    },
    handleGenderChange(e: WechatMiniprogram.CustomEvent) {
      const { currentUser } = this.data;
      currentUser.gender = e.detail.value;
      this.setData({ currentUser })
    },
    handleSignatureChange(e: WechatMiniprogram.CustomEvent) {
      const { currentUser } = this.data;
      currentUser.signature = e.detail.value;
      this.setData({ currentUser })
    },
    async handleUserBasicChange() {
      const { currentUser } = this.data;
      this.setData({ currentUser })
      await app.changeUserBasic(currentUser);
      if(this.data.isTestMode) {
        this.setData({
          testUserList: app.getUserListCopy()
        })
      }
    },
    async handleUserBasicReset() {
      this.setData({
        currentUser: app.currentUser(),
      });
    },
    uploadAvater() {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          const src = res.tempFilePaths[0]
          wx.navigateTo({
            url: `../upload-avatar/upload-avatar?src=${src}`
          })
        }
      })
    },
    copyInfo(e: WechatMiniprogram.CustomEvent){
      const index = parseInt(e.currentTarget.dataset.index);
      const linkList = [
        'https://github.com/738NGX/Dreamy-Tour',
        'https://github.com/738NGX',
        'https://github.com/Franctoryer',
        'https://github.com/Choihyobin111'
      ]
      wx.setClipboardData({
        data: linkList[index],
        success() {
          wx.showToast({
            title: index ? '已复制主页链接' : '已复制仓库链接',
            icon: 'success',
            duration: 1000
          })
        }
      })
    },
    quitLogin() {
      wx.showModal({
        title: '提示',
        content: '确定退出登录？',
        success(res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '/pages/login/login'
            })
          }
        }
      })
    }
  }
})