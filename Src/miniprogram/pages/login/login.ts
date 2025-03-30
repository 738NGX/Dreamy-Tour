import { apiUrl } from "../../utils/httpUtil";

// pages/login/login.ts
Page({
  data: {
    image: "https://dreamy-tour-1319433252.cos.ap-shanghai.myqcloud.com/LOGO2.png",
  },
  onShow() {
    wx.removeStorageSync("token");
  },
  wxLogin() {
    getApp<IAppOption>().globalData.testMode = false;
    this.handleLogin();
  },
  enterTestMode() {
    getApp<IAppOption>().globalData.testMode = true;
    this.handleLogin();
  },
  handleLogin() {
    wx.showLoading({
      title: "加载中…"
    })
    wx.login({
      success(res) {
        if (res.code) {
          wx.request({
            url: `${apiUrl}/wx-login`,
            method: "POST",
            data: {
              "code": res.code
            },
            success(res: any) {
              wx.hideLoading();
              const token = res.data.data.token;
              // 将 token 存到微信缓存
              wx.setStorageSync("token", token);
              wx.switchTab({
                url: "/pages/channel/channel"
              });
            },
            fail(err: any) {
              wx.hideLoading();
              console.error("登录失败", err);
              wx.showToast({
                title: "登录失败",
                icon: "error"
              })
            }
          })
        }
      },
      fail() {
        wx.hideLoading();
        wx.showToast({
          title: "登录失败",
          icon: "error"
        })
      }
    })
  }
})