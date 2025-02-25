import MessageConstant from "@/constant/messageConstant";

class ForbiddenError extends Error {
  constructor(message?: string) {
    super(message ?? MessageConstant.NEED_ELDER_PERMISSION); // 默认提示消息
    this.name = 'ForbiddenError';
    // 修复原型链（确保跨模块继承正确）
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export default ForbiddenError;