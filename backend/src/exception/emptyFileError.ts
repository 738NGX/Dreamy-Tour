/*
 * 空文件异常
 * @Author: Franctoryer 
 * @Date: 2025-03-25 20:27:50 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-25 20:32:26
 */

import MessageConstant from "@/constant/messageConstant";

class EmptyFileError extends Error {
  constructor(message?: string) {
    super(message ?? MessageConstant.NO_FILE_UPLOADED);
    this.name = "EmptyFileError";
  }
}

export default EmptyFileError;