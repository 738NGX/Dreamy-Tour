/*
 * 邮箱相关的常量类
 * @Author: Franctoryer 
 * @Date: 2025-04-09 00:00:18 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-04-09 00:17:26
 */
import config from "../../database/dreamy-tour-config.json"

class EmailConstant {
  // SMTP 服务所用的邮箱
  static readonly FROM_EMAIL = config.email

  // SMTP 服务的授权码
  static readonly EMAIL_PASS = config.emailPass
}

export default EmailConstant;