const db = require('../db/SQLite3');

function trackProduct(userId, messageText, replyMessage) {
    const match = messageText.match(/(https?:\/\/[^\s]+)/);
    const productUrl = match ? match[1] : null;

    if (!productUrl) {
        return replyMessage("❌ 未偵測到有效的網址，請使用：\n追蹤商品 [網址]");
    }

    // **先檢查是否已存在**
    db.get('SELECT id FROM tracked_products WHERE user_id = ? AND product_url = ?', [userId, productUrl], (err, row) => {
        if (err) {
            console.error('❌ 資料庫查詢錯誤:', err.message);
            return replyMessage("❌ 查詢時發生錯誤，請稍後再試。");
        }

        if (row) {
            console.log(`⚠️ 商品已追蹤: ${userId} - ${productUrl}`);
            return replyMessage("⚠️ 你已經追蹤過此商品，無需重複添加。");
        }

        // **如果商品不存在，則插入資料**
        db.run(
            'INSERT INTO tracked_products (user_id, product_url) VALUES (?, ?)',
            [userId, productUrl],
            (err) => {
                if (err) {
                    console.error('❌ 追蹤失敗:', err.message);
                    replyMessage("❌ 追蹤商品失敗，請稍後再試。");
                } else {
                    console.log(`✅ 追蹤成功: ${userId} - ${productUrl}`);
                    replyMessage(`✅ 已成功追蹤商品：\n🛒 ${productUrl}`);
                }
            }
        );
    });
}

module.exports = trackProduct;
