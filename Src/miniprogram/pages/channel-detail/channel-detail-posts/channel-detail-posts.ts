import { Channel } from "../../../utils/channel/channel";
import { postList, userList } from "../../../utils/testData";

Component({
  properties: {
    currentChannel: {
      type: Object,
      value: {},
    },
  },

  data: {
    sortedPosts: [] as any[],
    searchedPosts: [] as any[],
    usernameList: [] as string[]
  },

  lifetimes: {
    attached() {
      this.sortPosts();
      this.generateUsernameList();
    }
  },

  methods: {
    sortPosts() {
      const currentChannel = this.properties.currentChannel as Channel;
      const sorted = [...postList]
        .filter(post => post.linkedChannel == currentChannel.id)
        .sort((a, b) =>
          (b.isSticky ? 1 : 0) - (a.isSticky ? 1 : 0) || b.time - a.time
        );
      this.setData({
        sortedPosts: sorted,
        searchedPosts: sorted
      });
    },
    generateUsernameList() {
      const usernameList = this.data.searchedPosts.map(post => userList.find(user => user.id === post.user)?.name ?? '未知用户');
      this.setData({ usernameList: usernameList });
    },
    onSearch(e: any) {
      const { value } = e.detail;
      const searchedPosts = this.data.sortedPosts.filter(post => post.title.includes(value));
      this.setData({ searchedPosts: searchedPosts });
      this.generateUsernameList();
    },
    handlePostDetail(e: any) {
      const id = e.currentTarget.dataset.index;
      wx.navigateTo({
        url: `/pages/channel-post/channel-post?postId=${id}`,
      });
    }
  }
});
