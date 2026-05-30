import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Percent, Clock, AlertTriangle, CheckCircle, HelpCircle, ChevronRight, RefreshCw, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AptitudeTestPage() {
  const { updateLocalScores, updateLocalBadges } = useAuth();
  
  // States
  const [step, setStep] = useState('config'); // config | running | summary
  const [category, setCategory] = useState('Quantitative');
  const [difficulty, setDifficulty] = useState('Intermediate');
  
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Timer States
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const timerRef = useRef(null);

  const [summaryResults, setSummaryResults] = useState(null);

  // Timer Ticker
  useEffect(() => {
    if (step === 'running' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            submitQuiz(); // Auto submit
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [step, timeLeft]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startQuiz = async () => {
    setLoading(true);
    setUserAnswers({});
    setCurrentIdx(0);
    setTimeLeft(300);
    setStep('running');
    try {
      const data = await api.aptitude.getQuestions(category);
      setQuestions(data);
    } catch (err) {
      alert('Failed to fetch questions: ' + err.message);
      setStep('config');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optIdx) => {
    setUserAnswers({ ...userAnswers, [currentIdx]: optIdx });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const submitQuiz = async () => {
    clearInterval(timerRef.current);
    setIsSubmitting(true);
    
    // Evaluate scores
    let correct = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answerIndex) {
        correct++;
      }
    });

    const finalScore = Math.round((correct / questions.length) * 100);

    try {
      const data = await api.aptitude.submit(category, finalScore, questions.length, userAnswers);
      setSummaryResults({
        score: finalScore,
        correctCount: correct,
        total: questions.length,
        weakAreas: data.testResult?.weakAreas || [],
        improvements: data.testResult?.improvements || []
      });

      // Update global context stores
      if (data.scores) updateLocalScores(data.scores);
      if (data.badges) updateLocalBadges(data.badges);
      
      setStep('summary');
    } catch (err) {
      alert('Error submitting answers: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* STEP 1: CONFIG */}
      {step === 'config' && (
        <div className="max-w-xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl border border-indigo-500/20 inline-block">
              <Percent size={22} />
            </span>
            <h2 className="text-2xl font-black">Aptitude Prep Configurator</h2>
            <p className="text-slate-400 font-bold text-xs">Test math speed and verbal logic using timed assessments.</p>
          </div>

          <div className="glass-card p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Aptitude Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Quantitative', 'Logical', 'Verbal'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                        category === cat
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/40'
                          : 'bg-white/40 dark:bg-slate-900/40 text-slate-500 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 text-xs font-semibold leading-relaxed text-indigo-600 dark:text-indigo-400 flex gap-2">
              <Clock size={16} className="flex-shrink-0" />
              <span>Assessment has 5 questions with a 5-minute total running countdown. Auto-submits on clock expiration.</span>
            </div>

            <button
              onClick={startQuiz}
              className="w-full btn-glass-primary py-3.5 shadow-md shadow-indigo-500/10 text-sm font-black"
            >
              Start Timed Quiz
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: RUNNING QUIZ */}
      {step === 'running' && (
        <div className="max-w-2xl mx-auto space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <RefreshCw size={24} className="animate-spin text-indigo-500" />
            </div>
          ) : questions.length > 0 ? (
            <div className="space-y-6">
              
              {/* Header metrics */}
              <div className="flex justify-between items-center bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 p-4 rounded-2xl">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">{category} Assessment</span>
                
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <Clock size={14} className={timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-slate-400'} />
                  <span className={timeLeft < 60 ? 'text-red-500 font-extrabold' : ''}>{formatTime(timeLeft)}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full transition-all duration-350"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Details */}
              <div className="glass-card p-6 space-y-6">
                <h3 className="font-extrabold text-sm text-slate-400 flex items-center gap-1.5">
                  <HelpCircle size={16} className="text-indigo-500" /> Question {currentIdx + 1}
                </h3>
                <p className="text-sm font-black text-slate-850 dark:text-slate-200 leading-relaxed">
                  {questions[currentIdx].question}
                </p>

                {/* Options List */}
                <div className="flex flex-col gap-3">
                  {questions[currentIdx].options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`text-left p-4 rounded-xl border text-xs font-bold transition-all flex items-center gap-3 ${
                        userAnswers[currentIdx] === oIdx
                          ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                          : 'bg-white/40 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-350'
                      }`}
                    >
                      <span className={`h-5 w-5 rounded-full flex items-center justify-center border font-bold text-[10px] ${
                        userAnswers[currentIdx] === oIdx ? 'bg-indigo-500 text-white border-indigo-500' : 'border-slate-300'
                      }`}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation controls */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className="btn-glass-secondary text-xs disabled:opacity-50 !py-2.5"
                >
                  Previous
                </button>

                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="btn-glass-secondary text-xs !py-2.5"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={submitQuiz}
                    disabled={isSubmitting}
                    className="btn-glass-primary text-xs !py-2.5"
                  >
                    {isSubmitting ? 'Evaluating...' : 'Submit Answers'}
                  </button>
                )}
              </div>

            </div>
          ) : (
            <p className="text-center text-xs text-slate-400 font-bold italic">No questions found.</p>
          )}
        </div>
      )}

      {/* STEP 3: MOCK SUMMARY SCORE CARD */}
      {step === 'summary' && summaryResults && (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          <div className="text-center space-y-2">
            <span className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20 inline-block animate-bounce">
              <CheckCircle size={22} />
            </span>
            <h2 className="text-2xl font-black">Aptitude Score Summary</h2>
            <p className="text-slate-400 font-bold text-xs">Verify mathematical results, chosen parameters, and step answers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* Left box: score gauge */}
            <div className="glass-card p-6 flex flex-col justify-between items-center text-center">
              <h3 className="font-extrabold text-sm self-start">Overall Grade</h3>
              
              <div className="my-6">
                <p className="text-5xl font-black text-indigo-500">{summaryResults.score}%</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                  {summaryResults.correctCount} / {summaryResults.total} Correct
                </p>
              </div>

              <div className="w-full pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex gap-2">
                <button
                  onClick={() => setStep('config')}
                  className="w-full btn-glass-secondary text-xs !py-2.5"
                >
                  New Quiz
                </button>
              </div>
            </div>

            {/* Right box: improvements suggestions */}
            <div className="md:col-span-2 glass-card p-6 space-y-6">
              
              {/* Weak areas */}
              {summaryResults.weakAreas?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm text-red-500 flex items-center gap-1.5">
                    <AlertTriangle size={16} /> Attention Required Topics:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {summaryResults.weakAreas.map((wa, i) => (
                      <span key={i} className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-extrabold px-3 py-1 rounded-xl">
                        {wa}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-indigo-500 flex items-center gap-1.5">
                  <BarChart2 size={16} /> Recommended Optimization Steps:
                </h4>
                <ul className="space-y-2.5 text-xs font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                  {summaryResults.improvements?.map((imp, i) => (
                    <li key={i} className="flex gap-2 items-center">
                      <span className="h-2 w-2 rounded-full bg-indigo-500" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>

          {/* Step explanations checklist */}
          <div className="glass-card p-6 space-y-6">
            <h3 className="font-extrabold text-sm">Arithmetic Step Explanations</h3>
            
            <div className="space-y-6">
              {questions.map((q, idx) => {
                const isCorrect = userAnswers[idx] === q.answerIndex;
                return (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-850 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-200/30 dark:border-slate-800/50 pb-2">
                      <span className="text-xs font-black text-slate-400 uppercase">Question {idx + 1}</span>
                      <span className={`text-xs font-black uppercase ${isCorrect ? 'text-emerald-500' : 'text-red-500'}`}>
                        {isCorrect ? 'Correct ✅' : 'Incorrect ❌'}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="font-bold text-slate-800 dark:text-slate-200">Question:</p>
                      <p className="text-slate-400 font-semibold leading-relaxed">{q.question}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-500">
                      <div>
                        <p>Chosen: <span className={isCorrect ? 'text-emerald-500' : 'text-red-500'}>
                          {userAnswers[idx] !== undefined ? q.options[userAnswers[idx]] : 'Unanswered'}
                        </span></p>
                      </div>
                      <div>
                        <p>Correct: <span className="text-emerald-500">{q.options[q.answerIndex]}</span></p>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs pt-2 border-t border-slate-250/20 dark:border-slate-800/20">
                      <p className="font-bold text-indigo-400">Mathematical Steps:</p>
                      <p className="text-slate-550 dark:text-slate-400 font-semibold leading-relaxed italic">
                        {q.explanation}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
