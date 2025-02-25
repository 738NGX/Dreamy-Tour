import MessageConstant from "@/constant/messageConstant";

class ParamsError extends Error {
  constructor(message?: string) {
    super(message ?? MessageConstant.UNIVERSE_RULE_VIOLATION);  // 默认提示消息
    this.name = 'ParamsError';
    // 修复原型链，确保 instanceof 在跨模块时正常工作
    Object.setPrototypeOf(this, ParamsError.prototype);
  }
}

export default ParamsError;