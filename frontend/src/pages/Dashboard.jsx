import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Award, FileText, Video, Terminal, Percent, Sparkles, TrendingUp, Calendar, BookOpen, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, updateLocalScores, updateProfile } = useAuth();
  const [activities, setActivities] = useState([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    experienceLevel: user?.experienceLevel || 'Beginner'
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name,
        experienceLevel: user.experienceLevel || 'Beginner'
      });
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const data = await api.interviews.getHistory();
      setActivities(data.slice(0, 4)); // Get latest 4
    } catch (err) {
      console.warn('Failed to load history lists:', err.message);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await updateProfile(profileForm);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile settings: ' + err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  // Compile Chart data structures
  const radarData = [
    { subject: 'Resume', value: user?.scores?.resume || 0, fullMark: 100 },
    { subject: 'Aptitude', value: user?.scores?.aptitude || 0, fullMark: 100 },
    { subject: 'Coding', value: user?.scores?.coding || 0, fullMark: 100 },
    { subject: 'Communication', value: user?.scores?.communication || 0, fullMark: 100 },
  ];

  // Dynamic recommendations
  const getRecommendations = () => {
    const recs = [];
    const scores = user?.scores || {};
    
    if (scores.resume === 0) {
      recs.push({
        title: 'Upload Professional Resume',
        desc: 'Review missing keywords and calculate ATS matching percentages.',
        link: '/resume-analyzer',
        icon: FileText
      });
    }
    if (scores.coding < 60) {
      recs.push({
        title: 'Practice Coding: Two Sum',
        desc: 'Work on array optimizations and solve basic structures to boost scores.',
        link: '/coding-arena',
        icon: Terminal
      });
    }
    if (scores.communication < 65) {
      recs.push({
        title: 'Take an HR Mock Interview',
        desc: 'Evaluate eye contact coordinates and speak responses with fewer vocal filler words.',
        link: '/mock-interviews',
        icon: Video
      });
    }
    if (scores.aptitude < 60) {
      recs.push({
        title: 'Attempt timed Logical reasoning',
        desc: 'Increase problem speed by practicing timed quantitative tests.',
        link: '/aptitude-tests',
        icon: Percent
      });
    }

    if (recs.length === 0) {
      recs.push({
        title: 'Attempt Advanced Contests',
        desc: 'Maintain high readiness by solving monthly algorithm sprints.',
        link: '/coding-arena',
        icon: Sparkles
      });
    }

    return recs;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* 1. Welcomer banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <h2 className="text-2xl md:text-3xl font-black">Welcome back, {user?.name}!</h2>
          <p className="text-xs text-indigo-200 font-bold max-w-lg leading-relaxed">
            Your readiness score is at {user?.scores?.readiness || 50}%. Follow the recommendation list to unlock targeted milestones.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/20 text-center flex-shrink-0 z-10">
          <p className="text-[10px] text-indigo-300 font-extrabold uppercase">Readiness Index</p>
          <p className="text-3xl font-black text-indigo-400 mt-1">{user?.scores?.readiness || 50}%</p>
        </div>
        
        {/* Glow Spheres */}
        <div className="absolute -right-16 -top-16 h-48 w-48 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. Left Column: Analytics Charts */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Metrics Radar Chart Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Radar Visualizer */}
            <div className="glass-card p-6 flex flex-col items-center justify-center min-h-[300px]">
              <h3 className="font-extrabold text-sm mb-4 flex items-center gap-1.5 self-start">
                <TrendingUp size={16} className="text-indigo-500" />
                Readiness Breakdown
              </h3>
              
              <div className="h-60 w-full flex items-center justify-center">
                {user?.scores?.readiness > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="rgba(148, 163, 184, 0.15)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 700 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'currentColor', fontSize: 8 }} />
                      <Radar name="Candidate" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-xs text-slate-400 font-semibold p-4">
                    <AlertCircle className="mx-auto mb-2 text-indigo-500/60" size={24} />
                    Complete mock interviews or upload resumes to generate readiness graphs.
                  </div>
                )}
              </div>
            </div>

            {/* Score Grid Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Resume Check', score: user?.scores?.resume || 0, icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                { name: 'Aptitude Tests', score: user?.scores?.aptitude || 0, icon: Percent, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { name: 'Coding Arena', score: user?.scores?.coding || 0, icon: Terminal, color: 'text-pink-500', bg: 'bg-pink-500/10' },
                { name: 'Communication', score: user?.scores?.communication || 0, icon: Video, color: 'text-purple-500', bg: 'bg-purple-500/10' }
              ].map((item, idx) => (
                <div key={idx} className="glass-card p-4 flex flex-col justify-between hover:shadow-lg">
                  <div className="flex justify-between items-center">
                    <span className={`p-2 rounded-xl ${item.bg} ${item.color}`}>
                      <item.icon size={16} />
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">Max 100</span>
                  </div>
                  <div className="mt-4">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{item.name}</p>
                    <p className="text-2xl font-black mt-0.5">{item.score}%</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Personalized Recommendations */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-base flex items-center gap-1.5">
              <BookOpen size={18} className="text-indigo-500" />
              Recommended Preparation Tasks
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {getRecommendations().map((rec, idx) => {
                const Icon = rec.icon;
                return (
                  <Link key={idx} to={rec.link} className="glass-card p-5 flex gap-4 hover:border-indigo-500/20">
                    <span className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 h-fit">
                      <Icon size={18} />
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200">{rec.title}</h4>
                      <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">{rec.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>

        {/* 3. Right Column: User details, Recent Activities, and Badges */}
        <div className="space-y-8">
          
          {/* Profile Form Updates */}
          <div className="glass-card p-6">
            <h3 className="font-extrabold text-sm mb-4">Prep Profile</h3>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                  className="w-full bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Experience Level</label>
                <select
                  value={profileForm.experienceLevel}
                  onChange={(e) => setProfileForm({ ...profileForm, experienceLevel: e.target.value })}
                  className="w-full bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                >
                  <option value="Beginner">Beginner Candidate</option>
                  <option value="Intermediate">Intermediate Software Engineer</option>
                  <option value="Advanced">Advanced Senior Engineer</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="w-full btn-glass-primary text-xs font-black py-2 shadow-md shadow-indigo-500/10"
              >
                {profileLoading ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          </div>

          {/* Badges Cabinet */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-extrabold text-sm flex items-center gap-1.5">
              <Award size={18} className="text-amber-500" />
              Achievements Cabinet
            </h3>
            {user?.badges?.length > 0 ? (
              <div className="grid grid-cols-4 gap-3">
                {user.badges.map((badge, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/50 dark:border-slate-850 shadow-inner group relative"
                    title={`${badge.name}: ${badge.description}`}
                  >
                    <span className="text-xl text-amber-500">🏆</span>
                    <span className="text-[8px] font-bold text-slate-500 dark:text-slate-400 mt-1 truncate max-w-[50px]">
                      {badge.name}
                    </span>
                    
                    {/* Hover Tooltip Details */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:block z-20 w-44 bg-slate-950 text-white text-[9px] p-2.5 rounded-lg border border-slate-800 shadow-xl leading-normal font-semibold">
                      <p className="font-extrabold text-indigo-400">{badge.name}</p>
                      <p className="text-slate-300 mt-0.5">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-slate-400 font-bold italic">
                No badges earned yet. Solve code tasks or uploads to unlock.
              </p>
            )}
          </div>

          {/* Recent Activity lists */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-extrabold text-sm flex items-center gap-1.5">
              <Calendar size={18} className="text-indigo-500" />
              Recent Activity Feed
            </h3>
            {activities.length > 0 ? (
              <div className="space-y-3.5">
                {activities.map((act) => (
                  <div key={act._id} className="flex justify-between items-center text-xs font-semibold">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {act.category} Mock Interview
                      </p>
                      <p className="text-[9px] text-slate-400 font-bold">
                        {new Date(act.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="font-extrabold text-indigo-500">{act.overallScore}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-slate-400 font-bold italic">
                No mock interviews completed. Awaiting first session start.
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
