/*
 * 小程序相关的常量类
 * @Author: Franctoryer 
 * @Date: 2025-02-28 14:06:39 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-04-09 00:18:06
 */
import projectConfig from "../../database/dreamy-tour-config.json"

class AppConstant {
  // 应用名称
  static readonly APP_NAME = projectConfig.projectName
  // 小程序 ID
  static readonly APP_ID = projectConfig.appId
  // 小程序密钥
  static readonly APP_SECRET = projectConfig.appSecret
  // deepseek 
  static readonly DEEPSEEK_BASE_URL = "https://api.deepseek.com";
  static readonly DEEPSEEK_API_KEY = projectConfig.deepseekApiKey;
  static readonly DEEPSEEK_MODEL = "deepseek-chat";
  // 高德 MCP
  static readonly GAODE_API_KEY = projectConfig.gaodeApiKey;
}

export default AppConstant;