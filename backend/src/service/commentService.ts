import CommentPublishDto from "@/dto/comment/commentPublishDto";

/*
 * 评论相关业务
 * @Author: Franctoryer 
 * @Date: 2025-04-05 19:07:49 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-04-05 20:09:30
 */
class CommentService {
  /**
   * 获取某一帖子的所有评论
   * @param postId 帖子 ID
   * @param uid 用户 ID
   */
  static async getCommentsByPostId(
    postId: number, 
    uid: number,
    commentPublishDto: CommentPublishDto
  ) {
    
  }
  
  /**
   * 发布一条评论
   * @param postId 帖子 ID
   * @param uid 用户 ID
   */
  static async publish(postId: number, uid: number) {

  }

  /**
   * 点赞某个评论
   * @param commentId 评论 ID
   * @param uid 用户 ID
   */
  static async like(commentId: number, uid: number) {

  }

  /**
   * 取消点赞某个评论
   * @param commentId 评论 ID
   * @param uid 用户 ID
   */
  static async unLike(commentId: number, uid: number) {

  }

  /**
   * 删除一条评论
   * @param commentId 
   * @param uid 
   * @param roleId 
   */
  static async delete(commentId: number, uid: number, roleId: number) {

  }
}

export default CommentService;