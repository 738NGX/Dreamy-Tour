import MessageConstant from "@/constant/messageConstant";

class ParamsError extends Error {
  constructor(message?: string) {
    super(message ?? MessageConstant.UNIVERSE_RULE_VIOLATION);  // 默认提示消息
    this.name = 'ParamsError';
  }
}

export default ParamsError;