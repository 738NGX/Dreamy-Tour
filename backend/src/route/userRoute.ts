/*
 * 用户相关路由
 * @Author: Franctoryer 
 * @Date: 2025-02-23 21:44:15 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-23 19:34:53
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
import AvatarVo from "@/vo/user/avatarVo";
import BackgroundImageVo from "@/vo/user/backgroundImageVo";
import RoleDto from "@/dto/user/roleDto";
import ImageDto from "@/dto/image/imageDto";
const { version } = require('../../package.json');

const userRoute = express.Router();

userRoute.get('/version', async (req: Request, res: Response) => {
  res.json(Result.success(version));
})

/**
 * @description 微信登录，如果之前没注册过会自动注册
 * @method POST
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
 * @description 获取用户的详情信息
 * @method GET
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
 * @description 更改用户昵称
 * @method PUT
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
 * @description 更改用户头像
 * @method POST
 * @path /user/avatar
 */
userRoute.put('/user/avatar', async (req: Request, res: Response) => {
  // 获取 uid
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);  // 经过拦截器处理之后，剩下来的请求中一定包含 token，因此断言为 string
  const file = await ImageDto.from(req.body);

  // 更换头像
  const freshAvatarUrl = await UserService.updateAvatar(file.base64, uid);
  const avatarVo = new AvatarVo({
    avatarUrl: freshAvatarUrl
  });
  res.status(StatusCodes.OK)
    .json(Result.success(MessageConstant.SUCCESSFUL_MODIFIED));
})

/**
 * @description 更改用户背景图片
 * @method POST
 * @path /user/backgroundImage
 */
userRoute.put('/user/backgroundImage', async (req: Request, res: Response) => {
  // 获取 uid
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);  // 经过拦截器处理之后，剩下来的请求中一定包含 token，因此断言为 string
  const file = await ImageDto.from(req.body);

  // 更换背景图片
  const freshBackgroundImageUrl = await UserService.updateBackgroundImage(file.base64, uid);
  const backgroundImageVo = new BackgroundImageVo({
    backgroundImageUrl: freshBackgroundImageUrl
  });
  res.status(StatusCodes.OK)
    .json(Result.success(MessageConstant.SUCCESSFUL_MODIFIED, backgroundImageVo));
})

/**
 * @description 更改用户其他信息（除昵称、头像）
 * @method PUT
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
 * @description 用户注销
 * @method DELETE
 * @path /user
 */
userRoute.delete('/user', async (req: Request, res: Response) => {
  // 获取用户 id
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);  // 经过拦截器处理之后，剩下来的请求中一定包含 token，因此断言为 string
  await UserService.unRegister(uid);
  res.status(StatusCodes.OK)
    .json(Result.success(MessageConstant.SUCCESSFUL_UNREGISTER));
})

/**
 * @description 用户暂时提权（仅限开发使用）
 * @method POST
 * @path /user/privilege
 */
userRoute.post('/user/privilege', async (req: Request, res: Response) => {
  // 获取用户 id
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);  // 经过拦截器处理之后，剩下来的请求中一定包含 token，因此断言为 string
  const roleDto = await RoleDto.from(req.body);
  // 更新数据库
  await UserService.getPrivilege(uid, roleDto);
  res.json(
    Result.success(MessageConstant.SUCCESSFUL_MODIFIED)
  );
})

/**
 * @description 获取其他用户的详情信息
 * @method GET
 * @path /user/detail
 */
userRoute.get(`/user/:uid/detail`, async (req: Request, res: Response) => {
  // 接受来自业务层的处理完成的视图对象
  const uidStr = req.params.uid;
  const uid = parseInt(uidStr);
  if(isNaN(uid)){
    res.json(Result.error("Invalid UserId"))
  }
  const userDetailVo = await UserService.getUserDetailByUid(uid);
  res.json(Result.success(userDetailVo));
})

export default userRoute;
