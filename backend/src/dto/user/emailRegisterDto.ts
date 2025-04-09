import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { IsEmail, IsNotEmpty, Length, MinLength } from "class-validator";

class EmailRegisterDto extends DTO<EmailRegisterDto> {
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
  
  // 验证码
  @Expose()
  @IsNotEmpty({
    message: "验证码不能为空！"
  })
  @Type(() => String)
  verifyCode: string
}

export default EmailRegisterDto;