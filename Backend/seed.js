const User = require('./models/User');
const bcrypt = require('bcryptjs');

const seedInspector = async () => {
  try {
    const hashedPassword = await bcrypt.hash('inspector123', 10);
    
    const inspector = await User.findOneAndUpdate(
      { email: 'inspector@wb.gov.in' },
      {
        name: 'Inspector WB',
        email: 'inspector@wb.gov.in',
        password: hashedPassword,
        role: 'inspector'
      },
      { upsert: true, new: true }
    );
    
    console.log("✅ Inspector ready:", inspector.email);
  } catch (err) {
    console.log("Seed error:", err.message);
  }
};

module.exports = seedInspector;