/** 
 * 频道讨论区，用于发布帖子并进行交流
 */
import { Channel } from "../../../utils/channel/channel";
import { Post } from "../../../utils/channel/post";
import { getNewId } from "../../../utils/util";

const app = getApp<IAppOption>();

Component({
  properties: {
    currentChannel: {
      type: Object,
      value: {},
    },
    fabStyle:{
      type: String,
      value: 'right: 16px; bottom: 32px;',
    }
  },

  data: {
    leftPosts: [] as any[],
    rightPosts: [] as any[],
    searchedPosts: [] as any[],
    searchingValue: '',
    refreshEnable: false,

    inputVisible: false,
    inputTitle: '',
    inputValue: '',
    originFiles: [] as any[],
  },

  lifetimes: {
    ready() {
      this.sortPosts();
    },
  },

  methods: {
    onRefresh() {
      this.setData({ refreshEnable: true });
      setTimeout(() => {
        this.setData({ refreshEnable: false });
      }, 500);
      this.sortPosts(this.data.searchingValue);
    },
    sortPosts(searchValue: string = '') {
      const currentChannel = this.properties.currentChannel;
      const sorted = app.getPostListCopy()
        .map((post) => {
          return {
            ...post,
            username: app.getUser(post.user)?.name ?? '未知用户',
          }
        })
        .filter((post) =>
          post.linkedChannel == currentChannel.id
          && post.title.includes(searchValue)
        )
        .sort((a, b) =>
          (b.isSticky ? 1 : 0) - (a.isSticky ? 1 : 0) || b.time - a.time
        );

      const leftPosts = [] as any[];
      const rightPosts = [] as any[];
      sorted.forEach((post: any, index: number) => {
        if (index % 2 === 0) {
          leftPosts.push(post);
        } else {
          rightPosts.push(post);
        }
      });

      this.setData({
        leftPosts: leftPosts,
        rightPosts: rightPosts,
      });
    },
    onSearch(e: WechatMiniprogram.CustomEvent) {
      const { value } = e.detail;
      this.setData({ searchingValue: value });
      this.sortPosts(value);
    },
    onSearchClear() {
      this.setData({ searchingValue: '' });
      this.sortPosts();
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
      this.setData({
        originFiles,
      });
    },
    handleImageUploadClick(e: WechatMiniprogram.CustomEvent) {
      console.log(e.detail.file);
    },
    handleImageUploadDrop(e: WechatMiniprogram.CustomEvent) {
      const { files } = e.detail;
      this.setData({
        originFiles: files,
      });
    },
    handlePostDetail(e: WechatMiniprogram.CustomEvent) {
      const id = e.currentTarget.dataset.index;
      wx.navigateTo({
        url: `/pages/channel-post/channel-post?postId=${id}`,
      });
    },
    handleInputSend() {
      const currentChannel = this.properties.currentChannel as Channel;
      const { inputTitle, inputValue, originFiles } = this.data;
      if (inputTitle !== null && inputValue !== null) {
        if (inputTitle.length === 0) {
          wx.showToast({
            title: '标题不能为空',
            icon: 'none',
          });
          return;
        }
        const newPostId = getNewId(app.globalData.currentData.postList);
        const newPost = new Post({
          id: newPostId,
          title: inputTitle,
          content: inputValue,
          linkedChannel: currentChannel.id,
          user: app.globalData.currentUserId,
          time: Date.now(),
          isSticky: false,
          photos: originFiles.map((file: any) => ({ value: file.url, ariaLabel: file.name })),
        });
        app.addPost(newPost);
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