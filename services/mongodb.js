const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = "price_drop_alert";
const COLLECTION_NAME = "products";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// 測試可否連線
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

async function connectDB() {
    try {
        await client.connect();
        console.log("✅ MongoDB 連線成功");
        return client.db(DB_NAME);
    } catch (error) {
        console.error("❌ MongoDB 連線失敗:", error);
        process.exit(1);
    }
}

async function updateProduct(data) {
    const db = await connectDB();
    const collection = db.collection(COLLECTION_NAME);

    try {
        // 取得目前記錄的最低價
        const product = await collection.findOne({ url: data.url });
        const currentLowest = product?.lowestPrice || Infinity;

        // 確保歷史價格紀錄
        const priceHistoryEntry = {
            price: data.currentPriceValue,
            timestamp: new Date()
        };

        // 如果新的價格低於目前最低價，則更新最低價
        const newLowestPrice = Math.min(currentLowest, data.currentPriceValue);

        await collection.updateOne(
            { url: data.url },
            {
                $set: {
                    productName: data.productName,
                    brandName: data.brandName,
                    currencySymbol: data.currencySymbol,
                    originalPrice: data.originalPriceText,
                    salePrice: data.salePriceText,
                    currentPrice: data.currentPriceValue,
                    lowestPrice: newLowestPrice
                },
                $push: { priceHistory: priceHistoryEntry }  // 存價格變化歷史
            },
            { upsert: true }
        );

        console.log(`✅ 更新 MongoDB: ${data.productName} - $${data.currentPriceValue}, 最低價: $${newLowestPrice}`);

    } catch (error) {
        console.error('❌ 更新 MongoDB 失敗:', error.message);
    }
}

module.exports = {
    connectDB,
    updateProduct
};


// {
//     "_id": ObjectId("..."),
//     "url": "https://example.com/product/123",
//     "productName": "Nike Air Max",
//     "brandName": "Nike",
//     "originalPrice": "$120",
//     "salePrice": "$90",
//     "currentPrice": 100,
//     "lowestPrice": 80,  // 🔥 記錄歷史最低價
//     "priceHistory": [
//       { "price": 120, "timestamp": "2025-02-01T12:00:00Z" },
//       { "price": 100, "timestamp": "2025-02-10T12:00:00Z" },
//       { "price": 80, "timestamp": "2025-02-15T12:00:00Z" },
//       { "price": 100, "timestamp": "2025-02-17T12:00:00Z" }
//     ],
//     "timestamp": ISODate("2025-02-17T12:00:00Z")
//   }
