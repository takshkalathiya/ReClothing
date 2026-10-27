import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Lock, Mail, User, School, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email format';
    }
    if (!formData.college.trim()) newErrors.college = 'College/University name is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
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
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        college: formData.college,
      });
      navigate('/marketplace');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-border rounded-3xl p-8 shadow-card animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-dark-900 font-editorial">
            Join the ReClothing Community
          </h1>
          <p className="text-xs text-muted-600 mt-1">
            Create your campus profile to buy, sell, and swap pre-loved fashion.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-muted-400 absolute left-3.5 top-3" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Alex Morgan"
                className={`input-field pl-10 ${errors.name ? 'border-rose-400 focus:border-rose-500' : ''}`}
              />
            </div>
            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider mb-1">
              College Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted-400 absolute left-3.5 top-3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@campus.edu"
                className={`input-field pl-10 ${errors.email ? 'border-rose-400 focus:border-rose-500' : ''}`}
              />
            </div>
            {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
          </div>

          {/* College / University */}
          <div>
            <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider mb-1">
              College / University
            </label>
            <div className="relative">
              <School className="w-4 h-4 text-muted-400 absolute left-3.5 top-3" />
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="e.g. Stanford University"
                className={`input-field pl-10 ${errors.college ? 'border-rose-400 focus:border-rose-500' : ''}`}
              />
            </div>
            {errors.college && <p className="text-xs text-rose-600 mt-1">{errors.college}</p>}
          </div>

          {/* Password */}
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

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-400 absolute left-3.5 top-3" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`input-field pl-10 ${errors.confirmPassword ? 'border-rose-400 focus:border-rose-500' : ''}`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-rose-600 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-primary py-3 text-sm mt-6 font-semibold"
          >
            <span>{submitting ? 'Creating Account...' : 'Register Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-forest-800 hover:text-forest-900">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
