/*
 * API 服务异常
 * @Author: Franctoryer 
 * @Date: 2025-03-03 10:29:03 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-03 10:32:33
 */

import MessageConstant from "@/constant/messageConstant";

class ApiError extends Error {
  constructor(message?: string) {
    super(message ?? MessageConstant.API_UNAVAILABLE);
    this.name = 'ApiError';
  }
}

export default ApiError;
