import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { IsInt } from "class-validator";

class ChannelTransferDto extends DTO<ChannelTransferDto> {
  // 转让的频道 ID
  @Expose()
  @IsInt({
    message: "频道 ID 必须是整数"
  })
  @Type(() => Number)
  channelId: number

  // 新频道主的用户 ID
  @Expose()
  @IsInt({
    message: "频道 ID 必须是整数"
  })
  @Type(() => Number)
  masterId: number
}

export default ChannelTransferDto;