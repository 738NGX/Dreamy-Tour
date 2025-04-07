/*
 * 帖子相关业务逻辑
 * @Author: Franctoryer 
 * @Date: 2025-03-03 13:59:07 
 * @Last Modified by: Choihyobin
 * @Last Modified time: 2025-04-07 22:06
 */

import PostDetailBo from "@/bo/post/postDetailBo";
import PostListBo from "@/bo/post/postListBo";
import dbPromise from "@/config/databaseConfig";
import ChannelConstant from "@/constant/channelConstant";
import CosConstant from "@/constant/cosConstant";
import PostConstant from "@/constant/postConstant";
import PageDto from "@/dto/common/pageDto";
import PostPublishDto from "@/dto/post/postPublishDto";
import ForbiddenError from "@/exception/forbiddenError";
import NotFoundError from "@/exception/notFoundError";
import ParamsError from "@/exception/paramsError";
import CosUtil from "@/util/cosUtil";
import PostUtil from "@/util/postUtil";
import RoleUtil from "@/util/roleUtil";
import Page from "@/vo/common/page";
import PostDetailVo from "@/vo/post/postDetailVo";
import PostListVo from "@/vo/post/postListVo";

class PostService {
  /**
   * 发布帖子
   * @param postPublishDto 发布帖子需要的参数
   */
  static async publish(postPublishDto: PostPublishDto): Promise<void> {
    if (
      !await PostUtil.hasPublishPermission(
        postPublishDto.uid, postPublishDto.channelId
      )
    ) {
      throw new ForbiddenError("请先加入该频道后再发布帖子！")
    }
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
        clickSum, likeSum, commentSum, forwardSum, favoriteSum,
        status, hotScore, isSticky, createdAt, updatedAt
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?
      )
      `,
      [
        postPublishDto.uid, postPublishDto.channelId, postPublishDto.title, urls, postPublishDto.content,
        0, 0, 0, 0, 0,
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
   * 获取公共频道的帖子列表（有分页）
   * @param uid 用户 ID
   */
  static async getPublicPostListWithPagination(
    uid: number,
    pageDto: PageDto
  ): Promise<Page<PostListVo>> {
    return await this.getPostListByChannelIdWithPagination(
      uid, ChannelConstant.WORLD_CHANNEL_ID, pageDto
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
        posts.likeSum AS likeSum,
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
      likeSum: row.likeSum,
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
    }));
  }

  static async getPostListByChannelIdWithPagination(
    uid: number, channelId: number, pageDto: PageDto
  ): Promise<Page<PostListVo>> {
    // 获取分页参数
    const pageNum = pageDto.pageNum;
    const pageSize = pageDto.pageSize;
    // 先查总数据量
    const db = await dbPromise;
    const { total } = await db.get<{total: number}>(
      `
      SELECT COUNT(*) AS total FROM posts
      WHERE channelId = ?  
      `,
      [channelId]
    ) as {total: number}
    // 查数据
    const rows = await db.all<PostListBo[]>(
      `
      SELECT 
        posts.postId AS postId,
        posts.channelId As channelId,
        posts.pictureUrls AS pictureUrls,
        posts.title AS title,
        posts.isSticky AS isSticky,
        posts.likeSum AS likeSum,
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
      LIMIT ? OFFSET ?
      `,
      [
        uid,
        channelId,
        pageSize,
        (pageNum - 1) * pageSize
      ]
    );
    // 封装 VO
    const postListVos = rows.map(row => new PostListVo({
      postId: row.postId,
      channelId: row.channelId,
      pictureUrl: row.pictureUrls.split(",")[0],
      title: row.title,
      isSticky: Boolean(row.isSticky),
      likeSum: row.likeSum,
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
    }));
    // 返回分页数据
    return new Page({
      total: total,
      currentPage: pageNum,
      records: postListVos
    });
  }

  /**
   * 置顶某个帖子
   * @param postId 帖子 ID
   * @param uid 用户 ID
   * @param roleId 角色 ID
   */
  static async top(postId: number, uid: number, roleId: number): Promise<void> {
    if (!await PostUtil.hasTopPermission(uid, roleId, postId)) {
      throw new ForbiddenError("您没有权限置顶该帖子！")
    }
    // 更新该帖子的 isSticky 字段
    const db = await dbPromise;
    await db.run(
      `
      UPDATE posts SET isSticky = 1
      WHERE postId = ?
      `,
      [postId]
    )
  }

  /**
   * 取消置顶某个帖子
   * @param postId 帖子 ID
   * @param uid 用户 ID
   * @param roleId 角色 ID
   */
  static async unTop(postId: number, uid: number, roleId: number): Promise<void> {
    if (!await PostUtil.hasTopPermission(uid, roleId, postId)) {
      throw new ForbiddenError("您没有权限置顶该帖子！")
    }
    // 更新该帖子的 isSticky 字段
    const db = await dbPromise;
    await db.run(
      `
      UPDATE posts SET isSticky = 0
      WHERE postId = ?
      `,
      [postId]
    )
  }

  /**
   * 删除某个帖子
   * @param postId 帖子 ID
   * @param uid 用户 ID
   * @param roleId 角色 ID
   */
  static async delete(postId: number, uid: number, roleId: number): Promise<void> {
    if (!await PostUtil.hasDeletePermission(uid, roleId, postId)) {
      throw new ForbiddenError("您没有权限删除该帖子");
    }
    // 删除该帖子
    const db = await dbPromise;
    // TODO: 异步删除 COS 上的帖子图片
    await db.run(
      `
      DELETE FROM posts WHERE postId = ?
      `,
      [postId]
    )
  }

  /**
   * 获取某用户点赞过的帖子
   * @param uid 用户 ID
   */
  static async getLikedPostList(uid: number) {
    const db = await dbPromise;
    const rows = await db.all<PostListBo[]>(
      `
      SELECT 
        p.postId,
        p.channelId,
        p.pictureUrls,
        p.title,
        p.isSticky,
        p.likeSum,
        p.createdAt AS postCreatedAt,
        p.updatedAt AS postUpdatedAt,
        u.uid,
        u.nickname,
        u.avatarUrl,
        u.roleId,
        u.createdAt AS userCreatedAt,
        u.updatedAt AS userUpdatedAt,
        pl.createdAt AS likeTime
      FROM posts p
      INNER JOIN users u ON p.uid = u.uid
      INNER JOIN post_likes pl ON 
        p.postId = pl.postId AND 
        pl.uid = ?
      ORDER BY pl.createdAt DESC
      `,
      [
        uid
      ]
    );
    return rows.map(row => new PostListVo({
      postId: row.postId,
      channelId: row.channelId,
      pictureUrl: row.pictureUrls.split(",")[0],
      title: row.title,
      isSticky: Boolean(row.isSticky),
      likeSum: row.likeSum,
      createdAt: row.postCreatedAt,
      updatedAt: row.postUpdatedAt,
      user: {
        uid: row.uid,
        nickname: row.nickname,
        avatarUrl: row.avatarUrl,
        role: RoleUtil.roleNumberToString(row.roleId),
        createdAt: row.userCreatedAt,
        updatedAt: row.userUpdatedAt
      }
    }));
  }

  /**
   * 获取某用户收藏的帖子
   * @param uid 用户 ID
   */
  static async getFavoritePostList(uid: number) {
    const db = await dbPromise;
    const rows = await db.all<PostListBo[]>(
      `
        SELECT 
        p.postId,
        p.channelId,
        p.pictureUrls,
        p.title,
        p.isSticky,
        p.likeSum,
        p.createdAt AS postCreatedAt,
        p.updatedAt AS postUpdatedAt,
        u.uid,
        u.nickname,
        u.avatarUrl,
        u.roleId,
        u.createdAt AS userCreatedAt,
        u.updatedAt AS userUpdatedAt,
        pf.createdAt AS likeTime
      FROM posts p
      INNER JOIN users u ON p.uid = u.uid
      INNER JOIN post_favorites pf ON 
        p.postId = pf.postId AND 
        pf.uid = ?
      ORDER BY pf.createdAt DESC
      `,
      [
        uid
      ]
    );
    return rows.map(row => new PostListVo({
      postId: row.postId,
      channelId: row.channelId,
      pictureUrl: row.pictureUrls.split(",")[0],
      title: row.title,
      isSticky: Boolean(row.isSticky),
      likeSum: row.likeSum,
      createdAt: row.postCreatedAt,
      updatedAt: row.postUpdatedAt,
      user: {
        uid: row.uid,
        nickname: row.nickname,
        avatarUrl: row.avatarUrl,
        role: RoleUtil.roleNumberToString(row.roleId),
        createdAt: row.userCreatedAt,
        updatedAt: row.userUpdatedAt
      }
    }))
  }

  /**
   * 获取某一帖子的详情
   * @param postId 
   * @param uid 
   * @param roleId 
   */
  static async getDetailByPostId(postId: number, uid: number) {
    const db = await dbPromise;
    const row = await db.get<PostDetailBo>(
      `
      SELECT 
        p.postId,
        p.channelId,
        p.pictureUrls,
        p.title,
        p.content,
        p.likeSum,
        p.commentSum,
        p.forwardSum,
        p.favoriteSum,
        p.createdAt AS postCreatedAt,
        p.updatedAt AS postUpdatedAt,
        u.uid,
        u.nickname,
        u.avatarUrl,
        u.roleId,
        u.createdAt AS userCreatedAt,
        u.updatedAt AS userUpdatedAt,
        EXISTS(
          SELECT 1 FROM post_likes WHERE postId = p.postId AND uid = ?2
        ) AS isLiked,
        EXISTS(
          SELECT 1 FROM post_favorites WHERE postId = p.postId AND uid = ?2
        ) AS isFavorite,
        CASE
          WHEN EXISTS (
            SELECT 1 
            FROM channels 
            WHERE channelId = p.channelId 
            AND masterId = ?2
          ) THEN 'MASTER'
          WHEN EXISTS (
            SELECT 1 
            FROM channel_admins 
            WHERE channelId = p.channelId 
            AND uid = ?2
          ) THEN 'ADMIN'
          ELSE 'REGULAR'
        END AS channelRole
      FROM 
        posts AS p
      INNER JOIN 
        users AS u ON p.uid = u.uid
      WHERE 
        p.postId = ?1
      `,
      [postId, uid]
    );
    if (!row) {
      throw new NotFoundError("该帖子不存在！");
    }
    return new PostDetailVo({
      postId: row.postId,
      title: row.title,
      channelId: row.channelId,
      pictureUrls: row.pictureUrls !== "" ? row.pictureUrls.split(",") : [],
      content: row.content,
      likeSum: row.likeSum,
      commentSum: row.commentSum,
      forwardSum: row.forwardSum,
      favoriteSum: row.favoriteSum,
      createdAt: row.postCreatedAt,
      updatedAt: row.postUpdatedAt,
      user: {
        uid: row.uid,
        nickname: row.nickname,
        avatarUrl: row.avatarUrl,
        role: RoleUtil.roleNumberToString(row.roleId),
        channelRole: row.channelRole,
        createdAt: row.userCreatedAt,
        updatedAt: row.userUpdatedAt
      },
      action: {
        isLiked: Boolean(row.isLiked),
        isFavorite: Boolean(row.isFavorite)
      }
    })
  }

   /**
   * 获取某用户发布的帖子列表
   * @param currentUid //当前用户id
   * @param uid 选择的用户id
   */
   static async getPostListByUserId(currentUid:number,uid: number): Promise<PostListVo[]> {
    const db = await dbPromise;
    const rows = await db.all<PostListBo[]>(
      `
      SELECT 
        posts.postId AS postId,
        posts.channelId As channelId,
        posts.pictureUrls AS pictureUrls,
        posts.title AS title,
        posts.isSticky AS isSticky,
        posts.likeSum AS likeSum,
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
      WHERE posts.uid = ?
      ORDER BY posts.isSticky DESC, posts.createdAt DESC
      `,
      [ 
        currentUid,
        uid
      ]
    );

    return rows.map(row => new PostListVo({
      postId: row.postId,
      channelId: row.channelId,
      pictureUrl: row.pictureUrls.split(",")[0],
      title: row.title,
      isSticky: Boolean(row.isSticky),
      likeSum: row.likeSum,
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
    }));
  }
}

export default PostService;