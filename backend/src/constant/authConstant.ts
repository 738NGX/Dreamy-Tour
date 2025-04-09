/*
 * 认证相关的常量类
 * @Author: Franctoryer 
 * @Date: 2025-03-01 16:17:45 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-04-09 19:33:48
 */
class AuthConstant {
  // 签名密钥
  static readonly SECRET = "DREAMY TOUR ---- YOUR TRAVELLING ASSISTANT";
   // jwt 的过期时间（1 周）
  static readonly EXPIRATION_DURATION = 60 * 60 * 24 * 7
  // jwt 还剩 2 天过期则自动刷新
  static readonly REFRESH_DUE_TIME = 60 * 60 * 24 * 2
  // 需要更新 token 的用户名单（用于实现无感刷新，前端的响应拦截需要检测是否有 X-Refresh-Token 响应头）
  static UPDATE_UID_LIST: Set<number>  = new Set()
  // 存放 token 的头部名称
  static readonly TOKEN_HEADER = "Authorization"
  // 响应头返回的新 token 
  static readonly REFRESH_TOKEN_HEADER = "X-Refresh-Token"
  // 白名单 url 列表（这些 url 不需要经过 token 校验），用正则表达式进行匹配
  static readonly WHITE_LIST = [
    "^/wx-login$",
    "^/api-docs/",  // /api-docs/ 开头的所有 url
    "^/favicon.ico$",
    "^/email/"      // /email 开头的所有 url
  ]
  // 盐值（密码加盐）
  static readonly SALT = "DREAMY TOUR ---- YOUR TRAVELLING ASSISTANT"
}

export default AuthConstant;