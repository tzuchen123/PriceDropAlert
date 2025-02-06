const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('lowest_prices.db');

// 建立最低價資料表
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS lowest_prices (
        product_name TEXT PRIMARY KEY,
        brand_name TEXT,
        lowest_price INTEGER
    )`);
});

module.exports = db;
