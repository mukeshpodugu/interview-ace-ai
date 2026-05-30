import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, User, AlertCircle, Chrome } from 'lucide-react';

export default function Auth() {
  const { login, register, googleLogin, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Set default view based on query search parameters
  useEffect(() => {
    if (searchParams.get('signup') === 'true') {
      setIsSignUp(true);
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);

    try {
      if (isForgot) {
        // Mock Forgot Password Send
        setTimeout(() => {
          setMsg('Password reset instructions have been forwarded to your email address.');
          setLoading(false);
        }, 1000);
        return;
      }

      if (isSignUp) {
        await register(formData.name, formData.email, formData.password);
      } else {
        await login(formData.email, formData.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
      setLoading(false);
    }
  };

  const handleGoogleMock = async () => {
    setError('');
    setLoading(true);
    try {
      // Simulate Google Login callback returning standard profiles
      const profile = {
        name: 'PODUGU MUKESH',
        email: 'mukeshpodugu123@gmail.com',
        googleId: 'g_8143999463',
        profilePic: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Mukesh'
      };
      await googleLogin(profile);
      navigate('/dashboard');
    } catch (err) {
      setError('Google Sign-In failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[500px] bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md glass-card p-8 border border-slate-200/50 dark:border-slate-800/50 relative z-10">
        
        {/* Branding header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 mb-2">
            <Sparkles size={20} />
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            {isForgot ? 'Forgot Password?' : isSignUp ? 'Create your Account' : 'Welcome back'}
          </h2>
          <p className="text-xs text-slate-400 font-bold">
            {isForgot ? 'We will email you a secure link to reset credentials' : 'Build ultimate mock interview readiness with AI'}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 mb-4 animate-in fade-in">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
        {msg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 mb-4 animate-in fade-in">
            <AlertCircle size={14} />
            <span>{msg}</span>
          </div>
        )}

        {/* Form controls */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && !isForgot && (
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Rahul Kumar"
                  className="w-full bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                />
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="candidate@example.com"
                className="w-full bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
              />
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {!isForgot && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Password</label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => { setIsForgot(true); setError(''); setMsg(''); }}
                    className="text-[10px] font-bold text-indigo-500 hover:text-indigo-400"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                />
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-glass-primary text-xs font-black py-3 mt-2 shadow-md shadow-indigo-500/10"
          >
            {loading ? 'Processing...' : isForgot ? 'Send Reset Link' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        {/* Third-party mock OAuth logins */}
        {!isForgot && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2">
              <hr className="flex-1 border-slate-200 dark:border-slate-800" />
              <span className="text-[10px] text-slate-400 font-bold uppercase">or continue with</span>
              <hr className="flex-1 border-slate-200 dark:border-slate-800" />
            </div>

            <button
              onClick={handleGoogleMock}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 bg-white/45 dark:bg-slate-950/45 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-extrabold py-2.5 rounded-xl transition-all"
            >
              <Chrome size={14} className="text-red-500" />
              Google Authentication
            </button>
          </div>
        )}

        {/* Navigation toggles */}
        <div className="text-center mt-6">
          {isForgot ? (
            <button
              onClick={() => { setIsForgot(false); setError(''); setMsg(''); }}
              className="text-xs text-indigo-500 hover:text-indigo-400 font-bold"
            >
              Back to Sign In
            </button>
          ) : (
            <p className="text-xs text-slate-400 font-semibold">
              {isSignUp ? 'Already registered?' : 'New to InterviewAce?'}{' '}
              <button
                onClick={() => { setIsSignUp(!isSignUp); setError(''); setMsg(''); }}
                className="text-indigo-500 hover:text-indigo-400 font-black"
              >
                {isSignUp ? 'Sign In here' : 'Create Free Account'}
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
