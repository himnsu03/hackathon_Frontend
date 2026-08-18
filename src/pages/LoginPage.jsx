import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Mail, Lock, ArrowRight, KeyRound, X } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password Reset Modal States
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Send OTP, 2: Reset Password
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(email.trim(), password);

      // Save session
      login(res.token, res.user);
      toast.success(`Welcome back, ${res.user.fullName || res.user.name || 'Candidate'}!`);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Invalid candidate credentials.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!resetEmail || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(resetEmail.trim())) {
      setResetError('Please enter a valid email address.');
      return;
    }

    setResetError('');
    setResetLoading(true);
    try {
      await authApi.forgotPassword(resetEmail.trim());
      toast.success(`Verification code (OTP) sent to ${resetEmail.trim()}!`);
      setResetStep(2);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send OTP. Please check email address.';
      setResetError(msg);
      toast.error(msg);
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetOtp || resetOtp.length !== 6) {
      setResetError('Please enter the 6-digit verification code.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setResetError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setResetError('Passwords do not match.');
      return;
    }

    setResetError('');
    setResetLoading(true);
    try {
      await authApi.resetPassword(resetEmail.trim(), resetOtp.trim(), newPassword);
      toast.success('Password reset successfully! You can now log in.');
      setEmail(resetEmail.trim());
      setShowResetModal(false);
      setResetStep(1);
      setResetOtp('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired OTP code.';
      setResetError(msg);
      toast.error(msg);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 flex flex-col items-center justify-center">
      {/* Brand Heading */}
      <div className="text-center max-w-sm mb-6">
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Candidate Portal</h1>
        <p className="text-xs text-slate-400 mt-1">Access candidate workspace or submit hackathon proposals.</p>
      </div>

      <Card className="max-w-md w-full border-slate-800 bg-slate-950/90 shadow-2xl">
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="text-center mb-1">
            <h3 className="text-xl font-bold text-slate-100">Candidate Sign In</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter your candidate account email and password below
            </p>
          </div>

          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            required
          />

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setResetStep(1);
                  setResetError('');
                  setShowResetModal(true);
                }}
                className="text-xs font-semibold text-orange-400 hover:text-orange-300 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <Input
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            icon={ArrowRight}
            className="bg-orange-600 hover:bg-orange-500 text-white font-bold"
          >
            Access Candidate Portal
          </Button>

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
            Don't have an account?{' '}
            <Link to="/register" className="text-orange-400 font-semibold hover:underline">
              Register here
            </Link>
          </div>
        </form>
      </Card>

      {/* Forgot Password OTP Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <Card className="max-w-md w-full relative border-slate-800 bg-slate-900/95">
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center p-3 bg-orange-500/10 border border-orange-500/30 rounded-2xl mb-2">
                <KeyRound className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">
                {resetStep === 1 ? 'Reset Password' : 'Enter Verification Code'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {resetStep === 1
                  ? 'We will send a 6-digit verification OTP to your email address.'
                  : `Enter the 6-digit OTP code sent to ${resetEmail}`}
              </p>
            </div>

            {resetError && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
                {resetError}
              </div>
            )}

            {resetStep === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <Input
                  label="Registered Email Address"
                  type="email"
                  icon={Mail}
                  placeholder="your.email@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
                <Button type="submit" variant="primary" size="lg" fullWidth loading={resetLoading} className="bg-orange-600 hover:bg-orange-500 text-white font-bold">
                  Send Verification OTP
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <Input
                  label="6-Digit OTP Code"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={resetOtp}
                  onChange={(e) => setResetOtp(e.target.value)}
                  required
                />
                <Input
                  label="New Password"
                  type="password"
                  icon={Lock}
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setResetStep(1)}
                    className="w-1/3"
                  >
                    Resend Code
                  </Button>
                  <Button type="submit" variant="primary" size="lg" loading={resetLoading} className="w-2/3 bg-orange-600 hover:bg-orange-500 text-white font-bold">
                    Reset Password
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
