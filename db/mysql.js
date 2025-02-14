const mysql = require('mysql2/promise');
require('dotenv').config();

// 建立 MySQL 連線池
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 確保資料庫連線成功
async function connectDB() {
    try {
        const connection = await pool.getConnection();
        console.log("✅ 已連線 MySQL");
        connection.release();
    } catch (error) {
        console.error("❌ 連線 MySQL 失敗:", error);
        process.exit(1);
    }
}

// 建立 `tracked_products` 資料表（如果不存在）
async function initializeDB() {
    try {
        const connection = await pool.getConnection();
        await connection.query(`
      CREATE TABLE IF NOT EXISTS tracked_products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        product_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        connection.release();
        console.log("✅ MySQL 資料表初始化完成");
    } catch (error) {
        console.error("❌ 初始化 MySQL 失敗:", error);
    }
}

module.exports = {
    pool,
    connectDB,
    initializeDB
};
