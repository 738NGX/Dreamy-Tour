import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Result from "@/vo/result";
import ParamsError from "@/exception/paramsError";
import UnauthorizedError from "@/exception/unauthorizedError";
import ForbiddenError from "@/exception/forbiddenError";
import CosError from "@/exception/cosError";

// 定义错误处理函数类型
type ErrorHandler = (
  err: Error, 
  req: Request, 
  res: Response
) => void;

// 错误类型与处理逻辑的映射表
const ERROR_HANDLERS: Map<Function, ErrorHandler> = new Map([
  [
    ParamsError, 
    (err, req, res) => res.status(StatusCodes.BAD_REQUEST)
      .json(Result.error(`传参异常：${err.message}`))
  ],
  [
    UnauthorizedError, 
    (err, req, res) => res.status(StatusCodes.UNAUTHORIZED)
      .json(Result.error(`认证异常：${err.message}`))
  ],
  [
    ForbiddenError, 
    (err, req, res) => res.status(StatusCodes.FORBIDDEN)
      .json(Result.error(`授权异常：${err.message}`))
  ],
  [
    CosError,
    (err, req, res) => res.status(StatusCodes.BAD_GATEWAY)
      .json(Result.error(`COS 异常：${err.message}`))
  ]
]);

// 全局异常处理中间件
const exceptionHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  // 遍历注册表寻找匹配的错误处理器
  for (const [ErrorType, handler] of ERROR_HANDLERS) {
    if (err instanceof ErrorType) {
      return handler(err, req, res);
    }
  }

  // 未知错误处理（日志 + 统一响应）
  console.error(`${err.name}: ${err.message}\n${err.stack}`);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(Result.error("未知异常"));
};

export default exceptionHandler;