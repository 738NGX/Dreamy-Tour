import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { Matches, IsIn } from "class-validator";

class WalkDirectionDto extends DTO<WalkDirectionDto> {
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
  @IsIn([0, 1], {
    message: '非有效策略'
  })
  strategy: number;
}

export default WalkDirectionDto;