/*
 * 帖子相关接口
 * @Author: Franctoryer 
 * @Date: 2025-03-08 15:44:06 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-08 15:59:13
 */

import express, { Request, Response } from "express";

const postRoute = express.Router();

/**
 * @description 获取公共频道的帖子列表
 * @method GET
 * @path /post/list
 */
postRoute.get('/post/list', async (req: Request, res: Response) => {

})

/**
 * @description 获取某一频道下的帖子列表
 * @method GET
 * @path /channel/:channelId/post/list
 */
postRoute.get('/channel/:channelId/post/list', async (req: Request, res: Response) => {

})

/**
 * @description 获取某一帖子的详情
 * @method GET
 * @path /post/:postId/detail
 */
postRoute.get('/post/:postId/detail', async (req: Request, res: Response) => {

})

/**
 * @description 点赞某个帖子
 * @method POST
 * @path /post/:postId/like
 */
postRoute.post('/post/:postId/like', async (req: Request, res: Response) => {

})

/**
 * @description 取消点赞某个帖子
 * @method DELETE
 * @path /post/:postId/like
 */
postRoute.delete('/post/:postId/like', async (req: Request, res: Response) => {

})

/**
 * @description 收藏某个帖子
 * @method POST
 * @path /post/:postId/favorite
 */
postRoute.post('/post/:postId/favorite', async (req: Request, res: Response) => {

})

/**
 * @description 取消收藏某个帖子
 * @method DELETE
 * @path /post/:postId/favorite
 */
postRoute.delete('/post/:postId/favorite', async (req: Request, res: Response) => {

})

/**
 * @description 获取收藏的帖子列表
 * @method GET
 * @path /post/favorite/list
 */
postRoute.get('/post/favorite/list', async (req: Request, res: Response) => {

})

/**
 * @description 获取点赞过的帖子列表
 * @method GET
 * @path /post/liked/list 
 */
postRoute.get('/post/liked/list', async (req: Request, res: Response) => {

})


export default postRoute;