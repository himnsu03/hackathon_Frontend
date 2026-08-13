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
import { ArrowLeft, Terminal, GitBranch, Globe, Award, Send, Loader2, Lightbulb, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';

export const EvaluatorHackathonDetailPage = () => {
  const { id } = useParams();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [criteria, setCriteria] = useState([]);
  const [scores, setScores] = useState({});
  const [overallScore, setOverallScore] = useState(0);
  const [comments, setComments] = useState('');
  const [alreadyEvaluated, setAlreadyEvaluated] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const [subData, criteriaData, existingEval] = await Promise.allSettled([
          evaluatorApi.getHackathonSubmissionById(id),
          adminApi.getPublicHackathonAiCriteria(1),
          evaluatorApi.getMyHackathonEvaluation(id),
        ]);

        if (subData.status === 'fulfilled') {
          setSubmission(subData.value);
        }

        // Use DB-driven criteria only — no static fallback
        if (criteriaData.status === 'fulfilled' && Array.isArray(criteriaData.value)) {
          setCriteria(criteriaData.value.filter((c) => c.active !== false));
        }

        if (existingEval.status === 'fulfilled' && existingEval.value) {
          setAlreadyEvaluated(true);
          const ev = existingEval.value;
          if (ev.comments) setComments(ev.comments);
          if (ev.scores && typeof ev.scores === 'object' && Object.keys(ev.scores).length > 0) {
            setScores(ev.scores);
            const sum = Object.values(ev.scores).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
            setOverallScore(sum);
          } else if (ev.totalScore || ev.score) {
            setOverallScore(ev.totalScore || ev.score);
          }
        } else {
          setScores({});
          setOverallScore(0);
        }
      } catch (err) {
        toast.error('Failed to load project submission details.');
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

  const handleSubmitScore = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await evaluatorApi.evaluateHackathonSubmission(id, {
        scores,
        totalScore: overallScore,
        score: overallScore,
        comments,
      });
      toast.success('Hackathon project evaluation submitted successfully!');
      setAlreadyEvaluated(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit evaluation.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleShortlist = async () => {
    setActionLoading(true);
    try {
      const updated = await evaluatorApi.shortlistHackathonSubmission(id);
      setSubmission((prev) => (updated ? updated : { ...prev, status: 'SHORTLISTED' }));
      toast.success(`Hackathon project for ${submission?.candidateName || 'Candidate'} shortlisted successfully!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to shortlist hackathon project.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      const updated = await evaluatorApi.rejectHackathonSubmission(id);
      setSubmission((prev) => (updated ? updated : { ...prev, status: 'REJECTED' }));
      toast.error(`Hackathon project for ${submission?.candidateName || 'Candidate'} rejected.`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject hackathon project.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-3" />
        <p className="text-sm font-medium text-slate-400">Loading project submission for review...</p>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <Terminal className="w-12 h-12 text-slate-600" />
        <p className="text-sm font-semibold text-slate-400">Submission not found or failed to load.</p>
        <Link to="/evaluator/hackathon">
          <Button variant="outline" size="sm" icon={ArrowLeft}>Back to Submissions</Button>
        </Link>
      </div>
    );
  }

  const ps = submission?.problemStatement;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Navigation */}
      <Link to="/evaluator/hackathon">
        <Button variant="ghost" size="sm" icon={ArrowLeft}>
          Back to Project Submissions
        </Button>
      </Link>

      {/* Main Hackathon Submission Details Card */}
      <Card
        title={`Project Submission Review: ${submission?.candidateName || 'Candidate'}`}
        subtitle={`Submission ID: ${submission?.submissionId || 'N/A'}`}
        headerAction={<Badge status={submission?.status || 'SUBMITTED'} />}
      >
        <div className="space-y-6">
          {/* Track Problem Statement */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5">
            <span className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Challenge Track
            </span>
            <h4 className="text-sm font-bold text-slate-100">{ps?.title || submission?.problemStatementTitle || 'Selected Challenge Track'}</h4>
            {ps?.description && <p className="text-xs text-slate-300 leading-relaxed">{ps.description}</p>}
          </div>

          {/* Submission Links & Artifacts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>

          {/* Timestamp */}
          <div className="text-xs text-slate-400 font-mono">
            Submitted At: <strong className="text-slate-200">{submission?.submittedAt || submission?.submissionTime ? new Date(submission.submittedAt || submission.submissionTime).toLocaleString() : 'Recorded'}</strong>
          </div>
        </div>
      </Card>

      {/* Scoring Form Card */}
      <Card
        title="Evaluator Scoring & Project Review"
        subtitle={alreadyEvaluated ? 'You have evaluated this submission (you can update scores or shortlist state below).' : 'Rate code implementation, functionality, UI/UX, and live demo'}
      >
        <form onSubmit={handleSubmitScore} className="space-y-6">
          {criteria.length === 0 ? (
            <div className="p-6 bg-amber-950/30 border border-amber-500/30 rounded-xl text-center space-y-2">
              <p className="text-sm font-bold text-amber-300">No Evaluation Criteria Configured</p>
              <p className="text-xs text-amber-400/80">
                An admin must add hackathon evaluation criteria from the Admin Panel → Hackathon AI Criteria tab before evaluators can score submissions.
              </p>
            </div>
          ) : (
          <div className="space-y-4">
            {criteria.map((c, idx) => {
              const max = Number(c.weightage) || Number(c.maxScore) || 25;
              const key = c.title || c.name;
              const val = scores[key] ?? '';
              return (
                <div key={c.id || idx} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">{key}</h5>
                    {c.description && (
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{c.description}</p>
                    )}
                    <span className="text-[10px] text-slate-500 font-mono">Max Score: {max} pts</span>
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      min={0}
                      max={max}
                      value={val}
                      onChange={(e) => handleScoreChange(key, e.target.value, max)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          )}

          {/* Overall Total Score Box */}
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" /> Aggregated Evaluation Score
            </span>
            <span className="text-xl font-extrabold font-mono text-slate-100">
              {overallScore} / {criteria.reduce((sum, c) => sum + (Number(c.weightage) || Number(c.maxScore) || 25), 0)}
            </span>
          </div>

          <TextArea
            label="Evaluator Comments & Judge Remarks"
            rows={4}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Write evaluation feedback regarding code quality, repository structure, features, and live demo UX..."
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="success"
                size="md"
                icon={CheckCircle2}
                loading={actionLoading}
                disabled={submission?.status === 'SHORTLISTED'}
                onClick={handleShortlist}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                {submission?.status === 'SHORTLISTED' ? 'Shortlisted' : 'Shortlist Hackathon Project'}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="md"
                icon={XCircle}
                loading={actionLoading}
                disabled={submission?.status === 'REJECTED'}
                onClick={handleReject}
                className="border-rose-500/50 text-rose-400 hover:bg-rose-950/60 font-semibold"
              >
                {submission?.status === 'REJECTED' ? 'Rejected' : 'Reject Project'}
              </Button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Send}
              loading={submitting}
            >
              {alreadyEvaluated ? 'Update Evaluation Score' : 'Submit Evaluation Score'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
