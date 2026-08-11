import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { User, Mail, Phone, Lock, GraduationCap, Building2, Briefcase, CheckCircle2, ShieldAlert, X, Plus } from 'lucide-react';

const POPULAR_TECH_STACKS = ['React', 'Node.js', 'Python', 'Java', 'TypeScript', 'Go', 'Docker', 'AWS', 'Flutter', 'TailwindCSS'];

export const RegistrationPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 7 }, (_, i) => String(currentYear - 1 + i));

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gradYear: String(currentYear + 1),
    college: '',
    experience: '0-1 yrs',
    agreeRules: false,
  });

  const [techStack, setTechStack] = useState(['React', 'Node.js']);
  const [customTag, setCustomTag] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  const handleAddTag = (tag) => {
    const trimmed = tag.trim();
    if (trimmed && !techStack.includes(trimmed)) {
      setTechStack([...techStack, trimmed]);
      setCustomTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTechStack(techStack.filter(t => t !== tagToRemove));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }
    if (!formData.college.trim()) newErrors.college = 'College/University name is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (techStack.length === 0) newErrors.techStack = 'Select at least one tech stack tag';
    if (!formData.agreeRules) newErrors.agreeRules = 'You must agree to the Hackathon Rules and Code of Conduct';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await authApi.register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        college: formData.college.trim(),
        gradYear: formData.gradYear,
        experience: formData.experience,
        techStack,
      });

      // Automatically log in the candidate upon successful registration
      try {
        if (res && res.token && res.user) {
          login(res.token, res.user);
        } else {
          const loginRes = await authApi.login(formData.email.trim(), formData.password);
          login(loginRes.token, loginRes.user);
        }
        toast.success(`Registration successful! Welcome, ${formData.fullName.trim()}!`);
        navigate('/synopsis', { replace: true });
      } catch (loginErr) {
        toast.success('Registration successful! Please log in with your credentials.');
        navigate('/login', { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-10 px-4 flex flex-col items-center justify-center">
      {/* Header */}
      <div className="text-center max-w-lg mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Join <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">StackHack 2.0</span>
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Enterprise Hackathon Platform — Showcase your software engineering innovation.
        </p>
      </div>

      <Card className="max-w-xl w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Personal Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-4 pb-1 border-b border-orange-500/20">
              1. Personal Information
            </h4>
            <div className="space-y-4">
              <Input
                label="Full Name"
                icon={User}
                placeholder="e.g. Alex Vance"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                error={errors.fullName}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  icon={Mail}
                  placeholder="alex@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email}
                />
                <Input
                  label="Phone Number"
                  icon={Phone}
                  placeholder="10-digit mobile number"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  error={errors.phone}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  type="password"
                  icon={Lock}
                  placeholder="At least 6 chars"
                  required
                  value={formData.password || ''}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  error={errors.password}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm password"
                  required
                  value={formData.confirmPassword || ''}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  error={errors.confirmPassword}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Professional & Academic Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-4 pb-1 border-b border-orange-500/20">
              2. Academic & Tech Profile
            </h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="College / University"
                  icon={Building2}
                  placeholder="e.g. Stanford University"
                  required
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  error={errors.college}
                />
                <Select
                  label="Graduation Year"
                  options={yearOptions}
                  required
                  value={formData.gradYear}
                  onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                />
              </div>

              {/* Tech Stack Tags Input */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1">
                  Tech Stack Skills <span className="text-rose-400">*</span>
                </label>

                {/* Active Tags */}
                <div className="flex flex-wrap gap-2 mb-2 p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl min-h-[44px]">
                  {techStack.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/40 rounded-lg"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-rose-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Quick Add Buttons & Custom Tag */}
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add custom skill (e.g., Rust, GraphQL)"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag(customTag);
                      }
                    }}
                    className="flex-1 bg-slate-900/60 border border-slate-800 text-xs rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-orange-500"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleAddTag(customTag)}
                    icon={Plus}
                  >
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] text-slate-500 font-medium py-0.5">Quick add:</span>
                  {POPULAR_TECH_STACKS.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => handleAddTag(t)}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 hover:text-orange-300 border border-slate-700/50 hover:border-orange-500/50"
                    >
                      +{t}
                    </button>
                  ))}
                </div>
                {errors.techStack && <p className="text-xs text-rose-400 mt-1">• {errors.techStack}</p>}
              </div>
            </div>
          </div>

          {/* Code of Conduct Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.agreeRules}
                onChange={(e) => setFormData({ ...formData, agreeRules: e.target.checked })}
                className="mt-1 w-4 h-4 rounded bg-slate-900 border-slate-700 text-orange-600 focus:ring-orange-500 accent-orange-600"
              />
              <span className="text-xs text-slate-300 leading-snug">
                I agree to the hackathon rules, terms, and{' '}
                <button
                  type="button"
                  onClick={() => setShowRulesModal(true)}
                  className="text-orange-400 underline hover:text-orange-300 font-semibold"
                >
                  Code of Conduct
                </button>
                .
              </span>
            </label>
            {errors.agreeRules && <p className="text-xs text-rose-400 mt-1">• {errors.agreeRules}</p>}
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
            Complete Candidate Registration
          </Button>

          <p className="text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-400 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </Card>

      {/* Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <Card className="max-w-lg w-full max-h-[80vh] overflow-y-auto" title="Hackathon Rules & Code of Conduct">
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong>1. Integrity:</strong> All participants must present original work created during the hackathon period. Pre-built complete codebases are strictly prohibited.
              </p>
              <p>
                <strong>2. Respect:</strong> Maintain a respectful, inclusive environment free from harassment or discriminatory behavior.
              </p>
              <p>
                <strong>3. Submission:</strong> Projects must be submitted before the countdown timer expires with a valid GitHub repository.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="primary" size="sm" onClick={() => setShowRulesModal(false)}>
                I Understand
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
