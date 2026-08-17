import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { evaluatorApi } from '../services/evaluatorApi';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Select } from '../components/common/Select';
import { Badge } from '../components/common/Badge';
import { UserCheck, Loader2, GitBranch, ChevronRight, Filter, FileSpreadsheet } from 'lucide-react';
import { exportToExcel } from '../utils/excelExport';
import { Button } from '../components/common/Button';

export const EvaluatorInterviewListPage = () => {
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
        // Filter only SHORTLISTED candidate projects eligible for Phase 4 F2F Presentation & Discussion
        const shortlistedList = (data || []).filter(
          (item) => item.status === 'SHORTLISTED'
        );
        setSubmissions(shortlistedList);
      } catch (err) {
        toast.error('Failed to load shortlisted candidate project submissions for interview.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const getIntStatus = (sub) => {
    const hasEvaluated = Boolean(
      sub.f2fScore != null ||
      (sub.f2fEvaluationCount && sub.f2fEvaluationCount > 0) ||
      sub.interviewEvaluated ||
      sub.interviewStatus === 'COMPLETED'
    );
    return hasEvaluated ? 'INTERVIEW_COMPLETED' : 'INTERVIEW_PENDING';
  };

  const filteredSubmissions = submissions.filter((sub) => {
    const intStatus = getIntStatus(sub);
    if (statusFilter === 'INTERVIEW_COMPLETED') return intStatus === 'INTERVIEW_COMPLETED';
    if (statusFilter === 'INTERVIEW_PENDING') return intStatus === 'INTERVIEW_PENDING';
    return true;
  });

  const handleExport = () => {
    if (filteredSubmissions.length === 0) {
      toast.warning('No F2F interview candidate data available to export with current filters.');
      return;
    }

    const excelData = filteredSubmissions.map((s, idx) => ({
      'S.No': idx + 1,
      'Candidate Name': s.candidateName || s.fullName || s.name || s.user?.name || 'N/A',
      'Email': s.candidateEmail || s.email || s.userEmail || s.user?.email || 'N/A',
      'Submission ID': s.submissionId || s.user?.submissionId || 'N/A',
      'F2F Interview Status': getIntStatus(s) === 'INTERVIEW_COMPLETED' ? 'Completed' : 'Pending Review',
      'Hackathon Project Score': s.aggregatedScore != null ? s.aggregatedScore : (s.overallScore != null ? s.overallScore : (s.averageScore != null ? s.averageScore : 'N/A')),
      'F2F Judge Score': s.f2fScore != null ? s.f2fScore : 'N/A',
      'F2F Evaluation Count': s.f2fEvaluationCount || 0,
      'GitHub Repository': s.githubRepoUrl || 'N/A',
    }));

    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = `F2F_Interview_Candidates_${statusFilter}_${dateStr}.xlsx`;
    exportToExcel(excelData, fileName, 'Interview Candidates');
    toast.success(`Exported ${excelData.length} interview candidate records to Excel!`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-emerald-400" /> Evaluator Portal — Presentation & Discussion (F2F)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Conduct Phase 4 Face-to-Face interviews, review project demos live, and record judge feedback scores.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={FileSpreadsheet}
          onClick={handleExport}
          className="border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 self-start sm:self-auto font-semibold"
        >
          Export Excel ({filteredSubmissions.length})
        </Button>
      </div>

      {/* Filter Controls Card */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0">
            <Filter className="w-4 h-4 text-orange-400" /> Filter Interview Status:
          </div>
          <div className="flex-1 w-full max-w-xs">
            <Select
              label="Interview Status"
              options={['ALL', 'INTERVIEW_PENDING', 'INTERVIEW_COMPLETED']}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Main Submissions Table */}
      <Card
        title="Shortlisted Interview Candidates"
        subtitle="Candidates who passed Phase 3 hackathon project evaluation and qualified for F2F Presentation"
      >
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-2" />
            <p className="text-xs text-slate-400">Loading shortlisted candidates for interview...</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No interview candidates match the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Candidate Name</th>
                  <th className="px-4 py-3">Candidate Email</th>
                  <th className="px-4 py-3">Submission ID</th>
                  <th className="px-4 py-3">Interview Status</th>
                  <th className="px-4 py-3">F2F Score</th>
                  <th className="px-4 py-3">GitHub Repo</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredSubmissions.map((sub) => {
                  const intStatus = getIntStatus(sub);
                  const hasEvaluated = intStatus === 'INTERVIEW_COMPLETED';
                  return (
                    <tr
                      key={sub.id}
                      onClick={() => navigate(`/evaluator/interview/${sub.id}`)}
                      className="hover:bg-slate-900/60 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-3.5 font-bold text-slate-100">
                        {sub.candidateName || sub.fullName || 'Candidate'}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-300">
                        {sub.candidateEmail || sub.email || 'N/A'}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-orange-400 font-bold">
                        {sub.submissionId || 'N/A'}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge status={intStatus} />
                      </td>
                      <td className="px-4 py-3.5">
                        {sub.f2fScore != null ? (
                          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg font-mono font-bold text-xs">
                            {sub.f2fScore} pts
                          </span>
                        ) : (
                          <span className="text-slate-500 font-mono text-xs italic">Pending Score</span>
                        )}
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
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/evaluator/interview/${sub.id}`);
                          }}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 border rounded-lg text-xs font-bold transition-all ${hasEvaluated
                              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                              : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/60'
                            }`}
                        >
                          <span>{hasEvaluated ? 'Review F2F' : 'Conduct F2F'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
