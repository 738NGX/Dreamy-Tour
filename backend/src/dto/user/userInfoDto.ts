/*
 * 更新用户其他信息（除昵称、头像）需要的传参
 * @Author: Franctoryer 
 * @Date: 2025-03-02 00:19:04 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-23 19:01:27
 */

import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { IsEmail, IsIn, Length, Matches } from "class-validator";

class UserInfoDto extends DTO<UserInfoDto> {
   // 性别（0 女 / 1 男 / 2 保密）
   @Expose()
   @IsIn([0, 1, 2], {
      message: '性别只能是女（0）、男（1）、保密（2）'
   })
   @Type(() => Number)
   gender: number
 
   // 手机号
   @Expose()
   @Length(11, 11, {
      message: '手机号只能是 $constraint1 位'
   })
   @Type(() => String)
   phone: string
 
   // 个性签名
   @Expose()
   @Length(5, 100, {
      message: '个性签名的长度不能小于 $constraint1 个字符，不能大于 $constraint2 个字符'
   })
   @Type(() => String)
   signature: string
 
   // 生日
   @Expose()
   @Matches(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, {
      message: '日期格式应为 yyyy-mm-dd 且必须有效'
   })
   @Type(() => String)
   birthday: string
}

export default UserInfoDto;
