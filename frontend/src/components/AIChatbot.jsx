import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, HelpCircle } from 'lucide-react';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! I am your InterviewAce Assistant. Ask me anything about engineering interviews, resumes, or coding optimizations.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const quickPrompts = [
    "Tell me about TCS interview pattern",
    "Explain STAR method for behavioral mocks",
    "How do I optimize nested O(N^2) loops?"
  ];

  const handleSend = (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let replyText = "I'm compiling details for you. The STAR method stands for Situation, Task, Action, and Result. Lay out your answers matching this format!";
      
      const lower = text.toLowerCase();
      if (lower.includes('tcs') || lower.includes('wipro') || lower.includes('infosys')) {
        replyText = "TCS and similar MNCs conduct structured hiring comprising: 1. Quantitative & Logical Aptitude, 2. Verbal Ability, 3. Basic coding executions (like string arrays), and 4. Tech + HR interviews. Head over to our Placement Prep tab to review previous question dumps!";
      } else if (lower.includes('optimize') || lower.includes('loop') || lower.includes('complexity')) {
        replyText = "To optimize nested O(N^2) loops, look for recurring lookup operations. By storing values in a HashMap or a Set during the first iteration, you can access them in O(1) time, bringing the total time complexity down to O(N) linear time at the cost of O(N) space!";
      } else if (lower.includes('star') || lower.includes('behavioral')) {
        replyText = "The STAR method is the gold standard for behavioral interviews:\n1. Situation: Describe the event or problem.\n2. Task: Outline the challenge you needed to solve.\n3. Action: Detail the specific steps you took.\n4. Result: Share the metrics-driven outcome of your actions.";
      } else if (lower.includes('resume') || lower.includes('ats')) {
        replyText = "To boost your resume ATS rating, match keywords to target job descriptions, list quantifiable results (e.g. 'boosted speeds by 40%'), and avoid complex layout diagrams that trip up parsing crawlers. Try uploading your resume to our AI Resume Analyzer!";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: replyText }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 hover:from-indigo-500 hover:to-pink-400 p-4 rounded-2xl shadow-xl hover:shadow-indigo-500/25 active:scale-95 text-white transition-all duration-200"
        aria-label="Open AI Assistant"
      >
        <MessageSquare size={22} className="animate-pulse" />
      </button>

      {/* Slide-out Sidebar Panel */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 glass-panel border-r-0 rounded-none sm:rounded-l-3xl shadow-2xl flex flex-col bg-white/95 dark:bg-slate-950/95 transition-all duration-300 animate-in slide-in-from-right">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                <Sparkles size={16} />
              </span>
              <div>
                <h4 className="font-extrabold text-sm">InterviewAce AI Copilot</h4>
                <p className="text-[10px] text-slate-400 font-bold">Online Support Bot</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-slate-400 hover:text-slate-200 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white font-medium rounded-tr-none'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/30 dark:border-slate-800/50 rounded-tl-none font-semibold'
                  } whitespace-pre-line`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-900 text-slate-400 rounded-2xl px-4 py-2.5 text-xs font-semibold rounded-tl-none flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Prompts Panel */}
          {messages.length === 1 && (
            <div className="px-4 py-2 space-y-1.5">
              <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                <HelpCircle size={12} /> Suggested Topics:
              </p>
              <div className="flex flex-col gap-1">
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(p)}
                    className="text-left bg-slate-50 hover:bg-indigo-500/10 border border-slate-200 dark:bg-slate-900/50 dark:border-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-xl transition-all"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer input form */}
          <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Ask your query here..."
                className="flex-1 bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
              />
              <button
                onClick={() => handleSend(input)}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl active:scale-95 transition-all shadow-md shadow-indigo-500/10"
              >
                <Send size={14} />
              </button>
            </div>
          </div>

        </div>
      )}
    </>
  );
}
