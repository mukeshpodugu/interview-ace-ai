import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Upload, FileText, CheckCircle2, AlertTriangle, ArrowDownToLine, RefreshCw, Star, Info } from 'lucide-react';

export default function ResumeAnalyzer() {
  const { updateLocalScores, updateLocalBadges } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const triggerUpload = async () => {
    if (!file) return;
    setLoading(true);
    setReport(null);

    try {
      const resData = await api.resume.analyze(file);
      setReport(resData.analysis);
      
      // Update scores globally in Context
      if (resData.scores) {
        updateLocalScores(resData.scores);
      }
      if (resData.badges) {
        updateLocalBadges(resData.badges);
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight">AI Resume & ATS Checker</h2>
        <p className="text-slate-400 font-semibold text-sm">Upload your PDF or DOCX resume to check compliance with recruiter filters.</p>
      </div>

      {!report ? (
        /* Uploader View */
        <div className="max-w-xl mx-auto space-y-6">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300 relative ${
              dragActive
                ? 'border-indigo-500 bg-indigo-500/5'
                : 'border-slate-350 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 hover:border-slate-400 dark:hover:border-slate-700'
            }`}
          >
            <input
              type="file"
              id="resume-file-input"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            
            <div className="space-y-4 flex flex-col items-center justify-center pointer-events-none">
              <span className="p-4 rounded-full bg-indigo-500/10 text-indigo-500">
                <Upload size={24} />
              </span>
              <div>
                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                  {file ? file.name : 'Select or drag Resume file here'}
                </p>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Supports PDF, DOCX, and TXT (Max size: 5MB)</p>
              </div>
            </div>
          </div>

          <button
            onClick={triggerUpload}
            disabled={!file || loading}
            className="w-full btn-glass-primary py-3.5 shadow-md shadow-indigo-500/15"
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="animate-spin" /> Evaluating document parameters...
              </>
            ) : (
              'Upload and Analyze Resume'
            )}
          </button>
        </div>
      ) : (
        /* Reports view */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start printable-report-sheet">
          
          {/* Left Column: ATS Score Gauge */}
          <div className="glass-card p-6 flex flex-col items-center text-center space-y-6">
            <h3 className="font-extrabold text-sm self-start">ATS Performance</h3>
            
            <div className="relative h-36 w-36 flex items-center justify-center">
              {/* Circular Gauge */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#6366f1"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * report.atsScore) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black">{report.atsScore}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase">ATS Score</span>
              </div>
            </div>

            <div className="w-full pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex gap-2">
              <button
                onClick={() => setReport(null)}
                className="flex-1 btn-glass-secondary text-xs !py-2.5"
              >
                Scan Another
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 btn-glass-primary text-xs !py-2.5"
              >
                <ArrowDownToLine size={14} /> Download PDF
              </button>
            </div>
          </div>

          {/* Right Column: Feedback Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1.5 pb-0.5">
              {[
                { id: 'summary', name: 'ATS Checklist' },
                { id: 'keywords', name: 'Missing Keywords' },
                { id: 'strengths', name: 'Strengths & Weaknesses' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-2 text-xs font-extrabold transition-all border-b-2 -mb-0.5 ${
                    activeTab === t.id
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            {activeTab === 'summary' && (
              <div className="glass-card p-6 space-y-4">
                <h4 className="font-extrabold text-sm flex items-center gap-1.5 text-indigo-500">
                  <Info size={16} /> Suggestions to Improve Score
                </h4>
                <ul className="space-y-3 font-semibold text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {report.suggestionsToImprove?.map((sug, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <span className="h-5 w-5 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'keywords' && (
              <div className="glass-card p-6 space-y-6">
                
                {/* Missing keywords */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-sm text-red-500 flex items-center gap-1.5">
                    <AlertTriangle size={16} /> Missing Key ATS Words
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {report.missingKeywords?.map((kw, i) => (
                      <span key={i} className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-extrabold px-3 py-1 rounded-xl">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skill gap analysis */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-sm text-amber-500 flex items-center gap-1.5">
                    <Info size={16} /> Skill Deficit & Gaps
                  </h4>
                  <ul className="space-y-2.5 text-xs font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                    {report.skillGapAnalysis?.map((gap, i) => (
                      <li key={i} className="flex gap-2 items-center">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            )}

            {activeTab === 'strengths' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Strengths */}
                <div className="glass-card p-6 space-y-4">
                  <h4 className="font-extrabold text-sm text-emerald-500 flex items-center gap-1.5">
                    <CheckCircle2 size={16} /> Key Strengths
                  </h4>
                  <ul className="space-y-2.5 text-xs font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                    {report.strengths?.map((str, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <span className="text-emerald-500 mt-0.5">✓</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="glass-card p-6 space-y-4">
                  <h4 className="font-extrabold text-sm text-pink-500 flex items-center gap-1.5">
                    <AlertTriangle size={16} /> Weakness Areas
                  </h4>
                  <ul className="space-y-2.5 text-xs font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                    {report.weaknesses?.map((wk, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <span className="text-pink-500 mt-0.5">!</span>
                        <span>{wk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
