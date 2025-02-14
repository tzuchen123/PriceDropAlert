const axios = require('axios');

require('dotenv').config();

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

async function sendLineMessage(userId, messages) {
    try {
        await axios.post('https://api.line.me/v2/bot/message/push', {
            to: userId,
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

module.exports = { sendLineMessage };
