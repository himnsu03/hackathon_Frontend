import React, { useState, useEffect } from 'react';
import { X, Shield, Send, CheckCircle2, Search, FileText, RefreshCw, AlertCircle, Lock } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { TextArea } from './TextArea';
import { Select } from './Select';
import { httpClient } from '../../services/httpClient';
import { useToast } from '../../context/ToastContext';

export const ManageMyDataModal = ({ isOpen, onClose }) => {
  const toast = useToast();

  const [tab, setTab] = useState('submit'); // 'submit' | 'track'
  const [loading, setLoading] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [ticketResult, setTicketResult] = useState(null);
  const [trackTicketId, setTrackTicketId] = useState('');
  const [trackResult, setTrackResult] = useState(null);

  const [formData, setFormData] = useState({
    requestType: 'ACCESS',
    fullName: '',
    email: '',
    phoneNumber: '',
    submissionId: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Enter a valid email address';
    }
    if (!formData.description.trim()) {
      errs.description = 'Please describe your request in detail';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await httpClient.post('/api/public/data-protection-requests', {
        requestType: formData.requestType,
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber.trim() || undefined,
        submissionId: formData.submissionId.trim() || undefined,
        description: formData.description.trim(),
      });

      setTicketResult(response.data);
      toast.success(`Request recorded successfully! Ticket: ${response.data?.ticketId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackTicketId.trim()) return;

    setTrackingLoading(true);
    setTrackResult(null);
    try {
      const response = await httpClient.get(`/api/public/data-protection-requests/track/${trackTicketId.trim()}`);
      setTrackResult(response.data);
    } catch (err) {
      toast.error('No request found with this Ticket ID.');
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-sm animate-fade-in overflow-hidden">
      <div className="fixed inset-0 bg-transparent" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-2xl max-h-[88vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col z-10 overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-bold text-slate-100 tracking-tight">
                Data Protection & Privacy Portal (Manage My Data)
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Exercise your data rights under the Digital Personal Data Protection (DPDP) Act
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-3 border-b border-slate-800 flex items-center gap-4 bg-slate-950/50 shrink-0">
          <button
            type="button"
            onClick={() => setTab('submit')}
            className={`pb-2.5 text-xs font-bold transition-colors border-b-2 ${
              tab === 'submit'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Submit Data Subject Request
          </button>
          <button
            type="button"
            onClick={() => setTab('track')}
            className={`pb-2.5 text-xs font-bold transition-colors border-b-2 ${
              tab === 'track'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Track Existing Request
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 py-5 flex-1 min-h-0 overflow-y-auto text-slate-300 text-xs sm:text-sm leading-relaxed">
          {tab === 'submit' ? (
            ticketResult ? (
              <div className="p-6 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-100">
                    Data Subject Request Submitted Successfully
                  </h4>
                  <p className="text-xs text-slate-300">
                    Your request has been logged under reference number:
                  </p>
                  <div className="inline-block font-mono text-base font-extrabold text-orange-400 bg-slate-950 px-4 py-1.5 rounded-lg border border-orange-500/40 my-2">
                    {ticketResult.ticketId}
                  </div>
                </div>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Our Data Protection & Grievance Officer will review your request. In accordance with statutory requirements, our team will acknowledge within 48 hours and process your request within 30 days.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setTicketResult(null);
                      setFormData({
                        requestType: 'ACCESS',
                        fullName: '',
                        email: '',
                        phoneNumber: '',
                        submissionId: '',
                        description: '',
                      });
                    }}
                  >
                    Submit Another Request
                  </Button>
                  <Button variant="primary" size="sm" onClick={onClose}>
                    Done
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1">
                      Request Type <span className="text-orange-400">*</span>
                    </label>
                    <select
                      value={formData.requestType}
                      onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                    >
                      <option value="ACCESS">Access My Data (Request Copy)</option>
                      <option value="CORRECTION">Correction of Inaccurate Data</option>
                      <option value="ERASURE">Erasure / Deletion of Account & Data</option>
                      <option value="WITHDRAW_CONSENT">Withdraw Consent (Marketing / Participation)</option>
                      <option value="GRIEVANCE">Privacy Grievance / Inquiry</option>
                    </select>
                  </div>

                  <Input
                    label="Full Name"
                    required
                    placeholder="Enter your registered name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    error={errors.fullName}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Registered Email Address"
                    required
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={errors.email}
                  />

                  <Input
                    label="Mobile Phone Number (Optional)"
                    placeholder="10-digit mobile number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                </div>

                <Input
                  label="Submission ID (Optional)"
                  placeholder="e.g. SUB-12345 (if registered)"
                  value={formData.submissionId}
                  onChange={(e) => setFormData({ ...formData, submissionId: e.target.value })}
                />

                <TextArea
                  label="Specific Details of Request / Grounds"
                  required
                  rows={4}
                  placeholder="Please describe specifically what data you wish to access, correct, delete, or any concerns regarding your personal data..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  error={errors.description}
                />

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-[11px] text-slate-400 flex items-start gap-2">
                  <Lock className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                  <span>
                    To protect participant privacy, we may verify your identity via email confirmation before fulfilling data access or deletion requests.
                  </span>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <Button variant="secondary" size="sm" type="button" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit" loading={loading} icon={Send}>
                    Submit Privacy Request
                  </Button>
                </div>
              </form>
            )
          ) : (
            <div className="space-y-4">
              <form onSubmit={handleTrack} className="flex gap-2">
                <Input
                  placeholder="Enter Ticket ID (e.g. DSR-XXXXXXXX)"
                  value={trackTicketId}
                  onChange={(e) => setTrackTicketId(e.target.value)}
                  className="flex-1"
                />
                <Button variant="primary" size="sm" type="submit" loading={trackingLoading} icon={Search}>
                  Track
                </Button>
              </form>

              {trackResult && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-orange-400">{trackResult.ticketId}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        trackResult.status === 'RESOLVED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : trackResult.status === 'IN_PROGRESS'
                          ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {trackResult.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p><strong>Request Type:</strong> {trackResult.requestType}</p>
                    <p><strong>Name:</strong> {trackResult.fullName}</p>
                    <p><strong>Email:</strong> {trackResult.email}</p>
                    {trackResult.resolutionNotes && (
                      <div className="pt-2 border-t border-slate-800">
                        <strong className="text-emerald-400 block mb-0.5">Resolution Notes:</strong>
                        <p className="text-slate-300">{trackResult.resolutionNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
