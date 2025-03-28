import { UserBasic } from "../../utils/user/user";
import { getUserGroupName, userExpTarget } from "../../utils/util";

/**
 * 折叠栏组件
 */
Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    userInfos: {
      type: Object,
      value: {},
      observer(newVal: any) {
        if (newVal) {
          this.caluculateExp(newVal);
        }
      }
    },
  },
  data: {
    expPercentage: 0,
    expLabel: '',
  },
  attached() {

  },
  methods: {
    onVisibleChange(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent('visible-change', e.detail);
    },
    copyUid() {
      wx.setClipboardData({
        data: this.properties.userInfos.id.toString(),
        success() {
          wx.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 1000
          })
        }
      })
    },
    copyBirthday() {
      wx.setClipboardData({
        data: this.properties.userInfos.id.toString(),
        success() {
          wx.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 1000
          })
        }
      })
    },
    copyPhone() {
      wx.setClipboardData({
        data: this.properties.userInfos.phone.toString(),
        success() {
          wx.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 1000
          })
        }
      })
    },
    copyEmail() {
      wx.setClipboardData({
        data: this.properties.userInfos.email.toString(),
        success() {
          wx.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 1000
          })
        }
      })
    },
    caluculateExp(userInfos: UserBasic) {
      const exp = userInfos.exp;
      const userGroup = getUserGroupName(userInfos as UserBasic);
      const target = userGroup == '系统管理员' ? 1 : userExpTarget[userGroup];
      this.setData({
        expPercentage: Math.min(100, exp / target * 100),
        expLabel: `经验值:${exp}/${target}`
      })
    },
  }
});
