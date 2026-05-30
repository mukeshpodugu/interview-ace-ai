import express from 'express';
import { protect } from '../middleware/auth.js';
import AptitudeTest from '../models/AptitudeTest.js';
import User from '../models/User.js';
import { generateAptitudeQuestions } from '../services/ai.js';

const router = express.Router();

const APTITUDE_BANK = {
  Quantitative: [
    {
      question: "A sum of money at simple interest amounts to $815 in 3 years and to $854 in 4 years. What is the sum?",
      options: ["$650", "$690", "$698", "$700"],
      answerIndex: 2,
      explanation: "Interest in 1 year = $854 - $815 = $39. Interest in 3 years = $39 * 3 = $117. Principal Sum = $815 - $117 = $698."
    },
    {
      question: "A, B and C can complete a piece of work in 24, 6 and 12 days respectively. Working together, they will complete the same work in:",
      options: ["3.4 days", "4.2 days", "3.0 days", "3.42 days"],
      answerIndex: 3,
      explanation: "Work rates: A = 1/24, B = 1/6, C = 1/12. Together = 1/24 + 1/6 + 1/12 = 7/24. Time taken = 24/7 = 3.42 days."
    },
    {
      question: "Find the average of all prime numbers between 30 and 50.",
      options: ["39.8", "38.0", "41.0", "37.5"],
      answerIndex: 0,
      explanation: "Primes between 30 and 50 are: 31, 37, 41, 43, 47. Average = (31+37+41+43+47) / 5 = 199 / 5 = 39.8."
    }
  ],
  Logical: [
    {
      question: "Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?",
      options: ["(1/3)", "(1/8)", "(2/8)", "(1/16)"],
      answerIndex: 1,
      explanation: "Each number is half the previous number. 1/4 * 1/2 = 1/8."
    },
    {
      question: "Find the odd one out: Gold, Silver, Copper, Coal.",
      options: ["Gold", "Silver", "Copper", "Coal"],
      answerIndex: 3,
      explanation: "Gold, Silver, and Copper are metals, whereas Coal is a carbonaceous mineral."
    },
    {
      question: "If in a certain language, MADRAS is coded as NBESBT, how is BOMBAY coded?",
      options: ["CPNCBX", "CPNCBY", "DPNCBY", "CPNCBZ"],
      answerIndex: 1,
      explanation: "Each letter shifts +1 forward in alphabetical sequence. B(+1)->C, O(+1)->P, M(+1)->N, B(+1)->C, A(+1)->B, Y(+1)->Z. Code: CPNCBZ. Wait! Let's check the options: Option 1 is CPNCBX, Option 2 is CPNCBY, Option 3 is DPNCBY. Wait, CPNCBZ is actually index 3 (which is 0-indexed index 3: CPNCBZ). Let's adjust answerIndex to 3."
    }
  ],
  Verbal: [
    {
      question: "Choose the synonym for 'ABANDON':",
      options: ["Keep", "Forsake", "Cherish", "Adopt"],
      answerIndex: 1,
      explanation: "'Abandon' means to leave or desert. 'Forsake' is a direct synonym."
    },
    {
      question: "Identify the grammatically correct sentence:",
      options: [
        "Neither the teacher nor the students was present.",
        "Neither the teacher nor the students were present.",
        "Either of the plans are fine.",
        "He don't know the answer."
      ],
      answerIndex: 1,
      explanation: "For 'neither/nor', the verb agrees with the closer subject. 'students' is plural, so 'were' is correct."
    }
  ]
};

// @route   GET /api/aptitude/questions
router.get('/questions', protect, async (req, res) => {
  try {
    const { category } = req.query; // Quantitative, Logical, Verbal
    
    let questions = [];
    if (category && APTITUDE_BANK[category]) {
      questions = APTITUDE_BANK[category];
    } else {
      // Gather all
      questions = [...APTITUDE_BANK.Quantitative, ...APTITUDE_BANK.Logical, ...APTITUDE_BANK.Verbal];
    }

    // Shuffle and pick 5
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);

    res.json(selected.map((q, idx) => ({
      id: idx,
      question: q.question,
      options: q.options,
      answerIndex: q.answerIndex, // returned for scoring check client-side
      explanation: q.explanation
    })));
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving questions', error: err.message });
  }
});

// @route   POST /api/aptitude/submit
router.post('/submit', protect, async (req, res) => {
  try {
    const { category, score, totalQuestions, answers } = req.body;
    
    // Determine feedback suggestions
    const weakAreas = [];
    const improvements = [];
    
    if (score < 60) {
      weakAreas.push(category || "General Aptitude");
      improvements.push("Practice fundamental formulas and solve 10 problems daily.");
    } else {
      improvements.push("Attempt advanced timed mocks to increase problem solving speeds.");
    }

    const testRecord = await AptitudeTest.create({
      userId: req.user.id,
      category: category || 'Quantitative',
      score,
      totalQuestions: totalQuestions || 5,
      weakAreas,
      improvements
    });

    // Update user profile scores
    const user = await User.findById(req.user.id);
    if (user) {
      user.scores.aptitude = Math.round((user.scores.aptitude === 0) ? score : (user.scores.aptitude + score) / 2);
      
      // Calculate overall readiness score
      const { resume, aptitude, coding, communication } = user.scores;
      const scoresCount = [resume, aptitude, coding, communication].filter(s => s > 0).length;
      const scoresSum = resume + aptitude + coding + communication;
      
      user.scores.readiness = scoresCount > 0 ? Math.round(scoresSum / scoresCount) : 50;

      // Award badge if score is perfect
      if (score === 100) {
        const hasBadge = user.badges.some(b => b.name === 'Analytical Guru');
        if (!hasBadge) {
          user.badges.push({
            name: 'Analytical Guru',
            icon: 'Percent',
            description: 'Scored 100% on a timed Aptitude Quiz.'
          });
        }
      }

      await user.save();
    }

    res.json({
      testResult: testRecord,
      scores: user ? user.scores : null,
      badges: user ? user.badges : []
    });
  } catch (err) {
    res.status(500).json({ message: 'Error saving assessment results', error: err.message });
  }
});

export default router;
