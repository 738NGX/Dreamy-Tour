/*
 * COS 相关的常量类
 * @Author: Franctoryer 
 * @Date: 2025-03-02 16:25:06 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-02 18:55:59
 */

class CosConstant {
  // 密钥 id
  static readonly SECRET_ID = 'AKIDJUSJxQgmgx5zjLmz3ykJfssfEZIo6B4n';
  // 密钥
  static readonly SECRET_KEY = 'bzA8xc4NTM1DBvSlvvlU4UlpjQuDPPCl';
  // 存储桶名称
  static readonly BUCKET_NAME = 'dreamy-tour-1319433252';
  // 地址
  static readonly REGION = 'ap-shanghai';
  // 所有对象存储的图片 url 都以这个开头
  static readonly BASE_URL = 'https://dreamy-tour-1319433252.cos.ap-shanghai.myqcloud.com';
  // 存储用户头像的文件夹名
  static readonly AVATAR_FOLDER = 'avatar';
}

export default CosConstant
