import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import User from '../models/User.js';
import Interview from '../models/Interview.js';
import CodingTest from '../models/CodingTest.js';
import AptitudeTest from '../models/AptitudeTest.js';

const router = express.Router();

// @route   GET /api/admin/stats
// @desc    Get dashboard summary statistics
// @access  Private/Admin
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalInterviews = await Interview.countDocuments();
    const totalCodingTests = await CodingTest.countDocuments();
    const totalAptitudeTests = await AptitudeTest.countDocuments();

    // Mock API usage cost tracking
    const totalAIRequests = totalInterviews * 5 + totalCodingTests + totalAptitudeTests;
    const estimatedCost = (totalAIRequests * 0.0015).toFixed(4); // approx token fee in USD

    // Fetch monthly interview analytics
    const recentActivity = await Interview.find()
      .limit(5)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    // Aggregate category distribution
    const categories = ['HR', 'Technical', 'Behavioral', 'Managerial', 'GroupDiscussion'];
    const distribution = await Promise.all(
      categories.map(async (cat) => {
        const count = await Interview.countDocuments({ category: cat });
        return { name: cat, value: count };
      })
    );

    res.json({
      metrics: {
        users: totalUsers,
        interviews: totalInterviews,
        codingTests: totalCodingTests,
        aptitudeTests: totalAptitudeTests,
        aiUsageRequests: totalAIRequests,
        estimatedCostUSD: estimatedCost
      },
      distribution,
      recentActivity: recentActivity.map(act => ({
        id: act._id,
        userName: act.userId ? act.userId.name : 'Unknown User',
        userEmail: act.userId ? act.userId.email : 'N/A',
        category: act.category,
        score: act.overallScore,
        date: act.createdAt
      }))
    });
  } catch (err) {
    res.status(500).json({ message: 'Error compiling admin stats dashboard', error: err.message });
  }
});

// @route   GET /api/admin/users
// @desc    List all registered users
// @access  Private/Admin
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user log sheets', error: err.message });
  }
});

export default router;
