import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { IsInt } from "class-validator";

class GroupGrantAdminDto extends DTO<GroupGrantAdminDto> {
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
  groupId: number
}

export default GroupGrantAdminDto;