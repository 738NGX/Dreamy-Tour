/*
 * 登录成功后返回的数据
 * @Author: Franctoryer 
 * @Date: 2025-03-01 20:49:04 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-01 21:09:58
 */
import VO from "@/base/vo";


class WxLoginVo extends VO<WxLoginVo> {
  // 用户的 openid（同一小程序下唯一）
  openid: string
  
  // 身份令牌，放入 Authorization 字段
  token: string
}

export default WxLoginVo;