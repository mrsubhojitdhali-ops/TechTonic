const mongoose = require('mongoose');

const traderSchema = new mongoose.Schema({
  appNo: { type: String, unique: true },
  shop: { type: String, required: true },
  owner: { type: String, required: true },
  name: { type: String }, // owner er jonno fallback
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  
  // Govt Docs - SIH requirement
  address: { type: String },
  district: { type: String, default: 'Kolkata' },
  pin: { type: String },
  mobile: { type: String },
  aadhaar: { type: String },
  pan: { type: String },
  gst: { type: String },
  tradeLicense: { type: String },
  machine: { type: String, default: 'Electronic Scale' },
  capacity: { type: String },

  role: { type: String, default: 'trader' }
}, { timestamps: true });

// AppNo auto generate - LM2026XXXX style
traderSchema.pre('save', function(next){
  if(!this.appNo){
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random()*9000);
    this.appNo = `LM${year}${rand}`;
  }
  if(!this.name) this.name = this.owner;
  next();
});

module.exports = mongoose.model('Trader', traderSchema);