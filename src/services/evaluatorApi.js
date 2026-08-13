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
   * GET /api/evaluator/synopsis via SDK
   */
  async getSynopses() {
    const response = await EvaluatorService.getSynopsesToEvaluate();
    return response?.content || response?.items || response || [];
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
   * GET /api/evaluator/hackathon-submissions via SDK
   */
  async getHackathonSubmissions(status) {
    const response = await EvaluatorService.getHackathonSubmissionsToEvaluate();
    const content = response?.content || response?.items || response || [];
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
};
