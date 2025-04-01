import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { IsInt } from "class-validator";

class GroupTransferDto extends DTO<GroupTransferDto> {
  // 转让的频道 ID
  @Expose()
  @IsInt({
    message: "群组 ID 必须是整数"
  })
  @Type(() => Number)
  groupId: number

  // 新频道主的用户 ID
  @Expose()
  @IsInt({
    message: "用户 ID 必须是整数"
  })
  @Type(() => Number)
  masterId: number
}

export default GroupTransferDto;