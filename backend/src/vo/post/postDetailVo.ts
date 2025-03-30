import VO from "@/base/vo";

class PostDetailVo extends VO<PostDetailVo> {
  // 帖子 ID
  postId: number
  // 帖子标题
  title: string
  // 所在的频道 ID
  channelId: number
  // 帖子图片 URL
  pictureUrls: string[]
  // 帖子正文
  content: string
  // 点赞数
  likeSum: number
  // 评论数
  commentSum: number
  // 转发数
  forwardSum: number
  // 收藏数
  favoriteSum: number
  // 帖子创建时间
  createdAt: number
  // 帖子更新时间
  updatedAt: number
  // 用户相关信息
  user: {
    // 用户 ID
    uid: number
    // 用户昵称
    nickname: string
    // 头像地址
    avatarUrl: string
    // 角色
    role: string
    // 用户创建时间
    createdAt: number
    // 用户更新时间
    updatedAt: number
  }
  // 用户行为
  action: {
    // 是否点赞
    isLiked: boolean
    // 是否收藏
    isFavorite: boolean
  }
}

export default PostDetailVo