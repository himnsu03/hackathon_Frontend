import { AuthenticationService } from '../sdk';
import { httpClient } from './httpClient';

export const authApi = {
  /**
   * Register a new candidate (maps frontend form data to Spring Boot RegisterRequestDto via SDK)
   */
  async register(data) {
    const expMap = {
      'Student': 'STUDENT',
      '0-1 yrs': 'ZERO_TO_ONE',
      '1-3 yrs': 'ONE_TO_THREE',
      '3+ yrs': 'THREE_PLUS',
    };

    const payload = {
      name: data.fullName || data.name,
      email: data.email,
      password: data.password,
      phoneNumber: data.phone || data.phoneNumber,
      techStack: Array.isArray(data.techStack) ? data.techStack.join(', ') : (data.techStack || ''),
      graduationYear: data.gradYear ? parseInt(data.gradYear, 10) : (data.graduationYear ? parseInt(data.graduationYear, 10) : 2026),
      collegeOrUniversity: data.college || data.collegeOrUniversity || '',
      experience: expMap[data.experience] || data.experience || 'STUDENT',
      dateOfBirth: data.dateOfBirth || null,
      agreedToRules: Boolean(data.agreeRules ?? data.agreedToRules ?? true),
    };

    return await AuthenticationService.register(payload);
  },

  /**
   * Verify email token via SDK
   */
  async verifyEmail(token) {
    return await AuthenticationService.verifyEmail({ token });
  },

  /**
   * Password-based login for candidates
   */
  async login(email, password) {
    const res = await httpClient.post('/api/auth/candidate/login', { email, password });
    const data = res.data;

    if (data.user) {
      data.user.fullName = data.user.fullName || data.user.name;
      data.user.role = (data.user.role || 'candidate').toLowerCase();
    }
    return data;
  },

  /**
   * Candidate-specific login
   */
  async loginCandidate(email, password) {
    const res = await httpClient.post('/api/auth/candidate/login', { email, password });
    const data = res.data;
    if (data.user) {
      data.user.fullName = data.user.fullName || data.user.name;
      data.user.role = (data.user.role || 'candidate').toLowerCase();
    }
    return data;
  },

  /**
   * Evaluator/Admin-specific login
   */
  async loginEvaluator(email, password) {
    const res = await httpClient.post('/api/auth/evaluator/login', { email, password });
    const data = res.data;
    if (data.user) {
      data.user.fullName = data.user.fullName || data.user.name;
      data.user.role = (data.user.role || 'evaluator').toLowerCase();
    }
    return data;
  },

  /**
   * Get current authenticated user session via SDK
   */
  async getMe() {
    const data = await AuthenticationService.getCurrentUser();
    const user = data.user || data;
    if (user) {
      user.fullName = user.fullName || user.name;
      user.role = (user.role || 'candidate').toLowerCase();
    }
    return { user };
  },

  /**
   * Request password reset OTP via email
   */
  async forgotPassword(email) {
    const res = await httpClient.post('/api/auth/forgot-password', { email });
    return res.data;
  },

  /**
   * Complete password reset using OTP
   */
  async resetPassword(email, otp, newPassword) {
    const res = await httpClient.post('/api/auth/reset-password', { email, otp, newPassword });
    return res.data;
  },
};
