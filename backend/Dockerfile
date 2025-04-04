# 使用node镜像版本
FROM node:20-alpine

# 安装必要依赖
RUN apt-get update && \
    apt-get install -y git sqlite3 libsqlite3-dev libsqlite3-0 procps && \
    rm -rf /var/lib/apt/lists/*

# 工作目录
WORKDIR /app

# 持久化数据库目录
VOLUME /app/database

# 设置时区为上海
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo 'Asia/Shanghai' > /etc/timezone && \
    echo "export TZ=Asia/Shanghai" >> /etc/profile

# 设置环境变量和暴露端口
ENV HOST 127.0.0.1
ENV PORT 8080
EXPOSE 8080

# 克隆最新后端源码
RUN git clone --depth=1 https://github.com/738NGX/Dreamy-Tour.git /tmp/repo && \
  cp -r /tmp/repo/backend/* /app/ && \
  rm -rf /tmp/repo

# 安装 Node.js 依赖
RUN npm install -g typescript && \
    npm install -g ts-node && \
    npm i

# 赋予脚本执行权限
RUN chmod +x /app/entrypoint.sh && \
    chmod +x /app/reset_db.sh && \
    chmod +x /app/restore_db.sh

# 设置启动命令为 entrypoint 脚本
ENTRYPOINT ["/app/entrypoint.sh"]
