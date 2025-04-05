/*
 * 用相关的常量类
 * @Author: Franctoryer 
 * @Date: 2025-02-28 20:12:10 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-08 16:43:14
 */
class UserConstant {
  // 女性
  static readonly FEMALE = 0;
  // 男性
  static readonly MALE = 1;
  // 性别保密
  static readonly CONFIDENTIAL = 2;
  // 默认的用户角色
  static readonly DEFAULT_ROLE = 0;
  // 启用状态
  static readonly STATUS_ENABLE = 0;
  // 禁用状态
  static readonly STATUS_DISABLE = 1;
  // 默认登录经验
  static readonly DEFAULT_LOGIN_EXP = 0;
  // 连续登录经验
  static readonly CONTINUOUS_LOGIN_EXP = 10;
}

export default UserConstant;