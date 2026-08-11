import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { UserCheck, Plus, Trash2, Loader2, X, Mail, Shield } from 'lucide-react';

export const AdminEvaluatorsPage = ({ embedded = false }) => {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [evaluators, setEvaluators] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({ name: '', email: '' });

  const fetchEvaluators = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getEvaluators();
      setEvaluators(data || []);
    } catch (err) {
      toast.error('Failed to load evaluators list.');
      setEvaluators([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluators();
  }, []);

  const handleOpenAdd = () => {
    setForm({ name: '', email: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Please fill in evaluator name and email address.');
      return;
    }

    setSubmitting(true);
    try {
      await adminApi.addEvaluator(form);
      toast.success(`Evaluator invitation sent to ${form.email}!`);
      setShowModal(false);
      fetchEvaluators();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add evaluator.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async (id, email) => {
    if (!window.confirm(`Are you sure you want to revoke access for evaluator ${email}?`)) return;

    try {
      await adminApi.revokeEvaluator(id);
      toast.success(`Evaluator ${email} access revoked.`);
      fetchEvaluators();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to revoke evaluator access.');
    }
  };

  return (
    <div className={embedded ? 'space-y-6' : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6'}>
      {/* Header (Only if standalone route) */}
      {!embedded && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
              <UserCheck className="w-7 h-7 text-indigo-400" /> Evaluator Management
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Invite expert judges, manage scoring permissions, and revoke access for hackathon evaluations.
            </p>
          </div>

          <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAdd}>
            Add Evaluator
          </Button>
        </div>
      )}

      {/* Main Table Card */}
      <Card
        title="Registered Hackathon Evaluators"
        subtitle="List of authorized synopsis and project submission judges"
        headerAction={
          <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAdd}>
            Add Evaluator
          </Button>
        }
      >
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-2" />
            <p className="text-xs text-slate-400">Loading evaluators list...</p>
          </div>
        ) : evaluators.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No evaluators added yet. Click "Add Evaluator" above to invite an evaluator.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Evaluator Name</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created At</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {evaluators.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-100 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
                      {ev.name}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-300">{ev.email}</td>
                    <td className="px-4 py-3.5">
                      <Badge status={ev.status === 'ACTIVE' ? 'SHORTLISTED' : 'PENDING'} />
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-400">{ev.createdAt || 'N/A'}</td>
                    <td className="px-4 py-3.5 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleRevoke(ev.id, ev.email)}
                        className="text-rose-400 hover:text-rose-300"
                        title="Revoke Evaluator Access"
                      >
                        Revoke
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Evaluator Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-slate-100">Invite New Evaluator</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Evaluator Name"
                icon={UserCheck}
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Dr. Robert Vance"
              />

              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="robert.vance@hackathon.org"
              />

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <Button type="button" variant="ghost" size="md" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" loading={submitting}>
                  Send Invitation
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
