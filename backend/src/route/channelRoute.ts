/*
 * 频道相关路由
 * @Author: Franctoryer 
 * @Date: 2025-02-25 19:02:30 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-21 22:22:10
 */
import AuthConstant from "@/constant/authConstant";
import MessageConstant from "@/constant/messageConstant";
import ChannelDto from "@/dto/channel/channelDto";
import ChannelModifyDto from "@/dto/channel/channelModifyDto";
import ChannelTransferDto from "@/dto/channel/channelTransferDto";
import ChannelGrantAdminDto from "@/dto/channel/channelGrantAdminDto";
import ChannelService from "@/service/channelService";
import JwtUtil from "@/util/jwtUtil";
import Result from "@/vo/result";
import express, {Request, Response} from "express";
import { StatusCodes } from "http-status-codes";

const channelRoute = express.Router();

/**
 * @description 获取用户加入的频道列表（暂时不分页；不包括世界频道）
 * @method GET
 * @path /channel/joined/list
 */
channelRoute.get('/channel/joined/list', async (req: Request, res: Response) => {
  // 获取用户 ID
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);  // 经过拦截器处理之后，剩下来的请求中一定包含 token，因此断言为 string
  const channelListVos = await ChannelService.getJoinedChannelList(uid);
  // 返回结果
  res.json(Result.success(channelListVos));
});

/**
 * @description 获取用户没有加入的频道列表
 * @method GET
 * @path /channel/unjoined/list
 */
channelRoute.get('/channel/unjoined/list', async (req: Request, res: Response) => {
  // 获取用户 ID
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);
  const channelListVos = await ChannelService.getUnjoinedChannelList(uid);
  // 返回结果
  res.json(Result.success(channelListVos));
})

/**
 * @description 获取所有的频道列表（暂时不分页）
 * @method GET
 * @path /channel/list
 */
channelRoute.get('/channel/list', async (req: Request, res: Response) => {
  const channelListVos = await ChannelService.getChannelList();
  // 返回结果
  res.json(Result.success(channelListVos));
});

/**
 * @description 获取某一频道详情
 * @method GET
 * @path channel/:channelId/detail
 */
channelRoute.get('/channel/:channelId/detail', async (req: Request, res: Response) => {
  // 获取频道 ID
  const channelId = Number(req.params.channelId);
  // 获取频道详情
  const channelDetailVo = await ChannelService.getDetailByChannelId(channelId);
  // 返回响应
  res.json(Result.success(channelDetailVo));
})

/**
 * @description 获取世界频道详情
 * @method GET
 * @path channel/:channelId/detail
 */
channelRoute.get('/world-channel/detail', async (req: Request, res: Response) => {
  // 获取频道详情
  const channelDetailVo = await ChannelService.getWorldChannelDetail();
  // 返回响应
  res.json(Result.success(channelDetailVo));
})

/**
 * @description 加入某个频道
 * @method POST
 * @path /channel/:channelId/join
 */
channelRoute.post('/channel/:channelId/join', async (req: Request, res: Response) => {
  // 获取用户 ID
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);  // 经过拦截器处理之后，剩下来的请求中一定包含 token，因此断言为 string
  // 获取频道 ID
  const channelId = Number(req.params.channelId);
  // 加入该频道
  await ChannelService.join(uid, channelId);
  res.status(StatusCodes.CREATED)
    .json(Result.success(MessageConstant.SUCCESSFUL_JOIN));
});

/**
 * @description 退出某个频道
 * @method DELETE
 * @path /channel/:channelId/join
 */
channelRoute.delete('/channel/:channelId/join', async (req: Request, res: Response) => {
  // 获取用户 ID
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);  // 经过拦截器处理之后，剩下来的请求中一定包含 token，因此断言为 string
  // 获取频道 ID
  const channelId = Number(req.params.channelId);
  // 退出该频道
  await ChannelService.exit(uid, channelId);
  res.status(StatusCodes.OK)
    .json(Result.success(MessageConstant.SUCCESSFUL_EXIT));
});

channelRoute.put('/channel/:channelId/join/:memberId', async (req: Request, res: Response) => {
  // 获取用户 ID 和角色 ID
  const { uid, roleId } = JwtUtil.getUidAndRoleId(
    req.header(AuthConstant.TOKEN_HEADER) as string
  );
  // 获取频道 ID 和成员 ID
  const channelId = Number(req.params.channelId);
  const memberId = Number(req.params.memberId);
  // 更新成员身份
  await ChannelService.addMemberToChannel(uid, roleId, channelId, memberId);
  // 返回响应
  res.json(Result.success(MessageConstant.SUCCESSFUL_JOIN));
});

channelRoute.delete('/channel/:channelId/join/:memberId', async (req: Request, res: Response) => {
  // 获取用户 ID 和角色 ID
  const { uid, roleId } = JwtUtil.getUidAndRoleId(
    req.header(AuthConstant.TOKEN_HEADER) as string
  );
  // 获取频道 ID 和成员 ID
  const channelId = Number(req.params.channelId);
  const memberId = Number(req.params.memberId);
  // 更新成员身份
  await ChannelService.removeMemberFromChannel(uid, roleId, channelId, memberId);
  // 返回响应
  res.json(Result.success(MessageConstant.SUCCESSFUL_EXIT));
});

/**
 * @description 创建新的频道
 * @method POST
 * @path /channel
 */
channelRoute.post('/channel', async (req: Request, res: Response) => {
  // 获取用户 ID 和角色 ID
  const { uid, roleId } = JwtUtil.getUidAndRoleId(
    req.header(AuthConstant.TOKEN_HEADER) as string
  );
  // 封装请求体参数
  const channelDto = await ChannelDto.from(req.body);
  await ChannelService.createChannel(channelDto, uid, roleId);
  // 返回响应
  res.status(StatusCodes.CREATED)
    .json(
    Result.success(MessageConstant.SUCCESSFUL_CREATED)
  );
});

/**
 * @description 修改一个频道的基本信息（只有频道主和系统管理员可以修改）
 * @method PUT
 * @path /channel/:channelId
 */
channelRoute.put('/channel/:channelId', async (req: Request, res: Response) => {
  // 获取用户 ID 和角色 ID
  const { uid, roleId } = JwtUtil.getUidAndRoleId(
    req.header(AuthConstant.TOKEN_HEADER) as string
  );
  // 获取 channelId
  const channelId = Number(req.params.channelId);
  // 获取请求体数据
  const channelModifyDto = await ChannelModifyDto.from(req.body);
  // 更新数据库
  await ChannelService.modifyChannelInfo(channelModifyDto, uid, roleId, channelId);
  // 返回响应
  res.json(Result.success(MessageConstant.SUCCESSFUL_MODIFIED));
});

/**
 * @description 转让某个频道
 * @method POST
 * @path /channel/transfer
 */
channelRoute.post('/channel/transfer', async (req: Request, res: Response) => {
  // 获取用户 ID 和角色 ID
  const { uid, roleId } = JwtUtil.getUidAndRoleId(
    req.header(AuthConstant.TOKEN_HEADER) as string
  );
  // 获取请求体数据
  const channelTransferDto = await ChannelTransferDto.from(req.body);
  // 执行转让逻辑
  await ChannelService.transfer(channelTransferDto, uid, roleId);
  // 响应结果
  res.json(Result.success(MessageConstant.SUCCESSFUL_TRANSFER));
});

/**
 * @description 解散某个频道（只有频道主和系统管理员可以解散）
 * @method DELETE
 * @path /channel/:channelId
 */
channelRoute.delete('/channel/:channelId', async (req: Request, res: Response) => {
  // 获取用户 ID 和角色 ID
  const { uid, roleId } = JwtUtil.getUidAndRoleId(
    req.header(AuthConstant.TOKEN_HEADER) as string
  );
  // 获取 channelId
  const channelId = Number(req.params.channelId);
  // 执行解散逻辑
  await ChannelService.dissolveChannel(uid, roleId, channelId);
  // 响应结果
  res.json(Result.success(MessageConstant.SUCCESSFUL_DISSOLVE));
});

/**
 * @description 赋予某用户频道管理员身份（只能频道主或者系统管理员）
 * @method POST
 * @path /channel/:channelId/grant-admin
 */
channelRoute.post('/channel/grant-admin', async (req: Request, res: Response) => {
  // 获取用户 ID 和角色 ID
  const { uid: grantorId, roleId: grantorRoleId } = JwtUtil.getUidAndRoleId(
    req.header(AuthConstant.TOKEN_HEADER) as string
  );
  // 获取 body 传参
  const grantAdminDto = await ChannelGrantAdminDto.from(req.body);
  await ChannelService.grantAdministrator(grantorId, grantorRoleId, grantAdminDto);
  // 响应结果
  res.json(
    Result.success(MessageConstant.SUCCESSFUL_GRANT)
  );
});

/**
 * @description 收回某用户频道管理员身份（只有频道住或者系统管理员）
 * @method DELETE
 * @path /channel/grant-admin
 */
channelRoute.delete('/channel/grant-admin', async (req: Request, res: Response) => {
   // 获取用户 ID 和角色 ID
   const { uid: grantorId, roleId: grantorRoleId } = JwtUtil.getUidAndRoleId(
    req.header(AuthConstant.TOKEN_HEADER) as string
  );
  // 获取 body 传参
  const grantAdminDto = await ChannelGrantAdminDto.from(req.body);
  await ChannelService.revokeAdministrator(grantorId, grantorRoleId, grantAdminDto);
  // 响应结果
  res.json(
    Result.success(MessageConstant.SUCCESSFUL_MODIFIED)
  );
})

/**
 * @description 获得频道下的成员列表
 * @method GET
 * @path /channel/:channelId/members
 */
channelRoute.get('/channel/:channelId/members', async (req: Request, res: Response) => {
  // 获取频道 ID
  const channelId = Number(req.params.channelId);
  // 获取成员列表
  const members = await ChannelService.getMembersInChannel(channelId);
  // 返回响应
  res.json(Result.success(members));
})

/**
 * @description 获取用户在频道中的权限
 * @method GET
 * @path /channel/:channelId/authority
 */
channelRoute.get('/channel/:channelId/authority', async (req: Request, res: Response) => {
  // 获取频道 ID
  const channelId = Number(req.params.channelId);
  // 获取用户 ID
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);
  // 获取权限
  const authority = await ChannelService.getUserAuthorityInChannel(channelId, uid);
  // 返回响应
  res.json(Result.success(authority));
})

export default channelRoute;
