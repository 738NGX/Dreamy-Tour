/*
 * 用户相关路由
 * @Author: Franctoryer 
 * @Date: 2025-02-23 21:44:15 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-02-25 20:25:02
 */

import express, { Request, Response } from "express"
import { plainToInstance } from "class-transformer";
import UserDetailDto from "@/dto/userDetailDto";
import UserService from "@/service/userService";
import Result from "@/base/result";
import UnauthorizedError from "@/exception/unauthorizedError";


const userRoute = express.Router();

/**
 * @swagger
 * /user/{uid}/detail:
 *   get:
 *     tags:
 *       - 用户相关接口
 *     summary: 获取用户详情
 *     description: 返回用户的详细信息，包括用户 ID、姓名、年龄、学校名称和头像地址。
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           $ref: '#/components/schemas/UserDetailDto'
 *         required: true
 *         description: 用户唯一标识符 (UID)
 *     responses:
 *       200:
 *         description: 成功返回用户详情
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDetailVo'
 */
userRoute.get('/user/:uid/detail', async (req: Request, res: Response) => {
  // 将前端传来的参数转成 DTO 对象
  const userDetailDto = plainToInstance(UserDetailDto, req.params);
  // 参数校验
  await userDetailDto.validate();

  // 接受来自业务层的处理完成的视图对象
  const userDetailVo = await UserService.getUserDetailByUid(userDetailDto.uid);
  res.json(Result.success(userDetailVo));
})


/**
 * @swagger
 * /user/{uid}/detail:
 *   get:
 *     tags:
 *       - 用户相关接口
 *     summary: 微信登录接口
 *     description: 通过授权码进行微信登录
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           $ref: '#/components/schemas/WxLoginDto'
 *         required: true
 *         description: 
 *     responses:
 *       201:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDetailVo'
 */
userRoute.post('/wx-login', async (req: Request, res: Response) => {
  throw new UnauthorizedError();
})

export default userRoute;
