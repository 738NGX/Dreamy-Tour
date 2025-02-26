/*
 * 启动文件
 * @Author: Franctoryer 
 * @Date: 2025-02-23 21:43:04 
 * @Last Modified by:   Franctoryer 
 * @Last Modified time: 2025-02-23 21:43:04 
 */
import app from "./app";

// 端口号
const PORT: number = Number(process.env.PORT) || 80;
// 监听端口
app.listen(PORT, () => {
  console.log(`
    🚀 Server running in ${process.env.NODE_ENV || 'development'} mode
    🔗 Listening on port ${PORT}
    📅 ${new Date().toISOString()}
  `);
})