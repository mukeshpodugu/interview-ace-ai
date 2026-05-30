import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'interview_ace_secret_key_12345';

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all details' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'User already registered with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: true, // For demo convenience, verify instantly
      scores: {
        readiness: 50,
        resume: 0,
        aptitude: 0,
        coding: 0,
        communication: 0
      }
    });

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        scores: user.scores,
        badges: user.badges
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server registration error', error: err.message });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all credentials' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        scores: user.scores,
        badges: user.badges,
        experienceLevel: user.experienceLevel
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server login error', error: err.message });
  }
});

// @route   POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { email, name, googleId, profilePic } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Google Auth error: Email required' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      // Create user with dummy password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(Math.random().toString(36), salt);
      
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        googleId,
        profilePic,
        isVerified: true
      });
    } else if (!user.googleId) {
      // Link Google ID
      user.googleId = googleId;
      if (profilePic) user.profilePic = profilePic;
      await user.save();
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        scores: user.scores,
        badges: user.badges,
        profilePic: user.profilePic
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Google authentication error', error: err.message });
  }
});

// @route   GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server query error', error: err.message });
  }
});

// @route   PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, experienceLevel, profilePic } = req.body;
    if (name) user.name = name;
    if (experienceLevel) user.experienceLevel = experienceLevel;
    if (profilePic) user.profilePic = profilePic;

    await user.save();
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      scores: user.scores,
      badges: user.badges,
      profilePic: user.profilePic,
      experienceLevel: user.experienceLevel
    });
  } catch (err) {
    res.status(500).json({ message: 'Profile update error', error: err.message });
  }
});

export default router;
