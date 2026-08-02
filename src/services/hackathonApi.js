import { httpClient } from './httpClient';
import { getMockStore, saveMockStore } from './mockData';

export const hackathonApi = {
  /**
   * Get hackathon status and server-synced remaining time
   */
  async getStatus() {
    try {
      const response = await httpClient.get('/hackathon/status');
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

        let timeRemaining = 0;
        if (user.hackathonStarted) {
          const elapsedSeconds = Math.floor((Date.now() - (user.hackathonStartTimestamp || Date.now())) / 1000);
          const totalDuration = user.durationSeconds || (24 * 3600);
          timeRemaining = Math.max(0, totalDuration - elapsedSeconds);
        }

        const isLocked = Boolean(user.projectSubmittedAt || (user.hackathonStarted && timeRemaining <= 0));

        return {
          started: Boolean(user.hackathonStarted),
          timeRemainingSeconds: timeRemaining,
          totalDurationSeconds: user.durationSeconds || (24 * 3600),
          isLocked,
          submitted: Boolean(user.projectSubmittedAt),
          projectSubmission: user.projectSubmittedAt ? {
            githubUrl: user.githubUrl,
            liveAppUrl: user.liveAppUrl,
            submittedAt: user.projectSubmittedAt,
          } : null,
          problemStatement: {
            title: 'Mini Multi-Warehouse Inventory & Logistics Platform',
            description: `Build a mini multi-warehouse inventory platform that manages orders, stocks, transfers, returns, and warehouse outages.

### Core Requirements:
1. **Multi-Warehouse Management**: Create and track stock across 3+ virtual warehouses with realtime threshold alerts.
2. **Order Fulfillment & Stock Transfer**: Fulfill incoming customer orders automatically from nearest warehouse with stock; route internal inventory transfers seamlessly.
3. **Outage Simulation & Failover**: Simulate a sudden warehouse outage (e.g. power/flooding) and re-route affected pending orders automatically.
4. **Analytics & Activity Log**: Dashboard showing overall stock health, high-frequency returns, and audit trails.`,
          },
          evaluationCriteria: [
            { title: 'Functionality & Requirements', weight: '30%', description: 'All core features (warehouses, transfers, outage failover) implemented and working.' },
            { title: 'Code Quality & Architecture', weight: '25%', description: 'Clean code structure, modular component design, type safety, error handling.' },
            { title: 'UI/UX & Responsiveness', weight: '25%', description: 'Visual polish, responsive layout, intuitive navigation, state loaders.' },
            { title: 'Innovation & Edge Cases', weight: '20%', description: 'Smart optimizations, interactive visualizations, robust validation.' },
          ],
        };
      }
      throw err;
    }
  },

  /**
   * Start hackathon timer for candidate
   */
  async startHackathon() {
    try {
      const response = await httpClient.post('/hackathon/start');
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

        user.hackathonStarted = true;
        user.hackathonStartTimestamp = Date.now();
        user.durationSeconds = 24 * 3600; // 24 Hours
        saveMockStore(store);

        return {
          success: true,
          message: 'Hackathon started! Timer has begun.',
          timeRemainingSeconds: 24 * 3600,
        };
      }
      throw err;
    }
  },

  /**
   * Submit Hackathon Project (GitHub + Live URL)
   * @param {Object} data - { githubUrl, liveAppUrl }
   */
  async submitProject(data) {
    try {
      const response = await httpClient.post('/hackathon/submit', data);
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

        user.githubUrl = data.githubUrl;
        user.liveAppUrl = data.liveAppUrl;
        user.projectSubmittedAt = new Date().toISOString();
        saveMockStore(store);

        return {
          success: true,
          message: 'Hackathon project submitted successfully! Submissions are now locked.',
          submittedAt: user.projectSubmittedAt,
        };
      }
      throw err;
    }
  },
};
