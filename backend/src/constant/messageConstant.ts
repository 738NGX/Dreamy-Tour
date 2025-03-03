/*
 * 消息提示相关的常量类
 * @Author: Franctoryer 
 * @Date: 2025-02-23 22:13:32 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-03 10:32:09
 */
class MessageConstant {
  static readonly SUCCESSFUL_RETURN = '返回成功';
  static readonly PAGE_ON_VACATION = "您访问的页面正在度假⛱️，请稍后再试";
  static readonly GHOST_MODE_DETECTED = "👻 检测到隐身状态，请先解除咒语";
  static readonly UNIVERSE_RULE_VIOLATION = "🌌 检测到违反宇宙基本法的参数组合";
  static readonly NEED_ELDER_PERMISSION = "🚫 禁区！需要长老权限";
  static readonly UNKNOWN_ERROR = "未知异常";
  static readonly SUCCESSFUL_MODIFIED = "修改成功";
  static readonly SUCCESSFUL_UNREGISTER = "注销成功";
  static readonly FAILED_UPLOAD = "文件上传失败";
  static readonly NO_FILE_UPLOADED = "文件为空";
  static readonly WX_SERVICE_ERROR = "微信接口响应异常";
  static readonly NOT_FOUND_ERROR = "目标不存在";
  static readonly API_UNAVAILABLE = "API 服务不可用";
}

export default MessageConstant;