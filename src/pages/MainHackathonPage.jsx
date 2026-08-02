import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { hackathonApi } from '../services/hackathonApi';
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
  Layers,
  Award,
  Clock,
  ShieldAlert,
} from 'lucide-react';

export const MainHackathonPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStartModal, setShowStartModal] = useState(false);
  const [starting, setStarting] = useState(false);

  // Form State
  const [githubUrl, setGithubUrl] = useState('');
  const [liveAppUrl, setLiveAppUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Countdown timer server sync
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Guard check on mount
  useEffect(() => {
    if (user && user.synopsisStatus !== 'SHORTLISTED') {
      navigate('/dashboard', {
        state: { warning: 'The main hackathon arena is strictly restricted to Shortlisted candidates.' },
        replace: true,
      });
    }
  }, [user, navigate]);

  const fetchHackathonStatus = async () => {
    try {
      const data = await hackathonApi.getStatus();
      setStatusData(data);
      setTimeRemaining(data.timeRemainingSeconds || 0);

      if (data.projectSubmission) {
        setGithubUrl(data.projectSubmission.githubUrl || '');
        setLiveAppUrl(data.projectSubmission.liveAppUrl || '');
      }
    } catch {
      toast.error('Failed to sync hackathon timer state.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load + 60s Server Sync Polling to correct drift
  useEffect(() => {
    fetchHackathonStatus();

    const pollInterval = setInterval(() => {
      fetchHackathonStatus();
    }, 60000); // 60s server sync polling

    return () => clearInterval(pollInterval);
  }, []);

  const handleStartHackathon = async () => {
    setStarting(true);
    try {
      const res = await hackathonApi.startHackathon();
      toast.success(res.message || 'Hackathon started! Timer is ticking.');
      setShowStartModal(false);
      fetchHackathonStatus();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start hackathon.');
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
        newErrors.liveAppUrl = 'Please enter a valid URL starting with http:// or https://';
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
        githubUrl: githubUrl.trim(),
        liveAppUrl: liveAppUrl.trim() || undefined,
      });

      toast.success(res.message || 'Project submitted successfully! Submissions locked.');
      fetchHackathonStatus();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit project.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-3" />
        <p className="text-sm font-medium text-slate-400">Loading hackathon environment...</p>
      </div>
    );
  }

  const isStarted = statusData?.started;
  const isLocked = statusData?.isLocked;
  const isSubmitted = statusData?.submitted;
  const isExpired = isStarted && timeRemaining <= 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Sticky Persistent Countdown Header */}
      {isStarted && (
        <div className="sticky top-16 z-30 bg-slate-950/90 backdrop-blur-xl border-b border-indigo-500/30 px-4 py-3 shadow-2xl">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <h4 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" /> Live Hackathon Round
                </h4>
                <span className="text-[11px] font-mono text-slate-400">
                  {isSubmitted ? 'Project Submitted — Read Only' : isExpired ? 'Time Expired — Locked' : 'Auto-Syncing with server every 60s'}
                </span>
              </div>
            </div>

            <CountdownTimer
              secondsLeft={timeRemaining}
              size="lg"
              onExpire={() => {
                toast.warning("Time's up! Hackathon submissions are now locked.");
                fetchHackathonStatus();
              }}
            />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Not Started Banner State */}
        {!isStarted && (
          <Card className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border-indigo-500/40 text-center py-10 px-6">
            <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Terminal className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-100">Ready to Begin the Hackathon?</h2>
            <p className="text-sm text-slate-300 max-w-lg mx-auto mt-2 leading-relaxed">
              Once you click <strong>Start Hackathon</strong>, your 24-hour non-stop countdown timer will begin immediately.
            </p>
            <div className="mt-6">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowStartModal(true)}
                icon={Play}
                className="bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-400 hover:to-emerald-400 text-slate-950 font-extrabold shadow-xl shadow-indigo-500/20"
              >
                Start Hackathon Timer Now
              </Button>
            </div>
          </Card>
        )}

        {/* Lock / Expiry Warning Banners */}
        {isExpired && !isSubmitted && (
          <div className="p-4 bg-rose-950/80 border border-rose-500/60 rounded-2xl text-rose-200 flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />
            <div>
              <h5 className="font-bold text-sm text-white">Time's Up — Submissions Are Locked</h5>
              <p className="text-xs text-rose-300">
                The hackathon duration timer has reached 00:00:00. No further project link submissions can be accepted.
              </p>
            </div>
          </div>
        )}

        {isSubmitted && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500/60 rounded-2xl text-emerald-200 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h5 className="font-bold text-sm text-white">Project Successfully Submitted & Locked</h5>
              <p className="text-xs text-emerald-300">
                Submitted at{' '}
                <span className="font-mono font-bold">
                  {new Date(statusData.projectSubmission.submittedAt).toLocaleString()}
                </span>
                . Your repo is logged for evaluation.
              </p>
            </div>
          </div>
        )}

        {/* Problem Statement & Criteria Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Problem Statement (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            <Card
              title={statusData?.problemStatement?.title || 'Hackathon Track Problem'}
              subtitle="Full technical specifications and requirements"
            >
              <div className="prose prose-invert max-w-none text-sm text-slate-300 space-y-4 max-h-[420px] overflow-y-auto pr-2">
                {statusData?.problemStatement?.description ? (
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {statusData.problemStatement.description}
                  </div>
                ) : (
                  <p>Problem details loading...</p>
                )}
              </div>
            </Card>

            {/* Submission Form at Bottom */}
            <Card
              title="Final Project Link Submission"
              subtitle={isLocked ? 'Submissions are locked for this candidate' : 'Provide your public GitHub repository URL'}
              headerAction={isLocked ? <Lock className="w-5 h-5 text-amber-400" /> : null}
            >
              <form onSubmit={handleSubmitProject} className="space-y-5">
                <Input
                  label="GitHub Repository URL"
                  type="url"
                  icon={GitBranch}
                  placeholder="https://github.com/username/repository"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  disabled={isLocked || !isStarted}
                  error={errors.githubUrl}
                  required
                />

                <Input
                  label="Live App / Demo URL (Optional)"
                  type="url"
                  icon={Globe}
                  placeholder="https://my-hackathon-demo.vercel.app"
                  value={liveAppUrl}
                  onChange={(e) => setLiveAppUrl(e.target.value)}
                  disabled={isLocked || !isStarted}
                  error={errors.liveAppUrl}
                />

                {!isLocked && isStarted ? (
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={submitting}
                    icon={CheckCircle2}
                  >
                    Lock & Submit Final Project
                  </Button>
                ) : (
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-center text-xs text-slate-400 font-mono">
                    {isLocked ? 'Submission Locked' : 'Start timer above to unlock submission form'}
                  </div>
                )}
              </form>
            </Card>
          </div>

          {/* Right Column: Evaluation Criteria */}
          <div>
            <Card title="Evaluation Criteria" subtitle="Weighted rubric used by hackathon judges">
              <div className="space-y-4">
                {(statusData?.evaluationCriteria || []).map((crit, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{crit.title}</span>
                      <span className="text-[11px] font-mono font-extrabold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/30">
                        {crit.weight}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{crit.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Start Hackathon Confirmation Modal */}
      {showStartModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center py-6 px-6" title="Confirm Hackathon Start">
            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-extrabold text-slate-100 mb-2">Important Warning</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Once you start, your <strong>24-hour timer cannot be paused or reset</strong>. Ensure your environment is ready before proceeding.
            </p>

            <div className="flex items-center gap-3">
              <Button variant="secondary" fullWidth onClick={() => setShowStartModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                fullWidth
                loading={starting}
                onClick={handleStartHackathon}
                icon={Play}
              >
                Yes, Start Timer
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
