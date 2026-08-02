import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { synopsisApi } from '../services/synopsisApi';
import { problemStatementService } from '../services/problemStatementService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { TextArea } from '../components/common/TextArea';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { FileText, Send, CheckCircle2, Loader2, ArrowLeft, Lightbulb, Check, RefreshCw } from 'lucide-react';

export const SynopsisSubmissionPage = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const toast = useToast();

  const [synopsisData, setSynopsisData] = useState(null);
  const [problemStatements, setProblemStatements] = useState([]);
  const [selectedProblemId, setSelectedProblemId] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  const MIN_CHARS = 200;

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const statements = problemStatementService.getStatements();
        setProblemStatements(statements);
        if (statements.length > 0) {
          setSelectedProblemId(statements[0].id);
        }

        const data = await synopsisApi.getStatus();
        setSynopsisData(data);
        if (data.synopsisContent) {
          setContent(data.synopsisContent);
        }
        if (data.problemStatementRef) {
          setSelectedProblemId(data.problemStatementRef);
        }
      } catch {
        // No prior submission, default state
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const selectedProblem = problemStatements.find((p) => p.id === selectedProblemId) || problemStatements[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.length < MIN_CHARS) {
      setError(`Your proposal must contain at least ${MIN_CHARS} characters (currently ${content.length}).`);
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      const res = await synopsisApi.submitSynopsis({
        problemStatementRef: selectedProblemId || 'PS-SMART-CITY-01',
        content,
      });
      toast.success(res.message || `Synopsis proposal for ${selectedProblemId} submitted successfully!`);
      
      updateUser({ synopsisStatus: 'PENDING' });
      setIsEditing(false);

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

  const isSubmitted = synopsisData?.submitted && !isEditing;
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

        {synopsisData?.deadline && (
          <div className="flex items-center gap-3 bg-amber-950/40 border border-amber-500/40 px-4 py-2 rounded-xl text-amber-300">
            <span className="text-xs font-semibold">Synopsis Window:</span>
            <CountdownTimer targetDate={synopsisData.deadline} urgentThresholdHours={24} />
          </div>
        )}
      </div>

      {/* Main Synopsis Card */}
      <Card
        title="Hackathon Synopsis Proposal"
        subtitle="Select an organizer problem statement & outline your technical architecture"
        headerAction={<Badge status={status} />}
      >
        <div className="space-y-6">
          {/* Select Problem Statement */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" /> Select Problem Statement Track
              </label>

              {isSubmitted && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Change Problem / Edit Proposal
                </button>
              )}
            </div>

            {isSubmitted ? (
              <div className="p-4 bg-gradient-to-r from-slate-950 to-indigo-950/40 border border-indigo-500/30 rounded-xl space-y-1">
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">{selectedProblem?.id}</span>
                <h4 className="text-sm font-bold text-slate-100">{selectedProblem?.title || 'Smart Waste Management'}</h4>
                <p className="text-xs text-slate-300">{selectedProblem?.description}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {problemStatements.map((ps) => {
                  const isSelected = selectedProblemId === ps.id;
                  return (
                    <button
                      key={ps.id}
                      type="button"
                      onClick={() => setSelectedProblemId(ps.id)}
                      className={`p-4 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? 'bg-indigo-950/60 border-indigo-500 text-slate-100 ring-2 ring-indigo-500/40 shadow-lg'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-3 right-3 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-slate-950">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase block">{ps.id}</span>
                      <h4 className="text-xs font-bold text-slate-100 mt-0.5">{ps.title}</h4>
                      <span className="text-[10px] text-slate-500 block mb-1 font-mono">{ps.category}</span>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{ps.description}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {isSubmitted ? (
            /* Read-Only Mode with Edit Button */
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
                  Submitted Proposal Content ({selectedProblemId})
                </label>
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-200 whitespace-pre-wrap leading-relaxed font-sans min-h-[160px]">
                  {synopsisData?.synopsisContent}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 rounded-xl text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Your proposal is recorded. You can edit your text or switch problem statements anytime.</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon={RefreshCw}
                  onClick={() => setIsEditing(true)}
                  className="shrink-0"
                >
                  Switch Track / Edit Proposal
                </Button>
              </div>
            </div>
          ) : (
            /* Editable Form Mode */
            <form onSubmit={handleSubmit} className="space-y-6">
              <TextArea
                label={`Technical Approach Synopsis for Track: ${selectedProblemId}`}
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
                <h5 className="font-semibold text-slate-300 font-mono text-indigo-400">Selected Challenge: {selectedProblem?.title} ({selectedProblemId})</h5>
                <p>
                  Submitting will record your proposal under <strong>{selectedProblemId}</strong> for organizer review. You can update or switch problem statements anytime.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {synopsisData?.submitted && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel Editing
                  </Button>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={submitting}
                  disabled={content.length < MIN_CHARS}
                  icon={Send}
                >
                  {synopsisData?.submitted ? 'Update Synopsis & Save Track' : 'Submit Synopsis For Evaluation'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
};
