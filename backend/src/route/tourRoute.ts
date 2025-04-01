import MessageConstant from "@/constant/messageConstant";
import TourBasicDto from "@/dto/tour/tourBasicDto";
import TourDto from "@/dto/tour/tourDto";
import TourService from "@/service/tourService";
import Result from "@/vo/result";
import express, { Request, Response } from "express"

const tourRoute = express.Router();

/**
 * @description 获取某一行程详情
 * @method GET
 * @path tour/:tourId/detail
 */
tourRoute.get('/tour/:tourId/detail', async (req: Request, res: Response) => {
  const tourId = Number(req.params.tourId);
  const tourDetailVo = await TourService.getDetailByTourId(tourId);
  // 返回响应
  res.json(Result.success(tourDetailVo));
})

/**
 * @description 获取某一行程详情（根据群组 ID）
 * @method GET
 * @path tour/:groupId/detailByGroup
 */
tourRoute.get('/tour/:groupId/detailByGroup', async (req: Request, res: Response) => {
  const groupId = Number(req.params.groupId);
  const tourDetailVo = await TourService.getDetailByGroupId(groupId);
  res.json(Result.success(tourDetailVo));
})


tourRoute.get('/tour/:tourId/full', async (req: Request, res: Response) => {
  const tourId = Number(req.params.tourId);
  const tourFullVo = await TourService.getFullByTourId(tourId);
  res.json(Result.success(tourFullVo));
})

tourRoute.put('/tour', async (req: Request, res: Response) => {
  const tourBasicDto = await TourBasicDto.from(req.body);
  await TourService.updateTourBasic(tourBasicDto);
  res.json(Result.success(MessageConstant.SUCCESSFUL_MODIFIED));
})

tourRoute.get('/tour/:tourId/members', async (req: Request, res: Response) => {
  const tourId = Number(req.params.tourId);
  const members = await TourService.getMembersInTour(tourId);
  res.json(Result.success(members));
})

tourRoute.put('/tour/full', async (req: Request, res: Response) => {
  // 暂时跳过检查
  // const tourDto = await TourDto.from(req.body);
  const tourDto = new TourDto(req.body);
  await TourService.updateTour(tourDto);
  res.json(Result.success(MessageConstant.SUCCESSFUL_MODIFIED));
})

export default tourRoute;