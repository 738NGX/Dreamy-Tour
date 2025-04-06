/*
 * 更新用户背景图片返回的数据
 * @Author: Choihyobin 
 * @Date: 2025-04-06 15:58:16 
 * @Last Modified by: Choihyobin
 * @Last Modified time: 2025-04-06 15:58:16
 */
import VO from "@/base/vo";

class BackgroundImageVo extends VO<BackgroundImageVo>{
  // 新的背景图片地址
  backgroundImageUrl: string
}

export default BackgroundImageVo;