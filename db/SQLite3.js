const sqlite3 = require('sqlite3').verbose();

// 连接 SQLite 数据库（如果不存在会自动创建）
const db = new sqlite3.Database('database.sqlite3', (err) => {
  if (err) {
    console.error('連線 SQLite 失敗:', err.message);
  } else {
    console.log('已連線 SQLite ');
  }
});

// 创建数据表（如果不存在）
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tracked_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      product_url TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
