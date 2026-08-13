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
import { ArrowLeft, FileText, Lightbulb, Award, Send, Loader2, CheckCircle2, XCircle } from 'lucide-react';

export const EvaluatorSynopsisDetailPage = () => {
  const { id } = useParams();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [synopsis, setSynopsis] = useState(null);
  const [criteria, setCriteria] = useState([]);
  const [scores, setScores] = useState({});
  const [overallScore, setOverallScore] = useState(0);
  const [comments, setComments] = useState('');
  const [alreadyEvaluated, setAlreadyEvaluated] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const [synData, existingEval] = await Promise.allSettled([
          evaluatorApi.getSynopsisById(id),
          evaluatorApi.getMySynopsisEvaluation(id),
        ]);

        let syn = null;
        if (synData.status === 'fulfilled') {
          syn = synData.value;
          setSynopsis(syn);
        }

        // Fetch criteria submitted by Admin
        let critList = [];
        try {
          const adminCritData = await adminApi.getPublicSynopsisAiCriteria(1, syn?.problemStatementRef);
          if (Array.isArray(adminCritData) && adminCritData.length > 0) {
            critList = adminCritData.map((c) => ({
              name: c.title,
              maxScore: c.weightage || 20,
              description: c.description || 'Assesses proposal quality and technical alignment.'
            }));
          }
        } catch (e) {
          // Ignore error fallback
        }

        setCriteria(critList);

        // Pre-fill existing evaluation ONLY if evaluator previously saved an evaluation
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
          // Do NOT pre-fill automatic scores
          setScores({});
          setOverallScore(0);
        }
      } catch (err) {
        toast.error('Failed to load synopsis submission details.');
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
      await evaluatorApi.evaluateSynopsis(id, {
        scores,
        totalScore: overallScore,
        score: overallScore,
        comments,
      });
      toast.success('Synopsis evaluation submitted successfully!');
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
      const updated = await evaluatorApi.shortlistSynopsis(id);
      setSynopsis((prev) => (updated ? updated : { ...prev, status: 'SHORTLISTED' }));
      toast.success(`Synopsis proposal for ${synopsis?.candidateName || 'Candidate'} shortlisted successfully!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to shortlist synopsis proposal.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      const updated = await evaluatorApi.rejectSynopsis(id);
      setSynopsis((prev) => (updated ? updated : { ...prev, status: 'REJECTED' }));
      toast.error(`Synopsis proposal for ${synopsis?.candidateName || 'Candidate'} rejected.`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject synopsis proposal.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-3" />
        <p className="text-sm font-medium text-slate-400">Loading synopsis proposal for review...</p>
      </div>
    );
  }

  const ps = synopsis?.problemStatement;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Navigation */}
      <Link to="/evaluator/synopsis">
        <Button variant="ghost" size="sm" icon={ArrowLeft}>
          Back to Synopsis List
        </Button>
      </Link>

      {/* Main Synopsis Proposal Card */}
      <Card
        title={`Candidate Synopsis Review: ${synopsis?.candidateName || 'Candidate'}`}
        subtitle={`Submission ID: ${synopsis?.submissionId || 'N/A'}`}
        headerAction={<Badge status={synopsis?.status || 'PENDING'} />}
      >
        <div className="space-y-6">
          {/* Candidate Selected Problem Statement */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5">
            <span className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Chosen Problem Track
            </span>
            <h4 className="text-sm font-bold text-slate-100">{ps?.title || synopsis?.problemStatementTitle || 'Selected Problem Track'}</h4>
            {ps?.description && <p className="text-xs text-slate-300 leading-relaxed">{ps.description}</p>}
          </div>

          {/* Proposal Content */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-400" /> Submitted Technical Architecture & Approach
            </label>
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-200 whitespace-pre-wrap break-words leading-relaxed font-sans min-h-[160px]">
              {synopsis?.synopsisContent || synopsis?.content || 'No proposal text provided.'}
            </div>
          </div>
        </div>
      </Card>

      {/* Scoring & Action Form Card */}
      <Card
        title="Evaluator Scoring & Shortlist Control"
        subtitle={alreadyEvaluated ? 'You have evaluated this submission (you can update scores or shortlist state below).' : 'Rate candidate criteria, provide feedback, and shortlist candidates'}
      >
        <form onSubmit={handleSubmitScore} className="space-y-6">
          <div className="space-y-4">
            {criteria.map((c, idx) => {
              const max = c.maxScore || 25;
              const val = scores[c.name] ?? '';
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
          <div className="p-4 bg-orange-950/40 border border-orange-500/30 rounded-xl flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-400" /> Aggregated Evaluation Score
            </span>
            <span className="text-xl font-extrabold font-mono text-slate-100">{overallScore} / 100</span>
          </div>

          <TextArea
            label="Evaluator Comments & Technical Feedback"
            rows={4}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Write constructive evaluation notes regarding architecture, feasibility, and risk..."
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="success"
                size="md"
                icon={CheckCircle2}
                loading={actionLoading}
                disabled={synopsis?.status === 'SHORTLISTED'}
                onClick={handleShortlist}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                {synopsis?.status === 'SHORTLISTED' ? 'Shortlisted' : 'Shortlist Synopsis'}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="md"
                icon={XCircle}
                loading={actionLoading}
                disabled={synopsis?.status === 'REJECTED'}
                onClick={handleReject}
                className="border-rose-500/50 text-rose-400 hover:bg-rose-950/60 font-semibold"
              >
                {synopsis?.status === 'REJECTED' ? 'Rejected' : 'Reject Candidate'}
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
