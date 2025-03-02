import MessageConstant from "@/constant/messageConstant";

/*
 * 文件上传异常
 * @Author: Franctoryer 
 * @Date: 2025-03-02 18:43:08 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-02 18:50:09
 */
class CosError extends Error {
  constructor(message?: string) {
    super(message ?? MessageConstant.FAILED_UPLOAD);
    this.name = 'UploadError';
  }
}

export default CosError;