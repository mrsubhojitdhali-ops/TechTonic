const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
dotenv.config();
const app = express();

app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin","https://tech-tonic-nine.vercel.app");
  res.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers","Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials","true");
  if(req.method==="OPTIONS") return res.sendStatus(200);
  next();
});
app.use(cors({origin:"https://tech-tonic-nine.vercel.app",credentials:true}));
app.use(express.json());

app.get('/', (req,res)=>res.send("Live V5 FINAL"));
app.use('/api/auth', require('./routes/authRoutes'));

app.get('/fix-inspector', async (req,res)=>{
  try{
    const User = require('./models/User');
    const hash = await bcrypt.hash("Inspector@123", 10);
    await User.updateOne({email:"inspector@wb.gov.in"}, {name:"Inspector",email:"inspector@wb.gov.in",password:hash,role:"inspector"}, {upsert:true});
    res.send("FIXED V5 - Now login will work");
  }catch(e){ res.status(500).send(e.message); }
});

mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log("DB V5 Live");
  app.listen(process.env.PORT||10000, ()=>console.log("Live V5 FINAL"));
});