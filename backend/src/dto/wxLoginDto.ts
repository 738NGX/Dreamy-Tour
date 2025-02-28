/*
 * 微信登录传参
 * @Author: Franctoryer 
 * @Date: 2025-02-23 22:11:04 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-02-25 20:23:46
 */
import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";


/**
 * @swagger
 * components:
 *   schemas:
 *     WxLoginDto:
 *       type: object
 *       required:
 *         - code
 *       properties:
 *         code:
 *           type: string
 *           description: 授权码（OAuth 2.0 的授权码模式，由 wx.login 获取）
 *           example: 0b3l7W0005MCgT110T300rTQ6Q2l7W0F
 *       description: 微信登录所需要的参数
 */
class WxLoginDto extends DTO<WxLoginDto> {
  @Expose()
  @IsNotEmpty({
    message: "授权码不能为空"
  })
  @Type(() => String)
  code: string  // 授权码
}

export default WxLoginDto;