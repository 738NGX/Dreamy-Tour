import deepseek from "@/config/deepseekConfig";
import TransitDirectionDto from "@/dto/map/transitDirectionDto";
import WalkDirectionDto from "@/dto/map/walkDirectionDto";
import ParamsError from "@/exception/paramsError";
import gaodeMcpClient from "@/mcp/gaodeMcpClient";
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

mapRoute.get('/map/streamtest', async (req: Request, res: Response) => {
  // 发起请求，开始处理
  const completion = await deepseek.chat.completions.create({
    messages: [{ role: "user", content: "给出2025年5月1日在上海的旅游行程规划.以形如{locations:[{address:'',start:'yyyy-mm-dd hh:mm',end:'yyyy-mm-dd hh:mm',note:''},...]}的json格式返回,其中address为位置的地址,note为这个位置的建议" }],
    model: "deepseek-chat",
    max_tokens: 4000,
    temperature: 0.7,
    stream: true,
    response_format: { type: 'json_object' },
  });
  for await (const chuck of completion) {
    if (chuck.choices && chuck.choices[0] && chuck.choices[0].delta && chuck.choices[0].delta.content) {
      res.write(chuck.choices[0].delta.content);
    }
  }
  res.end();
})

export default mapRoute;