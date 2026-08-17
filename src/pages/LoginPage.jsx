import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
      const res = await authApi.loginEvaluator ? await authApi.loginEvaluator(email.trim(), password) : await authApi.login(email.trim(), password);

      // Save session
      login(res.token, res.user);
      toast.success(`Welcome back, ${res.user.fullName}!`);

      const userRole = res.user?.role?.toLowerCase() || 'evaluator';
      if (userRole === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        const from = location.state?.from?.pathname || '/evaluator/synopsis';
        navigate(from === '/dashboard' ? '/evaluator/synopsis' : from, { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Invalid evaluator or admin credentials.';
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
        <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl mb-3">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Evaluator Login</h1>
        <p className="text-xs text-slate-400 mt-1">Sign in to review candidate synopses, hackathon projects, and F2F interviews.</p>
      </div>

      <Card className="max-w-md w-full border-slate-800 bg-slate-950/90 shadow-2xl">
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="text-center mb-1">
            <h3 className="text-xl font-bold text-slate-100">Evaluator Sign In</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter your authorized evaluator or admin credentials
            </p>
          </div>

          <Input
            label="Official Email Address"
            type="email"
            icon={Mail}
            placeholder="evaluator@contata.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            required
          />

          <Input
            label="Password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            icon={ArrowRight}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
          >
            Access Evaluator Portal
          </Button>
        </form>
      </Card>
    </div>
  );
};
