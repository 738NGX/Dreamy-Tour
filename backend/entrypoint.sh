#!/bin/bash
set -e

# 定义数据库及备份目录路径
DB_FILE="/app/database/database.db"
BACKUP_DIR="/app/database/backups"

# 检查数据库文件是否存在，如果不存在则使用/app/database.sql创建
if [ ! -f "$DB_FILE" ]; then
  echo "[$(date)] 数据库文件 $DB_FILE 不存在，尝试使用 SQL 脚本创建..."
  if [ -f "/app/database.sql" ]; then
    echo "[$(date)] 使用 SQL 脚本创建数据库..."
    sqlite3 "$DB_FILE" < "/app/database.sql"
    echo "[$(date)] 数据库创建完成。"
  else
    echo "[$(date)] 错误：找不到 SQL 脚本 /app/database.sql！"
    exit 1
  fi
fi
# 检查数据库文件是否创建成功
if [ ! -f "$DB_FILE" ]; then
  echo "[$(date)] 错误：数据库文件 $DB_FILE 创建失败！"
  exit 1
fi
# 检查数据库文件大小是否大于0
if [ ! -s "$DB_FILE" ]; then
  echo "[$(date)] 错误：数据库文件 $DB_FILE 为空！"
  exit 1
fi
# 检查备份目录是否存在，如果不存在则创建
if [ ! -d "$BACKUP_DIR" ]; then
  echo "[$(date)] 备份目录 $BACKUP_DIR 不存在，创建目录..."
  mkdir -p "$BACKUP_DIR"
  echo "[$(date)] 备份目录创建完成。"
fi

# 数据库备份函数：轮转保留3份备份文件
backup_database() {
  echo "[$(date)] 执行数据库备份..."
  if [ ! -f "$DB_FILE" ]; then
    echo "[$(date)] 数据库文件 $DB_FILE 不存在，跳过备份。"
    return
  fi
  mkdir -p "$BACKUP_DIR"
  # 删除最旧的备份
  rm -f "$BACKUP_DIR/backup1.db"
  # 轮转备份文件
  [ -f "$BACKUP_DIR/backup2.db" ] && mv "$BACKUP_DIR/backup2.db" "$BACKUP_DIR/backup1.db"
  [ -f "$BACKUP_DIR/backup3.db" ] && mv "$BACKUP_DIR/backup3.db" "$BACKUP_DIR/backup2.db"
  # 创建最新备份
  cp "$DB_FILE" "$BACKUP_DIR/backup3.db"
  echo "[$(date)] 数据库备份完成。"
}

# 后台任务：每12小时自动备份数据库
start_backup_scheduler() {
  while true; do
    sleep 43200  # 12小时 = 43200秒
    backup_database
  done
}

# 启动时立即备份一次数据库
backup_database

# 启动备份调度任务（后台运行）
start_backup_scheduler &

# 启动 Express 服务（直接通过 npm start 启动）
echo "[$(date)] 启动 Express 服务..."
exec npm start
