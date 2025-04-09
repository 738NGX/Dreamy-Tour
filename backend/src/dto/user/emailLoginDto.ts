import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { IsEmail, Length } from "class-validator";

class EmailLoginDto extends DTO<EmailLoginDto> {
  // 邮箱
  @Expose()
  @IsEmail({}, {
    message: "邮箱格式不正确！"
  })
  @Type(() => String)
  email: string

  // 密码
  @Expose()
  @Length(6, 30, {
    message: "密码必须在 $constraint1 到 $constraint2 个字符之间"
  })
  @Type(() => String)
  password: string
}

export default EmailLoginDto