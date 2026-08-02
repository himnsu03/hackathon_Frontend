import { httpClient } from './httpClient';

export const resultsApi = {
  /**
   * Get public leaderboard results from backend
   */
  async getPublicResults() {
    try {
      const response = await httpClient.get('/results');
      const list = Array.isArray(response.data) ? response.data : response.data?.results || [];

      const positionTextMap = {
        FIRST: '1st Place',
        SECOND: '2nd Place',
        THIRD: '3rd Place',
        CONSOLATION: 'Consolation Winner',
      };

      const mapped = list.map((item) => {
        const posKey = item.position || 'FIRST';
        const positionLabel = positionTextMap[posKey] || posKey;
        return {
          name: item.name || item.candidateName || 'Candidate Winner',
          submissionId: item.submissionId || 'N/A',
          position: positionLabel,
          trophy:
            posKey === 'FIRST' || positionLabel.includes('1st')
              ? 'gold'
              : posKey === 'SECOND' || positionLabel.includes('2nd')
              ? 'silver'
              : posKey === 'THIRD' || positionLabel.includes('3rd')
              ? 'bronze'
              : 'consolation',
          projectTitle: item.projectTitle || null,
          declaredAt: item.declaredAt,
        };
      });

      return {
        declared: mapped.length > 0,
        results: mapped,
      };
    } catch (e) {
      console.error('Error fetching public results from backend:', e);
      return { declared: false, results: [] };
    }
  },
};
