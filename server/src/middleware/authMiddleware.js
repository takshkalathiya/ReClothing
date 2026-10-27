const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check HTTP-only cookie first (preferred), then Authorization Bearer header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Please log in to access this resource.',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'reclothing_campus_super_secure_jwt_secret_key_2026_xyz'
    );

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session. Please log in again.',
    });
  }
};

// Admin authorization guard
const adminOnly = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === 'admin' ||
      req.user.email?.toLowerCase() === 'sanskarbhanderi08@gmail.com')
  ) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied: Platform Administrator privileges required.',
  });
};

module.exports = { protect, adminOnly };
