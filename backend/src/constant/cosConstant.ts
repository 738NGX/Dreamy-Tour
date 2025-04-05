/*
 * COS 相关的常量类
 * @Author: Franctoryer 
 * @Date: 2025-03-02 16:25:06 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-04-05 23:24:39
 */

import projectConfig from "../../dreamy-tour-config.json"

class CosConstant {
  // 密钥 id
  static readonly SECRET_ID = projectConfig.cosSecretId;
  // 密钥
  static readonly SECRET_KEY = projectConfig.cosSecretKey;
  // 存储桶名称
  static readonly BUCKET_NAME = projectConfig.cosBucketName;
  // 地址
  static readonly REGION = projectConfig.cosRegion;
  // 所有对象存储的图片 url 都以这个开头
  static readonly BASE_URL = projectConfig.cosBaseUrl;
  // 存储用户头像的文件夹名
  static readonly AVATAR_FOLDER = 'avatar';
  // 存储群组二维码的文件夹名
  static readonly QRCODE_FOLDER = 'qrCode';
  // 存储帖子图片的文件夹名
  static readonly POST_PICTURES_FOLDER = 'post_pictures';
  // 存储评论图片的文件夹名
  static readonly COMMENT_PICTURES_FOLDER = 'comment_pictures';
  // 存储行程图片的文件夹名
  static readonly TOUR_PICTURES_FOLDER = 'tour_pictures';
}

export default CosConstant
