/*
 * 用户相关的工具类
 * @Author: Franctoryer 
 * @Date: 2025-02-25 12:24:48 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-01 19:37:45
 */
export class UserUtil {
  /**
   * 将数字转化为对应的性别字符串
   * @param gender 性别数字
   * @returns 男 | 女 | 保密
   */
  static getGenderStr(gender: number | undefined): string {
    switch (gender) {
      case 0:
        return "女";
      case 1:
        return "男";
      default:
        return "保密";
    }
  }
}