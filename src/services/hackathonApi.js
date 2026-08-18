import { HackathonCoreService } from '../sdk';
import { httpClient } from './httpClient';

export const hackathonApi = {
  /**
   * Get hackathon status via SDK
   */
  async getStatus() {
    return await HackathonCoreService.getStatus();
  },

  /**
   * Get Problem Statement details via SDK
   */
  async getProblemStatement() {
    try {
      return await HackathonCoreService.getProblemStatement();
    } catch {
      return null;
    }
  },

  /**
   * Start hackathon timer for candidate via SDK
   */
  async startHackathon() {
    return await HackathonCoreService.startHackathon();
  },

  /**
   * Submit Hackathon Project to backend via SDK
   * @param {Object} data - { githubRepoUrl, liveAppUrl }
   */
  async submitProject(data) {
    const payload = {
      githubRepoUrl: data.githubRepoUrl || data.githubUrl,
      liveAppUrl: data.liveAppUrl || '',
    };
    return await HackathonCoreService.submitHackathon(payload);
  },

  /**
   * Get public Hackathon AI Evaluation Criteria
   */
  async getPublicHackathonAiCriteria(hackathonConfigId = 1) {
    try {
      const res = await httpClient.get('/api/public/hackathon-ai-criteria', {
        params: { hackathonConfigId },
      });
      return res.data;
    } catch {
      return [];
    }
  },

  /**
   * Get public Synopsis AI Evaluation Criteria
   */
  async getPublicSynopsisAiCriteria(hackathonConfigId = 1, problemId = null) {
    try {
      const res = await httpClient.get('/api/public/synopsis-ai-criteria', {
        params: { hackathonConfigId, problemId },
      });
      return res.data;
    } catch {
      return [];
    }
  },
};
