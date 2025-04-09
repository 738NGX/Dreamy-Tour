import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { Matches } from "class-validator";

class GeoDecodeDto extends DTO<GeoDecodeDto> {
  @Expose()
  @Type(() => String)
  @Matches(/^(-?\d{1,3}(?:\.\d{1,6})?),(-?\d{1,2}(?:\.\d{1,6})?)$/, {
    message: '经度在前，纬度在后，经度和纬度用","分割，经纬度小数点后不得超过6位。'
  })
  location: string;
}

export default GeoDecodeDto;