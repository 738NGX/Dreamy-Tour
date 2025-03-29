import VO from "@/base/vo";

class TourBasicVo extends VO<TourBasicVo> {
  // 行程ID
  tourId: number;
  // 行程名称
  title: string;
  // 行程状态
  status: number;
  // 行程绑定频道ID
  linkedChannel: number;
  // 行程在频道中的可见性
  channelVisible: number;
  // 行程绑定群组ID
  linkedGroup: number;
  // 行程开始日期
  startDate: number;
  // 行程结束日期
  endDate: number;
  // 行程默认时差
  timeOffset: number;
  // 行程主货币
  mainCurrency: number;
  // 行程副货币
  subCurrency: number;
  // 行程货币汇率
  currencyExchangeRate: number;
}

export default TourBasicVo;