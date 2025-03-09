import { Comment, Post } from "../../utils/channel/post";
import { User } from "../../utils/user/user";
import { formatPostTime, getUserGroupNameInChannel } from "../../utils/util";

const app = getApp<IAppOption>();

enum InputMode { None, Comment, Reply };

function getStructuredComments(postId: number, userList: User[], commentList: Comment[]) {
  const userMap = new Map(userList.map(user => [user.id, user.name]));
  const replyMap = new Map<number, Comment[]>();
  const channelId = app.globalData.currentData.postList.find((post: Post) => post.id == postId)?.linkedChannel;

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
      return [{
        ...reply,
        content: newContent,
        userName: userMap.get(reply.user) || "Unknown",
        userGroup: getUserGroupNameInChannel(userList.find(user => user.id == reply.user)!, channelId!),
        timeStr: formatPostTime(reply.time)
      }, ...collectAllReplies(reply.id, userMap.get(reply.user))];
    }).sort((a, b) => b.likes.length - a.likes.length);
  }

  // 处理顶层评论，并整理其回复列表
  return commentList
    .filter(comment => comment.linkedPost == postId && comment.parentComment == -1)
    .map(topComment => ({
      ...topComment,
      userName: userMap.get(topComment.user) || "Unknown",
      userGroup: getUserGroupNameInChannel(userList.find(user => user.id == topComment.user)!, channelId!),
      replies: collectAllReplies(topComment.id),
      timeStr: formatPostTime(topComment.time)
    }))
    .sort((a, b) => b.likes.length - a.likes.length);
}

Component({
  data: {
    refreshEnable: false,

    currentUserId: app.globalData.currentUserId,
    isChannelAdmin: false,
    currentPost: {} as Post,
    imageProps: { mode: "widthFix" },

    maxHeight: 0,
    author: '',
    authorGroup: '',
    timeStr: '',

    commentList: [] as any[],
    structedComments: [] as any[],
    commentsSortType: '热度排序',

    repliesVisible: false,
    repliesParent: -1,
    replies: [] as any[],
    repliesSortType: '热度排序',

    inputVisible: false,
    inputMode: InputMode.None,
    inputValue: '',
    replyingComment: -1,
    originFiles: [] as any[],
  },
  methods: {
    onLoad(options: any) {
      const { postId } = options;
      const currentPost = app.globalData.currentData.postList.find((post: Post) => post.id == postId);
      this.setData({ currentPost });
      const userGroup = getUserGroupNameInChannel(
        app.globalData.currentData.userList.find((user: any) => user.id == app.globalData.currentUserId),
        currentPost?.linkedChannel!
      )
      this.setData({
        isChannelAdmin: userGroup === '系统管理员' || userGroup === '频道主' || userGroup === '频道管理员',
      });
    },
    onShow() {
      const author = app.globalData.currentData.userList.find((user: User) => user.id == this.data.currentPost?.user)?.name;
      const authorGroup = getUserGroupNameInChannel(
        new User(app.globalData.currentData.userList.find((user: User) => user.id == this.data.currentPost?.user)!),
        this.data.currentPost?.linkedChannel!
      );
      const timeStr = this.data.currentPost ? formatPostTime(this.data.currentPost.time) : '';
      const structedComments = getStructuredComments(
        this.data.currentPost.id,
        app.globalData.currentData.userList.map((user: User) => new User(user)),
        app.globalData.currentData.commentList.map((comment: User) => new Comment(comment))
      );
      this.setData({
        commentList: app.globalData.currentData.commentList,
        author: author,
        authorGroup: authorGroup,
        timeStr: timeStr,
        structedComments: structedComments
      });
    },
    onRefresh() {
      this.setData({ refreshEnable: true });
      setTimeout(() => {
        this.setData({ refreshEnable: false });
      }, 500);
      this.onShow();
    },
    onImageLoad(e: any) {
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
    handleRepliesDetail(e: any) {
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
    handleLike() {
      const currentPost = new Post(this.data.currentPost);
      if (currentPost.likes.includes(this.data.currentUserId)) {
        currentPost.likes = currentPost.likes.filter(id => id !== this.data.currentUserId);
      } else {
        currentPost.likes.push(this.data.currentUserId);
      }
      const newPostList = app.globalData.currentData.postList.map((post: Post) => new Post(post));
      newPostList.find((post: Post) => post.id == currentPost.id).likes = currentPost.likes;
      app.globalData.currentData.postList = newPostList;
      this.setData({ currentPost });
    },
    handleCommentLike(e: any) {
      const commentId = e.currentTarget.dataset.index;
      const structedComments = JSON.parse(JSON.stringify(this.data.structedComments));
      const comment = structedComments.find((comment: any) => comment.id == commentId);
      if (comment.likes.includes(this.data.currentUserId)) {
        comment.likes = comment.likes.filter((id: any) => id !== this.data.currentUserId);
      } else {
        comment.likes.push(this.data.currentUserId);
      }

      const newCommentList = this.data.commentList;
      newCommentList.find((comment: any) => comment.id == commentId).likes = comment.likes;
      this.setData({
        structedComments: structedComments,
        commentList: newCommentList
      });
      app.globalData.currentData.commentList = newCommentList;
    },
    handleReplyLike(e: any) {
      const commentId = e.currentTarget.dataset.index[0];
      const replyId = e.currentTarget.dataset.index[1];

      const structedComments = JSON.parse(JSON.stringify(this.data.structedComments));
      const comment = structedComments.find((comment: any) => comment.id == commentId);
      const reply = comment.replies.find((reply: any) => reply.id == replyId);

      if (reply.likes.includes(this.data.currentUserId)) {
        reply.likes = reply.likes.filter((id: any) => id !== this.data.currentUserId);
      } else {
        reply.likes.push(this.data.currentUserId);
      }

      const newCommentList = this.data.commentList;
      newCommentList.find((comment: any) => comment.id == replyId).likes = reply.likes;

      this.setData({
        structedComments: structedComments,
        replies: comment.replies,
        commentList: newCommentList
      });
      app.globalData.currentData.commentList = newCommentList;
    },
    cancelInput() {
      this.setData({ inputVisible: false });
    },
    handleInput(e: any) {
      this.setData({ inputValue: e.detail.value });
    },
    handleInputSend() {
      if (this.data.inputValue === '') {
        wx.showToast({
          title: '不可发送空白内容',
          icon: 'none'
        });
        return;
      }
      if (this.data.inputMode === InputMode.Comment) {
        const newCommentId = this.data.commentList.length + 1;
        const newComment = new Comment({
          id: newCommentId,
          user: this.data.currentUserId,
          linkedPost: this.data.currentPost.id,
          content: this.data.inputValue,
          time: new Date().getTime(),
          likes: [],
          photos: this.data.originFiles.map((file: any) => ({ value: file.url, ariaLabel: file.name })),
          parentComment: -1
        });
        const newCommentList = this.data.commentList.map((comment: any) => new Comment(comment));
        newCommentList.push(newComment);
        app.globalData.currentData.commentList = newCommentList;
        this.onRefresh();
      } else if (this.data.inputMode === InputMode.Reply) {
        const newCommentId = this.data.commentList.length + 1;
        const newComment = new Comment({
          id: newCommentId,
          user: this.data.currentUserId,
          linkedPost: this.data.currentPost.id,
          content: this.data.inputValue,
          time: new Date().getTime(),
          likes: [],
          photos: this.data.originFiles.map((file: any) => ({ value: file.url, ariaLabel: file.name })),
          parentComment: this.data.replyingComment
        });
        const newCommentList = this.data.commentList.map((comment: any) => new Comment(comment));
        newCommentList.push(newComment);
        app.globalData.currentData.commentList = newCommentList;
        this.onRefresh();
        if (this.data.repliesParent != -1) {
          const replies = this.data.structedComments.find((comment: any) => comment.id == this.data.repliesParent).replies;
          this.setData({ replies });
        }
      }
      this.setData({
        inputVisible: false,
        inputValue: '',
        inputMode: InputMode.None,
        originFiles: []
      });
    },
    handleCommentInput() {
      this.setData({
        inputVisible: true,
        inputMode: InputMode.Comment,
      });
    },
    handleReplyInput(e: any) {
      const id = e.currentTarget.dataset.index ?? -1;
      this.setData({
        inputVisible: true,
        inputMode: InputMode.Reply,
        replyingComment: id
      });
    },
    handleImageUploadSuccess(e: any) {
      const { files } = e.detail;
      this.setData({
        originFiles: files,
      });
    },
    handleImageUploadRemove(e: any) {
      const { index } = e.detail;
      const { originFiles } = this.data;
      originFiles.splice(index, 1);
      this.setData({
        originFiles,
      });
    },
    handleImageUploadClick(e: any) {
      console.log(e.detail.file);
    },
    handleImageUploadDrop(e: any) {
      const { files } = e.detail;
      this.setData({
        originFiles: files,
      });
    },
    onCommentDelete(e: any) {
      const that = this;
      wx.showModal({
        title: '警告',
        content: '是否确定删除该评论？',
        success(res) {
          if (res.confirm) {
            const comment = e.currentTarget.dataset.index?.id;
            const replies = e.currentTarget.dataset.index?.replies;
            const newCommentList = that.data.commentList.filter((c: any) => c.id !== comment && !replies.map((r: any) => r.id).includes(c.id));
            app.globalData.currentData.commentList = newCommentList;
            that.onRefresh();
          } else if (res.cancel) {
            return;
          }
        }
      });
    },
    onReplyDelete(e: any) {
      const that = this;
      wx.showModal({
        title: '警告',
        content: '是否确定删除该回复？',
        success(res) {
          if (res.confirm) {
            const replyId = e.currentTarget.dataset.index?.id;
            const parentComment = e.currentTarget.dataset.index?.parentComment;
            const commentList = that.data.commentList;
            // 递归获取所有子回复的 id
            function getAllDescendantIds(parentId: number): number[] {
              const childReplies = commentList.filter((c: any) => c.parentComment === parentId);
              return childReplies.reduce((acc: number[], current: any) => {
                return acc.concat(current.id, getAllDescendantIds(current.id));
              }, []);
            }
            const idsToDelete = [replyId, ...getAllDescendantIds(replyId)];
            const newCommentList = commentList.filter((c: any) => !idsToDelete.includes(c.id));
            app.globalData.currentData.commentList = newCommentList;
            that.onRefresh();
            const replies = that.data.structedComments.find((comment: any) => comment.id == parentComment).replies;
            that.setData({ replies });
          }
        }
      });
    },
    onPostDelete() {
      const that = this;
      wx.showModal({
        title: '警告',
        content: '是否确定删除该帖子？',
        success(res) {
          if (res.confirm) {
            const newCommentList = app.globalData.currentData.commentList.filter((comment: any) => comment.linkedPost !== that.data.currentPost.id);
            const newPostList = app.globalData.currentData.postList.filter((post: any) => post.id !== that.data.currentPost.id);
            app.globalData.currentData.postList = newPostList;
            app.globalData.currentData.commentList = newCommentList;
            wx.navigateBack();
          } else if (res.cancel) {
            return;
          }
        }
      });
    },
    onPostStickyChange(){
      const currentPost = new Post(this.data.currentPost);
      currentPost.isSticky = !currentPost.isSticky;
      const newPostList = app.globalData.currentData.postList.map((post: Post) => new Post(post));
      newPostList.find((post: Post) => post.id == currentPost.id).isSticky = currentPost.isSticky;
      app.globalData.currentData.postList = newPostList;
      this.setData({ currentPost });
    }
  }
});