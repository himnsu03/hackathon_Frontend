import { CandidateDashboardService, HackathonCoreService, PublicResultsService } from '../sdk';
import { httpClient } from './httpClient';

export const candidateApi = {
  /**
   * Get Candidate Dashboard details from backend via SDK services
   */
  async getDashboard() {
    const [dashboardRes, hackathonStatusRes, resultsRes, resumeRes] = await Promise.allSettled([
      CandidateDashboardService.getDashboard(),
      HackathonCoreService.getHackathonStatus(),
      PublicResultsService.getResults(),
      httpClient.get('/api/candidate/resume'),
    ]);

    const data = dashboardRes.status === 'fulfilled' ? dashboardRes.value : {};
    const hackathonData = hackathonStatusRes.status === 'fulfilled' ? hackathonStatusRes.value : {};
    const resultsList = resultsRes.status === 'fulfilled' ? (Array.isArray(resultsRes.value) ? resultsRes.value : resultsRes.value?.results || []) : [];
    const resumeData = resumeRes.status === 'fulfilled' ? (resumeRes.value?.data || resumeRes.value) : null;

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
        ...userObj,
        fullName: userObj.name || userObj.fullName,
        email: userObj.email,
        submissionId: userObj.submissionId || null,
        synopsisStatus,
        synopsisSubmittedAt: synopsisObj.submittedAt || null,
        resume: resumeData || data.resume || (userObj.resumeUrl ? { fileName: userObj.resumeFileName || 'Resume.pdf', url: userObj.resumeUrl, uploadedAt: userObj.resumeUpdatedAt } : null),
        resumeUrl: userObj.resumeUrl,
        resumeFileName: userObj.resumeFileName,
        resumeUpdatedAt: userObj.resumeUpdatedAt,
      },
      synopsisStatus,
      eligibleToStart: Boolean(data.eligibleToStart),
      teaserProblemStatement: null,
      keyDates,
      rules: [
        { title: 'Plagiarism & Originality', content: 'All code must be built during the hackathon window. Open-source libraries are permitted with proper attribution.' },
        { title: 'Submission Guidelines', content: 'Submissions must include a public GitHub repository link with clear documentation and live deployment URL.' },
        { title: 'Evaluation Protocol', content: 'Judging panel reviews functionality, code architecture, UI polish, and innovation.' },
      ],
    };
  },

  /**
   * Upload resume file (POST /api/candidate/resume)
   */
  async uploadResume(file) {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await httpClient.post('/api/candidate/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      console.warn('[candidateApi] uploadResume direct multipart failed, trying upload-url:', err.message);
      const urlRes = await httpClient.post('/api/candidate/resume/upload-url', {
        fileName: file.name,
        contentType: file.type,
      });
      const { uploadUrl } = urlRes.data;
      if (uploadUrl) {
        await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
        const confirmRes = await httpClient.post('/api/candidate/resume/confirm', { fileName: file.name });
        return confirmRes.data;
      }
      throw err;
    }
  },

  /**
   * Get Candidate Resume info
   */
  async getResumeInfo() {
    try {
      const response = await httpClient.get('/api/candidate/resume');
      return response.data;
    } catch {
      return null;
    }
  },
};
