import { CandidateSynopsisService } from '../sdk';

export const synopsisApi = {
  /**
   * Get Synopsis submission status from backend via SDK
   */
  async getStatus() {
    try {
      const data = await CandidateSynopsisService.getSynopsisStatus();
      return {
        submitted: Boolean(data && data.content),
        status: data?.status || 'NOT_SUBMITTED',
        synopsisContent: data?.content || null,
        submittedAt: data?.submittedAt || null,
        problemStatementRef: data?.problemStatementRef || 'PS-SMART-CITY-01',
        problemStatement: 'Provide an effective solution for smart waste management, traffic optimization, or city logistics.',
      };
    } catch (err) {
      if (err.status === 404 || (err.response && err.response.status === 404)) {
        return {
          submitted: false,
          status: 'NOT_SUBMITTED',
          synopsisContent: null,
          submittedAt: null,
          problemStatementRef: 'PS-SMART-CITY-01',
          problemStatement: 'Provide an effective solution for smart waste management, traffic optimization, or city logistics.',
        };
      }
      throw err;
    }
  },

  /**
   * Submit Synopsis to backend via SDK
   * @param {Object} data - { content, problemStatementRef }
   */
  async submitSynopsis(data) {
    const payload = {
      problemStatementRef: data.problemStatementRef || 'PS-SMART-CITY-01',
      content: typeof data === 'string' ? data : data.content,
    };
    return await CandidateSynopsisService.submitSynopsis(payload);
  },
};
