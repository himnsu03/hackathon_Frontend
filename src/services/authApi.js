import { httpClient } from './httpClient';
import { getMockStore, saveMockStore } from './mockData';

export const authApi = {
  /**
   * Register a new candidate
   * @param {Object} data - { fullName, email, phone, techStack, gradYear, college, experience }
   */
  async register(data) {
    try {
      const response = await httpClient.post('/auth/register', data);
      return response.data;
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || (err.response && err.response.status === 404)) {
        // Mock fallback
        const store = getMockStore();
        const existing = store.users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
        if (existing) {
          throw { response: { data: { message: 'An account with this email address already exists.' } } };
        }
        
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const newUser = {
          id: `usr_${Date.now()}`,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          techStack: data.techStack || [],
          gradYear: data.gradYear,
          college: data.college,
          experience: data.experience,
          submissionId: `SUB-2026-${randomNum}`,
          verified: false,
          role: 'candidate',
          synopsisStatus: 'NOT_SUBMITTED',
          synopsisContent: null,
          synopsisSubmittedAt: null,
          hackathonStarted: false,
        };
        store.users.push(newUser);
        saveMockStore(store);
        
        return {
          success: true,
          message: 'Registration successful! Please check your email for the verification link.',
          user: newUser,
          mockVerificationToken: `token_mock_${newUser.id}`,
        };
      }
      throw err;
    }
  },

  /**
   * Verify email token
   * @param {string} token
   */
  async verifyEmail(token) {
    try {
      const response = await httpClient.post('/auth/verify-email', { token });
      return response.data;
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || (err.response && err.response.status === 404)) {
        // Mock fallback
        const store = getMockStore();
        if (token.startsWith('token_mock_')) {
          const userId = token.replace('token_mock_', '');
          const user = store.users.find(u => u.id === userId);
          if (user) {
            user.verified = true;
            saveMockStore(store);
            return { success: true, message: 'Email verified successfully!' };
          }
        }
        // If demo token, verify first unverified or alex
        const unverified = store.users.find(u => !u.verified) || store.users[0];
        if (unverified) {
          unverified.verified = true;
          saveMockStore(store);
          return { success: true, message: 'Email verified successfully!' };
        }
        throw { response: { data: { message: 'Invalid or expired verification token.' } } };
      }
      throw err;
    }
  },

  /**
   * Request OTP for email login
   * @param {string} email
   */
  async requestOtp(email) {
    try {
      const response = await httpClient.post('/auth/request-otp', { email });
      return response.data;
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || (err.response && err.response.status === 404)) {
        // Mock fallback
        const store = getMockStore();
        let user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        // Auto-register candidate or admin for testing if not existing
        if (!user) {
          const randomNum = Math.floor(1000 + Math.random() * 9000);
          user = {
            id: `usr_${Date.now()}`,
            fullName: email.split('@')[0],
            email: email,
            phone: '9876543210',
            techStack: ['React', 'Node.js'],
            gradYear: '2026',
            college: 'Tech Institute',
            experience: '0-1 yrs',
            submissionId: `SUB-2026-${randomNum}`,
            verified: true,
            role: email.includes('admin') ? 'admin' : 'candidate',
            synopsisStatus: 'NOT_SUBMITTED',
          };
          store.users.push(user);
        }

        const otp = '123456'; // Default demo OTP
        store.otps[email.toLowerCase()] = otp;
        saveMockStore(store);

        return {
          success: true,
          message: `OTP sent to ${email}. (Demo OTP: 123456)`,
          demoOtp: '123456',
        };
      }
      throw err;
    }
  },

  /**
   * Login with email + OTP
   * @param {string} email
   * @param {string} otp
   */
  async login(email, otp) {
    try {
      const response = await httpClient.post('/auth/login', { email, otp });
      return response.data;
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || (err.response && err.response.status === 404)) {
        // Mock fallback
        const store = getMockStore();
        const lowerEmail = email.toLowerCase();
        const storedOtp = store.otps[lowerEmail] || '123456';

        if (otp !== storedOtp && otp !== '123456') {
          throw { response: { data: { message: 'Invalid OTP entered. Please try again or resend.' } } };
        }

        let user = store.users.find(u => u.email.toLowerCase() === lowerEmail);
        if (!user) {
          user = store.users[0]; // Fallback user
        }

        const token = `jwt_mock_token_${user.id}_${Date.now()}`;
        return {
          success: true,
          token,
          user,
        };
      }
      throw err;
    }
  },

  /**
   * Get current authenticated user session
   */
  async getMe() {
    try {
      const response = await httpClient.get('/auth/me');
      return response.data;
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || (err.response && err.response.status === 404)) {
        // Mock fallback
        const token = localStorage.getItem('auth_token');
        if (!token) throw err;
        const store = getMockStore();
        // Parse user ID from mock token if present
        const match = token.match(/jwt_mock_token_([^_]+)_/);
        if (match) {
          const userId = match[1];
          const user = store.users.find(u => u.id === userId);
          if (user) return { user };
        }
        return { user: store.users[0] };
      }
      throw err;
    }
  },
};
