import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resume.js';
import interviewRoutes from './routes/interviews.js';
import codingRoutes from './routes/coding.js';
import aptitudeRoutes from './routes/aptitude.js';
import studyplanRoutes from './routes/studyplan.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();

// Middleware config
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Support larger base64 resume transfers

// Base route for status testing
app.get('/', (req, res) => {
  res.json({ message: 'InterviewAce AI Backend API Server is active.' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/aptitude', aptitudeRoutes);
app.use('/api/studyplan', studyplanRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 InterviewAce AI Backend running on: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
