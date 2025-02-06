const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
require('dotenv').config();

const URL = process.env.TARGET_URL;

async function checkSales() {
    try {
        const { data } = await axios.get(URL);
        const $ = cheerio.load(data);

        let saleItems = [];

        // 解析商品資訊
        const productName = $('.itemName').text().trim(); // 商品名稱
        const brandName = $('.brandeName a').text().trim(); // 品牌名稱
        const originalPrice = $('.priceBefore').first().text().trim(); // 只取第一個原價
        const salePrice = $('.priceAfter').first().text().trim(); // 只取第一個特價

        // 獲取商品顏色與庫存狀態
        $('.multiVariation__wrap').each((index, element) => {
            const color = $(element).find('.multiVariation__color').first().text().trim();
            const size = $(element).find('.multiVariation__size').text().trim();
            const stockStatus = $(element).find('.soldout_stock').text().trim() || '有貨';

            saleItems.push({
                productName,
                brandName,
                originalPrice,
                salePrice,
                color,
                size,
                stockStatus
            });
        });

        // 儲存結果
        fs.writeFileSync('data.json', JSON.stringify(saleItems, null, 2));
        console.log('爬取完成，已儲存特價資訊');
    } catch (error) {
        console.error('爬取失敗:', error.message);
    }
}

// 執行爬蟲
checkSales();
