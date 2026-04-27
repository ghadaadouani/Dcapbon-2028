import mysql from 'mysql2/promise';
import BetterSqlite3 from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logPath = './server_logs.txt';
const shouldWriteFileLogs = process.env.NODE_ENV === 'production' || process.env.ENABLE_FILE_LOGS === 'true';
const log = (msg: string) => {
    const text = `${new Date().toISOString()} - [DB] ${msg}\n`;
    if (shouldWriteFileLogs) {
        try {
            fs.appendFileSync(logPath, text);
        } catch (e) {}
    }
    console.log(text);
};

let db: any;
let isSqliteStatus = false;

export const isSqlite = () => isSqliteStatus;

// Attempt to connect to MySQL
export const connectDB = async () => {
    // Check if we have MySQL env vars
    const hasMySql = process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME;

    if (hasMySql) {
        try {
            log('Attempting MySQL connection...');
            const pool = mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
                port: parseInt(process.env.DB_PORT || '3306'),
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
            
            // Test connection
            await pool.getConnection();
            log('Connected to MySQL database');
            db = pool;
            return;
        } catch (error: any) {
            log(`MySQL connection failed: ${error.message}. Falling back to SQLite...`);
        }
    } else {
        log('MySQL environment variables missing, using SQLite for preview...');
    }

    // Fallback to SQLite (for AI Studio Preview or local testing without MySQL)
    const sqlitePath = path.join(__dirname, '..', 'database.sqlite');
    log(`Initializing SQLite at: ${sqlitePath}`);
    db = new BetterSqlite3(sqlitePath);
    isSqliteStatus = true;
    log('SQLite initialized successfully');
};

// Simplified query wrapper
export const query = async (sql: string, params: any[] = []) => {
    if (!db) await connectDB();

    const start = Date.now();
    try {
        if (isSqliteStatus) {
            const trimmedSql = sql.trim().toLowerCase();
            // Handle parameterized queries for SQLite
            let result;
            if (trimmedSql.startsWith('select') || trimmedSql.startsWith('pragma')) {
                result = db.prepare(sql).all(...params);
            } else {
                const runResult = db.prepare(sql).run(...params);
                // Normalize result to have insertId for compatibility with MySQL-based code
                result = {
                    ...runResult,
                    insertId: runResult.lastInsertRowid
                };
            }
            log(`[SQLITE] Query Success: ${sql.substring(0, 50)}... (${Date.now() - start}ms)`);
            return result;
        } else {
            // MySQL
            const [results] = await db.execute(sql, params);
            log(`[MYSQL] Query Success: ${sql.substring(0, 50)}... (${Date.now() - start}ms)`);
            return results;
        }
    } catch (err: any) {
        log(`[DB ERROR] Query Failed: ${err.message} | SQL: ${sql}`);
        throw err;
    }
};

export default { query, connectDB };
