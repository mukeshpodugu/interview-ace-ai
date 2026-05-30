import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

// Initialize the Google Gen AI client if API key is provided
let genAI = null;
let model = null;
if (process.env.GEMINI_API_KEY) {
  try {
    // Standard initialization for @google/generative-ai
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('Gemini AI Client initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize Gemini AI Client, using simulation mode:', err.message);
  }
} else {
  console.log('No GEMINI_API_KEY found in environment. Running AI in Simulation Mode.');
}

/**
 * Common call wrapper to prompt Gemini or fall back to local rule-based simulation.
 */
async function generateContent(prompt, systemInstruction = '', fallbackGenerator = () => ({})) {
  if (model) {
    try {
      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        }
      });
      const text = response.response.text();
      return JSON.parse(text);
    } catch (err) {
      console.warn('Gemini generateContent error, executing local simulation fallback:', err.message);
      return fallbackGenerator();
    }
  }
  return fallbackGenerator();
}

/**
 * 1. AI Resume Analyzer Service
 */
export async function analyzeResume(resumeText) {
  const prompt = `
    Analyze the following resume text for an ATS screening. 
    You must return a JSON response containing:
    - atsScore (number out of 100)
    - missingKeywords (array of strings)
    - grammarMistakes (array of strings or empty)
    - formattingIssues (array of strings)
    - skillGapAnalysis (array of strings)
    - strengths (array of strings)
    - weaknesses (array of strings)
    - suggestionsToImprove (array of strings)
    - resumeScore (number out of 100)
    
    Resume Text:
    "${resumeText}"
  `;

  const fallback = () => {
    // Generate realistic parsing results from text analysis
    const wordCount = resumeText.split(/\s+/).length;
    const hasReact = /react/i.test(resumeText);
    const hasNode = /node/i.test(resumeText);
    const hasMongo = /mongo/i.test(resumeText);
    const hasSql = /sql/i.test(resumeText);
    const hasPython = /python/i.test(resumeText);
    const hasGit = /git/i.test(resumeText);
    
    let atsScore = 65;
    const missing = [];
    const gaps = [];
    const strengths = ["Professional formatting structure", "Clear headings and contact details"];
    
    if (hasReact) { atsScore += 8; strengths.push("Strong React.js capabilities"); } else { missing.push("React.js"); gaps.push("Modern Frontend SPA Frameworks"); }
    if (hasNode) { atsScore += 7; strengths.push("Backend Web Architecture"); } else { missing.push("Node.js/Express"); gaps.push("Asynchronous REST Server Frameworks"); }
    if (hasMongo) { atsScore += 5; strengths.push("NoSQL DB Management"); } else { missing.push("MongoDB"); gaps.push("Database schema design (NoSQL)"); }
    if (hasPython) { atsScore += 5; } else { missing.push("Python"); }
    if (wordCount < 150) { atsScore -= 10; }
    
    atsScore = Math.min(Math.max(atsScore, 40), 96);
    
    return {
      atsScore,
      missingKeywords: missing.length > 0 ? missing : ["CI/CD Pipelines", "Docker", "AWS Cloud Services"],
      grammarMistakes: wordCount > 20 ? [] : ["Verify bullet point active voice usage (e.g. Use 'Created' instead of 'Responsible for creating')"],
      formattingIssues: wordCount < 100 ? ["Resume layout seems extremely short; expand project descriptions."] : [],
      skillGapAnalysis: gaps.length > 0 ? gaps : ["Cloud deployments (Docker/Kubernetes)", "System Design"],
      strengths,
      weaknesses: missing.length > 0 ? [`Missing standard keywords: ${missing.join(', ')}`] : ["Limited production deployment metrics"],
      suggestionsToImprove: [
        "Quantify achievements: use templates like 'Increased X by Y% by doing Z'",
        "Include links to live project demos and Github code repositories",
        "Add standard sections for Certifications and Publications if applicable"
      ],
      resumeScore: atsScore
    };
  };

  return generateContent(prompt, 'You are an ATS scanner evaluating resumes.', fallback);
}

/**
 * 2. Generate Interview Question
 */
export async function generateInterviewQuestion(category, difficulty, history = []) {
  const prompt = `
    Generate the next mock interview question for a user.
    Category: ${category}
    Difficulty: ${difficulty}
    Previous context/history: ${JSON.stringify(history)}
    
    Return a JSON response with:
    - question (string: the actual question)
    - hint (string: tips on how to structure the response)
    - focusAreas (array of strings to cover)
  `;

  const fallback = () => {
    const hrQuestions = [
      { question: "Tell me about yourself.", hint: "Use the Present-Past-Future formula.", focusAreas: ["Current role", "Key projects", "Future aspirations"] },
      { question: "Why should we hire you?", hint: "Align your skills directly to standard job descriptions.", focusAreas: ["Technical fits", "Unique strengths", "Value add"] },
      { question: "What are your greatest strengths and weaknesses?", hint: "Focus on professional, work-related traits. For weaknesses, state steps to overcome them.", focusAreas: ["Self-awareness", "Continuous learning", "Authenticity"] },
      { question: "Where do you see yourself in 5 years?", hint: "Keep it realistic and show desire for career development.", focusAreas: ["Growth path", "Skill mastery", "Longevity"] },
      { question: "Tell me about a time you worked in a team.", hint: "Use the STAR method.", focusAreas: ["Collaboration", "Conflict resolution", "Outcome"] }
    ];

    const techQuestions = [
      { question: "Explain the difference between SQL and NoSQL databases.", hint: "Compare storage styles, scalability, and structural flexibility.", focusAreas: ["Relational schemas", "Key-value scalability", "ACID compliance"] },
      { question: "What is Event Loop in JavaScript and how does it work?", hint: "Discuss Call Stack, Web APIs, Callback Queue, and Microtask Queue.", focusAreas: ["Single threaded nature", "Non-blocking I/O", "Micro/Macro tasks"] },
      { question: "How does React's Virtual DOM work to optimize performance?", hint: "Talk about reconciliation, diffing algorithms, and batch updates.", focusAreas: ["Real vs Virtual DOM", "Diffing", "State updates"] },
      { question: "Explain what JWT is and how authentication tokens are secure.", hint: "Break down headers, payloads, signatures, and stateless verification.", focusAreas: ["HMAC/RSA signature", "Stateless auth", "Bearer Headers"] }
    ];

    const behavioralQuestions = [
      { question: "Tell me about a time you failed and how you handled it.", hint: "Describe the situation, what went wrong, what you learned, and how you improved.", focusAreas: ["Ownership", "Resilience", "Adaptation"] },
      { question: "How do you handle tight deadlines or stressful project periods?", hint: "Explain prioritizing, communication, and managing burnout.", focusAreas: ["Task priority", "Stakes communication", "Composure"] }
    ];

    let pool = hrQuestions;
    if (category === 'Technical') pool = techQuestions;
    else if (category === 'Behavioral' || category === 'Managerial') pool = behavioralQuestions;

    // Pick a question that isn't in history
    const askedQuestions = history.map(h => h.question);
    const available = pool.filter(q => !askedQuestions.includes(q.question));
    
    if (available.length > 0) {
      return available[Math.floor(Math.random() * available.length)];
    }
    return pool[Math.floor(Math.random() * pool.length)];
  };

  return generateContent(prompt, 'You are an experienced recruitment HR and Technical Interviewer.', fallback);
}

/**
 * 3. Evaluate Response
 */
export async function evaluateInterviewResponse(question, responseText, category) {
  const prompt = `
    Evaluate the user's answer to this interview question.
    Question: "${question}"
    User Answer: "${responseText}"
    Category: "${category}"
    
    Return JSON containing:
    - score (number out of 100)
    - grammar (array of suggestions or corrections)
    - feedback (detailed constructive paragraph highlighting strengths and structural improvements)
    - communicationScore (number out of 100)
    - clarity (number out of 100)
    - suggestedPoints (array of points they could have mentioned)
  `;

  const fallback = () => {
    const wordCount = responseText.split(/\s+/).length;
    let score = 55;
    let communicationScore = 60;
    
    if (wordCount > 30) { score += 15; communicationScore += 10; }
    if (wordCount > 70) { score += 10; communicationScore += 10; }
    
    // Check key phrases
    const lower = responseText.toLowerCase();
    let containsSTAR = /situation|task|action|result|because|managed/i.test(lower);
    if (containsSTAR) { score += 10; }
    
    score = Math.min(Math.max(score, 30), 95);
    communicationScore = Math.min(Math.max(communicationScore, 40), 98);

    return {
      score,
      grammar: wordCount < 10 ? ["Answer is too brief. Try to speak for at least 45-60 seconds."] : [],
      feedback: `Your response shows ${wordCount > 40 ? 'good initiative and covers the core prompt details' : 'some understanding but lacks detail'}. To make this answer outstanding, utilize the STAR framework (Situation, Task, Action, Result) to layout concrete accomplishments and measurable indicators.`,
      communicationScore,
      clarity: wordCount > 20 ? 80 : 50,
      suggestedPoints: [
        "Include metrics/percentages to substantiate your success rate.",
        "Directly align your accomplishments with the organization's business needs.",
        "Articulate the specific technical tools or methodologies utilized."
      ]
    };
  };

  return generateContent(prompt, 'You are an elite interviewer rating candidate speaking tests.', fallback);
}

/**
 * 4. Coding Feedback & Space/Time complexity
 */
export async function analyzeCodeComplexity(title, codeText, language) {
  const prompt = `
    Analyze the following code for the challenge "${title}" in "${language}".
    Evaluate correctness, speed, and clean code principles.
    Return JSON with:
    - score (number out of 100)
    - timeComplexity (e.g. "O(NlogN)")
    - spaceComplexity (e.g. "O(N)")
    - timeComplexityFeedback (string explaining why)
    - optimizationSuggestions (array of strings with code hints)
  `;

  const fallback = () => {
    let hasNestedLoop = false;
    let hasMap = false;
    
    // Quick heuristic
    const lines = codeText.split('\n');
    let loopCount = 0;
    for (let line of lines) {
      if (/for\s*\(|while\s*\(/.test(line)) {
        loopCount++;
      }
      if (/Map\s*\(|Set\s*\(|Object|new Map/i.test(line)) {
        hasMap = true;
      }
    }
    
    if (loopCount >= 2) hasNestedLoop = true;
    
    let time = "O(N)";
    let space = "O(1)";
    let timeFeedback = "The code operates in linear time complexity O(N), accessing values with single loop iterations.";
    let score = 85;
    const suggestions = ["Ensure you validate boundary inputs like null parameters or empty arrays."];

    if (hasNestedLoop) {
      time = "O(N^2)";
      timeFeedback = "Nested loops detected. This can lead to scaling delays for large arrays.";
      score = 65;
      suggestions.push("Consider using a HashMap or Set to store elements, which reduces lookup times to O(1) and decreases overall time to O(N).");
    }
    
    if (hasMap) {
      space = "O(N)";
    }

    return {
      score,
      timeComplexity: time,
      spaceComplexity: space,
      timeComplexityFeedback: timeFeedback,
      optimizationSuggestions: suggestions
    };
  };

  return generateContent(prompt, 'You are a Senior Software Architect and compiler reviewer.', fallback);
}

/**
 * 5. Aptitude Quiz Generator
 */
export async function generateAptitudeQuestions(category, difficulty) {
  const prompt = `
    Generate 5 aptitude questions for the category "${category}" and difficulty "${difficulty}".
    Return JSON containing an array of questions, where each question has:
    - question (string)
    - options (array of 4 strings)
    - answerIndex (number 0 to 3)
    - explanation (string explanation of the math/logical steps)
  `;

  const fallback = () => {
    const quantQuestions = [
      {
        question: "A train 120m long passes a post in 12 seconds. Find the speed of the train in km/h.",
        options: ["36 km/h", "40 km/h", "30 km/h", "45 km/h"],
        answerIndex: 0,
        explanation: "Speed = Distance / Time = 120m / 12s = 10 m/s. Convert to km/h by multiplying with 18/5: 10 * (18/5) = 36 km/h."
      },
      {
        question: "If A and B can do a work in 10 days and A alone can do it in 15 days, in how many days can B alone do it?",
        options: ["20 days", "25 days", "30 days", "35 days"],
        answerIndex: 2,
        explanation: "Let total work = 30 units. Work rate of (A+B) = 3 units/day. Work rate of A = 2 units/day. Therefore, B's rate = 1 unit/day. Days for B = 30 / 1 = 30 days."
      }
    ];

    const logicalQuestions = [
      {
        question: "Find the missing number in the series: 3, 5, 9, 17, 33, ...",
        options: ["45", "65", "55", "68"],
        answerIndex: 1,
        explanation: "The difference pattern increases by powers of 2: +2, +4, +8, +16. The next increment is +32. 33 + 32 = 65."
      },
      {
        question: "If 'BLUE' is coded as 'HVAK', what is the code for 'PINK'?",
        options: ["VPTQ", "VPJQ", "VPMQ", "VPKJ"],
        answerIndex: 0,
        explanation: "The mapping pattern shifts characters forward. Verify matching indexes: P(+6)->V, I(+7)->P, N(+6)->T, K(+6)->Q. (Pattern: +6, +7, +6, +6 shift or customized transposition)."
      }
    ];

    let pool = quantQuestions;
    if (category === 'Logical') pool = logicalQuestions;

    return pool;
  };

  return generateContent(prompt, 'You are an Aptitude Test developer.', fallback);
}

/**
 * 6. Study Roadmap Generator
 */
export async function generateStudyPlan(userScores, experienceLevel) {
  const prompt = `
    Generate a personalized preparation study roadmap based on current scores:
    Resume Score: ${userScores.resume}
    Aptitude Score: ${userScores.aptitude}
    Coding Score: ${userScores.coding}
    Interview Score: ${userScores.communication}
    Experience Level: ${experienceLevel}
    
    Return JSON roadmap containing:
    - daily (array of 3 strings: daily practices)
    - weekly (array of 3 strings: weekly checkpoints)
    - monthly (array of 3 strings: monthly targets)
  `;

  const fallback = () => {
    const daily = ["Solve 2 LeetCode easy/medium problems in target language"];
    const weekly = ["Take 1 complete AI HR mock interview & evaluate transcript metrics"];
    const monthly = ["Update portfolio resume projects list & review ATS checklist score"];

    if (userScores.coding < 60) {
      daily.push("Practice array manipulation and data structure implementations");
      weekly.push("Solve a mock coding tournament contest problem set");
    } else {
      daily.push("Solve 1 hard algorithmic dynamic programming problem");
    }

    if (userScores.aptitude < 60) {
      daily.push("Practice 15 minutes of Time/Work and Speed/Distance formulas");
      weekly.push("Attempt a full length timed 30-minute aptitude quiz");
    } else {
      weekly.push("Practice verbal analogies and syllogism reasoning sheets");
    }

    if (userScores.communication < 65) {
      daily.push("Speak for 3 minutes continuously using Speech Evaluation tool");
      weekly.push("Conduct mock behavioural panel tests monitoring filler words");
    } else {
      weekly.push("Practice leadership style responses using the STAR format");
    }

    daily.push("Review AI assistant chat summaries and bookmarks folder");
    monthly.push("Earn at least 2 badges in Coding Contest & Interview sprints");
    monthly.push("Take a full placement exam simulation for target companies (TCS, Accenture)");

    return { daily, weekly, monthly };
  };

  return generateContent(prompt, 'You are a professional EdTech career counselor.', fallback);
}
