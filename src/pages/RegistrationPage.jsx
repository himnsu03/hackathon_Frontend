import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { candidateApi } from '../services/candidateApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { User, Mail, Phone, Lock, GraduationCap, Building2, Briefcase, CheckCircle2, ShieldAlert, X, Plus, Upload, FileText, Calendar } from 'lucide-react';

const DEFAULT_POPULAR_STACKS = ['React', 'Node.js', 'Python', 'Java', 'TypeScript', 'Go', 'Docker', 'AWS', 'Flutter', 'TailwindCSS'];

export const RegistrationPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const currentYear = new Date().getFullYear();
  const [popularTechStacks, setPopularTechStacks] = useState(DEFAULT_POPULAR_STACKS);
  const [yearOptions, setYearOptions] = useState(['2025', '2026']);

  useEffect(() => {
    fetch('/api/public/tech-stacks')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPopularTechStacks(data);
        }
      })
      .catch(() => { });

    fetch('/api/public/hackathon-config')
      .then(res => res.json())
      .then(config => {
        if (config?.eligiblePassingYears) {
          const parsedYears = config.eligiblePassingYears.split(',').map(y => y.trim()).filter(Boolean);
          if (parsedYears.length > 0) {
            setYearOptions(parsedYears);
            setFormData(prev => ({ ...prev, gradYear: parsedYears[0] }));
          }
        }
      })
      .catch(() => { });
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    gradYear: '2026',
    college: '',
    experience: '0-1 yrs',
    agreeRules: false,
  });

  const [techStack, setTechStack] = useState(['React', 'Node.js']);
  const [customTag, setCustomTag] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState('');
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

    const cleanPhone = formData.phone.trim().replace(/^(\+91|91)/, '').replace(/\D/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (cleanPhone.length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number (e.g. 9876543210)';
    }

    if (!formData.college.trim()) newErrors.college = 'College/University name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
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
      const cleanPhone = formData.phone.trim().replace(/^(\+91|91)/, '').replace(/\D/g, '');
      const res = await authApi.register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: cleanPhone,
        dateOfBirth: formData.dateOfBirth,
        college: formData.college.trim(),
        gradYear: formData.gradYear,
        experience: formData.experience,
        techStack,
      });

      // Automatically log in the candidate upon successful registration
      try {
        let activeToken = res?.token;
        let activeUser = res?.user;
        if (!activeToken || !activeUser) {
          const loginRes = await authApi.login(formData.email.trim(), formData.password);
          activeToken = loginRes.token;
          activeUser = loginRes.user;
        }
        login(activeToken, activeUser);

        // Upload resume if attached during registration
        if (resumeFile) {
          try {
            await candidateApi.uploadResume(resumeFile);
            toast.success(`Registration & Resume Upload successful! Welcome, ${formData.fullName.trim()}!`);
          } catch (uploadErr) {
            console.error('[Registration Resume Upload Error]', uploadErr);
            toast.warning('Registration completed, but resume upload failed. You can upload it from your dashboard.');
          }
        } else {
          toast.success(`Registration successful! Welcome, ${formData.fullName.trim()}!`);
        }

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
          Join <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">Xthon</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  icon={User}
                  placeholder="e.g. Alex Vance"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  error={errors.fullName}
                />
                <Input
                  label="Date of Birth"
                  type="date"
                  icon={Calendar}
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  error={errors.dateOfBirth}
                />
              </div>

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
                  {popularTechStacks.map((t) => (
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

              {/* Resume Upload Box */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-orange-400" /> Resume / CV Document (Optional)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">PDF, DOC, DOCX (Max 10MB)</span>
                </label>
                <div className="relative border-2 border-dashed border-slate-800 hover:border-orange-500/50 bg-slate-900/60 rounded-xl p-4 transition-colors text-center">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 10 * 1024 * 1024) {
                          setResumeError('File size exceeds 10MB limit.');
                          setResumeFile(null);
                        } else {
                          setResumeError('');
                          setResumeFile(file);
                        }
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Upload className="w-5 h-5 text-orange-400 mb-1" />
                    {resumeFile ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Selected: {resumeFile.name} ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    ) : (
                      <>
                        <span className="text-xs font-semibold text-slate-200">Click or drag & drop to upload resume</span>
                        <span className="text-[11px] text-slate-400">PDF, DOC or DOCX up to 10MB</span>
                      </>
                    )}
                  </div>
                </div>
                {resumeError && <p className="text-xs text-rose-400 mt-1">• {resumeError}</p>}
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
