const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

// ─── Helper: Generate User JWT ────────────────────────────────────────────────
const generateUserToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// ─── Helper: Generate Admin JWT ───────────────────────────────────────────────
const generateAdminToken = (id) =>
  jwt.sign({ id }, process.env.JWT_ADMIN_SECRET, {
    expiresIn: process.env.JWT_ADMIN_EXPIRES_IN || '1d',
  });

// ─── POST /api/auth/register ──────────────────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Full name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({ fullName, email, password, phone });
    const token = generateUserToken(user._id);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        _id:      user._id,
        fullName: user.fullName,
        email:    user.email,
        phone:    user.phone,
        role:     user.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateUserToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        _id:      user._id,
        fullName: user.fullName,
        email:    user.email,
        phone:    user.phone,
        address:  user.address,
        role:     user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// ─── POST /api/auth/admin/login ───────────────────────────────────────────────
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const token = generateAdminToken(admin._id);

    res.json({
      message: 'Admin login successful',
      token,
      admin: {
        _id:      admin._id,
        fullName: admin.fullName,
        email:    admin.email,
        role:     admin.role,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: error.message || 'Server error during admin login' });
  }
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      _id:      user._id,
      fullName: user.fullName,
      email:    user.email,
      phone:    user.phone,
      address:  user.address,
      role:     user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PUT /api/auth/profile ────────────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, address } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (fullName) user.fullName = fullName;
    if (phone)    user.phone    = phone;
    if (address)  user.address  = { ...user.address, ...address };

    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, adminLogin, getMe, updateProfile };
