import AuthConstant from "@/constant/authConstant";
import MessageConstant from "@/constant/messageConstant";
import GroupDto from "@/dto/group/groupDto";
import GroupGrantAdminDto from "@/dto/group/groupGrantAdminDto";
import GroupModifyDto from "@/dto/group/groupModifyDto";
import GroupTransferDto from "@/dto/group/groupTransferDto";
import GroupService from "@/service/groupService";
import JwtUtil from "@/util/jwtUtil";
import Result from "@/vo/result";
import express, { Request, Response } from "express"
import { StatusCodes } from "http-status-codes";

const groupRoute = express.Router();

/**
 * @description 获取用户加入的群组列表
 * @method GET
 * @path /group/joined/list
 */
groupRoute.get('/group/:channelId/joined/list', async (req: Request, res: Response) => {
  // 获取用户 ID
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);  // 经过拦截器处理之后，剩下来的请求中一定包含 token，因此断言为 string
  const channelId = Number(req.params.channelId);
  const groupListVos = await GroupService.getJoinedGroupList(channelId, uid);
  // 返回结果
  res.json(Result.success(groupListVos));
});

/**
 * @description 获取用户没有加入的群组列表
 * @method GET
 * @path /group/unjoined/list
 */
groupRoute.get('/group/:channelId/unjoined/list', async (req: Request, res: Response) => {
  // 获取用户 ID
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);
  const channelId = Number(req.params.channelId);
  const groupListVos = await GroupService.getUnjoinedGroupList(channelId, uid);
  // 返回结果
  res.json(Result.success(groupListVos));
})

/**
 * @description 获取某一群组详情
 * @method GET
 * @path group/:groupId/detail
 */
groupRoute.get('/group/:groupId/detail', async (req: Request, res: Response) => {
  // 获取群组 ID
  const groupId = Number(req.params.groupId);
  // 获取群组详情
  const groupDetailVo = await GroupService.getDetailByGroupId(groupId);
  // 返回响应
  res.json(Result.success(groupDetailVo));
})

/**
 * @description 加入某个群组
 * @method POST
 * @path /group/:groupId/join
 */
groupRoute.post('/group/:groupId/join', async (req: Request, res: Response) => {
  // 获取用户 ID
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);  // 经过拦截器处理之后，剩下来的请求中一定包含 token，因此断言为 string
  // 获取群组 ID
  const groupId = Number(req.params.groupId);
  // 加入该群组
  await GroupService.join(uid, groupId);
  res.status(StatusCodes.CREATED)
    .json(Result.success(MessageConstant.SUCCESSFUL_JOIN));
});

/**
 * @description 退出某个群组
 * @method DELETE
 * @path /group/:groupId/join
 */
groupRoute.delete('/group/:groupId/join', async (req: Request, res: Response) => {
  // 获取用户 ID
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);  // 经过拦截器处理之后，剩下来的请求中一定包含 token，因此断言为 string
  // 获取群组 ID
  const groupId = Number(req.params.groupId);
  // 退出该群组
  await GroupService.exit(uid, groupId);
  res.status(StatusCodes.OK)
    .json(Result.success(MessageConstant.SUCCESSFUL_EXIT));
});

groupRoute.put('/group/:groupId/join/:memberId/:linkedTourId', async (req: Request, res: Response) => {
  // 获取用户 ID 和角色 ID
  const { uid, roleId } = JwtUtil.getUidAndRoleId(
    req.header(AuthConstant.TOKEN_HEADER) as string
  );
  // 获取群组 ID 和成员 ID
  const groupId = Number(req.params.groupId);
  const memberId = Number(req.params.memberId);
  const linkedTourId = Number(req.params.linkedTourId);
  // 更新成员身份
  await GroupService.addMemberToGroup(uid, roleId, memberId, groupId, linkedTourId);
  // 返回响应
  res.json(Result.success(MessageConstant.SUCCESSFUL_JOIN));
});

groupRoute.delete('/group/:groupId/join/:memberId/:linkedTourId', async (req: Request, res: Response) => {
  // 获取用户 ID 和角色 ID
  const { uid, roleId } = JwtUtil.getUidAndRoleId(
    req.header(AuthConstant.TOKEN_HEADER) as string
  );
  // 获取群组 ID 和成员 ID
  const groupId = Number(req.params.groupId);
  const memberId = Number(req.params.memberId);
  const linkedTourId = Number(req.params.linkedTourId);
  // 更新成员身份
  await GroupService.removeMemberFromGroup(uid, roleId, memberId, groupId, linkedTourId);
  // 返回响应
  res.json(Result.success(MessageConstant.SUCCESSFUL_EXIT));
});

/**
 * @description 创建新的群组
 * @method POST
 * @path /group
 */
groupRoute.post('/group', async (req: Request, res: Response) => {
  // 获取用户 ID 和角色 ID
  const { uid, roleId } = JwtUtil.getUidAndRoleId(
    req.header(AuthConstant.TOKEN_HEADER) as string
  );
  // 封装请求体参数
  const groupDto = await GroupDto.from(req.body);
  await GroupService.createGroup(groupDto, uid, roleId);
  // 返回响应
  res.status(StatusCodes.CREATED)
    .json(
      Result.success(MessageConstant.SUCCESSFUL_CREATED)
    );
});

/**
 * @description 修改一个群组的基本信息（只有群组主和系统管理员可以修改）
 * @method PUT
 * @path /group/:groupId
 */
groupRoute.put('/group/:groupId', async (req: Request, res: Response) => {
  // 获取用户 ID 和角色 ID
  const { uid, roleId } = JwtUtil.getUidAndRoleId(
    req.header(AuthConstant.TOKEN_HEADER) as string
  );
  // 获取 groupId
  const groupId = Number(req.params.groupId);
  // 获取请求体数据
  const groupModifyDto = await GroupModifyDto.from(req.body);
  // 更新数据库
  await GroupService.modifyGroupInfo(groupModifyDto, uid, roleId, groupId);
  // 返回响应
  res.json(Result.success(MessageConstant.SUCCESSFUL_MODIFIED));
});

/**
 * @description 转让某个群组
 * @method POST
 * @path /group/transfer
 */
groupRoute.post('/group/transfer', async (req: Request, res: Response) => {
  // 获取用户 ID 和角色 ID
  const { uid, roleId } = JwtUtil.getUidAndRoleId(
    req.header(AuthConstant.TOKEN_HEADER) as string
  );
  // 获取请求体数据
  const groupTransferDto = await GroupTransferDto.from(req.body);
  // 执行转让逻辑
  await GroupService.transfer(groupTransferDto, uid, roleId);
  // 响应结果
  res.json(Result.success(MessageConstant.SUCCESSFUL_TRANSFER));
});

/**
 * @description 解散某个群组（只有群组主和系统管理员可以解散）
 * @method DELETE
 * @path /group/:groupId
 */
groupRoute.delete('/group/:groupId', async (req: Request, res: Response) => {
  // 获取用户 ID 和角色 ID
  const { uid, roleId } = JwtUtil.getUidAndRoleId(
    req.header(AuthConstant.TOKEN_HEADER) as string
  );
  // 获取 groupId
  const groupId = Number(req.params.groupId);
  // 执行解散逻辑
  await GroupService.dissolveGroup(uid, roleId, groupId);
  // 响应结果
  res.json(Result.success(MessageConstant.SUCCESSFUL_DISSOLVE));
});

/**
 * @description 赋予某用户群组管理员身份（只能群组主或者系统管理员）
 * @method POST
 * @path /group/grant-admin
 */
groupRoute.post('/group/grant-admin', async (req: Request, res: Response) => {
  // 获取用户 ID 和角色 ID
  const { uid: grantorId, roleId: grantorRoleId } = JwtUtil.getUidAndRoleId(
    req.header(AuthConstant.TOKEN_HEADER) as string
  );
  // 获取 body 传参
  const grantAdminDto = await GroupGrantAdminDto.from(req.body);
  await GroupService.grantAdministrator(grantorId, grantorRoleId, grantAdminDto);
  // 响应结果
  res.json(Result.success(MessageConstant.SUCCESSFUL_GRANT));
});

/**
 * @description 收回某用户群组管理员身份（只有群组主或者系统管理员）
 * @method DELETE
 * @path /group/grant-admin
 */
groupRoute.delete('/group/grant-admin', async (req: Request, res: Response) => {
  // 获取用户 ID 和角色 ID
  const { uid: grantorId, roleId: grantorRoleId } = JwtUtil.getUidAndRoleId(
    req.header(AuthConstant.TOKEN_HEADER) as string
  );
  // 获取 body 传参
  const grantAdminDto = await GroupGrantAdminDto.from(req.body);
  await GroupService.revokeAdministrator(grantorId, grantorRoleId, grantAdminDto);
  // 响应结果
  res.json(Result.success(MessageConstant.SUCCESSFUL_MODIFIED));
});

/**
 * @description 获得群组下的成员列表
 * @method GET
 * @path /group/:groupId/members
 */
groupRoute.get('/group/:groupId/members', async (req: Request, res: Response) => {
  // 获取群组 ID
  const groupId = Number(req.params.groupId);
  // 获取成员列表
  const members = await GroupService.getMembersInGroup(groupId);
  // 返回响应
  res.json(Result.success(members));
})

/**
 * @description 获得当前用户在当前群组下的管理权限
 * @method GET
 * @path /group/:groupId/authority
 */
groupRoute.get('/group/:groupId/authority', async (req: Request, res: Response) => {
  // 获取群组 ID
  const groupId = Number(req.params.groupId);
  // 获取用户 ID
  const uid = JwtUtil.getUid(req.header(AuthConstant.TOKEN_HEADER) as string);
  // 获取权限
  const authority = await GroupService.getUserAuthorityInGroup(groupId, uid);
  // 返回响应
  res.json(Result.success(authority));
})

export default groupRoute;