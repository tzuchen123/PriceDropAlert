const cron = require('node-cron');
const { exec } = require('child_process');

console.log('設定每日 12:00 執行爬蟲和通知...');

cron.schedule('0 15 * * *', () => {
    console.log('開始爬取衣服特價...');
    exec('node crawler.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`執行 crawler.js 失敗: ${error.message}`);
            return;
        }
        console.log(stdout);

        console.log('檢查是否需要發送 LINE 通知...');
        exec('node notify.js', (error, stdout, stderr) => {
            if (error) {
                console.error(`執行 notify.js 失敗: ${error.message}`);
                return;
            }
            console.log(stdout);
        });
    });
});
