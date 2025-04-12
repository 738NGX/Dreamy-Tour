import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { IsEmail, IsEnum, Matches } from "class-validator";

class EmailCodeDto extends DTO<EmailCodeDto> {
  // 邮箱
  @Expose()
  @IsEmail({}, {
    message: "邮箱格式不正确！"
  })
  @Type(() => String)
  email: string

  // 业务类型
  @Expose()
  @IsEnum(['login', 'reset', 'register', 'bind'], {
    message: "业务类型必须是 login, reset, register 或 bind"
  })
  @Type(() => String)
  businessType?: "login" | "reset" | "register" | "bind"
}

export default EmailCodeDto;