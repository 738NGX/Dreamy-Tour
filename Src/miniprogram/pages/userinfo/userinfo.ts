import HttpUtil from "../../utils/httpUtil";
import { User } from "../../utils/user/user";
import { getUserGroupName, userExpTarget, userRoleName } from "../../utils/util";
import { PostCard } from "../../utils/channel/post";
import { Channel } from "../../utils/channel/channel";
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

    fullPosts: [] as PostCard[],
    leftPosts: [] as PostCard[],
    rightPosts: [] as PostCard[],
    searchedPosts: [] as PostCard[],
    searchingValueForPosts: '',
    refreshEnable: false,
        
    fullChannelList: [] as Channel[],
    channelList: [] as Channel[],
    searchingValueForChannels: '',
},

  lifetimes: {
    async ready() {
      await this.getFullPosts();
      this.searchPosts();
      await this.loadChannelList();
      this.setData({
        channelList: this.data.fullChannelList.filter(
        channel => channel.name.includes(this.data.searchingValueForChannels))
      });
    },
  },

  methods: {
    onLoad(options:any) {
      const { uid } = options;
      if(uid && uid > 0){
        this.setData({
          selectedUser:app.getUser(uid) 
        })
      } else {
        this.setData({
          selectedUser:app.getUser(1)
        })
      }
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
    async onRefresh() {
      this.setData({ refreshEnable: true });
      await this.getFullPosts();
      this.searchPosts(this.data.searchingValueForPosts);
      this.setData({ refreshEnable: false });
    },
    async getFullPosts() {
      const fullPosts = await app.getFullPostsByUid(this.data.selectedUser.id); //
      this.setData({ fullPosts });
    },
    searchPosts(searchValue: string = '') {
      const { fullPosts } = this.data;
      const leftPosts = [] as PostCard[];
      const rightPosts = [] as PostCard[];
      fullPosts.forEach((post, index) => {
        if (post.title.includes(searchValue) || post.content.includes(searchValue)) {
          if (index % 2 === 0) {
            leftPosts.push(post);
          } else {
            rightPosts.push(post);
          }
        }
      });
      this.setData({ leftPosts, rightPosts });
    },
    onPostsSearch(e: WechatMiniprogram.CustomEvent) {
      const { value } = e.detail;
      this.setData({ searchingValueForPosts: value });
      this.searchPosts(value);
    },
    onPostsSearchClear() {
      this.setData({ searchingValueForPosts: '' });
      this.searchPosts();
    },
    async loadChannelList() {
      const channelList = await app.getSelectedUserJoinedChannels(this.data.selectedUser.id);
      this.setData({ channelList, fullChannelList: channelList });
    },
    onChannelsSearch(e: WechatMiniprogram.CustomEvent) {
      const { value } = e.detail;
      this.setData({
        searchingValue: value,
        channelList: this.data.fullChannelList.filter(channel => channel.name.includes(value)),
      });
    },
    onChannelsSearchClear() {
      this.setData({
        searchingValue: '',
        channelList: this.data.fullChannelList,
      });
    },
    handlePostDetail(e: WechatMiniprogram.CustomEvent) {
      const id = e.currentTarget.dataset.index;
      wx.navigateTo({
        url: `/pages/channel-post/channel-post?postId=${id}`,
      });
    },
  }
})