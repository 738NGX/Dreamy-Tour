/*
 * DTO(数据传输对象，用于封装前端传过来的参数，需要进行参数校验，避免非法参数)，使用 `class-validator` 进行参数校验
 * @Author: Franctoryer 
 * @Date: 2025-02-23 21:49:46 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-02 16:01:17
 */
import { validateOrReject, ValidationError } from "class-validator";
import ParamsError from "../exception/paramsError";
import { plainToInstance } from "class-transformer";

class DTO<T> {
  constructor(data: Partial<T> = {}) {
    Object.assign(this, data);
  }

  /**
   * 静态工厂方法，在生成实例前，过滤掉没有 @Expose() 的属性，并对属性进行校验
   */
  static async from<T extends DTO<T>>(this: new () => T, data: any): Promise<T> {
    const instance = plainToInstance(this, data, {
      excludeExtraneousValues: true,  // 过滤额外属性
      enableImplicitConversion: true  // 开启自动类型转换，@Type 生效，确保类型安全
    });
    await instance.validate();  // 校验参数是否合法，如果不合法，抛出异常
    return instance;
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