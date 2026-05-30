import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { protect } from '../middleware/auth.js';
import { analyzeResume } from '../services/ai.js';
import User from '../models/User.js';

const router = express.Router();

// Configure multer for memory storage (we process buffer directly)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const validMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    if (validMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, and TXT files are allowed.'));
    }
  }
});

// @route   POST /api/resume/analyze
router.post('/analyze', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a resume file' });
    }

    let resumeText = '';
    const fileMime = req.file.mimetype;

    if (fileMime === 'application/pdf') {
      const parsed = await pdfParse(req.file.buffer);
      resumeText = parsed.text;
    } else if (fileMime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const parsed = await mammoth.extractRawText({ buffer: req.file.buffer });
      resumeText = parsed.value;
    } else {
      resumeText = req.file.buffer.toString('utf-8');
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ message: 'Failed to extract text from resume. File might be empty or scanned image.' });
    }

    // Call AI analyzer
    const analysis = await analyzeResume(resumeText);
    
    // Update user profile scores
    const user = await User.findById(req.user.id);
    if (user) {
      user.scores.resume = analysis.resumeScore || analysis.atsScore || 70;
      
      // Calculate overall readiness score
      const { resume, aptitude, coding, communication } = user.scores;
      const scoresCount = [resume, aptitude, coding, communication].filter(s => s > 0).length;
      const scoresSum = resume + aptitude + coding + communication;
      
      user.scores.readiness = scoresCount > 0 ? Math.round(scoresSum / scoresCount) : 50;
      
      // Award achievement badge for first upload
      const hasBadge = user.badges.some(b => b.name === 'Resume Verified');
      if (!hasBadge) {
        user.badges.push({
          name: 'Resume Verified',
          icon: 'FileText',
          description: 'Successfully uploaded and analyzed professional resume.'
        });
      }
      
      await user.save();
    }

    res.json({
      analysis,
      scores: user ? user.scores : null,
      badges: user ? user.badges : []
    });
  } catch (err) {
    console.error('Resume analyze error:', err);
    res.status(500).json({ message: 'Error analyzing resume file', error: err.message });
  }
});

export default router;
