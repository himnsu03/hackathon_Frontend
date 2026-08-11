import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../services/adminApi';
import { problemStatementService } from '../services/problemStatementService';
import { hackathonConfigService } from '../services/hackathonConfigService';
import { AdminConfigPage } from './AdminConfigPage';
import { AdminEvaluatorsPage } from './AdminEvaluatorsPage';
import { AdminProblemStatementsPage } from './AdminProblemStatementsPage';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Select } from '../components/common/Select';
import { Input } from '../components/common/Input';
import { TextArea } from '../components/common/TextArea';
import { Badge } from '../components/common/Badge';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Trophy,
  Filter,
  Plus,
  Trash2,
  Loader2,
  Star,
  ChevronDown,
  ChevronUp,
  FileText,
  RefreshCw,
  GitBranch,
  Globe,
  ExternalLink,
  BookOpen,
  Calendar,
  Clock,
  Settings,
  Save,
  Sparkles,
  UserCheck,
  Lightbulb,
} from 'lucide-react';

export const AdminPanelPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('results'); // results | config | evaluators

  // Tab 1 State: Synopsis Table
  const [synopses, setSynopses] = useState([]);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [synopsisLoading, setSynopsisLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);

  // Tab 2 State: Project Submissions Table
  const [projectSubmissions, setProjectSubmissions] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  // Tab 3 State: Problem Statements Management
  const [problemStatements, setProblemStatements] = useState([]);
  const [newPsId, setNewPsId] = useState('');
  const [newPsTitle, setNewPsTitle] = useState('');
  const [newPsCategorySelect, setNewPsCategorySelect] = useState('IoT & Smart Cities');
  const [customPsCategory, setCustomPsCategory] = useState('');
  const [newPsDescription, setNewPsDescription] = useState('');
  const [newPsRules, setNewPsRules] = useState('');

  // Tab 4 State: Hackathon Config & Deadlines
  const [synopsisDeadlineInput, setSynopsisDeadlineInput] = useState('');
  const [projectDeadlineInput, setProjectDeadlineInput] = useState('');
  const [durationHoursInput, setDurationHoursInput] = useState(24);
  const [savingConfig, setSavingConfig] = useState(false);

  // Tab 5 State: Declare Results
  const [allCandidates, setAllCandidates] = useState([]);
  const [resultsList, setResultsList] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [customSubmissionId, setCustomSubmissionId] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('1st Place');
  const [projectTitle, setProjectTitle] = useState('');
  const [declaring, setDeclaring] = useState(false);

  const CATEGORY_OPTIONS = [
    'IoT & Smart Cities',
    'Artificial Intelligence & ML',
    'Web3 & Blockchain',
    'CleanTech & Sustainability',
    'FinTech & Payments',
    'Healthcare & MedTech',
    'Cybersecurity & Privacy',
    'EdTech & E-Learning',
    'AR/VR & Gaming',
    'DevOps & Cloud Automation',
    'Open Innovation Track',
    'Custom Category (Type below)...',
  ];

  const fetchSynopses = async (filter = statusFilter) => {
    setSynopsisLoading(true);
    try {
      const res = await adminApi.getAllSynopses(filter);
      setSynopses(res.synopses || []);
    } catch (err) {
      console.error('[Admin Panel Fetch Error]', err);
      const statusCode = err.response?.status;
      const detailMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Unknown network error';
      
      let msg = `Failed to load candidate synopsis submissions (${statusCode || 'Network'}): ${detailMsg}`;
      if (statusCode === 403) {
        msg = 'Access Denied (403): Your account does not have ADMIN privileges. Please re-login with admin@hackathon.com / Admin@123.';
      }
      toast.error(msg);
    } finally {
      setSynopsisLoading(false);
    }
  };

  const fetchProjectSubmissions = async () => {
    setProjectsLoading(true);
    try {
      const data = await adminApi.getProjectSubmissions();
      setProjectSubmissions(data || []);
    } catch (e) {
      console.error('Error fetching project submissions:', e);
      toast.error('Failed to load candidate project submissions.');
    } finally {
      setProjectsLoading(false);
    }
  };

  const fetchAllCandidates = async () => {
    try {
      const res = await adminApi.getAllSynopses('ALL');
      setAllCandidates(res.synopses || []);
    } catch (e) {
      console.error('Error fetching all candidates for results dropdown:', e);
    }
  };

  useEffect(() => {
    fetchSynopses(statusFilter);
    fetchProjectSubmissions();
    fetchAllCandidates();
    setProblemStatements(problemStatementService.getStatements());

    const currentConfig = hackathonConfigService.getConfig();
    if (currentConfig.synopsisDeadline) {
      const localDate = new Date(currentConfig.synopsisDeadline).toISOString().slice(0, 16);
      setSynopsisDeadlineInput(localDate);
    }
    if (currentConfig.durationHours) {
      setDurationHoursInput(currentConfig.durationHours);
    }
  }, [statusFilter]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await adminApi.updateSynopsisStatus(id, newStatus);
      toast.success(`Candidate synopsis ${newStatus.toLowerCase()} successfully!`);
      fetchSynopses();
      fetchAllCandidates();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update synopsis status.');
    }
  };

  const handleAddProblemStatement = (e) => {
    e.preventDefault();
    if (!newPsTitle.trim() || !newPsDescription.trim()) {
      toast.error('Title and Description are required for problem statements.');
      return;
    }

    const finalCategory =
      newPsCategorySelect === 'Custom Category (Type below)...'
        ? customPsCategory.trim() || 'General Innovation'
        : newPsCategorySelect;

    const added = problemStatementService.addStatement({
      id: newPsId.trim() || `PS-${Date.now().toString().slice(-4)}`,
      title: newPsTitle,
      category: finalCategory,
      description: newPsDescription,
      rules: newPsRules,
    });

    setProblemStatements(problemStatementService.getStatements());
    setNewPsId('');
    setNewPsTitle('');
    setCustomPsCategory('');
    setNewPsDescription('');
    setNewPsRules('');
    toast.success(`Problem Statement "${added.title}" published successfully!`);
  };

  const handleDeleteProblemStatement = (id) => {
    const updated = problemStatementService.deleteStatement(id);
    setProblemStatements(updated);
    toast.info('Problem statement removed.');
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      hackathonConfigService.updateConfig({
        synopsisDeadline: synopsisDeadlineInput ? new Date(synopsisDeadlineInput).toISOString() : null,
        projectSubmissionDeadline: projectDeadlineInput ? new Date(projectDeadlineInput).toISOString() : null,
        durationHours: Number(durationHoursInput) || 24,
      });
      toast.success('Hackathon Config, Deadlines & Duration updated successfully!');
    } catch (e) {
      toast.error('Failed to update hackathon configuration.');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleAddResultItem = () => {
    const targetSubId = customSubmissionId.trim() || selectedCandidateId;
    if (!targetSubId) {
      toast.error('Please select a candidate or enter a Submission ID.');
      return;
    }

    const candidateObj = allCandidates.find(
      (s) => s.submissionId === targetSubId || s.id === targetSubId
    );

    const subIdToSave = candidateObj ? candidateObj.submissionId : targetSubId;

    const isAlreadyInDraft = resultsList.some(
      (item) => item.submissionId === subIdToSave
    );

    if (isAlreadyInDraft) {
      toast.warning(`Candidate (${subIdToSave}) is ALREADY assigned to a winner position!`);
      return;
    }

    const isPositionTakenInDraft = resultsList.some(
      (item) => item.position === selectedPosition
    );

    if (isPositionTakenInDraft) {
      toast.warning(`Position "${selectedPosition}" is ALREADY assigned to another candidate!`);
      return;
    }

    setResultsList([
      ...resultsList,
      {
        submissionId: subIdToSave,
        name: candidateObj ? candidateObj.fullName : 'Selected Candidate',
        position: selectedPosition,
        projectTitle: projectTitle.trim() || 'Smart Solution Proposal',
      },
    ]);

    setProjectTitle('');
    setSelectedCandidateId('');
    setCustomSubmissionId('');
    toast.info(`Added entry for ${subIdToSave} (${selectedPosition}) to draft winners podium.`);
  };

  const handleRemoveResultItem = (index) => {
    setResultsList(resultsList.filter((_, i) => i !== index));
  };

  const handlePublishResults = async () => {
    if (resultsList.length === 0) {
      toast.error('Add at least one winner entry before declaring results.');
      return;
    }

    setDeclaring(true);
    try {
      const res = await adminApi.declareResults(resultsList);
      toast.success(res.message || 'Results published live to public leaderboard!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish results to backend.');
    } finally {
      setDeclaring(false);
    }
  };

  const availableCandidatesForWinner = allCandidates.filter(
    (s) => !resultsList.some((draft) => draft.submissionId === s.submissionId)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Admin Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Organizer Admin Controls
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 mt-2">Hackathon Management Console</h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3">
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setActiveTab('results');
                fetchAllCandidates();
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'results'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Declare Results
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'config'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Event Config
            </button>
            <button
              onClick={() => setActiveTab('evaluators')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'evaluators'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Evaluators
            </button>
            <button
              onClick={() => {
                setActiveTab('problems');
                fetchProblemStatements();
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'problems'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Problem Statements
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'config' ? (
        <AdminConfigPage embedded />
      ) : activeTab === 'evaluators' ? (
        <AdminEvaluatorsPage embedded />
      ) : activeTab === 'problems' ? (
        <AdminProblemStatementsPage embedded />
      ) : activeTab === 'synopses' ? (
        /* Tab 1: Synopsis Proposals Review */
        <Card
          title="Candidate Synopsis Proposals"
          subtitle="Review candidate technical proposals and grant main hackathon access"
          headerAction={
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="PENDING">Pending Review</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="REJECTED">Rejected</option>
                <option value="ALL">All Submissions</option>
              </select>
            </div>
          }
        >
          {synopsisLoading ? (
            <div className="py-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-2" />
              <p className="text-xs text-slate-400">Fetching synopsis submissions from Spring Boot backend...</p>
            </div>
          ) : synopses.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No candidate synopsis submissions found for status <strong className="text-slate-300">"{statusFilter}"</strong>.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Submission ID</th>
                    <th className="py-3 px-4">Track Ref</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Synopsis Score</th>
                    <th className="py-3 px-4">Submitted At</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {synopses.map((item) => {
                    const isExpanded = expandedRow === item.id;
                    return (
                      <React.Fragment key={item.id}>
                        <tr className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-slate-200">
                            <div>{item.fullName}</div>
                            <span className="text-[10px] text-slate-500 font-mono">{item.email}</span>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-orange-400">{item.submissionId}</td>
                          <td className="py-3.5 px-4 font-mono text-slate-300">{item.problemStatementRef || 'PS-01'}</td>
                          <td className="py-3.5 px-4">
                            <Badge status={item.synopsisStatus} />
                          </td>
                          <td className="py-3.5 px-4">
                            {(() => {
                              const scoreVal = item.averageScore ?? item.aggregatedScore ?? item.score ?? item.totalScore;
                              return scoreVal != null ? (
                                <span className="inline-flex items-center gap-1 font-mono text-xs text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  {Number(scoreVal).toFixed(1)} / 100
                                </span>
                              ) : (
                                <span className="text-[11px] font-mono text-slate-500 italic">Not Rated</span>
                              );
                            })()}
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 font-mono">
                            {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setExpandedRow(isExpanded ? null : item.id)}
                                className="px-2.5 py-1 text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 text-[11px] font-medium"
                                title="View proposal text"
                              >
                                <FileText className="w-3.5 h-3.5 text-orange-400" />
                                Proposal
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                              <Link to={`/admin/synopsis/${item.id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  icon={Sparkles}
                                  className="text-amber-400 hover:bg-amber-500/10"
                                >
                                  AI & Scores
                                </Button>
                              </Link>
                              {item.synopsisStatus !== 'SHORTLISTED' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  icon={CheckCircle2}
                                  onClick={() => handleUpdateStatus(item.id, 'SHORTLISTED')}
                                  className="text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10"
                                >
                                  Shortlist
                                </Button>
                              )}
                              {item.synopsisStatus !== 'REJECTED' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  icon={XCircle}
                                  onClick={() => handleUpdateStatus(item.id, 'REJECTED')}
                                  className="text-rose-400 hover:bg-rose-500/10"
                                >
                                  Reject
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Synopsis Proposal Content */}
                        {isExpanded && (
                          <tr className="bg-slate-950/90 border-b border-slate-800">
                            <td colSpan={6} className="p-4">
                              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
                                <h5 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-2">
                                  <FileText className="w-4 h-4" /> Technical Synopsis Proposal Description
                                </h5>
                                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap break-words break-all [overflow-wrap:anywhere] max-w-full overflow-hidden font-sans">
                                  {item.synopsisContent || 'No proposal text available.'}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      ) : activeTab === 'projects' ? (
        /* Tab 2: Dedicated Final Project Submissions View */
        <Card
          title="Final Hackathon Project Deliverables"
          subtitle="Inspect candidate GitHub repositories and live deployed application links"
        >
          {projectsLoading ? (
            <div className="py-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-2" />
              <p className="text-xs text-slate-400">Loading project repository submissions from Spring Boot...</p>
            </div>
          ) : projectSubmissions.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No final project submissions recorded yet. Once shortlisted candidates start their timer and submit their GitHub repo URLs, they will appear here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Submission ID</th>
                    <th className="py-3 px-4">GitHub Repository</th>
                    <th className="py-3 px-4">Live App Demo</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Project Score</th>
                    <th className="py-3 px-4">Submitted At</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {projectSubmissions.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        <div>{item.candidateName}</div>
                        <span className="text-[10px] text-slate-500 font-mono">{item.candidateEmail}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-orange-400">{item.submissionId}</td>
                      <td className="py-3.5 px-4">
                        {item.githubRepoUrl ? (
                          <a
                            href={item.githubRepoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-orange-400 hover:text-orange-300 hover:underline font-mono font-medium"
                          >
                            <GitBranch className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                            <span>Repository</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-slate-500 font-mono">Not submitted</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {item.liveAppUrl ? (
                          <a
                            href={item.liveAppUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 hover:underline font-mono font-medium"
                          >
                            <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Live App</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-slate-500 font-mono">Not submitted</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                            item.status === 'SUBMITTED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : item.status === 'IN_PROGRESS'
                              ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30 animate-pulse'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {(() => {
                          const scoreVal = item.averageScore ?? item.aggregatedScore ?? item.score ?? item.totalScore;
                          return scoreVal != null ? (
                            <span className="inline-flex items-center gap-1 font-mono text-xs text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              {Number(scoreVal).toFixed(1)} / 100
                            </span>
                          ) : (
                            <span className="text-[11px] font-mono text-slate-500 italic">Not Rated</span>
                          );
                        })()}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono">
                        {item.submissionTime ? new Date(item.submissionTime).toLocaleString() : 'In Progress'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link to={`/admin/hackathon-submissions/${item.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Sparkles}
                            className="text-amber-400 hover:bg-amber-500/10"
                          >
                            AI & Scores
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      ) : activeTab === 'problems' ? (
        /* Tab 3: Problem Statements Management */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Problem Statement & Rules Form */}
          <Card title="Add Problem Statement & Rules" subtitle="Publish challenge tracks and technical rules for candidates">
            <form onSubmit={handleAddProblemStatement} className="space-y-4">
              <Input
                label="Reference Code"
                placeholder="e.g. PS-AI-04 (Auto-generated if empty)"
                value={newPsId}
                onChange={(e) => setNewPsId(e.target.value)}
              />

              <Input
                label="Problem Title"
                placeholder="e.g. Smart Waste Management System"
                value={newPsTitle}
                onChange={(e) => setNewPsTitle(e.target.value)}
                required
              />

              <Select
                label="Category / Track"
                options={CATEGORY_OPTIONS}
                value={newPsCategorySelect}
                onChange={(e) => setNewPsCategorySelect(e.target.value)}
              />

              {newPsCategorySelect === 'Custom Category (Type below)...' && (
                <Input
                  label="Enter Custom Category Name"
                  placeholder="e.g. Quantum Computing, BioTech..."
                  value={customPsCategory}
                  onChange={(e) => setCustomPsCategory(e.target.value)}
                  required
                />
              )}

              <TextArea
                label="Problem Description & Challenge Details"
                placeholder="Describe the problem statement, core issues, and expected features..."
                rows={4}
                value={newPsDescription}
                onChange={(e) => setNewPsDescription(e.target.value)}
                required
              />

              <TextArea
                label="Track Rules & Engineering Constraints"
                placeholder="e.g. 1. Must use IoT sensor streams.\n2. Must provide architecture diagram.\n3. Open-source libraries attributed."
                rows={4}
                value={newPsRules}
                onChange={(e) => setNewPsRules(e.target.value)}
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                icon={Plus}
              >
                Publish Problem Statement & Rules
              </Button>
            </form>
          </Card>

          {/* Active Problem Statements List */}
          <div className="lg:col-span-2">
            <Card
              title="Active Problem Statements & Guidelines"
              subtitle="Challenge tracks and rules published for candidate synopsis submissions"
            >
              {problemStatements.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No problem statements published yet. Create one using the form on the left.
                </div>
              ) : (
                <div className="space-y-4">
                  {problemStatements.map((ps) => (
                    <div
                      key={ps.id}
                      className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/30">
                              {ps.id}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                              {ps.category}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-100 mt-1">{ps.title}</h3>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteProblemStatement(ps.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1.5 bg-slate-900 rounded-lg"
                          title="Delete problem statement"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{ps.description}</p>

                      {ps.rules && (
                        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg space-y-1">
                          <h5 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" /> Track Specific Rules & Guidelines
                          </h5>
                          <p className="text-xs text-slate-300 whitespace-pre-wrap font-sans font-mono leading-relaxed">
                            {ps.rules}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      ) : (
        /* Tab 5: Declare Results Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Side */}
          <Card title="Assign Winners" subtitle="Select registered candidate or enter Submission ID">
            <div className="space-y-4">
              <Select
                label="Select Registered Candidate"
                placeholder="Choose candidate from list..."
                options={availableCandidatesForWinner.map((s) => ({
                  value: s.submissionId,
                  label: `${s.fullName} (${s.submissionId}) [${s.synopsisStatus}]`,
                }))}
                value={selectedCandidateId}
                onChange={(e) => {
                  setSelectedCandidateId(e.target.value);
                  setCustomSubmissionId('');
                }}
              />

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-800 w-full" />
                <span className="bg-slate-900 px-3 text-[10px] font-mono text-slate-500 uppercase">or enter manually</span>
              </div>

              <Input
                label="Or Enter Submission ID Manually"
                placeholder="e.g. HACK-2026-16835"
                value={customSubmissionId}
                onChange={(e) => {
                  setCustomSubmissionId(e.target.value);
                  setSelectedCandidateId('');
                }}
              />

              <Select
                label="Assign Position"
                options={['1st Place', '2nd Place', '3rd Place', 'Consolation Winner']}
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
              />

              <Input
                label="Project Title (Optional)"
                placeholder="e.g. Smart Waste Management System"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
              />

              <Button
                variant="secondary"
                size="md"
                fullWidth
                icon={Plus}
                onClick={handleAddResultItem}
              >
                Add to Winners List
              </Button>
            </div>
          </Card>

          {/* Draft List & Publish Button */}
          <div className="lg:col-span-2">
            <Card
              title="Draft Winner Podium"
              subtitle="Review assigned positions before publishing live"
              footer={
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={declaring}
                  icon={Trophy}
                  onClick={handlePublishResults}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold"
                >
                  Declare Results & Publish Live
                </Button>
              }
            >
              {resultsList.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No winners assigned yet. Select a candidate from the dropdown or enter a Submission ID on the left.
                </div>
              ) : (
                <div className="space-y-3">
                  {resultsList.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between gap-4"
                    >
                      <div>
                        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                          {item.position}
                        </span>
                        <h4 className="text-sm font-bold text-slate-100 mt-1">{item.name || 'Winning Candidate'}</h4>
                        <p className="text-xs text-slate-400 font-mono">
                          Submission ID: <strong className="text-orange-400">{item.submissionId}</strong>
                        </p>
                      </div>

                      <button
                        onClick={() => handleRemoveResultItem(idx)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        title="Remove entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
