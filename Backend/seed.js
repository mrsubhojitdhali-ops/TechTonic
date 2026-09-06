require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
async function seed(){
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteOne({email:'inspector@wb.gov.in'});
  const hash = await bcrypt.hash('Inspector@123',10);
  await User.create({name:'Inspector WB', email:'inspector@wb.gov.in', password:hash, role:'inspector'});
  console.log('✅ INSPECTOR CREATED');
  process.exit();
}
seed();