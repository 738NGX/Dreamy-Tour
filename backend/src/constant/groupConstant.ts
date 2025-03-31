class GroupConstant {
  // A 类群组
  static readonly LEVEL_A = 0
  // B 类群组
  static readonly LEVEL_B = 1
  // C 类群组
  static readonly LEVEL_C = 2
  // A 类群组上限 100 人
  static readonly LEVEL_A_LIMIT = 100
  // B 类群组上限 20 人
  static readonly LEVEL_B_LIMIT = 20
  // C 类群组上限 5 人
  static readonly LEVEL_C_LIMIT = 5
  // 启用
  static readonly ENABLED = 0
  // 禁用
  static readonly DISABLED = 1
  // 直接加入
  static readonly JOINWAY_FREE = 0
  // 仅限邀请
  static readonly JOINWAY_INVITE = 1
}

export default GroupConstant;