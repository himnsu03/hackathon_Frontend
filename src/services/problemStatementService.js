// Service for managing Hackathon Problem Statements

const STORAGE_KEY = 'hackathon_problem_statements';

const DEFAULT_PROBLEM_STATEMENTS = [
  {
    id: 'PS-SMART-CITY-01',
    title: 'Smart Waste Management System',
    category: 'IoT & Smart Cities',
    description: 'Urban areas face major challenges in garbage collection due to fixed schedules instead of bin capacity. Design a solution with IoT sensor monitoring and AI-powered route optimization for collection vehicles.',
    createdDate: '2026-08-01',
  },
  {
    id: 'PS-TRAFFIC-02',
    title: 'Urban Traffic & Signal Optimization',
    category: 'AI / Computer Vision',
    description: 'Build a dynamic traffic management system that uses real-time camera feeds to dynamically adjust traffic light timers and reduce congestion at busy intersections.',
    createdDate: '2026-08-01',
  },
  {
    id: 'PS-ENERGY-03',
    title: 'Renewable Microgrid Load Balancer',
    category: 'CleanTech & Energy',
    description: 'Develop an intelligent grid load forecasting algorithm that balances solar and wind power storage with local residential energy demand spikes.',
    createdDate: '2026-08-01',
  },
];

export const problemStatementService = {
  getStatements() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading problem statements from localStorage:', e);
    }
    // Initialize default set if not present
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROBLEM_STATEMENTS));
    return DEFAULT_PROBLEM_STATEMENTS;
  },

  addStatement(newStatement) {
    const current = this.getStatements();
    const formatted = {
      id: newStatement.id || `PS-${Date.now().toString().slice(-4)}`,
      title: newStatement.title.trim(),
      category: newStatement.category?.trim() || 'General Tech',
      description: newStatement.description.trim(),
      createdDate: new Date().toISOString().split('T')[0],
    };
    const updated = [formatted, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return formatted;
  },

  deleteStatement(id) {
    const current = this.getStatements();
    const updated = current.filter((ps) => ps.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
};
