import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { IsEmail, IsEnum, Length } from "class-validator";

class EmailLoginV2Dto extends DTO<EmailLoginV2Dto> {
  // 邮箱
  @Expose()
  @IsEmail({}, {
    message: "邮箱格式不正确！"
  })
  @Type(() => String)
  email: string

  // 密码
  @Expose()
  @Type(() => String)
  password?: string

  // 验证码
  @Expose()
  @Type(() => String)
  verifyCode?: string

  // 授权方式（密码 / 验证码）
  @Expose()
  @IsEnum(["password", "captcha"], {
    message: "授权方式只能是 password 或 captcha"
  })
  @Type(() => String)
  grantType: "password" | "captcha"
}

export default EmailLoginV2Dto;