/*
 * 认证相关的常量类
 * @Author: Franctoryer 
 * @Date: 2025-03-01 16:17:45 
 * @Last Modified by:   Franctoryer 
 * @Last Modified time: 2025-03-01 16:17:45 
 */
class AuthConstant {
  static readonly SECRET = "DREAMY TOUR ---- YOUR TRAVELLING ASSISTANT";  // 签名密钥
  static readonly EXPIRATION_DURATION = 60 * 60 * 24 * 7 // 过期时间
  static readonly TOKEN_HEADER = "Authorization"   // 存放 token 的头部名称
  static readonly WHITE_LIST = [  // 白名单 url 列表，用正则表达式进行匹配
    "^/wx-login$",
    "^/api-docs/",
    "^/favicon.ico$"
  ]
}

export default AuthConstant;