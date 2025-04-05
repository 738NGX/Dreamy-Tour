/*
 * 评论相关路由
 * @Author: Franctoryer 
 * @Date: 2025-04-05 18:47:43 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-04-05 20:13:23
 */
import express, { Request, Response} from "express";

const commentRoute = express.Router();

/**
 * @description 获取某一帖子的所有评论
 * @method GET
 * @path /post/:postId/comments
 */
commentRoute.get('/post/:postId/comments', async (req: Request, res: Response) => {

})

/**
 * @description 在某一帖子下发布评论
 * @method POST
 * @path /post/:postId/comment
 */
commentRoute.post('/post/:postId/comment', async (req: Request, res: Response) => {

})

/**
 * @description 评论某一个回复
 * @method POST
 * @path /comment/:commentId/reply
 */
commentRoute.post('/comment/:commentId/reply', async (req: Request, res: Response) => {

})

/**
 * @description 删除某个评论或回复
 * @method DELETE
 * @path /comment/:commentId
 */
commentRoute.delete('/comment/:commentId', async (req: Request, res: Response) => {

})

/**
 * @description 点赞某个评论或回复
 * @method POST
 * @path /comment/:commentId/like
 */
commentRoute.post('/comment/:commentId/like', async (req: Request, res: Response) => {

})

/**
 * @description 取消点赞某个评论或回复
 * @method DELETE
 * @path /comment/:commentId/like
 */
commentRoute.delete('/comment/:commentId/like', async (req: Request, res: Response) => {

})

export default commentRoute;