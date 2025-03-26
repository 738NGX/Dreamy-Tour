/*
 * 消息提示相关的常量类
 * @Author: Franctoryer 
 * @Date: 2025-02-23 22:13:32 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-21 22:07:00
 */
class MessageConstant {
  static readonly SUCCESSFUL_RETURN = '返回成功';
  static readonly PAGE_ON_VACATION = "您访问的页面正在度假⛱️，请稍后再试";
  static readonly GHOST_MODE_DETECTED = "👻 检测到隐身状态，请先解除咒语";
  static readonly UNIVERSE_RULE_VIOLATION = "🌌 检测到违反宇宙基本法的参数组合";
  static readonly NEED_ELDER_PERMISSION = "🚫 禁区！需要长老权限";
  static readonly UNKNOWN_ERROR = "未知异常";
  static readonly SUCCESSFUL_CREATED = "创建成功";
  static readonly SUCCESSFUL_MODIFIED = "修改成功";
  static readonly SUCCESSFUL_UNREGISTER = "注销成功";
  static readonly SUCCESSFUL_TRANSFER = "转让成功";
  static readonly SUCCESSFUL_DISSOLVE = "解散成功";
  static readonly SUCCESSFUL_PUBLISH = "发布成功";
  static readonly SUCCESSFUL_GRANT = "授权成果";
  static readonly SUCCESSFUL_JOIN = "加入成功";
  static readonly SUCCESSFUL_EXIT = "退出成功";
  static readonly FAILED_UPLOAD = "文件上传失败";
  static readonly NO_FILE_UPLOADED = "文件为空";
  static readonly WX_SERVICE_ERROR = "微信接口响应异常";
  static readonly NOT_FOUND_ERROR = "目标不存在";
  static readonly API_UNAVAILABLE = "API 服务不可用";
  static readonly ACCEPT_IMAGE_ONLY = "只接受图片类型的文件（如 .jpg, .jpeg, .png, .gif, .bmp, .tiff, .webp）。请上传有效的图片文件。"
  static readonly INTERNAL_ERROR = "系统内部异常";
  static readonly NONEXISTENT_CHANNEL = "该频道类型不存在";
}

export default MessageConstant;