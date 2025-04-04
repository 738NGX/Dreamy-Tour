import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";

class LocationPhotosDto extends DTO<LocationPhotosDto> {
  @Expose()
  @Type(() => Number)
  tourId: number;

  @Expose()
  @Type(() => Number)
  copyIndex: number;

  @Expose()
  @Type(() => Number)
  locationIndex: number;
  
  @Expose()
  photos: string[];
}

export default LocationPhotosDto;