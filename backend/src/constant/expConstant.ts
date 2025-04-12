/*
 * 经验值相关的常量类
 * @Author: Franctoryer 
 * @Date: 2025-04-12 18:54:06 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-04-12 21:14:34
 */
class ExpConstant {
  // 发帖所得经验
  static readonly POST = 30;
  // 评论所得经验
  static readonly COMMENT = 10;
  // 登录所得经验
  static readonly LOGIN = 5;
  // 连续登录所得经验
  static readonly CONTINOUS_LOGIN = 8;
  // 完成行程所得经验
  static readonly END_TOUR = 50;
  // 组织行程所得经验
  static readonly LEAD_TOUR = 80;
}

export default ExpConstant;