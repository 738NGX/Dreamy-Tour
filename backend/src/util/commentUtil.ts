/*
 * @Author: Franctoryer 
 * @Date: 2025-04-07 13:56:28 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-04-07 19:56:24
 */
class CommentUtil {
  /**
   * 是否有权限在该帖子下发评论
   * @param uid 用户 ID
   * @param channelId 频道 ID
   */
  static async hasPublushPermission(
    uid: number, channelId: number
  ): Promise<boolean> {
    return true;
  }

  /**
   * 是否有权限删除该条评论
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