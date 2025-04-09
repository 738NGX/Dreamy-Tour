/*
 * @Author: Franctoryer 
 * @Date: 2025-04-07 13:56:28 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-04-07 20:25:01
 */
class CommentUtil {
  /**
   * 是否有权限在该帖子下发评论
   * 只有加入这个频道，才可以对这个频道的帖子发评论
   * @param uid 用户 ID
   * @param postId 帖子 ID
   */
  static async hasPublushPermission(
    uid: number, postId: number
  ): Promise<boolean> {
    return true;
  }

  /**
   * 是否有权限删除该条评论
   * 只有发帖者、频道主、频道管理员、系统管理员可以删除帖子
   * @param uid 用户 ID
   * @param roleId 角色 ID
   * @param commentId 评论 ID
   */
  static async hasDeletePermission(
    uid: number, roleId: number, commentId: number
  ): Promise<boolean> {
    return true;
  }
}

export default CommentUtil;