import { EvaluatorService } from '../sdk';
import { httpClient } from './httpClient';

export const evaluatorApi = {
  /**
   * Get public hackathon config
   */
  async getPublicConfig() {
    const response = await httpClient.get('/api/public/hackathon-config');
    return response.data || {};
  },

  /**
   * GET /api/evaluator/synopsis
   */
  async getSynopses(status, problemStatementRef) {
    const params = { page: 0, size: 100 };
    if (status && status !== 'ALL') {
      params.status = status === 'PENDING_REVIEW' ? 'PENDING' : status;
    }
    if (problemStatementRef && problemStatementRef !== 'ALL') {
      params.problemStatementRef = problemStatementRef;
    }
    const response = await httpClient.get('/api/evaluator/synopsis', { params });
    const data = response.data;
    return data?.content || data?.items || data || [];
  },

  /**
   * GET /api/evaluator/synopsis/:id
   */
  async getSynopsisById(id) {
    const response = await httpClient.get(`/api/evaluator/synopsis/${id}`);
    return response.data;
  },

  /**
   * GET /api/evaluator/synopsis/:id/evaluations
   */
  async getMySynopsisEvaluation(id) {
    try {
      const response = await httpClient.get(`/api/evaluator/synopsis/${id}/evaluations`);
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * POST /api/evaluator/synopsis/:id/evaluate via SDK
   */
  async evaluateSynopsis(id, evaluationData) {
    return await EvaluatorService.evaluateSynopsis(id, evaluationData);
  },

  /**
   * GET /api/evaluator/hackathon-submissions
   */
  async getHackathonSubmissions(status) {
    const params = { page: 0, size: 100 };
    if (status && status !== 'ALL') {
      params.status = status;
    }
    const response = await httpClient.get('/api/evaluator/hackathon-submissions', { params });
    const data = response.data;
    const content = data?.content || data?.items || data || [];
    if (status && status !== 'ALL') {
      return content.filter((item) => item.status === status);
    }
    return content;
  },

  /**
   * GET /api/evaluator/hackathon-submissions/:id
   */
  async getHackathonSubmissionById(id) {
    const response = await httpClient.get(`/api/evaluator/hackathon-submissions/${id}`);
    return response.data;
  },

  /**
   * GET /api/evaluator/hackathon-submissions/:id/evaluations
   */
  async getMyHackathonEvaluation(id) {
    try {
      const response = await httpClient.get(`/api/evaluator/hackathon-submissions/${id}/evaluations`);
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * POST /api/evaluator/hackathon-submissions/:id/evaluate via SDK
   */
  async evaluateHackathonSubmission(id, evaluationData) {
    return await EvaluatorService.evaluateHackathonSubmission(id, evaluationData);
  },

  /**
   * POST /api/evaluator/hackathon-submissions/:id/shortlist
   */
  async shortlistHackathonSubmission(id) {
    const response = await httpClient.post(`/api/evaluator/hackathon-submissions/${id}/shortlist`);
    return response.data;
  },

  /**
   * POST /api/evaluator/hackathon-submissions/:id/reject
   */
  async rejectHackathonSubmission(id) {
    const response = await httpClient.post(`/api/evaluator/hackathon-submissions/${id}/reject`);
    return response.data;
  },

  /**
   * POST /api/evaluator/synopsis/:id/shortlist
   */
  async shortlistSynopsis(id) {
    const response = await httpClient.post(`/api/evaluator/synopsis/${id}/shortlist`);
    return response.data;
  },

  /**
   * POST /api/evaluator/synopsis/:id/reject
   */
  async rejectSynopsis(id) {
    const response = await httpClient.post(`/api/evaluator/synopsis/${id}/reject`);
    return response.data;
  },

  // ─── F2F Interview Evaluation Endpoints ───────────────────────────────

  /**
   * POST /api/evaluator/interview-evaluations/:submissionId
   */
  async evaluateInterviewSubmission(submissionId, evaluationData) {
    const response = await httpClient.post(`/api/evaluator/interview-evaluations/${submissionId}`, evaluationData);
    return response.data;
  },

  /**
   * GET /api/evaluator/interview-evaluations/:submissionId/my
   */
  async getMyInterviewEvaluation(submissionId) {
    try {
      const response = await httpClient.get(`/api/evaluator/interview-evaluations/${submissionId}/my`);
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * GET /api/evaluator/interview-evaluations/:submissionId
   */
  async getInterviewEvaluationsForSubmission(submissionId) {
    const response = await httpClient.get(`/api/evaluator/interview-evaluations/${submissionId}`);
    return response.data || [];
  },

  /**
   * GET /api/evaluator/candidates/:userId/resume
   */
  async getCandidateResume(userId) {
    try {
      const response = await httpClient.get(`/api/evaluator/candidates/${userId}/resume`);
      return response.data;
    } catch {
      return null;
    }
  },
};
