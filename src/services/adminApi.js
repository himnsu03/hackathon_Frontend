import { httpClient } from './httpClient';

export const adminApi = {
  /**
   * Get candidate synopsis submissions from backend
   * @param {string} filterStatus - PENDING | SHORTLISTED | REJECTED | ALL
   */
  async getAllSynopses(filterStatus = 'PENDING') {
    if (filterStatus === 'ALL') {
      try {
        const [pendingRes, shortlistedRes, rejectedRes] = await Promise.allSettled([
          httpClient.get('/admin/synopsis', { params: { status: 'PENDING', size: 100 } }),
          httpClient.get('/admin/synopsis', { params: { status: 'SHORTLISTED', size: 100 } }),
          httpClient.get('/admin/synopsis', { params: { status: 'REJECTED', size: 100 } }),
        ]);

        const combined = [];
        if (pendingRes.status === 'fulfilled') combined.push(...(pendingRes.value.data?.content || []));
        if (shortlistedRes.status === 'fulfilled') combined.push(...(shortlistedRes.value.data?.content || []));
        if (rejectedRes.status === 'fulfilled') combined.push(...(rejectedRes.value.data?.content || []));

        return { synopses: mapSynopsisList(combined) };
      } catch {
        const res = await httpClient.get('/admin/synopsis', { params: { status: 'PENDING', size: 100 } });
        return { synopses: mapSynopsisList(res.data?.content || []) };
      }
    }

    const validStatus = ['PENDING', 'SHORTLISTED', 'REJECTED'].includes(filterStatus) ? filterStatus : 'PENDING';
    const response = await httpClient.get('/admin/synopsis', { params: { status: validStatus, size: 100 } });
    const content = response.data?.content || response.data?.items || response.data || [];
    return { synopses: mapSynopsisList(content) };
  },

  /**
   * Get single synopsis detail for admin review
   */
  async getSynopsisById(id) {
    const response = await httpClient.get(`/admin/synopsis/${id}`);
    return response.data;
  },

  /**
   * Get all final project submissions (GitHub Repo & Live Demo URLs)
   */
  async getProjectSubmissions() {
    const response = await httpClient.get('/admin/synopsis/projects');
    return response.data || [];
  },

  /**
   * Get single hackathon submission detail for admin review
   */
  async getHackathonSubmissionById(id) {
    const response = await httpClient.get(`/admin/hackathon-submissions/${id}`);
    return response.data;
  },

  /**
   * Shortlist candidate synopsis
   */
  async shortlistSynopsis(synopsisId) {
    const response = await httpClient.post(`/admin/synopsis/${synopsisId}/shortlist`);
    return response.data;
  },

  /**
   * Reject candidate synopsis
   */
  async rejectSynopsis(synopsisId) {
    const response = await httpClient.post(`/admin/synopsis/${synopsisId}/reject`);
    return response.data;
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
   * Hackathon Config Endpoints
   * Backend: PUT /admin/hackathon-config
   */
  async getConfig() {
    const response = await httpClient.get('/admin/hackathon-config');
    return response.data;
  },

  async updateConfig(_id, configData) {
    // Backend expects java.time.Instant → full ISO-8601 with seconds and Z offset.
    // datetime-local inputs produce "2026-08-11T11:58" which must become "2026-08-11T11:58:00Z".
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
    const response = await httpClient.put('/admin/hackathon-config', payload);
    return response.data;
  },

  // createConfig aliases updateConfig (backend has single PUT, no POST create)
  async createConfig(configData) {
    return this.updateConfig(null, configData);
  },

  /**
   * Problem Statement Management Endpoints
   */
  async getProblemStatements() {
    const response = await httpClient.get('/admin/problem-statements');
    return response.data?.content || response.data?.items || response.data || [];
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
    const response = await httpClient.post('/admin/problem-statements', payload);
    return response.data;
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
    const response = await httpClient.put(`/admin/problem-statements/${id}`, payload);
    return response.data;
  },

  async deactivateProblemStatement(id) {
    const response = await httpClient.delete(`/admin/problem-statements/${id}`);
    return response.data;
  },

  /**
   * Evaluator Management Endpoints
   */
  async getEvaluators() {
    const response = await httpClient.get('/admin/evaluators');
    return response.data?.content || response.data?.items || response.data || [];
  },

  async addEvaluator(data) {
    const response = await httpClient.post('/admin/evaluators', data);
    return response.data;
  },

  async revokeEvaluator(id) {
    const response = await httpClient.delete(`/admin/evaluators/${id}`);
    return response.data;
  },

  /**
   * AI Evaluation & Full Review Endpoints for Synopsis
   */
  async getSynopsisAiEvaluation(synopsisId) {
    const response = await httpClient.get(`/admin/synopsis/${synopsisId}/ai-evaluation`);
    return response.data;
  },

  async runSynopsisAiEvaluate(synopsisId) {
    const response = await httpClient.post(`/admin/synopsis/${synopsisId}/ai-evaluate`);
    return response.data;
  },

  async getSynopsisFullReview(synopsisId) {
    const response = await httpClient.get(`/admin/synopsis/${synopsisId}/full-review`);
    return response.data?.evaluations || response.data || [];
  },

  /**
   * AI Evaluation & Full Review Endpoints for Hackathon Submissions
   */
  async getHackathonAiEvaluation(submissionId) {
    const response = await httpClient.get(`/admin/hackathon-submissions/${submissionId}/ai-evaluation`);
    return response.data;
  },

  async runHackathonAiEvaluate(submissionId) {
    const response = await httpClient.post(`/admin/hackathon-submissions/${submissionId}/ai-evaluate`);
    return response.data;
  },

  async getHackathonFullReview(submissionId) {
    const response = await httpClient.get(`/admin/hackathon-submissions/${submissionId}/full-review`);
    return response.data?.evaluations || response.data || [];
  },

  /**
   * Declare single result matching Spring Boot DeclareResultDto
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

    const response = await httpClient.post('/admin/results/declare', payload);
    return response.data;
  },

  /**
   * Declare multiple results
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
