/** 
 * 频道讨论区，用于发布帖子并进行交流
 */
import { Channel } from "../../../utils/channel/channel";
import { PostCard } from "../../../utils/channel/post";

const app = getApp<IAppOption>();

Component({
  properties: {
    currentChannel: {
      type: Object,
      value: {},
    },
    fabStyle: {
      type: String,
      value: 'right: 16px; bottom: 32px;',
    }
  },

  data: {
    fullPosts: [] as PostCard[],
    leftPosts: [] as PostCard[],
    rightPosts: [] as PostCard[],
    searchedPosts: [] as PostCard[],
    searchingValue: '',
    refreshEnable: false,

    inputVisible: false,
    inputTitle: '',
    inputValue: '',
    originFiles: [] as any[],
  },

  lifetimes: {
    ready() {
      this.searchPosts();
    },
  },

  methods: {
    onRefresh() {
      this.setData({ refreshEnable: true });
      setTimeout(() => {
        this.setData({ refreshEnable: false });
      }, 500);
      this.getFullPosts();
      this.searchPosts(this.data.searchingValue);
    },
    async getFullPosts() {
      const fullPosts = await app.getFullPostsInChannel(this.properties.currentChannel.id);
      this.setData({ fullPosts });
    },
    async searchPosts(searchValue: string = '') {
      const { fullPosts } = this.data;
      const { leftPosts, rightPosts } = await app.searchPosts(fullPosts, searchValue);
      this.setData({ leftPosts, rightPosts });
    },
    onSearch(e: WechatMiniprogram.CustomEvent) {
      const { value } = e.detail;
      this.setData({ searchingValue: value });
      this.searchPosts(value);
    },
    onSearchClear() {
      this.setData({ searchingValue: '' });
      this.searchPosts();
    },
    handlePost() {
      this.setData({ inputVisible: !this.data.inputVisible });
    },
    handleTitleInput(e: WechatMiniprogram.CustomEvent) {
      this.setData({ inputTitle: e.detail.value });
    },
    handleInput(e: WechatMiniprogram.CustomEvent) {
      this.setData({ inputValue: e.detail.value });
    },
    handleImageUploadSuccess(e: WechatMiniprogram.CustomEvent) {
      const { files } = e.detail;
      this.setData({
        originFiles: files,
      });
    },
    handleImageUploadRemove(e: WechatMiniprogram.CustomEvent) {
      const { index } = e.detail;
      const { originFiles } = this.data;
      originFiles.splice(index, 1);
      this.setData({ originFiles });
    },
    handleImageUploadClick(e: WechatMiniprogram.CustomEvent) {
      console.log(e.detail.file);
    },
    handleImageUploadDrop(e: WechatMiniprogram.CustomEvent) {
      const { files } = e.detail;
      this.setData({ originFiles: files });
    },
    handlePostDetail(e: WechatMiniprogram.CustomEvent) {
      const id = e.currentTarget.dataset.index;
      wx.navigateTo({
        url: `/pages/channel-post/channel-post?postId=${id}`,
      });
    },
    async handleInputSend() {
      const currentChannel = this.properties.currentChannel as Channel;
      const { inputTitle, inputValue, originFiles } = this.data;
      if (await app.createPost(currentChannel.id, inputTitle, inputValue, originFiles)) {
        this.setData({
          inputVisible: false,
          inputTitle: '',
          inputValue: '',
          originFiles: [],
        });
        this.onRefresh();
      }
    }
  }
});