import deepseek from "@/config/deepseekConfig";
import TransitDirectionDto from "@/dto/map/transitDirectionDto";
import WalkDirectionDto from "@/dto/map/walkDirectionDto";
import ParamsError from "@/exception/paramsError";
import GaodeService from "@/service/gaodeService";
import Result from "@/vo/result";
import express, { Request, Response } from "express"

const mapRoute = express.Router();

mapRoute.get('/map/geoEncode', async (req: Request, res: Response) => {
  const { address, city } = req.query;
  if (typeof address !== 'string') {
    throw new ParamsError('地址不能为空');
  }
  const geoEncodeVo = await GaodeService.getLocationByAddress(address, city as any);
  res.json(Result.success(geoEncodeVo));
})

mapRoute.get('/map/geoDecode', async (req: Request, res: Response) => {
  const { location } = req.query;
  if (typeof location !== 'string') {
    throw new ParamsError('经纬度不能为空');
  }
  const geoDecodeVo = await GaodeService.getAddressByLocation(location);
  res.json(Result.success(geoDecodeVo));
})

mapRoute.get('/map/direction/transit', async (req: Request, res: Response) => {
  const { origin, destination, strategy, date, time } = req.query;
  const transitDirectionDto = await TransitDirectionDto.from({
    origin,
    destination,
    strategy,
    date,
    time
  });
  const transitDirectionVo = await GaodeService.getTransitDirection(transitDirectionDto);
  res.json(Result.success(transitDirectionVo));
})

mapRoute.get('/map/direction/walk', async (req: Request, res: Response) => {
  const { origin, destination, strategy } = req.query;
  const walkDirectionDto = await WalkDirectionDto.from({
    origin,
    destination,
    strategy
  });
  const walkDirectionVo = await GaodeService.getWalkDirection(walkDirectionDto);
  res.json(Result.success(walkDirectionVo));
})

export default mapRoute;