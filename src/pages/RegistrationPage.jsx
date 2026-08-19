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
import { CaptchaChallenge } from '../components/common/CaptchaChallenge';
import { PrivacyNoticeModal } from '../components/common/PrivacyNoticeModal';
import { TermsModal } from '../components/common/TermsModal';
import { User, Mail, Phone, Lock, GraduationCap, Building2, Briefcase, CheckCircle2, ShieldAlert, X, Plus, Upload, FileText, Calendar, Shield } from 'lucide-react';

const DEFAULT_POPULAR_STACKS = ['React', 'Node.js', 'Python', 'Java', 'TypeScript', 'Go', 'Docker', 'AWS', 'Flutter', 'TailwindCSS'];

const SKILL_ALIASES = {
  react: 'React',
  reactjs: 'React',
  'react.js': 'React',
  'react js': 'React',
  node: 'Node.js',
  nodejs: 'Node.js',
  'node.js': 'Node.js',
  'node js': 'Node.js',
  next: 'Next.js',
  nextjs: 'Next.js',
  'next.js': 'Next.js',
  'next js': 'Next.js',
  vue: 'Vue.js',
  vuejs: 'Vue.js',
  'vue.js': 'Vue.js',
  'vue js': 'Vue.js',
  angular: 'Angular',
  angularjs: 'Angular',
  typescript: 'TypeScript',
  ts: 'TypeScript',
  javascript: 'JavaScript',
  js: 'JavaScript',
  tailwind: 'TailwindCSS',
  tailwindcss: 'TailwindCSS',
  'tailwind css': 'TailwindCSS',
  docker: 'Docker',
  aws: 'AWS',
  python: 'Python',
  py: 'Python',
  java: 'Java',
  spring: 'Spring Boot',
  springboot: 'Spring Boot',
  'spring boot': 'Spring Boot',
  kubernetes: 'Kubernetes',
  k8s: 'Kubernetes',
  postgres: 'PostgreSQL',
  postgresql: 'PostgreSQL',
  mongodb: 'MongoDB',
  mongo: 'MongoDB',
  redis: 'Redis',
  graphql: 'GraphQL',
  flutter: 'Flutter',
  kotlin: 'Kotlin',
  golang: 'Go',
  go: 'Go',
  rust: 'Rust',
  html: 'HTML5',
  html5: 'HTML5',
  css: 'CSS3',
  css3: 'CSS3',
  git: 'Git',
  github: 'GitHub',
};

const normalizeSkill = (s) => {
  if (!s) return '';
  const trimmed = s.trim();
  const lower = trimmed.toLowerCase();
  if (SKILL_ALIASES[lower]) return SKILL_ALIASES[lower];
  if (trimmed === lower && trimmed.length > 0) {
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }
  return trimmed;
};

export const RegistrationPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const currentYear = new Date().getFullYear();
  const [popularTechStacks, setPopularTechStacks] = useState(DEFAULT_POPULAR_STACKS);
  const [yearOptions, setYearOptions] = useState(['2025', '2026']);

  const [hackathonConfig, setHackathonConfig] = useState(null);

  useEffect(() => {
    fetch('/api/public/tech-stacks')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const uniqueNormalized = [];
          const seen = new Set();
          data.forEach((item) => {
            const norm = normalizeSkill(item);
            const key = norm.toLowerCase();
            if (norm && !seen.has(key)) {
              seen.add(key);
              uniqueNormalized.push(norm);
            }
          });
          if (uniqueNormalized.length > 0) {
            setPopularTechStacks(uniqueNormalized);
          }
        }
      })
      .catch(() => { });

    fetch('/api/public/hackathon-config')
      .then((res) => res.json())
      .then((config) => {
        if (config) {
          setHackathonConfig(config);
        }
        if (config?.eligiblePassingYears) {
          const parsedYears = config.eligiblePassingYears.split(',').map((y) => y.trim()).filter(Boolean);
          if (parsedYears.length > 0) {
            setYearOptions(parsedYears);
            setFormData((prev) => ({ ...prev, gradYear: parsedYears[0] }));
          }
        }
      })
      .catch(() => { });
  }, []);

  const now = new Date();
  const regStartDate = hackathonConfig?.synopsisStartDate ? new Date(hackathonConfig.synopsisStartDate) : null;
  const isRegistrationNotOpenYet = !regStartDate || regStartDate > now;

  const DRAFT_KEY = 'xathon_candidate_registration_draft';

  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Form State initialized with draft if present (excluding passwords & captcha)
  const [formData, setFormData] = useState(() => {
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          fullName: parsed.fullName || '',
          email: parsed.email || '',
          password: '',
          confirmPassword: '',
          phone: parsed.phone || '',
          dateOfBirth: parsed.dateOfBirth || '',
          gradYear: parsed.gradYear || '2026',
          college: parsed.college || '',
          experience: parsed.experience || '0-1 yrs',
          agreeRules: Boolean(parsed.agreeRules),
        };
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
    return {
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
    };
  });

  const [allColleges, setAllColleges] = useState([]);
  const [collegeSuggestions, setCollegeSuggestions] = useState([]);
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);

  // Pre-load colleges.json into memory on mount for instant client-side autocomplete
  useEffect(() => {
    fetch('/colleges.json')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setAllColleges(data);
        }
      })
      .catch(() => { });
  }, []);

  // Filter colleges instantly on client side & sync with DB API
  useEffect(() => {
    const queryStr = formData.college ? formData.college.trim().toLowerCase() : '';

    if (allColleges.length > 0) {
      const matches = queryStr
        ? allColleges.filter((c) => c.toLowerCase().includes(queryStr)).slice(0, 50)
        : allColleges.slice(0, 50);
      setCollegeSuggestions(matches);
    }

    if (queryStr.length >= 1) {
      fetch(`/api/public/colleges?query=${encodeURIComponent(queryStr)}&limit=50`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setCollegeSuggestions(data);
          }
        })
        .catch(() => { });
    }
  }, [formData.college, allColleges]);

  // CAPTCHA State (never persisted)
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');

  const handleCaptchaChange = (inputVal, targetCode) => {
    setCaptchaInput(inputVal);
    if (targetCode) setCaptchaCode(targetCode);
  };

  const [techStack, setTechStack] = useState(() => {
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.techStack) && parsed.techStack.length > 0) {
          return parsed.techStack;
        }
      }
    } catch (e) {
      // Ignore
    }
    return ['React', 'Node.js'];
  });

  const [customTag, setCustomTag] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  // Auto-save non-sensitive form draft to sessionStorage
  useEffect(() => {
    try {
      const draft = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gradYear: formData.gradYear,
        college: formData.college,
        experience: formData.experience,
        agreeRules: formData.agreeRules,
        techStack: techStack,
      };
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (e) {
      // Ignore storage errors
    }
  }, [formData.fullName, formData.email, formData.phone, formData.dateOfBirth, formData.gradYear, formData.college, formData.experience, formData.agreeRules, techStack]);

  const handleAddTag = (tag) => {
    if (!tag || !tag.trim()) return;
    const normalized = normalizeSkill(tag);
    const alreadyExists = techStack.some((t) => t.toLowerCase() === normalized.toLowerCase());
    if (!alreadyExists) {
      setTechStack([...techStack, normalized]);
      setCustomTag('');
      if (errors.techStack) setErrors((prev) => ({ ...prev, techStack: '' }));
    } else {
      setCustomTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTechStack(techStack.filter((t) => t.toLowerCase() !== tagToRemove.toLowerCase()));
  };

  const maxDobDate = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().split('T')[0];
  })();

  const cleanIndianPhone = (raw) => {
    if (!raw) return '';
    let digits = raw.trim().replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('0')) {
      digits = digits.substring(1);
    }
    if (digits.length === 12 && digits.startsWith('91')) {
      digits = digits.substring(2);
    }
    return digits;
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = 'Name should only contain alphabets and spaces (no numbers or special characters)';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g. user@example.com)';
    }

    const cleanPhone = cleanIndianPhone(formData.phone);
    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid mobile number';
    }

    if (!formData.college.trim()) newErrors.college = 'College/University name is required';

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      if (isNaN(dob.getTime())) {
        newErrors.dateOfBirth = 'Please enter a valid date of birth';
      } else if (dob > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future';
      } else {
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
        if (age < 18) {
          newErrors.dateOfBirth = 'Minimum age requirement is 18 years to register';
        }
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (techStack.length === 0) newErrors.techStack = 'Select at least one tech stack tag';

    // CAPTCHA Validation
    if (!captchaInput.trim()) {
      newErrors.captcha = 'Please enter the CAPTCHA code shown in the image';
    } else if (captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      newErrors.captcha = 'Incorrect CAPTCHA code. Please check the code and try again.';
    }

    if (!formData.agreeRules) newErrors.agreeRules = 'You must consent to the collection and processing of personal data for hackathon registration';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegistrationNotOpenYet) {
      const dateStr = regStartDate ? `opens on ${regStartDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}` : 'has not been announced yet';
      toast.warning(`Registration to begin soon! Candidate registration ${dateStr}.`);
      return;
    }

    if (!validate()) {
      toast.error('Please fix validation errors before submitting');
      return;
    }

    setLoading(true);
    const cleanPhone = cleanIndianPhone(formData.phone);

    try {
      const res = await authApi.register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: cleanPhone,
        dateOfBirth: formData.dateOfBirth,
        college: formData.college.trim(),
        gradYear: formData.gradYear,
        experience: formData.experience,
        agreeRules: formData.agreeRules,
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
            const formDataResume = new FormData();
            formDataResume.append('file', resumeFile);
            await candidateApi.uploadResume(formDataResume);
          } catch (e) {
            console.error('Failed to auto-upload resume on register:', e);
          }
        }

        // Clear draft from storage upon successful registration
        try {
          sessionStorage.removeItem(DRAFT_KEY);
        } catch (e) {
          // Ignore
        }

        toast.success('Registration successful! Welcome to the Hackathon Dashboard.');
        navigate('/dashboard');
      } catch (err) {
        try {
          sessionStorage.removeItem(DRAFT_KEY);
        } catch (e) {
          // Ignore
        }
        toast.info('Account created successfully! Please log in.');
        navigate('/login');
      }
    } catch (err) {
      console.error('[Registration Error]', err);
      const msg = err.body?.message || err.response?.data?.message || err.message || 'Registration failed. Please check your input.';
      toast.error(msg);
      if (err.status === 409 || err.body?.status === 409 || (typeof msg === 'string' && msg.toLowerCase().includes('email already registered'))) {
        setErrors((prev) => ({ ...prev, email: msg }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-10 px-4 flex flex-col items-center justify-center">
      {/* Header */}
      <div className="text-center max-w-2xl mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Join <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">Xathon</span>
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Enterprise Hackathon Platform — Showcase your software engineering innovation.
        </p>
      </div>

      <Card
        title="Registration Form"
        subtitle="Fill in your details below to register and participate in the hackathon"
        className="max-w-3xl lg:max-w-4xl w-full"
      >
        {isRegistrationNotOpenYet && (
          <div className="p-4 bg-amber-950/60 border border-amber-500/50 rounded-xl text-amber-300 flex items-start gap-3 mb-6">
            <Calendar className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold">Registration to Begin Soon</p>
              <p className="text-xs text-amber-400/90 mt-0.5">
                Candidate registration for the hackathon has not opened yet. {regStartDate ? `Registration begins on ${regStartDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}.` : 'Registration start date has not been announced yet.'}
              </p>
            </div>
          </div>
        )}
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
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, fullName: val });
                    if (val && !/^[a-zA-Z\s]*$/.test(val)) {
                      setErrors((prev) => ({ ...prev, fullName: 'Name should only contain alphabets and spaces (no numbers or special characters)' }));
                    } else if (errors.fullName) {
                      setErrors((prev) => ({ ...prev, fullName: '' }));
                    }
                  }}
                  error={errors.fullName}
                />
                <Input
                  label="Date of Birth"
                  type="date"
                  icon={Calendar}
                  required
                  max={maxDobDate}
                  value={formData.dateOfBirth}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, dateOfBirth: val });
                    if (!val) {
                      setErrors((prev) => ({ ...prev, dateOfBirth: 'Date of birth is required' }));
                    } else {
                      const dob = new Date(val);
                      const today = new Date();
                      if (isNaN(dob.getTime())) {
                        setErrors((prev) => ({ ...prev, dateOfBirth: 'Please enter a valid date of birth' }));
                      } else if (dob > today) {
                        setErrors((prev) => ({ ...prev, dateOfBirth: 'Date of birth cannot be in the future' }));
                      } else {
                        let age = today.getFullYear() - dob.getFullYear();
                        const monthDiff = today.getMonth() - dob.getMonth();
                        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                          age--;
                        }
                        if (age < 18) {
                          setErrors((prev) => ({ ...prev, dateOfBirth: 'Minimum age requirement is 18 years to register' }));
                        } else if (errors.dateOfBirth) {
                          setErrors((prev) => ({ ...prev, dateOfBirth: '' }));
                        }
                      }
                    }
                  }}
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
                  label="Mobile Number"
                  icon={Phone}
                  placeholder="e.g. 9876543210"
                  required
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, phone: val });
                    const clean = cleanIndianPhone(val);
                    if (val && !/^[6-9]\d{9}$/.test(clean)) {
                      setErrors((prev) => ({
                        ...prev,
                        phone: 'Please enter a valid mobile number',
                      }));
                    } else if (errors.phone) {
                      setErrors((prev) => ({ ...prev, phone: '' }));
                    }
                  }}
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
                <div className="relative">
                  <Input
                    label="College / University"
                    icon={Building2}
                    placeholder="Type to search college"
                    required
                    autoComplete="off"
                    value={formData.college}
                    onChange={(e) => {
                      setFormData({ ...formData, college: e.target.value });
                      setShowCollegeDropdown(true);
                    }}
                    onFocus={() => setShowCollegeDropdown(true)}
                    onBlur={() => {
                      setTimeout(() => setShowCollegeDropdown(false), 200);
                    }}
                    error={errors.college}
                  />

                  {showCollegeDropdown && collegeSuggestions.length > 0 && (
                    <div className="absolute z-40 left-0 top-full mt-1 w-full sm:min-w-[130%] bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl max-h-64 overflow-y-auto divide-y divide-slate-800/80">
                      {collegeSuggestions.map((colName) => (
                        <button
                          key={colName}
                          type="button"
                          className="w-full text-left px-3.5 py-2.5 text-xs text-slate-200 hover:bg-orange-500/20 hover:text-orange-300 transition-colors whitespace-normal break-words leading-snug"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setFormData({ ...formData, college: colName });
                            setShowCollegeDropdown(false);
                          }}
                        >
                          {colName}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
                  {popularTechStacks.map((t) => {
                    const isAdded = techStack.some((s) => s.toLowerCase() === t.toLowerCase());
                    return (
                      <button
                        type="button"
                        key={t}
                        onClick={() => handleAddTag(t)}
                        disabled={isAdded}
                        className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors ${isAdded
                          ? 'bg-orange-500/20 text-orange-400 border-orange-500/40 cursor-default'
                          : 'bg-slate-800/80 text-slate-400 hover:text-orange-300 border-slate-700/50 hover:border-orange-500/50'
                          }`}
                      >
                        {isAdded ? `✓ ${t}` : `+${t}`}
                      </button>
                    );
                  })}
                </div>
                {errors.techStack && <p className="text-xs text-rose-400 mt-1">• {errors.techStack}</p>}
              </div>

              {/* Resume Upload Box */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-orange-400" /> Resume / CV Document
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

          {/* Bot Protection CAPTCHA Challenge */}
          <CaptchaChallenge
            onCaptchaChange={handleCaptchaChange}
            error={errors.captcha}
          />

          {/* Consent Checkbox (Mandatory) */}
          <div className="space-y-1 pt-1">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.agreeRules}
                onChange={(e) => setFormData({ ...formData, agreeRules: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded bg-slate-900 border-slate-700 text-orange-600 focus:ring-orange-500 accent-orange-600 shrink-0"
              />
              <span className="text-xs text-slate-300 leading-snug">
                I confirm that the information provided by me is accurate and consent to the collection and processing of my personal data for registration and participation in <strong>Contata Hackathon 2026</strong>, as described in the{' '}
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-orange-400 underline hover:text-orange-300 font-semibold cursor-pointer"
                >
                  Privacy Notice
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-orange-400 underline hover:text-orange-300 font-semibold cursor-pointer"
                >
                  Terms & Conditions
                </button>
                . <span className="text-orange-400 font-bold">*</span>
              </span>
            </label>
            {errors.agreeRules && <p className="text-xs text-rose-400 mt-1 pl-7">• {errors.agreeRules}</p>}
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} disabled={isRegistrationNotOpenYet}>
            {isRegistrationNotOpenYet ? 'Registration to Begin Soon' : 'Complete Candidate Registration'}
          </Button>

          <p className="text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-400 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </Card>

      {/* Compliance Modals */}
      <PrivacyNoticeModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />

      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </div>
  );
};
