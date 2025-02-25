import MessageConstant from "@/constant/messageConstant";

class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message ?? MessageConstant.GHOST_MODE_DETECTED);  // 默认提示消息
    this.name = 'UnauthorizedError';
    // 修复原型链，确保 instanceof 在跨模块时正常工作
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export default UnauthorizedError