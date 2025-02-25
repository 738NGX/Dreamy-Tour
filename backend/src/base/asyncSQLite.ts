/*
 * 由于 sqlite3 
 * @Author: Franctoryer 
 * @Date: 2025-02-25 12:19:52 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-02-25 12:22:22
 */
import { Database } from "sqlite3";


export class AsyncSQLite {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  // 封装 run/exec 方法
  async run(sql: string, params?: any[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, (err: Error | null) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // 封装 get 方法（单条查询）
  async get<T = any>(sql: string, params?: any[]): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err: Error | null, row: T) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // 封装 all 方法（多条查询）
  async all<T = any>(sql: string, params?: any[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err: Error | null, rows: T[]) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // 关闭数据库
  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err: Error | null) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}