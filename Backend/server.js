const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.get('/', (_req, res) => res.json({ ok: true, service: 'TechTonic Legal Metrology API' }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/instruments', require('./routes/instrumentRoutes'));
app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ msg: 'Server error' }); });

const MONGO_URL = process.env.MONGO_URI;
if (!MONGO_URL) { console.error('❌ MONGO_URI missing in Backend/.env'); process.exit(1); }

mongoose.connect(MONGO_URL, { serverSelectionTimeoutMS: 10000 })
  .then(async () => {
    console.log('✅ MongoDB Connected');
    // Create the demo inspector as a real MongoDB user so approvedBy is an ObjectId.
    const email = 'inspector@wb.gov.in';
    const existing = await User.findOne({ email });
    if (!existing) {
      await User.create({ name: 'WB Inspector', email, password: await bcrypt.hash('Inspector@123', 10), role: 'inspector' });
      console.log('✅ Demo inspector created: inspector@wb.gov.in');
    }
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
  })
  .catch(err => { console.error('❌ MongoDB Error:', err.message); process.exit(1); });

 