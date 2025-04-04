FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 初始化命令
RUN apk update && apk add --no-cache bash git sqlite sqlite-dev procps tzdata && \
  ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
  echo 'Asia/Shanghai' > /etc/timezone && \
  echo "export TZ=Asia/Shanghai" >> /etc/profile && \
  git clone --depth=1 https://github.com/738NGX/Dreamy-Tour.git /tmp/repo && \
  cp -r /tmp/repo/backend/* /app/ && \
  rm -rf /tmp/repo && \
  npm install -g typescript ts-node && \
  npm i && \
  chmod +x /app/entrypoint.sh /app/reset_db.sh /app/restore_db.sh && \
  sed -i 's/\r//' /app/entrypoint.sh

# 持久化数据库目录
VOLUME /app/database

# 设置环境变量和暴露端口
ENV HOST 127.0.0.1
ENV PORT 8080
EXPOSE 8080

# 设置启动命令为 entrypoint 脚本
ENTRYPOINT ["/app/entrypoint.sh"]
