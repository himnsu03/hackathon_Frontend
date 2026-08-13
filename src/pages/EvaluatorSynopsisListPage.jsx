import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { evaluatorApi } from '../services/evaluatorApi';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Select } from '../components/common/Select';
import { Badge } from '../components/common/Badge';
import { FileText, Loader2, Filter, ChevronRight, Star } from 'lucide-react';

export const EvaluatorSynopsisListPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [synopses, setSynopses] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [problemFilter, setProblemFilter] = useState('ALL');

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      try {
        const data = await evaluatorApi.getSynopses();
        setSynopses(data || []);
      } catch (err) {
        toast.error('Failed to load candidate synopses for evaluation.');
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, []);

  const uniqueProblems = Array.from(
    new Set(synopses.map((s) => s.problemStatementTitle || s.problemStatementRef).filter(Boolean))
  );

  const filteredSynopses = synopses.filter((s) => {
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesProblem =
      problemFilter === 'ALL' ||
      s.problemStatementTitle === problemFilter ||
      s.problemStatementRef === problemFilter;
    return matchesStatus && matchesProblem;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            <FileText className="w-7 h-7 text-amber-400" /> Evaluator Portal — Synopsis Review
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review candidate technical proposals, evaluate solution architecture, and assign scores.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Filter className="w-4 h-4 text-orange-400" /> Filters:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
            <Select
              label="Synopsis Status"
              options={['ALL', 'PENDING_REVIEW', 'SHORTLISTED', 'REJECTED']}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            <Select
              label="Problem Statement Track"
              options={['ALL', ...uniqueProblems]}
              value={problemFilter}
              onChange={(e) => setProblemFilter(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Main Synopsis Submissions Table */}
      <Card title="Candidate Synopsis Submissions" subtitle="Click any row to view details and submit scores">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-2" />
            <p className="text-xs text-slate-400">Loading candidate synopses...</p>
          </div>
        ) : filteredSynopses.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No candidate synopses match the selected filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Candidate Name</th>
                  <th className="px-4 py-3">Submission ID</th>
                  <th className="px-4 py-3">Problem Statement</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Submitted At</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredSynopses.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => navigate(`/evaluator/synopsis/${s.id}`)}
                    className="hover:bg-slate-900/60 transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-3.5 font-bold text-slate-100">{s.candidateName || s.fullName || 'Candidate'}</td>
                    <td className="px-4 py-3.5 font-mono text-orange-400 font-bold">{s.submissionId || 'N/A'}</td>
                    <td className="px-4 py-3.5 text-slate-300">{s.problemStatementTitle || s.problemStatementRef || 'General Track'}</td>
                    <td className="px-4 py-3.5">
                      <Badge status={s.status || 'PENDING'} />
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-400">
                      {s.submittedAt ? new Date(s.submittedAt).toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-orange-400 transition-colors ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
