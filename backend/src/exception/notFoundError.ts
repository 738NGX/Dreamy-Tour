/*
 * 不存在异常
 * @Author: Franctoryer 
 * @Date: 2025-03-03 08:04:08 
 * @Last Modified by:   Franctoryer 
 * @Last Modified time: 2025-03-03 08:04:08 
 */
import MessageConstant from "@/constant/messageConstant";

class NotFoundError extends Error {
  constructor(message?: string) {
    super(message ?? MessageConstant.NOT_FOUND_ERROR);
    this.name = 'NotFoundError';
  }
}

export default NotFoundError;