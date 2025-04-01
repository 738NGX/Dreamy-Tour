import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { IsNotEmpty, Length } from "class-validator";

class GroupModifyDto extends DTO<GroupModifyDto> {
  // 频道名称
  @Expose()
  @Length(1, 20, {
    message: "群组名称必须由 $constraint1 到 $constraint2 个字符组成"
  })
  @Type(() => String)
  name: string

  // 频道描述
  @Expose()
  @Length(1, 30, {
    message: "群组描述必须由 $constraint1 到 $constraint2 个字符组成"
  })
  @Type(() => String)
  description: string

  // 加入方式（0: Free; 1: Invite）
  @Expose()
  @IsNotEmpty({
    message: "加入方式不能为空：只能填 free 或 invite"
  })
  @Type(() => String)
  joinWay: string
}

export default GroupModifyDto;