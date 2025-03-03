/*
 * 用户相关路由
 * @Author: Franctoryer 
 * @Date: 2025-02-23 21:44:15 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-02 23:14:35
 */

import express, { Request, Response } from "express"
import UserService from "@/service/userService";
import Result from "@/vo/result";
import WxLoginDto from "@/dto/user/wxLoginDto";
import { StatusCodes } from "http-status-codes";
import JwtUtil from "@/util/jwtUtil";
import AuthConstant from "@/constant/authConstant";
import UserInfoDto from "@/dto/user/userInfoDto";
import MessageConstant from "@/constant/messageConstant";
import NicknameDto from "@/dto/user/nicknameDto";
import upload from "@/config/multerConfig";
import FileUtil from "@/util/fileUtil";
import AvatarVo from "@/vo/user/avatarVo";


const userRoute = express.Router();

/**
 * [POST] 微信登录，如果之前没注册过会自动注册
 * @path /wx-login
 */
userRoute.post('/wx-login', async (req: Request, res: Response) => {
  const wxLoginDto = await WxLoginDto.from(req.body);
  // 获取微信登录成功后的 token
  const wxLoginVo = await UserService.wxLogin(wxLoginDto);
  // 响应 201
  res.status(StatusCodes.CREATED)
    .json(Result.success(wxLoginVo));
})

/**
 * [GET] 获取用户的详情信息
 * @path /user/detail
 */
userRoute.get('/user/detail', async (req: Request, res: Response) => {
  // 获取 uid
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);  // 经过拦截器处理之后，剩下来的请求中一定包含 token，因此断言为 string
  // 接受来自业务层的处理完成的视图对象
  const userDetailVo = await UserService.getUserDetailByUid(uid);
  res.json(Result.success(userDetailVo));
})

/**
 * [PUT] 更改用户昵称
 * @path /user/nickname
 */
userRoute.put('/user/nickname', async (req: Request, res: Response) => {
  // 获取 uid
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);  // 经过拦截器处理之后，剩下来的请求中一定包含 token，因此断言为 string
  const nicknameDto = await NicknameDto.from(req.body);
  // 修改昵称
  await UserService.updateNickname(nicknameDto, uid);
  res.status(StatusCodes.OK)
    .json(Result.success(MessageConstant.SUCCESSFUL_MODIFIED));
})

/**
 * [POST] 更改用户头像
 * @path /user/avatar
 */
userRoute.post('/user/avatar', upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(StatusCodes.BAD_REQUEST)
      .json(Result.error(MessageConstant.NO_FILE_UPLOADED));
  }
  // 获取 uid
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);  // 经过拦截器处理之后，剩下来的请求中一定包含 token，因此断言为 string
  const file = req.file!.buffer;
  const fileExtension = FileUtil.getFileExtension(req.file!.originalname);
  // 更换头像
  const freshAvatarUrl = await UserService.updateAvatar(file, uid, fileExtension);
  const avatarVo = new AvatarVo({
    avatarUrl: freshAvatarUrl
  });
  res.status(StatusCodes.OK)
    .json(
      Result.success(MessageConstant.SUCCESSFUL_MODIFIED, avatarVo)
    );
})

/**
 * [PUT] 更改用户其他信息（除昵称、头像）
 * @path /user/info
 */
userRoute.put('/user/info', async (req: Request, res: Response) => {
  // 获取用户 id
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);  // 经过拦截器处理之后，剩下来的请求中一定包含 token，因此断言为 string
  const userInfoDto = await UserInfoDto.from(req.body);
  // 更新用户信息
  UserService.updateUserInfo(userInfoDto, uid);
  res.status(StatusCodes.OK)
    .json(Result.success(MessageConstant.SUCCESSFUL_MODIFIED));
})

/**
 * [DELETE] 用户注销
 * @path /user
 */
userRoute.delete('/user', async (req: Request, res: Response) => {
  // 获取用户 id
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);  // 经过拦截器处理之后，剩下来的请求中一定包含 token，因此断言为 string
  await UserService.unRegister(uid);
  res.status(StatusCodes.OK)
    .json(Result.success(MessageConstant.SUCCESSFUL_UNREGISTER));
})

export default userRoute;
