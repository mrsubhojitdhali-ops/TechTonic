const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const seedInspector = require('./seed');

dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "https://techtonic-final.vercel.app", "https://techtonic-final.onrender.com"],
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/instruments', require('./routes/instrumentRoutes'));

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected");
    await seedInspector();
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  } catch (err) {
    console.log("Server start error:", err);
  }
};

startServer();