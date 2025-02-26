/*
 * 数据库的用户表
 * @Author: Franctoryer 
 * @Date: 2025-02-25 10:06:25 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-02-25 18:33:27
 */

class User {
  // 用户 ID
  uid: number

  // 用户名
  nickname: string

  // 微信 openid
  wxOpenid: string

  // 性别（0 女 / 1 男 / 2 保密）
  gender: number

  // 头像地址
  avatarUrl: string

  // 邮箱
  email: string

  // 手机号
  phone: string

  // 学校
  school: string

  // 等级
  rank: number

  // 启用/禁用
  status: number

  // 创建时间
  createdAt: number

  // 更新时间
  updatedAt: number
}

export default User;