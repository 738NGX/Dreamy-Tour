import express, { Application, Request, Response } from 'express'
import "express-async-errors";  // 自动抛出异步异常（express 的全局异常处理函数只能捕获同步异常，无法捕获异步异常，这个库专门用来抛出异步异常）
import "reflect-metadata";  // 元数据反射 API（class-validation, class-transformer 等运用装饰器语法的第三方库的需要，否则会报错）
import logger from '@/middleware/logger';
import userRoute from '@/route/userRoute';
import exceptionHandler from '@/middleware/exceptionHandler';
import { StatusCodes } from 'http-status-codes';
import Result from '@/vo/result';
import MessageConstant from '@/constant/messageConstant';
import authInterceptor from './middleware/authInterceptor';
import currencyRoute from './route/currencyRoute';


const app: Application = express()

// 中间件
app.use(logger);  // 日志记录
app.use(express.json()); // 解析 JSON 格式的请求体
app.use(express.urlencoded({ extended: true })); // 解析 URL 编码格式的请求体
app.use(authInterceptor); // 用户认证拦截器

// 路由
app.use(userRoute)  // 用户相关路由
app.use(currencyRoute)  // 货币相关路由

// 托底路由，捕获以上路由均无法匹配的 url，返回 404
app.use((req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json(
    Result.error(MessageConstant.PAGE_ON_VACATION)
  );
})

// 全局异常处理
app.use(exceptionHandler);

export default app;