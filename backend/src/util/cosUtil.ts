import cos from "@/config/cosConfig";
import CosConstant from "@/constant/cosConstant"
import CosError from "@/exception/cosError";
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
  static async uploadFile(folderName: string, file: Buffer | Readable, fileExtension?: string): Promise<string> {
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