import AuthConstant from "@/constant/authConstant";
import MessageConstant from "@/constant/messageConstant";
import GroupDto from "@/dto/group/groupDto";
import GroupService from "@/service/groupService";
import JwtUtil from "@/util/jwtUtil";
import Result from "@/vo/result";
import express, { Request, Response } from "express"
import { StatusCodes } from "http-status-codes";

const groupRoute = express.Router();

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
  // 获取频道 ID
  const groupId = Number(req.params.groupId);
  // 获取频道详情
  const groupDetailVo = await GroupService.getDetailByGroupId(groupId);
  // 返回响应
  res.json(Result.success(groupDetailVo));
})

export default groupRoute;