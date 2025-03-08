/*
 * 频道相关路由
 * @Author: Franctoryer 
 * @Date: 2025-02-25 19:02:30 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-08 15:44:38
 */
import express, {Request, Response} from "express";

const channelRoute = express.Router();

/**
 * @description 获取用户加入的频道列表
 * @method GET
 * @path /channel/list
 */
channelRoute.get('/channel/list', async (req: Request, res: Response) => {

});

/**
 * @description 加入某个频道
 * @method POST
 * @path /channel/:channelId/join
 */
channelRoute.post('/channel/:channelId/join', async (req: Request, res: Response) => {
  
})

export default channelRoute;
