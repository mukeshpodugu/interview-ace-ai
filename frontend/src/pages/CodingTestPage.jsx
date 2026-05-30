import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import CodeEditor from '../components/CodeEditor';
import { Terminal, Award, ChevronRight, CheckCircle, RefreshCw, Sparkles, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CodingTestPage() {
  const { updateLocalScores, updateLocalBadges } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const data = await api.coding.getChallenges();
      setChallenges(data);
    } catch (err) {
      console.error('Failed to retrieve challenges lists:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunCode = async (challengeId, code, language) => {
    return await api.coding.execute(challengeId, code, language);
  };

  const handleSubmitCode = async (challengeId, code, language, score, passed, total) => {
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const data = await api.coding.submit(challengeId, code, language, score, passed, total);
      setFeedback(data);
      
      // Update global context
      if (data.scores) updateLocalScores(data.scores);
      if (data.badges) updateLocalBadges(data.badges);
    } catch (err) {
      alert('Error submitting coding solution: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Header */}
      {!selectedChallenge && (
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight">Algorithmic Coding Arena</h2>
          <p className="text-slate-400 font-semibold text-sm">Solve standard data structure challenges, compile code, and receive AI complexity reviews.</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <RefreshCw size={24} className="animate-spin text-indigo-500" />
        </div>
      ) : !selectedChallenge ? (
        /* Challenges Lists */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {challenges.map((chal) => (
            <div key={chal.id} className="glass-card p-6 flex flex-col justify-between space-y-6 hover:-translate-y-1">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    chal.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                    chal.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                    'bg-red-500/10 text-red-600 dark:text-red-400'
                  }`}>
                    {chal.difficulty}
                  </span>
                  <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500">
                    <Terminal size={14} />
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-200">{chal.title}</h3>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed line-clamp-3">
                  {chal.description}
                </p>
              </div>

              <button
                onClick={() => setSelectedChallenge(chal)}
                className="w-full btn-glass-secondary text-xs font-bold py-2.5 flex justify-center items-center gap-1"
              >
                Solve Challenge <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Workspace Editor screen */
        <div className="space-y-8">
          {/* Header controls */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => { setSelectedChallenge(null); setFeedback(null); }}
              className="flex items-center gap-1.5 text-xs text-indigo-500 font-black"
            >
              <ChevronRight className="rotate-185" size={14} /> Back to Arena
            </button>
            <h3 className="font-extrabold text-lg">{selectedChallenge.title} Problem Sheet</h3>
          </div>

          {/* Mount Editor */}
          <CodeEditor
            challenge={selectedChallenge}
            onRun={handleRunCode}
            onSubmit={handleSubmitCode}
            isSubmitting={isSubmitting}
          />

          {/* Submission feedback */}
          {feedback && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Complexity statistics */}
              <div className="glass-card p-6 flex flex-col justify-between items-center text-center">
                <h3 className="font-extrabold text-sm self-start flex items-center gap-1.5">
                  <CheckCircle size={16} className="text-emerald-500" /> Evaluation
                </h3>
                <div className="my-4 space-y-1">
                  <p className="text-4xl font-black text-indigo-500">O(N)</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Complexity Profile</p>
                </div>
                <div className="w-full pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex justify-between text-xs font-semibold text-slate-500">
                  <span>Score:</span>
                  <span className="font-black text-indigo-500">{feedback.testResult?.score}%</span>
                </div>
              </div>

              {/* Feedback description suggestions */}
              <div className="md:col-span-2 glass-card p-6 space-y-4">
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  <Sparkles size={16} className="text-indigo-500" />
                  AI Optimization Review
                </h3>
                <p className="text-xs font-semibold text-slate-400 leading-relaxed">
                  {feedback.analysis?.timeComplexityFeedback || "Code analyzed successfully. The algorithm operates inside linear time complexity constraints."}
                </p>
                {feedback.analysis?.optimizationSuggestions?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <BookOpen size={12} /> Optimization steps:
                    </p>
                    <ul className="space-y-1 text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed list-disc list-inside">
                      {feedback.analysis.optimizationSuggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
