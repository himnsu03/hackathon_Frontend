import {
  AdminSynopsisManagementService,
  AdminResultManagementService,
  SynopsisAiEvaluationCriteriaService,
  AdminHackathonConfigService,
  AdminProblemStatementService,
  AdminEvaluatorService,
} from '../sdk';
import { httpClient } from './httpClient';

export const adminApi = {
  /**
   * Get candidate synopsis submissions from backend via SDK
   * @param {string} filterStatus - PENDING | SHORTLISTED | REJECTED | ALL
   */
  async getAllSynopses(filterStatus = 'PENDING') {
    if (filterStatus === 'ALL') {
      try {
        const [pendingRes, shortlistedRes, rejectedRes] = await Promise.allSettled([
          AdminSynopsisManagementService.getSubmissions('PENDING', 0, 100),
          AdminSynopsisManagementService.getSubmissions('SHORTLISTED', 0, 100),
          AdminSynopsisManagementService.getSubmissions('REJECTED', 0, 100),
        ]);

        const combined = [];
        if (pendingRes.status === 'fulfilled') combined.push(...(pendingRes.value.content || []));
        if (shortlistedRes.status === 'fulfilled') combined.push(...(shortlistedRes.value.content || []));
        if (rejectedRes.status === 'fulfilled') combined.push(...(rejectedRes.value.content || []));

        return { synopses: mapSynopsisList(combined) };
      } catch {
        const res = await AdminSynopsisManagementService.getSubmissions('PENDING', 0, 100);
        return { synopses: mapSynopsisList(res.content || []) };
      }
    }

    const validStatus = ['PENDING', 'SHORTLISTED', 'REJECTED'].includes(filterStatus) ? filterStatus : 'PENDING';
    const response = await AdminSynopsisManagementService.getSubmissions(validStatus, 0, 100);
    const content = response.content || response.items || response || [];
    return { synopses: mapSynopsisList(content) };
  },

  /**
   * Get single synopsis detail for admin review
   */
  async getSynopsisById(id) {
    const response = await httpClient.get(`/api/admin/synopsis/${id}`);
    return response.data;
  },

  /**
   * Get all final project submissions (GitHub Repo & Live Demo URLs) via SDK
   */
  async getProjectSubmissions() {
    return await AdminSynopsisManagementService.getAllProjectSubmissions();
  },

  /**
   * Get single hackathon submission detail for admin review
   */
  async getHackathonSubmissionById(id) {
    const response = await httpClient.get(`/api/admin/hackathon-submissions/${id}`);
    return response.data;
  },

  /**
   * Shortlist candidate synopsis via SDK
   */
  async shortlistSynopsis(synopsisId) {
    return await AdminSynopsisManagementService.shortlistSynopsis(synopsisId);
  },

  /**
   * Reject candidate synopsis via SDK
   */
  async rejectSynopsis(synopsisId) {
    return await AdminSynopsisManagementService.rejectSynopsis(synopsisId);
  },

  /**
   * Update synopsis status wrapper
   */
  async updateSynopsisStatus(synopsisId, status) {
    if (status === 'SHORTLISTED') {
      return this.shortlistSynopsis(synopsisId);
    } else {
      return this.rejectSynopsis(synopsisId);
    }
  },

  /**
   * Hackathon Config Endpoints via SDK
   */
  async getConfig() {
    return await AdminHackathonConfigService.getConfig();
  },

  async updateConfig(_id, configData) {
    const toInstant = (val) => {
      if (!val) return null;
      if (val.endsWith('Z') || (val.length > 19 && val.includes('+'))) return val;
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d.toISOString();
    };

    const payload = {
      synopsisStartDate: toInstant(configData.synopsisStartDate),
      synopsisDeadline: toInstant(configData.synopsisDeadline),
      hackathonStartDate: toInstant(configData.hackathonStartDate),
      hackathonEndDate: toInstant(configData.hackathonEndDate),
      durationHours: parseInt(configData.durationHours, 10) || 24,
    };
    return await AdminHackathonConfigService.updateConfig(payload);
  },

  async createConfig(configData) {
    return this.updateConfig(null, configData);
  },

  /**
   * Problem Statement Management Endpoints via SDK
   */
  async getProblemStatements() {
    const response = await AdminProblemStatementService.getProblemStatements();
    return response?.content || response?.items || response || [];
  },

  async createProblemStatement(data) {
    const slug = data.title ? data.title.toUpperCase().replace(/[^A-Z0-9]/g, '-').replace(/-+/g, '-').slice(0, 20) : 'TRACK';
    const generatedId = `PS-${Math.floor(10 + Math.random() * 90)}-${slug}`;
    const reqs = Array.isArray(data.requirements) 
      ? data.requirements 
      : (typeof data.requirements === 'string' ? data.requirements.split('\n').map(s => s.trim()).filter(Boolean) : (data.rules ? [data.rules] : []));
    const delivs = Array.isArray(data.deliverables) 
      ? data.deliverables 
      : (typeof data.deliverables === 'string' ? data.deliverables.split('\n').map(s => s.trim()).filter(Boolean) : []);
    const useCases = Array.isArray(data.useCases)
      ? data.useCases
      : (typeof data.useCases === 'string' ? data.useCases.split('\n').map(s => s.trim()).filter(Boolean) : []);

    const payload = {
      problemId: (data.problemId && data.problemId.trim()) ? data.problemId.trim() : generatedId,
      title: data.title,
      description: data.description,
      active: true,
      requirements: reqs,
      deliverables: delivs,
      useCases: useCases,
    };
    return await AdminProblemStatementService.createProblemStatement(payload);
  },

  async updateProblemStatement(id, data) {
    const slug = data.title ? data.title.toUpperCase().replace(/[^A-Z0-9]/g, '-').replace(/-+/g, '-').slice(0, 20) : 'TRACK';
    const generatedId = `PS-${Math.floor(10 + Math.random() * 90)}-${slug}`;
    const reqs = Array.isArray(data.requirements) 
      ? data.requirements 
      : (typeof data.requirements === 'string' ? data.requirements.split('\n').map(s => s.trim()).filter(Boolean) : (data.rules ? [data.rules] : []));
    const delivs = Array.isArray(data.deliverables) 
      ? data.deliverables 
      : (typeof data.deliverables === 'string' ? data.deliverables.split('\n').map(s => s.trim()).filter(Boolean) : []);
    const useCases = Array.isArray(data.useCases)
      ? data.useCases
      : (typeof data.useCases === 'string' ? data.useCases.split('\n').map(s => s.trim()).filter(Boolean) : []);

    const payload = {
      problemId: (data.problemId && data.problemId.trim()) ? data.problemId.trim() : (data.problem_id || generatedId),
      title: data.title,
      description: data.description,
      active: data.active !== false,
      requirements: reqs,
      deliverables: delivs,
      useCases: useCases,
    };
    return await AdminProblemStatementService.updateProblemStatement(id, payload);
  },

  async deactivateProblemStatement(id) {
    return await AdminProblemStatementService.deactivateProblemStatement(id);
  },

  /**
   * Evaluator Management Endpoints via SDK
   */
  async getEvaluators() {
    const response = await AdminEvaluatorService.getEvaluators();
    return response?.content || response?.items || response || [];
  },

  async addEvaluator(data) {
    return await AdminEvaluatorService.addEvaluator(data);
  },

  async revokeEvaluator(id) {
    return await AdminEvaluatorService.revokeEvaluator(id);
  },

  /**
   * AI Evaluation & Full Review Endpoints for Synopsis
   */
  async getSynopsisAiEvaluation(synopsisId) {
    const response = await httpClient.get(`/api/admin/synopsis/${synopsisId}/ai-evaluation`);
    return response.data;
  },

  async runSynopsisAiEvaluate(synopsisId) {
    const response = await httpClient.post(`/api/admin/synopsis/${synopsisId}/ai-evaluate`);
    return response.data;
  },

  async getSynopsisFullReview(synopsisId) {
    const response = await httpClient.get(`/api/admin/synopsis/${synopsisId}/full-review`);
    return response.data?.evaluations || response.data || [];
  },

  /**
   * AI Evaluation & Full Review Endpoints for Hackathon Submissions
   */
  async getHackathonAiEvaluation(submissionId) {
    const response = await httpClient.get(`/api/admin/hackathon-submissions/${submissionId}/ai-evaluation`);
    return response.data;
  },

  async runHackathonAiEvaluate(submissionId) {
    const response = await httpClient.post(`/api/admin/hackathon-submissions/${submissionId}/ai-evaluate`);
    return response.data;
  },

  async getHackathonFullReview(submissionId) {
    const response = await httpClient.get(`/api/admin/hackathon-submissions/${submissionId}/full-review`);
    return response.data?.evaluations || response.data || [];
  },

  /**
   * Declare single result matching Spring Boot DeclareResultDto via SDK
   */
  async declareResult(resultData) {
    const positionMap = {
      '1st Place': 'FIRST',
      '2nd Place': 'SECOND',
      '3rd Place': 'THIRD',
      'Consolation Winner': 'CONSOLATION',
      FIRST: 'FIRST',
      SECOND: 'SECOND',
      THIRD: 'THIRD',
      CONSOLATION: 'CONSOLATION',
    };

    const payload = {
      submissionId: resultData.submissionId,
      position: positionMap[resultData.position] || 'FIRST',
    };

    return await AdminResultManagementService.declareResult(payload);
  },

  /**
   * Declare multiple results via SDK
   */
  async declareResults(resultsList) {
    const promises = resultsList.map((res) =>
      this.declareResult({
        submissionId: res.submissionId,
        position: res.position,
      })
    );
    await Promise.all(promises);
    return { success: true, message: 'Results declared successfully and published live to public leaderboard!' };
  },

  /**
   * Get all Synopsis AI Evaluation Criteria via SDK
   */
  async getAllSynopsisAiCriteria(hackathonConfigId = 1) {
    try {
      return await SynopsisAiEvaluationCriteriaService.getAllCriteria(hackathonConfigId);
    } catch (err) {
      try {
        return await SynopsisAiEvaluationCriteriaService.getApplicableCriteria(hackathonConfigId);
      } catch {
        throw err;
      }
    }
  },

  /**
   * Create Synopsis AI Evaluation Criteria via SDK
   */
  async createSynopsisAiCriteria(data) {
    return await SynopsisAiEvaluationCriteriaService.createCriteria(data);
  },

  /**
   * Update Synopsis AI Evaluation Criteria via SDK
   */
  async updateSynopsisAiCriteria(id, data) {
    return await SynopsisAiEvaluationCriteriaService.updateCriteria(id, data);
  },

  /**
   * Delete Synopsis AI Evaluation Criteria via SDK
   */
  async deleteSynopsisAiCriteria(id) {
    return await SynopsisAiEvaluationCriteriaService.deleteCriteria(id);
  },

  /**
   * Get public/applicable Synopsis AI Evaluation Criteria via SDK
   */
  async getPublicSynopsisAiCriteria(hackathonConfigId = 1, problemStatementRef = null) {
    return await SynopsisAiEvaluationCriteriaService.getApplicableCriteria(hackathonConfigId, problemStatementRef || undefined);
  },
};

function mapSynopsisList(list) {
  if (!Array.isArray(list)) return [];
  return list.map((item) => ({
    id: item.id,
    fullName: item.candidateName || item.name || 'Candidate',
    email: item.email || item.candidateEmail || 'N/A',
    submissionId: item.submissionId || 'N/A',
    synopsisStatus: item.status || 'PENDING',
    synopsisContent: item.content || null,
    submittedAt: item.submittedAt || null,
    problemStatementRef: item.problemStatementRef,
  }));
}
