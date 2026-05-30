# InterviewAce AI | Ultimate AI Interview & Placement Prep Platform

### 🚀 Live Production Links
- **Frontend Client (Vercel):** [https://interview-ace-ai-three.vercel.app](https://interview-ace-ai-three.vercel.app)
- **Backend API (Render):** [https://interview-ace-ai.onrender.com](https://interview-ace-ai.onrender.com)

InterviewAce AI is a production-ready, full-stack web application designed to help candidates prepare for technical, HR, and behavioral interviews. Built using a premium Glassmorphism UI, it integrates eye-contact telemetry, speech filler counting, timed numerical quizzes, live code compilers, and Gemini AI feedback report cards.

---

## 🌟 Key Features

1. **AI Resume & ATS Checker:** Parses PDF/DOCX resumes, matches keyword gaps, identifies skill deficits, and exports clean PDF report checklists.
2. **AI Mock Interviews & CSS Avatar:** Virtual cybernetic interviewer speaking questions via TTS, tracking answers, and contextually asking follow-up questions.
3. **Webcam Composure Telemetry:** Draws overlay markers capturing eye contact coordinates and facial positioning stillness.
4. **Speech Fluency Analyzer:** Web Speech API transcribing verbal replies, monitoring WPM speed, and counting filler words (`umm`, `ahh`, `like`, `basically`).
5. **Algorithmic Coding Arena:** Safe simulation workspace compiling C, C++, Java, and Python, displaying O(N) complexity analytics.
6. **Timed Aptitude Tests:** Numerical, logical, and verbal multiple-choice quizzes with structural arithmetic explanations.
7. **Personalized Preparation roadmap:** Generates custom daily, weekly, monthly preparation checklists matching user score metrics.
8. **Corporate Placement Prep:** Curated recruitment structures, tip sets, and previous exam question dumps for TCS, Accenture, and Deloitte.
9. **Admin Panel Statistics:** Restricts view logs, lists platform registered users, and displays estimated AI API cost metrics.
10. **Achievements Cabinet:** Cabinets displaying unlockable milestones and user progress leaderboards.

---

## 📁 Repository Structure

```text
interview-ace-ai/
├── package.json                   # Root monorepo scripts
├── backend/                       # Express Node.js Backend Server
│   ├── package.json
│   ├── server.js                  # App Entry Point
│   ├── config/db.js               # MongoDB Connection Configuration
│   ├── middleware/auth.js         # JWT Token Authenticator
│   ├── models/                    # Mongoose Database Schemas
│   ├── routes/                    # API Endpoints (Auth, Resume, Coding, Aptitude)
│   └── services/ai.js             # Gemini AI Service Wrapper (with local fallbacks)
└── frontend/                      # React-Vite Tailwind CSS SPA Client
    ├── package.json
    ├── vite.config.js             # Client Config & Proxy reverse controls
    ├── index.html
    └── src/
        ├── index.css              # Custom styling definitions & glass styles
        ├── App.jsx                # Layout & Routing trees
        ├── components/            # Telemetry components (Cam, Mic, Code, Avatar)
        ├── context/AuthContext.js # Global Theme & Session Contexts
        ├── pages/                 # Visual templates (Dashboard, Landing, Admin)
        └── services/api.js        # API communications client
```

---

## ⚙️ Installation & Development Setup

### Prerequisite:
- Make sure you have **Node.js** (v18+) and **npm** installed.
- Ensure your local **MongoDB** daemon is running on: `mongodb://127.0.0.1:27017` (Optional: The server routes contain automatic crash-proof memory fallbacks if offline).

### 1. Install all dependencies:
Execute in the root directory:
```bash
npm run install-all
```

### 2. Configure Environment variables:
Rename the `.env` template in the backend directory to `.env`:
```text
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/interview_ace_ai
JWT_SECRET=interview_ace_secret_key_12345
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If `GEMINI_API_KEY` is omitted, the platform automatically starts in **Simulation Mode**, creating high-fidelity mockup evaluations).*

### 3. Launch Development Servers:
Run both frontend and backend concurrently in one terminal:
```bash
npm run dev
```

The application will launch on:
- Frontend Client: [http://localhost:5173](http://localhost:5173)
- Express API Backend: [http://localhost:5000](http://localhost:5000)

---

## 🔒 Security & Privacy

1. **Passwords:** Encrypted inside database using `bcryptjs` hashing.
2. **Authorization:** Bound via JWT token verification bearer headers.
3. **Webcam/Mic Telemetry:** Captured data coordinates are processed strictly client-side inside the browser. No video frames or audio streams are ever transmitted or saved on the backend server.
