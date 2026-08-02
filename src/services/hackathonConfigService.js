// Service for managing Global Hackathon Configuration & Admin Deadlines

const CONFIG_STORAGE_KEY = 'hackathon_global_config';

const DEFAULT_CONFIG = {
  synopsisDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  projectSubmissionDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  durationHours: 24,
  hackathonTitle: 'StackHack 2.0 Hackathon',
  autoLockExpired: true,
};

export const hackathonConfigService = {
  getConfig() {
    try {
      const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading hackathon config from localStorage:', e);
    }
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(DEFAULT_CONFIG));
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
