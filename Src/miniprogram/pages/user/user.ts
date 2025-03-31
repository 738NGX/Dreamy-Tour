import { UserBasic } from "../../utils/user/user";
import { getByteLength, getImageBase64, getUserGroupName, userExpTarget, userRoleName } from "../../utils/util";

const app = getApp<IAppOption>();

Component({
  properties: {

  },
  data: {
    isTestMode: false,
    isDarkMode: wx.getSystemInfoSync().theme == 'dark',
    testUserList: [] as UserBasic[],
    userRoleList: userRoleName,
    currentUser: {} as UserBasic,
    userGroup: '',
    expPercentage: 0,
    expLabel: '',
  },
  methods: {
    onLoad() {
      wx.onThemeChange((res) => {
        this.setData({
          isDarkMode: res.theme == 'dark'
        });
        console.log('当前主题：', res.theme)
      });
    },
    async onShow() {
      this.setData({
        isTestMode: app.globalData.testMode,
        currentUser: await app.getCurrentUser(),
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
    async changeUserRole(e: WechatMiniprogram.CustomEvent) {
      const role = e.currentTarget.dataset.index;
      await app.privilege(role);
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
    handleBirthdayChange(e: WechatMiniprogram.CustomEvent) {
      const { currentUser } = this.data;
      currentUser.birthday = e.detail.value;
      this.setData({ currentUser })
    },
    handlePhoneChange(e: WechatMiniprogram.CustomEvent) {
      const { currentUser } = this.data;
      currentUser.phone = e.detail.value;
      this.setData({ currentUser })
    },
    handleEmailChange(e: WechatMiniprogram.CustomEvent) {
      const { currentUser } = this.data;
      currentUser.email = e.detail.value;
      this.setData({ currentUser })
    },
    async handleUserNameChangeConfirm() {
      const { currentUser } = this.data;

      if (getByteLength(currentUser.name) > 20) {
        wx.showToast({
          title: '昵称过长',
          icon: 'none',
          duration: 1000
        });
        return;
      }
      this.setData({ currentUser })
      if (!await app.changeUserName(currentUser.name)) {
        this.setData({
          currentUser: await app.getCurrentUser()
        });
      }
      if (this.data.isTestMode) {
        this.setData({
          testUserList: app.getUserListCopy()
        })
      }
    },
    async handleUserBasicChange() {
      const { currentUser } = this.data;
      this.setData({ currentUser })
      if (!await app.changeUserBasic(currentUser)) {
        this.setData({
          currentUser: await app.getCurrentUser()
        });
      }
    },
    async handleUserBasicReset() {
      this.setData({
        currentUser: await app.getCurrentUser(),
      });
    },
    async uploadAvater(e: WechatMiniprogram.CustomEvent) {
      const src = e.detail.avatarUrl;
      // 可以用原生方式
      //wx.navigateTo({
      //  url: `../upload-avatar/upload-avatar?src=${src}`
      //})
      console.log('src:', src)
      await app.changeUserAvatar(await getImageBase64(src));
      await this.onShow();
    },
    copyInfo(e: WechatMiniprogram.CustomEvent) {
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