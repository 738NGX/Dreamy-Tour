import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsEmail, IsNotEmpty } from "class-validator";

class BindEmailDto extends DTO<BindEmailDto> {
  // 邮箱
  @Expose()
  @IsEmail({}, {
    message: "邮箱格式不正确！"
  })
  @Type(() => String)
  email: string

  // 是否强制
  @Expose()
  @IsBoolean({
    message: "force 参数只能是布尔类型！"
  })
  @Type(() => Boolean)
  force: boolean

  // 验证码
  @Expose()
  @IsNotEmpty({
    message: "验证码不能为空！"
  })
  @Type(() => String)
  verifyCode: string
}

export default BindEmailDto;