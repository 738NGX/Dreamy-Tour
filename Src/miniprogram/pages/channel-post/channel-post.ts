/**
 * 具体的帖子界面
 */
import { Comment, Post, StructedComment } from "../../utils/channel/post";
import { File } from "../../utils/tour/photo";
import { Member, UserBasic } from "../../utils/user/user";
import { formatPostTime, getImageBase64 } from "../../utils/util";

const app = getApp<IAppOption>();

enum InputMode { None, Comment, Reply };

function getStructuredComments(post: Post, userList: Member[], commentList: Comment[]): StructedComment[] {
  const userMap = new Map(userList.map(user => [user.id, { name: user.name, userGroup: user.userGroup, avatarUrl: user.avatarUrl }]));
  const replyMap = new Map<number, Comment[]>();

  // 初始化评论映射
  commentList.forEach(comment => {
    if (!replyMap.has(comment.parentComment)) {
      replyMap.set(comment.parentComment, []);
    }
    replyMap.get(comment.parentComment)!.push(comment);
  });

  // 递归收集所有回复，并展开到同一级别
  function collectAllReplies(commentId: number, parentUserName?: string): any[] {
    const replies = replyMap.get(commentId) || [];
    return replies.flatMap(reply => {
      let newContent = reply.content;
      if (parentUserName) {
        newContent = `回复@${parentUserName}：${reply.content}`;
      }
      const { name, userGroup, avatarUrl } = userMap.get(reply.user) ?? { name: "未知用户", userGroup: "未知用户组", avatarUrl: "" };
      return [{
        ...reply,
        content: newContent,
        userName: name,
        userGroup: userGroup,
        avatarUrl: avatarUrl,
        timeStr: formatPostTime(reply.time)
      }, ...collectAllReplies(reply.id, name)];
    }).sort((a, b) => b.likes.length - a.likes.length);
  }

  // 处理顶层评论，并整理其回复列表
  return commentList
    .filter(comment => comment.linkedPost == post.id && comment.parentComment == -1)
    .map(topComment => ({
      ...topComment,
      userName: userMap.get(topComment.user)?.name || "未知用户",
      userGroup: userMap.get(topComment.user)?.userGroup || "未知用户组",
      avatarUrl: userMap.get(topComment.user)?.avatarUrl || "",
      replies: collectAllReplies(topComment.id),
      timeStr: formatPostTime(topComment.time)
    }))
    .sort((a, b) => b.likes.length - a.likes.length);
}

Component({
  data: {
    refreshEnable: false,

    currentUserId: -1,
    currentUser: {} as UserBasic,
    isChannelAdmin: false,
    currentPost: {} as Post,
    imageProps: { mode: "widthFix" },

    maxHeight: 0,
    author: {} as Member,
    timeStr: '',
    structedComments: [] as StructedComment[],
    commentsSortType: '热度排序',

    optionsVisible: false,

    repliesVisible: false,
    repliesParent: -1,
    replies: [] as StructedComment[],
    repliesSortType: '热度排序',

    inputVisible: false,
    inputMode: InputMode.None,
    inputValue: '',
    replyingComment: -1,
    originFiles: [] as File[],

    members: [] as Member[],
    usercardVisible: false,
    usercardInfos: {} as Member,
  },
  methods: {
    async onLoad(options: any) {
      const { postId } = options;
      const currentPost = await app.getFullPost(parseInt(postId)) as Post;
      const { isChannelAdmin } = await app.getUserAuthorityInChannel(currentPost.linkedChannel)
      this.setData({ currentPost, isChannelAdmin, currentUser: await app.getCurrentUser() });
      const currentUserId = this.data.currentUser.id;
      this.setData({ currentUserId });
      await this.init();
    },
    async onRefresh() {
      this.setData({ refreshEnable: true });
      await this.init();
      this.setData({ refreshEnable: false });
    },
    async init() {
      const { currentPost } = this.data;
      const members = await app.getMembersInPost(currentPost.id);
      const commentList = await app.getFullCommentsInPost(currentPost.id);

      const author = members.find(member => member.id === currentPost.user);
      const timeStr = this.data.currentPost ? formatPostTime(this.data.currentPost.time) : '';
      const structedComments = getStructuredComments(currentPost, members, commentList);
      this.setData({ author, members, timeStr, structedComments });
    },
    onImageLoad(e: WechatMiniprogram.CustomEvent) {
      const { width, height } = e.detail;

      // 获取屏幕宽度，计算自适应后的高度
      wx.getSystemInfo({
        success: res => {
          const screenWidth = res.windowWidth;
          const newHeight = (height / width) * screenWidth; // 计算适配后高度
          this.setData({ maxHeight: Math.max(this.data.maxHeight, newHeight) });
        }
      });
    },
    showPostImage(e: WechatMiniprogram.CustomEvent) {
      const index = e.currentTarget.dataset.index;
      const urls = this.data.currentPost.photos.map((photo) => photo.value);
      wx.previewImage({
        urls: urls,
        showmenu: true,
        current: urls[index],
      })
    },
    showImage(e: WechatMiniprogram.CustomEvent) {
      const index = e.currentTarget.dataset.index;
      wx.previewImage({
        urls: [index],
        showmenu: true,
        success: () => {
          this.setData({ inputVisible: false });
        }
      })
    },
    showUsercard(e: WechatMiniprogram.CustomEvent) {
      const userId = e.currentTarget.dataset.index;
      if (!userId) {
        this.setData({ usercardVisible: false });
        return;
      }
      const user = this.data.members.find((m) => m.id === userId);
      if (!user) return;
      this.setData({
        usercardVisible: true,
        usercardInfos: user
      })
    },
    handleRepliesDetail(e: WechatMiniprogram.CustomEvent) {
      const repliesParent = e.currentTarget.dataset.index?.id;
      const replies = e.currentTarget.dataset.index?.replies;
      this.setData({
        repliesVisible: !this.data.repliesVisible,
        repliesParent: repliesParent ?? -1,
        replies: replies ?? []
      });
    },
    handleCommentsSort() {
      if (this.data.commentsSortType === '热度排序') {
        this.setData({
          commentsSortType: '时间倒序',
          structedComments: this.data.structedComments.sort((a, b) => b.time - a.time)
        })
      }
      else if (this.data.commentsSortType === '时间倒序') {
        this.setData({
          commentsSortType: '时间正序',
          structedComments: this.data.structedComments.sort((a, b) => a.time - b.time)
        })
      }
      else {
        this.setData({
          commentsSortType: '热度排序',
          structedComments: this.data.structedComments.sort((a, b) => b.likes.length - a.likes.length)
        })
      }
    },
    handleRepliesSort() {
      if (this.data.repliesSortType === '热度排序') {
        this.setData({
          repliesSortType: '时间倒序',
          replies: this.data.replies.sort((a, b) => b.time - a.time)
        })
      }
      else if (this.data.repliesSortType === '时间倒序') {
        this.setData({
          repliesSortType: '时间正序',
          replies: this.data.replies.sort((a, b) => a.time - b.time)
        })
      }
      else {
        this.setData({
          repliesSortType: '热度排序',
          replies: this.data.replies.sort((a, b) => b.likes.length - a.likes.length)
        })
      }
    },
    async handleLike() {
      const currentPost = await app.handlePostLike(this.data.currentPost.id, this.data.currentPost.likes.includes(this.data.currentUserId));
      if (!currentPost) {
        wx.showToast({
          title: '操作失败',
          icon: 'none'
        });
        return;
      }
      this.setData({ currentPost });
    },
    async handleCommentLike(e: WechatMiniprogram.CustomEvent) {
      const commentId = e.currentTarget.dataset.index;
      const structedComments = await app.handleCommentLike(commentId, this.data.structedComments);
      this.setData({ structedComments });
    },
    async handleReplyLike(e: WechatMiniprogram.CustomEvent) {
      const commentId = e.currentTarget.dataset.index[0];
      const replyId = e.currentTarget.dataset.index[1];
      const { structedComments, replies } = await app.handleReplyLike(commentId, replyId, this.data.structedComments);
      this.setData({ structedComments, replies });
    },
    cancelInput() {
      this.setData({ inputVisible: false });
    },
    handleInput(e: WechatMiniprogram.CustomEvent) {
      this.setData({ inputValue: e.detail.value });
    },
    async handleInputSend() {
      if (this.data.inputValue === '') {
        wx.showToast({
          title: '不可发送空白内容',
          icon: 'none'
        });
        return;
      }
      let success = false;
      if (this.data.inputMode === InputMode.Comment) {
        const newComment = new Comment({
          id: -1,
          user: this.data.currentUserId,
          linkedPost: this.data.currentPost.id,
          content: this.data.inputValue,
          time: new Date().getTime(),
          likes: [],
          photos: await Promise.all(this.data.originFiles.map(async (file) => ({ value: await getImageBase64(file.url), ariaLabel: file.name }))),
          parentComment: -1
        });
        if (await app.handleCommentSend(newComment)) {
          success = true;
          await this.onRefresh();
        }
      } else if (this.data.inputMode === InputMode.Reply) {
        const newComment = new Comment({
          id: -1,
          user: this.data.currentUserId,
          linkedPost: this.data.currentPost.id,
          content: this.data.inputValue,
          time: new Date().getTime(),
          likes: [],
          photos: await Promise.all(this.data.originFiles.map(async (file) => ({ value: await getImageBase64(file.url), ariaLabel: file.name }))),
          parentComment: this.data.replyingComment
        });
        if (await app.handleCommentSend(newComment)) {
          success = true;
          await this.onRefresh();
          if (this.data.repliesParent != -1) {
            const replies = this.data.structedComments.find((comment) => comment.id == this.data.repliesParent)?.replies;
            this.setData({ replies });
          }
        }
      }
      if (success) {
        this.setData({
          inputVisible: false,
          inputValue: '',
          inputMode: InputMode.None,
          originFiles: []
        });
      } else {
        wx.showToast({
          title: '发送失败',
          icon: 'none'
        });
      }
    },
    onOptionsVisibleChange() {
      this.setData({
        optionsVisible: !this.data.optionsVisible,
      })
    },
    handleCommentInput() {
      this.setData({ inputVisible: true, inputMode: InputMode.Comment });
    },
    handleReplyInput(e: WechatMiniprogram.CustomEvent) {
      const id = e.currentTarget.dataset.index ?? -1;
      this.setData({
        inputVisible: true,
        inputMode: InputMode.Reply,
        replyingComment: id
      });
    },
    handleImageUploadSuccess(e: WechatMiniprogram.CustomEvent) {
      const { files } = e.detail;
      this.setData({ originFiles: files });
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
    onCommentDelete(e: WechatMiniprogram.CustomEvent) {
      const that = this;
      wx.showModal({
        title: '警告',
        content: '是否确定删除该评论？',
        async success(res) {
          if (res.confirm) {
            const comment = e.currentTarget.dataset.index?.id;
            if (await app.handleCommentDelete(comment)) { await that.onRefresh(); }
            else {
              wx.showToast({
                title: '删除失败',
                icon: 'none'
              });
            }
          } else if (res.cancel) {
            return;
          }
        }
      });
    },
    onReplyDelete(e: WechatMiniprogram.CustomEvent) {
      const that = this;
      wx.showModal({
        title: '警告',
        content: '是否确定删除该回复？',
        async success(res) {
          if (res.confirm) {
            const replyId = e.currentTarget.dataset.index?.id;
            const parentComment = e.currentTarget.dataset.index?.parentComment;
            if (await app.handleReplyDelete(replyId)) {
              await that.onRefresh();
              const replies = that.data.structedComments.find((comment) => comment.id == parentComment)?.replies;
              that.setData({ replies });
            } else {
              wx.showToast({
                title: '删除失败',
                icon: 'none'
              });
            }
          }
        }
      });
    },
    onPostDelete() {
      const that = this;
      wx.showModal({
        title: '警告',
        content: '是否确定删除该帖子？',
        async success(res) {
          if (res.confirm) {
            if (await app.handlePostDelete(that.data.currentPost.id)) {
              wx.navigateBack();
            } else {
              wx.showToast({
                title: '删除失败',
                icon: 'none'
              });
            }
          } else if (res.cancel) {
            return;
          }
        }
      });
    },
    async onPostStickyChange() {
      const currentPost = await app.handlePostStick(new Post(this.data.currentPost));
      if (currentPost) {
        this.setData({ currentPost });
      }
    },
    showUserInfo(e: WechatMiniprogram.CustomEvent){
      const userId = e.currentTarget.dataset.index;
      console.log(userId)
      if (!userId) {
        return;
      } else {
       wx.navigateTo({url: `/pages/userinfo/userinfo?uid=${userId}`})
      }
    }
  }
});