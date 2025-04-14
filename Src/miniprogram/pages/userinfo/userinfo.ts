import { Member } from "../../utils/user/user";
import { getUserGroupName, userExpTarget, userRoleName } from "../../utils/util";
import { Channel, ChannelBasic } from "../../utils/channel/channel";
const app = getApp<IAppOption>();

Component({
  properties: {

  },
  data: {
    isTestMode: false,
    // isDarkMode: wx.getSystemInfoSync().theme == 'dark',
    isDarkMode: true,
    userRoleList: userRoleName,
    selectedUser: {} as Member,
    expPercentage: 0,
    expLabel: '',
    backendVersion: '不可用',
    currentChannel: {} as ChannelBasic,
    fullChannelList: [] as Channel[],
  },

  methods: {
    async onLoad(options: any) {
      const { uid } = options;
      this.setData({
        selectedUser: await app.getUserDetail(uid),
        currentChannel: await app.loadPublicChannel()
      })
      wx.onThemeChange((res) => {
        this.setData({
          isDarkMode: res.theme == 'dark'
        });
        console.log('当前主题：', res.theme)
      });
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