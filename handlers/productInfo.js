const { getLowestPrice, connectRedis, closeRedis } = require('../db/redis'); // 讀取歷史最低價
const { connectDB } = require('../db/mongodb'); // 讀取 MongoDB 內最新價格

async function getProductInfo(productUrl, replyMessage) {
    try {
        const db = await connectDB();
        const collection = db.collection("products");

        // **從 MongoDB 取得當前價格**
        const product = await collection.findOne({ url: productUrl });

        if (!product) {
            return replyMessage("❌ 沒有找到此商品，請確認網址是否正確。");
        }

        // **從 Redis 取得歷史最低價**
        await connectRedis();
        const lowestPrice = await getLowestPrice(productUrl) || "無記錄";
        await closeRedis();

        // **回應使用者**
        replyMessage(`🛒 商品資訊：
📌 名稱: ${product.productName}
💰 當前價格: $${product.currentPrice}
📉 歷史最低價: $${lowestPrice}
🔗 連結: ${productUrl}`);
    } catch (error) {
        console.error('❌ 查詢商品資訊錯誤:', error);
        replyMessage("❌ 查詢商品價格時發生錯誤，請稍後再試。");
    }
}

module.exports = getProductInfo;
