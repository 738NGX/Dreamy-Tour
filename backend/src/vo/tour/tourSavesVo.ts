import VO from "@/base/vo";
import TourBasicVo from "./tourBasicVo";

class TourSavesVo extends VO<TourSavesVo> {
  // 行程ID
  tourId: number;
  // 行程名称
  title: string;
  // 行程在频道中的可见性
  channelVisible: number;
  // 行程开始日期
  startDate: number;
  // 行程结束日期
  endDate: number;
  locations: any[][];
}

export default TourSavesVo;