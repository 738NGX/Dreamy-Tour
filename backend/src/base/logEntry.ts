/*
 * 日志记录需要记录的信息
 * @Author: Franctoryer 
 * @Date: 2025-02-23 23:17:58 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-02-25 12:22:31
 */
import { Request } from "express";

class LogEntry {
  // 时间戳
  timestamp: string
  // 请求方法
  method: string
  // 请求的 url
  url: string
  // 来源页面
  referer: string
  // 状态码
  status: number
  // 客户端 ip
  ip: string
  // 客户端信息
  userAgent: string

  constructor(req: Request) {
    this.timestamp = new Date().toISOString();
    this.method = req.method;
    this.url = req.originalUrl;
    this.referer = req.headers.referer ?? '';
    this.status = 0;
    this.ip = req.ip ?? '';
    this.userAgent = req.headers["user-agent"] ?? '';
  }

  setStatus(status: number): void {
    this.status = status;
  }
}

export default LogEntry;