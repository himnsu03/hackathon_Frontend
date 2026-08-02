import { httpClient } from './httpClient';
import { getMockStore, saveMockStore } from './mockData';

export const synopsisApi = {
  /**
   * Get Synopsis submission status
   */
  async getStatus() {
    try {
      const response = await httpClient.get('/synopsis/status');
      return response.data;
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || (err.response && err.response.status === 404)) {
        // Mock fallback
        const store = getMockStore();
        const token = localStorage.getItem('auth_token');
        let user = store.users[0];

        if (token) {
          const match = token.match(/jwt_mock_token_([^_]+)_/);
          if (match) {
            const found = store.users.find(u => u.id === match[1]);
            if (found) user = found;
          }
        }

        return {
          submitted: user.synopsisStatus !== 'NOT_SUBMITTED',
          status: user.synopsisStatus,
          synopsisContent: user.synopsisContent || null,
          submittedAt: user.synopsisSubmittedAt || null,
          deadline: '2026-08-12T18:00:00Z',
          problemStatement: 'Provide an effective solution for smart traffic management or parking lot space optimization using computer vision or real-time IoT sensors.',
        };
      }
      throw err;
    }
  },

  /**
   * Submit Synopsis
   * @param {Object} data - { content }
   */
  async submitSynopsis(data) {
    try {
      const response = await httpClient.post('/synopsis/submit', data);
      return response.data;
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || (err.response && err.response.status === 404)) {
        // Mock fallback
        const store = getMockStore();
        const token = localStorage.getItem('auth_token');
        let user = store.users[0];

        if (token) {
          const match = token.match(/jwt_mock_token_([^_]+)_/);
          if (match) {
            const found = store.users.find(u => u.id === match[1]);
            if (found) user = found;
          }
        }

        if (user.synopsisStatus !== 'NOT_SUBMITTED') {
          throw { response: { data: { message: 'Synopsis has already been submitted for this account.' } } };
        }

        user.synopsisStatus = 'PENDING';
        user.synopsisContent = data.content;
        user.synopsisSubmittedAt = new Date().toISOString();
        saveMockStore(store);

        return {
          success: true,
          message: 'Synopsis submitted successfully! Your application is now under review.',
          submittedAt: user.synopsisSubmittedAt,
          status: 'PENDING',
        };
      }
      throw err;
    }
  },
};
