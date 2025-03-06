/*
 * 配置文件上传中间件
 * @Author: Franctoryer 
 * @Date: 2025-03-02 19:06:01 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-06 20:59:23
 */
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(), // 使用内存存储获取Buffer
  limits: { fileSize: 5 * 1024 * 1024 } // 限制文件大小
});

export default upload;
