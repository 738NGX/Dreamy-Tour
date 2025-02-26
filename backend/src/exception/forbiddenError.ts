import MessageConstant from "@/constant/messageConstant";

class ForbiddenError extends Error {
  constructor(message?: string) {
    super(message ?? MessageConstant.NEED_ELDER_PERMISSION); // 默认提示消息
    this.name = 'ForbiddenError';
  }
}

export default ForbiddenError;