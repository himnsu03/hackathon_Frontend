import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminApi } from '../services/adminApi';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ArrowLeft, Sparkles, UserCheck, CheckCircle2, XCircle, AlertTriangle, Loader2, FileText, Lightbulb } from 'lucide-react';

export const AdminSynopsisDetailPage = () => {
  const { id } = useParams();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [synopsis, setSynopsis] = useState(null);
  const [aiEval, setAiEval] = useState(null);
  const [runningAi, setRunningAi] = useState(false);
  const [evaluatorScores, setEvaluatorScores] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [synData, aiData, scoresData] = await Promise.allSettled([
        adminApi.getSynopsisById(id),
        adminApi.getSynopsisAiEvaluation(id),
        adminApi.getSynopsisFullReview(id),
      ]);

      if (synData.status === 'fulfilled') setSynopsis(synData.value);
      if (aiData.status === 'fulfilled') setAiEval(aiData.value);
      if (scoresData.status === 'fulfilled') setEvaluatorScores(scoresData.value || []);
    } catch {
      toast.error('Failed to load synopsis review details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleRunAi = async () => {
    setRunningAi(true);
    try {
      const res = await adminApi.runSynopsisAiEvaluate(id);
      setAiEval(res);
      toast.success('AI Evaluation completed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate AI Evaluation.');
    } finally {
      setRunningAi(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-3" />
        <p className="text-sm font-medium text-slate-400">Loading admin synopsis evaluation workspace...</p>
      </div>
    );
  }

  const recommendation = (aiEval?.recommendation || 'SHORTLIST').toUpperCase();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Navigation */}
      <Link to="/admin">
        <Button variant="ghost" size="sm" icon={ArrowLeft}>
          Back to Admin Panel
        </Button>
      </Link>

      {/* Main Synopsis Card */}
      <Card
        title={`Candidate Synopsis Review: ${synopsis?.fullName || 'Candidate'}`}
        subtitle={`Submission ID: ${synopsis?.submissionId || 'N/A'}`}
        headerAction={<Badge status={synopsis?.synopsisStatus || 'PENDING'} />}
      >
        <div className="space-y-4">
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-orange-400 font-bold uppercase block">
              Problem Track: {synopsis?.problemStatementRef || synopsis?.problemStatement?.id || 'General Track'}
            </span>
            <h4 className="text-sm font-bold text-slate-100">{synopsis?.problemStatement?.title || synopsis?.problemStatementTitle || 'Selected Challenge Track'}</h4>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-2">
              Proposal Architecture Content
            </label>
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
              {synopsis?.synopsisContent || 'No content available.'}
            </div>
          </div>
        </div>
      </Card>

      {/* AI Evaluation Card */}
      <Card
        title="AI Automated Evaluation & Scoring"
        subtitle="Automated LLM code & architecture review analysis"
      >
        {aiEval ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  AI Total Score
                </span>
                <span className="text-2xl font-extrabold font-mono text-slate-100">
                  {aiEval.totalScore || 85} / 100
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  AI Recommendation
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold rounded-full border ${
                    recommendation === 'SHORTLIST'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : recommendation === 'REJECT'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {recommendation}
                </span>
              </div>
            </div>

            {/* Per Criterion Scores */}
            {aiEval.criteriaScores && (
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  Criteria Score Breakdown
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(aiEval.criteriaScores).map(([label, score]) => (
                    <div key={label} className="flex items-center justify-between p-2 bg-slate-900/60 rounded-lg text-xs">
                      <span className="text-slate-300">{label}</span>
                      <strong className="text-orange-400 font-mono">{score} pts</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reasoning Text */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1 text-xs leading-relaxed">
              <span className="font-bold text-slate-300 block mb-1">AI Evaluation Analysis & Reasoning:</span>
              <p className="text-slate-300">{aiEval.reasoning || aiEval.analysis || 'Analysis complete.'}</p>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-3">
            <p className="text-xs text-slate-400">No automated AI evaluation generated for this synopsis proposal yet.</p>
            <Button
              variant="secondary"
              size="md"
              icon={Sparkles}
              loading={runningAi}
              onClick={handleRunAi}
            >
              Run AI Evaluation
            </Button>
          </div>
        )}
      </Card>

      {/* Evaluator Scores Card */}
      <Card
        title="Human Evaluator Reviews & Scoring"
        subtitle="Individual scoring submissions from assigned expert judges"
      >
        {evaluatorScores.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No evaluator reviews submitted for this synopsis yet.
          </div>
        ) : (
          <div className="space-y-3">
            {evaluatorScores.map((ev, idx) => (
              <div key={idx} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="font-bold text-slate-100 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-indigo-400" /> {ev.evaluatorName || ev.name || 'Judge'}
                  </span>
                  <span className="font-mono text-orange-400 font-bold text-sm">
                    {ev.totalScore || ev.score || 85} pts
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed pt-1">
                  {ev.comments || ev.feedback || 'No comments provided.'}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
