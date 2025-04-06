/*
 * 小程序相关的常量类
 * @Author: Franctoryer 
 * @Date: 2025-02-28 14:06:39 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-04-05 23:25:10
 */
import projectConfig from "../../database/dreamy-tour-config.json"

class AppConstant {
  static readonly APP_ID = projectConfig.appId;
  static readonly APP_SECRET = projectConfig.appSecret;
}

export default AppConstant;