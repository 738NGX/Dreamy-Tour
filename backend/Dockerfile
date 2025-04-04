# 使用node镜像版本
FROM node:20-bullseye-slim

# 工作目录
WORKDIR /app

COPY package*.json ./

# 安装ts-node和typescript
RUN npm install -g typescript
RUN npm install -g ts-node

# 安装依赖
RUN npm i

COPY . .

# 环境变量
ENV HOST 127.0.0.1
ENV PORT 8080

# 暴露端口
EXPOSE 8080

# 启动命令
CMD ["npm", "start"]