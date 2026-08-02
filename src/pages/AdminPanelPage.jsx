import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Select } from '../components/common/Select';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { ShieldCheck, CheckCircle2, XCircle, Trophy, Filter, UserCheck, Plus, Trash2, Loader2 } from 'lucide-react';

export const AdminPanelPage = () => {
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('synopsis'); // synopsis | results

  // Tab 1 State: Synopsis Table
  const [synopses, setSynopses] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [synopsisLoading, setSynopsisLoading] = useState(true);

  // Tab 2 State: Declare Results
  const [resultsList, setResultsList] = useState([
    { candidateId: 'usr_001', position: '1st Place', projectTitle: 'Smart Traffic AI Vision' },
    { candidateId: 'usr_002', position: '2nd Place', projectTitle: 'OmniWarehouse Engine' },
  ]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('1st Place');
  const [projectTitle, setProjectTitle] = useState('');
  const [declaring, setDeclaring] = useState(false);

  const fetchSynopses = async (filter = statusFilter) => {
    setSynopsisLoading(true);
    try {
      const res = await adminApi.getAllSynopses(filter);
      setSynopses(res.synopses || []);
    } catch {
      toast.error('Failed to load synopsis submissions list.');
    } finally {
      setSynopsisLoading(false);
    }
  };

  useEffect(() => {
    fetchSynopses(statusFilter);
  }, [statusFilter]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await adminApi.updateSynopsisStatus(id, newStatus);
      toast.success(`Updated status to ${newStatus}`);
      fetchSynopses();
    } catch {
      toast.error('Failed to update synopsis status.');
    }
  };

  const handleAddResultItem = () => {
    if (!selectedCandidate) {
      toast.error('Please select a candidate to assign.');
      return;
    }
    const candidateObj = synopses.find((s) => s.id === selectedCandidate);
    setResultsList([
      ...resultsList,
      {
        candidateId: selectedCandidate,
        name: candidateObj ? candidateObj.fullName : 'Selected Candidate',
        submissionId: candidateObj ? candidateObj.submissionId : 'SUB-2026-000',
        position: selectedPosition,
        projectTitle: projectTitle.trim() || 'Hackathon Solution',
      },
    ]);
    setProjectTitle('');
    setSelectedCandidate('');
    toast.info('Added winner entry to draft list.');
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
    } catch {
      toast.error('Failed to publish results.');
    } finally {
      setDeclaring(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Admin Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Organizer Admin Controls
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 mt-2">Hackathon Management Dashboard</h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('synopsis')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'synopsis'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Synopsis Management
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'results'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Declare Results
          </button>
        </div>
      </div>

      {activeTab === 'synopsis' ? (
        /* Tab 1: Synopsis Table & Shortlisting */
        <Card
          title="Candidate Synopsis Submissions"
          subtitle="Review candidate proposals and grant hackathon access"
          headerAction={
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending Review</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="REJECTED">Rejected</option>
                <option value="NOT_SUBMITTED">Not Submitted</option>
              </select>
            </div>
          }
        >
          {synopsisLoading ? (
            <div className="py-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-2" />
              <p className="text-xs text-slate-400">Loading submissions...</p>
            </div>
          ) : synopses.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No candidates found matching the selected filter ({statusFilter}).
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Candidate Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Submission ID</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Submitted At</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {synopses.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-200">{item.fullName}</td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono">{item.email}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">{item.submissionId}</td>
                      <td className="py-3.5 px-4">
                        <Badge status={item.synopsisStatus} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono">
                        {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      ) : (
        /* Tab 2: Declare Results Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Side */}
          <Card title="Assign Winners" subtitle="Select candidate and position to declare">
            <div className="space-y-4">
              <Select
                label="Select Candidate"
                placeholder="Choose candidate..."
                options={synopses.map((s) => ({
                  value: s.id,
                  label: `${s.fullName} (${s.submissionId})`,
                }))}
                value={selectedCandidate}
                onChange={(e) => setSelectedCandidate(e.target.value)}
              />

              <Select
                label="Assign Position"
                options={['1st Place', '2nd Place', '3rd Place', 'Consolation Winner']}
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
              />

              <Input
                label="Project Title"
                placeholder="e.g. Smart Traffic AI"
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
                  No winners assigned yet. Use the form on the left to add winners.
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
                        <h4 className="text-sm font-bold text-slate-100 mt-1">{item.name || 'Candidate'}</h4>
                        <p className="text-xs text-slate-400 font-mono">
                          {item.submissionId} • Project: "{item.projectTitle}"
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
