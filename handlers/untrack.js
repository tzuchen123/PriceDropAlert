const db = require('../services/SQLite3');

function untrackProduct(userId, messageText, replyMessage) {
    const match = messageText.match(/(https?:\/\/[^\s]+)/);
    const productUrl = match ? match[1] : null;

    if (!productUrl) {
        return replyMessage("❌ 未偵測到有效的網址，請使用：\n取消追蹤 [網址]");
    }

    db.run(
        'DELETE FROM tracked_products WHERE user_id = ? AND product_url = ?',
        [userId, productUrl],
        (err) => {
            if (err) {
                console.error('❌ 取消追蹤失敗:', err.message);
                replyMessage("❌ 取消追蹤失敗，請稍後再試。");
            } else {
                console.log(`✅ 取消追蹤成功: ${userId} - ${productUrl}`);
                replyMessage(`✅ 已成功取消追蹤：\n${productUrl}`);
            }
        }
    );
}

module.exports = untrackProduct;
