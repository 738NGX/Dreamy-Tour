import HttpUtil from "../../utils/httpUtil";
import { User, UserBasic } from "../../utils/user/user";
import { getUserGroupName, userExpTarget, userRoleName } from "../../utils/util";

const app = getApp<IAppOption>();

Component({
  properties: {

  },
  data: {
    isTestMode: false,
    isDarkMode: wx.getSystemInfoSync().theme == 'dark',
    userRoleList: userRoleName,
    selectedUser: {} as User,
    userGroup: '',
    expPercentage: 0,
    expLabel: '',
    backendVersion: '不可用',


  },
  methods: {
    onLoad() {

      this.setData({
        selectedUser:app.getUser(16)
      })
      console.log(this.data.selectedUser)

      wx.onThemeChange((res) => {
        this.setData({
          isDarkMode: res.theme == 'dark'
        });
        console.log('当前主题：', res.theme)
      });
    },
    async onShow() {
      try{
        const res = await HttpUtil.get({
          url: '/version',
        });
        this.setData({
          backendVersion: res.data.msg
        });
      } catch (e) {
        console.error('获取版本信息失败', e);
        this.setData({
          backendVersion: '不可用'
        });
      }
      this.setData({
        isTestMode: app.globalData.testMode,
        isLocalDebug: app.globalData.localDebug,
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
    showVersion(){
      wx.showModal({
        title: '版本信息',
        content: `客户端版本：${app.globalData.version}\r\n服务端版本：${this.data.backendVersion}`,
        showCancel: false,
        confirmText: '了解！',
      })
    },
    copyUid() {
      wx.setClipboardData({
        data: this.data.selectedUser.id.toString(),
        success() {
          wx.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 1000
          })
        }
      })
    },
    caluculateExp() {
      const exp = this.data.selectedUser.exp;
      const userGroup = getUserGroupName(this.data.selectedUser);
      const target = userGroup == '系统管理员' ? 1 : userExpTarget[userGroup];
      this.setData({
        userGroup,
        expPercentage: Math.min(100, exp / target * 100),
        expLabel: `${exp}/${target}`
      })
    },
  }
})