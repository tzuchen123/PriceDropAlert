const axios = require('axios');
const trackProduct = require('./track');
const untrackProduct = require('./untrack');
const listTrackedProducts = require('./list');
const getProductInfo = require('./productInfo');

require('dotenv').config();
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

// 分析 LINE 訊息
function handleMessage(event) {
    const userId = event.source ? event.source.userId : null;
    const messageText = event.message.text;

    console.log('👤 使用者 ID:', userId || '❌ 找不到 userId');
    console.log('📩 使用者訊息:', messageText);

    // 定義回覆方法
    const replyMessage = (text) => sendReply(event.replyToken, text);

    // **指令處理**
    if (messageText.startsWith("追蹤商品")) {
        trackProduct(userId, messageText, replyMessage);
    } else if (messageText.startsWith("取消追蹤")) {
        untrackProduct(userId, messageText, replyMessage);
    } else if (messageText === "查看追蹤") {
        listTrackedProducts(userId, replyMessage);
    } else if (messageText.startsWith("查詢價格")) {
        const match = messageText.match(/(https?:\/\/[^\s]+)/);
        const productUrl = match ? match[1] : null;

        if (!productUrl) {
            return replyMessage("❌ 請提供商品網址，例如：\n查詢價格 [商品網址]");
        }

        getProductInfo(productUrl, replyMessage);
    } else if (messageText === "查看所有功能") {
        const message = `可用功能：
        - 追蹤商品 [網址]
        - 取消追蹤商品 [網址]
        - 查看追蹤
        - 查詢價格 [網址]`;

        replyMessage(message);
    }
}

// 發送 LINE 訊息
async function sendReply(replyToken, text) {
    await axios.post('https://api.line.me/v2/bot/message/reply', {
        replyToken,
        messages: [{ type: 'text', text }]
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
        }
    });
}

module.exports = { handleMessage };
