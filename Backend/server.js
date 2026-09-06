const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();

// *** EI PART TA SOBAR AGE LAGBE - ETI NA THAKLEI CORS FAIL ***
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

app.use('/api/auth', require('./routes/authRoutes'));
app.get('/', (req,res)=>res.send("CORS FIXED V3 - FINAL"));

const bcrypt = require('bcryptjs');
const User = require('./models/User');
const seed = async()=>{
  const hash = await bcrypt.hash("Inspector@123",10);
  let u = await User.findOne({email:"inspector@wb.gov.in"});
  if(u){u.password=hash; u.role="inspector"; await u.save(); console.log("Inspector updated V3");}
  else{await User.create({name:"Inspector",email:"inspector@wb.gov.in",password:hash,role:"inspector"}); console.log("Inspector created V3");}
};

mongoose.connect(process.env.MONGO_URI).then(async()=>{
  console.log("DB Connected V3");
  await seed();
  console.log("Live with CORS Fixed V3");
  app.listen(process.env.PORT||10000,()=>console.log("Server V3"));
}).catch(e=>console.log(e));