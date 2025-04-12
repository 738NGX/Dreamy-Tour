/*
 * 用户相关路由
 * @Author: Franctoryer 
 * @Date: 2025-02-23 21:44:15 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-04-09 20:09:32
 */

import express, { Request, Response } from "express"
import UserService from "@/service/userService";
import ChannelService from "@/service/channelService";
import PostService from "@/service/postService";
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
import emailServer from "@/config/emailConfig";
import EmailCodeDto from "@/dto/user/emailCodeDto";
import CacheUtil from "@/util/cacheUtil";
import EmailRegisterDto from "@/dto/user/emailRegisterDto";
import EmailLoginDto from "@/dto/user/emailLoginDto";
import ResetPasswordDto from "@/dto/user/resetPasswordDto";
import BindEmailDto from "@/dto/user/bindEmailDto";
import BindWxDto from "@/dto/user/bindWxDto";
import EmailLoginV2Dto from "@/dto/user/emailLoginV2Dto";

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
 * @description 邮箱注册（含验证码）
 * @method POST
 * @path /email/register
 */
userRoute.post('/email/register', async (req: Request, res: Response) => {
  // 获取传参
  const emailRegisterDto = await EmailRegisterDto.from(req.body);
  // 邮箱注册逻辑
  await UserService.emailRegister(emailRegisterDto);
  // 返回响应
  res.status(StatusCodes.CREATED)
    .json(Result.success(MessageConstant.SUCCESSFUL_REGISTER));
})

/**
 * TODO: 待删除
 * @description 邮箱登录（不需要验证码）
 * @method POST
 * @path /email/login
 */
userRoute.post('/email/login', async (req: Request, res: Response) => {
  // 获取登录传参
  const emailLoginDto = await EmailLoginDto.from(req.body);
  // 邮箱登录逻辑
  const emailLoginVo =  await UserService.emailLoginByPassword(emailLoginDto);
  // 返回响应
  res.status(StatusCodes.CREATED)
    .json(Result.success(emailLoginVo));
})

/**
 * @description 邮箱登录（密码和验证码两者方式）
 * @method POST
 * @path /v2/email/login
 */
userRoute.post('/v2/email/login', async (req: Request, res: Response) => {
  // 获取登录传参
  const emailLoginV2Dto = await EmailLoginV2Dto.from(req.body);
  // 邮箱登录逻辑
  const emailLoginVo = await UserService.emailLogin(emailLoginV2Dto);
  // 返回响应
  res.status(StatusCodes.CREATED)
  .json(Result.success(emailLoginVo));
})

/**
 * @description 密码重置（需要验证码）
 * @method PUT
 * @path /email/password
 */
userRoute.put('/email/password', async (req: Request, res: Response) => {
  // 获取重置密码的传参
  const resetPasswordDto = await ResetPasswordDto.from(req.body);
  // 重置密码逻辑
  await UserService.emailResetPassword(resetPasswordDto);
  // 返回响应
  res.status(StatusCodes.CREATED)
    .json(Result.success(MessageConstant.SUCCESSFUL_MODIFIED));
})

/**
 * @description 用邮箱换验证码
 * @method POST
 * @path /email/captcha
 */
userRoute.post('/email/captcha', async (req: Request, res: Response) => {
  // 获取传参
  const emailCodeDto = await EmailCodeDto.from(req.body);
  // 发送验证码
  await UserService.sendVerifyCode(emailCodeDto);
  // 返回响应
  res.status(StatusCodes.CREATED)
    .json(Result.success(MessageConstant.SUCCESSFUL_SEND));
})

/**
 * @description 获取缓存数据（仅开发调试使用）
 * @method GET
 * @path /cache
 */
userRoute.get('/cache', async (req: Request, res: Response) => {
  const cache = CacheUtil.getAllCacheEntries();
  res.json(Result.success(cache));
})

/**
 * @description 微信用户绑定邮箱
 * @method POST
 * @path /user/bind-phone
 */
userRoute.post('/user/bind-email', async (req: Request, res: Response) => {
  // 获取 uid
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);
  // 获取传参
  const bindEmailDto = await BindEmailDto.from(req.body);
  // 执行绑定逻辑
  await UserService.bindEmail(uid, bindEmailDto);
  // 返回响应
  res.json(Result.success(MessageConstant.SUCCESSFUL_BIND));
})

/**
 * @description 邮箱用户绑定微信
 * @method POST
 * @path /user/bind-wx
 */
userRoute.post('/user/bind-wx', async (req: Request, res: Response) => {
  // 获取 uid
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);
  // 获取绑定微信传参
  const bindWxDto = await BindWxDto.from(req.body);
  // 执行绑定微信逻辑
  await UserService.bindWx(uid, bindWxDto);
  // 返回响应
  res.json(Result.success(MessageConstant.SUCCESSFUL_BIND));
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
 * @description 获取用户的详情信息（根据用户id）
 * @method GET
 * @param uid
 * @path /user/:uid/detail
 */
userRoute.get('/user/:uid/detail', async (req: Request, res: Response) => {
  // 接受来自业务层的处理完成的视图对象
  const uidStr = req.params.uid;
  const uid = parseInt(uidStr);
  if(isNaN(uid)){
    res.json(Result.error("Invalid UserId"))
  }
  const userDetailVo = await UserService.getUserDetailByUid(uid);
  res.json(Result.success(userDetailVo));
})

/**
 * @description 获取用户加入的频道列表（不包括世界频道；没有分页）（根据用户id）
 * @method GET
 * @param uid
 * @path /user/:uid/joined-channel-list
 */
userRoute.get('/user/:uid/joined-channel-list', async (req: Request, res: Response) => {
  // 获取用户 ID
  const uidStr = req.params.uid;
  const uid = parseInt(uidStr);
  if(isNaN(uid)){
    res.json(Result.error("Invalid UserId"))
  }
  const channelListVos = await ChannelService.getJoinedChannelList(uid);
  // 返回结果
  res.json(Result.success(channelListVos));
});

/**
 * @description 获取用户发布的帖子列表（无分页）（根据用户id）
 * @method GET
 * @param uid
 * @path /user/:uid/post-list
 */
userRoute.get('/user/:uid/post-list', async (req: Request, res: Response) => {
  // 获取选择的用户的uid
  const uidStr = req.params.uid;
  const uid = parseInt(uidStr);
  if(isNaN(uid)){
    res.json(Result.error("Invalid UserId"))
  }
  // 获取用户 id
  const currentUid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);  // 经过拦截器处理之后，剩下来的请求中一定包含 token，因此断言为 string

  const postListVos = await PostService.getPostListByUserId(currentUid,uid);
  // 返回响应
  res.json(
    Result.success(postListVos)
  );
})

export default userRoute;
