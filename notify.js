const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_USER_ID = process.env.LINE_USER_ID;

async function sendLineMessage(messages) {
    try {
        await axios.post('https://api.line.me/v2/bot/message/push', {
            to: LINE_USER_ID,
            messages: messages
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
            }
        });
        console.log('已發送 LINE 訊息');
    } catch (error) {
        console.error('發送 LINE 訊息失敗:', error.response ? error.response.data : error.message);
    }
}

function notifySaleItems() {
    if (!fs.existsSync('data.json')) {
        console.log('沒有特價資訊，跳過通知');
        return;
    }

    const saleItems = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
    if (saleItems.length > 0) {
        let messages = [];

        saleItems.forEach(item => {
            messages.push({
                type: 'text',
                text: `商品名稱: ${item.productName} (${item.brandName})\n顏色: ${item.color} | 尺寸: ${item.size}\n原價: $${item.originalPrice} ➡️ 特價: $${item.salePrice}\n庫存狀態: ${item.stockStatus}`
            });

            // LINE 一次最多發 5 條訊息，超過 5 條時就先發送
            if (messages.length === 5) {
                sendLineMessage(messages);
                messages = []; // 清空已發送的訊息
            }
        });

        // 發送剩下的訊息
        if (messages.length > 0) {
            sendLineMessage(messages);
        }
    } else {
        console.log('沒有新歷史最低價，不發送通知');
    }
}

// 執行通知
notifySaleItems();
