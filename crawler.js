const axios = require('axios');
const cheerio = require('cheerio');
const { connectRedis, getLowestPrice, setLowestPrice, closeRedis } = require('./db/redis');
const { updateProduct } = require('./db/mongodb');
const db = require('./db/SQLite3');
// const { pool, connectDB, initializeDB } = require('./db/mysql');
const { sendLineMessage } = require('./notify');

require('dotenv').config();

// 在應用程式啟動時連接 Redis
(async () => {
    await connectRedis();
    await connectDB();
    // await initializeDB();如果沒table會建立
})();

async function fetchTrackedProducts() {
    return new Promise((resolve, reject) => {
        db.all('SELECT user_id, product_url FROM tracked_products', [], (err, rows) => {
            if (err) {
                console.error('❌ 無法查詢 SQLite:', err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// async function fetchTrackedProducts() {
//     try {
//         const [rows] = await pool.query('SELECT product_url FROM tracked_products');
//         return rows.map(row => row.product_url);
//     } catch (error) {
//         console.error('❌ 查詢 MySQL 失敗:', error.message);
//         return [];
//     }
// }

async function scrapeProductData(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const productName = $('.itemName').text().trim();
        const brandName = $('.brandeName a').text().trim();
        const originalPrice = $('.priceBefore').first().text().trim();
        const salePrice = $('.priceAfter').first().text().trim();
        const currentPrice = parseFloat((salePrice || originalPrice).replace(/[^0-9.]/g, '')) || Infinity;

        return {
            productName,
            brandName,
            originalPrice,
            salePrice,
            currentPrice,
            url,
            timestamp: new Date()
        };
    } catch (error) {
        console.error(`❌ 爬取 ${url} 失敗:`, error.message);
        return null;
    }
}

async function checkPriceAndUpdate(url, userIds = []) {
    const productData = await scrapeProductData(url);
    if (!productData) return;

    try {
        const historicalPrice = await getLowestPrice(url) || Infinity;
        const currentPrice = productData.currentPrice;

        if (currentPrice < historicalPrice) {
            console.log(`🔻 價格下降! ${productData.productName} $${historicalPrice} → $${currentPrice}`);

            await setLowestPrice(url, currentPrice);

            await updateProduct(productData);

            for (const userId of userIds) {
                await sendLineMessage(userId, [{
                    type: 'text',
                    text: `📢 ${productData.productName} 價格降至 $${currentPrice} 🎉\n查看商品: ${productData.url}`
                }]);
            }
        } else {
            console.log(`📈 價格未下降: ${productData.productName} 當前 $${currentPrice}, 歷史最低 $${historicalPrice}`);
        }
    } catch (error) {
        console.error(`❌ 檢查價格錯誤 (${url}):`, error);
    }
}

async function checkAllSales() {
    try {
        const trackedProducts = await fetchTrackedProducts();

        if (!trackedProducts || trackedProducts.length === 0) {
            console.log('⚠️ 沒有追蹤的商品');
            return;
        }

        const userMap = trackedProducts.reduce((map, row) => {
            if (!map[row.product_url]) {
                map[row.product_url] = [];
            }
            map[row.product_url].push(row.user_id);
            return map;
        }, {});

        const urls = trackedProducts.map(row => row.product_url);

        for (const url of urls) {
            await checkPriceAndUpdate(url, userMap[url]);
        }

    } catch (error) {
        console.error('❌ 爬取過程中發生錯誤:', error.message);
    } finally {
        console.log("✅ 所有商品價格檢查完畢，準備關閉 Redis 並結束程式");
        await closeRedis(); // **確保 Redis 一定會被關閉**
        process.exit(0);  // **確保程式結束**
    }
}


checkAllSales();
