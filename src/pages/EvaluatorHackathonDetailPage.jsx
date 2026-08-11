import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { evaluatorApi } from '../services/evaluatorApi';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { TextArea } from '../components/common/TextArea';
import { Badge } from '../components/common/Badge';
import { ArrowLeft, Terminal, GitBranch, Globe, Award, Send, Loader2, Lightbulb, ExternalLink } from 'lucide-react';

export const EvaluatorHackathonDetailPage = () => {
  const { id } = useParams();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [criteria, setCriteria] = useState([]);
  const [scores, setScores] = useState({});
  const [overallScore, setOverallScore] = useState(88);
  const [comments, setComments] = useState('');
  const [alreadyEvaluated, setAlreadyEvaluated] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const [subData, configData, existingEval] = await Promise.allSettled([
          evaluatorApi.getHackathonSubmissionById(id),
          evaluatorApi.getPublicConfig(),
          evaluatorApi.getMyHackathonEvaluation(id),
        ]);

        if (subData.status === 'fulfilled') {
          setSubmission(subData.value);
        }

        const critList = configData.status === 'fulfilled' && configData.value?.evaluationCriteria
          ? configData.value.evaluationCriteria
          : [
              { name: 'Code Quality & Implementation', maxScore: 25 },
              { name: 'Feature Completeness', maxScore: 25 },
              { name: 'UI/UX Polish & Responsiveness', maxScore: 25 },
              { name: 'Innovation & Live Application Demo', maxScore: 25 },
            ];
        setCriteria(critList);

        if (existingEval.status === 'fulfilled' && existingEval.value) {
          setAlreadyEvaluated(true);
          const ev = existingEval.value;
          if (ev.comments) setComments(ev.comments);
          if (ev.totalScore || ev.score) setOverallScore(ev.totalScore || ev.score);
          if (ev.scores && typeof ev.scores === 'object') setScores(ev.scores);
        } else {
          const initial = {};
          critList.forEach((c) => {
            initial[c.name] = Math.round((c.maxScore || 25) * 0.85);
          });
          setScores(initial);
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

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-3" />
        <p className="text-sm font-medium text-slate-400">Loading project submission for review...</p>
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
        headerAction={<Badge status="SHORTLISTED" className="bg-emerald-500/10 text-emerald-400" />}
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
              {submission?.githubUrl ? (
                <a
                  href={submission.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-orange-400 hover:text-orange-300 transition-colors break-all"
                >
                  <GitBranch className="w-4 h-4 shrink-0" /> {submission.githubUrl} <ExternalLink className="w-3.5 h-3.5 shrink-0" />
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
            Submitted At: <strong className="text-slate-200">{submission?.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'Recorded'}</strong>
          </div>
        </div>
      </Card>

      {/* Scoring Form Card */}
      <Card
        title="Evaluator Scoring & Project Review"
        subtitle={alreadyEvaluated ? 'You have evaluated this submission (you can update your scores below).' : 'Rate code implementation, functionality, UI/UX, and live demo'}
      >
        <form onSubmit={handleSubmitScore} className="space-y-6">
          <div className="space-y-4">
            {criteria.map((c, idx) => {
              const max = c.maxScore || 25;
              const val = scores[c.name] ?? Math.round(max * 0.85);
              return (
                <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">{c.name}</h5>
                    <span className="text-[10px] text-slate-500 font-mono">Max Score: {max} pts</span>
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      min={0}
                      max={max}
                      value={val}
                      onChange={(e) => handleScoreChange(c.name, e.target.value, max)}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Overall Total Score Box */}
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" /> Aggregated Evaluation Score
            </span>
            <span className="text-xl font-extrabold font-mono text-slate-100">{overallScore} pts</span>
          </div>

          <TextArea
            label="Evaluator Comments & Judge Remarks"
            rows={4}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Write evaluation feedback regarding code quality, repository structure, features, and live demo UX..."
          />

          <div className="flex items-center justify-end gap-3 pt-2">
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
