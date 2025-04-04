#!/bin/bash
set -e

# 定义数据库及备份目录路径
DB_FILE="/app/database/database.db"
BACKUP_DIR="/app/database/backups"

# 数据库备份函数：轮转保留3份备份文件
backup_database() {
  echo "[$(date)] 执行数据库备份..."
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
