import mongoose from 'mongoose';

const StudyPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roadmap: {
    daily: [{ type: String }],
    weekly: [{ type: String }],
    monthly: [{ type: String }]
  },
  completedTasks: [{ type: String }], // Holds strings corresponding to tasks completed
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.StudyPlan || mongoose.model('StudyPlan', StudyPlanSchema);
