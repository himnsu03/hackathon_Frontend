import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { synopsisApi } from '../services/synopsisApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { TextArea } from '../components/common/TextArea';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { FileText, Send, CheckCircle2, AlertTriangle, Loader2, ArrowLeft, Lightbulb } from 'lucide-react';

export const SynopsisSubmissionPage = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const toast = useToast();

  const [synopsisData, setSynopsisData] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const MIN_CHARS = 200;

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await synopsisApi.getStatus();
        setSynopsisData(data);
        if (data.synopsisContent) {
          setContent(data.synopsisContent);
        }
      } catch {
        toast.error('Failed to load synopsis status.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.length < MIN_CHARS) {
      setError(`Your proposal must contain at least ${MIN_CHARS} characters (currently ${content.length}).`);
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      const res = await synopsisApi.submitSynopsis({ content });
      toast.success(res.message || 'Synopsis submitted successfully!');
      
      // Update local auth context synopsis status
      updateUser({ synopsisStatus: 'PENDING' });

      // Short delay before redirecting to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit synopsis. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-3" />
        <p className="text-sm font-medium text-slate-400">Loading synopsis workspace...</p>
      </div>
    );
  }

  const isSubmitted = synopsisData?.submitted;
  const status = synopsisData?.status || 'NOT_SUBMITTED';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Navigation & Countdown Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm" icon={ArrowLeft}>
            Back to Dashboard
          </Button>
        </Link>

        {!isSubmitted && synopsisData?.deadline && (
          <div className="flex items-center gap-3 bg-amber-950/40 border border-amber-500/40 px-4 py-2 rounded-xl text-amber-300">
            <span className="text-xs font-semibold">Synopsis Deadline:</span>
            <CountdownTimer targetDate={synopsisData.deadline} urgentThresholdHours={24} />
          </div>
        )}
      </div>

      {/* Main Synopsis Card */}
      <Card
        title="Hackathon Synopsis Proposal"
        subtitle="Outline your technical architecture and proposed solution"
        headerAction={<Badge status={status} />}
      >
        <div className="space-y-6">
          {/* Problem Statement Teaser */}
          <div className="p-5 bg-gradient-to-r from-slate-950 to-indigo-950/40 border border-indigo-500/30 rounded-2xl space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" /> Challenge Track Problem Statement
            </span>
            <p className="text-sm text-slate-100 font-medium leading-relaxed">
              {synopsisData?.problemStatement}
            </p>
          </div>

          {isSubmitted ? (
            /* Read-Only Mode */
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs">
                <span className="text-slate-400">
                  Status: <strong className="text-slate-200">{status}</strong>
                </span>
                <span className="text-slate-400">
                  Submitted At:{' '}
                  <strong className="text-slate-200 font-mono">
                    {synopsisData?.submittedAt ? new Date(synopsisData.submittedAt).toLocaleString() : 'N/A'}
                  </strong>
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-2">
                  Submitted Proposal Content
                </label>
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-200 whitespace-pre-wrap leading-relaxed font-sans min-h-[160px]">
                  {synopsisData?.synopsisContent}
                </div>
              </div>

              <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  Your synopsis has been recorded and locked. Our evaluation committee is currently reviewing submissions.
                </span>
              </div>
            </div>
          ) : (
            /* Editable Form Mode */
            <form onSubmit={handleSubmit} className="space-y-6">
              <TextArea
                label="Technical Approach & Architecture Synopsis"
                placeholder="Describe your solution architecture, tech stack components, key algorithms, database design, and how you will solve edge cases (minimum 200 characters)..."
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                charCount={content.length}
                minChars={MIN_CHARS}
                error={error}
                required
              />

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1 text-xs text-slate-400">
                <h5 className="font-semibold text-slate-300">Submission Note:</h5>
                <p>
                  Once submitted, your synopsis will enter <strong>Pending Review</strong> state. Make sure to detail your engineering approach clearly.
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={submitting}
                disabled={content.length < MIN_CHARS}
                icon={Send}
              >
                Submit Synopsis For Evaluation
              </Button>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
};
