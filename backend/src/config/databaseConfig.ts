/*
 * 数据库配置
 * @Author: Franctoryer 
 * @Date: 2025-02-24 23:36:25 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-02-25 10:02:07
 */
import sqlite3 from "sqlite3";
import path from 'path';
import { AsyncSQLite } from "../base/asyncSQLite";


const dbPath = path.resolve(process.cwd(), 'database.db');
const db = new AsyncSQLite(new sqlite3.Database(dbPath));

export default db;