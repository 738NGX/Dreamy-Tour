import MessageConstant from "@/constant/messageConstant";

class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message ?? MessageConstant.GHOST_MODE_DETECTED);  // 默认提示消息
    this.name = 'UnauthorizedError';
  }
}

export default UnauthorizedError