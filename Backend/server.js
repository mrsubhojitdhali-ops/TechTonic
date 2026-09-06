const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

// --- CORS FIX - EKDOM PROTHOME ---
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
// --- CORS END ---

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req,res) => res.send("API OK - CORS Fixed"));

const PORT = process.env.PORT || 10000;
const seedInspector = require('./seed');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("DB Connected");
  await seedInspector();
  app.listen(PORT, () => console.log("Server on", PORT));
}).catch(e => console.log(e));