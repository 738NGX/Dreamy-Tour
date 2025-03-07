/*
 * 文件相关的工具类
 * @Author: Franctoryer 
 * @Date: 2025-03-02 18:57:39 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-06 23:18:19
 */
class FileUtil {
  // 文件后缀名集合
  private static readonly IMAGE_EXTENSIONS = new Set([
    'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg',
    'tiff', 'tif', 'ico'
  ]);

  /**
   * 获取文件名的后缀
   * @param fileName 文件名
   */
  static getFileExtension(fileName: string): string {
    return fileName.split('.').pop() || '';
  }

  /**
   * 判断该文件是否是图片文件
   * @param fileName 文件名
   */
  static isPicture(fileName: string): boolean {
    const extension = this.getFileExtension(fileName);  // 获取后缀
    // 后缀名不能为空且必须是图片文件的后缀
    return extension != '' && this.IMAGE_EXTENSIONS.has(extension.toLowerCase());
  }
}

export default FileUtil;