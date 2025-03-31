/*
 * 认证相关的常量类
 * @Author: Franctoryer 
 * @Date: 2025-03-01 16:17:45 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-01 18:27:23
 */
class AuthConstant {
  static readonly SECRET = "DREAMY TOUR ---- YOUR TRAVELLING ASSISTANT";  // 签名密钥
  static readonly EXPIRATION_DURATION = 60 * 60 * 24 * 7 // 过期时间（1 周）
  static readonly REFRESH_DUE_TIME = 60 * 60 * 24 * 2    // 还剩 2 天自动刷新
  static UPDATE_UID_LIST: Set<number>  = new Set()  // 需要更新 token 的用户名单
  static readonly TOKEN_HEADER = "Authorization"   // 存放 token 的头部名称
  static readonly REFRESH_TOKEN_HEADER = "X-Refresh-Token"  // 响应头返回的新 token 
  static readonly WHITE_LIST = [  // 白名单 url 列表（这些 url 不需要经过 token 校验），用正则表达式进行匹配
    "^/wx-login$",
    "^/api-docs/",  // /api-docs/ 开头的所有 url
    "^/favicon.ico$"
  ]
}

export default AuthConstant;