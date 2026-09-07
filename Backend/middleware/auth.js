const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const header = req.header('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ msg: 'Authentication required' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'change-this-secret');
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token invalid or expired' });
  }
};
