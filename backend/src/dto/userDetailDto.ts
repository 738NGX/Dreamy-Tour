/*
 * 查询用户细节的参数
 * @Author: Franctoryer 
 * @Date: 2025-02-24 08:21:34 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-02-25 20:19:30
 */
import { IsInt, Min } from "class-validator";
import DTO from "../base/dto";
import { Type } from "class-transformer";

/**
 * @swagger
 * components:
 *   schemas:
 *     UserDetailDto:
 *       type: object
 *       required:
 *         - uid
 *       properties:
 *         uid:
 *           type: integer
 *           description: 用户唯一标识符 (UID)
 *           example: 12
 *       description: 查询用户细节所需的参数
 */
class UserDetailDto extends DTO<UserDetailDto> {
  @IsInt({
    message: "用户 ID 必须是整数"
  })
  @Min(0, {
    message: "用户 ID 必须是正整数"
  })
  @Type(() => Number)
  uid: number   // 用户 ID
}

export default UserDetailDto;