import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";

class GeoEncodeDto extends DTO<GeoEncodeDto> {
  @Expose()
  @Type(() => String)
  address: string;
}

export default GeoEncodeDto;