import mongoose from 'mongoose';

const InterviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { 
    type: String, 
    enum: ['HR', 'Technical', 'Behavioral', 'Managerial', 'GroupDiscussion'], 
    required: true 
  },
  difficulty: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'], 
    default: 'Intermediate' 
  },
  questions: [{
    question: { type: String, required: true },
    answerText: { type: String, default: '' },
    feedback: { type: String, default: '' },
    score: { type: Number, default: 0 },
    fillerWords: { type: Number, default: 0 },
    speed: { type: Number, default: 0 }, // WPM
    clarity: { type: Number, default: 0 } // 0 - 100
  }],
  analysis: {
    eyeContact: { type: Number, default: 0 }, // 0 - 100
    faceVisibility: { type: Number, default: 0 },
    fluency: { type: Number, default: 0 },
    fillerWordsCount: { type: Number, default: 0 },
    speakingSpeed: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    attention: { type: Number, default: 0 }
  },
  overallFeedback: { type: String, default: '' },
  overallScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Interview || mongoose.model('Interview', InterviewSchema);
