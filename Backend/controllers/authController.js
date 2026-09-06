const jwt = require('jsonwebtoken');
const User = require('../models/User');

const genToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET || 'techtonic_secret_v8', { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: "All fields required" });

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const user = await User.create({ 
      name, 
      email: email.toLowerCase().trim(), 
      password, 
      role: 'trader' 
    });

    const token = genToken(user);
    // FRONTEND token expect kore, tai token pathate hobe
    res.status(201).json({ token, role: user.role, name: user.name, email: user.email });
  } catch (err) {
    console.log("REGISTER ERROR:", err.message);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase().trim();
    
    // Inspector auto create - mam er architecture onujayi
    if(email === 'inspector@wb.gov.in'){
      let inspector = await User.findOne({ email });
      if(!inspector){
        inspector = await User.create({ name:'Inspector WB', email, password:'Inspector@123', role:'inspector' });
      }
      const token = genToken(inspector);
      return res.json({ token, role: inspector.role, name: inspector.name, email: inspector.email });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid password' });

    const token = genToken(user);
    res.json({ token, role: user.role, name: user.name, email: user.email });
  } catch (err) {
    console.log("LOGIN ERROR:", err.message);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
};