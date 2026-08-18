import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { evaluatorApi } from '../services/evaluatorApi';
import { adminApi } from '../services/adminApi';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { TextArea } from '../components/common/TextArea';
import { Badge } from '../components/common/Badge';
import {
  ArrowLeft,
  UserCheck,
  GitBranch,
  Globe,
  Award,
  Send,
  Loader2,
  Lightbulb,
  ExternalLink,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  FileText,
} from 'lucide-react';

export const EvaluatorInterviewDetailPage = () => {
  const { id } = useParams();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [interviewCriteria, setInterviewCriteria] = useState([]);
  const [candidateResume, setCandidateResume] = useState(null);

  const [scores, setScores] = useState({});
  const [overallScore, setOverallScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [alreadyEvaluated, setAlreadyEvaluated] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const [subData, criteriaData, existingEval] = await Promise.allSettled([
          evaluatorApi.getHackathonSubmissionById(id),
          adminApi.getPublicInterviewAiCriteria(1),
          evaluatorApi.getMyInterviewEvaluation(id),
        ]);

        if (subData.status === 'fulfilled' && subData.value) {
          const sub = subData.value;
          setSubmission(sub);
          const candidateUserId = sub.userId || sub.user?.id || sub.id;
          if (candidateUserId) {
            evaluatorApi.getCandidateResume(candidateUserId).then((prof) => {
              if (prof) setCandidateResume(prof);
            }).catch(() => {});
          }
        }

        if (criteriaData.status === 'fulfilled' && Array.isArray(criteriaData.value)) {
          setInterviewCriteria(criteriaData.value.filter((c) => c.active !== false));
        }

        if (existingEval.status === 'fulfilled' && existingEval.value) {
          setAlreadyEvaluated(true);
          const ev = existingEval.value;
          if (ev.comments) setFeedback(ev.comments);
          if (ev.scores && typeof ev.scores === 'object' && Object.keys(ev.scores).length > 0) {
            setScores(ev.scores);
            const sum = Object.values(ev.scores).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
            setOverallScore(sum);
          } else if (ev.totalScore || ev.score) {
            setOverallScore(ev.totalScore || ev.score);
          }
        }
      } catch (err) {
        toast.error('Failed to load candidate submission details for F2F interview.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleScoreChange = (criterionName, val, maxVal) => {
    const num = Math.min(maxVal, Math.max(0, parseInt(val, 10) || 0));
    const updated = { ...scores, [criterionName]: num };
    setScores(updated);

    const total = Object.values(updated).reduce((acc, curr) => acc + curr, 0);
    setOverallScore(total);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await evaluatorApi.evaluateInterviewSubmission(id, {
        scores,
        totalScore: overallScore,
        score: overallScore,
        comments: feedback,
      });
      toast.success('F2F Presentation & Discussion feedback recorded successfully!');
      setAlreadyEvaluated(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record F2F interview feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  const [statusUpdating, setStatusUpdating] = useState(false);

  const handleShortlistCandidate = async () => {
    if (!window.confirm('Are you sure you want to shortlist/select this candidate after F2F interview?')) return;
    setStatusUpdating(true);
    try {
      await evaluatorApi.shortlistHackathonSubmission(id);
      setSubmission((prev) => (prev ? { ...prev, status: 'SHORTLISTED' } : prev));
      toast.success('Candidate shortlisted/selected successfully after F2F interview!');
    } catch (err) {
      toast.error('Failed to shortlist candidate.');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleRejectCandidate = async () => {
    if (!window.confirm('Are you sure you want to reject this candidate after F2F interview?')) return;
    setStatusUpdating(true);
    try {
      await evaluatorApi.rejectHackathonSubmission(id);
      setSubmission((prev) => (prev ? { ...prev, status: 'REJECTED' } : prev));
      toast.success('Candidate status updated to Rejected after F2F interview.');
    } catch (err) {
      toast.error('Failed to update candidate status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-3" />
        <p className="text-sm font-medium text-slate-400">Loading F2F interview workspace...</p>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <UserCheck className="w-12 h-12 text-slate-600" />
        <p className="text-sm font-semibold text-slate-400">Candidate submission not found or failed to load.</p>
        <Link to="/evaluator/interview">
          <Button variant="outline" size="sm" icon={ArrowLeft}>Back to Interview Candidates</Button>
        </Link>
      </div>
    );
  }

  const ps = submission?.problemStatement;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Navigation */}
      <Link to="/evaluator/interview">
        <Button variant="ghost" size="sm" icon={ArrowLeft}>
          Back to Interview Candidates List
        </Button>
      </Link>

      {/* Main Candidate Header Card */}
      <Card
        title={`F2F Presentation & Discussion: ${submission?.candidateName || 'Candidate'}`}
        subtitle={`Candidate Email: ${submission?.candidateEmail || submission?.email || 'N/A'} • Submission ID: ${submission?.submissionId || 'N/A'}`}
        headerAction={
          <div className="flex items-center gap-2">
            <Badge status={submission?.status || 'SHORTLISTED'} />
            <Button
              variant="outline"
              size="sm"
              loading={statusUpdating}
              onClick={handleShortlistCandidate}
              className="bg-emerald-600/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600/30 text-xs font-bold"
            >
              Shortlist Candidate
            </Button>
            <Button
              variant="outline"
              size="sm"
              loading={statusUpdating}
              onClick={handleRejectCandidate}
              className="bg-rose-600/20 text-rose-300 border-rose-500/40 hover:bg-rose-600/30 text-xs font-bold"
            >
              Reject Candidate
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Challenge Track */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5">
            <span className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Challenge Track
            </span>
            <h4 className="text-sm font-bold text-slate-100">{ps?.title || submission?.problemStatementTitle || 'Selected Challenge Track'}</h4>
            {ps?.description && <p className="text-xs text-slate-300 leading-relaxed">{ps.description}</p>}
          </div>

          {/* Submission Links & Artifacts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Source Code Repository</span>
              {submission?.githubUrl || submission?.githubRepoUrl ? (
                <a
                  href={submission.githubUrl || submission.githubRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-orange-400 hover:text-orange-300 transition-colors break-all"
                >
                  <GitBranch className="w-4 h-4 shrink-0" /> {submission.githubUrl || submission.githubRepoUrl} <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              ) : (
                <span className="text-xs text-slate-500 font-mono">No repository URL provided</span>
              )}
            </div>

            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Live Application Demo</span>
              {submission?.liveAppUrl ? (
                <a
                  href={submission.liveAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 transition-colors break-all"
                >
                  <Globe className="w-4 h-4 shrink-0" /> {submission.liveAppUrl} <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              ) : (
                <span className="text-xs text-slate-500 font-mono">No live URL provided</span>
              )}
            </div>

            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Candidate Resume / CV</span>
              {candidateResume?.resumeUrl || submission?.resumeUrl ? (
                <a
                  href={candidateResume?.resumeUrl || submission?.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 hover:text-indigo-300 transition-colors break-all"
                >
                  <FileText className="w-4 h-4 shrink-0" /> View Candidate Resume <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              ) : (
                <span className="text-xs text-slate-500 font-mono">No resume uploaded yet</span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* F2F Interview Feedback Form Card */}
      <Card
        title="Face-to-Face Interview & Discussion Scorecard"
        subtitle={alreadyEvaluated ? 'F2F feedback has been recorded (you can update scores or remarks below).' : 'Rate live demo, code defense, system architecture, and Q&A'}
      >
        <form onSubmit={handleSubmitFeedback} className="space-y-6">
          {interviewCriteria.length === 0 ? (
            <div className="p-6 bg-amber-950/30 border border-amber-500/30 rounded-xl text-center space-y-2">
              <p className="text-sm font-bold text-amber-300">No F2F Interview Criteria Configured</p>
              <p className="text-xs text-amber-400/80">
                An admin must configure interview criteria from the Admin Panel → Interview Criteria tab before evaluators can score interviews.
              </p>
            </div>
          ) : (
          <div className="space-y-4">
            {interviewCriteria.map((c, idx) => {
              const max = Number(c.weightage) || Number(c.maxScore) || 25;
              const name = c.title || c.name;
              const desc = c.description || c.desc;
              const val = scores[name] ?? '';
              return (
                <div key={c.id || idx} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">{name}</h5>
                    {desc && <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{desc}</p>}
                    <span className="text-[10px] text-slate-500 font-mono">Max Score: {max} pts</span>
                  </div>
                  <div className="w-32 shrink-0">
                    <Input
                      type="number"
                      min={0}
                      max={max}
                      value={val}
                      onChange={(e) => handleScoreChange(name, e.target.value, max)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          )}

          {/* Aggregated Interview Score Box */}
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" /> Aggregated F2F Interview Score
            </span>
            <span className="text-xl font-extrabold font-mono text-slate-100">
              {overallScore} / {interviewCriteria.reduce((sum, c) => sum + (Number(c.weightage) || Number(c.maxScore) || 25), 0)}
            </span>
          </div>

          <TextArea
            label="Judge Remarks & Interview Feedback"
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Provide feedback on the candidate's presentation, live application demo, code defense, and Q&A performance..."
          />

          <div className="flex justify-end pt-2 border-t border-slate-800/80">
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Send}
              loading={submitting}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold"
            >
              {alreadyEvaluated ? 'Update F2F Interview Feedback' : 'Submit F2F Interview Feedback'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
