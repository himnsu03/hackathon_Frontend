import { httpClient } from './httpClient';
import { getMockStore, saveMockStore } from './mockData';

export const adminApi = {
  /**
   * Get all candidate synopsis submissions
   * @param {string} filterStatus - ALL | PENDING | SHORTLISTED | REJECTED | NOT_SUBMITTED
   */
  async getAllSynopses(filterStatus = 'ALL') {
    try {
      const response = await httpClient.get('/admin/synopsis', { params: { status: filterStatus } });
      return response.data;
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || (err.response && err.response.status === 404)) {
        // Mock fallback
        const store = getMockStore();
        let list = store.users.map(u => ({
          id: u.id,
          fullName: u.fullName,
          email: u.email,
          submissionId: u.submissionId || 'SUB-2026-9900',
          synopsisStatus: u.synopsisStatus || 'NOT_SUBMITTED',
          synopsisContent: u.synopsisContent || null,
          submittedAt: u.synopsisSubmittedAt || null,
          college: u.college,
        }));

        if (filterStatus && filterStatus !== 'ALL') {
          list = list.filter(item => item.synopsisStatus === filterStatus);
        }

        return { synopses: list };
      }
      throw err;
    }
  },

  /**
   * Update synopsis status (Shortlist or Reject)
   * @param {string} candidateId
   * @param {string} status - SHORTLISTED | REJECTED
   */
  async updateSynopsisStatus(candidateId, status) {
    try {
      const response = await httpClient.patch(`/admin/synopsis/${candidateId}`, { status });
      return response.data;
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || (err.response && err.response.status === 404)) {
        // Mock fallback
        const store = getMockStore();
        const user = store.users.find(u => u.id === candidateId);
        if (user) {
          user.synopsisStatus = status;
          saveMockStore(store);
          return { success: true, message: `Synopsis status updated to ${status}` };
        }
        throw { response: { data: { message: 'Candidate not found.' } } };
      }
      throw err;
    }
  },

  /**
   * Declare hackathon results
   * @param {Array} resultsList - Array of { candidateId, position, projectTitle }
   */
  async declareResults(resultsList) {
    try {
      const response = await httpClient.post('/admin/results', { results: resultsList });
      return response.data;
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || (err.response && err.response.status === 404)) {
        // Mock fallback
        const store = getMockStore();
        store.results = resultsList.map((res, index) => {
          const user = store.users.find(u => u.id === res.candidateId) || store.users[0];
          return {
            id: `res_${Date.now()}_${index}`,
            position: res.position,
            trophy: res.position.includes('1st') ? 'gold' : res.position.includes('2nd') ? 'silver' : res.position.includes('3rd') ? 'bronze' : 'consolation',
            name: user ? user.fullName : res.name || 'Team Hacker',
            submissionId: user ? user.submissionId : 'SUB-2026-XXXX',
            projectTitle: res.projectTitle || 'Innovative Solution',
          };
        });
        store.resultsDeclared = true;
        saveMockStore(store);

        return { success: true, message: 'Results declared successfully and published live!' };
      }
      throw err;
    }
  },
};
