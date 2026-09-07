const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URL || process.env.MONGO_URI;
    
    if (!uri) {
      console.log("❌ MONGO_URL missing in .env");
      return;
    }
    
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB Error: ${err.message}`);
    console.log("Hotspot ON kor, WiFi te querySrv block hoy");
  }
};

module.exports = connectDB;