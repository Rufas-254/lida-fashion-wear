const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Admin authentication middleware.
 * Uses a separate JWT_ADMIN_SECRET to verify admin tokens.
 * Attaches `req.admin` on success.
 */
const adminProtect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Admin not authorized — no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-password');

    if (!req.admin) {
      return res.status(401).json({ message: 'Admin not authorized — account not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Admin not authorized — invalid or expired token' });
  }
};

module.exports = { adminProtect };
