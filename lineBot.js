const axios = require('axios');
const trackProduct = require('./handlers/track');
const untrackProduct = require('./handlers/untrack');
const listTrackedProducts = require('./handlers/list');

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

    // 指令處理
    if (messageText.startsWith("追蹤商品")) {
        trackProduct(userId, messageText, replyMessage);
    } else if (messageText.startsWith("取消追蹤")) {
        untrackProduct(userId, messageText, replyMessage);
    } else if (messageText === "查看追蹤") {
        listTrackedProducts(userId, replyMessage);
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
