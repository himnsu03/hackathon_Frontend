import { httpClient } from './httpClient';

export const evaluatorApi = {
  /**
   * Get public hackathon config
   */
  async getPublicConfig() {
    const response = await httpClient.get('/public/hackathon-config');
    return response.data || {};
  },

  /**
   * GET /api/evaluator/synopsis
   */
  async getSynopses() {
    const response = await httpClient.get('/evaluator/synopsis');
    return response.data?.content || response.data?.items || response.data || [];
  },

  /**
   * GET /api/evaluator/synopsis/:id
   */
  async getSynopsisById(id) {
    const response = await httpClient.get(`/evaluator/synopsis/${id}`);
    return response.data;
  },

  /**
   * GET /api/evaluator/synopsis/:id/evaluations
   */
  async getMySynopsisEvaluation(id) {
    try {
      const response = await httpClient.get(`/evaluator/synopsis/${id}/evaluations`);
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * POST /api/evaluator/synopsis/:id/evaluate
   */
  async evaluateSynopsis(id, evaluationData) {
    const response = await httpClient.post(`/evaluator/synopsis/${id}/evaluate`, evaluationData);
    return response.data;
  },

  /**
   * GET /api/evaluator/hackathon-submissions
   */
  async getHackathonSubmissions() {
    const response = await httpClient.get('/evaluator/hackathon-submissions');
    return response.data?.content || response.data?.items || response.data || [];
  },

  /**
   * GET /api/evaluator/hackathon-submissions/:id
   */
  async getHackathonSubmissionById(id) {
    const response = await httpClient.get(`/evaluator/hackathon-submissions/${id}`);
    return response.data;
  },

  /**
   * GET /api/evaluator/hackathon-submissions/:id/evaluations
   */
  async getMyHackathonEvaluation(id) {
    try {
      const response = await httpClient.get(`/evaluator/hackathon-submissions/${id}/evaluations`);
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * POST /api/evaluator/hackathon-submissions/:id/evaluate
   */
  async evaluateHackathonSubmission(id, evaluationData) {
    const response = await httpClient.post(`/evaluator/hackathon-submissions/${id}/evaluate`, evaluationData);
    return response.data;
  },
};
