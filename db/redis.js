const redis = require('redis');
require('dotenv').config();

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

// **在應用啟動時建立 Redis 連線**
const redisClient = redis.createClient({
    socket: {
        host: REDIS_HOST,
        port: REDIS_PORT
    }
});

// **監聽 Redis 錯誤**
redisClient.on('error', (err) => console.error('❌ Redis 連線錯誤:', err));

// **在應用啟動時連線 Redis**
async function connectRedis() {
    if (!redisClient.isOpen) {
        console.log("ℹ️ 連接 Redis...");
        await redisClient.connect();
        console.log("✅ Redis 連線成功");
    }
}

// **取得歷史最低價**
async function getLowestPrice(productUrl) {
    try {
        const price = await redisClient.get(`lowest_price:${productUrl}`);
        return price ? parseFloat(price) : null;
    } catch (err) {
        console.error(`❌ Redis 讀取錯誤 (${productUrl}):`, err);
        return null;
    }
}

// **更新歷史最低價**
async function setLowestPrice(productUrl, price) {
    try {
        await redisClient.set(`lowest_price:${productUrl}`, price);
        console.log(`✅ Redis 更新成功: ${productUrl} 新的最低價 $${price}`);
    } catch (err) {
        console.error(`❌ Redis 更新失敗 (${productUrl}):`, err);
    }
}

// **當應用程式結束時關閉 Redis 連線**
async function closeRedis() {
    if (redisClient.isOpen) {
        console.log("🔌 關閉 Redis 連線...");
        await redisClient.quit();
        console.log("✅ Redis 連線已關閉");
    }
}

// **監聽應用結束事件**
process.on('SIGINT', async () => {
    await closeRedis();
    process.exit(0);
});

// **導出模組**
module.exports = {
    redisClient,
    connectRedis,
    getLowestPrice,
    setLowestPrice,
    closeRedis
};
