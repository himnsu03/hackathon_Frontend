import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { evaluatorApi } from '../services/evaluatorApi';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Select } from '../components/common/Select';
import { Badge } from '../components/common/Badge';
import { Terminal, Loader2, GitBranch, ExternalLink, ChevronRight, Star, Filter } from 'lucide-react';

export const EvaluatorHackathonListPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const data = await evaluatorApi.getHackathonSubmissions();
        setSubmissions(data || []);
      } catch (err) {
        toast.error('Failed to load candidate hackathon submissions.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const filteredSubmissions = submissions.filter((s) => {
    return statusFilter === 'ALL' || s.status === statusFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            <Terminal className="w-7 h-7 text-emerald-400" /> Evaluator Portal — Hackathon Submissions
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review final candidate GitHub repositories, live demo deployments, and submit project scores.
          </p>
        </div>
      </div>

      {/* Filter Controls Card */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0">
            <Filter className="w-4 h-4 text-orange-400" /> Filter:
          </div>
          <div className="flex-1 w-full max-w-xs">
            <Select
              label="Submission Status"
              options={['ALL', 'SUBMITTED', 'IN_PROGRESS', 'SHORTLISTED', 'REJECTED', 'NOT_STARTED']}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Main Submissions Table */}
      <Card title="Submitted Coding Projects" subtitle="Click any candidate row to review repository and rate project">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-2" />
            <p className="text-xs text-slate-400">Loading hackathon submissions...</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No hackathon project submissions match the selected filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Candidate Name</th>
                  <th className="px-4 py-3">Submission ID</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">GitHub Repo</th>
                  <th className="px-4 py-3">Project Score</th>
                  <th className="px-4 py-3">Submitted At</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredSubmissions.map((sub) => (
                  <tr
                    key={sub.id}
                    onClick={() => navigate(`/evaluator/hackathon-submissions/${sub.id}`)}
                    className="hover:bg-slate-900/60 transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-3.5 font-bold text-slate-100">{sub.candidateName || sub.fullName || 'Candidate'}</td>
                    <td className="px-4 py-3.5 font-mono text-orange-400 font-bold">{sub.submissionId || 'N/A'}</td>
                    <td className="px-4 py-3.5">
                      <Badge status={sub.status || 'SUBMITTED'} />
                    </td>
                    <td className="px-4 py-3.5">
                      {sub.githubUrl || sub.githubRepoUrl ? (
                        <a
                          href={sub.githubUrl || sub.githubRepoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-orange-400 rounded-lg text-xs font-mono border border-slate-700 transition-colors"
                        >
                          <GitBranch className="w-3.5 h-3.5" /> Repository
                        </a>
                      ) : (
                        <span className="text-slate-500 font-mono">No link</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {(() => {
                        const scoreVal = sub.averageScore ?? sub.aggregatedScore ?? sub.score ?? sub.totalScore;
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
                    <td className="px-4 py-3.5 font-mono text-slate-400">
                      {sub.submittedAt || sub.submissionTime ? new Date(sub.submittedAt || sub.submissionTime).toLocaleString() : 'Recorded'}
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
