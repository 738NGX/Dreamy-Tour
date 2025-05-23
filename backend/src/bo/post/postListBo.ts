interface PostListBo {
  // 帖子 ID
  postId: number
  // 频道 ID
  channelId: number
  // 帖子图片
  pictureUrls: string
  // 帖子标题
  title: string
  // 是否置顶
  isSticky: number
  // 点赞数
  likeSum: number
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
  // 用户创建时间
  userCreatedAt: number
  // 用户更新时间
  userUpdatedAt: number
  // 该用户是否点赞该帖子
  isLiked: number
}

export default PostListBo;