/*
 * 更改昵称需要的参数
 * @Author: Franctoryer 
 * @Date: 2025-03-02 15:42:16 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-02 16:03:43
 */

import DTO from "@/base/dto";
import { Type } from "class-transformer";
import { Length } from "class-validator";

class NicknameDto extends DTO<NicknameDto>{
  @Length(1, 10, {
    message: '昵称长度必须在 $constraint1 到 $constraint2 个字符之间'
  })
  @Type(() => String)
  nickname: string
}

export default NicknameDto;