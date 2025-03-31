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
  // 获取频道 ID
  const tourId = Number(req.params.tourId);
  // 获取频道详情
  const tourDetailVo = await TourService.getDetailByTourId(tourId);
  // 返回响应
  res.json(Result.success(tourDetailVo));
})

tourRoute.get('/tour/:groupId/detailByGroup', async (req: Request, res: Response) => {
  // 获取频道 ID
  const groupId = Number(req.params.groupId);
  // 获取频道详情
  const tourDetailVo = await TourService.getDetailByGroupId(groupId);
  // 返回响应
  res.json(Result.success(tourDetailVo));
})

tourRoute.get('/tour/:tourId/full', async (req: Request, res: Response) => {
  // 获取频道 ID
  const tourId = Number(req.params.tourId);
  // 获取频道详情
  const tourFullVo = await TourService.getFullByTourId(tourId);
  // 返回响应
  res.json(Result.success(tourFullVo));
})

tourRoute.put('/tour', async (req: Request, res: Response) => {
  // 获取频道详情
  const tourBasicDto = await TourBasicDto.from(req.body);
  await TourService.updateTourBasic(tourBasicDto);
  // 返回响应
  res.json(Result.success(MessageConstant.SUCCESSFUL_MODIFIED));
})

tourRoute.put('/tour/full', async (req: Request, res: Response) => {
  // 获取频道详情
  console.log(req.body);
  //const tourDto = await TourDto.from(req.body);
  const tourDto = new TourDto(req.body);
  console.log(tourDto);
  await TourService.updateTour(tourDto);
  // 返回响应
  res.json(Result.success(MessageConstant.SUCCESSFUL_MODIFIED));
})

export default tourRoute;