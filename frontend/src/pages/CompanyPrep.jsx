import React, { useState } from 'react';
import { Award, BookOpen, Check, Target, ChevronRight, HelpCircle, AlertCircle } from 'lucide-react';

export default function CompanyPrep() {
  const [selectedCompany, setSelectedCompany] = useState('TCS');

  const COMPANIES = {
    TCS: {
      name: 'TCS (Tata Consultancy Services)',
      tagline: 'TCS NQT & Digital Recruitment Guides',
      pattern: [
        { round: 'Quantitative Aptitude', details: '20 questions, 40 minutes limit.' },
        { round: 'Logical & Verbal Ability', details: '20 logical reasoning questions, 30 minutes.' },
        { round: 'Basic Coding Round', details: '2 programming problems (e.g. String manipulation or Matrix loops), 45 minutes.' },
        { round: 'Technical + HR Interview', details: '1-on-1 panel evaluating projects, database schemas, and OOP concepts.' }
      ],
      questions: [
        "Write a program to count structural vowels and consonants in a string.",
        "Calculate the nth element in a Fibonacci sequence under O(logN) time limits.",
        "What is index indexing in SQL databases and how does it speed up queries?"
      ],
      tips: [
        "Focus on TCS NQT coding structures; they evaluate boundary test conditions strictly.",
        "Attempt the quantitative portion first, since it carries high selection weights.",
        "Ensure your projects outline clear personal contributions and architectural diagrams."
      ]
    },
    Accenture: {
      name: 'Accenture',
      tagline: 'Accenture ASE & FSE recruitment sheets',
      pattern: [
        { round: 'Cognitive & Technical Assessment', details: '50 questions tracking MS Office, Networking, Pseudocodes, and logic.' },
        { round: 'Coding Assessment', details: '2 algorithmic questions (Arrays, Sorting, Maps), 45 minutes.' },
        { round: 'Communication Test', details: 'Speaking, listening, and sentence structural corrections (20 mins).' },
        { round: 'HR Interview Round', details: 'STAR based questions mapping leadership and client stakeholders conflict resolutions.' }
      ],
      questions: [
        "Given an array, rearrange elements such that positive and negative values alternate.",
        "Write a pseudocode to check if a binary search tree is balanced.",
        "Explain cloud configurations: SaaS vs PaaS vs IaaS."
      ],
      tips: [
        "Prepare basic pseudocodes thoroughly (e.g., bitwise operators, loops execution outputs).",
        "Practise the Web Speech recorder to clear the communication assessment tests.",
        "Explain projects detailing how technology choices improved candidate user metrics."
      ]
    },
    Deloitte: {
      name: 'Deloitte',
      tagline: 'Deloitte Analyst Profiles Assessment Guides',
      pattern: [
        { round: 'Aptitude & English', details: 'Quantitative, logical reasoning, and English grammar (45 mins).' },
        { round: 'Technical Assessment Quiz', details: 'OOP principles, SQL query joins, and operating system basics (30 mins).' },
        { round: 'Case Study / Technical interview', details: 'System design problem sheets and analytical reasoning boards.' },
        { round: 'HR Mock Round', details: 'Cultural alignment checks and team communication tests.' }
      ],
      questions: [
        "Write a SQL query to extract the second highest salary from an Employee database.",
        "Design a high-level structure for an online ticket booking aggregator.",
        "Explain MVC architecture patterns in web applications."
      ],
      tips: [
        "Be ready for basic system designs (e.g., REST API creations, database primary keys).",
        "Solve SQL join questions, aggregate queries (GROUP BY, HAVING), and index parameters.",
        "Maintain strong eye alignment scores on behavioral interview sessions."
      ]
    }
  };

  const companyList = [
    { key: 'TCS', name: 'TCS' },
    { key: 'Accenture', name: 'Accenture' },
    { key: 'Deloitte', name: 'Deloitte' }
  ];

  const info = COMPANIES[selectedCompany];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header details */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight">Corporate Placement Prep</h2>
        <p className="text-slate-400 font-semibold text-sm">Review previous recruitment question dumps, exam timelines, and interview tips for target companies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* Left Side: Corporate selectors */}
        <div className="glass-card p-4 flex flex-col gap-2">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 p-2">Company Catalogs</h3>
          {companyList.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCompany(c.key)}
              className={`text-left py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
                selectedCompany === c.key
                  ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30'
                  : 'bg-white/40 dark:bg-slate-900/40 text-slate-500 border-slate-200 dark:border-slate-800'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Right Side: Guide content */}
        <div className="md:col-span-3 space-y-8">
          
          {/* Card title banner */}
          <div className="glass-card p-6 bg-gradient-to-br from-indigo-900/5 to-pink-500/5">
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-200">{info.name}</h3>
            <p className="text-xs text-slate-400 font-bold mt-1">{info.tagline}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Exam Pattern checklist */}
            <div className="glass-card p-6 space-y-4">
              <h4 className="font-extrabold text-sm text-indigo-500 flex items-center gap-1.5 border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
                <Target size={16} /> Recruitment Process
              </h4>
              <div className="space-y-4">
                {info.pattern.map((p, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="h-5 w-5 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      {p.round}
                    </p>
                    <p className="text-slate-400 font-semibold leading-relaxed pl-7">{p.details}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation tips list */}
            <div className="glass-card p-6 space-y-4">
              <h4 className="font-extrabold text-sm text-emerald-500 flex items-center gap-1.5 border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
                <BookOpen size={16} /> Placement Tips
              </h4>
              <div className="space-y-3">
                {info.tips.map((t, idx) => (
                  <div key={idx} className="flex gap-3 text-xs leading-relaxed font-semibold text-slate-500 dark:text-slate-400">
                    <span className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={12} />
                    </span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Previous questions lists */}
          <div className="glass-card p-6 space-y-4">
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5 border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
              <HelpCircle size={16} className="text-indigo-500" /> Selected Previous Exam Questions
            </h4>
            <div className="space-y-3 font-semibold text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {info.questions.map((q, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-850 rounded-xl">
                  {q}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
