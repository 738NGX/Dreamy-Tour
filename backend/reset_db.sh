#!/bin/bash
# 数据库重置脚本，适用于通过 npm start 启动 Express 服务

# 配置变量：根据实际情况调整路径
DB_PATH="/app/database/database.db"
SQL_SCRIPT="/app/database.sql"

# 1. 查找并停止 Express 服务
echo "查找正在运行的 Express 服务进程..."
PID=$(pgrep -f "ts-node -r tsconfig-paths/register src/index.ts")
if [ -z "$PID" ]; then
    echo "没有找到正在运行的 Express 服务，跳过停止步骤。"
else
    echo "找到 Express 服务进程 (PID: $PID)，正在停止..."
    kill "$PID"
    # 等待 2 秒让进程退出
    sleep 2
fi

# 2. 删除旧数据库文件
if [ -f "$DB_PATH" ]; then
    echo "删除旧数据库文件：$DB_PATH"
    rm -f "$DB_PATH"
    if [ $? -ne 0 ]; then
        echo "错误：删除旧数据库文件失败！"
        exit 1
    fi
else
    echo "未发现旧数据库文件，跳过删除步骤。"
fi

# 3. 使用 SQL 脚本重建数据库
if [ -f "$SQL_SCRIPT" ]; then
    echo "使用 $SQL_SCRIPT 重建数据库..."
    sqlite3 "$DB_PATH" < "$SQL_SCRIPT"
    if [ $? -eq 0 ]; then
        echo "数据库重建成功。"
    else
        echo "错误：数据库重建失败！"
        exit 1
    fi
else
    echo "错误：找不到 SQL 脚本 $SQL_SCRIPT！"
    exit 1
fi

# 4. 重启 Express 服务
echo "重启 Express 服务..."
npm start &
if [ $? -eq 0 ]; then
    echo "Express 服务已启动。"
else
    echo "错误：启动 Express 服务失败！"
    exit 1
fi

echo "数据库重置流程完成。"
