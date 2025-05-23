import AppConstant from "@/constant/appConstant";
import GeoDecodeDto from "@/dto/map/geoDecodeDto";
import GeoEncodeDto from "@/dto/map/geoEncodeDto";
import ApiError from "@/exception/apiError";
import RegeocodeVo from "@/vo/map/regeocodeVo";
import axios from "axios";
import GeocodeVo from "@/vo/map/geocodeVo";
import TransitDirectionDto from "@/dto/map/transitDirectionDto";
import TransitDirectionVo, { TransitRoute, TransitNode, TransitPlan } from "@/vo/map/transitDirectionVo";
import CommonUtil from "@/util/commonUtil";
import https from "https";
import GeoEncodeVo from "@/vo/map/geoEncodeVo";
import GeoDecodeVo from "@/vo/map/geoDecodeVo";
import WalkDirectionDto from "@/dto/map/walkDirectionDto";
import WalkDirectionVo, { WalkRoute, WalkPlan } from "@/vo/map/walkDirectionVo";

const agent = new https.Agent({
  servername: 'restapi.amap.com'
});

type GeoEncodeResponse = {
  status: string;
  info: string;
  infocode: string;
  count: string;
  geocodes: GeocodeVo[];
};

type GeoDecodeResponse = {
  status: string;
  info: string;
  infocode: string;
  regeocode: RegeocodeVo;
};

type TransitDirectionResponse = {
  status: string;
  info: string;
  infocode: string;
  count: string;
  route: TransitRoute;
};

type WalkDirectionResponse = {
  status: string;
  info: string;
  infocode: string;
  count: string;
  route: WalkRoute;
};

function handleError(error: any) {
  if (error.response) {
    console.error(`\n${new Date().toISOString()} | Gaode [${CommonUtil.textColor('error.response.data', 'red')}] :`);
    console.log(error.response.data);
    console.error(`\n${new Date().toISOString()} | Gaode [${CommonUtil.textColor('error.response.status', 'red')}] :`);
    console.log(error.response.status);
    console.error(`\n${new Date().toISOString()} | Gaode [${CommonUtil.textColor('error.response.headers', 'red')}] :`);
    console.log(error.response.headers);
  } else if (error.request) {
    console.error(`\n${new Date().toISOString()} | Gaode [${CommonUtil.textColor('error.request', 'red')}] :`);
    console.log(error.request);
  } else {
    console.error(`\n${new Date().toISOString()} | Gaode [${CommonUtil.textColor('Error', 'red')}] :`);
    console.log('Error', error.message);
  }
  console.error(`\n${new Date().toISOString()} | Gaode [${CommonUtil.textColor('error.config', 'red')}] :`);
  console.log(error.config);
}

class GaodeService {
  static async geoEncode(geoEncodeDto: GeoEncodeDto): Promise<GeocodeVo[]> {
    const { address, city } = geoEncodeDto;
    const url = city
      ? `https://restapi.amap.com/v3/geocode/geo?address=${address}&output=JSON&key=${AppConstant.GAODE_API_KEY}&city=${city}`
      : `https://restapi.amap.com/v3/geocode/geo?address=${address}&output=JSON&key=${AppConstant.GAODE_API_KEY}`;
    try {
      const res = await axios.get(url, { httpsAgent: agent }).catch(function (error) {
        handleError(error);
        throw new ApiError("地址解析失败");
      });
      const data = res.data as GeoEncodeResponse;
      //const res = await fetch(url);
      //const data = await res.json() as GeoEncodeResponse;
      if (data.status !== "1") {
        if (data.infocode === "30001") {
          return [] as GeocodeVo[];
        }
        throw new ApiError(data.info);
      }
      if (data.geocodes.length === 0) {
        console.error(`${new Date().toISOString()} | Gaode [${CommonUtil.textColor('地址解析失败', 'red')}] ${url}`);
        throw new ApiError("地址解析失败");
      }
      const geoEncodeVoList: GeocodeVo[] = data.geocodes.map((item) => {
        return new GeocodeVo(item);
      });
      return geoEncodeVoList;
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `${new Date().toISOString()} | Gaode [${CommonUtil.textColor('地图服务接口不可用', 'red')}] ${url}: ${error.message}\n${error.stack}`
        );
      } else {
        console.error(
          `${new Date().toISOString()} | Gaode [${CommonUtil.textColor('地图服务接口不可用', 'red')}] ${url}:`,
          error
        );
      }
      throw new ApiError("地图服务接口不可用");
    }
  }

  static async geoDecode(geoDecodeDto: GeoDecodeDto): Promise<RegeocodeVo> {
    const { location } = geoDecodeDto;
    const url = `https://restapi.amap.com/v3/geocode/regeo?location=${location}&output=JSON&key=${AppConstant.GAODE_API_KEY}`;
    try {
      const res = await axios.get(url, { httpsAgent: agent }).catch(function (error) {
        handleError(error);
        throw new ApiError("地址解析失败");
      });
      const data = res.data as GeoDecodeResponse;
      //const res = await fetch(url);
      //const data = await res.json() as GeoDecodeResponse;
      if (data.status !== "1") {
        throw new ApiError(data.info);
      }
      if (!data.regeocode) {
        console.error(`${new Date().toISOString()} | Gaode [${CommonUtil.textColor('地址解析失败', 'red')}] ${url}`);
        throw new ApiError("地址解析失败");
      }
      return data.regeocode;
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `${new Date().toISOString()} | Gaode [${CommonUtil.textColor('地图服务接口不可用', 'red')}] ${url}: ${error.message}\n${error.stack}`
        );
      } else {
        console.error(
          `${new Date().toISOString()} | Gaode [${CommonUtil.textColor('地图服务接口不可用', 'red')}] ${url}:`,
          error
        );
      }
      throw new ApiError("地图服务接口不可用");
    }
  }

  static async getTransitDirection(transitDirectionDto: TransitDirectionDto): Promise<TransitDirectionVo> {
    const { origin, destination, strategy, date, time } = transitDirectionDto;
    const city1 = (await this.geoDecode(await GeoDecodeDto.from({ location: origin }))).addressComponent.citycode ?? "999";
    const city2 = (await this.geoDecode(await GeoDecodeDto.from({ location: destination }))).addressComponent.citycode ?? "999";
    const url = `https://restapi.amap.com/v5/direction/transit/integrated?origin=${origin}&destination=${destination}&key=${AppConstant.GAODE_API_KEY}&city1=${city1}&city2=${city2}&strategy=${strategy}&date=${date}&time=${time}&output=JSON&show_fields=cost&extensions=all`;
    try {
      const res = await axios.get(url, { httpsAgent: agent }).catch(function (error) {
        handleError(error);
        throw new ApiError("地址解析失败");
      });
      const data = res.data as TransitDirectionResponse;
      //const res = await fetch(url);
      //const data = await res.json() as TransitDirectionResponse;
      if (data.status !== "1") {
        throw new ApiError(data.info);
      }
      const transits = data.route.transits;
      const plans = [] as TransitPlan[];
      for (const transit of transits) {
        const route = [{
          title: "行程总价",
          amount: parseInt(transit.cost.transit_fee),
          type: 9,
          note: '生成的路线仅包含总耗费价格,如想编辑每个节点的价格可删除本条后再编辑.'
        }] as TransitNode[];
        let walking_distance = 0;
        for (const segment of transit.segments) {
          if (segment.walking) {
            const walking = segment.walking;
            const duration = parseInt(walking.cost.duration);
            route.push({
              title: `步行约${Math.round(duration / 60)}分钟`,
              amount: 0,
              type: 4,
              note: `步行${walking.distance}m,约${Math.floor(duration / 3600)}小时${Math.round(duration % 3600 / 60)}分钟,路径为:\n${walking.steps.map((step) => step.instruction).join('\n')}`,
            });
            walking_distance += parseInt(walking.distance);
          }
          if (segment.bus) {
            const buslines = segment.bus.buslines;
            for (const busline of buslines) {
              const getType = (type: string) => {
                if (type.includes('公交')) return 0;
                if (type.includes('地铁')) return 1;
                return 9;
              }
              const duration = parseInt(busline.cost.duration);
              route.push({
                title: busline.name,
                amount: 0,
                type: getType(busline.type),
                note: `乘坐${busline.type}:${busline.name},预计花费${Math.floor(duration / 3600)}小时${Math.round(duration % 3600 / 60)}分钟.
线路首班车时间为${busline.start_time},末班车时间为${busline.end_time},请注意首末班车时间.${busline.bus_time_tips}
起点站:${busline.departure_stop.name}${busline.departure_stop.exit ? `(${busline.departure_stop.exit.name})` : ''}
终点站:${busline.arrival_stop.name}${busline.arrival_stop.exit ? `(${busline.arrival_stop.exit.name})` : ''}
途经${busline.via_num}站:${busline.via_stops.map((stop) => stop.name).join('、')}`,
              });
            }
          }
          if (segment.railway) {
            const railway = segment.railway;
            const duration = parseInt(railway.time);
            route.push({
              title: railway.name,
              amount: 0,
              type: 2,
              note: `乘坐${railway.type}:${railway.name},预计花费${Math.floor(duration / 3600)}小时${Math.round(duration % 3600 / 60)}分钟.
出发站:${railway.departure_stop.name},时间:${railway.departure_stop.time}${railway.departure_stop.start ? ',线路起点站' : ''}${railway.departure_stop.end ? ',线路终点站' : ''}${railway.departure_stop.wait ? `,停站时间:${railway.departure_stop.wait}秒` : ''}
${railway.via_stops.map((stop) => `途经站:${stop.name},时间:${stop.time}${stop.start ? ',线路起点站' : ''}${stop.end ? ',线路终点站' : ''}${stop.wait ? `,停站时间:${stop.wait}秒` : ''}`).join('\n')}
终点站:${railway.arrival_stop.name},时间:${railway.arrival_stop.time}${railway.arrival_stop.start ? ',线路起点站' : ''}${railway.arrival_stop.end ? ',线路终点站' : ''}${railway.arrival_stop.wait ? `,停站时间:${railway.arrival_stop.wait}秒` : ''}
票价信息:
${railway.spaces.map((space) => `${space.code}:${space.cost}元`).join(' / ')}
              `,
            });
          }
          if (segment.taxi) {
            const taxi = segment.taxi;
            const duration = parseInt(taxi.drivetime);
            route.push({
              title: `打车`,
              amount: 0,
              type: 7,
              note: `打车${taxi.distance}m,预计花费${taxi.price}元,用时花费${Math.floor(duration / 3600)}小时${Math.round(duration % 3600 / 60)}分钟`,
            });
          }
        }
        plans.push({
          duration: parseInt(transit.cost.duration),
          distance: parseInt(transit.distance),
          walking_distance: walking_distance,
          route: route,
        });
      }
      return new TransitDirectionVo({ plans });
    } catch (error) {
      console.error(`${new Date().toISOString()} | Gaode [${CommonUtil.textColor('地图服务接口不可用', 'red')}] ${url}: ${error}`);
      throw new ApiError("地图服务接口不可用");
    }
  }

  static async getWalkDirection(walkDirectionDto: WalkDirectionDto): Promise<WalkDirectionVo> {
    const { origin, destination, strategy: isindoor } = walkDirectionDto;
    const url = `https://restapi.amap.com/v5/direction/walking?key=${AppConstant.GAODE_API_KEY}&isindoor=${isindoor}&origin=${origin}&destination=${destination}&alternative_route=3`;
    try {
      const res = await axios.get(url, { httpsAgent: agent }).catch(function (error) {
        handleError(error);
        throw new ApiError("地址解析失败");
      });
      const data = res.data as WalkDirectionResponse;
      //const res = await fetch(url);
      //const data = await res.json() as TransitDirectionResponse;
      if (data.status !== "1") {
        throw new ApiError(data.info);
      }
      const plans = data.route.paths.map((item) => {
        return {
          duration: parseInt(item.cost.duration),
          distance: parseInt(item.distance),
          note: item.steps.map((step) => step.instruction).join('\n'),
        } as WalkPlan;
      });
      return new WalkDirectionVo({ plans });
    } catch (error) {
      console.error(`${new Date().toISOString()} | Gaode [${CommonUtil.textColor('地图服务接口不可用', 'red')}] ${url}: ${error}`);
      throw new ApiError("地图服务接口不可用");
    }
  }

  static async getLocationByAddress(address: string, city: string = ""): Promise<GeoEncodeVo[]> {
    const geoEncodeDto = await GeoEncodeDto.from({ address, city });
    const geoEncodeVoList = await this.geoEncode(geoEncodeDto);
    return geoEncodeVoList.slice(0, 6).map((item) => {
      return new GeoEncodeVo({
        address: item.formatted_address,
        province: item.province,
        city: item.city,
        district: item.district,
        longitude: parseFloat(item.location.split(",")[0]),
        latitude: parseFloat(item.location.split(",")[1]),
      });
    });
  }

  static async getAddressByLocation(location: string): Promise<GeoDecodeVo> {
    const geoDecodeDto = await GeoDecodeDto.from({ location });
    const geoDecodeVo = await this.geoDecode(geoDecodeDto);
    return new GeoDecodeVo({
      address: geoDecodeVo.formatted_address,
    });
  }
}

export default GaodeService;