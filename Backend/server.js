const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

// --- FINAL CORS FIX ---
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
// Jodi tomar aro route thake niche add koro:
// app.use('/api/...', require('./routes/...'));

app.get('/', (req,res) => {
  res.send("API OK - CORS Fixed");
});

const PORT = process.env.PORT || 10000;
const seedInspector = require('./seed');

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log("DB Connected");
  await seedInspector();
  console.log("Inspector Seeded");
  app.listen(PORT, () => console.log("Server running on", PORT));
})
.catch(e => console.log(e));