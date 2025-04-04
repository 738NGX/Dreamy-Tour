/*
 * 数据库配置
 * @Author: Franctoryer 
 * @Date: 2025-02-24 23:36:25 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-02-28 19:52:36
 */
import sqlite3 from "sqlite3";
import path from 'path';
import { open } from "sqlite"

const dbPath = path.resolve(process.cwd(), 'database/database.db');

const dbPromise = open({
  filename: dbPath,
  driver: sqlite3.Database
}).then(async (db) => {
  await db.exec("PRAGMA foreign_keys = ON");
  return db;
});


export default dbPromise;