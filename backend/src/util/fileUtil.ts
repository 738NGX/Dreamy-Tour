/*
 * 文件相关的工具类
 * @Author: Franctoryer 
 * @Date: 2025-03-02 18:57:39 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-02 18:58:40
 */
class FileUtil {
  /**
   * 获取文件名的后缀
   * @param fileName 文件名
   */
  static getFileExtension(fileName: string): string {
    return fileName.split('.').pop() || '';
  }
}

export default FileUtil;