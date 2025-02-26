/*
 * Swagger 文档配置
 * @Author: Franctoryer 
 * @Date: 2025-02-25 19:34:04 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-02-25 19:35:13
 */
import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

// 获取项目根目录绝对路径（根据配置文件位置调整）
const PROJECT_ROOT = path.resolve(__dirname, "../");

export const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '梦·旅',
      version: '1.0.0',
    },
  },
  apis: [
    // 使用 path.join 动态构建绝对路径
    path.join(PROJECT_ROOT, "route/**/*.ts"),
    path.join(PROJECT_ROOT, "entity/**/*.ts"),
    path.join(PROJECT_ROOT, "dto/**/*.ts"),
    path.join(PROJECT_ROOT, "vo/**/*.ts")
  ]
};