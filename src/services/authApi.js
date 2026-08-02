import { httpClient } from './httpClient';

export const authApi = {
  /**
   * Register a new candidate (maps frontend form data to Spring Boot RegisterRequestDto)
   * @param {Object} data - { fullName, email, password, phone, techStack, gradYear, college, experience, agreeRules }
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
      agreedToRules: Boolean(data.agreeRules ?? data.agreedToRules ?? true),
    };

    const response = await httpClient.post('/auth/register', payload);
    return response.data;
  },

  /**
   * Verify email token
   * @param {string} token
   */
  async verifyEmail(token) {
    const response = await httpClient.post('/auth/verify-email', { token });
    return response.data;
  },

  /**
   * Password-based login for candidate and admin
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    const payload = {
      email,
      password,
    };
    const response = await httpClient.post('/auth/login', payload);
    const data = response.data;

    // Normalize user response fields for frontend consumption
    if (data.user) {
      data.user.fullName = data.user.fullName || data.user.name;
      data.user.role = (data.user.role || 'candidate').toLowerCase();
    }
    return data;
  },

  /**
   * Get current authenticated user session
   */
  async getMe() {
    const response = await httpClient.get('/auth/me');
    const data = response.data;
    const user = data.user || data;
    if (user) {
      user.fullName = user.fullName || user.name;
      user.role = (user.role || 'candidate').toLowerCase();
    }
    return { user };
  },
};
