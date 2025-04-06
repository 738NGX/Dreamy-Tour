/*
 * 评论相关路由
 * @Author: Franctoryer 
 * @Date: 2025-04-05 18:47:43 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-04-06 18:13:37
 */
import AuthConstant from "@/constant/authConstant";
import MessageConstant from "@/constant/messageConstant";
import CommentPublishDto from "@/dto/comment/commentPublishDto";
import CommentService from "@/service/commentService";
import JwtUtil from "@/util/jwtUtil";
import Result from "@/vo/result";
import express, { Request, Response} from "express";

const commentRoute = express.Router();

/**
 * @description 获取某一帖子的所有评论
 * @method GET
 * @path /post/:postId/comments
 */
commentRoute.get('/post/:postId/comments', async (req: Request, res: Response) => {
  // 获取 uid
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);
  // 获取帖子 ID
  const postId = Number(req.params.postId);
  const commentVos = await CommentService.getCommentsByPostId(
    postId, uid
  );
  // 返回响应
  res.json(Result.success(commentVos));
})

/**
 * @description 在某一帖子下发布评论
 * @method POST
 * @path /post/:postId/comment
 */
commentRoute.post('/post/:postId/comment', async (req: Request, res: Response) => {
  // 获取 uid
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);
  // 获取帖子 ID
  const postId = Number(req.params.postId);
  // 获取发布参数
  const commentPublishDto = await CommentPublishDto.from(req.body);
  // 发布评论
  await CommentService.publish(postId, uid, commentPublishDto);
  // 返回响应
  res.json(Result.success(MessageConstant.SUCCESSFUL_PUBLISH));
})

/**
 * @description 回复某一个评论
 * @method POST
 * @path /comment/:commentId/reply
 */
commentRoute.post('/comment/:commentId/reply', async (req: Request, res: Response) => {
  // 获取 uid
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);
  // 获取评论 ID
  const commentId = Number(req.params.commentId);
  // 获取发布参数
  const commentPublishDto = await CommentPublishDto.from(req.body);
  // 回复评论
  await CommentService.reply(commentId, uid, commentPublishDto);
  // 返回响应
  res.json(Result.success(MessageConstant.SUCCESSFUL_PUBLISH));
})

/**
 * @description 删除某个评论或回复
 * @method DELETE
 * @path /comment/:commentId
 */
commentRoute.delete('/comment/:commentId', async (req: Request, res: Response) => {
  // 获取用户 ID 和角色 ID
  const { uid, roleId } = JwtUtil.getUidAndRoleId(
    req.header(AuthConstant.TOKEN_HEADER) as string
  );
  // 获取评论 ID
  const commentId = Number(req.params.commentId);
  // 删除该条评论
  await CommentService.delete(commentId, uid, roleId);
  // 返回响应
  res.json(Result.success(MessageConstant.SUCCESSFUL_DELETE));
})

/**
 * @description 点赞某个评论或回复
 * @method POST
 * @path /comment/:commentId/like
 */
commentRoute.post('/comment/:commentId/like', async (req: Request, res: Response) => {
    // 获取 uid
    const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);
    // 获取评论 ID
    const commentId = Number(req.params.commentId);
    // 执行点赞逻辑
    await CommentService.like(commentId, uid)
    // 返回响应
    res.json(Result.success(MessageConstant.SUCCESSFUL_LIKE));
})

/**
 * @description 取消点赞某个评论或回复
 * @method DELETE
 * @path /comment/:commentId/like
 */
commentRoute.delete('/comment/:commentId/like', async (req: Request, res: Response) => {
  // 获取 uid
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);
  // 获取评论 ID
  const commentId = Number(req.params.commentId);
  // 取消点赞
  await CommentService.unLike(commentId, uid);
  // 返回响应
  res.json(Result.success(MessageConstant.SUCCESSFUL_CANCEL));
})

export default commentRoute;