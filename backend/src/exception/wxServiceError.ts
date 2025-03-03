/*
 * 微信服务接口异常
 * @Author: Franctoryer 
 * @Date: 2025-03-02 22:36:54 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-02 22:38:04
 */
import MessageConstant from "@/constant/messageConstant";

class WxServiceError extends Error {
  constructor(message?: string) {
    super(message ?? MessageConstant.WX_SERVICE_ERROR);
    this.name = 'WxServiceError';
  }
}

 export default WxServiceError;