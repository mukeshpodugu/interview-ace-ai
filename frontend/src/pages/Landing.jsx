import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Video, Target, Terminal, Percent, Sparkles, Star, ChevronDown, Check, Phone, Mail, MapPin } from 'lucide-react';

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      icon: Video,
      title: 'AI Mock Interviews',
      desc: 'Practice HR, behavioral, and technical mock interviews. Receive instant follow-up questions tailored to your experience.',
      path: '/mock-interviews'
    },
    {
      icon: Target,
      title: 'Webcam Face & Speech Trackers',
      desc: 'Real-time eye contact monitoring, attention levels checking, and speaking pace/filler word counters.',
      path: '/mock-interviews'
    },
    {
      icon: Terminal,
      title: 'Coding Arena',
      desc: 'Solve algorithms in JS, Python, Java, and C++. Receive AI reviews detailing space complexity and code optimization suggestions.',
      path: '/coding-arena'
    },
    {
      icon: Percent,
      title: 'Aptitude Assessment Mocks',
      desc: 'Prepare for selection rounds with timed numerical, verbal reasoning, and logical quizzes.',
      path: '/aptitude-tests'
    }
  ];

  const pricing = [
    {
      name: 'Starter Plan',
      price: '$0',
      period: 'forever',
      features: [
        '3 Mock Interviews per month',
        'Basic speech speed evaluation',
        '2 Resume ATS check uploads',
        'Access to standard coding editor',
        'Topic-wise Aptitude practices'
      ],
      cta: 'Start Prep Free',
      isPro: false
    },
    {
      name: 'Pro Candidate',
      price: '$29',
      period: 'month',
      features: [
        'Unlimited Mock Interviews (HR & Tech)',
        'Full Webcam Eye Contact & Face Tracking',
        'Unlimited AI Resume Analysis checks',
        'Time & Space Complexity optimization advice',
        'Full placement guides for TCS, Wipro, Accenture',
        'Regenerate personalized daily study roadmaps'
      ],
      cta: 'Upgrade to Pro',
      isPro: true
    }
  ];

  const faqs = [
    {
      q: "How does the webcam eye contact and attention tracking work?",
      a: "The tool requests browser webcam streaming access and uses HTML5 canvas tracking scripts to measure eye alignments, face centers, and pixel shifts. It calculates a composure and attention rating in real-time without storing video feeds, keeping the session fully private."
    },
    {
      q: "Can the AI parse resume text from scanned images?",
      a: "No, the PDF Resume analyzer extracts raw text characters from document formats like DOCX or text-based PDFs. For the best accuracy, ensure your resume template is editable and not a flat scanned image."
    },
    {
      q: "Do I need a Google Gemini API Key to run this platform?",
      a: "No, the backend server is configured with smart rules-based fallback engines. If no API key is specified in the environments, it will seamlessly run in Mock Sandbox mode, generating realistic feedback cards, scores, and questions."
    }
  ];

  return (
    <div className="space-y-24 pb-20 overflow-x-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative pt-16 pb-8 md:pt-28 md:pb-12 text-center max-w-5xl mx-auto px-4">
        
        {/* Glow Spheres */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 h-56 w-56 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-6 relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Unlock Your Dream Engineering Role with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              AI Mock Prep
            </span>
          </h1>

          <p className="text-base md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-semibold">
            InterviewAce AI analyzes your resume, conducts webcam-powered mock interviews, tracks voice fillers, and reviews code compiler complexities. Build ultimate interview readiness today.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Link to="/auth?signup=true" className="btn-glass-primary text-base px-8 py-3.5">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <a href="#features" className="btn-glass-secondary text-base px-8 py-3.5">
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* 2. Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 scroll-mt-20">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight">Features Configured for Placement Success</h2>
          <p className="text-slate-400 font-bold max-w-lg mx-auto text-sm">Everything you need to clear Aptitude, Technical, and HR selection stages.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Link
                key={idx}
                to={isAuthenticated ? feat.path : '/auth'}
                className="glass-card p-6 space-y-4 hover:-translate-y-1 block text-left"
              >
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 dark:text-indigo-400 border border-indigo-500/20">
                  <Icon size={20} />
                </div>
                <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">{feat.title}</h3>
                <p className="text-xs text-slate-400 dark:text-slate-450 leading-relaxed font-semibold">
                  {feat.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Testimonials */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight">Success Stories</h2>
          <p className="text-slate-400 font-bold max-w-sm mx-auto text-sm">Candidates placed at top organizations using InterviewAce.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Rahul Sharma", company: "TCS Digital", text: "The Company Prep question bank for TCS was spot on. Solving the simulated coding round helped me clear the exam in under 45 minutes!" },
            { name: "Sneha Reddy", company: "Accenture ASE", text: "I was extremely self-conscious about speech fillers (saying 'like' too often). The Speech evaluation tool tracked my WPM and filler counts, boosting my HR score." },
            { name: "Aman Gupta", company: "Deloitte Analyst", text: "The AI Resume analyzer pointed out missing keywords for analyst profiles. After adjusting headers, my resume pass rate went from 50% to 90%." }
          ].map((t, idx) => (
            <div key={idx} className="glass-card p-6 space-y-4 flex flex-col justify-between">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-amber-500" />)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed font-semibold flex-grow">
                "{t.text}"
              </p>
              <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{t.name}</p>
                <p className="text-[10px] font-bold text-indigo-500">{t.company}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Pricing */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-center">Flexible Prep Pricing</h2>
          <p className="text-slate-400 font-bold max-w-xs mx-auto text-sm text-center">Choose the plan that fits your job hunting timelines.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pricing.map((p, idx) => (
            <div
              key={idx}
              className={`glass-card p-8 flex flex-col relative justify-between ${
                p.isPro ? 'border-2 border-indigo-500/80 neon-glow-indigo' : ''
              }`}
            >
              {p.isPro && (
                <span className="absolute top-0 right-6 -translate-y-1/2 bg-indigo-600 text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                  Recommended Plan
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-slate-200">{p.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-black tracking-tight">{p.price}</span>
                    <span className="text-xs text-slate-400 font-bold">/{p.period}</span>
                  </div>
                </div>

                <ul className="space-y-3.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
                        <Check size={12} />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  to="/auth?signup=true"
                  className={`w-full py-3 rounded-xl font-extrabold text-xs text-center flex items-center justify-center transition-all ${
                    p.isPro
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 active:scale-95'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-800 dark:text-slate-300 border border-slate-200/50 dark:border-slate-800/80'
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FAQs Accordion */}
      <section className="max-w-3xl mx-auto px-4">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
          <p className="text-slate-400 font-bold max-w-xs mx-auto text-sm">Answers to general questions regarding browser tests and AI limits.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-card overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-5 text-left font-extrabold text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all focus:outline-none"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-200 ${activeFaq === idx ? 'rotate-180' : ''}`}
                />
              </button>
              {activeFaq === idx && (
                <div className="p-5 pt-0 text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed border-t border-slate-100 dark:border-slate-800/30 bg-slate-50/20 dark:bg-slate-900/10">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. Contact Form & Maps */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="glass-card overflow-hidden grid grid-cols-1 md:grid-cols-5 border border-slate-200/50 dark:border-slate-800/50">
          {/* Contact Details */}
          <div className="md:col-span-2 bg-gradient-to-tr from-slate-950 to-indigo-950 p-8 text-white flex flex-col justify-between space-y-8">
            <div className="space-y-3">
              <h3 className="text-xl font-black">Developer Contact</h3>
              <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">Created and developed by PODUGU MUKESH. Get in touch for employment or collaboration inquiries.</p>
            </div>
            
            <div className="space-y-4 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-indigo-400" />
                <span>+91 8143999463</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={14} className="text-indigo-400" />
                <span>mukeshpodugu123@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={14} className="text-indigo-400" />
                <span>Hyderabad, India</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 font-bold">Corporate ID: IA-9034-2026</p>
          </div>

          {/* Form */}
          <form className="md:col-span-3 p-8 space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Thank you! Our support team has logged your query.'); }}>
            <h3 className="font-extrabold text-base">Write Us a Message</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Name</label>
                <input type="text" required placeholder="John Doe" className="w-full bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Email</label>
                <input type="email" required placeholder="john@example.com" className="w-full bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Message</label>
              <textarea required rows={4} placeholder="Type support message details here..." className="w-full bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none" />
            </div>

            <button type="submit" className="w-full btn-glass-primary text-xs font-black py-2.5 shadow-md">
              Send Support Query
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
