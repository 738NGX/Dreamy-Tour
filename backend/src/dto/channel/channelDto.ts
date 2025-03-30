import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { IsNotEmpty, Length, Matches } from "class-validator";

class ChannelDto extends DTO<ChannelDto> {
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

  // 频道等级（A:0, B:1, C:2）
  @Expose()
  @Matches(/^[ABC]{1}$/, {
    message: "频道等级只能是 A（上限 3000）、B（上限 500）、C（上限 100）"
  })
  @Type(() => String)
  level: string

  // 加入方式（0: Free; 1: Invite）
  @Expose()
  @IsNotEmpty({
    message: "加入方式不能为空：只能填 free 或 invite"
  })
  @Type(() => String)
  joinWay: string
}

export default ChannelDto;