/*
 * 视图对象基类，前端需要展示的数据
 * @Author: Franctoryer 
 * @Date: 2025-02-24 23:55:52 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-02-24 23:57:36
 */
class VO<T> {
  constructor(data: Partial<T>) {
    Object.assign(this, data);
  }
}

export default VO;