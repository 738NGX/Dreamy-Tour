/*
 * DTO(数据传输对象，用于封装前端传过来的参数，需要进行参数校验，避免非法参数)，使用 `class-validator` 进行参数校验
 * @Author: Franctoryer 
 * @Date: 2025-02-23 21:49:46 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-02-25 12:54:08
 */
import { validateOrReject, ValidationError } from "class-validator";
import ParamsError from "../exception/paramsError";

class DTO<T> {
  constructor(data: Partial<T> = {}) {
    Object.assign(this, data);
  }

  /**
   * 校验参数
   */
  async validate() {
    try {
      await validateOrReject(this);
    } catch (error) {
      if (Array.isArray(error)) {
        const messages = error
          .map((err) => Object.values(err.constraints || {}).join(", "))
          .join("; ");
        throw new ParamsError(messages);
      } else {
        throw error;
      }
    } 
  }
}

export default DTO;