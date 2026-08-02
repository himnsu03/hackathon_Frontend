import { httpClient } from './httpClient';

export const synopsisApi = {
  /**
   * Get Synopsis submission status from backend
   */
  async getStatus() {
    try {
      const response = await httpClient.get('/synopsis/status');
      const data = response.data;
      return {
        submitted: Boolean(data && data.content),
        status: data?.status || 'NOT_SUBMITTED',
        synopsisContent: data?.content || null,
        submittedAt: data?.submittedAt || null,
        problemStatementRef: data?.problemStatementRef || 'PS-SMART-CITY-01',
        problemStatement: 'Provide an effective solution for smart waste management, traffic optimization, or city logistics.',
      };
    } catch (err) {
      // 404 status from backend indicates no synopsis submitted yet
      if (err.response && err.response.status === 404) {
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
   * Submit Synopsis to backend
   * @param {Object} data - { content, problemStatementRef }
   */
  async submitSynopsis(data) {
    const payload = {
      problemStatementRef: data.problemStatementRef || 'PS-SMART-CITY-01',
      content: typeof data === 'string' ? data : data.content,
    };
    const response = await httpClient.post('/synopsis/submit', payload);
    return response.data;
  },
};
