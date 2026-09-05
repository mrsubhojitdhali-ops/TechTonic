const User = require('./models/user');

const seedInspector = async () => {
  const exists = await User.findOne({ email: 'inspector@wb.gov.in' });
  if (exists) {
    console.log("✅ Inspector already exists");
    return;
  }
  await User.create({
    name: 'Inspector WB',
    email: 'inspector@wb.gov.in',
    password: 'inspector@123',
    role: 'inspector'
  });
  console.log("✅ Inspector seeded");
};

module.exports = seedInspector;