/*
 * 汇率转化的传参
 * @Author: Franctoryer 
 * @Date: 2025-03-03 09:35:36 
 * @Last Modified by:   Franctoryer 
 * @Last Modified time: 2025-03-03 09:35:36 
 */
import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { Matches } from "class-validator";

class ExchangeRateDto extends DTO<ExchangeRateDto> {
  // 需要转换的原始货币类型
  @Expose()
  @Matches(/^[A-Z]{3}$/, {
    message: "ISO 代码必须由 3 个大写字母组成"
  })
  @Type(() => String)
  fromCurrencyISO: string

  // 希望转换成的目标货币类型
  @Expose()
  @Matches(/^[A-Z]{3}$/, {
    message: "ISO 代码必须由 3 个大写字母组成"
  })
  @Type(() => String)
  toCurrencyISO: string
}

export default ExchangeRateDto;