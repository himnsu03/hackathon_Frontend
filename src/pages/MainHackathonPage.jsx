import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hackathonApi } from '../services/hackathonApi';
import { synopsisApi } from '../services/synopsisApi';
import { problemStatementService } from '../services/problemStatementService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { CountdownTimer } from '../components/common/CountdownTimer';
import {
  Terminal,
  Play,
  GitBranch,
  Globe,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Award,
  Clock,
  Lightbulb,
  FileCheck2,
  CalendarCheck,
} from 'lucide-react';

export const MainHackathonPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [statusData, setStatusData] = useState(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('user_details') || '{}');
      const userId = savedUser?.id;
      if (userId) {
        const cachedStart = localStorage.getItem(`hackathon_start_${userId}`);
        const cachedDeadline = localStorage.getItem(`hackathon_deadline_${userId}`);
        if (cachedStart && cachedDeadline) {
          const diff = Math.max(0, Math.floor((new Date(cachedDeadline).getTime() - Date.now()) / 1000));
          if (diff > 0) {
            return {
              status: 'IN_PROGRESS',
              assignmentStartTime: cachedStart,
              deadline: cachedDeadline,
              remainingSeconds: diff,
            };
          }
        }
      }
    } catch (e) {
      // Ignore fallback
    }
    return null;
  });

  const [problemStatement, setProblemStatement] = useState(null);
  const [evalCriteria, setEvalCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [globalConfig, setGlobalConfig] = useState(null);

  // Form State
  const [githubUrl, setGithubUrl] = useState('');
  const [liveAppUrl, setLiveAppUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Countdown timer server sync
  const [timeRemaining, setTimeRemaining] = useState(() => {
    if (statusData?.remainingSeconds) return statusData.remainingSeconds;
    if (statusData?.deadline) {
      return Math.max(0, Math.floor((new Date(statusData.deadline).getTime() - Date.now()) / 1000));
    }
    return 0;
  });

  const fetchHackathonData = async () => {
    try {
      const [statusResult, problemResult, criteriaResult] = await Promise.allSettled([
        hackathonApi.getStatus(),
        hackathonApi.getProblemStatement(),
        hackathonApi.getPublicHackathonAiCriteria(1),
      ]);

      const firstRejected = [statusResult, problemResult].find((r) => r.status === 'rejected');
      if (firstRejected) {
        const errObj = firstRejected.reason;
        const statusCode = errObj?.status || errObj?.response?.status;
        if (statusCode === 403) {
          navigate('/dashboard', {
            state: { warning: 'The hackathon environment is strictly accessible to candidates with Shortlisted synopses.' },
            replace: true,
          });
          return;
        }
      }

      if (statusResult.status === 'fulfilled' && statusResult.value) {
        const statusRes = statusResult.value;
        const currentUserId = user?.id || JSON.parse(localStorage.getItem('user_details') || '{}')?.id;

        const activeStart = statusRes.assignmentStartTime || (currentUserId ? localStorage.getItem(`hackathon_start_${currentUserId}`) : null);
        const activeDeadline = statusRes.deadline || (currentUserId ? localStorage.getItem(`hackathon_deadline_${currentUserId}`) : null);

        const updatedStatus = {
          ...statusRes,
          assignmentStartTime: activeStart || statusRes.assignmentStartTime,
          deadline: activeDeadline || statusRes.deadline,
          status: statusRes.status !== 'NOT_STARTED' ? statusRes.status : (activeStart ? 'IN_PROGRESS' : 'NOT_STARTED'),
        };

        setStatusData(updatedStatus);

        if (activeStart && currentUserId) {
          localStorage.setItem(`hackathon_start_${currentUserId}`, activeStart);
        }
        if (activeDeadline && currentUserId) {
          localStorage.setItem(`hackathon_deadline_${currentUserId}`, activeDeadline);
        }

        if (statusRes.remainingSeconds !== undefined && statusRes.remainingSeconds > 0) {
          setTimeRemaining(statusRes.remainingSeconds);
        } else if (activeDeadline) {
          const diff = Math.max(0, Math.floor((new Date(activeDeadline).getTime() - Date.now()) / 1000));
          setTimeRemaining(diff);
        }

        if (statusRes.githubRepoUrl) setGithubUrl(statusRes.githubRepoUrl);
        if (statusRes.liveAppUrl) setLiveAppUrl(statusRes.liveAppUrl);
      }

      // Hackathon AI Criteria from Admin table
      if (criteriaResult.status === 'fulfilled' && Array.isArray(criteriaResult.value) && criteriaResult.value.length > 0) {
        setEvalCriteria(criteriaResult.value);
      }

      const backendProblem = problemResult.status === 'fulfilled' ? problemResult.value : null;

      // Match candidate's assigned problem statement
      const adminStatements = problemStatementService.getStatements();
      const matchedProblem = adminStatements.find(
        (ps) => ps.id === backendProblem?.problemId || ps.id === backendProblem?.id
      );

      if (matchedProblem) {
        setProblemStatement(matchedProblem);
      } else if (backendProblem) {
        setProblemStatement({
          id: backendProblem.problemId || backendProblem.id || 'PS-2026-MAIN',
          title: backendProblem.title,
          category: 'Main Track',
          description: backendProblem.description,
          requirements: backendProblem.requirements,
        });
      } else {
        setProblemStatement({
          id: 'PS-SMART-CITY-01',
          title: 'Smart Waste Management System',
          category: 'IoT & Smart Cities',
          description:
            'Urban areas generate large amounts of waste every day. Build an IoT sensor monitoring platform with AI route optimization for waste collection.',
        });
      }
    } catch (err) {
      const statusCode = err?.status || err?.response?.status;
      if (statusCode === 403) {
        navigate('/dashboard', {
          state: { warning: 'The hackathon environment is strictly accessible to candidates with Shortlisted synopses.' },
          replace: true,
        });
        return;
      }
      toast.error('Failed to sync hackathon workspace data.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load + 60s Server Sync Polling to correct drift
  useEffect(() => {
    fetchHackathonData();
    // Also fetch public config for window validation
    fetch('/api/public/hackathon-config')
      .then(r => r.ok ? r.json() : null)
      .then(cfg => { if (cfg) setGlobalConfig(cfg); })
      .catch(() => {});

    const pollInterval = setInterval(() => {
      fetchHackathonData();
    }, 60000); // 60s server sync polling

    return () => clearInterval(pollInterval);
  }, []);

  const handleStartHackathon = async () => {
    // Check hackathon window
    const now = new Date();
    if (globalConfig?.hackathonStartDate && now < new Date(globalConfig.hackathonStartDate)) {
      const openDate = new Date(globalConfig.hackathonStartDate).toLocaleString();
      toast.warning(`The hackathon has not started yet. Coding sprint begins on ${openDate}. Please come back then!`);
      return;
    }
    if (globalConfig?.hackathonEndDate && now > new Date(globalConfig.hackathonEndDate)) {
      const closeDate = new Date(globalConfig.hackathonEndDate).toLocaleString();
      toast.error(`The hackathon submission window has closed (deadline was ${closeDate}). No new timers can be started.`);
      return;
    }

    setStarting(true);
    try {
      const res = await hackathonApi.startHackathon();
      toast.success('Hackathon timer started! Your coding countdown is now live.');

      if (res) {
        const startIso = res.assignmentStartTime || new Date().toISOString();
        const deadlineIso = res.deadline || new Date(Date.now() + 24 * 3600 * 1000).toISOString();
        const diff = Math.max(0, Math.floor((new Date(deadlineIso).getTime() - Date.now()) / 1000));

        setStatusData((prev) => ({
          ...prev,
          status: res.status || 'IN_PROGRESS',
          assignmentStartTime: startIso,
          deadline: deadlineIso,
          remainingSeconds: diff,
        }));
        setTimeRemaining(diff);

        const currentUserId = user?.id || JSON.parse(localStorage.getItem('user_details') || '{}')?.id;
        if (currentUserId) {
          localStorage.setItem(`hackathon_start_${currentUserId}`, startIso);
          localStorage.setItem(`hackathon_deadline_${currentUserId}`, deadlineIso);
        }
      }

      await fetchHackathonData();
    } catch (err) {
      console.error('[Start Hackathon Error]', err);
      const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to start hackathon.';
      toast.error(errMsg);
    } finally {
      setStarting(false);
    }
  };

  const validateUrls = () => {
    const newErrors = {};
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/;

    if (!githubUrl.trim()) {
      newErrors.githubUrl = 'GitHub Repository URL is required';
    } else if (!githubRegex.test(githubUrl.trim())) {
      newErrors.githubUrl = 'Please provide a valid GitHub repository URL (e.g. https://github.com/user/repo)';
    }

    if (liveAppUrl.trim()) {
      const urlRegex = /^https?:\/\/.+/;
      if (!urlRegex.test(liveAppUrl.trim())) {
        newErrors.liveAppUrl = 'Live App URL must begin with http:// or https://';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    if (!validateUrls()) return;

    setSubmitting(true);
    try {
      const res = await hackathonApi.submitProject({
        githubRepoUrl: githubUrl.trim(),
        liveAppUrl: liveAppUrl.trim(),
      });

      toast.success('Project submission recorded successfully!');
      setStatusData(res);
    } catch (err) {
      // Surface the exact backend message — backend gives detailed reasons
      // (deadline passed, not started, locked, etc.)
      const backendMsg = err.response?.data?.message
        || err.response?.data?.error
        || err.message;

      if (err.response?.status === 422) {
        toast.error(`Submission rejected: ${backendMsg || 'The submission deadline has passed or the timer is locked.'}`);
      } else if (err.response?.status === 400) {
        toast.error(`Cannot submit: ${backendMsg || 'Hackathon timer has not been started yet. Click "Start Hackathon Timer" first.'}`);
      } else if (err.response?.status === 403) {
        toast.error('Access denied: Your synopsis must be shortlisted to submit hackathon work.');
      } else {
        toast.error(backendMsg || 'Failed to submit project. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-3" />
        <p className="text-sm font-medium text-slate-400">Loading hackathon workspace...</p>
      </div>
    );
  }

  const isTimerStarted =
    statusData?.status === 'IN_PROGRESS' ||
    statusData?.status === 'SUBMITTED' ||
    statusData?.status === 'LOCKED' ||
    Boolean(statusData?.assignmentStartTime);

  const isSubmitted = statusData?.status === 'SUBMITTED';
  const isShortlisted = statusData?.status === 'SHORTLISTED' || user?.hackathonStatus === 'SHORTLISTED';
  const isLocked = statusData?.status === 'LOCKED' || statusData?.locked || isShortlisted;
  const startTimeDisplay = statusData?.assignmentStartTime
    ? new Date(statusData.assignmentStartTime).toLocaleString()
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Timer Status Banner */}
      {isTimerStarted ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-mono text-orange-400 font-bold uppercase tracking-wider block">
                {isSubmitted ? 'SUBMISSION RECORDED' : isLocked ? 'TIMER EXPIRED' : 'HACKATHON TIMER ACTIVE'}
              </span>
              <h2 className="text-xl font-extrabold text-slate-100 mt-0.5">
                {isSubmitted ? 'Project Submitted Successfully' : isLocked ? 'Submissions Locked' : '24-Hour Coding Window in Progress'}
              </h2>
              {startTimeDisplay && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono mt-1">
                  <CalendarCheck className="w-3.5 h-3.5 text-orange-400" />
                  <span>Timer Started At: <strong>{startTimeDisplay}</strong></span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-5 py-3 rounded-xl">
            <span className="text-xs text-slate-400 font-semibold uppercase">
              {isLocked ? 'Time Status:' : 'Remaining:'}
            </span>
            <CountdownTimer remainingSeconds={timeRemaining} targetDate={statusData?.deadline} urgentThresholdHours={2} />
          </div>
        </div>
      ) : (
        /* Pre-Start CTA Hero Box */
        <div className="bg-gradient-to-r from-slate-900 via-orange-950/60 to-slate-900 border border-orange-500/40 rounded-2xl p-8 shadow-2xl text-center space-y-4">
          <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/30 rounded-2xl flex items-center justify-center text-orange-400 mx-auto">
            <Terminal className="w-7 h-7" />
          </div>

          {/* Not started yet */}
          {globalConfig?.hackathonStartDate && new Date() < new Date(globalConfig.hackathonStartDate) ? (
            <>
              <h2 className="text-3xl font-extrabold text-white">Hackathon Not Yet Started</h2>
              <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                The coding sprint officially begins on{' '}
                <strong className="text-orange-400">{new Date(globalConfig.hackathonStartDate).toLocaleString()}</strong>.
                Come back then to start your timer!
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 text-sm">
                <Clock className="w-4 h-4 text-orange-400" />
                Opens in: <CountdownTimer targetDate={globalConfig.hackathonStartDate} urgentThresholdHours={24} />
              </div>
            </>
          ) : globalConfig?.hackathonEndDate && new Date() > new Date(globalConfig.hackathonEndDate) ? (
            <>
              <h2 className="text-3xl font-extrabold text-white">Hackathon Window Closed</h2>
              <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                The submission deadline was{' '}
                <strong className="text-rose-400">{new Date(globalConfig.hackathonEndDate).toLocaleString()}</strong>.
                The hackathon has concluded and no new timers can be started.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-extrabold text-white">Ready to Begin the Hackathon?</h2>
              <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                Once you click <strong>Start Hackathon Timer Now</strong>, your countdown timer will begin on the server. Make sure your team is ready!
              </p>
              <Button
                variant="primary"
                size="lg"
                icon={Play}
                loading={starting}
                onClick={handleStartHackathon}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-extrabold px-8 py-3 rounded-xl shadow-xl shadow-orange-500/25"
              >
                Start Hackathon Timer Now
              </Button>
            </>
          )}
        </div>
      )}

      {/* Grid Layout: Problem Details & Rubric */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Selected Problem Statement */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            title={problemStatement?.title || 'Selected Hackathon Track Problem'}
            subtitle={`Reference: ${problemStatement?.id || 'PS-01'} • Category: ${problemStatement?.category || 'IoT & Smart Cities'}`}
            headerAction={
              <span className="px-3 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/30 rounded-full text-xs font-mono font-bold">
                {problemStatement?.id || 'PS-01'}
              </span>
            }
          >
            <div className="space-y-6">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" /> Challenge Description
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                  {problemStatement?.description}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-orange-400" /> Core Engineering Deliverables
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
                  <li className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Public GitHub Repository with commit history</span>
                  </li>
                  <li className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Clean README with architecture & setup steps</span>
                  </li>
                  <li className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Working backend API endpoints & database schema</span>
                  </li>
                  <li className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Polished responsive UI dashboard & live demo URL</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Col: Evaluation Rubric */}
        <div className="space-y-6">
          <Card title="Evaluation Criteria" subtitle="Weighted rubric used by hackathon judges">
            <div className="space-y-4 text-xs">
              {evalCriteria && evalCriteria.length > 0 ? (
                evalCriteria.map((c, idx) => (
                  <div key={c.id || idx} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-slate-200 block">{c.title}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{c.description || 'Assesses project quality and implementation.'}</p>
                    </div>
                    <span className="font-mono font-bold text-orange-400 text-sm shrink-0">
                      {c.weightage !== undefined && c.weightage !== null ? `${c.weightage}%` : `${c.maxScore || 25}%`}
                    </span>
                  </div>
                ))
              ) : (
                <>
                  <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-200">Functionality & Completeness</span>
                      <p className="text-[10px] text-slate-400">Core problem solved effectively</p>
                    </div>
                    <span className="font-mono font-bold text-orange-400 text-sm">40%</span>
                  </div>

                  <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-200">Code Architecture & Quality</span>
                      <p className="text-[10px] text-slate-400">Clean code, pattern & error handling</p>
                    </div>
                    <span className="font-mono font-bold text-orange-400 text-sm">30%</span>
                  </div>

                  <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-200">UI / UX Polish</span>
                      <p className="text-[10px] text-slate-400">Responsiveness & visual aesthetics</p>
                    </div>
                    <span className="font-mono font-bold text-orange-400 text-sm">15%</span>
                  </div>

                  <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-200">Innovation & Creativity</span>
                      <p className="text-[10px] text-slate-400">Unique features & edge handling</p>
                    </div>
                    <span className="font-mono font-bold text-orange-400 text-sm">15%</span>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Submission Form Section */}
      <Card
        title="Final Project Link Submission"
        subtitle="Provide your public GitHub repository URL and optional live demo URL"
        headerAction={
          isSubmitted ? (
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-extrabold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Submitted
            </span>
          ) : isLocked ? (
            <span className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full text-xs font-extrabold flex items-center gap-1.5">
              <Lock className="w-4 h-4" /> Locked
            </span>
          ) : null
        }
      >
        <form onSubmit={handleSubmitProject} className="space-y-6">
          <Input
            label="GitHub Repository URL"
            placeholder="https://github.com/username/repository"
            icon={GitBranch}
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            error={errors.githubUrl}
            disabled={isLocked || !isTimerStarted}
            required
          />

          <Input
            label="Live App / Demo URL (Optional)"
            placeholder="https://your-app.vercel.app"
            icon={Globe}
            value={liveAppUrl}
            onChange={(e) => setLiveAppUrl(e.target.value)}
            error={errors.liveAppUrl}
            disabled={isLocked || !isTimerStarted}
          />

          {!isTimerStarted && (
            <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>Please click <strong>Start Hackathon Timer Now</strong> above to unlock project submissions.</span>
            </div>
          )}

          {isTimerStarted && !isLocked && (
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={submitting}
              icon={GitBranch}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 font-extrabold"
            >
              {isSubmitted ? 'Update Project Submission' : 'Submit Final Hackathon Entry'}
            </Button>
          )}
        </form>
      </Card>
    </div>
  );
};
