import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { TextArea } from '../components/common/TextArea';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Sliders,
  Trophy,
  Filter,
} from 'lucide-react';

export const AdminSynopsisAiCriteriaPage = () => {
  const toast = useToast();

  const [selectedHackathonId, setSelectedHackathonId] = useState(1);
  const [criteriaList, setCriteriaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL | ACTIVE | INACTIVE

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [weightage, setWeightage] = useState(25.0);
  const [targetHackathonId, setTargetHackathonId] = useState(1);
  const [active, setActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedHackathonId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const criteriaRes = await adminApi.getAllSynopsisAiCriteria(selectedHackathonId);
      const list = Array.isArray(criteriaRes) ? criteriaRes : (criteriaRes?.content || criteriaRes?.items || []);
      setCriteriaList(list);
    } catch (err) {
      console.error('[AI Criteria Fetch Error]', err);
      const statusCode = err?.status || err?.response?.status || 'Error';
      const errorMsg = err?.body?.message || err?.response?.data?.message || err?.message || 'Failed to load criteria';
      toast.error(`Backend Notice (${statusCode}): ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCriteria(null);
    setTitle('');
    setDescription('');
    setWeightage(25.0);
    setTargetHackathonId(selectedHackathonId);
    setActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingCriteria(item);
    setTitle(item.title || '');
    setDescription(item.description || '');
    setWeightage(item.weightage ?? 25.0);
    setTargetHackathonId(item.hackathonConfigId || selectedHackathonId);
    setActive(item.active ?? true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCriteria(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Criteria Title is required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        weightage: parseFloat(weightage) || 25.0,
        hackathonConfigId: parseInt(targetHackathonId, 10) || 1,
        active: active,
      };

      if (editingCriteria) {
        await adminApi.updateSynopsisAiCriteria(editingCriteria.id, payload);
        toast.success('Synopsis AI Criteria updated successfully!');
      } else {
        await adminApi.createSynopsisAiCriteria(payload);
        toast.success(`AI Criteria created for Hackathon #${payload.hackathonConfigId}!`);
      }

      closeModal();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save criteria');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, criteriaTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${criteriaTitle}"?`)) return;

    try {
      await adminApi.deleteSynopsisAiCriteria(id);
      toast.success('Criteria deleted successfully');
      setCriteriaList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      toast.error('Failed to delete criteria');
    }
  };

  const filteredCriteria = criteriaList.filter((item) => {
    if (statusFilter === 'ACTIVE') return item.active === true;
    if (statusFilter === 'INACTIVE') return item.active === false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-purple-900/40 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>AI Automated Evaluation Rubrics</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Synopsis AI Evaluation Criteria</h2>
          <p className="text-gray-400 text-sm max-w-2xl">
            Create and manage evaluation criteria and weightages per hackathon event. Criteria apply hackathon-wide to all problem statements.
          </p>
        </div>

        {/* Hackathon Selector & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-950/80 border border-purple-500/30 px-3 py-1.5 rounded-xl">
            <Trophy className="w-4 h-4 text-purple-400" />
            <label className="text-xs font-semibold text-gray-300">Hackathon ID:</label>
            <input
              type="number"
              min="1"
              value={selectedHackathonId}
              onChange={(e) => setSelectedHackathonId(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-16 bg-gray-900 border border-gray-700 rounded px-2 py-0.5 text-xs text-white text-center font-mono focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 bg-gray-950/80 border border-gray-800 px-3 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses ({criteriaList.length})</option>
              <option value="ACTIVE">Active Only ({criteriaList.filter((c) => c.active).length})</option>
              <option value="INACTIVE">Inactive Only ({criteriaList.filter((c) => !c.active).length})</option>
            </select>
          </div>

          <Button variant="secondary" onClick={fetchData} disabled={loading} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button onClick={openAddModal} className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500">
            <Plus className="w-4 h-4" />
            Add AI Criteria
          </Button>
        </div>
      </div>

      {/* Criteria Cards List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          <p className="text-sm">Loading AI Evaluation Criteria for Hackathon #{selectedHackathonId}...</p>
        </div>
      ) : filteredCriteria.length === 0 ? (
        <Card className="p-12 text-center border border-gray-800 bg-gray-900/50">
          <Sparkles className="w-12 h-12 text-purple-400/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Criteria Found for Hackathon #{selectedHackathonId}</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
            Click below to create custom evaluation criteria and weightages for this hackathon.
          </p>
          <Button onClick={openAddModal} className="gap-2 mx-auto">
            <Plus className="w-4 h-4" /> Add AI Criteria
          </Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          {filteredCriteria.map((item) => (
            <Card
              key={item.id}
              className={`p-6 border transition-all duration-200 hover:border-purple-500/40 relative group w-full ${
                item.active ? 'border-purple-500/30 bg-gray-900/70 shadow-lg' : 'border-gray-800/50 bg-gray-950/40 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-purple-300">
                    <span className="flex items-center gap-1 bg-purple-950/60 border border-purple-500/30 px-2.5 py-1 rounded-md font-mono">
                      <Sliders className="w-3 h-3 text-purple-400" />
                      Weightage: {item.weightage}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 text-gray-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors"
                    title="Edit Criteria"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete Criteria"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {item.description && (
                <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-gray-900 border border-purple-500/30 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-lg">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>{editingCriteria ? 'Edit Synopsis AI Criteria' : 'Add Synopsis AI Evaluation Criteria'}</span>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Criteria Title *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Technical Feasibility & Architecture"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Hackathon Config ID *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={targetHackathonId}
                    onChange={(e) => setTargetHackathonId(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Weightage (%) *
                  </label>
                  <Input
                    type="number"
                    step="0.5"
                    min="1"
                    max="100"
                    value={weightage}
                    onChange={(e) => setWeightage(e.target.value)}
                    placeholder="25.0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Definition & Judging Scope Description
                </label>
                <TextArea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of what this evaluation criteria assesses..."
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded border-gray-800 focus:ring-purple-500 bg-gray-950"
                  />
                  <span>Active Criteria (Enable in Evaluation)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Save Criteria
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
