import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Mail, KeyRound, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();

  const [step, setStep] = useState(1); // 1: Email Request, 2: OTP Entry
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoNotice, setDemoNotice] = useState('');

  // 30s Cooldown timer for resend
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await authApi.requestOtp(email);
      toast.success(res.message || `OTP sent to ${email}`);
      if (res.demoOtp) {
        setDemoNotice(`Demo OTP: ${res.demoOtp}`);
      }
      setStep(2);
      setCooldown(30); // 30s cooldown
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send OTP. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(email, otp);
      login(res.token, res.user);
      toast.success('Successfully authenticated!');

      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid OTP code. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 flex flex-col items-center justify-center">
      {/* Brand Heading */}
      <div className="text-center max-w-sm mb-6">
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Candidate Portal</h1>
        <p className="text-xs text-slate-400 mt-1">Access your hackathon dashboard and submissions.</p>
      </div>

      <Card className="max-w-md w-full">
        {step === 1 ? (
          /* Step 1: Request OTP */
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div className="text-center mb-2">
              <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Step 1 — Request OTP</h3>
              <p className="text-xs text-slate-400 mt-0.5">Enter your registered email to receive a login code</p>
            </div>

            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              required
            />

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} icon={ArrowRight}>
              Send Verification OTP
            </Button>

            <div className="pt-2 text-center text-xs text-slate-400">
              New candidate?{' '}
              <Link to="/register" className="text-indigo-400 font-semibold hover:underline">
                Register here
              </Link>
            </div>
          </form>
        ) : (
          /* Step 2: Enter & Verify OTP */
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="text-center mb-2">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Step 2 — Enter 6-Digit Code</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Sent to <strong className="text-indigo-400">{email}</strong>{' '}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-500 underline hover:text-slate-300 ml-1"
                >
                  (Change)
                </button>
              </p>
            </div>

            {demoNotice && (
              <div className="p-3 bg-indigo-950/60 border border-indigo-500/40 rounded-xl text-center text-xs text-indigo-300 font-mono">
                {demoNotice}
              </div>
            )}

            <Input
              label="6-Digit OTP Code"
              type="text"
              icon={ShieldCheck}
              placeholder="123456"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              error={error}
              required
              className="text-center tracking-[0.5em] font-mono text-lg font-bold"
            />

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              Verify & Login to Dashboard
            </Button>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                disabled={cooldown > 0 || loading}
                onClick={handleRequestOtp}
                className="text-indigo-400 hover:text-indigo-300 disabled:text-slate-600 font-semibold flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${cooldown > 0 ? 'animate-spin' : ''}`} />
                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-slate-400 hover:text-slate-200"
              >
                Use different email
              </button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
