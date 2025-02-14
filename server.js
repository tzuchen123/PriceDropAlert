const express = require('express');
const bodyParser = require('body-parser');
const { handleMessage } = require('./handlers/lineBot');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.get('/', async (req, res) => {
    res.sendStatus(200);
});

app.post('/', (req, res) => {
    const events = req.body.events;
    events.forEach(event => {
        if (event.type === 'message' && event.message.type === 'text') {
            handleMessage(event);
        }
    });
    res.sendStatus(200);
});

// 啟動伺服器
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ 伺服器運行中: http://0.0.0.0:${PORT}`);
});
