/*
 * 帖子相关业务逻辑
 * @Author: Franctoryer 
 * @Date: 2025-03-03 13:59:07 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-10 11:38:10
 */

import dbPromise from "@/config/databaseConfig";
import PostPublishDto from "@/dto/post/postPublishDto";

class PostService {
  /**
   * 发布帖子
   * @param postPublishDto 发布帖子需要的参数
   */
  static async publish(postPublishDto: PostPublishDto): Promise<void> {
    
  }

  /**
   * 某个用户收藏某个帖子
   * @param uid 用户 ID
   * @param postId 帖子 ID
   */
  static async favorite(uid: number, postId: number): Promise<void> {
    const db = await dbPromise;
    // 如果存在收藏记录，不重复插入；如果不存在点赞记录，插入点赞记录（使用子查询减少数据库查询次数）
    await db.run(
      `
      INSERT INTO post_favorites (uid, postId, createdAt, updatedAt)
      SELECT ?1, ?2, ?3, ?4
      WHERE NOT EXISTS (
        SELECT 1 FROM post_favorites 
        WHERE user_id = ?1 AND post_id = ?2
      )
      `,
      [
        uid,
        postId,
        Date.now(),
        Date.now()
      ]
    )
  }

  /**
   * 某个用户取消收藏某个帖子
   * @param uid 用户 ID
   * @param postId 帖子 ID
   */
  static async unFavorite(uid: number, postId: number): Promise<void> {
    const db = await dbPromise;
    await db.run(
      `DELETE FROM post_favorites WHERE uid = ? AND postId = ?`,
      [
        uid,
        postId
      ]
    )
  }

  /**
   * 某个用户点赞某个帖子
   * @param uid 
   * @param postId 
   */
  static async like(uid: number, postId: number): Promise<void> {
    const db = await dbPromise;
    // 如果存在点赞记录，不重复插入；如果不存在点赞记录，插入点赞记录（使用子查询减少数据库查询次数）
    await db.run(
      `
      INSERT INTO post_likes (uid, postId, createdAt, updatedAt)
      SELECT ?1, ?2, ?3, ?4
      WHERE NOT EXISTS (
        SELECT 1 FROM post_likes
        WHERE user_id = ?1 AND post_id = ?2
      )
      `,
      [
        uid,
        postId,
        Date.now(),
        Date.now()
      ]
    )
  }

  /**
   * 某个用户取消点赞某个帖子
   * @param uid 
   * @param postId 
   */
  static async unLike(uid: number, postId: number): Promise<void> {
    const db = await dbPromise;
    await db.run(
      `DELETE FROM post_likes WHERE uid = ? AND postId = ?`,
      [
        uid,
        postId
      ]
    )
  }

  /**
   * 获取公共频道的帖子文本
   */
  static async getPublicPostList() {

  }

  /**
   * 获取某一特定频道下的帖子列表
   */
  static async getPostListByChannelId() {

  }
}

export default PostService;