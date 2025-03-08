/*
 * 频道相关的常量类
 * @Author: Franctoryer 
 * @Date: 2025-03-08 15:34:22 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-08 15:37:14
 */
class ChannelConstant {
  // A 类频道
  static readonly LEVEL_A = 0
  // B 类频道
  static readonly LEVEL_B = 1
  // C 类频道
  static readonly LEVEL_C = 2
  // A 类频道上限 3000 人
  static readonly LEVEL_A_LIMIT = 3000
  // B 类频道上限 500 人
  static readonly LEVEL_B_LIMIT = 500
  // C 类频道上限 100 人
  static readonly LEVEL_C_LIMIT = 100
}

export default ChannelConstant;