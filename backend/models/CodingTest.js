import mongoose from 'mongoose';

const CodingTestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  language: { type: String, required: true },
  code: { type: String, required: true },
  passedCases: { type: Number, required: true },
  totalCases: { type: Number, required: true },
  score: { type: Number, required: true },
  complexity: {
    time: { type: String, default: 'N/A' },
    space: { type: String, default: 'N/A' }
  },
  aiFeedback: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.CodingTest || mongoose.model('CodingTest', CodingTestSchema);
