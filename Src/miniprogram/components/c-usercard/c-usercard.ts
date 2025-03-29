Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    userInfos: {
      type: Object,
      value: {},
    },
  },
  data: {
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
  }
});
