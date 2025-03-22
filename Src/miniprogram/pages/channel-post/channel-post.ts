/**
 * 具体的帖子界面
 */
import { Comment, Post } from "../../utils/channel/post";
import { User } from "../../utils/user/user";
import { formatPostTime, getNewId, getUserGroupNameInChannel } from "../../utils/util";

const app = getApp<IAppOption>();

enum InputMode { None, Comment, Reply };

function getStructuredComments(postId: number, userList: User[], commentList: Comment[]) {
  const userMap = new Map(userList.map(user => [user.id, user.name]));
  const replyMap = new Map<number, Comment[]>();
  const channelId = app.getPost(postId)?.linkedChannel;

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
      const currentPost = app.getPost(parseInt(postId));
      this.setData({ currentPost });
      const userGroup = getUserGroupNameInChannel(
        app.currentUser(),
        currentPost?.linkedChannel!
      )
      this.setData({
        isChannelAdmin: userGroup === '系统管理员' || userGroup === '频道主' || userGroup === '频道管理员',
      });
    },
    onShow() {
      const author = app.getUser(this.data.currentPost.user)?.name;
      const authorGroup = getUserGroupNameInChannel(
        app.getUser(this.data.currentPost.user)!,
        this.data.currentPost?.linkedChannel!
      );
      const timeStr = this.data.currentPost ? formatPostTime(this.data.currentPost.time) : '';
      const structedComments = getStructuredComments(
        this.data.currentPost.id,
        app.getUserListCopy(),
        app.getCommentListCopy()
      );
      this.setData({
        commentList: app.getCommentListCopy(),
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
    handleLike() {
      const currentPost = new Post(this.data.currentPost);
      if (currentPost.likes.includes(this.data.currentUserId)) {
        currentPost.likes = currentPost.likes.filter(id => id !== this.data.currentUserId);
      } else {
        currentPost.likes.push(this.data.currentUserId);
      }
      app.updatePost(currentPost);
      this.setData({ currentPost });
    },
    handleCommentLike(e: WechatMiniprogram.CustomEvent) {
      const commentId = e.currentTarget.dataset.index;
      const structedComments = JSON.parse(JSON.stringify(this.data.structedComments));
      const comment = structedComments.find((comment: any) => comment.id == commentId);
      if (comment.likes.includes(this.data.currentUserId)) {
        comment.likes = comment.likes.filter((id: any) => id !== this.data.currentUserId);
      } else {
        comment.likes.push(this.data.currentUserId);
      }
      const newComment = app.getComment(commentId) as Comment;
      newComment.likes = comment.likes;
      app.updateComment(newComment);
      this.setData({ structedComments });
    },
    handleReplyLike(e: WechatMiniprogram.CustomEvent) {
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

      const newComment = app.getComment(replyId) as Comment;
      newComment.likes = reply.likes;
      app.updateComment(newComment);

      this.setData({
        structedComments: structedComments,
        replies: comment.replies,
      });
    },
    cancelInput() {
      this.setData({ inputVisible: false });
    },
    handleInput(e: WechatMiniprogram.CustomEvent) {
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
      const newCommentId = getNewId(app.globalData.currentData.commentList);
      if (this.data.inputMode === InputMode.Comment) {
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
        app.addComment(newComment);
        this.onRefresh();
      } else if (this.data.inputMode === InputMode.Reply) {
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
        app.addComment(newComment);
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
    onCommentDelete(e: WechatMiniprogram.CustomEvent) {
      const that = this;
      wx.showModal({
        title: '警告',
        content: '是否确定删除该评论？',
        success(res) {
          if (res.confirm) {
            const comment = e.currentTarget.dataset.index?.id;
            // 递归移除指定评论及其所有回复
            function removeRecursively(commentId: number) {
              const commentList = app.getCommentListCopy();
              const childReplies = commentList.filter((c: any) => c.parentComment === commentId);
              childReplies.forEach(reply => removeRecursively(reply.id));
              app.removeComment(commentId);
            }
            removeRecursively(comment);
            that.onRefresh();
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
        success(res) {
          if (res.confirm) {
            const replyId = e.currentTarget.dataset.index?.id;
            const parentComment = e.currentTarget.dataset.index?.parentComment;
            const commentList = app.getCommentListCopy();
            // 递归获取所有子回复的 id
            function getAllDescendantIds(parentId: number): number[] {
              const childReplies = commentList.filter((c) => c.parentComment === parentId);
              return childReplies.reduce((acc: number[], current) => {
                return acc.concat(current.id, getAllDescendantIds(current.id));
              }, []);
            }
            const idsToDelete = [replyId, ...getAllDescendantIds(replyId)];
            idsToDelete.forEach(id => { app.removeComment(id); });
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
            app.getCommentListCopy().forEach((comment: any) => {
              if (comment.linkedPost === that.data.currentPost.id) {
                app.removeComment(comment.id);
              }
            });
            app.removePost(that.data.currentPost);
            wx.navigateBack();
          } else if (res.cancel) {
            return;
          }
        }
      });
    },
    onPostStickyChange() {
      const currentPost = new Post(this.data.currentPost);
      currentPost.isSticky = !currentPost.isSticky;
      app.updatePost(currentPost);
      this.setData({ currentPost });
    }
  }
});