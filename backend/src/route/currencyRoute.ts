/*
 * 货币相关路由
 * @Author: Franctoryer 
 * @Date: 2025-03-03 08:32:25 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-08 15:15:34
 */

import ExchangeRateDto from "@/dto/currency/exchangeRateDto";
import CurrencyService from "@/service/currencyService";
import Result from "@/vo/result";
import express, { Request, Response} from "express";
import { StatusCodes } from "http-status-codes";

const currencyRoute = express.Router();

/**
 * @description 获取货币的转化汇率
 * @method GET
 * @path /currency/exchange-rate
 */
currencyRoute.get('/currency/exchange-rate', async (req: Request, res: Response) => {
  const exchangeRateDto = await ExchangeRateDto.from(req.query);
  // 调接口获取实时汇率
  const exchangeRateVo = await CurrencyService.getExchangeRate(exchangeRateDto);
  // 响应结果
  res.status(StatusCodes.OK)
    .json(Result.success(exchangeRateVo));
})

export default currencyRoute;