import MessageConstant from "@/constant/messageConstant";

class InternalError extends Error {
    constructor(message?: string) {
      super(message ?? MessageConstant.INTERNAL_ERROR);
      this.name = 'InternalError';
    }
}

export default InternalError;