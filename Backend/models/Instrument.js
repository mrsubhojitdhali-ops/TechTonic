const mongoose = require('mongoose');

const instrumentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  trader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User chilo
  
  // Optional details
  capacity: { type: String },
  model: { type: String },
  serialNo: { type: String },
  
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  certId: { type: String, unique: true, sparse: true },
  signedHash: { type: String },
  qrData: { type: String },
  qrCode: { type: String }, // eta add korlam, nahole QR image save hobe na
  expiryDate: { type: Date },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Instrument', instrumentSchema);