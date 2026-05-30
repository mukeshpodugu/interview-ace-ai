import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Menu, X, Award, LogOut, LayoutDashboard, FileText, Video, Terminal, Percent, Settings, User } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, theme, toggleTheme, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Analyzer', path: '/resume-analyzer', icon: FileText },
    { name: 'Mock Interviews', path: '/mock-interviews', icon: Video },
    { name: 'Coding Arena', path: '/coding-arena', icon: Terminal },
    { name: 'Aptitude Tests', path: '/aptitude-tests', icon: Percent },
    { name: 'Placement Prep', path: '/placement-prep', icon: Award }
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-2 rounded-xl text-white font-bold leading-none shadow-md">
                IA
              </span>
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-500 dark:from-indigo-400 dark:to-purple-400">
                InterviewAce <span className="text-pink-500">AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          {isAuthenticated && (
            <div className="hidden lg:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <Icon size={16} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Controls */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 transition-all duration-200"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200 focus:outline-none"
                >
                  <img
                    src={user.profilePic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`}
                    alt="avatar"
                    className="h-8 w-8 rounded-xl object-cover bg-indigo-100"
                  />
                  <div className="text-left pr-2">
                    <p className="text-xs font-bold leading-tight truncate max-w-[100px]">{user.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Score: {user.scores?.readiness || 0}%</p>
                  </div>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 glass-card p-2 border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900 transition-all duration-200"
                      >
                        <Settings size={16} />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/dashboard"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900 transition-all duration-200"
                    >
                      <User size={16} />
                      User Profile
                    </Link>
                    <hr className="my-1 border-slate-200 dark:border-slate-800" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-all duration-200"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-500 px-4 py-2 transition-all">
                  Sign In
                </Link>
                <Link to="/auth?signup=true" className="btn-glass-primary text-sm !px-5 !py-2.5">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 transition-all"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg border border-slate-200/50 dark:border-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden glass-panel border-r-0 border-l-0 rounded-none bg-white/95 dark:bg-slate-950/95 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
          {isAuthenticated ? (
            <>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm ${
                    isActive(item.path)
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900'
                  }`}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              ))}
              <hr className="my-2 border-slate-200 dark:border-slate-800" />
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  <Settings size={18} />
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center w-full gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-red-500 hover:bg-red-500/10"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link to="/auth" onClick={() => setIsOpen(false)} className="text-center font-bold py-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                Sign In
              </Link>
              <Link to="/auth?signup=true" onClick={() => setIsOpen(false)} className="text-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl">
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
