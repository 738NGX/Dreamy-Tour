import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { IsEmail } from "class-validator";

class EmailLoginDto extends DTO<EmailLoginDto> {
  @Expose()
  @IsEmail({}, {
    message: "邮箱格式不正确！"
  })
  @Type(() => String)
  email: string

  @Expose()
  @Type(() => String)
  verifyCode: string
}

export default EmailLoginDto