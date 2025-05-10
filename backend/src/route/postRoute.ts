/*
 * 帖子相关接口
 * @Author: Franctoryer 
 * @Date: 2025-03-08 15:44:06 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-04-06 10:47:02
 */

import AuthConstant from "@/constant/authConstant";
import MessageConstant from "@/constant/messageConstant";
import PageDto from "@/dto/common/pageDto";
import PostPublishDto from "@/dto/post/postPublishDto";
import PostService from "@/service/postService";
import JwtUtil from "@/util/jwtUtil";
import Result from "@/vo/result";
import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const postRoute = express.Router();

/**
 * @description 发布新的帖子
 * @method POST
 * @path /post
 */
postRoute.post('/post', async (req: Request, res: Response) => {
  // 获取 uid
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);
  // 获取请求体参数
  const postPublishDto = await PostPublishDto.from({
    ...req.body,
    uid
  });
  await PostService.publish(postPublishDto);
  // 返回响应
  res.status(StatusCodes.CREATED)
    .json(
      Result.success(MessageConstant.SUCCESSFUL_PUBLISH)
    );
})

/**
 * @description 获取公共频道的帖子列表
 * @method GET
 * @path /post/list
 */
postRoute.get('/post/list', async (req: Request, res: Response) => {
  // 使用的路由版本
  const version = "v1";
  // 重定向到对应的版本
  res.redirect(
    `/${version}/post/list`
  );
})

/**
 * @description 获取公共频道的帖子列表（没有分页）
 * @method GET
 * @path /post/list
 */
postRoute.get('/v1/post/list', async (req: Request, res: Response) => {
  // 获取 uid
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);
  const postListVos = await PostService.getPublicPostList(uid);
  // 返回响应
  res.json(
    Result.success(postListVos)
  );
})

/**
 * @description 获取公共频道的帖子列表（有分页）
 * @method GET
 * @path /v2/post/list
 */
postRoute.get('/v2/post/list', async (req: Request, res: Response) => {
  // 获取 uid
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);
  // 获取分页参数
  const pageDto = await PageDto.from(req.query);
  const postListVoPage = await PostService.getPublicPostListWithPagination(uid, pageDto);
  // 返回响应
  res.json(
    Result.success(postListVoPage)
  );
})


/**
 * @description 获取某一频道下的帖子列表
 * @method GET
 * @path /channel/:channelId/post/list
 */
postRoute.get('/channel/:channelId/post/list', async (req: Request, res: Response) => {
  // 使用的路由版本
   const version = "v1";
  // 获取频道 ID
  const channelId: number = Number(req.params.channelId);
  // 重定向到对应的版本
  res.redirect(
    `/${version}/channel/${channelId}/post/list`
  );
})

/**
 * @description 获取某一频道下的帖子列表（每有分页）
 * @method GET
 * @path /v1/channel/:channelId/post/list
 */
postRoute.get('/v1/channel/:channelId/post/list', async (req: Request, res: Response) => {
  // 获取 uid
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);
  // 获取 channelId
  const channelId: number = Number(req.params.channelId);
  const postListVos = await PostService.getPostListByChannelId(uid, channelId);
  // 返回响应
  res.json(
    Result.success(postListVos)
  );
})

/**
 * @description 获取某一频道下的帖子列表（有分页）
 * @method GET
 * @path /v2/channel/:channelId/post/list
 */
postRoute.get('/v2/channel/:channelId/post/list', async (req: Request, res: Response) => {
  // 获取 uid
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);
  // 获取分页参数
  const pageDto = await PageDto.from(req.query)
  // 获取 channelId
  const channelId: number = Number(req.params.channelId);
  const postListVoPage = await PostService.getPostListByChannelIdWithPagination(
    uid, channelId, pageDto
  );
  // 返回响应
  res.json(
    Result.success(postListVoPage)
  );
})


/**
 * @description 获取某一帖子的详情
 * @method GET
 * @path /post/:postId/detail
 */
postRoute.get('/post/:postId/detail', async (req: Request, res: Response) => {
  // 获取 uid
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);
  // 获取帖子 ID
  const postId: number = Number(req.params.postId);
  // 获取帖子详情
  const postDetailVo = await PostService.getDetailByPostId(postId, uid);
  // 返回响应
  res.json(Result.success(postDetailVo));
})

/**
 * @description 点赞某个帖子
 * @method POST
 * @path /post/:postId/like
 */
postRoute.post('/post/:postId/like', async (req: Request, res: Response) => {
  // 获取 uid
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);
  console.log(`uid: ${uid}`)
  // 获取帖子 ID
  const postId = Number(req.params.postId);
  // 点赞
  await PostService.like(uid, postId);
  // 返回响应
  res.status(StatusCodes.CREATED)
    .json(
      Result.success(MessageConstant.SUCCESSFUL_LIKE)
    );
})

/**
 * @description 取消点赞某个帖子
 * @method DELETE
 * @path /post/:postId/like
 */
postRoute.delete('/post/:postId/like', async (req: Request, res: Response) => {
  // 获取 uid
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);
  // 获取帖子 ID
  const postId = Number(req.params.postId);
  // 取消点赞
  await PostService.unLike(uid, postId);
  // 返回响应
  res.json(
    Result.success(MessageConstant.SUCCESSFUL_CANCEL)
  );
})

/**
 * @description 收藏某个帖子
 * @method POST
 * @path /post/:postId/favorite
 */
postRoute.post('/post/:postId/favorite', async (req: Request, res: Response) => {
  // 获取 uid
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);
  // 获取帖子 ID
  const postId = Number(req.params.postId);
  // 收藏帖子
  await PostService.favorite(uid, postId);
  // 返回响应
  res.status(StatusCodes.CREATED)
    .json(
      Result.success(MessageConstant.SUCCESSFUL_FAVORITE)
    );
})

/**
 * @description 取消收藏某个帖子
 * @method DELETE
 * @path /post/:postId/favorite
 */
postRoute.delete('/post/:postId/favorite', async (req: Request, res: Response) => {
  // 获取 uid
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);
  // 获取帖子 ID
  const postId = Number(req.params.postId);
  // 取消收藏
  await PostService.unFavorite(uid, postId);
  // 返回响应
  res.json(
    Result.success(MessageConstant.SUCCESSFUL_CANCEL)
  );
})

/**
 * @description 获取收藏的帖子列表
 * @method GET
 * @path /post/favorite/list
 */
postRoute.get('/post/favorite/list', async (req: Request, res: Response) => {
  // 获取 uid
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);
  // 获取帖子列表
  const postListVos = await PostService.getFavoritePostList(uid);
  // 返回响应
  res.json(
    Result.success(postListVos)
  );
})

/**
 * @description 获取点赞过的帖子列表
 * @method GET
 * @path /post/liked/list 
 */
postRoute.get('/post/liked/list', async (req: Request, res: Response) => {
  // 获取 uid
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);
  // 获取帖子列表
  const postListVos = await PostService.getLikedPostList(uid);
  // 返回响应
  res.json(
    Result.success(postListVos)
  );
})

/**
 * @description 删除某个帖子
 * @method DELETE
 * @path /post/:postId
 */
postRoute.delete('/post/:postId', async (req: Request, res: Response) => {
  // 获取用户 ID 和角色 ID
  const { uid, roleId } = JwtUtil.getUidAndRoleId(
    req.header(AuthConstant.TOKEN_HEADER) as string
  );
  const postId = Number(req.params.postId)
  await PostService.delete(postId, uid, roleId);
  // 返回响应
  res.json(
    Result.success(MessageConstant.SUCCESSFUL_DELETE)
  );
})

/**
 * @description 置顶某个帖子
 * @method POST
 * @path /post/:postId/top
 */
postRoute.post('/post/:postId/top', async (req: Request, res: Response) => {
   // 获取用户 ID 和角色 ID
   const { uid, roleId } = JwtUtil.getUidAndRoleId(
    req.header(AuthConstant.TOKEN_HEADER) as string
  );
  const postId = Number(req.params.postId)
  await PostService.top(postId, uid, roleId);
  // 返回响应
  res.status(StatusCodes.CREATED)
    .json(
    Result.success(MessageConstant.SUCCESSFUL_TOP)
  );
})

/**
 * @description 取消置顶某个帖子
 * @method POST
 * @path /post/:postId/top
 */
postRoute.delete('/post/:postId/top', async (req: Request, res: Response) => {
   // 获取用户 ID 和角色 ID
   const { uid, roleId } = JwtUtil.getUidAndRoleId(
    req.header(AuthConstant.TOKEN_HEADER) as string
  );
  const postId = Number(req.params.postId)
  await PostService.unTop(postId, uid, roleId);
   // 返回响应
   res.json(
    Result.success(MessageConstant.SUCCESSFUL_CANCEL)
  );
})

/**
 * @description 获取某一帖子下的所有成员信息
 * @method GET
 * @path /post/:postId/members
 */
postRoute.get('/post/:postId/members', async (req: Request, res: Response) => {
  // 获取帖子 ID
  const postId = Number(req.params.postId)
  const memberVos = await PostService.getMembersByPostId(postId);
  res.json(Result.success(memberVos));
})


export default postRoute;