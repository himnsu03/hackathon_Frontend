import { AuthenticationService } from '../sdk';

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
   * Password-based login via SDK
   */
  async login(email, password) {
    const payload = {
      email,
      password,
    };
    const data = await AuthenticationService.login(payload);

    if (data.user) {
      data.user.fullName = data.user.fullName || data.user.name;
      data.user.role = (data.user.role || 'candidate').toLowerCase();
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
};
