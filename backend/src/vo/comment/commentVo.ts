import VO from "@/base/vo";

class CommentVo extends VO<CommentVo> {
  // 评论 ID
  commentId: number;

  // 发表评论的用户 ID
  uid: number;

  // 评论所属的帖子 ID
  postId: number;

  // 评论图片
  pictureUrls: string[];

  // 父评论 ID，如果是顶级评论则为 null 或 0
  parentId: number;

  // 根评论 ID，用于标识评论链的根
  rootId: number;

  // 评论内容
  content: string;

  // 点赞数
  likeSum: number;

  // 是否点赞该评论
  isLiked: boolean

  // 创建时间
  createdAt: number;

  // 更新时间
  updatedAt: number;
}

export default CommentVo;