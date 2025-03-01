/*
 * 用户相关路由
 * @Author: Franctoryer 
 * @Date: 2025-02-23 21:44:15 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-01 21:32:34
 */

import express, { Request, Response } from "express"
import UserService from "@/service/userService";
import Result from "@/vo/result";
import WxLoginDto from "@/dto/wxLoginDto";
import { StatusCodes } from "http-status-codes";
import JwtUtil from "@/util/jwtUtil";
import AuthConstant from "@/constant/authConstant";


const userRoute = express.Router();

/**
 * [GET] 获取用户的详情信息
 * @path /user/:uid/detail
 */
userRoute.get('/user/detail', async (req: Request, res: Response) => {
  // 获取 uid
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);  // 经过拦截器处理之后，剩下来的请求中一定包含 token，因此断言为 string
  // 接受来自业务层的处理完成的视图对象
  const userDetailVo = await UserService.getUserDetailByUid(uid);
  res.json(Result.success(userDetailVo));
})

/**
 * [POST] 微信登录，如果之前没注册过会自动注册
 * @path /wx-login
 */
userRoute.post('/wx-login', async (req: Request, res: Response) => {
  const wxLoginDto = new WxLoginDto(req.body);
  await wxLoginDto.validate()
  
  // 获取微信登录成功后的 token
  const wxLoginVo = await UserService.wxLogin(wxLoginDto);
  // 响应 201
  res.status(StatusCodes.CREATED)
    .json(Result.success(wxLoginVo));
})

export default userRoute;
