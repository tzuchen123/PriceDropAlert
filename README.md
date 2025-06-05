# 📉 Price Drop Alert

本專案是一個價格追蹤系統，定期爬取特定商品的價格，當價格下降時會發送通知給使用者。目前支援 **SQLite3、MongoDB、Redis** 來儲存數據，並使用 **LINE Message API** 來發送通知。

---

## 技術棧

- **前端**：Line 官方帳號
- **後端**：Node.js、Express.js、Socket.IO、MongoDB、SQLite3、Redis、爬蟲、LINE Message API 

---

##  功能特色

- 支援多個電商網站的商品價格追蹤
- 自動比對歷史最低價，價格下降時即時通知
- LINE Bot 查詢與控制介面
- Redis 快取歷史最低價
- MongoDB 記錄完整價格變化歷史
- Puppeteer / Axios 動態與靜態爬蟲混合策略

---

## 專案結構

```

├── handlers/
│   └── lineBot.js            # LINE Bot 訊息接收與指令分流
│
├── services/
│   ├── redis.js              # Redis 操作模組，儲存與查詢歷史最低價
│   ├── mongodb.js            # MongoDB 操作模組，記錄商品資料與價格歷史
│   ├── mysql.js              # MySQL 操作模組（可選）
│   ├── SQLite3.js            # SQLite 操作模組（預設使用）
│   ├── notify.js             # 封裝 LINE 推播訊息功能
│   └── sites.js              # 各網站商品選擇器與爬蟲設定
│
├── track.js                  # 處理「追蹤商品」指令，儲存商品網址至資料庫
├── untrack.js                # 處理「取消追蹤」指令，從資料庫刪除紀錄
├── list.js                   # 處理「查看追蹤」指令，回傳所有追蹤商品清單
├── productInfo.js            # 處理「查詢價格」指令，整合 MongoDB 與 Redis 資訊
│
├── crawler.js                # 主爬蟲邏輯，定時檢查商品價格與推播通知
├── server.js                 # Express 伺服器，接收 LINE webhook
│
├── .env                      # 環境變數設定（LINE token, DB 連線等）
└── package.json              # 專案相依套件與啟動指令

```

---

## 安裝與執行

```bash
git clone https://github.com/your-repo/price-drop-alert.git
cd price-drop-alert
npm install
node server.js
```

---


