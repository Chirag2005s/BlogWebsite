import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
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
      
      if (err.response?.status === 401) {
        setError(serverMsg || 'Invalid email or password. Please try again.');
      } else if (serverMsg) {
        setError(serverMsg);
      } else if (err.message === 'Network Error') {
        setError('Network Error: Cannot connect to the backend server. Please check your backend URL and network connection.');
      } else {
        setError('Login failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const userInfo = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        role: 'member' // Default role
      };
      
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      navigate('/');
    } catch (err) {
      setError('Failed to process Google authentication.');
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

          <div className="flex items-center gap-4">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-xs text-muted font-medium uppercase tracking-wider">or sign in with</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                setError('Google Login Failed');
              }}
              useOneTap
              theme="outline"
              shape="pill"
            />
          </div>

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
