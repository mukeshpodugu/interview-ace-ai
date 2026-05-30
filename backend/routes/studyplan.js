import express from 'express';
import { protect } from '../middleware/auth.js';
import StudyPlan from '../models/StudyPlan.js';
import User from '../models/User.js';
import { generateStudyPlan } from '../services/ai.js';

const router = express.Router();

// @route   GET /api/studyplan
router.get('/', protect, async (req, res) => {
  try {
    let plan = await StudyPlan.findOne({ userId: req.user.id });
    
    // If no plan, or needs update based on new score milestones, build one
    if (!plan) {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Generate roadmap via AI
      const roadmaps = await generateStudyPlan(user.scores, user.experienceLevel || 'Beginner');

      plan = await StudyPlan.create({
        userId: req.user.id,
        roadmap: {
          daily: roadmaps.daily || [],
          weekly: roadmaps.weekly || [],
          monthly: roadmaps.monthly || []
        },
        completedTasks: []
      });
    }

    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching study plan', error: err.message });
  }
});

// @route   POST /api/studyplan/regenerate
router.post('/regenerate', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const roadmaps = await generateStudyPlan(user.scores, user.experienceLevel || 'Beginner');

    let plan = await StudyPlan.findOne({ userId: req.user.id });
    if (plan) {
      plan.roadmap = {
        daily: roadmaps.daily || [],
        weekly: roadmaps.weekly || [],
        monthly: roadmaps.monthly || []
      };
      plan.updatedAt = Date.now();
      await plan.save();
    } else {
      plan = await StudyPlan.create({
        userId: req.user.id,
        roadmap: {
          daily: roadmaps.daily || [],
          weekly: roadmaps.weekly || [],
          monthly: roadmaps.monthly || []
        },
        completedTasks: []
      });
    }

    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: 'Error regenerating study plan', error: err.message });
  }
});

// @route   PUT /api/studyplan/toggle
router.put('/toggle', protect, async (req, res) => {
  try {
    const { taskText } = req.body;
    
    if (!taskText) {
      return res.status(400).json({ message: 'Task text is required' });
    }

    const plan = await StudyPlan.findOne({ userId: req.user.id });
    if (!plan) {
      return res.status(404).json({ message: 'Study plan not found' });
    }

    const index = plan.completedTasks.indexOf(taskText);
    if (index > -1) {
      plan.completedTasks.splice(index, 1); // remove
    } else {
      plan.completedTasks.push(taskText); // add
    }

    plan.updatedAt = Date.now();
    await plan.save();

    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: 'Error updating task completion status', error: err.message });
  }
});

export default router;
