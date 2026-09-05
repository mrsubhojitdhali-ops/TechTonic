const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['trader', 'inspector', 'admin'], default: 'trader' }
}, { timestamps: true });

// FIXED: next tule dilam, notun Mongoose e lagena
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function(pass){
  return bcrypt.compare(pass, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);