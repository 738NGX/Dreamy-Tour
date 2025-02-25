/*
 * 用户相关的工具类
 * @Author: Franctoryer 
 * @Date: 2025-02-25 12:24:48 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-02-25 12:30:56
 */
export class UserUtil {
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