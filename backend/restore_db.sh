#!/bin/bash
set -e

# 数据库文件路径及备份目录
DB_FILE="/app/database/database.db"
BACKUP_DIR="/app/database/backups"

# 使用帮助
usage() {
  echo "Usage: $0 [backup_version]"
  echo "  backup_version: backup3 | backup2 | backup1 (可选参数，缺省时自动选择最新备份)"
  exit 1
}

# 检查参数个数（最多只接受一个参数）
if [ "$#" -gt 1 ]; then
  usage
fi

# 判断是否传入参数，若传入，则使用指定备份
if [ "$#" -eq 1 ]; then
  case "$1" in
    backup3|backup2|backup1)
      RESTORE_FILE="$BACKUP_DIR/$1.db"
      ;;
    *)
      echo "错误：无效的参数 '$1'。"
      usage
      ;;
  esac
  if [ ! -f "$RESTORE_FILE" ]; then
    echo "错误：指定的备份文件 $RESTORE_FILE 不存在！"
    exit 1
  fi
else
  # 如果参数缺省，自动选择最新备份
  if [ -f "$BACKUP_DIR/backup3.db" ]; then
    RESTORE_FILE="$BACKUP_DIR/backup3.db"
  elif [ -f "$BACKUP_DIR/backup2.db" ]; then
    RESTORE_FILE="$BACKUP_DIR/backup2.db"
  elif [ -f "$BACKUP_DIR/backup1.db" ]; then
    RESTORE_FILE="$BACKUP_DIR/backup1.db"
  else
    echo "未找到任何备份文件，无法恢复数据库。"
    exit 1
  fi
fi

echo "使用备份文件：$RESTORE_FILE 恢复数据库..."
cp "$RESTORE_FILE" "$DB_FILE"
echo "数据库恢复成功！"
