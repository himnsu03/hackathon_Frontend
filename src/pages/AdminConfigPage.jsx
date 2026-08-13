import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { TextArea } from '../components/common/TextArea';
import { Badge } from '../components/common/Badge';
import { Settings, Save, Send, Loader2, Calendar, Clock, BookOpen, AlertTriangle } from 'lucide-react';

export const AdminConfigPage = ({ embedded = false }) => {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [configId, setConfigId] = useState(null);
  const [status, setStatus] = useState('NOT_SUBMITTED'); // NOT_SUBMITTED (Draft) | SHORTLISTED (Active)
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [form, setForm] = useState({
    title: '',
    eligibilityCriteria: '',
    eligiblePassingYears: '',
    synopsisStartDate: '',
    synopsisDeadline: '',
    synopsisResultDate: '',
    hackathonStartDate: '',
    hackathonEndDate: '',
    hackathonResultDate: '',
    interviewStartDate: '',
    interviewEndDate: '',
    durationHours: '',
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await adminApi.getConfig();
        if (data) {
          const toLocal = (iso) => {
            if (!iso) return '';
            const d = new Date(iso);
            if (isNaN(d.getTime())) return '';
            const pad = (n) => String(n).padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
          };
          setForm({
            title: data.title || '',
            eligibilityCriteria: data.eligibilityCriteria || '',
            eligiblePassingYears: data.eligiblePassingYears || '',
            synopsisStartDate: toLocal(data.synopsisStartDate),
            synopsisDeadline: toLocal(data.synopsisDeadline),
            synopsisResultDate: toLocal(data.synopsisResultDate),
            hackathonStartDate: toLocal(data.hackathonStartDate),
            hackathonEndDate: toLocal(data.hackathonEndDate),
            hackathonResultDate: toLocal(data.hackathonResultDate),
            interviewStartDate: toLocal(data.interviewStartDate),
            interviewEndDate: toLocal(data.interviewEndDate),
            durationHours: data.durationHours || '',
          });
        }
      } catch (err) {
        console.error('[AdminConfigPage fetch error]', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleSave = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      await adminApi.updateConfig(null, form);
      toast.success('Hackathon configuration saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save configuration.');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishConfirm = async () => {
    setShowConfirmModal(false);
    setPublishing(true);
    try {
      await adminApi.updateConfig(null, form);
      setStatus('SHORTLISTED');
      toast.success('Hackathon configuration published and activated live!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish hackathon configuration.');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-2" />
        <p className="text-xs font-medium text-slate-400">Loading admin hackathon configuration...</p>
      </div>
    );
  }

  return (
    <div className={embedded ? 'space-y-6' : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6'}>
      {/* Header (Only if standalone route) */}
      {!embedded && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
              <Settings className="w-7 h-7 text-orange-500" /> Admin Hackathon Configuration
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Configure key milestone dates, coding duration, track rules, and evaluator scoring criteria.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">Status:</span>
            <Badge status={status === 'SHORTLISTED' ? 'SHORTLISTED' : 'NOT_SUBMITTED'} />
          </div>
        </div>
      )}

      {/* Main Configuration Form Card */}
      <Card
        title="Hackathon Timeline Configuration"
        subtitle="Set synopsis and hackathon dates and coding duration"
      >
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Hackathon Event Name / Title"
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. StackHack 2.0"
            />
            <Input
              label="Candidate Coding Duration (Hours)"
              type="number"
              min={1}
              required
              value={form.durationHours}
              onChange={(e) => setForm({ ...form, durationHours: e.target.value })}
              placeholder="e.g. 48"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Eligible Passout Years (comma-separated)"
              type="text"
              required
              value={form.eligiblePassingYears}
              onChange={(e) => setForm({ ...form, eligiblePassingYears: e.target.value })}
              placeholder="e.g. 2025, 2026"
            />
            <Input
              label="Eligibility Description Text"
              type="text"
              required
              value={form.eligibilityCriteria}
              onChange={(e) => setForm({ ...form, eligibilityCriteria: e.target.value })}
              placeholder="e.g. 2025 and 2026 graduating batches"
            />
          </div>

          {/* Phase 1: Registration & Synopsis */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">Phase 1: Registration & Synopsis Submission</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Registration Start Date"
                type="datetime-local"
                value={form.synopsisStartDate}
                onChange={(e) => setForm({ ...form, synopsisStartDate: e.target.value })}
              />
              <Input
                label="Registration & Synopsis Deadline"
                type="datetime-local"
                value={form.synopsisDeadline}
                onChange={(e) => setForm({ ...form, synopsisDeadline: e.target.value })}
              />
              <Input
                label="Synopsis Shortlist & Result Date"
                type="datetime-local"
                value={form.synopsisResultDate}
                onChange={(e) => setForm({ ...form, synopsisResultDate: e.target.value })}
              />
            </div>
          </div>

          {/* Phase 2: Main Hackathon Coding */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Phase 2: Hackathon Coding Sprint</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Hackathon Start Date"
                type="datetime-local"
                value={form.hackathonStartDate}
                onChange={(e) => setForm({ ...form, hackathonStartDate: e.target.value })}
              />
              <Input
                label="Hackathon Submission Deadline"
                type="datetime-local"
                value={form.hackathonEndDate}
                onChange={(e) => setForm({ ...form, hackathonEndDate: e.target.value })}
              />
            </div>
          </div>

          {/* Phase 3: Presentation and Discussion (F2F) */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Phase 3: Presentation and Discussion (F2F) Phase</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Presentation & Discussion (F2F) Start Date"
                type="datetime-local"
                value={form.interviewStartDate}
                onChange={(e) => setForm({ ...form, interviewStartDate: e.target.value })}
              />
              <Input
                label="Presentation & Discussion (F2F) End Date"
                type="datetime-local"
                value={form.interviewEndDate}
                onChange={(e) => setForm({ ...form, interviewEndDate: e.target.value })}
              />
            </div>
          </div>

          {/* Phase 4: Final Results & Winner Announcement */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">Phase 4: Final Winner Results & Job Offer Declaration</h4>
            <Input
              label="Final Winners & Results Declaration Date"
              type="datetime-local"
              value={form.hackathonResultDate}
              onChange={(e) => setForm({ ...form, hackathonResultDate: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-800">
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Save}
              loading={saving}
            >
              Save Configuration
            </Button>
          </div>
        </form>
      </Card>

      {/* Confirmation Dialog Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-amber-500/30">
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-100">Confirm Config Publication</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Publishing this configuration will lock in official deadlines, rules, and scoring parameters for candidate and evaluator portals.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setShowConfirmModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handlePublishConfirm}>
                  Yes, Publish Live
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
