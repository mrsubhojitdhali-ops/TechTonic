const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secret = () => process.env.JWT_SECRET || 'change-this-secret';
const genToken = (user) => jwt.sign({ id: user._id.toString(), role: user.role }, secret(), { expiresIn: '7d' });

const cleanEmail = (email = '') => String(email).trim().toLowerCase();

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email || !password) return res.status(400).json({ msg: 'Name, email and password are required' });
    if (password.length < 6) return res.status(400).json({ msg: 'Password must be at least 6 characters' });

    const normalizedEmail = cleanEmail(email);
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(409).json({ msg: 'User already exists. Please login.' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hashed, role: 'trader' });
    res.status(201).json({ token: genToken(user), role: user.role, name: user.name, email: user.email, userId: user._id });
  } catch (err) {
    console.error('Register error:', err);
    if (err.code === 11000) return res.status(409).json({ msg: 'Email already registered' });
    res.status(500).json({ msg: 'Registration failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: 'Email and password are required' });

    const user = await User.findOne({ email: cleanEmail(email) });
    if (!user) return res.status(401).json({ msg: 'Invalid email or password' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid email or password' });

    res.json({ token: genToken(user), role: user.role, name: user.name, email: user.email, userId: user._id });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Login failed', error: err.message });
  }
};
