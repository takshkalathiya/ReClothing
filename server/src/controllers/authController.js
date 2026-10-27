const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// Helper to issue JWT and set secure HTTP-only cookie
const sendTokenResponse = (user, statusCode, res, message) => {
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || 'rewear_campus_super_secure_jwt_secret_key_2026_xyz',
    { expiresIn: '7d' }
  );

  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax', // 'none' is required for cross-domain Vercel <-> Render cookies
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  const isAdmin =
    user.role === 'admin' ||
    (user.email && user.email.toLowerCase() === 'sanskarbhanderi08@gmail.com');
  const role = isAdmin ? 'admin' : (user.role || 'user');

  res.status(statusCode).json({
    success: true,
    message,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      college: user.college,
      avatar: user.avatar,
      role,
      wishlist: user.wishlist || [],
      token, // Dual authentication support for cross-domain requests
      createdAt: user.createdAt,
    },
  });
};

// @desc    Register a new student user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, college, avatar } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'An account with this email address already exists. Please log in.',
    });
  }

  const isAdmin = email.toLowerCase().trim() === 'sanskarbhanderi08@gmail.com';

  // Create new user (password hashed in pre-save hook)
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    college: college.trim(),
    avatar: avatar || '',
    role: isAdmin ? 'admin' : 'user',
  });

  sendTokenResponse(user, 201, res, 'Account created successfully! Welcome to ReWear.');
});

// @desc    Authenticate user & issue HTTP-only cookie
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password.',
    });
  }

  // Find user and explicitly select password
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
    });
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
    });
  }

  // Auto-promote designated admin account if role is not set
  if (
    user.email &&
    user.email.toLowerCase() === 'sanskarbhanderi08@gmail.com' &&
    user.role !== 'admin'
  ) {
    user.role = 'admin';
    await user.save();
  }

  sendTokenResponse(user, 200, res, 'Logged in successfully.');
});

// @desc    Log out user & clear HTTP-only cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
    data: {},
  });
});

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'title price images condition category');

  if (
    user &&
    user.email &&
    user.email.toLowerCase() === 'sanskarbhanderi08@gmail.com' &&
    user.role !== 'admin'
  ) {
    user.role = 'admin';
    await user.save();
  }

  res.status(200).json({
    success: true,
    message: 'User session verified.',
    data: user,
  });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
};
