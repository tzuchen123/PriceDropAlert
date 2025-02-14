const db = require('../services/SQLite3');

function listTrackedProducts(userId, replyMessage) {
    db.all('SELECT product_url FROM tracked_products WHERE user_id = ?', [userId], (err, rows) => {
        if (err) {
            console.error('❌ 查詢錯誤:', err.message);
            return replyMessage("❌ 無法查詢追蹤商品，請稍後再試。");
        }

        if (rows.length === 0) {
            return replyMessage("🔍 目前沒有追蹤的商品。");
        }

        const productList = rows.map(row => `🛒 ${row.product_url}`).join("\n");
        replyMessage(`📌 你的追蹤商品：\n${productList}`);
    });
}

module.exports = listTrackedProducts;
