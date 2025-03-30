class Tour {
  // 行程ID
  tourId: number;
  // 行程名称
  title: string;
  // 行程状态
  status: number;
  // 行程绑定频道ID
  linkedChannel: number;
  // 行程在频道中的可见性
  channelVisible: number;
  // 行程绑定群组ID
  linkedGroup: number;
  // 行程开始日期
  startDate: number;
  // 行程结束日期
  endDate: number;
  // 行程默认时差
  timeOffset: number;
  // 行程主货币
  mainCurrency: number;
  // 行程副货币
  subCurrency: number;
  // 行程货币汇率
  currencyExchangeRate: number;
  // 行程用户列表
  users: string;
  // 行程版本名称列表
  nodeCopyNames: string;
  // 行程预算表列表
  budgets: string;
  // 行程地点列表
  locations: string;
  // 行程交通列表
  transportations: string;
  // 行程创建时间
  createdAt: number;
  // 行程更新时间
  updatedAt: number;
}

export default Tour;