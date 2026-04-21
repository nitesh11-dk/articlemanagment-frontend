import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const { register, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(formData.name, formData.email, formData.password);
    if (result.success) {
      navigate('/');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="glass w-full max-w-md p-8 rounded-2xl shadow-xl border border-zinc-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Create Account</h1>
          <p className="text-text-secondary">Join as an Editor to start writing</p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg flex items-center gap-3 mb-6 animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-secondary uppercase ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input 
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-secondary uppercase ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input 
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-secondary uppercase ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input 
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Sign Up as Editor
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;
