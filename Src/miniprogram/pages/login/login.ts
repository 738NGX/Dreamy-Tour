import { apiUrl } from "../../utils/httpUtil";
//const apiUrl = "https://dreamy-tour.738ngx.site/api";

// pages/login/login.ts
Page({
  data: {
    image: "https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/LOGO2.png",
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
    // 先检查缓存是否有 token，如果有，就直接登录
    const token = wx.getStorageSync("Authorization");
    if (token) {
      wx.switchTab({
        url: "/pages/channel/channel"
      });
    }
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