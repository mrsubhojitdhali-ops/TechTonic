const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();

app.use(cors({
  origin: "https://tech-tonic-nine.vercel.app",
  credentials: true
}));
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.get('/', (req,res) => res.send("API OK - CORS Fixed"));

const PORT = process.env.PORT || 10000;
const seedInspector = require('./seed');
mongoose.connect(process.env.MONGO_URI).then(async()=>{
  console.log("DB Connected");
  await seedInspector();
  app.listen(PORT, ()=>console.log("Server on", PORT));
}).catch(e=>console.log(e));