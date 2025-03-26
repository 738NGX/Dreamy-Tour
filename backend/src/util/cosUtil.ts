import cos from "@/config/cosConfig";
import CosConstant from "@/constant/cosConstant"
import CosError from "@/exception/cosError";
import ParamsError from "@/exception/paramsError";
import { Readable } from "stream"
import { v4 } from "uuid"

/*
 * COS 相关的工具类
 * @Author: Franctoryer 
 * @Date: 2025-03-02 16:37:57 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-02 20:42:04
 */
class CosUtil {
  /**
   * 将特定图片上传至 COS，并返回新的 url
   * @param filePath 
   * @param folderName 
   * @param file 
   */
  static async uploadFile(
    folderName: string,
    file: Buffer | Readable,
    fileExtension?: string
  ): Promise<string> {
    try {
      // 用 UUID 生成图片名称
      const fileName = this.generateFileName(fileExtension);
      const params: any = {
        Bucket: CosConstant.BUCKET_NAME,  // 存储桶名
        Region: CosConstant.REGION,       // 地区
        Key: `${folderName}/${fileName}`, // 保存的文件路径
        Body: file                        // 上传的文件
      }
      // 上传图片
      const { Location } = await cos.putObject(params);
      // 返回新的图片url
      return `https://${Location}`;
    } catch(err) {
      console.log(err)
      throw new CosError("上传文件失败");
    }
  }

  /**
   * 将 base64 形式的图片上传到 COS
   * @param folderName 存储桶下的文件夹名
   * @param base64Str 图片的 base64 编码
   * @param fileExtension 文件名后缀
   */
  static async uploadBase64Picture(
    folderName: string,
    base64Str: string
  ): Promise<string> {
    try {
      // 验证并提取 data URL 信息
      if (!base64Str.includes(',')) {
        throw new ParamsError("非法的 Base64 数据格式，缺少 Data URL 前缀");
      }

      // 分割 data URL 和实际数据
      const [header, data] = base64Str.split(',');
      
      // 使用正则表达式提取 MIME 类型
      const mimeMatch = header.match(/data:([^/]+)\/([^;]+)/);
      if (!mimeMatch) {
        throw new ParamsError("无法从 Base64 字符串中解析 MIME 类型");
      }

      // 映射常见图片类型到扩展名
      const mimeToExtension: { [key: string]: string } = {
        'png': 'png',
        'jpeg': 'jpg',
        'jpg': 'jpg',
        'gif': 'gif',
        'webp': 'webp',
        'bmp': 'bmp'
      };

      // 获取扩展名
      const fileType = mimeMatch[2].toLowerCase();
      const fileExtension = mimeToExtension[fileType];
      
      if (!fileExtension) {
        throw new ParamsError(`不支持的文件类型: ${fileType}`);
      }

      // 转换并上传
      const buffer = Buffer.from(data, 'base64');
      return await this.uploadFile(folderName, buffer, fileExtension);
    } catch (err) {
      if (err instanceof CosError) throw err;
      console.error(err);
      throw new CosError("上传Base64图片失败");
    }
  }


  /**
   * 删除 COS 上指定路径的图片
   * @param uri 文件路径
   */
  static async deleteFile(url: string): Promise<void> {
    try {
      console.log(this.extractKeyFromUrl(url))
      const params = {
        Bucket: CosConstant.BUCKET_NAME,
        Region: CosConstant.REGION,
        Key: this.extractKeyFromUrl(url)
      };
      await cos.deleteObject(params);
    } catch(err) {
      throw new CosError("删除文件失败");
    }
  }

  /**
   * 判断是否是来自 COS 上的图片
   * @param url 图片地址
   * @returns 
   */
  static isValidCosUrl(url: string): boolean {
    return url.startsWith(CosConstant.BASE_URL);
  }

  /**
   * 从 url 中提取 COS key
   * @param url 图片路径
   * @returns 
   */
  private static extractKeyFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.slice(1); // 移除开头的斜杠
    } catch {
      return url; // 直接返回 Key 的情况
    }
  }

  /**
   * 用 UUID 生成随机且唯一的文件名
   * @param fileExtension 文件后缀
   * @returns 文件名
   */
  private static generateFileName(fileExtension?: string): string {
    const uuid = v4().replace(/-/g, '');
    const ext = fileExtension ? `.${fileExtension}` : '';
    return `${uuid}${ext}`;
  }
}

export default CosUtil