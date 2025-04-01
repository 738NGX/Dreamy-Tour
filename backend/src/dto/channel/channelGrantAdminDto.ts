/*
 * 授权频道管理员接口需要的参数
 * @Author: Franctoryer 
 * @Date: 2025-03-21 21:59:45 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-21 22:01:55
 */
import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { IsInt } from "class-validator";

class ChannelGrantAdminDto extends DTO<ChannelGrantAdminDto> {
  // 被授权的用户 ID
  @Expose()
  @IsInt({
    message: "被授权者 ID 必须是整数"
  })
  @Type(() => Number)
  granteeId: number

  // 频道 ID
  @Expose()
  @IsInt({
    message: "频道 ID 必须是整数"
  })
  @Type(() => Number)
  channelId: number
}

export default ChannelGrantAdminDto;