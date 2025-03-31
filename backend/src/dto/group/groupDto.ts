import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { IsNotEmpty, Length, Matches } from "class-validator";

class GroupDto extends DTO<GroupDto> {
  // 群组名称
  @Expose()
  @Length(1, 15, {
    message: "群组名称必须由 $constraint1 到 $constraint2 个字符组成"
  })
  @Type(() => String)
  name: string

  // 群组描述
  @Expose()
  @Length(1, 30, {
    message: "群组描述必须由 $constraint1 到 $constraint2 个字符组成"
  })
  @Type(() => String)
  description: string

  // 关联群组ID
  @Expose()
  @IsNotEmpty({
    message: "关联群组ID不能为空"
  })
  @Type(() => Number)
  linkedChannel: number

  // 主货币符号
  @Expose()
  @Matches(/^[A-Z]{3}$/, {
    message: "ISO 代码必须由 3 个大写字母组成"
  })
  @Type(() => String)
  mainCurrency: string

  // 副货币符号
  @Expose()
  @Matches(/^[A-Z]{3}$/, {
    message: "ISO 代码必须由 3 个大写字母组成"
  })
  @Type(() => String)
  subCurrency: string

  // 行程模板ID
  @Expose()
  @IsNotEmpty({
    message: "行程模板ID不能为空"
  })
  @Type(() => Number)
  tourTemplateId: number

  // 群组等级（A:0, B:1, C:2）
  @Expose()
  @Matches(/^[ABC]{1}$/, {
    message: "群组等级只能是 A（上限 100）、B（上限 20）、C（上限 5）"
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

export default GroupDto;