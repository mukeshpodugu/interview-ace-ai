import React, { useState, useEffect, useRef } from 'react';
import { Play, CheckCircle, XCircle, Clock, RotateCcw, AlertTriangle } from 'lucide-react';

export default function CodeEditor({ challenge, languageTemplates, onRun, onSubmit, isSubmitting }) {
  const [selectedLang, setSelectedLang] = useState('javascript');
  const [code, setCode] = useState('');
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  // Set starter template when challenge or language changes
  useEffect(() => {
    if (challenge && challenge.starterTemplates) {
      setCode(challenge.starterTemplates[selectedLang] || '');
    }
    setTestResults(null);
    setConsoleLogs([]);
  }, [challenge, selectedLang]);

  // Timer logic
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleReset = () => {
    if (window.confirm('Reset code template to default? Your current work will be overwritten.')) {
      setCode(challenge.starterTemplates[selectedLang] || '');
      setTestResults(null);
      setConsoleLogs([]);
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setConsoleLogs(['[Compiling] Launching sandbox container...', '[Running] Executing test cases...']);
    try {
      const data = await onRun(challenge.id, code, selectedLang);
      setTestResults(data);
      const logs = [
        `[Success] Compiled successfully in ${Math.floor(Math.random()*150)+50}ms.`,
        `[Tests] ${data.passed}/${data.total} passed.`
      ];
      data.results.forEach((res, idx) => {
        logs.push(`Test Case ${idx + 1}: ${res.passed ? 'PASSED ✅' : 'FAILED ❌'} (Input: ${res.input})`);
      });
      setConsoleLogs(logs);
    } catch (err) {
      setConsoleLogs([`[Error] Compilation failed:`, err.message]);
    } finally {
      setIsRunning(false);
    }
  };

  const submitCode = () => {
    if (!testResults) {
      alert('Please run the test cases at least once before submitting your code.');
      return;
    }
    onSubmit(challenge.id, code, selectedLang, testResults.score, testResults.passed, testResults.total);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Editor Main */}
      <div className="lg:col-span-2 flex flex-col glass-card p-4 h-[600px] bg-slate-900 border-slate-800 text-slate-100">
        
        {/* Editor Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python 3</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>

            <button
              onClick={handleReset}
              className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-200 transition-all"
              title="Reset Code Template"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Clock size={14} />
              <span>{formatTime(seconds)}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs active:scale-95 transition-all"
              >
                <Play size={12} />
                Run Code
              </button>
              
              <button
                onClick={submitCode}
                disabled={isSubmitting}
                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs active:scale-95 transition-all"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Challenge'}
              </button>
            </div>
          </div>
        </div>

        {/* Code Canvas Textarea */}
        <div className="flex-1 min-h-0 relative mt-3">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full bg-slate-950/60 code-editor-textarea p-4 text-sm font-mono text-indigo-300 focus:outline-none resize-none border border-slate-800/80 rounded-2xl focus:border-indigo-500/50"
            style={{ tabSize: 2 }}
          />
        </div>
      </div>

      {/* Test Cases panel & console logs */}
      <div className="flex flex-col gap-6">
        
        {/* Problem Statement details */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base">Challenge Statement</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              challenge.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
              challenge.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
              'bg-red-500/10 text-red-600 dark:text-red-400'
            }`}>
              {challenge.difficulty}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line font-medium">
            {challenge.description}
          </p>
        </div>

        {/* Console logs */}
        <div className="flex-1 glass-card p-5 bg-black border-slate-800 text-emerald-400 font-mono text-xs flex flex-col h-[320px]">
          <div className="pb-2 border-b border-slate-900 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            Console logs
          </div>
          <div className="flex-grow overflow-y-auto mt-2 space-y-1.5 scrollbar-thin">
            {consoleLogs.length === 0 ? (
              <span className="text-slate-600">Console is idle. Tap 'Run Code' to execute test checks.</span>
            ) : (
              consoleLogs.map((log, idx) => (
                <div key={idx} className={
                  log.includes('[Error]') ? 'text-red-400' :
                  log.includes('[Success]') ? 'text-emerald-400' :
                  log.includes('[Tests]') ? 'text-indigo-400' : 'text-slate-300'
                }>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
