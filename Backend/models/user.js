const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['trader', 'inspector'], default: 'trader' }
}, { timestamps: true });

// Save er age hash
userSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Login er somoy compare
userSchema.methods.comparePassword = function(entered){
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);