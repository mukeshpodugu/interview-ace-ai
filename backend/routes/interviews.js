import express from 'express';
import { protect } from '../middleware/auth.js';
import Interview from '../models/Interview.js';
import User from '../models/User.js';
import { generateInterviewQuestion, evaluateInterviewResponse } from '../services/ai.js';

const router = express.Router();

// @route   POST /api/interviews/start
router.post('/start', protect, async (req, res) => {
  try {
    const { category, difficulty } = req.body;
    
    if (!category) {
      return res.status(400).json({ message: 'Category is required (HR, Technical, Behavioral, Managerial, GroupDiscussion)' });
    }

    // Get initial question
    const qData = await generateInterviewQuestion(category, difficulty || 'Intermediate', []);

    const interview = await Interview.create({
      userId: req.user.id,
      category,
      difficulty: difficulty || 'Intermediate',
      questions: [{
        question: qData.question,
        answerText: '',
        feedback: '',
        score: 0
      }],
      analysis: {
        eyeContact: 0,
        faceVisibility: 0,
        fluency: 0,
        fillerWordsCount: 0,
        speakingSpeed: 0,
        confidence: 0,
        attention: 0
      }
    });

    res.status(201).json({
      interviewId: interview._id,
      currentQuestion: qData.question,
      hint: qData.hint,
      focusAreas: qData.focusAreas,
      totalQuestions: 1
    });
  } catch (err) {
    res.status(500).json({ message: 'Error initializing interview session', error: err.message });
  }
});

// @route   POST /api/interviews/answer
router.post('/answer', protect, async (req, res) => {
  try {
    const { interviewId, answerText, speechAnalysis, webcamAnalysis } = req.body;
    
    if (!interviewId) {
      return res.status(400).json({ message: 'Interview ID is required' });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    const currentQuestionIndex = interview.questions.length - 1;
    const currentQuestion = interview.questions[currentQuestionIndex];
    
    // Evaluate answer text using AI
    const evalData = await evaluateInterviewResponse(currentQuestion.question, answerText || 'No answer recorded', interview.category);
    
    // Save answer details
    currentQuestion.answerText = answerText || '';
    currentQuestion.feedback = evalData.feedback;
    currentQuestion.score = evalData.score || 50;
    
    // Extract filler words and speeds from client-side Web Speech telemetry
    if (speechAnalysis) {
      currentQuestion.fillerWords = speechAnalysis.fillerCount || 0;
      currentQuestion.speed = speechAnalysis.speed || 0;
      currentQuestion.clarity = speechAnalysis.clarity || 0;
    }

    // Accumulate running webcam analysis
    if (webcamAnalysis) {
      interview.analysis.eyeContact = Math.round((interview.analysis.eyeContact * currentQuestionIndex + (webcamAnalysis.eyeContact || 0)) / (currentQuestionIndex + 1));
      interview.analysis.faceVisibility = Math.round((interview.analysis.faceVisibility * currentQuestionIndex + (webcamAnalysis.faceVisibility || 0)) / (currentQuestionIndex + 1));
      interview.analysis.attention = Math.round((interview.analysis.attention * currentQuestionIndex + (webcamAnalysis.attention || 0)) / (currentQuestionIndex + 1));
    }

    await interview.save();

    // Determine if we should generate next follow-up or end
    const MAX_QUESTIONS = 4; // Length of a mock interview
    if (interview.questions.length < MAX_QUESTIONS) {
      // Map history for Gemini to follow-up contextually
      const history = interview.questions.map(q => ({
        question: q.question,
        answer: q.answerText
      }));

      const nextQData = await generateInterviewQuestion(interview.category, interview.difficulty, history);
      
      interview.questions.push({
        question: nextQData.question,
        answerText: '',
        feedback: '',
        score: 0
      });

      await interview.save();

      return res.json({
        isFinished: false,
        currentQuestion: nextQData.question,
        hint: nextQData.hint,
        focusAreas: nextQData.focusAreas,
        totalQuestions: interview.questions.length
      });
    }

    res.json({
      isFinished: true,
      message: 'Interview answers logged. Please proceed to session completion summary.'
    });
  } catch (err) {
    res.status(500).json({ message: 'Error processing interview response', error: err.message });
  }
});

// @route   POST /api/interviews/end
router.post('/end', protect, async (req, res) => {
  try {
    const { interviewId, finalSpeechAnalysis } = req.body;
    
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    // Calculate overall scoring
    const scores = interview.questions.map(q => q.score);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    
    interview.overallScore = avgScore;

    // Compile global communication scores
    if (finalSpeechAnalysis) {
      interview.analysis.fillerWordsCount = finalSpeechAnalysis.totalFillerCount || 0;
      interview.analysis.speakingSpeed = finalSpeechAnalysis.avgSpeed || 120;
      interview.analysis.fluency = Math.max(100 - (finalSpeechAnalysis.totalFillerCount * 6), 40);
    } else {
      // Direct average of question fillers
      const totalFillers = interview.questions.reduce((a, b) => a + (b.fillerWords || 0), 0);
      interview.analysis.fillerWordsCount = totalFillers;
      interview.analysis.fluency = Math.max(100 - (totalFillers * 5), 45);
      interview.analysis.speakingSpeed = 110;
    }

    // Set communication confidence
    const faceScores = (interview.analysis.eyeContact + interview.analysis.attention + interview.analysis.faceVisibility) / 3;
    interview.analysis.confidence = Math.round((interview.analysis.fluency + faceScores) / 2);

    // Dynamic Overall feedback
    interview.overallFeedback = `You have completed the ${interview.difficulty} ${interview.category} Mock Interview. Your average technical response score is ${avgScore}/100. Eye contact was tracked at ${interview.analysis.eyeContact}%, with an attention rating of ${interview.analysis.attention}%. You registered ${interview.analysis.fillerWordsCount} vocal filler pauses. ${avgScore >= 75 ? 'Excellent work! You display strong technical articulation.' : 'Keep practicing. Try to elaborate on structural diagrams and speak with less hesitation.'}`;

    await interview.save();

    // Update User profiles
    const user = await User.findById(req.user.id);
    if (user) {
      user.scores.communication = Math.round(interview.analysis.confidence);
      
      // Calculate overall readiness score
      const { resume, aptitude, coding, communication } = user.scores;
      const scoresCount = [resume, aptitude, coding, communication].filter(s => s > 0).length;
      const scoresSum = resume + aptitude + coding + communication;
      
      user.scores.readiness = scoresCount > 0 ? Math.round(scoresSum / scoresCount) : 50;

      // Award badge if score is high
      if (avgScore >= 80) {
        const badgeName = `${interview.category} Ace`;
        const hasBadge = user.badges.some(b => b.name === badgeName);
        if (!hasBadge) {
          user.badges.push({
            name: badgeName,
            icon: 'Award',
            description: `Scored ${avgScore}% or above on a ${interview.category} mock interview.`
          });
        }
      }

      await user.save();
    }

    res.json({
      interview,
      scores: user ? user.scores : null,
      badges: user ? user.badges : []
    });
  } catch (err) {
    res.status(500).json({ message: 'Error calculating interview metrics', error: err.message });
  }
});

// @route   GET /api/interviews/history
router.get('/history', protect, async (req, res) => {
  try {
    const history = await Interview.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching interview history', error: err.message });
  }
});

export default router;
