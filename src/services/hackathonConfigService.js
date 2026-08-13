import { httpClient } from './httpClient';

const CONFIG_STORAGE_KEY = 'hackathon_global_config';

const DEFAULT_CONFIG = {
  synopsisStartDate: null,
  synopsisDeadline: null,
  hackathonStartDate: null,
  hackathonEndDate: null,
  durationHours: 24,
};

export const hackathonConfigService = {
  async fetchPublicConfig() {
    try {
      const response = await httpClient.get('/api/public/hackathon-config');
      if (response.data) {
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(response.data));
        return response.data;
      }
    } catch (e) {
      console.warn('Failed to fetch public hackathon config from backend:', e?.message);
    }
    return this.getConfig();
  },

  getConfig() {
    try {
      const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading hackathon config from localStorage:', e);
    }
    return DEFAULT_CONFIG;
  },

  updateConfig(newConfig) {
    const current = this.getConfig();
    const updated = {
      ...current,
      ...newConfig,
      durationHours: Number(newConfig.durationHours) || current.durationHours || 24,
    };
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
};
