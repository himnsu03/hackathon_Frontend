import { httpClient } from './httpClient';
import { getMockStore } from './mockData';

export const candidateApi = {
  /**
   * Get Candidate Dashboard details
   */
  async getDashboard() {
    try {
      const response = await httpClient.get('/candidate/dashboard');
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

        return {
          user: {
            fullName: user.fullName,
            email: user.email,
            submissionId: user.submissionId || 'SUB-2026-9842',
            synopsisStatus: user.synopsisStatus || 'NOT_SUBMITTED',
            synopsisSubmittedAt: user.synopsisSubmittedAt || null,
          },
          teaserProblemStatement: 'Provide an effective solution for smart traffic management or parking lot space optimization using computer vision or IoT telemetry.',
          submissionDeadline: '2026-08-12T18:00:00Z',
          keyDates: [
            { label: 'Registration Close', date: '2026-08-10 23:59 IST', status: 'completed' },
            { label: 'Synopsis Deadline', date: '2026-08-12 18:00 IST', status: 'active' },
            { label: 'Hackathon Start', date: '2026-08-15 10:00 IST', status: 'upcoming' },
            { label: 'Submissions Lock', date: '2026-08-16 10:00 IST', status: 'upcoming' },
            { label: 'Results Date', date: '2026-08-18 16:00 IST', status: 'upcoming' },
          ],
          rules: [
            { title: 'Plagiarism & Originality', content: 'All code must be built during the hackathon window. Open-source libraries are permitted with proper attribution.' },
            { title: 'Submission Guidelines', content: 'Submissions must include a public GitHub repository link with clear documentation and deployment URL.' },
            { title: 'Evaluation Protocol', content: 'Judging panel reviews functionality, code architecture, UI polish, and innovation.' },
          ],
        };
      }
      throw err;
    }
  },
};
