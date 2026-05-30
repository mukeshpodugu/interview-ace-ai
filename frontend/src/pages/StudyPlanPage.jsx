import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Calendar, CheckCircle2, Circle, RefreshCw, Sparkles, BookOpen } from 'lucide-react';

export default function StudyPlanPage() {
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      const data = await api.studyPlan.get();
      setPlan(data);
    } catch (err) {
      console.error('Failed to load study plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (taskText) => {
    try {
      const updatedPlan = await api.studyPlan.toggleTask(taskText);
      setPlan(updatedPlan);
    } catch (err) {
      console.error('Failed to toggle milestone checkbox:', err);
    }
  };

  const handleRegenerate = async () => {
    setIsUpdating(true);
    try {
      const updatedPlan = await api.studyPlan.regenerate();
      setPlan(updatedPlan);
      alert('AI has successfully updated your study roadmap targets based on your latest scores!');
    } catch (err) {
      alert('Failed to regenerate roadmap targets: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Compute overall progress metrics
  const getProgress = () => {
    if (!plan) return 0;
    const totalTasks = [
      ...(plan.roadmap?.daily || []),
      ...(plan.roadmap?.weekly || []),
      ...(plan.roadmap?.monthly || [])
    ].length;
    
    if (totalTasks === 0) return 0;
    return Math.round((plan.completedTasks?.length / totalTasks) * 100);
  };

  const renderSection = (title, tasks) => {
    if (!tasks || tasks.length === 0) return null;

    return (
      <div className="space-y-4">
        <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 border-b border-slate-200/50 dark:border-slate-800/50 pb-2 flex items-center gap-1.5">
          <Calendar size={16} className="text-indigo-500" /> {title}
        </h4>
        
        <div className="flex flex-col gap-3">
          {tasks.map((task, i) => {
            const isCompleted = plan.completedTasks?.includes(task);
            return (
              <button
                key={i}
                onClick={() => handleToggle(task)}
                className={`text-left p-4 rounded-2xl border text-xs font-semibold transition-all flex items-start gap-3.5 ${
                  isCompleted
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-400 dark:text-slate-500 line-through'
                    : 'bg-white/40 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:border-slate-350'
                }`}
              >
                <span className="flex-shrink-0 mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  ) : (
                    <Circle size={16} className="text-slate-350 dark:text-slate-700" />
                  )}
                </span>
                <span>{task}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold tracking-tight">AI Customized Study Planner</h2>
          <p className="text-slate-400 font-semibold text-sm">Follow structured roadmaps tailored to your weaknesses and skill targets.</p>
        </div>
        <button
          onClick={handleRegenerate}
          disabled={isUpdating || loading}
          className="btn-glass-primary text-xs !py-3 !px-5 flex items-center gap-1.5 w-full sm:w-auto shadow-md"
        >
          {isUpdating ? (
            <>
              <RefreshCw size={14} className="animate-spin" /> Updating...
            </>
          ) : (
            <>
              <Sparkles size={14} /> Update Roadmap
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <RefreshCw size={24} className="animate-spin text-indigo-500" />
        </div>
      ) : plan ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          
          {/* Progress gauge column */}
          <div className="glass-card p-6 flex flex-col justify-between items-center text-center">
            <h3 className="font-extrabold text-sm self-start flex items-center gap-1.5">
              <BookOpen size={16} className="text-indigo-500" /> Progress
            </h3>
            
            <div className="my-6">
              <p className="text-5xl font-black text-indigo-500">{getProgress()}%</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Milestones Met</p>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${getProgress()}%` }} />
            </div>
          </div>

          {/* Checklist Sections column */}
          <div className="md:col-span-3 space-y-8">
            {renderSection('Daily Practices', plan.roadmap?.daily)}
            {renderSection('Weekly Checkpoints', plan.roadmap?.weekly)}
            {renderSection('Monthly Targets', plan.roadmap?.monthly)}
          </div>

        </div>
      ) : (
        <p className="text-center text-xs text-slate-400 font-bold italic">No study plan targets configured.</p>
      )}

    </div>
  );
}
