/*
 * 评论实体类
 * @Author: Franctoryer 
 * @Date: 2025-03-08 00:00:00 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-08 15:14:56
 */

class Comment {
  // 评论 ID
  commentId: number;

  // 发表评论的用户 ID
  uid: number;

  // 评论所属的帖子 ID
  postId: number;

  // 父评论 ID，如果是顶级评论则为 null 或 0
  parentId: number;

  // 根评论 ID，用于标识评论链的根
  rootId: number;

  // 评论内容
  content: string;

  // 创建时间
  createdAt: number;

  // 更新时间
  updatedAt: number;
}

export default Comment;