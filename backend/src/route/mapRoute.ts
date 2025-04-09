import TransitDirectionDto from "@/dto/map/transitDirectionDto";
import GaodeService from "@/service/gaodeService";
import Result from "@/vo/result";
import express, { Request, Response } from "express"

const mapRoute = express.Router();

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