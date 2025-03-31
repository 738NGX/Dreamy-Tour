import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";

class TourDto extends DTO<TourDto> {
  // 行程ID
  @Expose()
  @Type(() => Number)
  id: number;
  // 行程名称
  @Expose()
  @Type(() => String)
  title: string;
  // 行程状态
  @Expose()
  @Type(() => Number)
  status: number;
  // 行程绑定频道ID
  @Expose()
  @Type(() => Number)
  linkedChannel: number;
  // 行程在频道中的可见性
  @Expose()
  @Type(() => Number)
  channelVisible: number;
  // 行程绑定群组ID
  @Expose()
  @Type(() => Number)
  linkedGroup: number;
  // 行程开始日期
  @Expose()
  @Type(() => Number)
  startDate: number;
  // 行程结束日期
  @Expose()
  @Type(() => Number)
  endDate: number;
  // 行程默认时差
  @Expose()
  @Type(() => Number)
  timeOffset: number;
  // 行程主货币
  @Expose()
  @Type(() => Number)
  mainCurrency: number;
  // 行程副货币
  @Expose()
  @Type(() => Number)
  subCurrency: number;
  // 行程货币汇率
  @Expose()
  @Type(() => Number)
  currencyExchangeRate: number;
  // 行程用户列表
  @Expose()
  users: number[];
  // 行程版本名称列表
  @Expose()
  nodeCopyNames: string[];
  // 行程预算表列表
  @Expose()
  budgets: object[];
  // 行程地点列表
  @Expose()
  locations: object[][];
  // 行程交通列表
  @Expose()
  transportations: object[][];
};

export default TourDto;