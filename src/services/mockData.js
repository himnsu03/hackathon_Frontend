// Mock Data Store for fallback when backend API server is offline

export const getMockStore = () => {
  const store = localStorage.getItem('hackathon_mock_store');
  if (store) {
    try {
      return JSON.parse(store);
    } catch {
      // Fallback if corrupt
    }
  }

  const defaultStore = {
    users: [
      {
        id: 'usr_001',
        fullName: 'Alex Vance',
        email: 'alex@example.com',
        phone: '9876543210',
        techStack: ['React', 'Node.js', 'Python', 'TailwindCSS'],
        gradYear: '2026',
        college: 'Stanford University',
        experience: '1-3 yrs',
        submissionId: 'SUB-2026-9842',
        verified: true,
        role: 'candidate',
        synopsisStatus: 'SHORTLISTED', // NOT_SUBMITTED, PENDING, SHORTLISTED, REJECTED
        synopsisContent: 'We propose an AI-powered dynamic traffic signal controller that optimizes green light intervals based on real-time computer vision camera feeds.',
        synopsisSubmittedAt: '2026-08-01T14:30:00Z',
        hackathonStarted: true,
        hackathonStartTimestamp: Date.now() - 3600 * 1000 * 2, // Started 2 hrs ago
        durationSeconds: 24 * 3600, // 24 hours
        githubUrl: 'https://github.com/alexvance/smart-traffic-ai',
        liveAppUrl: 'https://smart-traffic-demo.vercel.app',
        projectSubmittedAt: null,
      },
      {
        id: 'usr_002',
        fullName: 'Sarah Chen',
        email: 'sarah@example.com',
        phone: '9123456789',
        techStack: ['Java', 'Spring Boot', 'React'],
        gradYear: '2025',
        college: 'MIT',
        experience: '0-1 yrs',
        submissionId: 'SUB-2026-1049',
        verified: true,
        role: 'candidate',
        synopsisStatus: 'PENDING',
        synopsisContent: 'Warehouse inventory routing system with multi-agent optimization for automated returns and stock transfers.',
        synopsisSubmittedAt: '2026-08-02T09:15:00Z',
        hackathonStarted: false,
      },
    ],
    results: [
      { id: 'res_1', position: '1st Place', trophy: 'gold', name: 'DevDynamo Team', submissionId: 'SUB-2026-9842', projectTitle: 'Smart Traffic AI Vision' },
      { id: 'res_2', position: '2nd Place', trophy: 'silver', name: 'CyberPulse', submissionId: 'SUB-2026-4421', projectTitle: 'OmniWarehouse Engine' },
      { id: 'res_3', position: '3rd Place', trophy: 'bronze', name: 'Neural Forge', submissionId: 'SUB-2026-8812', projectTitle: 'EcoRoute Logistics' },
      { id: 'res_4', position: 'Consolation Winner', trophy: 'consolation', name: 'CodeCrafters', submissionId: 'SUB-2026-3391', projectTitle: 'UrbanFlow' },
    ],
    resultsDeclared: true,
    otps: {}, // email -> code
  };

  localStorage.setItem('hackathon_mock_store', JSON.stringify(defaultStore));
  return defaultStore;
};

export const saveMockStore = (store) => {
  localStorage.setItem('hackathon_mock_store', JSON.stringify(store));
};
