import React from 'react';
import { Award, Trophy, Star, ChevronRight, Zap, Target } from 'lucide-react';

export default function Leaderboard() {
  // Pre-seeded ranking boards
  const LEADERBOARD_LIST = [
    { rank: 1, name: 'Siddharth Sen', score: 98, badge: 'Bug Hunter', role: 'Advanced Candidate' },
    { rank: 2, name: 'Priya Iyer', score: 95, badge: 'HR Ace', role: 'Advanced Candidate' },
    { rank: 3, name: 'Vikram Rao', score: 92, badge: 'Analytical Guru', role: 'Intermediate Candidate' },
    { rank: 4, name: 'Demo Candidate', score: 85, badge: 'Resume Verified', role: 'Intermediate Candidate' },
    { rank: 5, name: 'Karan Mehra', score: 78, badge: 'Resume Verified', role: 'Beginner Candidate' }
  ];

  const BADGES_INFO = [
    { name: 'Resume Verified', icon: 'FileText', desc: 'Verify and scan resume ATS score parameters.' },
    { name: 'HR Ace', icon: 'Award', desc: 'Score 80%+ on an HR Mock Interview.' },
    { name: 'Bug Hunter', icon: 'Terminal', desc: 'Score 100% on any coding compiler test.' },
    { name: 'Analytical Guru', icon: 'Percent', desc: 'Score 100% on any timed Aptitude Quiz.' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header section */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight">Leaderboard & Achievements</h2>
        <p className="text-slate-400 font-semibold text-sm">Compare readiness scores with top performing candidates and check badges progress.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Columns: Rankings Lists */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
            <div className="p-5 border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-50/20 dark:bg-slate-900/10 flex justify-between items-center">
              <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                <Trophy size={18} className="text-amber-500" /> Platform Leaderboard
              </h3>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase">Readiness Index</span>
            </div>

            <div className="divide-y divide-slate-200/50 dark:divide-slate-855 font-semibold text-xs text-slate-650 dark:text-slate-350">
              {LEADERBOARD_LIST.map((cand) => (
                <div key={cand.rank} className="flex justify-between items-center p-4 hover:bg-slate-50/40 dark:hover:bg-slate-900/20">
                  <div className="flex items-center gap-4">
                    {/* Rank positions icons */}
                    <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      cand.rank === 1 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                      cand.rank === 2 ? 'bg-slate-300/15 text-slate-500 dark:text-slate-400 border border-slate-350/20' :
                      cand.rank === 3 ? 'bg-amber-700/10 text-amber-800 dark:text-amber-600 border border-amber-700/20' :
                      'bg-slate-100 dark:bg-slate-900 text-slate-400'
                    }`}>
                      {cand.rank}
                    </span>
                    
                    <div className="space-y-0.5">
                      <p className="font-extrabold text-slate-800 dark:text-slate-200">{cand.name}</p>
                      <p className="text-[9px] text-slate-400 font-bold">{cand.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-extrabold text-slate-450 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-lg bg-slate-50/50 dark:bg-slate-900/40">
                      {cand.badge}
                    </span>
                    <span className="font-black text-indigo-500 text-sm">{cand.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Cabinets info & challenges */}
        <div className="space-y-8">
          
          {/* Daily challenges */}
          <div className="glass-card p-6 space-y-4 bg-gradient-to-br from-indigo-500/5 to-pink-500/5">
            <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-indigo-500">
              <Zap size={18} /> Daily Challenge Sprint
            </h3>
            <div className="space-y-2 text-xs font-semibold">
              <p className="font-bold text-slate-800 dark:text-slate-200">Optimal Substring Check</p>
              <p className="text-[10px] text-slate-400 leading-relaxed">Solve coding compiler tasks under linear constraints today to earn the "Bug Hunter" badge.</p>
            </div>
            
            <Link
              to="/coding-arena"
              className="w-full btn-glass-primary text-xs font-extrabold py-2 flex justify-center items-center gap-1 shadow-md shadow-indigo-500/10"
            >
              Start Sprint <ChevronRight size={14} />
            </Link>
          </div>

          {/* Badges references */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-extrabold text-sm flex items-center gap-1.5">
              <Award size={18} className="text-amber-500" /> Unlockable Badges
            </h3>
            
            <div className="space-y-4">
              {BADGES_INFO.map((b, idx) => (
                <div key={idx} className="flex gap-3 text-xs leading-relaxed">
                  <span className="text-2xl mt-0.5">🏆</span>
                  <div className="space-y-0.5 font-semibold">
                    <p className="font-extrabold text-slate-800 dark:text-slate-200">{b.name}</p>
                    <p className="text-[10px] text-slate-400 leading-normal">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
