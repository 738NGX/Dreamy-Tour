import CosConstant from "@/constant/cosConstant";
import { randomInt } from "crypto";

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

  /**
   * 生成默认头像地址
   * @returns 默认头像地址
   */
  static generateDefaultAvatarUrl(): string {
    const rand = randomInt(1, 30);
    const defaultAvatarUrl = `${CosConstant.BASE_URL}/${CosConstant.AVATAR_FOLDER}/default${rand}.png`
    return defaultAvatarUrl;
  }

  /**
   * 生成默认背景图片地址
   * @returns 默认背景图片地址
   */
  static generateDefaultBackgroundImageUrl(): string {
    const defaultBackgroundImageUrl = `${CosConstant.BASE_URL}/${CosConstant.BACKGROUND_IMAGES_FOLDER}/default.jpg`
    return defaultBackgroundImageUrl;
  }

  /**
   * 脱敏手机号
   * @param phoneNumber 手机号字符串
   * @returns 脱敏后的手机号
   */
  static desensitizePhoneNumber(phoneNumber: string): string {
    if (!phoneNumber || phoneNumber.length !== 11) {
        throw new Error("Invalid phone number");
    }
    return phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
  }

  /**
  * 脱敏邮箱
  * @param email 邮箱字符串
  * @returns 脱敏后的邮箱
  */
  static desensitizeEmail(email: string): string {
    if (!email || !email.includes("@")) {
        throw new Error("Invalid email address");
    }
    const [username, domain] = email.split("@");
    // 对用户名部分进行脱敏
    const hiddenUsername = username.slice(0, 1) + "****" + username.slice(-1);
    return `${hiddenUsername}@${domain}`;
  }

}