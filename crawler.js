const axios = require('axios');
const cheerio = require('cheerio');
const { connectRedis, getLowestPrice, setLowestPrice } = require('./db/redis');
const { updateProduct } = require('./db/mongodb');
const db = require('./db/SQLite3');

require('dotenv').config();

// 在應用程式啟動時連接 Redis
(async () => {
    await connectRedis();
})();

async function fetchTrackedProducts() {
    return new Promise((resolve, reject) => {
        db.all('SELECT product_url FROM tracked_products', [], (err, rows) => {
            if (err) {
                console.error('❌ 無法查詢 SQLite:', err.message);
                reject(err);
            } else {
                resolve(rows.map(row => row.product_url));
            }
        });
    });
}

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

async function checkPriceAndUpdate(url) {
    const productData = await scrapeProductData(url);
    console.log(productData);
    if (!productData) return;

    try {
        const historicalPrice = await getLowestPrice(url) || Infinity;
        const currentPrice = productData.currentPrice;

        if (currentPrice < historicalPrice) {
            console.log(`🔻 價格下降! ${productData.productName} $${historicalPrice} → $${currentPrice}`);

            // **更新 Redis 最低價**
            await setLowestPrice(url, currentPrice);

            // **更新 MongoDB**
            await updateProduct(productData);

            // **通知使用者**
            notifyUser(productData);
        } else {
            console.log(`📈 價格未下降: ${productData.productName} 當前 $${currentPrice}, 歷史最低 $${historicalPrice}`);
        }
    } catch (error) {
        console.error(`❌ 檢查價格錯誤 (${url}):`, error);
    }
}

async function notifyUser(productData) {
    console.log(`📢 發送通知: ${productData.productName} 價格降至 $${productData.currentPrice} 🎉`);
    // 這裡可以加上 Email、LINE、Telegram 或 Webhook API 來通知使用者
}

async function checkAllSales() {
    try {
        const urls = await fetchTrackedProducts();
        if (!urls || urls.length === 0) {
            console.log('⚠️ 沒有追蹤的商品');
            return;
        }

        for (const url of urls) {
            await checkPriceAndUpdate(url);
        }
    } catch (error) {
        console.error('❌ 爬取過程中發生錯誤:', error.message);
    }
}

checkAllSales();
