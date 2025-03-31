import { Currency } from "@/constant/tourConstant";
import ParamsError from "@/exception/paramsError";

class TourUtil {
  static convertCurrencyStringToNumber(currencyString: string): number {
    const currencyList = [
      { label: '人民币-CNY', symbol: 'CNY', value: Currency.CNY },
      { label: '美元-USD', symbol: 'USD', value: Currency.USD },
      { label: '欧元-EUR', symbol: 'EUR', value: Currency.EUR },
      { label: '日元-JPY', symbol: 'JPY', value: Currency.JPY },
      { label: '港元-HKD', symbol: 'HKD', value: Currency.HKD },
      { label: '澳元-MOP', symbol: 'MOP', value: Currency.MOP },
      { label: '新台币-TWD', symbol: 'TWD', value: Currency.TWD },
      { label: '英镑-GBP', symbol: 'GBP', value: Currency.GBP },
      { label: '韩元-KRW', symbol: 'KRW', value: Currency.KRW },
      { label: '新加坡元-SGD', symbol: 'SGD', value: Currency.SGD },
      { label: '泰铢-THB', symbol: 'THB', value: Currency.THB },
      { label: '俄罗斯卢布-RUB', symbol: 'RUB', value: Currency.RUB },
      { label: '加元-CAD', symbol: 'CAD', value: Currency.CAD },
      { label: '印度卢比-INR', symbol: 'INR', value: Currency.INR },
      { label: '澳元-AUD', symbol: 'AUD', value: Currency.AUD },
      { label: '越南盾-VND', symbol: 'VND', value: Currency.VND },
    ];
    const currency = currencyList.find(item => item.symbol === currencyString);
    if (!currency) {
      throw new ParamsError("不存在的货币符号！")
    }
    return currency.value;
  }
}

export default TourUtil;