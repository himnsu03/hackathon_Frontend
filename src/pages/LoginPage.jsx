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
      const userRole = res.user?.role?.toLowerCase() || 'candidate';
      if (userRole === 'admin') {
        navigate('/admin', { replace: true });
      } else if (userRole === 'evaluator') {
        navigate('/evaluator/synopsis', { replace: true });
      } else {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from === '/dashboard' && userRole === 'evaluator' ? '/evaluator/synopsis' : from, { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Invalid email or password.';
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



          <div className="text-center text-xs text-slate-400 pt-1">
            Don't have an account?{' '}
            <Link to="/register" className="text-orange-400 font-semibold hover:underline">
              Register here
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};
