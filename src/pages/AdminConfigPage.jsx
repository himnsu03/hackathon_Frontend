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
    title: 'StackHack 2.0 Enterprise Hackathon',
    registrationStartDate: '',
    registrationEndDate: '',
    synopsisStartDate: '',
    synopsisDeadline: '',
    shortlistDate: '',
    hackathonStartDate: '',
    hackathonEndDate: '',
    durationHours: 24,
    rules: '1. All code must be developed during the hackathon window.\n2. Open source libraries are permitted with proper attribution.\n3. Plagiarism results in immediate disqualification.',
    evaluationCriteria: '1. Technical Architecture & Code Quality (25%)\n2. Innovation & Problem Solving (25%)\n3. Completeness & Edge-Case Handling (25%)\n4. UI/UX & Live Demo Presentation (25%)',
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await adminApi.getConfig();
        if (data) {
          setConfigId(data.id || null);
          setStatus(data.status === 'PUBLISHED' || data.active ? 'SHORTLISTED' : 'NOT_SUBMITTED');
          setForm({
            title: data.title || form.title,
            registrationStartDate: data.registrationStartDate || '',
            registrationEndDate: data.registrationEndDate || '',
            synopsisStartDate: data.synopsisStartDate || '',
            synopsisDeadline: data.synopsisDeadline || '',
            shortlistDate: data.shortlistDate || '',
            hackathonStartDate: data.hackathonStartDate || '',
            hackathonEndDate: data.hackathonEndDate || '',
            durationHours: data.durationHours || 24,
            rules: data.rules || form.rules,
            evaluationCriteria: data.evaluationCriteria || form.evaluationCriteria,
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
      if (configId) {
        await adminApi.updateConfig(configId, form);
        toast.success('Draft hackathon configuration updated successfully!');
      } else {
        const res = await adminApi.createConfig(form);
        if (res?.id) setConfigId(res.id);
        toast.success('Hackathon configuration draft saved successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save configuration draft.');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishConfirm = async () => {
    setShowConfirmModal(false);
    setPublishing(true);
    try {
      const idToPublish = configId || (await adminApi.createConfig(form))?.id;
      if (idToPublish) {
        await adminApi.publishConfig(idToPublish);
        setConfigId(idToPublish);
        setStatus('SHORTLISTED');
        toast.success('Hackathon configuration published and activated live!');
      }
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
        title="Event Lifecycle & Rules Settings"
        subtitle="Fill in dates and guidelines then save draft or publish live"
        headerAction={
          embedded ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">Status:</span>
              <Badge status={status === 'SHORTLISTED' ? 'SHORTLISTED' : 'NOT_SUBMITTED'} />
            </div>
          ) : null
        }
      >
        <form onSubmit={handleSave} className="space-y-6">
          <Input
            label="Hackathon Event Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. StackHack 2.0 Enterprise Challenge"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Registration Start Date"
              type="datetime-local"
              value={form.registrationStartDate}
              onChange={(e) => setForm({ ...form, registrationStartDate: e.target.value })}
            />
            <Input
              label="Registration End Date"
              type="datetime-local"
              value={form.registrationEndDate}
              onChange={(e) => setForm({ ...form, registrationEndDate: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Synopsis Submission Start Date"
              type="datetime-local"
              value={form.synopsisStartDate}
              onChange={(e) => setForm({ ...form, synopsisStartDate: e.target.value })}
            />
            <Input
              label="Synopsis Submission Deadline"
              type="datetime-local"
              value={form.synopsisDeadline}
              onChange={(e) => setForm({ ...form, synopsisDeadline: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Shortlist Announcement Date"
              type="datetime-local"
              value={form.shortlistDate}
              onChange={(e) => setForm({ ...form, shortlistDate: e.target.value })}
            />
            <Input
              label="Hackathon Start Date"
              type="datetime-local"
              value={form.hackathonStartDate}
              onChange={(e) => setForm({ ...form, hackathonStartDate: e.target.value })}
            />
            <Input
              label="Hackathon End Date"
              type="datetime-local"
              value={form.hackathonEndDate}
              onChange={(e) => setForm({ ...form, hackathonEndDate: e.target.value })}
            />
          </div>

          <Input
            label="Hackathon Duration / Time"
            type="text"
            required
            value={form.durationHours || ''}
            onChange={(e) => setForm({ ...form, durationHours: e.target.value })}
            placeholder="e.g. 24 Hours, 02:30, or 36"
          />

          <TextArea
            label="Rules & Regulations"
            rows={5}
            value={form.rules}
            onChange={(e) => setForm({ ...form, rules: e.target.value })}
            placeholder="Specify candidate conduct policies, repository guidelines, and anti-plagiarism rules..."
          />

          <TextArea
            label="Evaluation Criteria"
            rows={5}
            value={form.evaluationCriteria}
            onChange={(e) => setForm({ ...form, evaluationCriteria: e.target.value })}
            placeholder="Detail scoring breakdown for evaluators (e.g. Technical Architecture, UI Polish, Edge Cases)..."
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              type="submit"
              variant="secondary"
              size="md"
              icon={Save}
              loading={saving}
            >
              Save Draft Config
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              icon={Send}
              loading={publishing}
              onClick={() => setShowConfirmModal(true)}
            >
              Publish Configuration
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
