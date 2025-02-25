import MessageConstant from "../constant/messageConstant";

/*
 * 统一 RESTful 接口的响应格式
 * @Author: Franctoryer 
 * @Date: 2025-02-23 21:48:14 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-02-23 23:09:47
 */
class Result {
  // 0 错误；1 正确
  code: number

  // 错误提示
  msg: string

  // 数据
  data: object

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
   * @returns 
   */
  static success(data: any) {
    return new this(1, MessageConstant.SUCCESSFUL_RETURN, data);
  }

  /**
   * 失败响应
   * @param msg 提示消息
   * @returns 
   */
  static error(msg: string) {
    return new this(0, msg, {});
  }
}

export default Result