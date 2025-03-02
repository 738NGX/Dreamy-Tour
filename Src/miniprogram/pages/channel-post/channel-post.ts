import { Comment, Post } from "../../utils/channel/post";
import { commentList, postList, userList } from "../../utils/testData";
import { User } from "../../utils/user/user";
import { formatPostTime, getUserGroupNameInChannel } from "../../utils/util";

function getStructuredComments(postId: number, userList: User[], commentList: Comment[]) {
  const userMap = new Map(userList.map(user => [user.id, user.name]));
  const replyMap = new Map<number, Comment[]>();
  const channelId = postList.find(post => post.id == postId)?.linkedChannel;

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
        newContent = `回复${parentUserName}：${reply.content}`;
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
    currentPost: {} as Post,
    currentPhotoIndex: 0,
    imageProps: {
      mode: "widthFix",
    },
    maxHeight: 0,
    author: '',
    authorGroup: '',
    timeStr: '',
    structedComments: [] as any[],
    commentsSortType: '热度排序',
    repliesVisible: false,
    replies: [] as any[],
    repliesSortType: '热度排序',
  },
  methods: {
    onLoad(options: any) {
      const { postId } = options;
      const currentPost = postList.find(post => post.id == postId);
      const author = userList.find(user => user.id == currentPost?.user)?.name;
      const authorGroup = getUserGroupNameInChannel(new User(userList.find(user => user.id == currentPost?.user)!), currentPost?.linkedChannel!);
      const timeStr = currentPost ? formatPostTime(currentPost.time) : '';
      const structedComments = getStructuredComments(
        postId,
        userList.map(user => new User(user)),
        commentList.map(comment => new Comment(comment))
      );
      this.setData({
        currentPost: currentPost,
        author: author,
        authorGroup: authorGroup,
        timeStr: timeStr,
        structedComments: structedComments
      });
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
      const replies = e.currentTarget.dataset.index?.replies;
      this.setData({
        repliesVisible: !this.data.repliesVisible,
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
    }
  },
})