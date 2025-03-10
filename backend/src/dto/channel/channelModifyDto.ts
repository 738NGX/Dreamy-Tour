import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { Length } from "class-validator";

class ChannelModifyDto extends DTO<ChannelModifyDto> {
  // 频道名称
  @Expose()
  @Length(1, 15, {
    message: "频道名称必须由 $constraint1 到 $constraint2 个字符组成"
  })
  @Type(() => String)
  name: string

  // 频道描述
  @Expose()
  @Length(1, 50, {
    message: "频道描述必须由 $constraint1 到 $constraint2 个字符组成"
  })
  @Type(() => String)
  description: string
}

export default ChannelModifyDto;