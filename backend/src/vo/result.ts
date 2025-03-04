/*
 * 统一 RESTful 接口的响应格式
 * @Author: Franctoryer 
 * @Date: 2025-02-23 21:48:14 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-03 11:20:44
 */

import MessageConstant from "@/constant/messageConstant";


class Result {
  // 0 错误；1 正确
  code: number

  // 错误提示
  msg: string

  // 数据
  data: any

  /**
   * 构造函数
   * @param code 状态
   * @param msg 消息提示
   * @param data 响应数据
   */
  constructor(code: number, msg: string, data: any) {
    this.code = code;
    this.msg = msg;
    this.data = data;
  }
  /**
   * 成功响应
   * @param data 响应数据
   */
  static success(data: any): Result;
  /**
   * 成功响应
   * @param msg 提示消息
   */
  static success(msg: string): Result;
  /**
   * 成功响应
   * @param msg 提示消息
   * @param data 响应数据
   */
  static success(msg: string, data: any): Result;

  /**
   * 签名实现
   * @param dataOrMsg 响应数据或提示消息
   * @param dataOrUndefined 响应数据或 undefined
   * @returns 
   */
  static success(dataOrMsg: any, dataOrUndefined?: any): Result {
    if (typeof dataOrUndefined !== 'undefined') {
      return new this(1, dataOrMsg, dataOrUndefined);
    }
    if (typeof dataOrMsg === 'string') {
      return new this(1, dataOrMsg, null);
    }
    return new this(1, MessageConstant.SUCCESSFUL_RETURN, dataOrMsg);
  }


  /**
   * 失败响应
   * @param msg 提示消息
   * @returns 
   */
  static error(msg: string) {
    return new this(0, msg, null);
  }
}

export default Result;