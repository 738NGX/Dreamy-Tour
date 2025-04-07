/*
 * 日志记录中间件
 * @Author: Franctoryer 
 * @Date: 2025-02-23 23:49:15 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-04-07 12:15:19
 */
import LogEntry from "@/base/logEntry";
import { NextFunction, Request, Response } from "express";
import onFinished from "on-finished";

/**
 * 日志记录中间件
 * @param req 请求
 * @param res 响应
 * @param next 交给下一个中间件处理
 */
const logger = (req: Request, res: Response, next: NextFunction) => {
  const entry: LogEntry = new LogEntry(req);
  // 当 http 响应终止前，记录响应状态码
  onFinished(res, () => {
    entry.setStatus(res.statusCode);
    console.log(JSON.stringify(entry));
  })

  next();
}

export default logger;