import VO from "@/base/vo";

class ExchangeRateVo extends VO<ExchangeRateVo> {
  // API 服务商
  provider: string = "https://www.exchangerate-api.com"

  // 原始货币类型
  fromCurrencyISO: string

  // 目标货币类型
  toCurrencyISO: string

  // 上次更新的时间戳
  timeLastUpdated: number

  // 汇率
  exchangeRate: number
}

export default ExchangeRateVo;