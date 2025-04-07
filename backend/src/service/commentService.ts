/*
 * 评论相关业务
 * @Author: Franctoryer 
 * @Date: 2025-04-05 19:07:49 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-04-07 12:03:08
 */
import CommentBo from "@/bo/comment/commentBo";
import dbPromise from "@/config/databaseConfig";
import CosConstant from "@/constant/cosConstant";
import CommentPublishDto from "@/dto/comment/commentPublishDto";
import Comment from "@/entity/comment";
import NotFoundError from "@/exception/notFoundError";
import CosUtil from "@/util/cosUtil";
import CommentVo from "@/vo/comment/commentVo";


class CommentService {
  /**
   * 获取某一帖子的所有评论
   * @param postId 帖子 ID
   * @param uid 用户 ID
   */
  static async getCommentsByPostId(
    postId: number, 
    uid: number
  ) {
    const db = await dbPromise;
    const rows = await db.all<CommentBo[]>(
      `
      SELECT 
        comments.commentId, comments.uid, postId, parentId, rootId,
        content, pictureUrls, likeSum, comments.createdAt, comments.updatedAt,
        CASE WHEN comment_likes.uid IS NOT NULL THEN 1 ELSE 0 END AS isLiked
      FROM comments
      LEFT JOIN comment_likes
        ON comments.commentId = comment_likes.commentId
        AND comment_likes.uid = ?
      WHERE 
       postId = ?
      `,
      [uid, postId]
    )

    return rows.map(row => new CommentVo({
      ...row,
      pictureUrls: row.pictureUrls ? row.pictureUrls.split(",") : [],
      isLiked: Boolean(row.isLiked)
    }))
  }
  
  /**
   * TODO: 权限鉴定
   * 发布一条评论
   * @param postId 帖子 ID
   * @param uid 用户 ID
   */
  static async publish(
    postId: number, 
    uid: number,
    commentPublishDto: CommentPublishDto
  ) {
    // 获取图片 base64 编码
    const pictures = commentPublishDto.pictures ?? [];
    const uploadPromises = pictures.map(async picture => {
      return await CosUtil.uploadBase64Picture(
        CosConstant.POST_PICTURES_FOLDER, 
        picture
      );
    })
    // 异步上传所有文件
    const fileUrlList = await Promise.all(uploadPromises);
    // 用逗号拼接各个 url
    const urls = fileUrlList.join(',')
    // 将评论正文和图片 url 存到数据库
    const db = await dbPromise;
    await db.run(
      `
      INSERT INTO comments
      (uid, postId, parentId, rootId, content, pictureUrls, likeSum, createdAt, updatedAt)
      VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        uid,
        postId,
        0,  //根评论
        0,
        commentPublishDto.content,
        urls,
        0,  // 初始点赞数为 0
        Date.now(),
        Date.now()
      ]
    )
  }

  /**
   * 回复某一条评论
   * @param commentId 
   * @param uid 
   * @param commentPublishDto 
   */
  static async reply(
    commentId: number, 
    uid: number,
    commentPublishDto: CommentPublishDto
  ) {
    // 获取父评论信息
    const db = await dbPromise;
    const parentComment = await db.get<Partial<Comment>>(
      `
      SELECT commentId, postId, rootId FROM comments
      WHERE commentId = ?
      `,
      [commentId]
    )
    if (!parentComment) {
      throw new NotFoundError("该评论不存在！");
    }
    // 获取图片 base64 编码
    const pictures = commentPublishDto.pictures ?? [];
    const uploadPromises = pictures.map(async picture => {
      return await CosUtil.uploadBase64Picture(
        CosConstant.POST_PICTURES_FOLDER, 
        picture
      );
    })
    // 异步上传所有文件
    const fileUrlList = await Promise.all(uploadPromises);
    // 用逗号拼接各个 url
    const urls = fileUrlList.join(',')
    // 将评论正文和图片 url 存到数据库
    await db.run(
      `
      INSERT INTO comments
      (uid, postId, parentId, rootId, content, pictureUrls, likeSum, createdAt, updatedAt)
      VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        uid,
        parentComment.postId,
        commentId, 
        parentComment.rootId === 0 ? commentId : parentComment.rootId,
        commentPublishDto.content,
        urls,
        0,  // 初始点赞数为 0
        Date.now(),
        Date.now()
      ]
     )
  }

  /**
   * 点赞某个评论
   * @param commentId 评论 ID
   * @param uid 用户 ID
   */
  static async like(commentId: number, uid: number) {
    const db = await dbPromise;
    // 如果存在点赞记录，不重复插入；如果不存在点赞记录，插入点赞记录（使用子查询减少数据库查询次数）
    await db.run(
      `
      INSERT INTO likes (uid, objType, objId, createdAt, updatedAt)
      SELECT ?1, 1, ?2, ?3, ?4
      WHERE NOT EXISTS (
        SELECT 1 FROM likes
        WHERE uid = ?1 AND objType = 1 AND objId = ?2
      )
      `,
      [
        uid,
        commentId,
        Date.now(),
        Date.now()
      ]
    )
  }

  /**
   * 取消点赞某个评论
   * @param commentId 评论 ID
   * @param uid 用户 ID
   */
  static async unLike(commentId: number, uid: number) {
    const db = await dbPromise;
    await db.run(
      `
      DELETE FROM likes 
      WHERE uid = ? AND objType = 1 AND objId = ?
      `,
      [
        uid,
        commentId
      ]
    )
  }

  /**
   * 删除一条评论
   * @param commentId 
   * @param uid 
   * @param roleId 
   */
  static async delete(commentId: number, uid: number, roleId: number) {
    // 删除该帖子
    const db = await dbPromise;
    // TODO: 异步删除 COS 上的帖子图片
    await db.run(
      `
      DELETE FROM comments WHERE commentId = ?
      `,
      [commentId]
    )
    // 异步删除其子评论
    db.run(
      `
      DELETE FROM comments WHERE parentId = ?
      `,
      [commentId]
    )
  }
}

export default CommentService;