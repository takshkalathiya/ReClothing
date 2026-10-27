import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, UserCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/marketplace';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to fill demo account
  const handleQuickDemo = (email, password = 'password123') => {
    setFormData({ email, password });
    setErrors({});
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-border rounded-3xl p-8 shadow-card animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-dark-900 font-editorial">
            Welcome Back to ReClothing
          </h1>
          <p className="text-xs text-muted-600 mt-1">
            Sign in to manage your campus listings and trade requests.
          </p>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="mb-6 p-3.5 bg-ivory-100 border border-border rounded-2xl">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-forest-800 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>One-Click Demo Credentials:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickDemo('elena@campus.edu')}
              className="px-2.5 py-1.5 bg-white border border-border rounded-xl text-left hover:border-forest-800 transition-colors truncate"
              title="Elena (Seller with Vintage Jacket & Boots)"
            >
              👩‍🎓 <strong>Elena</strong> (Seller)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('dev@campus.edu')}
              className="px-2.5 py-1.5 bg-white border border-border rounded-xl text-left hover:border-forest-800 transition-colors truncate"
              title="Dev (Buyer & Tech items seller)"
            >
              👨‍🎓 <strong>Dev</strong> (Buyer)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted-400 absolute left-3.5 top-3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@campus.edu"
                className={`input-field pl-10 ${errors.email ? 'border-rose-400 focus:border-rose-500' : ''}`}
              />
            </div>
            {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-400 absolute left-3.5 top-3" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`input-field pl-10 ${errors.password ? 'border-rose-400 focus:border-rose-500' : ''}`}
              />
            </div>
            {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-primary py-3 text-sm mt-6 font-semibold"
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-600">
            Don’t have an account yet?{' '}
            <Link to="/register" className="font-semibold text-forest-800 hover:text-forest-900">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
