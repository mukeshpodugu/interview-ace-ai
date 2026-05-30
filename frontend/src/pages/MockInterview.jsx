import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import AvatarInterviewer from '../components/AvatarInterviewer';
import SpeechRecorder from '../components/SpeechRecorder';
import WebCamAnalyzer from '../components/WebCamAnalyzer';
import { Video, Award, RefreshCw, AlertCircle, Volume2, ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MockInterview() {
  const { updateLocalScores, updateLocalBadges } = useAuth();
  
  // States
  const [step, setStep] = useState('config'); // config | running | summary
  const [category, setCategory] = useState('HR');
  const [difficulty, setDifficulty] = useState('Intermediate');
  
  const [interviewId, setInterviewId] = useState(null);
  const [question, setQuestion] = useState('');
  const [hint, setHint] = useState('');
  const [focusAreas, setFocusAreas] = useState([]);
  
  const [isFinishing, setIsFinishing] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [qCount, setQCount] = useState(1);
  const [avatarState, setAvatarState] = useState('idle');

  // Real-time metrics trackers
  const [speechMetrics, setSpeechMetrics] = useState({ fillerCount: 0, speed: 0, clarity: 0 });
  const [webcamMetrics, setWebcamMetrics] = useState({ eyeContact: 0, faceVisibility: 0, attention: 0, confidence: 0 });
  const [sessionResults, setSessionResults] = useState(null);

  // Trigger TTS voice to speak question out loud
  const speakQuestion = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // stop existing
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onstart = () => setAvatarState('speaking');
      utterance.onend = () => setAvatarState('listening');
      window.speechSynthesis.speak(utterance);
    } else {
      setAvatarState('listening');
    }
  };

  const startInterview = async () => {
    setStep('running');
    setAvatarState('thinking');
    try {
      const data = await api.interviews.start(category, difficulty);
      setInterviewId(data.interviewId);
      setQuestion(data.currentQuestion);
      setHint(data.hint || '');
      setFocusAreas(data.focusAreas || []);
      setQCount(1);
      
      // Delay speech slightly to let user settle in
      setTimeout(() => {
        speakQuestion(data.currentQuestion);
      }, 1000);
    } catch (err) {
      alert('Failed to initialize mock interview: ' + err.message);
      setStep('config');
    }
  };

  const submitAnswer = async () => {
    if (!currentText.trim() && !window.confirm('No speech or text has been typed. Are you sure you want to skip?')) {
      return;
    }
    
    setIsSubmittingAnswer(true);
    setAvatarState('thinking');

    try {
      const data = await api.interviews.answer(interviewId, currentText, speechMetrics, webcamMetrics);
      setCurrentText(''); // Reset transcript

      if (data.isFinished) {
        setIsFinishing(true);
        // Call end session
        const endData = await api.interviews.end(interviewId, {
          totalFillerCount: speechMetrics.fillerCount * 4, // extrapolating
          avgSpeed: speechMetrics.speed || 115
        });
        
        setSessionResults(endData.interview);
        
        // Update context stores
        if (endData.scores) updateLocalScores(endData.scores);
        if (endData.badges) updateLocalBadges(endData.badges);
        
        setStep('summary');
      } else {
        // Load next question
        setQuestion(data.currentQuestion);
        setHint(data.hint || '');
        setFocusAreas(data.focusAreas || []);
        setQCount(data.totalQuestions);
        speakQuestion(data.currentQuestion);
      }
    } catch (err) {
      alert('Error submitting response: ' + err.message);
    } finally {
      setIsSubmittingAnswer(false);
      setIsFinishing(false);
    }
  };

  const handleSpeakText = () => {
    speakQuestion(question);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* STEP 1: CONFIG PRE-INTERVIEW SCREEN */}
      {step === 'config' && (
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl border border-indigo-500/20 inline-block">
              <Video size={22} />
            </span>
            <h2 className="text-2xl font-black">AI Mock Interview Configurator</h2>
            <p className="text-slate-400 font-bold text-xs">Configure category goals, speech controls, and activate webcam sensors.</p>
          </div>

          <div className="glass-card p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Interview Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['HR', 'Technical', 'Behavioral', 'Managerial', 'GroupDiscussion'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        category === cat
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/40'
                          : 'bg-white/40 dark:bg-slate-900/40 text-slate-500 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {cat === 'GroupDiscussion' ? 'Group Discussion' : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Difficulty Tier</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Beginner', 'Intermediate', 'Advanced'].map(diff => (
                    <button
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        difficulty === diff
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/40'
                          : 'bg-white/40 dark:bg-slate-900/40 text-slate-500 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 text-xs font-semibold leading-relaxed text-indigo-600 dark:text-indigo-400 flex gap-2">
              <HelpCircle size={16} className="flex-shrink-0" />
              <span>Ensure you grant microphone and camera access. Web Speech and Canvas metrics run locally inside the browser.</span>
            </div>

            <button
              onClick={startInterview}
              className="w-full btn-glass-primary py-3.5 shadow-md shadow-indigo-500/10 text-sm font-black"
            >
              Initialize Mock Interview
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: RUNNING INTERVIEW SCREEN */}
      {step === 'running' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left panel: Avatar & Question details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6 flex flex-col justify-between min-h-[460px] bg-slate-900 border-slate-800 text-slate-100 relative overflow-hidden">
              {/* Grid backdrop */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

              {/* Header metrics */}
              <div className="relative z-10 flex justify-between items-center pb-4 border-b border-slate-800/80">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{category} Interview</span>
                <span className="text-[10px] bg-indigo-500/15 text-indigo-400 px-3 py-1 rounded-full font-black uppercase tracking-wider">
                  Question {qCount} / 4
                </span>
              </div>

              {/* AI Avatar module */}
              <div className="relative z-10 my-4 flex justify-center">
                <AvatarInterviewer state={avatarState} />
              </div>

              {/* Speech Question Bubble */}
              <div className="relative z-10 p-4 bg-slate-950/80 border border-slate-800/60 rounded-2xl flex items-start gap-3">
                <button
                  onClick={handleSpeakText}
                  className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all flex-shrink-0"
                  title="Re-speak Question"
                >
                  <Volume2 size={16} />
                </button>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-bold">Interviewer says:</p>
                  <p className="text-sm font-extrabold text-slate-200 leading-relaxed">{question}</p>
                </div>
              </div>
            </div>

            {/* Answer Input Recorders */}
            <div className="glass-card p-6">
              <SpeechRecorder
                onTranscriptChange={setCurrentText}
                onMetricsChange={setSpeechMetrics}
              />
              
              <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex justify-end">
                <button
                  onClick={submitAnswer}
                  disabled={isSubmittingAnswer}
                  className="btn-glass-primary text-xs !py-3 !px-6"
                >
                  {isSubmittingAnswer ? 'Evaluating Response...' : 'Submit Answer'} <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Right panel: Webcam Telemetry feed */}
          <div className="space-y-6">
            <div className="glass-card p-5 space-y-4">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">Vision Telemetry</h3>
              <WebCamAnalyzer onMetricsChange={setWebcamMetrics} />
            </div>

            {/* Focus / Hint Box */}
            <div className="glass-card p-5 space-y-3 bg-gradient-to-br from-indigo-500/5 to-pink-500/5">
              <h4 className="font-extrabold text-xs text-indigo-500 flex items-center gap-1.5">
                <HelpCircle size={14} /> Structural Hints
              </h4>
              <p className="text-[11px] text-slate-400 font-bold leading-normal">
                {hint || "Structure your responses utilizing specific timelines, details, and project accomplishments."}
              </p>
              {focusAreas.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[9px] text-slate-400 font-extrabold uppercase">Cover Key Points:</p>
                  <div className="flex flex-wrap gap-1">
                    {focusAreas.map((fa, i) => (
                      <span key={i} className="text-[9px] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 px-2 py-0.5 rounded-lg font-bold">
                        {fa}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* STEP 3: MOCK SUMMARY SCORE CARD */}
      {step === 'summary' && sessionResults && (
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header check */}
          <div className="text-center space-y-2">
            <span className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20 inline-block animate-bounce">
              <Award size={22} />
            </span>
            <h2 className="text-2xl font-black">AI Evaluation Report Card</h2>
            <p className="text-slate-400 font-bold text-xs">Review conversational scores, webcam attention logs, and structured evaluations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* Left Box: Scoring summaries */}
            <div className="glass-card p-6 flex flex-col justify-between items-center text-center">
              <h3 className="font-extrabold text-sm self-start">Overall Score</h3>
              
              <div className="my-6">
                <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{sessionResults.overallScore}%</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Mock Grade</p>
              </div>

              <div className="w-full pt-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2.5 text-xs text-left font-bold text-slate-500 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Eye Contact:</span>
                  <span className="text-indigo-400">{sessionResults.analysis?.eyeContact || 80}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Speech Speed:</span>
                  <span className="text-indigo-400">{sessionResults.analysis?.speakingSpeed || 115} WPM</span>
                </div>
                <div className="flex justify-between">
                  <span>Filler words:</span>
                  <span className="text-indigo-400">{sessionResults.analysis?.fillerWordsCount || 0} filler pauses</span>
                </div>
              </div>
            </div>

            {/* Right Box: Feedback narrative */}
            <div className="md:col-span-2 glass-card p-6 space-y-4">
              <h3 className="font-extrabold text-sm">Feedback Summary</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                {sessionResults.overallFeedback}
              </p>

              <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex gap-2">
                <button
                  onClick={() => setStep('config')}
                  className="btn-glass-secondary text-xs !py-2.5 flex-1"
                >
                  Configure New Session
                </button>
                <Link
                  to="/dashboard"
                  className="btn-glass-primary text-xs !py-2.5 flex-1 text-center font-bold"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>

          </div>

          {/* Transcripts Checklist */}
          <div className="glass-card p-6 space-y-6">
            <h3 className="font-extrabold text-sm">Transcript & Answer Evaluations</h3>
            
            <div className="space-y-6">
              {sessionResults.questions.map((q, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-850 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-200/30 dark:border-slate-800/50 pb-2">
                    <span className="text-xs font-black text-slate-400 uppercase">Question {idx + 1}</span>
                    <span className="text-xs font-black text-indigo-500">{q.score}% score</span>
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-slate-800 dark:text-slate-200">Question:</p>
                    <p className="text-slate-400 font-semibold leading-relaxed">{q.question}</p>
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-indigo-400">Your Answer:</p>
                    <p className="text-slate-500 dark:text-slate-350 leading-relaxed italic">
                      "{q.answerText || 'No verbal answer logged.'}"
                    </p>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-emerald-500">Evaluation Comments:</p>
                    <p className="text-slate-450 dark:text-slate-400 font-semibold leading-relaxed">
                      {q.feedback}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
