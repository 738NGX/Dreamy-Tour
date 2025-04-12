FROM node:23-slim

# 设置工作目录
WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y --no-install-recommends \
      bash \
      git \
      ca-certificates \
      sqlite3 \
      libsqlite3-dev \
      procps \
      tzdata && \
    # 设置时区为 Asia/Shanghai
    ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo 'Asia/Shanghai' > /etc/timezone && \
    echo "export TZ=Asia/Shanghai" >> /etc/profile && \
    # 更新 CA 证书（可选，但推荐）
    update-ca-certificates && \
    # 克隆项目并复制需要的文件到工作目录
    git clone --depth=1 https://github.com/738NGX/Dreamy-Tour.git /tmp/repo && \
    cp -r /tmp/repo/backend/* /app/ && \
    rm -rf /tmp/repo && \
    # 全局安装 typescript 和 ts-node，同时安装项目依赖
    npm install -g typescript ts-node && \
    npm install && \
    # 赋予启动脚本执行权限，并移除 Windows 的 CRLF 格式
    chmod +x /app/entrypoint.sh /app/reset_db.sh /app/restore_db.sh && \
    sed -i 's/\r//' /app/entrypoint.sh && \
    # 清理 apt 缓存
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 持久化数据库目录
VOLUME /app/database

# 设置环境变量和暴露端口
ENV HOST=127.0.0.1
ENV PORT=8080
EXPOSE 8080

# 设置启动命令为 entrypoint 脚本
ENTRYPOINT ["/app/entrypoint.sh"]
