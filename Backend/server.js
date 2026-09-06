require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();

// CORS
app.use(cors({
  origin: ["https://tech-tonic-nine.vercel.app", "http://localhost:5173"],
  credentials: true
}));
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send("TechTonic V8 LIVE - OK");
});

// Fix Inspector - Local er jonno
app.get('/fix-inspector', async (req, res) => {
  try {
    const User = require('./models/User');
    await User.deleteMany({ email: "inspector@wb.gov.in" });
    // Model nijei hash korbe, tai plain password dilam - double hash hobe na
    await User.create({
      name: "Inspector",
      email: "inspector@wb.gov.in",
      password: "Inspector@123",
      role: "inspector"
    });
    res.send("FIXED - inspector@wb.gov.in / Inspector@123");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Main Routes
app.use('/api/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 5000;

// Age DB connect, tarpor server start - etai sothik niyom
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB V8 Live");
    app.listen(PORT, () => console.log(`V8 listening on ${PORT}`));
  })
  .catch(e => console.log("DB ERROR " + e.message));