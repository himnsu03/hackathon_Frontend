import { httpClient } from './httpClient';

export const hackathonApi = {
  /**
   * Get hackathon status and server-synced remaining time from backend
   */
  async getStatus() {
    const response = await httpClient.get('/hackathon/status');
    return response.data;
  },

  /**
   * Get Problem Statement details from backend
   */
  async getProblemStatement() {
    try {
      const response = await httpClient.get('/hackathon/problem-statement');
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * Start hackathon timer for candidate
   */
  async startHackathon() {
    const response = await httpClient.post('/hackathon/start');
    return response.data;
  },

  /**
   * Submit Hackathon Project (GitHub + Live URL) to backend
   * @param {Object} data - { githubRepoUrl, liveAppUrl }
   */
  async submitProject(data) {
    const payload = {
      githubRepoUrl: data.githubRepoUrl || data.githubUrl,
      liveAppUrl: data.liveAppUrl || '',
    };
    const response = await httpClient.post('/hackathon/submit', payload);
    return response.data;
  },
};
