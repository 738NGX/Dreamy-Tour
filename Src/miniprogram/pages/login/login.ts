import HttpUtil from "../../utils/httpUtil";
import { MILLISECONDS } from "../../utils/util";

const app = getApp<IAppOption>();

// pages/login/login.ts
Page({
  data: {
    image: "https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/LOGO2.png",
    loginMode: 0,
    time: 0,
    continueTime: 0,
    inputStyle: 'border-radius: 18rpx;--td-input-vertical-padding:18rpx;',
    email: "",
    password: "",
    code: "",
    isMiniApp: app.globalData.isMiniApp,
  },
  onLoad(options: any) {
    const { loginMode, email } = options;
    if (loginMode) {
      this.setData({ loginMode: Number(loginMode), email });
    }
    wx.removeStorageSync("token");
    this.setData({ continueTime: 0 });
    app.globalData.currentUserId = 1;
  },
  cancelLogin() {
    this.setData({ loginMode: 0 });
  },
  startEmailLogin() {
    this.setData({ loginMode: 1, time: this.data.continueTime ? this.data.continueTime : 0 });
  },
  startPasswordLogin() {
    this.setData({ loginMode: 2 });
  },
  startPasswordReset() {
    this.setData({ loginMode: 3 });
  },
  onEmailInput(e: any) {
    this.setData({ email: e.detail.value });
  },
  onPasswordInput(e: any) {
    this.setData({ password: e.detail.value });
  },
  onCodeInput(e: any) {
    this.setData({ code: e.detail.value });
  },
  async handlePasswordLogin() {
    const { email, password } = this.data;

    if (!email || !password) {
      wx.showToast({
        title: "请输入邮箱和密码",
        icon: "none"
      })
      return;
    }
    const url = "/email/login";
    const jsonData = { email, password };
    app.globalData.testMode = false;
    await this.handleLogin(url, jsonData);
  },
  async getCode(businessType: string) {
    if (!this.data.email) {
      wx.showToast({
        title: "请输入邮箱",
        icon: "none"
      })
      return;
    }
    try {
      await HttpUtil.post({
        url: "/email/captcha",
        jsonData: {
          email: this.data.email,
          businessType
        }
      });
      wx.showToast({
        title: "验证码已发送",
        icon: "none"
      });
      this.setData({ time: MILLISECONDS.MINUTE });
    } catch (err) {
      console.error("获取验证码失败", err);
      wx.showToast({
        title: "请重试",
        icon: "error"
      })
    }
  },
  async getRegisterCode() {
    this.getCode("register");
  },
  async getResetCode() {
    this.getCode("reset");
  },
  async handleEmailLogin() {
    const { email, password, code } = this.data;

    if (!email || !password || !code) {
      wx.showToast({
        title: "请输入邮箱、密码和验证码",
        icon: "none"
      })
      return;
    }
    const url = "/email/register";
    const jsonData = { email, password, verifyCode: code };
    try {
      await HttpUtil.post({ url, jsonData });
      wx.showToast({
        title: "注册成功",
        icon: "success"
      });
      app.globalData.testMode = false;
      this.handleLogin("/email/login", jsonData);
    } catch (err: any) {
      console.error("注册失败", err);
      wx.showToast({
        title: err.response.data.msg || "注册失败",
        icon: "none"
      })
    }
  },
  async handlePasswordReset() {
    const { email, password, code } = this.data;

    if (!email || !password || !code) {
      wx.showToast({
        title: "请输入邮箱、密码和验证码",
        icon: "none"
      })
      return;
    }
    const url = "/email/password";
    const jsonData = { email, password, verifyCode: code };
    try {
      await HttpUtil.put({ url, jsonData });
      wx.showToast({
        title: "重置成功",
        icon: "success"
      });
      app.globalData.testMode = false;
      this.handleLogin("/email/login", jsonData);
    } catch (err: any) {
      console.error("重置失败", err);
      wx.showToast({
        title: err.response.data.msg || "重置失败",
        icon: "none"
      })
    }
  },
  countDownFinish() {
    this.setData({ time: 0, continueTime: 0 });
  },
  countDown(time: any) {
    this.setData({ continueTime: time.detail.ss * MILLISECONDS.SECOND });
  },
  async wxLogin() {
    app.globalData.testMode = false;
    this.handleWxLogin();
  },
  enterTestMode() {
    app.globalData.testMode = true;
    this.handleWxLogin();
  },
  async handleLogin(url: string, jsonData: any) {
    try {
      const res = await HttpUtil.post({ url, jsonData });
      const token = res.data.data.token;
      wx.setStorageSync("token", token);
      wx.switchTab({
        url: "/pages/channel/channel"
      });
    } catch (err) {
      console.error("登录失败", err);
      wx.showToast({
        title: "登录失败",
        icon: "error"
      })
    }
  },
  handleWxLogin() {
    const that = this;
    wx.login({
      async success(res) {
        if (res.code) {
          await that.handleLogin(`/wx-login`, { code: res.code });
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