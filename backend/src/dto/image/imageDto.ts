import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";

class ImageDto extends DTO<ImageDto> {
  @Expose()
  @Type(() => String)
  base64: string;
}

export default ImageDto;