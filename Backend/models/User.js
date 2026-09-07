const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['trader', 'inspector', 'admin'], default: 'trader' },
  aadhaar: { type: String, trim: true },
  pan: { type: String, trim: true, uppercase: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);