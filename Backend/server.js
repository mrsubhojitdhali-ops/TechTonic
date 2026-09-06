const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
dotenv.config();
const app = express();

app.use(cors({origin:["https://tech-tonic-nine.vercel.app","http://localhost:5173"],credentials:true}));
app.use(express.json());

// IMPORTANT - Route gulo sobar age
app.get('/', (req,res)=>res.send("TechTonic V8 LIVE - OK"));
app.get('/fix-inspector', async (req,res)=>{
  try{
    const User = require('./models/User');
    const hash = await bcrypt.hash("Inspector@123", 10);
    await User.updateOne({email:"inspector@wb.gov.in"}, {name:"Inspector",email:"inspector@wb.gov.in",password:hash,role:"inspector"}, {upsert:true});
    res.send("FIXED V8 - inspector@wb.gov.in / Inspector@123");
  }catch(e){ res.status(500).send(e.message); }
});

app.use('/api/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=>console.log("V8 listening on "+PORT));

mongoose.connect(process.env.MONGO_URI).then(()=>console.log("DB V8 Live")).catch(e=>console.log("DB ERROR "+e.message));