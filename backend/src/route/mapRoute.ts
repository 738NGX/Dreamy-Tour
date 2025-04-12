import TransitDirectionDto from "@/dto/map/transitDirectionDto";
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

export default mapRoute;