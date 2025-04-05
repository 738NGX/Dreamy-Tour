interface PostDetailBo {
  // 帖子 ID
  postId: number
  // 频道 ID
  channelId: number
  // 帖子图片
  pictureUrls: string
  // 帖子标题
  title: string
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
  postCreatedAt: number
  // 帖子更新时间
  postUpdatedAt: number
  // 用户 ID
  uid: number
  // 用户昵称
  nickname: string
  // 用户头像
  avatarUrl: string
  // 角色 ID
  roleId: number
  // 在频道的角色类型
  channelRole: string
  // 用户创建时间
  userCreatedAt: number
  // 用户更新时间
  userUpdatedAt: number
  // 该用户是否点赞该帖子
  isLiked: number
  // 该用户是否收藏该帖子
  isFavorite: number
}

export default PostDetailBo;