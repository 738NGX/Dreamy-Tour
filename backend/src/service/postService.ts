/*
 * 帖子相关业务逻辑
 * @Author: Franctoryer 
 * @Date: 2025-03-03 13:59:07 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-25 21:26:51
 */

import PostListBo from "@/bo/post/postListBo";
import dbPromise from "@/config/databaseConfig";
import ChannelConstant from "@/constant/channelConstant";
import CosConstant from "@/constant/cosConstant";
import PostConstant from "@/constant/postConstant";
import PostPublishDto from "@/dto/post/postPublishDto";
import ParamsError from "@/exception/paramsError";
import CosUtil from "@/util/cosUtil";
import RoleUtil from "@/util/roleUtil";
import PostListVo from "@/vo/post/postListVo";

class PostService {
  /**
   * 发布帖子
   * @param postPublishDto 发布帖子需要的参数
   */
  static async publish(postPublishDto: PostPublishDto): Promise<void> {
    // 异步将帖子图片上传至腾讯云 COS
    const pictures = postPublishDto.pictures;
    if (!pictures) {
      throw new ParamsError("没有上传图片");
    }
    const uploadPromises = pictures.map(async (picture, index) => {
      return await CosUtil.uploadBase64Picture(
        CosConstant.POST_PICTURES_FOLDER, 
        picture
      );
    })
    // 异步上传所有文件
    const fileUrlList = await Promise.all(uploadPromises);
    // 用逗号拼接各个 url
    const urls = fileUrlList.join(',')
    // 将帖子信息、图片地址保存至数据库
    const db = await dbPromise;
    await db.run(
      `
      INSERT INTO posts (
        uid, channelId, title, pictureUrls, content, 
        clickSum, likeSum, commentSum, forwardSum,
        status, hotScore, isSticky, createdAt, updatedAt
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?
      )
      `,
      [
        postPublishDto.uid, postPublishDto.channelId, postPublishDto.title, urls, postPublishDto.content,
        0, 0, 0, 0,
        PostConstant.VISIBLE, 0, PostConstant.UNSTICKY, Date.now(), Date.now()
      ]
    )
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
        WHERE uid = ?1 AND postId = ?2
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
      INSERT INTO likes (uid, objType, objId, createdAt, updatedAt)
      SELECT ?1, 0, ?2, ?3, ?4
      WHERE NOT EXISTS (
        SELECT 1 FROM likes
        WHERE uid = ?1 AND objType = 0 AND objId = ?2
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
      `
      DELETE FROM likes 
      WHERE uid = ? AND objType = 0 AND objId = ?
      `,
      [
        uid,
        postId
      ]
    )
  }

  /**
   * 获取公共频道的帖子文本
   * @param uid 用户 ID
   */
  static async getPublicPostList(uid: number): Promise<PostListVo[]> {
    return await this.getPostListByChannelId(
      uid, ChannelConstant.WORLD_CHANNEL_ID
    );
  }

  /**
   * 获取某一特定频道下的帖子列表
   * @param uid 用户 ID
   * @param channelId 频道 ID
   */
  static async getPostListByChannelId(uid: number, channelId: number): Promise<PostListVo[]> {
    const db = await dbPromise;
    const rows = await db.all<PostListBo[]>(
      `
      SELECT 
        posts.postId AS postId,
        posts.channelId As channelId,
        posts.pictureUrls AS pictureUrls,
        posts.title AS title,
        posts.isSticky AS isSticky,
        posts.createdAt AS postCreatedAt,
        posts.updatedAt AS postUpdatedAt,
        users.uid AS uid,
        users.nickname AS nickname,
        users.avatarUrl AS avatarUrl,
        users.roleId AS roleId,
        users.createdAt AS userCreatedAt,
        users.updatedAt AS userUpdatedAt,
        CASE WHEN post_likes.uid IS NOT NULL THEN 1 ELSE 0 END AS isLiked
      FROM posts
      INNER JOIN users ON posts.uid = users.uid
      LEFT JOIN post_likes 
        ON posts.postId = post_likes.postId 
        AND post_likes.uid = ?
      WHERE posts.channelId = ?
      ORDER BY posts.isSticky DESC, posts.createdAt DESC
      `,
      [
        uid,
        channelId
      ]
    );

    return rows.map(row => new PostListVo({
      postId: row.postId,
      channelId: row.channelId,
      pictureUrl: row.pictureUrls.split(",")[0],
      title: row.title,
      isSticky: Boolean(row.isSticky),
      createdAt: row.postCreatedAt,
      updatedAt: row.postUpdatedAt,
      user: {
        uid: row.uid,
        nickname: row.nickname,
        avatarUrl: row.avatarUrl,
        role: RoleUtil.roleNumberToString(row.roleId),
        createdAt: row.userCreatedAt,
        updatedAt: row.userUpdatedAt
      },
      action: {
        isLiked: Boolean(row.isLiked)
      }
    }))
  }
}

export default PostService;