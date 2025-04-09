import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { IsIn, Matches } from "class-validator";

class TransitDirectionDto extends DTO<TransitDirectionDto> {
  @Expose()
  @Type(() => String)
  @Matches(/^(-?\d{1,3}(?:\.\d{1,6})?),(-?\d{1,2}(?:\.\d{1,6})?)$/, {
    message: '经度在前，纬度在后，经度和纬度用","分割，经纬度小数点后不得超过6位。'
  })
  origin: string;

  @Expose()
  @Type(() => String)
  @Matches(/^(-?\d{1,3}(?:\.\d{1,6})?),(-?\d{1,2}(?:\.\d{1,6})?)$/, {
    message: '经度在前，纬度在后，经度和纬度用","分割，经纬度小数点后不得超过6位。'
  })
  destination: string;

  @Expose()
  @Type(() => Number)
  @IsIn([0, 1, 2, 3, 4, 5, 7, 8], {
    message: '非有效策略'
  })
  strategy: number;

  @Expose()
  @Type(() => String)
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: '日期格式应为 yyyy-mm-dd'
  })
  date: string;

  @Expose()
  @Type(() => String)
  @Matches(/^\d{2}-\d{2}$/, {
    message: '时间格式应为 hh-mm'
  })
  time: string;
}

export default TransitDirectionDto;