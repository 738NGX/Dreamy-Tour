/*
 * 更改昵称需要的参数
 * @Author: Franctoryer 
 * @Date: 2025-03-02 15:42:16 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-06 20:05:09
 */

import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { Length, Matches } from "class-validator";

class NicknameDto extends DTO<NicknameDto>{
  @Expose()
  @Length(1, 10, {
    message: '昵称长度必须在 $constraint1 到 $constraint2 个字符之间'
  })
  @Matches(/^[\p{L}0-9_]+$/u, {
    message: '昵称不能包含空格、除下划线的特殊字符'
  })
  @Type(() => String)
  nickname: string
}

export default NicknameDto;