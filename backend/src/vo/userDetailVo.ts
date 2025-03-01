/*
 * 用户详情展示的数据
 * @Author: Franctoryer 
 * @Date: 2025-02-24 08:00:11 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-01 20:48:53
 */

import VO from "@/base/vo"
import { Expose } from "class-transformer"


class UserDetailVo extends VO<UserDetailVo> {
  @Expose()
  uid: number   // 学号

  @Expose()
  name: string  // 学号

  @Expose()
  age: number   // 年龄

  @Expose()
  school: string  // 学校名称

  @Expose()
  avatarUrl: string // 头像地址

  @Expose()
  gender: string  // 性别
}

export default UserDetailVo;