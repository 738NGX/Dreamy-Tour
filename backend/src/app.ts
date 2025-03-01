import express, { Application, Request, Response } from 'express'
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import "express-async-errors";  // 自动抛出异步异常
import "reflect-metadata";  // 元数据反射 API
import logger from '@/middleware/logger';
import { options } from '@/config/swaggerConfig';
import userRoute from '@/route/userRoute';
import exceptionHandler from '@/middleware/exceptionHandler';
import { StatusCodes } from 'http-status-codes';
import Result from '@/base/result';
import MessageConstant from '@/constant/messageConstant';
import authInterceptor from './middleware/authInterceptor';


const app: Application = express()

// 中间件
app.use(logger);  // 日志记录
app.use(express.json()); // 解析 JSON 格式的请求体
app.use(express.urlencoded({ extended: true })); // 解析 URL 编码格式的请求体
app.use(authInterceptor); // 用户认证拦截器
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options)));  // swagger 文档

// 路由
app.use(userRoute)  // 用户相关路由

// 托底路由，返回 404
app.use((req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json(
    Result.error(MessageConstant.PAGE_ON_VACATION)
  );
})
// 全局异常处理
app.use(exceptionHandler);

export default app;