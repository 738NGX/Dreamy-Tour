/*
 * 货币相关业务
 * @Author: Franctoryer 
 * @Date: 2025-03-03 10:05:00 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-03 10:59:59
 */
import ExchangeRateDto from "@/dto/currency/exchangeRateDto";
import ApiError from "@/exception/apiError";
import NotFoundError from "@/exception/notFoundError";
import ExchangeRateVo from "@/vo/currency/exchangeRateVo";
import { StatusCodes } from "http-status-codes";

class CurrencyService {
  /**
   * 调用 https://www.exchangerate-api.com 的 api 获取实时汇率
   * @param exchangeRateDto 原始货币类型和目标货币类型
   */
  static async getExchangeRate(exchangeRateDto: ExchangeRateDto): Promise<ExchangeRateVo> {
    let res: Response;
    try {
      res = await fetch(`https://api.exchangerate-api.com/v4/latest/${exchangeRateDto.fromCurrencyISO}`);
    } catch(err) {
      throw new ApiError("汇率转化接口不可用");
    }
    if (res.status === StatusCodes.NOT_FOUND) {
      throw new NotFoundError("原始货币类型不存在");
    }
    
    const resJson = await res.json();
    // 上次汇率更新的时间戳
    const timeLastUpdated: number = resJson["time_last_updated"];
    // 汇率
    const rates = resJson["rates"];
    const exchangeRate = rates[exchangeRateDto.toCurrencyISO];
    // 如果不存在目标货币类型的
    if (!exchangeRate) {
      throw new NotFoundError("目标货币类型不存在");
    }

    // 返回结果
    return new ExchangeRateVo({
      fromCurrencyISO: exchangeRateDto.fromCurrencyISO,
      toCurrencyISO: exchangeRateDto.toCurrencyISO,
      timeLastUpdated: timeLastUpdated,
      exchangeRate: exchangeRate
    })
  }
}

export default CurrencyService;