import mongoose from 'mongoose';

const AptitudeTestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { 
    type: String, 
    enum: ['Quantitative', 'Logical', 'Verbal', 'DataInterpretation'], 
    required: true 
  },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  weakAreas: [{ type: String }],
  improvements: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.AptitudeTest || mongoose.model('AptitudeTest', AptitudeTestSchema);
