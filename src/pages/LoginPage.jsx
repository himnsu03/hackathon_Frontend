import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Mail, Lock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

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
      const res = await authApi.login(email.trim(), password);
      
      // Save session
      login(res.token, res.user);
      toast.success(`Welcome back, ${res.user.fullName}!`);

      // Automatic Role-based Navigation
      if (res.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Invalid email or password.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@hackathon.com');
      setPassword('Admin@123');
    } else {
      setEmail('alex@example.com');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 flex flex-col items-center justify-center">
      {/* Brand Heading */}
      <div className="text-center max-w-sm mb-6">
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Hackathon Portal</h1>
        <p className="text-xs text-slate-400 mt-1">Access candidate workspace or organizer admin console.</p>
      </div>

      <Card className="max-w-md w-full">
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="text-center mb-1">
            <h3 className="text-xl font-bold text-slate-100">Sign In to Your Account</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter your account email and password below
            </p>
          </div>

          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="user@example.com"
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

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} icon={ArrowRight}>
            Log In
          </Button>

          {/* Quick Demo Credentials */}
          <div className="pt-2 p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Quick Demo Fill:
            </span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setDemoCredentials('candidate')}
                className="text-[11px] px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 font-mono flex items-center gap-1"
              >
                <UserCheck className="w-3 h-3" /> Candidate Demo
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('admin')}
                className="text-[11px] px-3 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 font-mono flex items-center gap-1"
              >
                <ShieldCheck className="w-3 h-3" /> Admin Demo
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400 pt-1">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 font-semibold hover:underline">
              Register here
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};
