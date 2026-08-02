import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { CheckCircle2, AlertCircle, Loader2, Mail, ArrowRight } from 'lucide-react';

export const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const toast = useToast();

  const [status, setStatus] = useState('loading'); // loading | success | error
  const [errorMessage, setErrorMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('No verification token provided in the URL.');
      return;
    }

    const verify = async () => {
      try {
        await authApi.verifyEmail(token);
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setErrorMessage(err.response?.data?.message || 'Verification link is invalid or has expired.');
      }
    };

    verify();
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail) return;

    setResendLoading(true);
    try {
      // Request OTP or resend verification email from backend API
      await authApi.requestOtp(resendEmail);
      toast.success(`Verification link re-sent to ${resendEmail}`);
      setResendSuccess(true);
    } catch {
      toast.error('Failed to resend verification email.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 flex flex-col items-center justify-center">
      <Card className="max-w-md w-full text-center py-8 px-6">
        {status === 'loading' && (
          <div className="py-6 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-100">Verifying your email...</h3>
            <p className="text-xs text-slate-400">Please hold tight while we confirm your security token.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-4 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-100">Email Verified!</h2>
            <p className="text-sm text-slate-300">
              Your email has been successfully verified. You can now log into your candidate dashboard.
            </p>
            <div className="pt-4">
              <Link to="/login">
                <Button variant="primary" size="lg" fullWidth icon={ArrowRight}>
                  Proceed to Login
                </Button>
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="py-4 space-y-4">
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-100">Verification Failed</h2>
            <p className="text-xs text-rose-300 bg-rose-950/40 p-3 rounded-xl border border-rose-900/50">
              {errorMessage}
            </p>

            {/* Resend Flow */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Resend Verification Link
              </h4>
              {resendSuccess ? (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs">
                  Check your inbox! A new verification link was sent to {resendEmail}.
                </div>
              ) : (
                <form onSubmit={handleResend} className="space-y-3">
                  <Input
                    type="email"
                    icon={Mail}
                    placeholder="Enter your registered email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" variant="secondary" size="md" fullWidth loading={resendLoading}>
                    Resend Verification Email
                  </Button>
                </form>
              )}
            </div>

            <div className="pt-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
