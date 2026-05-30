import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleId: { type: String, default: null },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  profilePic: { type: String, default: '' },
  scores: {
    readiness: { type: Number, default: 50 },
    resume: { type: Number, default: 0 },
    aptitude: { type: Number, default: 0 },
    coding: { type: Number, default: 0 },
    communication: { type: Number, default: 0 }
  },
  badges: [{
    name: { type: String },
    icon: { type: String },
    description: { type: String },
    dateEarned: { type: Date, default: Date.now }
  }],
  experienceLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
