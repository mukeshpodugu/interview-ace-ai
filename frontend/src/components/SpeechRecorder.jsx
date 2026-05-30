import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle, RefreshCw } from 'lucide-react';

export default function SpeechRecorder({ onTranscriptChange, onMetricsChange }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [fillers, setFillers] = useState({ umm: 0, ahh: 0, like: 0, basically: 0 });
  const [speed, setSpeed] = useState(0); // Words Per Minute (WPM)
  const [isSupported, setIsSupported] = useState(true);
  
  const recognitionRef = useRef(null);
  const startTimeRef = useRef(null);
  const wordCountRef = useRef(0);

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }

      if (finalTranscript) {
        setTranscript(prev => {
          const next = prev + finalTranscript;
          analyzeText(next);
          if (onTranscriptChange) onTranscriptChange(next);
          return next;
        });
      }
    };

    rec.onerror = (e) => {
      console.warn('Speech recognition error:', e.error);
      if (e.error === 'not-allowed') {
        setIsRecording(false);
      }
    };

    rec.onend = () => {
      if (isRecording) {
        // Keep listening unless manually stopped
        try {
          recognitionRef.current.start();
        } catch (_) {}
      }
    };

    recognitionRef.current = rec;
  }, [isRecording]);

  const startRecording = () => {
    if (!isSupported) return;
    setTranscript('');
    setFillers({ umm: 0, ahh: 0, like: 0, basically: 0 });
    setSpeed(0);
    startTimeRef.current = Date.now();
    wordCountRef.current = 0;
    setIsRecording(true);

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error('Speech recognition failed to start:', e);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    try {
      recognitionRef.current.stop();
    } catch (_) {}
  };

  const analyzeText = (text) => {
    const words = text.toLowerCase().split(/\s+/).filter(Boolean);
    wordCountRef.current = words.length;

    // Detect filler words
    const counts = { umm: 0, ahh: 0, like: 0, basically: 0 };
    words.forEach(w => {
      if (/um+|uh+/.test(w)) counts.umm++;
      else if (/ah+/.test(w)) counts.ahh++;
      else if (w === 'like') counts.like++;
      else if (w === 'basically') counts.basically++;
    });
    
    setFillers(counts);

    // Calculate words per minute
    const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
    const computedSpeed = elapsedMinutes > 0 ? Math.round(words.length / elapsedMinutes) : 0;
    setSpeed(computedSpeed);

    // Bubble metrics up
    const totalFillers = Object.values(counts).reduce((a, b) => a + b, 0);
    if (onMetricsChange) {
      onMetricsChange({
        fillerCount: totalFillers,
        speed: computedSpeed || 110,
        clarity: Math.max(100 - (totalFillers * 5), 50)
      });
    }
  };

  const handleManualTextChange = (e) => {
    const text = e.target.value;
    setTranscript(text);
    if (onTranscriptChange) onTranscriptChange(text);

    // Simulate word speeds for manual typing as normal typing is slower than speaking
    const words = text.split(/\s+/).filter(Boolean).length;
    
    // Simple mock metrics
    const lower = text.toLowerCase();
    const counts = {
      umm: (lower.match(/\bumm\b|\buh\b/g) || []).length,
      ahh: (lower.match(/\bahh\b/g) || []).length,
      like: (lower.match(/\blike\b/g) || []).length,
      basically: (lower.match(/\bbasically\b/g) || []).length
    };
    
    setFillers(counts);
    const totalFillers = Object.values(counts).reduce((a, b) => a + b, 0);
    
    // Simulated speed
    const mockSpeed = Math.round(words * 2.5); // scaling typing to verbal simulation
    setSpeed(mockSpeed);

    if (onMetricsChange) {
      onMetricsChange({
        fillerCount: totalFillers,
        speed: mockSpeed || 100,
        clarity: Math.max(100 - (totalFillers * 5), 50)
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Speech Visualizer HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 p-3 rounded-2xl text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Filler words</p>
          <p className="text-xl font-extrabold text-indigo-500 mt-0.5">
            {Object.values(fillers).reduce((a, b) => a + b, 0)}
          </p>
        </div>
        <div className="bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 p-3 rounded-2xl text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pace (WPM)</p>
          <p className={`text-xl font-extrabold mt-0.5 ${
            speed > 160 ? 'text-amber-500' : speed > 90 ? 'text-emerald-500' : speed === 0 ? 'text-slate-400' : 'text-amber-500'
          }`}>
            {speed} {speed > 0 && <span className="text-xs font-semibold">{speed > 160 ? 'Fast' : speed > 90 ? 'Perfect' : 'Slow'}</span>}
          </p>
        </div>
        <div className="bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 p-3 rounded-2xl text-center col-span-2">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Detailed Fillers</p>
          <p className="text-[11px] font-semibold text-slate-500 mt-1 flex justify-center gap-2">
            <span>Umm: {fillers.umm}</span>
            <span>Ahh: {fillers.ahh}</span>
            <span>Like: {fillers.like}</span>
            <span>Basically: {fillers.basically}</span>
          </p>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex gap-2">
        {isSupported ? (
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-md active:scale-95 ${
              isRecording
                ? 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff size={18} className="animate-pulse" /> Stop Recording
              </>
            ) : (
              <>
                <Mic size={18} /> Tap to Speak
              </>
            )}
          </button>
        ) : (
          <div className="flex-1 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 p-2.5 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={16} />
            <span>Voice-transcription unsupported in this browser. Please type responses in the textbox below.</span>
          </div>
        )}
      </div>

      {/* Answer Input Textarea */}
      <div className="relative">
        <textarea
          value={transcript}
          onChange={handleManualTextChange}
          placeholder="Speak or type your interview response here. Make sure your points cover the target questions..."
          className="w-full h-36 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-sm transition-all focus:border-indigo-500/80 resize-none font-medium leading-relaxed"
          disabled={isRecording}
        />
        {isRecording && (
          <div className="absolute right-4 bottom-4 flex items-center gap-1.5 text-xs text-red-500 font-bold bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
            <span>Transcribing Live...</span>
          </div>
        )}
      </div>
    </div>
  );
}
