import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, AlertCircle, ArrowRight, Eye, EyeOff, Check, X, ShieldCheck } from 'lucide-react';
import api from '../services/api';

/* ─── Password strength rules ─── */
const PASSWORD_RULES = [
  { id: 'length',   label: 'At least 8 characters',          test: (pw) => pw.length >= 8 },
  { id: 'upper',    label: 'One uppercase letter (A-Z)',      test: (pw) => /[A-Z]/.test(pw) },
  { id: 'lower',    label: 'One lowercase letter (a-z)',      test: (pw) => /[a-z]/.test(pw) },
  { id: 'digit',    label: 'One number (0-9)',                test: (pw) => /[0-9]/.test(pw) },
  { id: 'special',  label: 'One special character (!@#$...)', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

const STRENGTH_LEVELS = [
  { label: 'Too weak',  color: '#EF4444', bg: 'bg-red-500' },
  { label: 'Weak',      color: '#F97316', bg: 'bg-orange-500' },
  { label: 'Fair',      color: '#F59E0B', bg: 'bg-amber-500' },
  { label: 'Good',      color: '#22C55E', bg: 'bg-green-500' },
  { label: 'Strong',    color: '#06B6D4', bg: 'bg-cyan-500' },
];

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* ─── Derive strength metrics from password ─── */
  const { passedCount, results, strength, allPassed } = useMemo(() => {
    const results = PASSWORD_RULES.map((rule) => ({
      ...rule,
      passed: rule.test(password),
    }));
    const passedCount = results.filter((r) => r.passed).length;
    const strength = password.length === 0 ? -1 : Math.min(passedCount, STRENGTH_LEVELS.length - 1);
    return { passedCount, results, strength, allPassed: passedCount === PASSWORD_RULES.length };
  }, [password]);

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const canSubmit = allPassed && passwordsMatch && name.trim().length > 0 && email.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/register', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      if (data && data.success && data.data) {
        localStorage.setItem('userInfo', JSON.stringify(data.data));
        navigate('/');
      } else {
        setError(data?.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      const serverMsg = err.response?.data?.message;
      if (serverMsg) {
        setError(serverMsg);
      } else if (err.message === 'Network Error') {
        setError('Network Error: Cannot connect to the backend server. Please check your backend URL and network connection.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="glass-card rounded-2xl p-8 sm:p-10 space-y-7">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-primary-500/20">
              <UserPlus size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-sm text-text-secondary">Join the TechJourney community</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 bg-error/10 border border-error/20 text-red-400 px-4 py-3 rounded-xl text-sm animate-fade-in">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-2">
                <User size={14} className="text-primary-400" />
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-surface-900/60 border border-white/8 rounded-xl px-4 py-3 text-white placeholder-text-muted text-sm focus:outline-none focus:border-primary-500/40 focus:ring-1 focus:ring-primary-500/20 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-2">
                <Mail size={14} className="text-primary-400" />
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-surface-900/60 border border-white/8 rounded-xl px-4 py-3 text-white placeholder-text-muted text-sm focus:outline-none focus:border-primary-500/40 focus:ring-1 focus:ring-primary-500/20 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-2">
                <Lock size={14} className="text-primary-400" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-900/60 border border-white/8 rounded-xl pl-4 pr-11 py-3 text-white placeholder-text-muted text-sm focus:outline-none focus:border-primary-500/40 focus:ring-1 focus:ring-primary-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* ─── Strength Meter ─── */}
              {password.length > 0 && (
                <div className="mt-3 space-y-3 animate-fade-in">
                  {/* Strength Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#94A3B8] font-medium">Password Strength</span>
                      <span
                        className="font-bold font-mono"
                        style={{ color: STRENGTH_LEVELS[Math.max(strength, 0)]?.color }}
                      >
                        {STRENGTH_LEVELS[Math.max(strength, 0)]?.label}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#1E293B] overflow-hidden flex gap-1">
                      {STRENGTH_LEVELS.map((lvl, i) => (
                        <div
                          key={i}
                          className="h-full flex-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: i <= strength ? lvl.color : 'transparent',
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Rule Checklist */}
                  <ul className="space-y-1.5">
                    {results.map((rule) => (
                      <li
                        key={rule.id}
                        className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                          rule.passed ? 'text-[#22C55E]' : 'text-[#94A3B8]'
                        }`}
                      >
                        {rule.passed ? (
                          <Check size={13} className="flex-shrink-0" />
                        ) : (
                          <X size={13} className="flex-shrink-0 text-[#64748B]" />
                        )}
                        <span>{rule.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-2">
                <ShieldCheck size={14} className="text-primary-400" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-surface-900/60 border rounded-xl pl-4 pr-11 py-3 text-white placeholder-text-muted text-sm focus:outline-none transition-all ${
                    confirmPassword.length === 0
                      ? 'border-white/8 focus:border-primary-500/40 focus:ring-1 focus:ring-primary-500/20'
                      : passwordsMatch
                      ? 'border-green-500/40 focus:border-green-500/60 focus:ring-1 focus:ring-green-500/20'
                      : 'border-red-500/40 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors cursor-pointer"
                  title={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1.5 animate-fade-in">
                  <X size={12} /> Passwords do not match
                </p>
              )}
              {passwordsMatch && (
                <p className="mt-1.5 text-xs text-[#22C55E] flex items-center gap-1.5 animate-fade-in">
                  <Check size={12} /> Passwords match
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="w-full bg-primary-600 hover:bg-primary-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-primary-600/20 hover:shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
