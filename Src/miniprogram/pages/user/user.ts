import { UserBasic } from "../../utils/user/user";
import { getImageBase64, getUserGroupName, userExpTarget } from "../../utils/util";

const app = getApp<IAppOption>();

Component({
  properties: {

  },
  data: {
    isTestMode: app.globalData.testMode,
    testUserList: [] as UserBasic[],
    currentUser: {} as UserBasic,
    userGroup: '',
    expPercentage: 0,
    expLabel: '',

    photoUploadVisible: false,
    uploadedPhotos: [] as any[],
  },
  methods: {
    onShow() {
      this.setData({
        currentUser: app.currentUser(),
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
    signIn() {
      const user = app.currentUser();
      user.exp += 10;
      this.setData({
        currentUser: user
      })
      app.updateUser(user);
      this.caluculateExp();
    },
    onPhotoUploadVisibleChange() {
      this.setData({
        photoUploadVisible: !this.data.photoUploadVisible
      });
    },
    handlePhotoAdd(e: WechatMiniprogram.CustomEvent) {
      const { uploadedPhotos } = this.data;
      const { files } = e.detail;

      this.setData({
        uploadedPhotos: [...uploadedPhotos, ...files],
      });
    },
    handlePhotoRemove(e: WechatMiniprogram.CustomEvent) {
      const { index } = e.detail;
      const { uploadedPhotos } = this.data;

      uploadedPhotos.splice(index, 1);
      this.setData({
        fileList: uploadedPhotos,
      });
    },
    async onPhotoUploadConfirm() {
      if (this.data.uploadedPhotos.length === 0) return;
      const { currentUser } = this.data;
      currentUser.avatarUrl = await getImageBase64(this.data.uploadedPhotos[0].url);
      this.setData({ currentUser, photoUploadVisible: false });
      await app.changeUserBasic(currentUser);
    },
    uploadAvater(){
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          const src = res.tempFilePaths[0]
          wx.navigateTo({
            url: `../upload-avatar/upload-avatar?src=${src}`
          })
        }
      })
    }
  }
})