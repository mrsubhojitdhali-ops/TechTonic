const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// 1. CORS - DEMO ER JONNO SOB ALLOW (kal judge er samne atkabe na)
app.use(cors({
  origin: true,
  credentials: true
}));
app.options('*', cors({
  origin: true,
  credentials: true
}));

// 2. Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trader', require('./routes/traderRoutes'));
app.use('/api/inspector', require('./routes/inspectorRoutes'));

// 4. Test route
app.get('/', (req, res) => {
  res.send('TechTonic API Running - CORS OK');
});

// 5. DB Connect + Seed + Start
const PORT = process.env.PORT || 5000;
const seedInspector = require('./seed');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");
    await seedInspector();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log("DB Error:", err.message);
  });