/*
 * jwt 相关的工具类
 * @Author: Franctoryer 
 * @Date: 2025-02-28 15:28:26 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-02-28 15:53:54
 */
import AuthConstant from "@/constant/authConstant";
import UnauthorizedError from "@/exception/unauthorizedError";
import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from "jsonwebtoken"

class JwtUtil {
  /**
   * 根据用户 ID 生成 jwt
   * @param uid 用户 ID
   * @returns jwt
   */
  static generateByUid(uid: number): string {
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + AuthConstant.expirationDuration,  // 一周以后过期
        uid: uid  // 用户 ID
      }, 
      AuthConstant.secret
    );
  }

  /**
   * 根据 token 提取出 uid
   * @param token 
   * @returns 如果校验通过，返回 uid；否则，返回 undefined
   */
  static getUid(token: string): number | undefined {
    try {
      // 校验签名是否有效，并解析出 uid
      const { uid } = jwt.verify(token, AuthConstant.secret) as JwtPayload;
      return Number(uid);
    } catch(error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedError("Token 已过期");
      }
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedError("该 Token 无效");
      }
      throw new UnauthorizedError("无法正常解析出 uid")
    }
  }
}

export default JwtUtil;