const User = require('../models/User');

const seedInspector = async () => {
  try {
    const user = await User.findOneAndUpdate(
      { email: 'inspector@wb.gov.in' },
      {
        name: 'Inspector WB',
        email: 'inspector@wb.gov.in',
        password: 'inspector123', // plain debo, model nije hash korbe
        role: 'inspector'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log("✅ Inspector ready:", user.email);
  } catch (err) {
    console.log("Seed error:", err.message);
  }
};

module.exports = seedInspector;