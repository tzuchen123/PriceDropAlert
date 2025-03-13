const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const { getSiteConfig } = require('./services/sites');
const { connectRedis, getLowestPrice, setLowestPrice, closeRedis } = require('./services/redis');
const { updateProduct } = require('./services/mongodb');
const db = require('./services/SQLite3');
// const { pool, connectDB, initializeDB } = require('./db/mysql');
const { sendLineMessage } = require('./services/notify');

require('dotenv').config();

// 在應用程式啟動時連接 Redis
(async () => {
    await connectRedis();
    // await connectDB();
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

async function fetchWithAxios(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
                "Accept-Encoding": "gzip, deflate, br"
            },
            timeout: 10000
        });

        if (!response.data || response.data.length === 0) {
            throw new Error("Axios 返回空內容");
        }

        return response.data;
    } catch (error) {
        console.error(`❌ Axios 爬取失敗 (${url}):`, error.message);
        return null;
    }
}

async function fetchWithPuppeteer(url) {
    try {

        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36");

        await page.goto(url, { waitUntil: 'networkidle2' });

        const html = await page.content();
        await browser.close();

        if (!html || html.length === 0) {
            throw new Error("Puppeteer 返回空內容");
        }

        return html;
    } catch (error) {
        console.error(`❌ Puppeteer 爬取失敗 (${url}):`, error.message);
        return null;
    }
}

async function scrapeProductData(url) {
    try {
        const siteConfig = getSiteConfig(url);
        if (!siteConfig) {
            console.error(`❌ 未找到適用於該網址的爬取規則: ${url}`);
            return null;
        }

        let html;
        if (siteConfig.crawler === "axios") {
            html = await fetchWithAxios(url);
        } else if (siteConfig.crawler === "puppeteer") {
            html = await fetchWithPuppeteer(url);
        } else {
            console.error(`❌ 未知的爬取方式: ${siteConfig.crawler}`);
            return null;
        }

        if (!html) {
            console.error(`❌ 無法從 ${url} 取得有效 HTML`);
            return null;
        }

        const $ = cheerio.load(html);

        const productName = $(siteConfig.selectors.product_name).text().trim() || "N/A";
        const brandName = siteConfig.selectors.brand_name ? $(siteConfig.selectors.brand_name).text().trim() : "N/A";

        let originalPriceText = $(siteConfig.selectors.original_price).first().text().trim();
        let salePriceText = siteConfig.selectors.sale_price ? $(siteConfig.selectors.sale_price).first().text().trim() : "";
        let normalPriceText = siteConfig.selectors.normal_price ? $(siteConfig.selectors.normal_price).first().text().trim() : "";

        const priceText = normalPriceText || salePriceText || originalPriceText;

        // 取出幣別
        const currencyMatch = priceText.match(/^[^\d\s]+/);
        const currencySymbol = currencyMatch ? currencyMatch[0] : '';

        // 價格數值處理（確保不是 NaN）
        const priceNumber = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        const currentPriceValue = isNaN(priceNumber) ? Infinity : priceNumber;

        return {
            productName,
            brandName,
            originalPriceText,
            salePriceText,
            normalPriceText,
            currencySymbol,
            currentPriceValue,
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
        const currentPrice = productData.currentPriceValue;

        if (currentPrice < historicalPrice) {
            console.log(`🔻 價格下降! ${productData.productName} $${historicalPrice} → $${currentPrice}`);

            await setLowestPrice(url, currentPrice);

            await updateProduct(productData);

            for (const userId of userIds) {
                await sendLineMessage(userId, [{
                    type: 'text',
                    text: `📢 ${productData.productName} 價格降至 ${productData.currencySymbol}${currentPrice} 🎉\n查看商品: ${productData.url}`
                }]);
            }
        } else {
            console.log(`📈 價格未下降: ${productData.productName} 當前 ${productData.currencySymbol}${currentPrice}, 歷史最低 ${productData.currencySymbol}${historicalPrice}`);
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
