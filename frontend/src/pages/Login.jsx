import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });
      if (data && data.success && data.data) {
        localStorage.setItem('userInfo', JSON.stringify(data.data));
        navigate('/');
      } else {
        setError(data?.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      const serverMsg = err.response?.data?.message;
      if (serverMsg) {
        setError(serverMsg);
      } else if (err.message === 'Network Error') {
        setError('Network Error: Cannot connect to the backend server. Please check your backend URL and network connection.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8 sm:p-10 space-y-7 shadow-lg shadow-[#0F6B4F]/5">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0F6B4F] to-[#16805E] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#0F6B4F]/20">
              <LogIn size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-heading">Welcome Back</h1>
            <p className="text-sm text-muted">Sign in to your TechJourney account</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-fade-in">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-muted mb-2">
                <Mail size={14} className="text-[#0F6B4F]" />
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
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-muted mb-2">
                <Lock size={14} className="text-[#0F6B4F]" />
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
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-heading transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-line"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-page text-muted">Or continue with</span>
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
              window.location.reload(); // To update the navbar state immediately
            }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl surface-card border border-line text-heading font-semibold hover:bg-soft transition-all shadow-sm group mb-6"
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
            Sign in with Google
          </button>

          <p className="text-center text-sm text-[#94A3B8]">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="link-accent">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
