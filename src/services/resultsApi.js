import { httpClient } from './httpClient';
import { getMockStore } from './mockData';

export const resultsApi = {
  /**
   * Get public leaderboard results
   */
  async getPublicResults() {
    try {
      const response = await httpClient.get('/results');
      return response.data;
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || (err.response && err.response.status === 404)) {
        // Mock fallback
        const store = getMockStore();
        return {
          declared: store.resultsDeclared ?? true,
          results: store.results || [],
        };
      }
      throw err;
    }
  },
};
