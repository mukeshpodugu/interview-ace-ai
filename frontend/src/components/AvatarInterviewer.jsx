import React from 'react';

export default function AvatarInterviewer({ state }) {
  // state can be: 'speaking' | 'listening' | 'thinking' | 'idle'

  return (
    <div className="flex flex-col items-center justify-center p-6">
      {/* Avatar viewport container */}
      <div className="relative h-44 w-44 rounded-full flex items-center justify-center bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 border-4 border-slate-700/30 dark:border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Animated Background Grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none opacity-40" />

        {/* Orbit Rings matching current state */}
        {state === 'speaking' && (
          <div className="absolute inset-2 border-2 border-dashed border-indigo-500/30 rounded-full animate-spin [animation-duration:10s]" />
        )}
        {state === 'thinking' && (
          <div className="absolute inset-2 border-2 border-dotted border-pink-500/40 rounded-full animate-spin [animation-duration:4s]" />
        )}
        {state === 'listening' && (
          <div className="absolute inset-2 border-2 border-solid border-emerald-500/20 rounded-full animate-pulse" />
        )}

        {/* Outer Audio ripple waves */}
        {state === 'speaking' && (
          <>
            <div className="absolute h-36 w-36 rounded-full border border-indigo-500/20 animate-ping opacity-60" />
            <div className="absolute h-40 w-40 rounded-full border border-purple-500/10 animate-ping opacity-45 [animation-delay:0.5s]" />
          </>
        )}
        {state === 'listening' && (
          <div className="absolute h-36 w-36 rounded-full border-2 border-emerald-500/30 animate-ping opacity-75" />
        )}

        {/* Core Cyber Face */}
        <div className="relative h-24 w-24 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center shadow-inner z-10">
          
          {/* Eyes */}
          <div className="flex gap-7 mt-2">
            {/* Left Eye */}
            <div className="relative h-3 w-3 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(129,140,248,0.8)]">
              {state === 'thinking' ? (
                <div className="absolute inset-0 bg-pink-400 rounded-full animate-ping shadow-[0_0_10px_rgba(244,114,182,0.8)]" />
              ) : state === 'listening' ? (
                <div className="absolute inset-0 bg-emerald-400 rounded-full animate-pulse" />
              ) : null}
            </div>
            
            {/* Right Eye */}
            <div className="relative h-3 w-3 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(129,140,248,0.8)]">
              {state === 'thinking' ? (
                <div className="absolute inset-0 bg-pink-400 rounded-full animate-ping shadow-[0_0_10px_rgba(244,114,182,0.8)]" />
              ) : state === 'listening' ? (
                <div className="absolute inset-0 bg-emerald-400 rounded-full animate-pulse" />
              ) : null}
            </div>
          </div>

          {/* Mouth / Audio Equalizer bar inside the core face */}
          <div className="h-6 w-16 flex items-center justify-center gap-1.5 mt-5">
            {state === 'speaking' ? (
              <>
                <div className="h-4 w-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                <div className="h-6 w-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.3s]" />
                <div className="h-3 w-1 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="h-5 w-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                <div className="h-2 w-1 bg-purple-500 rounded-full animate-bounce [animation-delay:0.15s]" />
              </>
            ) : state === 'listening' ? (
              <div className="h-1.5 w-12 bg-emerald-400 rounded-full animate-pulse" />
            ) : state === 'thinking' ? (
              <div className="h-1 w-8 bg-pink-400 rounded-full animate-bounce" />
            ) : (
              // Idle state
              <div className="h-1 w-10 bg-indigo-500/50 rounded-full" />
            )}
          </div>
        </div>

        {/* Glass Reflection highlights */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-full" />
      </div>

      {/* State label message under avatar */}
      <div className="mt-3 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          AI Interviewer Status
        </p>
        <p className={`text-xs font-extrabold mt-0.5 ${
          state === 'speaking' ? 'text-indigo-500' :
          state === 'listening' ? 'text-emerald-500' :
          state === 'thinking' ? 'text-pink-500' : 'text-slate-400'
        }`}>
          {state === 'speaking' ? 'Articulating Question' :
           state === 'listening' ? 'Awaiting Voice Input' :
           state === 'thinking' ? 'Synthesizing Response' : 'On Standby'}
        </p>
      </div>
    </div>
  );
}
