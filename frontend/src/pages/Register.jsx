import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register({
        username: data.username,
        email: data.email,
        password: data.password
      });
      const { token, user } = response.data;
      login(user, token);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0e11] px-4 py-12 relative overflow-hidden">
      {/* Background with cinema effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#0b0e11]/90 to-[#0b0e11]" />
        <img 
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025" 
          className="w-full h-full object-cover opacity-20"
          alt="Cinema Background"
        />
      </div>

      <div className="w-full max-w-md animate-fadeIn relative z-10">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 sm:p-10 space-y-6 hover:border-[#4ecdc4]/50 transition-all duration-300">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4ecdc4] to-[#6eddd6] mb-3 shadow-lg shadow-[#4ecdc4]/50 transform hover:scale-110 transition-transform duration-300">
              <svg className="w-11 h-11 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-black text-white">Join MovieMatch</h1>
            <p className="text-gray-400 text-lg">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-300 mb-2 transition-colors group-focus-within:text-[#4ecdc4]">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register('username', { required: 'Username is required' })}
                  className="w-full px-4 py-3.5 pl-11 bg-white/5 border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ecdc4]/50 focus:border-[#4ecdc4] transition-all duration-200 placeholder:text-gray-500 text-white"
                  placeholder="john_doe"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4ecdc4] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              {errors.username && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1 animate-slideIn">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-300 mb-2 transition-colors group-focus-within:text-[#4ecdc4]">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full px-4 py-3.5 pl-11 bg-white/5 border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ecdc4]/50 focus:border-[#4ecdc4] transition-all duration-200 placeholder:text-gray-500 text-white"
                  placeholder="your@email.com"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4ecdc4] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1 animate-slideIn">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-300 mb-2 transition-colors group-focus-within:text-[#4ecdc4]">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                  className="w-full px-4 py-3.5 pl-11 bg-white/5 border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ecdc4]/50 focus:border-[#4ecdc4] transition-all duration-200 placeholder:text-gray-500 text-white"
                  placeholder="••••••••"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4ecdc4] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1 animate-slideIn">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-300 mb-2 transition-colors group-focus-within:text-[#4ecdc4]">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  {...register('confirmPassword', { required: 'Please confirm your password' })}
                  className="w-full px-4 py-3.5 pl-11 bg-white/5 border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ecdc4]/50 focus:border-[#4ecdc4] transition-all duration-200 placeholder:text-gray-500 text-white"
                  placeholder="••••••••"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4ecdc4] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1 animate-slideIn">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#4ecdc4] to-[#6eddd6] text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-[#4ecdc4]/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white/5 text-gray-400 font-medium">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <a
              href="/login"
              className="inline-flex items-center gap-2 text-[#4ecdc4] hover:text-[#6eddd6] font-semibold transition-colors group"
            >
              Sign in
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
