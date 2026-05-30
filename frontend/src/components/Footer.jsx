import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/50 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500 dark:text-slate-400">
        <p className="flex items-center justify-center gap-1.5 font-medium">
          Made with <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" /> for Placements & Engineering Interviews.
        </p>
        <p className="mt-2 text-xs text-slate-400">
          © {new Date().getFullYear()} InterviewAce AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
