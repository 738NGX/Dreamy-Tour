FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 初始化命令
RUN apt-get update && \
  apt-get install -y git sqlite3 libsqlite3-dev libsqlite3-0 procps && \
  rm -rf /var/lib/apt/lists/* && \
  ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
  echo 'Asia/Shanghai' > /etc/timezone && \
  echo "export TZ=Asia/Shanghai" >> /etc/profile && \
  git clone --depth=1 https://github.com/738NGX/Dreamy-Tour.git /tmp/repo && \
  cp -r /tmp/repo/backend/* /app/ && \
  rm -rf /tmp/repo && \
  npm install -g typescript ts-node && \
  npm i && \
  chmod +x /app/entrypoint.sh /app/reset_db.sh /app/restore_db.sh

# 持久化数据库目录
VOLUME /app/database

# 设置环境变量和暴露端口
ENV HOST 127.0.0.1
ENV PORT 8080
EXPOSE 8080

# 设置启动命令为 entrypoint 脚本
ENTRYPOINT ["/app/entrypoint.sh"]
