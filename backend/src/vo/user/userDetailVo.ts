/*
 * 用户详情展示的数据
 * @Author: Franctoryer 
 * @Date: 2025-02-24 08:00:11 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-08 16:41:37
 */

import VO from "@/base/vo"
import { Expose } from "class-transformer"


class UserDetailVo extends VO<UserDetailVo> {
  // 用户 ID
  uid: number

  // 用户名
  nickname: string

  // 性别（女 / 男 / 保密）
  gender: string

  // 头像地址
  avatarUrl: string

  // 邮箱
  email: string

  // 手机号
  phone: string

  // 个性签名
  signature: string

  // 生日
  birthday: string

  // 经验值
  exp: number

  // 角色
  role: string
}

export default UserDetailVo;