import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsNotEmpty } from "class-validator";

class BindWxDto extends DTO<BindWxDto> {
  // 授权码
  @Expose()
  @IsNotEmpty({
    message: "授权码不能为空"
  })
  @Type(() => String)
  code: string

  // 是否强制
  @Expose()
  @IsBoolean({
    message: "force 参数只能是布尔类型"
  })
  @Type(() => Boolean)
  force: boolean
}

export default BindWxDto;