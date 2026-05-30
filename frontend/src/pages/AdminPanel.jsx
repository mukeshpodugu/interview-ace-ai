import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Settings, Users, Video, Terminal, Percent, RefreshCw, BarChart2, ShieldAlert } from 'lucide-react';

export default function AdminPanel() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const statsData = await api.admin.getStats();
      setStats(statsData);
      
      const uList = await api.admin.getUsers();
      setUsersList(uList);
    } catch (err) {
      console.error('Failed to load admin telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <span className="p-4 bg-red-500/10 text-red-500 rounded-full inline-block animate-pulse">
          <ShieldAlert size={28} />
        </span>
        <h2 className="text-xl font-black">Access Denied</h2>
        <p className="text-xs text-slate-400 font-bold">This area requires administrator privileges. Please log in as an administrator to check settings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header controls */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="space-y-1">
          <h2 className="text-2xl font-black flex items-center gap-2">
            <Settings size={22} className="text-indigo-500" />
            System Administration Panel
          </h2>
          <p className="text-slate-400 font-bold text-xs">Analyze metrics, examine user databases, and monitor AI token usages.</p>
        </div>
        <button
          onClick={fetchAdminData}
          disabled={loading}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 transition-all"
          title="Refresh Data"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <RefreshCw size={24} className="animate-spin text-indigo-500" />
        </div>
      ) : stats ? (
        <div className="space-y-10 animate-in fade-in duration-200">
          
          {/* Telemetry metrics row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Platform Candidates', val: stats.metrics?.users || 0, icon: Users, bg: 'bg-indigo-500/10', color: 'text-indigo-500' },
              { label: 'Mock Interviews', val: stats.metrics?.interviews || 0, icon: Video, bg: 'bg-purple-500/10', color: 'text-purple-500' },
              { label: 'Coding Tests Run', val: stats.metrics?.codingTests || 0, icon: Terminal, bg: 'bg-pink-500/10', color: 'text-pink-500' },
              { label: 'Estimated AI Cost', val: `$${stats.metrics?.estimatedCostUSD || '0.00'}`, icon: BarChart2, bg: 'bg-emerald-500/10', color: 'text-emerald-500' }
            ].map((card, idx) => (
              <div key={idx} className="glass-card p-5 flex flex-col justify-between hover:shadow-lg">
                <div className="flex justify-between items-center">
                  <span className={`p-2 rounded-xl ${card.bg} ${card.color}`}>
                    <card.icon size={16} />
                  </span>
                  <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Metrics</span>
                </div>
                <div className="mt-4">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{card.label}</p>
                  <p className="text-2xl font-black mt-0.5">{card.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* User management list */}
          <div className="glass-card overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
            <div className="p-5 border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-50/20 dark:bg-slate-900/10">
              <h3 className="font-extrabold text-sm">Platform Candidates Log Sheet</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-extrabold uppercase text-[10px]">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4 text-center">Readiness Index</th>
                    <th className="p-4">Member Since</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/55 dark:divide-slate-850 font-semibold text-slate-600 dark:text-slate-350">
                  {usersList.map((usr) => (
                    <tr key={usr._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                      <td className="p-4">{usr.name}</td>
                      <td className="p-4">{usr.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          usr.role === 'admin' ? 'bg-red-500/10 text-red-500' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'
                        }`}>
                          {usr.role}
                        </span>
                      </td>
                      <td className="p-4 text-center font-black text-indigo-500">{usr.scores?.readiness || 50}%</td>
                      <td className="p-4 font-normal text-slate-400">
                        {new Date(usr.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : (
        <p className="text-center text-xs text-slate-400 font-bold italic">No administration stats found.</p>
      )}

    </div>
  );
}
