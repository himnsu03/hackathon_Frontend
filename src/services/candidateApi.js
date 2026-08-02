import { httpClient } from './httpClient';

export const candidateApi = {
  /**
   * Get Candidate Dashboard details from backend and calculate real-time dynamic timeline
   */
  async getDashboard() {
    const [dashboardRes, hackathonStatusRes, resultsRes] = await Promise.allSettled([
      httpClient.get('/candidate/dashboard'),
      httpClient.get('/hackathon/status'),
      httpClient.get('/results'),
    ]);

    const data = dashboardRes.status === 'fulfilled' ? dashboardRes.value.data : {};
    const hackathonData = hackathonStatusRes.status === 'fulfilled' ? hackathonStatusRes.value.data : {};
    const resultsList = resultsRes.status === 'fulfilled' ? (Array.isArray(resultsRes.value.data) ? resultsRes.value.data : resultsRes.value.data?.results || []) : [];

    const userObj = data.user || {};
    const synopsisObj = data.synopsis || {};
    const synopsisStatus = synopsisObj.status || data.hackathonStatus || 'NOT_SUBMITTED';

    const isSynopsisSubmitted = Boolean(synopsisObj.submittedAt) || synopsisStatus !== 'NOT_SUBMITTED';
    const isShortlisted = synopsisStatus === 'SHORTLISTED';
    const isHackathonStarted = hackathonData?.status === 'IN_PROGRESS' || hackathonData?.status === 'SUBMITTED' || Boolean(hackathonData?.assignmentStartTime);
    const isProjectSubmitted = hackathonData?.status === 'SUBMITTED';
    const isResultsDeclared = resultsList.length > 0;

    // Real-Time Dynamic Timeline Steps
    const keyDates = [
      {
        label: 'Candidate Registration & Account Setup',
        date: 'Account Verified & Active',
        status: 'completed',
      },
      {
        label: 'Synopsis Proposal Submission',
        date: synopsisObj.submittedAt
          ? `Submitted: ${new Date(synopsisObj.submittedAt).toLocaleString()}`
          : isSynopsisSubmitted
          ? 'Submitted'
          : 'Proposal Pending Submission',
        status: isSynopsisSubmitted ? 'completed' : 'active',
      },
      {
        label: 'Synopsis Proposal Review & Shortlist',
        date: isShortlisted
          ? 'Shortlisted — Qualified for Hackathon'
          : synopsisStatus === 'REJECTED'
          ? 'Proposal Rejected'
          : isSynopsisSubmitted
          ? 'Under Review by Organizers'
          : 'Awaiting Synopsis Submission',
        status: isShortlisted ? 'completed' : isSynopsisSubmitted ? 'active' : 'upcoming',
      },
      {
        label: '24-Hour Hackathon Coding Window',
        date: hackathonData?.assignmentStartTime
          ? `Started: ${new Date(hackathonData.assignmentStartTime).toLocaleString()}`
          : isShortlisted
          ? 'Ready to Start 24-Hour Timer'
          : 'Locked — Requires Shortlisted Synopsis',
        status: isProjectSubmitted ? 'completed' : isHackathonStarted ? 'active' : isShortlisted ? 'active' : 'upcoming',
      },
      {
        label: 'Official Leaderboard & Results Declaration',
        date: isResultsDeclared
          ? `Results Published Live (${resultsList.length} Winners)`
          : 'Pending Final Project Evaluation',
        status: isResultsDeclared ? 'completed' : 'upcoming',
      },
    ];

    return {
      user: {
        fullName: userObj.name || userObj.fullName,
        email: userObj.email,
        submissionId: userObj.submissionId || 'SUB-2026-9842',
        synopsisStatus,
        synopsisSubmittedAt: synopsisObj.submittedAt || null,
      },
      synopsisStatus,
      eligibleToStart: Boolean(data.eligibleToStart),
      teaserProblemStatement: 'Provide an effective solution for smart waste management, traffic optimization, AI pair programming, or city logistics.',
      keyDates,
      rules: [
        { title: 'Plagiarism & Originality', content: 'All code must be built during the hackathon window. Open-source libraries are permitted with proper attribution.' },
        { title: 'Submission Guidelines', content: 'Submissions must include a public GitHub repository link with clear documentation and live deployment URL.' },
        { title: 'Evaluation Protocol', content: 'Judging panel reviews functionality, code architecture, UI polish, and innovation.' },
      ],
    };
  },
};
