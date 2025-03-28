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
    // 先加载提示
    getApp<IAppOption>().globalData.testMode = false;
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
              // 关闭加载
              wx.hideLoading();
              const token = res.data.data.token;
              // 将 token 存到微信缓存
              wx.setStorageSync("token", token);
              // 跳转到频道页面
              wx.switchTab({
                url: "/pages/channel/channel"
              });
            },
            fail() {
              wx.showToast({
                title: "登录失败",
                icon: "error"
              })
            }
          })
        }
      },
      fail() {
        wx.showToast({
          title: "登录失败",
          icon: "error"
        })
      }
    })
  },
  enterTestMode(){
    getApp<IAppOption>().globalData.testMode = true;
    wx.switchTab({
      url: "/pages/channel/channel"
    });
  }
})