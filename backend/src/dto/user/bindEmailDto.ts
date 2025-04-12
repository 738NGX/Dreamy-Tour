import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsEmail } from "class-validator";

class BindEmailDto extends DTO<BindEmailDto> {
  // 邮箱
  @Expose()
  @IsEmail({}, {
    message: "邮箱"
  })
  @Type(() => String)
  email: string

  // 是否强制
  @Expose()
  @IsBoolean({
    message: "force 参数只能是布尔类型"
  })
  @Type(() => Boolean)
  force: boolean
}

export default BindEmailDto;