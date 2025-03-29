import VO from "@/base/vo";

/**
 * 帖子列表要展示的数据
 */
class PostListVo extends VO<PostListVo> {
  // 用户相关信息
  user: {
     // 用户 ID
    uid: number
    // 昵称
    nickname: string
    // 头像地址
    avatarUrl: string
    // 角色类型
    role: string
    // 创建时间
    createdAt: number
    // 更新时间
    updatedAt: number
  }
  // 帖子行为相关信息
  action: {
    isLiked: boolean
  }
  // 帖子 ID
  postId: number
  // 帖子所在频道 ID
  channelId: number
  // 图片地址
  pictureUrl: string
  // 帖子标题
  title: string
  // 是否置顶
  isSticky: boolean
  // 创建时间
  createdAt: number
  // 更新时间
  updatedAt: number
}

export default PostListVo