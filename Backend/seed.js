const User = require('./models/user'); // <- choto hater, etai fix

const seedInspector = async () => {
  try {
    let user = await User.findOne({ email: 'inspector@wb.gov.in' });
    if (user) {
      user.password = 'Inspector@123';
      user.role = 'inspector';
      await user.save();
      console.log("✅ Inspector updated with Inspector@123");
    } else {
      await User.create({
        name: 'Inspector WB',
        email: 'inspector@wb.gov.in',
        password: 'Inspector@123',
        role: 'inspector'
      });
      console.log("✅ Inspector seeded with Inspector@123");
    }
  } catch (err) {
    console.log("Seed error:", err.message);
  }
};

module.exports = seedInspector;