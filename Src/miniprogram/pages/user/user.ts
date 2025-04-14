import HttpUtil from "../../utils/httpUtil";
import { User, UserBasic } from "../../utils/user/user";
import { getByteLength, getImageBase64, getUserGroupName, userExpTarget, userRoleName } from "../../utils/util";
const app = getApp<IAppOption>();

Component({
  properties: {

  },
  data: {
    isTestMode: false,
    isMiniApp: app.globalData.isMiniApp,
    isDarkMode: wx.getSystemInfoSync().theme == 'dark',
    testUserList: [] as User[],
    userRoleList: userRoleName,
    currentUser: {} as UserBasic,
    userGroup: '',
    expPercentage: 0,
    expLabel: '',
    backendVersion: '不可用',
    uploadVisible: false,
    backgroundImages: [],

    testText: '测试文本',

    refreshEnable: false
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
      try {
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
      const currentUserBasic = await app.getCurrentUser()
      const currentUserId = currentUserBasic?.id
      if (currentUserId) {
        this.setData({
          isTestMode: app.globalData.testMode,
          currentUser: currentUserBasic,
          testUserList: app.getUserListCopy()
        });
      }
      this.caluculateExp();
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        const page: any = getCurrentPages().pop();
        this.getTabBar().setData({
          value: '/' + page.route
        })
      }
    },
    async onRefresh() {
      this.setData({ refreshEnable: true });
      //个人信息
      const currentUserBasic = await app.getCurrentUser();
      const currentUserId = currentUserBasic?.id
      if (currentUserId) {
        this.setData({
          isTestMode: app.globalData.testMode,
          currentUser: currentUserBasic,
          testUserList: app.getUserListCopy()
        });

        //帖子
        const posts = this.selectComponent('#posts');
        if (posts) posts.onRefresh();
        //经验值组件
        this.caluculateExp();
      }
      this.setData({ refreshEnable: false });
    },
    showVersion() {
      wx.showModal({
        title: '版本信息',
        content: `客户端版本：${app.globalData.version}\r\n服务端版本：${this.data.backendVersion}`,
        showCancel: false,
        confirmText: '了解！',
      })
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
    handleNickNameChange() {
      const { currentUser } = this.data;
      const that = this;
      wx.showModal({
        title: '请输入新的昵称',
        content: currentUser.name,
        editable: true,
        placeholderText: '昵称上限10个汉字或20个字符',
        async success(res) {
          if (res.confirm) {
            const name = res.content;
            if (name && getByteLength(name) <= 20) {
              currentUser.name = name;
              if (await app.changeUserName(currentUser.name)) {
                const currentUserBasic = await app.getCurrentUser()
                that.setData({ currentUser: currentUserBasic });
              }
              if (that.data.isTestMode) {
                that.setData({
                  testUserList: app.getUserListCopy()
                })
              }
            } else {
              wx.showToast({
                title: '输入不合法',
                icon: 'none',
                duration: 1000
              })
            }
          }
        }
      })
    },
    handleGenderChange() {
      const { currentUser } = this.data;
      const that = this;
      const itemList = ['男', '女', '保密'];
      wx.showActionSheet({
        alertText: '请选择性别',
        itemList: itemList,
        async success(res) {
          currentUser.gender = itemList[res.tapIndex];
          if (await app.changeUserBasic(currentUser)) {
            const currentUserBasic = await app.getCurrentUser()
            that.setData({ currentUser: currentUserBasic });
          }
        }
      })
    },
    handleSignatureChange() {
      const { currentUser } = this.data;
      const that = this;
      wx.showModal({
        title: '请输入新的个性签名',
        content: currentUser.signature,
        editable: true,
        placeholderText: '个性签名长度在5-50字之间',
        async success(res) {
          if (res.confirm) {
            const signature = res.content;
            if (signature.length >= 5 && signature.length <= 50) {
              currentUser.signature = signature;
              if (await app.changeUserBasic(currentUser)) {
                const currentUserBasic = await app.getCurrentUser()
                that.setData({ currentUser: currentUserBasic });
              }
            } else {
              wx.showToast({
                title: '输入不合法',
                icon: 'none',
                duration: 1000
              })
            }
          }
        }
      })
    },
    handleBirthdayChange() {
      const { currentUser } = this.data;
      const that = this;
      wx.showModal({
        title: '请输入你的生日',
        content: currentUser.birthday,
        editable: true,
        placeholderText: '生日格式限定为YYYY-MM-DD',
        async success(res) {
          if (res.confirm) {
            const birthday = res.content;
            if (birthday.match(/^\d{4}-\d{2}-\d{2}$/)) {
              currentUser.birthday = birthday;
              if (await app.changeUserBasic(currentUser)) {
                const currentUserBasic = await app.getCurrentUser()
                that.setData({ currentUser: currentUserBasic });
              }
            } else {
              wx.showToast({
                title: '输入不合法',
                icon: 'none',
                duration: 1000
              })
            }
          }
        }
      })
    },
    handlePhoneChange() {
      const { currentUser } = this.data;
      const that = this;
      wx.showModal({
        title: '请输入你的手机号',
        content: currentUser.phone,
        editable: true,
        placeholderText: '手机号长度为11位',
        async success(res) {
          if (res.confirm) {
            const signature = res.content;
            if (signature.length !== 11) {
              currentUser.signature = signature;
              if (await app.changeUserBasic(currentUser)) {
                const currentUserBasic = await app.getCurrentUser()
                that.setData({ currentUser: currentUserBasic });
              }
            } else {
              wx.showToast({
                title: '输入不合法',
                icon: 'none',
                duration: 1000
              })
            }
          }
        }
      })
    },
    async uploadAvater(/*e: WechatMiniprogram.CustomEvent*/) {
      //const src = e.detail.avatarUrl;
      // 可以用原生方式
      //wx.navigateTo({
      //  url: `../upload-avatar/upload-avatar?src=${src}`
      //})
      //console.log('src:', src)
      //await app.changeUserAvatar(await getImageBase64(src));
      //await this.onShow();
      const that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success(res) {
          const src = res.tempFilePaths[0];
          (wx as any).cropImage({
            src: src,
            cropScale: '1:1',
            async success(res: any) {
              const src = res.tempFilePath;
              await app.changeUserAvatar(await getImageBase64(src));
              await that.onShow();
            }
          })
        }
      });
    },
    async uploadBackgroundImage() {
      /*
      if (!this.data.backgroundImages[0]) {
        wx.showToast({
          title: '不可上传空白内容',
          icon: 'none'
        });
        return;
      }
      const src = JSON.parse(JSON.stringify(this.data.backgroundImages[0]))
      if (src && src.url)
        console.log('src.url:', src.url)
      await app.changeUserBackgroundImage(await getImageBase64(src.url));
      await this.onShow();
      */
      const that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success(res) {
          const src = res.tempFilePaths[0];
          (wx as any).cropImage({
            src: src,
            cropScale: '1:1',
            async success(res: any) {
              const src = res.tempFilePath;
              await app.changeUserBackgroundImage(await getImageBase64(src));
              await that.onShow();
            }
          })
        }
      });
    },
    handleImageUploadSuccess(e: WechatMiniprogram.CustomEvent) {
      const { files } = e.detail;
      this.setData({ backgroundImages: files });
    },
    handleImageUploadRemove() {
      this.setData({ backgroundImages: [] });
    },
    handleImageUploadClick(e: WechatMiniprogram.CustomEvent) {
      console.log(e.detail.file);
    },
    handleImageUploadDrop(e: WechatMiniprogram.CustomEvent) {
      const { files } = e.detail;
      this.setData({ backgroundImages: files });
    },
    uploadVisibleChange() {
      this.setData({
        uploadVisible: !this.data.uploadVisible
      })
    },
    cancelUpload() {
      this.handleImageUploadRemove();
      this.uploadVisibleChange();
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
    resetPassword() {
      if (!this.data.currentUser.email) {
        wx.showToast({
          title: '请先绑定邮箱',
          icon: 'none',
          duration: 1000
        })
        return;
      }
      const email = this.data.currentUser.email;
      wx.showModal({
        title: '提示',
        content: '确定要重置密码？',
        success(res) {
          if (res.confirm) {
            // 删除缓存中的 token
            wx.removeStorageSync("token")
            wx.reLaunch({
              url: '/pages/login/login?loginMode=3&email=' + email
            })
          }
        }
      })
    },
    quitLogin() {
      wx.showModal({
        title: '提示',
        content: '确定退出登录？',
        success(res) {
          if (res.confirm) {
            // 删除缓存中的 token
            wx.removeStorageSync("token")
            wx.reLaunch({
              url: '/pages/login/login'
            })
          }
        }
      })
    },
    bindEmail() {
      const that = this;
      wx.showModal({
        title: '请输入你的邮箱地址',
        content: '',
        editable: true,
        placeholderText: 'takami.chika@aqours.com',
        async success(res) {
          if (res.confirm) {
            const email = res.content;
            if (email) {
              try {
                await HttpUtil.post({
                  url: "/email/captcha",
                  jsonData: {
                    email: email,
                    businessType: "bind"
                  }
                });
                wx.showToast({
                  title: "验证码已发送",
                  icon: "none"
                });
                wx.showModal({
                  title: '验证码已发送到你的邮箱',
                  content: '',
                  editable: true,
                  placeholderText: '请输入验证码',
                  showCancel: false,
                  async success(res) {
                    if (res.confirm) {
                      const code = res.content;
                      if (code) {
                        try {
                          await HttpUtil.post({
                            url: "/user/bind-email",
                            jsonData: {
                              email: email,
                              force: false,
                              verifyCode: code
                            }
                          });
                          wx.showToast({
                            title: "绑定成功",
                            icon: "none"
                          });
                          const currentUserBasic = await app.getCurrentUser()
                          that.setData({ currentUser: currentUserBasic });
                        } catch (err) {
                          console.error("绑定邮箱失败", err);
                          wx.showToast({
                            title: "请重试",
                            icon: "error"
                          })
                        }
                      } else {
                        wx.showToast({
                          title: '验证码不能为空',
                          icon: 'none',
                          duration: 1000
                        })
                      }
                    }
                  }
                })
              } catch (err) {
                console.error("获取验证码失败", err);
                wx.showToast({
                  title: "请重试",
                  icon: "error"
                })
              }
            } else {
              wx.showToast({
                title: '邮箱不能为空',
                icon: 'none',
                duration: 1000
              })
            }
          }
        }
      })
    },
  }
})