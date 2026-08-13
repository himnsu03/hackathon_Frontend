import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { candidateApi } from '../services/candidateApi';
import { hackathonConfigService } from '../services/hackathonConfigService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { CountdownTimer } from '../components/common/CountdownTimer';
import {
  Copy,
  Check,
  FileText,
  Terminal,
  Calendar,
  ChevronDown,
  ChevronUp,
  Sparkles,
  AlertTriangle,
  Loader2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Upload,
  RefreshCw,
} from 'lucide-react';

export const CandidateDashboardPage = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const location = useLocation();

  const [dashboardData, setDashboardData] = useState(null);
  const [globalConfig, setGlobalConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [expandedRule, setExpandedRule] = useState(null);

  // Resume Upload State
  const [resumeInfo, setResumeInfo] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isReplacingResume, setIsReplacingResume] = useState(false);

  const warningShownRef = React.useRef(false);

  // Show redirect warning toast if user attempted to access /hackathon without shortlist
  useEffect(() => {
    if (location.state?.warning && !warningShownRef.current) {
      warningShownRef.current = true;
      toast.warning(location.state.warning);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, toast]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [data, configData] = await Promise.allSettled([
          candidateApi.getDashboard(),
          hackathonConfigService.fetchPublicConfig(),
        ]);

        if (configData.status === 'fulfilled' && configData.value) {
          setGlobalConfig(configData.value);
        }

        if (data.status === 'fulfilled' && data.value) {
          const dash = data.value;
          setDashboardData(dash);
          if (dash?.user?.resume) {
            setResumeInfo(dash.user.resume);
          } else {
            const localResume = await candidateApi.getResumeInfo();
            if (localResume) setResumeInfo(localResume);
          }
          const effectiveStatus = dash.synopsisStatus || dash.user?.synopsisStatus || user?.synopsisStatus;
          if (effectiveStatus && user) {
            updateUser({ synopsisStatus: effectiveStatus, submissionId: dash.user?.submissionId || user.submissionId });
          }
        }
      } catch (err) {
        console.error('[Dashboard Fetch Error]', err);
        const detailMsg = err.response?.data?.message || err.response?.data?.error || err.message;
        toast.error(`Failed to load candidate dashboard data: ${detailMsg}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleCopyId = () => {
    const subId = dashboardData?.user?.submissionId || user?.submissionId || '';
    navigator.clipboard.writeText(subId);
    setCopied(true);
    toast.success('Submission ID copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-3" />
        <p className="text-sm font-medium text-slate-400">Loading candidate dashboard...</p>
      </div>
    );
  }

  const synopsisStatus = dashboardData?.synopsisStatus || dashboardData?.user?.synopsisStatus || user?.synopsisStatus || 'NOT_SUBMITTED';
  const submissionId = dashboardData?.user?.submissionId || user?.submissionId || '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Shortlisted Hero Banner (If Shortlisted) */}
      {synopsisStatus === 'SHORTLISTED' && (
        <div className="bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-slate-900 border border-emerald-500/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Congratulations!
              </div>
              <h2 className="text-2xl font-extrabold text-white">Your Synopsis Has Been Shortlisted!</h2>
              <p className="text-sm text-emerald-200 max-w-xl leading-relaxed">
                You are officially qualified for the main hackathon coding round. Access the live problem statement, countdown timer, and repository submission form now.
              </p>
            </div>
            <Link to="/hackathon">
              <Button variant="primary" size="lg" icon={Terminal} className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/25">
                Access Hackathon Workspace
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Hero Header Card: Submission ID & Status */}
      <Card className="bg-gradient-to-r from-slate-900/90 via-orange-950/30 to-slate-900 border-orange-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase">
              Official Candidate Identifier
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-100 tracking-wider">
                {submissionId}
              </span>
              <button
                onClick={handleCopyId}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700/80 active:scale-95"
                title="Copy Submission ID"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Keep this unique ID handy for mentor communications and submission logs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                Synopsis Status
              </span>
              <Badge status={synopsisStatus} />
            </div>

            {synopsisStatus === 'NOT_SUBMITTED' && (
              <div className="pl-0 sm:pl-4 sm:border-l border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                  Synopsis Deadline
                </span>
                <CountdownTimer targetDate={globalConfig?.synopsisDeadline || hackathonConfigService.getConfig()?.synopsisDeadline || dashboardData?.submissionDeadline} />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3 width on desktop): CTA Card & Key Dates */}
        <div className="lg:col-span-2 space-y-8">
          {/* Synopsis Action CTA Card */}
          <Card
            title={synopsisStatus === 'NOT_SUBMITTED' ? 'Synopsis Submission Action Required' : synopsisStatus === 'SHORTLISTED' ? 'Synopsis Shortlisted & Locked' : 'Synopsis Submission Status'}
            subtitle={synopsisStatus === 'NOT_SUBMITTED' ? 'Submit your proposal before the deadline to qualify for shortlisting.' : synopsisStatus === 'SHORTLISTED' ? 'Your proposal has been shortlisted. Problem track and proposal content are locked.' : 'Your submitted proposal is recorded on the platform.'}
          >
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Track Problem Teaser
                </span>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {dashboardData?.teaserProblemStatement}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                {synopsisStatus === 'NOT_SUBMITTED' ? (
                  <>
                    <div className="text-xs text-slate-400">
                      <strong>Requirement:</strong> Minimum 200 character detailed technical approach proposal.
                    </div>
                    <Link to="/synopsis">
                      <Button variant="primary" size="md" icon={ArrowRight}>
                        Submit Your Synopsis
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="text-xs text-slate-400">
                      Submitted on:{' '}
                      <span className="text-slate-200 font-mono">
                        {dashboardData?.user?.synopsisSubmittedAt
                          ? new Date(dashboardData.user.synopsisSubmittedAt).toLocaleString()
                          : 'Recorded'}
                      </span>
                    </div>
                    <Link to="/synopsis">
                      <Button variant="secondary" size="md" icon={FileText}>
                        View Submitted Synopsis
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </Card>

          {/* Key Dates Timeline */}
          <Card title="Key Hackathon Timeline" subtitle="Official schedule of events and milestone dates">
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {(() => {
                const formatTimelineDate = (iso) => {
                  if (!iso) return 'To be announced';
                  try {
                    const d = new Date(iso);
                    if (isNaN(d.getTime())) return 'To be announced';
                    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                    return `${dateStr} • ${timeStr}`;
                  } catch {
                    return 'To be announced';
                  }
                };

                const now = new Date();
                const getStatus = (startIso, endIso) => {
                  if (!startIso) return 'upcoming';
                  const start = new Date(startIso);
                  if (now < start) return 'upcoming';
                  if (!endIso) return 'completed';
                  const end = new Date(endIso);
                  if (now > end) return 'completed';
                  return 'active';
                };

                const milestones = (dashboardData?.keyDates && dashboardData.keyDates.length > 0)
                  ? dashboardData.keyDates
                  : [
                    {
                      label: 'Phase 01: Registration & Synopsis Opens',
                      date: formatTimelineDate(globalConfig?.synopsisStartDate),
                      status: getStatus(globalConfig?.synopsisStartDate, globalConfig?.synopsisDeadline),
                    },
                    {
                      label: 'Phase 02: Registration & Synopsis Deadline',
                      date: formatTimelineDate(globalConfig?.synopsisDeadline),
                      status: getStatus(globalConfig?.synopsisDeadline, globalConfig?.synopsisResultDate),
                    },
                    {
                      label: 'Phase 03: Live Hackathon Coding Sprint',
                      date: globalConfig?.hackathonStartDate && globalConfig?.hackathonEndDate
                        ? `${formatTimelineDate(globalConfig.hackathonStartDate)} - ${formatTimelineDate(globalConfig.hackathonEndDate)}`
                        : formatTimelineDate(globalConfig?.hackathonStartDate),
                      status: getStatus(globalConfig?.hackathonStartDate, globalConfig?.hackathonEndDate),
                    },
                    {
                      label: 'Phase 04: Presentation & Discussion (F2F)',
                      date: globalConfig?.interviewStartDate && globalConfig?.interviewEndDate
                        ? `${formatTimelineDate(globalConfig.interviewStartDate)} - ${formatTimelineDate(globalConfig.interviewEndDate)}`
                        : formatTimelineDate(globalConfig?.interviewStartDate),
                      status: getStatus(globalConfig?.interviewStartDate, globalConfig?.interviewEndDate),
                    },
                    {
                      label: 'Phase 05: Final Winner Results & Job Offers',
                      date: formatTimelineDate(globalConfig?.hackathonResultDate || globalConfig?.interviewEndDate),
                      status: getStatus(globalConfig?.hackathonResultDate, null),
                    },
                  ];

                return milestones.map((kd, idx) => (
                  <div key={idx} className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    {/* Circle Marker */}
                    <div
                      className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 ${kd.status === 'completed'
                        ? 'bg-emerald-500 border-emerald-400'
                        : kd.status === 'active'
                          ? 'bg-orange-500 border-orange-400 animate-pulse'
                          : 'bg-slate-900 border-slate-700'
                        }`}
                    />
                    <div>
                      <h5 className="text-sm font-semibold text-slate-200">{kd.label}</h5>
                      <span className="text-xs font-mono text-slate-400">{kd.date}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full w-fit ${kd.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : kd.status === 'active'
                          ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                          : 'bg-slate-800 text-slate-500'
                        }`}
                    >
                      {kd.status}
                    </span>
                  </div>
                ));
              })()}
            </div>
          </Card>
        </div>

        {/* Right Column (1/3 width on desktop): Resume Upload, Rules Accordion & Support */}
        <div className="space-y-8">
          {/* Candidate Resume Upload Card */}
          <Card title="Candidate Resume Upload" subtitle="Upload your technical CV for mentor & organizer review">
            <div className="space-y-4">
              {resumeInfo && !isReplacingResume ? (
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold text-slate-100 truncate">{resumeInfo.fileName || 'Resume.pdf'}</h5>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        Uploaded: {resumeInfo.uploadedAt ? new Date(resumeInfo.uploadedAt).toLocaleDateString() : 'Active'}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    icon={RefreshCw}
                    onClick={() => setIsReplacingResume(true)}
                  >
                    Replace Resume
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!selectedFile) {
                      toast.error('Please select a resume file (.pdf, .doc, .docx).');
                      return;
                    }
                    setUploadingResume(true);
                    try {
                      const res = await candidateApi.uploadResume(selectedFile);
                      setResumeInfo(res);
                      setIsReplacingResume(false);
                      setSelectedFile(null);
                      toast.success(res?.message || 'Resume uploaded successfully!');
                    } catch (err) {
                      toast.error('Failed to upload resume. Please try again.');
                    } finally {
                      setUploadingResume(false);
                    }
                  }}
                  className="space-y-3"
                >
                  <div className="p-4 bg-slate-950/60 border border-dashed border-slate-700 hover:border-orange-500/50 rounded-xl transition-colors text-center cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      id="resume-file-input"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                        }
                      }}
                    />
                    <label htmlFor="resume-file-input" className="cursor-pointer space-y-1 block">
                      <Upload className="w-6 h-6 text-orange-400 mx-auto mb-1" />
                      <span className="text-xs font-bold text-slate-200 block">
                        {selectedFile ? selectedFile.name : 'Choose Resume File'}
                      </span>
                      <span className="text-[10px] text-slate-500 block">PDF, DOC, DOCX (Max 5MB)</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    {isReplacingResume && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsReplacingResume(false);
                          setSelectedFile(null);
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      fullWidth
                      loading={uploadingResume}
                      disabled={!selectedFile}
                      icon={Upload}
                    >
                      {uploadingResume ? 'Uploading...' : 'Upload Resume'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </Card>

          {/* Rules Accordion */}
          <Card title="Rules & Guidelines" subtitle="Important policies every candidate must follow">
            <div className="space-y-3">
              {(dashboardData?.rules || []).map((rule, idx) => {
                const isOpen = expandedRule === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedRule(isOpen ? null : idx)}
                      className="w-full p-3.5 text-left flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-orange-300"
                    >
                      <span>{rule.title}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-orange-400" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </button>
                    {isOpen && (
                      <div className="px-3.5 pb-3.5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-2">
                        {rule.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Organizer Note */}
          <div className="p-5 bg-orange-950/30 border border-orange-500/20 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Verified Platform
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              If you have any questions regarding your submission status or experience issues, reach out to the organizing team via <b style={{ color: 'orange' }}>email support</b>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
