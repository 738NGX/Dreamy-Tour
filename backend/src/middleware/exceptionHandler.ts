import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Result from "@/vo/result";
import ParamsError from "@/exception/paramsError";
import UnauthorizedError from "@/exception/unauthorizedError";
import ForbiddenError from "@/exception/forbiddenError";
import CosError from "@/exception/cosError";
import WxServiceError from "@/exception/wxServiceError";
import NotFoundError from "@/exception/notFoundError";
import ApiError from "@/exception/apiError";
import InternalError from "@/exception/internalError";
import EmptyFileError from "@/exception/emptyFileError";
import { logger } from "@/config/loggerConfig";

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
  ],
  [
    WxServiceError,
    (err, req, res) => res.status(StatusCodes.BAD_GATEWAY)
      .json(Result.error(err.message))
  ],
  [
    NotFoundError,
    (err, req, res) => res.status(StatusCodes.NOT_FOUND)
      .json(Result.error(err.message))
  ],
  [
    ApiError,
    (err, req, res) => res.status(StatusCodes.BAD_GATEWAY)
      .json(Result.error(err.message))
  ],
  [
    InternalError,
    (err, req, res) => res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(Result.error(err.message))
  ],
  [
    EmptyFileError,
    (err, req, res) => res.status(StatusCodes.BAD_REQUEST)
      .json(Result.error(err.message))
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
  logger.error(`[服务器未知异常] ${err.name}: ${err.message}`)
  res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(Result.error("未知异常，请检查服务器日志"));
};

export default exceptionHandler;