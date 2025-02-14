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
        await collection.updateOne(
            { url: data.url },  // 用 URL 作為識別
            { $set: data },  // 更新商品資訊
            { upsert: true }  // 如果商品不存在則插入
        );
        console.log(`✅ 更新 MongoDB: ${data.productName} - $${data.currentPrice}`);
    } catch (error) {
        console.error('❌ 更新 MongoDB 失敗:', error.message);
    }
}

module.exports = {
    connectDB,
    updateProduct
};
