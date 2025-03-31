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

export default tourRoute;