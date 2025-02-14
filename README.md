# PriceDropAlert

## code
### 定時
每日定時爬蟲一次
### 爬蟲
爬sql資料庫的追蹤商品
### 通知
使用Messaging API，當歷史最低價時通知使用者

### server
express框架，用來與使用者互動，功能如下
- 追蹤商品 [網址] 
- 取消追蹤商品 [網址]
- 查看追蹤
- 查詢價格 [網址]

## db
紀錄
- 使用者line id : 追蹤商品網址(sql)
- 追蹤商品網址的詳細資訊(mongodb)
- 歷史價格(redis)

### Redis
存追蹤商品歷史最低價

最佳做法是：
1.在應用程式(爬蟲)啟動時 建立 Redis 連線，並讓連線持續存在。
2.不要在每次查詢時才檢查是否已連線，這樣可以避免重複連接。
3.應用程式結束時（SIGINT）關閉 Redis 連線，確保資源釋放。

### MongoDB
紀錄衣服資訊

### SQLite/mysql
記錄使用者追蹤的商品，如果自己用的話用SQLite簡單方便，多人使用的話推薦mysql

## ci/cd

### free

### payment

