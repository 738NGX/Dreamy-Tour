/*
 * 帖子实体类
 * @Author: Franctoryer 
 * @Date: 2025-03-08 15:11:10 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-08 15:12:57
 */

class Post {
  // 帖子 ID
  postId: number

  // 发布该帖子的用户 ID
  uid: number

  // 帖子所属的频道 ID
  channelId: number

  // 帖子所属的分类 ID
  categoryId: number

  // 帖子标题，唯一
  title: string

  // 帖子图片的 URL 集合，以文本形式存储
  pictureUrls: string

  // 帖子内容
  content: string

  // 帖子的点击总数
  clickSum: number

  // 帖子的点赞总数
  likeSum: number

  // 帖子的评论总数
  commentSum: number

  // 帖子的转发总数
  forwardSum: number

  // 帖子的状态
  status: number

  // 发布帖子的 IP 地址
  ipAddress: string

  // 发布帖子的位置信息（JSON 字符串）
  location: string

  // 帖子的热度评分
  hotScore: number

  // 是否置顶（0 不置顶 / 1 置顶）
  isSticky: number

  // 置顶过期时间
  stickyExpiredTime: number

  // 创建时间
  createdAt: number

  // 更新时间
  updatedAt: number
}

export default Post;