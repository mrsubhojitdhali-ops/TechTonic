const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.log("MONGO_URI missing in .env");
      process.exit(1);
    }
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB Error: ${err.message}`);
    // process.exit korbo na, jate server crash na kore, error dekhte pabi
    console.log("Check: 1. Atlas IP whitelist 0.0.0.0/0, 2. Password e @ ache kina");
  }
};

module.exports = connectDB;