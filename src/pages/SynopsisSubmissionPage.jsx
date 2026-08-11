import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { synopsisApi } from '../services/synopsisApi';
import { problemStatementApi } from '../services/problemStatementApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { TextArea } from '../components/common/TextArea';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { FileText, Send, CheckCircle2, Loader2, ArrowLeft, Lightbulb, Check, RefreshCw, Lock, ListChecks, Package, Target, Award } from 'lucide-react';

export const SynopsisSubmissionPage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
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
        const statements = await problemStatementApi.getProblemStatements();
        setProblemStatements(statements || []);

        const data = await synopsisApi.getStatus();
        setSynopsisData(data);
        if (data.synopsisContent) {
          setContent(data.synopsisContent);
        }
        if (data.problemStatementRef || data.problem_statement_id) {
          setSelectedProblemId(data.problemStatementRef || data.problem_statement_id);
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

  const status = synopsisData?.status || user?.synopsisStatus || 'NOT_SUBMITTED';
  const isShortlisted = status === 'SHORTLISTED';
  const isSubmitted = Boolean(synopsisData?.submitted) && (!isEditing || isShortlisted);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isShortlisted) {
      setError('Your synopsis has been shortlisted and cannot be edited or switched.');
      toast.error('Shortlisted synopses are locked.');
      return;
    }

    if (content.length < MIN_CHARS) {
      setError(`Your proposal must contain at least ${MIN_CHARS} characters (currently ${content.length}).`);
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      const res = await synopsisApi.submitSynopsis({
        problem_statement_id: selectedProblemId,
        problemStatementRef: selectedProblemId,
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
        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-3" />
        <p className="text-sm font-medium text-slate-400">Loading synopsis workspace...</p>
      </div>
    );
  }

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

              {isSubmitted && !isShortlisted && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Change Problem / Edit Proposal
                </button>
              )}
            </div>

            {isSubmitted ? (
              <div className="p-4 bg-gradient-to-r from-slate-950 to-orange-950/40 border border-orange-500/30 rounded-xl space-y-1">
                <span className="text-[10px] font-mono text-orange-400 font-bold uppercase">{selectedProblem?.id || selectedProblemId}</span>
                <h4 className="text-sm font-bold text-slate-100">{selectedProblem?.title || selectedProblemId || 'Selected Problem Track'}</h4>
                {selectedProblem?.description && <p className="text-xs text-slate-300">{selectedProblem.description}</p>}
              </div>
            ) : problemStatements.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {problemStatements.map((ps) => {
                  const isSelected = selectedProblemId === ps.id;
                  return (
                    <button
                      key={ps.id}
                      type="button"
                      onClick={() => setSelectedProblemId(ps.id)}
                      className={`p-4 rounded-xl border text-left transition-all relative ${isSelected
                        ? 'bg-orange-950/60 border-orange-500 text-slate-100 ring-2 ring-orange-500/40 shadow-lg'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                    >
                      {isSelected && (
                        <span className="absolute top-3 right-3 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-slate-950">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-orange-400 font-bold uppercase block">{ps.id}</span>
                      <h4 className="text-xs font-bold text-slate-100 mt-0.5">{ps.title}</h4>
                      <span className="text-[10px] text-slate-500 block mb-1 font-mono">{ps.category}</span>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{ps.description}</p>

                      <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-2 border-t border-slate-800/60">
                        {ps.requirements?.length > 0 && (
                          <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800/40">
                            {ps.requirements.length} Reqs
                          </span>
                        )}
                        {ps.useCases?.length > 0 && (
                          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                            {ps.useCases.length} Use Cases
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <Input
                label="Problem Statement Title / Track Reference"
                required
                value={selectedProblemId}
                onChange={(e) => setSelectedProblemId(e.target.value)}
                placeholder="e.g. PS-01 Smart Waste Management System"
              />
            )}
          </div>

          {/* Full Expanded View of Chosen Problem Statement */}
          {selectedProblem && (
            <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4 shadow-inner">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                <div>
                  <span className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-wider block">
                    Selected Track Full Details: {selectedProblem.id}
                  </span>
                  <h4 className="text-base font-bold text-slate-100 mt-0.5">{selectedProblem.title}</h4>
                </div>
                {selectedProblem.category && (
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full w-max">
                    {selectedProblem.category}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Challenge Summary & Overview
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedProblem.description}</p>
              </div>

              {/* Key Technical Requirements List */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ListChecks className="w-4 h-4 text-indigo-400" /> Key Technical Requirements & Guidelines ({selectedProblem.requirements?.length || 0})
                </span>
                {selectedProblem.requirements && selectedProblem.requirements.length > 0 ? (
                  <ul className="space-y-1.5 pl-1">
                    {selectedProblem.requirements.map((req, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 italic pl-1">No technical requirements specified for this track.</p>
                )}
              </div>

              {/* Real-World Use Cases List */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-400" /> Real-World Use Cases & Target Applications ({selectedProblem.useCases?.length || 0})
                </span>
                {selectedProblem.useCases && selectedProblem.useCases.length > 0 ? (
                  <ul className="space-y-1.5 pl-1">
                    {selectedProblem.useCases.map((uc, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                        <Target className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{uc}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 italic pl-1">No real-world use cases specified for this track.</p>
                )}
              </div>
            </div>
          )}

          {/* Synopsis Evaluation Criteria & Judging Rubric Box (Always Visible) */}
          <div className="p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950/40 border border-orange-500/30 rounded-xl space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-400" /> Synopsis Evaluation Criteria
                </h4>
              </div>
              <span className="text-[10px] font-mono font-bold text-orange-400 bg-orange-950/80 border border-orange-500/40 px-2.5 py-1 rounded-full w-max">
                100% Total Score
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/90 text-slate-400 font-mono uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <th className="py-2.5 px-3 font-bold">Evaluation Criteria</th>
                    <th className="py-2.5 px-3 font-bold">Definition & Judging Scope</th>
                    <th className="py-2.5 px-3 font-bold text-right">Weightage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  <tr className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-100 flex items-center gap-2">
                      <Target className="w-4 h-4 text-orange-400 shrink-0" />
                      Problem Understanding & Relevance
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 leading-relaxed">
                      How clearly the Individual understands the problem statement, target users, constraints, and business context, and whether the solution directly addresses the stated problem.
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-orange-400 text-right shrink-0">10%</td>
                  </tr>

                  <tr className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-100 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                      Innovation & Originality
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 leading-relaxed">
                      The uniqueness of the idea, creativity in approach, and the extent to which the solution introduces a novel concept or significantly improves existing methods.
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-400 text-right shrink-0">20%</td>
                  </tr>

                  <tr className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-100 flex items-center gap-2">
                      <ListChecks className="w-4 h-4 text-indigo-400 shrink-0" />
                      Technical Implementation
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 leading-relaxed">
                      The quality of architecture, algorithms, coding practices, use of AI/ML, cloud, APIs, databases, or other relevant technologies, and overall technical complexity.
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-indigo-400 text-right shrink-0">20%</td>
                  </tr>

                  <tr className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-100 flex items-center gap-2">
                      <Package className="w-4 h-4 text-emerald-400 shrink-0" />
                      Feasibility & Practicality
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 leading-relaxed">
                      Whether the solution can realistically be implemented in a production or enterprise environment, considering cost, resources, timeline, and operational constraints.
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-400 text-right shrink-0">15%</td>
                  </tr>

                  <tr className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-100 flex items-center gap-2">
                      <Award className="w-4 h-4 text-cyan-400 shrink-0" />
                      Business Impact & Scalability
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 leading-relaxed">
                      The potential value delivered to users or organizations, including efficiency gains, cost reduction, revenue potential, scalability, and long-term sustainability.
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-cyan-400 text-right shrink-0">15%</td>
                  </tr>

                  <tr className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-100 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-rose-400 shrink-0" />
                      User Experience & Design
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 leading-relaxed">
                      Clarity of workflow, ease of use, accessibility, interface quality, and how effectively the solution solves the user’s problem from a usability perspective.
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-rose-400 text-right shrink-0">10%</td>
                  </tr>

                  <tr className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-100 flex items-center gap-2">
                      <Send className="w-4 h-4 text-violet-400 shrink-0" />
                      Presentation & Demonstration
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 leading-relaxed">
                      Effectiveness of the final pitch, live demonstration, storytelling, communication skills, handling of Q&A, and overall clarity in presenting the solution.
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-violet-400 text-right shrink-0">10%</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
                  Submitted Proposal Content ({selectedProblemId})
                </label>
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-200 whitespace-pre-wrap break-words break-all [overflow-wrap:anywhere] max-w-full overflow-hidden leading-relaxed font-sans min-h-[160px]">
                  {synopsisData?.synopsisContent}
                </div>
              </div>

              {isShortlisted ? (
                <div className="flex items-center gap-3 p-4 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs">
                  <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-200 block mb-0.5">Synopsis Shortlisted & Locked</span>
                    <span>Your synopsis proposal has been shortlisted. Problem track selection and proposal content are locked and cannot be edited or switched.</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Your proposal is recorded. You can edit your text or switch problem statements anytime before shortlisting.</span>
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
              )}
            </div>
          ) : selectedProblemId ? (
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
                <h5 className="font-semibold text-slate-300 font-mono text-orange-400">Selected Challenge: {selectedProblem?.title} ({selectedProblemId})</h5>
                <p>
                  Submitting will record your proposal under <strong>{selectedProblemId}</strong> for organizer review. You can update or switch problem statements anytime.
                </p>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
                {synopsisData?.submitted && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    onClick={() => setIsEditing(false)}
                    className="w-full sm:w-auto shrink-0"
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
                  {synopsisData?.submitted ? 'Update Synopsis' : 'Submit Synopsis For Evaluation'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-xl text-center space-y-2">
              <Lightbulb className="w-8 h-8 text-amber-400 mx-auto mb-1 animate-pulse" />
              <h4 className="text-sm font-bold text-slate-200">Select a Problem Statement Track</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Please click one of the problem statement challenge cards above to view full details and unlock the technical synopsis submission form.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
