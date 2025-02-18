# 📉 Price Drop Alert

本專案是一個價格追蹤系統，定期爬取特定商品的價格，當價格下降時會發送通知給使用者。目前支援 **SQLite3、MongoDB、Redis** 來儲存數據，並使用 **LINE Message API** 來發送通知。

## 🏗 專案架構

- **`crawler.js`**：負責爬取商品價格並更新數據庫
- **`notify.js`**：當商品價格下降時發送通知
- **`server.js`**：提供 API，處理 LINE Bot 互動
- **資料庫**
  - SQLite3 (儲存追蹤的商品)
  - MongoDB (儲存商品歷史價格)
  - Redis (快取歷史最低價)

## 🛠 技術棧

- Node.js
- Express.js
- MongoDB
- SQLite3
- Redis
- Cheerio (網頁爬取)
- CRON（伺服器排程）
- LINE Message API (訊息推播)

## 🚀 安裝與運行

### 1️⃣ 下載專案

```bash
git clone https://github.com/your-repo/price-drop-alert.git
cd price-drop-alert
```

### 2️⃣ 安裝套件

```bash
npm install
```

### 3️⃣ 設定環境變數

建立 `.env` 檔案，填入以下內容：

```
MONGO_URI=mongodb+srv://your_mongo_connection_string
REDIS_HOST=localhost
REDIS_PORT=6379
LINE_CHANNEL_ACCESS_TOKEN=your_line_bot_token
```

### 4️⃣ 設定伺服器的 CRON 排程

請使用 Linux 伺服器的 `cron` 來定時執行爬蟲與通知：

```bash
crontab -e
```

加入以下排程設定，每天 12:00 PM 執行爬蟲與通知：

```
0 12 * * * /usr/bin/node /path/to/project/crawler.js
```

### 5️⃣ 運行 API 伺服器

```bash
node server.js
```

## 🔍 主要功能

### 1️⃣ 追蹤商品
- 使用 SQLite3 儲存追蹤的商品 URL

### 2️⃣ 爬取商品價格
- 透過 `crawler.js` 使用 **axios + cheerio** 爬取商品頁面資訊
- 解析商品名稱、品牌、原價、特價

### 3️⃣ 儲存與比對價格
- 最新價格存入 **MongoDB**
- 歷史最低價快取於 **Redis**
- 如果新價格低於歷史最低價，則更新 **Redis** 並發送通知

### 4️⃣ LINE 通知
- 使用 `notify.js` 透過 **LINE Bot API** 發送價格下降通知

## 🖥 API 介面

| 方法  | 路徑   | 描述  |
|------|------|------|
| GET  | `/`  | 伺服器健康檢查 |
| POST | `/`  | 接收 LINE Webhook 事件 |

## 📌 未來改進
- ✅ 支援更多電商網站爬取
- ✅ 進一步優化 Redis 快取策略
- ✅ 透過 Web 界面管理追蹤的商品

---


