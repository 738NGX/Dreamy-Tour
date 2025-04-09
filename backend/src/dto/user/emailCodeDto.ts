import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { IsEmail, IsEnum, Matches } from "class-validator";

class EmailCodeDto extends DTO<EmailCodeDto> {
  @Expose()
  @IsEmail({}, {
    message: "邮箱格式不正确！"
  })
  @Type(() => String)
  email: string

  @Expose()
  @IsEnum(['login', 'reset', 'register'], {
    message: "业务类型必须是 'login', 'reset' 或 'register'"
  })
  @Type(() => String)
  businessType?: "login" | "reset" | "register"
}

export default EmailCodeDto;