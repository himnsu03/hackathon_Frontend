import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { TextArea } from '../components/common/TextArea';
import { Badge } from '../components/common/Badge';
import { Lightbulb, Plus, Edit2, Trash2, Loader2, CheckCircle2, AlertTriangle, X } from 'lucide-react';

export const AdminProblemStatementsPage = ({ embedded = false }) => {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [problemStatements, setProblemStatements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPs, setEditingPs] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    problemId: '',
    title: '',
    description: '',
    category: '',
    requirements: '',
    deliverables: '',
    useCases: '',
    rules: '',
  });

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getProblemStatements();
      setProblemStatements(data || []);
    } catch {
      setProblemStatements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleOpenAdd = () => {
    setEditingPs(null);
    setForm({ problemId: '', title: '', description: '', category: '', requirements: '', deliverables: '', useCases: '', rules: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (ps) => {
    setEditingPs(ps);
    setForm({
      problemId: ps.problemId || ps.problem_id || ps.id || '',
      title: ps.title || '',
      description: ps.description || '',
      category: ps.category || '',
      requirements: Array.isArray(ps.requirements) ? ps.requirements.join('\n') : (ps.requirements || ''),
      deliverables: Array.isArray(ps.deliverables) ? ps.deliverables.join('\n') : (ps.deliverables || ''),
      useCases: Array.isArray(ps.useCases) ? ps.useCases.join('\n') : (ps.useCases || ''),
      rules: ps.rules || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Please enter problem statement title and description.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingPs) {
        await adminApi.updateProblemStatement(editingPs.dbId || editingPs.id, form);
        toast.success(`Problem statement "${form.title}" updated successfully!`);
      } else {
        await adminApi.createProblemStatement(form);
        toast.success(`New problem statement "${form.title}" created successfully!`);
      }
      setShowModal(false);
      fetchProblems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save problem statement.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (id, title) => {
    if (!window.confirm(`Are you sure you want to deactivate problem statement "${title}"?`)) return;

    try {
      await adminApi.deactivateProblemStatement(id);
      toast.success(`Problem statement "${title}" deactivated successfully.`);
      fetchProblems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to deactivate problem statement.');
    }
  };

  return (
    <div className={embedded ? 'space-y-6' : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6'}>
      {/* Header — only if standalone route */}
      {!embedded && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
              <Lightbulb className="w-7 h-7 text-amber-400" /> Problem Statement Management
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage track challenges, description criteria, and active candidate problem statements.
            </p>
          </div>

          <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAdd}>
            Add Problem Statement
          </Button>
        </div>
      )}

      {/* Main Table Card */}
      <Card
        title="Active Hackathon Track Problems"
        subtitle="Showing all registered challenge statements"
        headerAction={
          <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAdd}>
            Add Problem Statement
          </Button>
        }
      >
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-2" />
            <p className="text-xs text-slate-400">Loading problem statements...</p>
          </div>
        ) : problemStatements.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No problem statements found. Click "Add Problem Statement" above to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">ID & Title</th>
                  <th className="px-4 py-3">Category / Track</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created At</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {problemStatements.map((ps) => (
                  <tr key={ps.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-[10px] text-orange-400 font-bold block">{ps.id}</span>
                      <strong className="text-slate-100 text-xs block mt-0.5">{ps.title}</strong>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 max-w-md">{ps.description}</p>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-300">{ps.category || 'General Tech'}</td>
                    <td className="px-4 py-3.5">
                      <Badge status={ps.active !== false ? 'SHORTLISTED' : 'NOT_SUBMITTED'} />
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-400">{ps.createdAt || ps.createdDate || 'N/A'}</td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Edit2}
                          onClick={() => handleOpenEdit(ps)}
                          title="Edit Problem Statement"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleDeactivate(ps.dbId || ps.id, ps.title)}
                          className="text-rose-400 hover:text-rose-300"
                          title="Deactivate Problem Statement"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <Card className="max-w-xl w-full max-h-[90vh] overflow-y-auto my-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4 sticky top-0 bg-slate-900 z-10 pt-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-100">
                {editingPs ? 'Edit Problem Statement' : 'Add Problem Statement'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Problem ID / Code"
                value={form.problemId}
                onChange={(e) => setForm({ ...form, problemId: e.target.value })}
                placeholder="e.g. PS-01 (Auto-generated if left blank)"
                helperText="Auto-generated if left blank."
              />

              <Input
                label="Problem Title"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Smart Waste Management System"
              />

              <Input
                label="Category / Track"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. IoT & Smart Cities"
              />

              <TextArea
                label="Problem Description & Challenge Details"
                rows={4}
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the problem statement, core issues, and expected features..."
              />

              <TextArea
                label="Key Technical Requirements"
                rows={3}
                value={form.requirements}
                onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                placeholder="e.g. Must support real-time WebSocket communication&#10;Must include JWT authentication&#10;Must deploy to AWS or Docker"
              />

              <TextArea
                label="Real-World Use Cases & Applications"
                rows={3}
                value={form.useCases}
                onChange={(e) => setForm({ ...form, useCases: e.target.value })}
                placeholder="e.g. Enterprise Municipal Garbage Collection Routing&#10;Smart City IoT Sensor Monitoring Dashboard&#10;Citizen Issue Reporting Mobile App"
              />

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2.5 pt-4 border-t border-slate-800 sticky bottom-0 bg-slate-900 pb-1 z-10">
                <Button type="button" variant="ghost" size="md" onClick={() => setShowModal(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" loading={submitting} className="w-full sm:w-auto">
                  {editingPs ? 'Update Problem Statement' : 'Save Problem Statement'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
