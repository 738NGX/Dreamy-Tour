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
}