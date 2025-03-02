/*
 * 微信登录传参
 * @Author: Franctoryer 
 * @Date: 2025-02-23 22:11:04 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-01 20:50:02
 */
import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";


class WxLoginDto extends DTO<WxLoginDto> {
  @Expose()
  @IsNotEmpty({
    message: "授权码不能为空"
  })
  @Type(() => String)
  code: string  // 授权码
}

export default WxLoginDto;