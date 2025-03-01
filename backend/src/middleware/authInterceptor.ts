/*
 * 用户认证拦截器
 * @Author: Franctoryer 
 * @Date: 2025-03-01 14:42:26 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-01 16:20:09
 */
import AuthConstant from "@/constant/authConstant";
import UnauthorizedError from "@/exception/unauthorizedError";
import JwtUtil from "@/util/jwtUtil";
import { NextFunction, Request, Response } from "express";

const authInterceptor = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  // 如果 uri 在白名单内，直接 next()
  for (const uri of AuthConstant.WHITE_LIST) {
    const regex = new RegExp(uri, 'g'); // 构造正则表达式，g 表示全局匹配
    if (regex.test(req.path)) {
      next();
      return;
    }
  }
  // 从请求头中获取 Authorization 字段上的 token
  const token = req.header(AuthConstant.TOKEN_HEADER);
  // 检查是否存在该头部
  if (typeof token !== 'string') {
    throw new UnauthorizedError();
  }
  // 如果校验不通过，抛出认证异常；如通过，直接 next()
  JwtUtil.verify(token);
  next();
}

export default authInterceptor;