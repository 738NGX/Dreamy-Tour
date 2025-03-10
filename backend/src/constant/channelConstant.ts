/*
 * 频道相关的常量类
 * @Author: Franctoryer 
 * @Date: 2025-03-08 15:34:22 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-09 10:18:49
 */
class ChannelConstant {
  // S 类频道（不可创建）
  static readonly LEVEL_S = -1
  // A 类频道
  static readonly LEVEL_A = 0
  // B 类频道
  static readonly LEVEL_B = 1
  // C 类频道
  static readonly LEVEL_C = 2
  // S 类频道无上限
  static readonly LEVEL_S_LIMIT = Number.MAX_SAFE_INTEGER
  // A 类频道上限 3000 人
  static readonly LEVEL_A_LIMIT = 3000
  // B 类频道上限 500 人
  static readonly LEVEL_B_LIMIT = 500
  // C 类频道上限 100 人
  static readonly LEVEL_C_LIMIT = 100
  // 启用
  static readonly ENABLED = 0
  // 禁用
  static readonly DISABLED = 1
}

export default ChannelConstant;