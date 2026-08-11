import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  Zap,
  Trophy,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Code2,
  CheckCircle,
  Building2,
  ShieldCheck,
  UserCheck,
  Lightbulb,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../components/common/Button';

const RulesAccordion = () => {
  const [openSection, setOpenSection] = useState(null);

  const rules = [
    {
      id: 'plagiarism',
      title: 'Plagiarism & Code Originality',
      content:
        'All code submissions must be developed during the hackathon sprint window. Pre-built templates or existing complete products are strictly prohibited. Open-source libraries, packages, and public APIs are permitted with clear attribution in documentation.',
    },
    {
      id: 'submission',
      title: 'Synopsis & Main Hackathon Submission Guidelines',
      content:
        'Synopsis proposals must be submitted prior to the deadline in PDF or text format (max 2,000 words). Shortlisted candidates will participate in the live hackathon where final submissions require a public GitHub repository link with comprehensive README and a functional live deployment URL.',
    },
    {
      id: 'evaluation',
      title: 'Evaluation Criteria & Judging Protocol',
      content:
        'Submissions are evaluated by Contata Solutions engineering leads across four core metrics: Architectural Quality & Clean Code (30%), Functionality & Feature Completeness (30%), Innovation & Problem Solving (20%), and UI/UX Polish & Documentation (20%).',
    },
    {
      id: 'eligibility',
      title: 'Eligibility & Participation Rules',
      content:
        'Open to individual candidates and students worldwide. Candidates must provide valid contact details upon registration. Submissions received after the designated deadline will not be eligible for prize placement or hiring fast-track consideration.',
    },
  ];

  const toggleSection = (id) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {rules.map((rule) => {
        const isOpen = openSection === rule.id;
        return (
          <div
            key={rule.id}
            className={`border rounded-xl overflow-hidden transition-all duration-200 ${
              isOpen
                ? 'border-orange-500/80 bg-slate-900/90 shadow-[0_0_20px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/50'
                : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
            }`}
          >
            <button
              type="button"
              onClick={() => toggleSection(rule.id)}
              className={`w-full p-4 text-left flex items-center justify-between text-sm font-bold transition-colors cursor-pointer ${
                isOpen ? 'text-orange-400' : 'text-slate-200 hover:text-orange-400'
              }`}
            >
              <span>{rule.title}</span>
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-orange-400 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
              )}
            </button>
            {isOpen && (
              <div className="p-4 pt-3 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 bg-slate-950/60 font-sans">
                {rule.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 selection:bg-orange-500 selection:text-white">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center px-4 pt-12 pb-20 relative overflow-hidden">
        {/* Ambient Glows matching Contata Website (Reddish-Orange Left, Blue Right) */}
        <div className="absolute top-0 -left-40 w-[600px] h-[500px] bg-orange-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-0 -right-40 w-[600px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 mt-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-300 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Contata Solutions Hiring Hackathon 2026
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Innovate. Build. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-400 to-red-500">
              Contata Hackathon 2026
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Showcase your software engineering innovation, solve complex enterprise challenges, and accelerate your career with direct job placement opportunities at Contata Solutions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {isAuthenticated ? (
              <>
                <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                  <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-orange-600/25">
                    Go to Workspace Dashboard <ArrowRight className="w-4 h-4 ml-1 inline" />
                  </Button>
                </Link>
                <Link to="/results">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    View Live Leaderboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-orange-600/25">
                    Register Now <ArrowRight className="w-4 h-4 ml-1 inline" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Candidate Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Clean Subtext Bar - Eligibility Criteria Banner */}
        <div className="mt-12 mb-4 relative z-10 max-w-3xl mx-auto w-full px-4 text-center">
          <div className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/80 border border-slate-800/90 text-xs sm:text-sm text-slate-300 shadow-md backdrop-blur-md hover:border-slate-700/90 transition-colors">
            <span className="text-base shrink-0">🎓</span>
            <span>
              <strong className="text-slate-100 font-bold">Eligibility Criteria:</strong> Only candidates from the <span className="text-orange-400 font-semibold">2025</span> and <span className="text-orange-400 font-semibold">2026</span> graduating batches are eligible to register.
            </span>
          </div>
        </div>

        {/* Important Hackathon Timeline & Roadmap Section - Chevron Arrow Pipeline */}
        <div className="mt-14 max-w-7xl mx-auto w-full relative z-10 px-2 sm:px-4">
          <div className="text-center mb-10">
            <h2 className="text-xs sm:text-sm font-mono font-bold text-sky-400 uppercase tracking-[0.25em] drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]">
              Important Hackathon Timeline & Roadmap
            </h2>
          </div>

          {/* Chevron Pipeline Container - Interlocking Ribbon */}
          <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 lg:gap-0 lg:-space-x-6 relative max-w-7xl mx-auto py-4">

            {/* PHASE 01: Registration Closes */}
            <div className="flex-1 group relative flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:z-30 z-10">
              <div
                className="w-full h-full p-[2px] bg-gradient-to-r from-sky-500 via-sky-400 to-blue-600 shadow-[0_0_20px_rgba(56,189,248,0.25)] group-hover:shadow-[0_0_35px_rgba(56,189,248,0.5)] transition-all"
                style={{
                  clipPath: 'polygon(0% 0%, calc(100% - 30px) 0%, 100% 50%, calc(100% - 30px) 100%, 0% 100%)',
                }}
              >
                <div
                  className="w-full h-full bg-[#0a1222]/95 backdrop-blur-xl p-6 pr-11 flex flex-col justify-between space-y-4"
                  style={{
                    clipPath: 'polygon(0% 0%, calc(100% - 30px) 0%, 100% 50%, calc(100% - 30px) 100%, 0% 100%)',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-inner">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/30 px-2.5 py-1 rounded-full">
                        PHASE 01
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight mb-1">
                      Registration Closes
                    </h3>
                    <p className="text-xl sm:text-2xl font-black text-sky-400 mb-2 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]">
                      Sept 15, 2026
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Open for all software engineers, students, and industry candidates worldwide.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PHASE 02: Synopsis Submission */}
            <div className="flex-1 group relative flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:z-30 z-20">
              <div
                className="w-full h-full p-[2px] bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 shadow-[0_0_20px_rgba(251,191,36,0.25)] group-hover:shadow-[0_0_35px_rgba(251,191,36,0.5)] transition-all"
                style={{
                  clipPath: 'polygon(0% 0%, calc(100% - 30px) 0%, 100% 50%, calc(100% - 30px) 100%, 0% 100%, 30px 50%)',
                }}
              >
                <div
                  className="w-full h-full bg-[#0c1220]/95 backdrop-blur-xl p-6 pl-10 pr-11 flex flex-col justify-between space-y-4"
                  style={{
                    clipPath: 'polygon(0% 0%, calc(100% - 30px) 0%, 100% 50%, calc(100% - 30px) 100%, 0% 100%, 30px 50%)',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                        <Clock className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
                        PHASE 02
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight mb-1">
                      Synopsis Submission
                    </h3>
                    <p className="text-lg sm:text-xl font-black text-amber-400 mb-2 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
                      Sept 18 • 18:00 UTC
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Maximum 2,000 words project proposal submission required for manual review and shortlisting.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PHASE 03: Live 24h Hackathon */}
            <div className="flex-1 group relative flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:z-30 z-20">
              <div
                className="w-full h-full p-[2px] bg-gradient-to-r from-orange-500 via-amber-500 to-red-600 shadow-[0_0_20px_rgba(249,115,22,0.25)] group-hover:shadow-[0_0_35px_rgba(249,115,22,0.5)] transition-all"
                style={{
                  clipPath: 'polygon(0% 0%, calc(100% - 30px) 0%, 100% 50%, calc(100% - 30px) 100%, 0% 100%, 30px 50%)',
                }}
              >
                <div
                  className="w-full h-full bg-[#0e1222]/95 backdrop-blur-xl p-6 pl-10 pr-11 flex flex-col justify-between space-y-4"
                  style={{
                    clipPath: 'polygon(0% 0%, calc(100% - 30px) 0%, 100% 50%, calc(100% - 30px) 100%, 0% 100%, 30px 50%)',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-inner">
                        <Zap className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2.5 py-1 rounded-full">
                        PHASE 03
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight mb-1">
                      Live 24h Hackathon
                    </h3>
                    <p className="text-xl sm:text-2xl font-black text-orange-400 mb-2 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]">
                      Sept 25-26, 2026
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Non-stop sprint. Public GitHub repository and live demo URL submission required.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PHASE 04: Winners & Results */}
            <div className="flex-1 group relative flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:z-30 z-20">
              <div
                className="w-full h-full p-[2px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 shadow-[0_0_20px_rgba(52,211,153,0.25)] group-hover:shadow-[0_0_35px_rgba(52,211,153,0.5)] transition-all"
                style={{
                  clipPath: 'polygon(0% 0%, calc(100% - 30px) 0%, 100% 50%, calc(100% - 30px) 100%, 0% 100%, 30px 50%)',
                }}
              >
                <div
                  className="w-full h-full bg-[#091522]/95 backdrop-blur-xl p-6 pl-10 pr-11 flex flex-col justify-between space-y-4"
                  style={{
                    clipPath: 'polygon(0% 0%, calc(100% - 30px) 0%, 100% 50%, calc(100% - 30px) 100%, 0% 100%, 30px 50%)',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                        PHASE 04
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight mb-1">
                      Winners & Results
                    </h3>
                    <p className="text-xl sm:text-2xl font-black text-emerald-400 mb-2 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
                      Oct 01, 2026
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Official winner declaration, cash prize distribution, and hiring fast-track calls.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-emerald-500/20">
                    <Link
                      to="/results"
                      className="text-xs font-extrabold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1.5 transition-colors group-hover:translate-x-1 duration-200"
                    >
                      <span>View Results Leaderboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Prize Pool Section */}
        <div className="mt-20 max-w-6xl mx-auto w-full bg-slate-900/40 border border-slate-800/80 rounded-[2rem] p-8 md:p-12 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3">
            Prize Pool & Hiring Opportunities
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-16 max-w-2xl mx-auto">
            Cash awards, fast-track interviews, and direct engineering placement opportunities at Contata Solutions.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-end gap-6 pb-6">
            <div className="w-full md:w-1/3 bg-slate-900/80 border border-slate-700/50 rounded-3xl p-8 relative flex flex-col items-center md:pb-12">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-xl mb-6 shadow-inner border border-slate-600">
                2
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">
                1st Runner Up
              </h4>
              <div className="text-3xl sm:text-4xl font-extrabold text-white mb-4">₹15,000</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fast-Track Interview Process
                <br />
                Official Contata Swag Kit
              </p>
            </div>

            <div className="w-full md:w-1/3 bg-slate-900 border-2 border-orange-500/60 rounded-3xl p-10 relative flex flex-col items-center md:-translate-y-8 shadow-2xl shadow-orange-950/30">
              <div className="absolute top-0 inset-x-0 flex justify-center -translate-y-1/2">
                <span className="bg-orange-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  Grand Champion
                </span>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-orange-500/30">
                <Trophy className="w-8 h-8" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-orange-400 uppercase tracking-wider mb-2">
                Winner Overall
              </h4>
              <div className="text-4xl sm:text-5xl font-extrabold text-white mb-4">₹30,000</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Direct Job Offer / Engineering Placement
                <br />
                Keynote Presentation Spot
              </p>
            </div>

            <div className="w-full md:w-1/3 bg-slate-900/80 border border-slate-700/50 rounded-3xl p-8 relative flex flex-col items-center md:pb-12">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-xl mb-6 shadow-inner border border-slate-600">
                3
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">
                2nd Runner Up
              </h4>
              <div className="text-3xl sm:text-4xl font-extrabold text-white mb-4">₹10,000</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Priority Hiring Review
                <br />
                Official Certificate of Achievement
              </p>
            </div>
          </div>
        </div>

        {/* About Contata Section */}
        <div className="mt-28 max-w-5xl mx-auto w-full relative z-10 px-6 sm:px-8">
          <h2 className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest text-center md:text-left mb-6">
            About Contata Solutions
          </h2>
          <p className="text-xl sm:text-2xl md:text-3xl text-slate-200 leading-relaxed font-medium text-center md:text-left">
            <span className="text-orange-500 font-semibold">Contata Solutions</span>, founded in 2000, is a premier software services company headquartered in Minneapolis, US with 5 offices globally including offshore centers in India — a Software Engineering Group based in the Delhi NCR region, back-office support groups based in Nagpur & Indore, and a sales office in Stockholm, Sweden.
          </p>
        </div>

      </section>

      {/* Landing Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-orange-500" />
            <span className="font-semibold text-slate-400">Contata Solutions Hackathon 2026</span>
          </div>
          <div>© 2026 Contata Solutions. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link to="/results" className="hover:text-slate-300 transition-colors">Leaderboard</Link>
            <Link to="/login" className="hover:text-slate-300 transition-colors">Login</Link>
            <Link to="/register" className="hover:text-slate-300 transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
