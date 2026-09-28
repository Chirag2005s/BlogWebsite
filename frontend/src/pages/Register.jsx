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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0F6B4F] to-[#16805E] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#0F6B4F]/20">
              <UserPlus size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-heading">Create Account</h1>
            <p className="text-sm text-muted">Join the TechJourney community</p>
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
                className="input-field"
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
                className="input-field"
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
                  className="input-field pl-4 pr-11"
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
                      <span className="text-muted font-medium">Password Strength</span>
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
                          rule.passed ? 'text-[#22C55E]' : 'text-muted'
                        }`}
                      >
                        {rule.passed ? (
                          <Check size={13} className="flex-shrink-0" />
                        ) : (
                          <X size={13} className="flex-shrink-0 text-muted" />
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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-[#0B1120] text-muted">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              // Simulated Google Login
              const mockGoogleUser = {
                _id: 'google-mock-id',
                name: 'Google User',
                email: 'user@gmail.com',
                role: 'USER',
                token: 'mock-google-token',
              };
              localStorage.setItem('userInfo', JSON.stringify(mockGoogleUser));
              navigate('/');
              window.location.reload();
            }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all shadow-sm group mb-6"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign up with Google
          </button>

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
