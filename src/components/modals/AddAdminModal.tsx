"use client"

import type React from "react"
import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, UserPlus, Mail, AlertCircle, CheckCircle2, Lock, User, KeyRound, ShieldCheck, Sparkles } from 'lucide-react';
import { sendNewAdminNotification } from '../../utils/emailService';

type AddAdminModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddAdmin: (adminData: { username: string; email: string; password: string }) => void;
};

const AddAdminModal: React.FC<AddAdminModalProps> = ({
  isOpen,
  onClose,
  onAddAdmin,
}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      document.body.style.overflow = 'hidden'
    } else {
      const timer = setTimeout(() => setMounted(false), 300)
      document.body.style.overflow = 'unset'
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen && !mounted) return null;

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const { username, email, password, confirmPassword } = formData;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Invalid email format');
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call to create admin
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Send notification email to main admin
      const emailSent = await sendNewAdminNotification({ username, email });

      if (emailSent) {
        setSuccess(`Admin "${username}" created successfully! Notification sent to system administrator.`);
      } else {
        setSuccess(`Admin "${username}" created successfully! (Email notification failed)`);
      }

      // Call the parent callback with all required data
      onAddAdmin({ username, email, password });

      // Reset form after a delay to show success message
      setTimeout(() => {
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        setSuccess('');
        onClose();
      }, 2000);
    } catch (error) {
      setError('Failed to create admin account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex min-h-screen items-center justify-center p-3 sm:p-4">
        {/* Advanced Backdrop with Gradient Overlay */}
        <div 
          className={`fixed inset-0 bg-gradient-to-br from-slate-950/70 via-orange-950/60 to-slate-950/70 backdrop-blur-xl transition-all duration-500 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={onClose}
          aria-hidden="true"
        >
          {/* Animated gradient orbs for depth */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-red-600/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Modal Container with Glass Effect - Extra Compact */}
        <div 
          className={`relative w-full max-w-[380px] transform transition-all duration-500 ${
            isOpen ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-admin-title"
        >
          {/* Glass Card with Border Gradient */}
          <div className="relative overflow-hidden rounded-xl bg-white/95 backdrop-blur-2xl shadow-2xl border border-white/20">
            {/* Decorative gradient border effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500/10 via-red-500/10 to-orange-500/10 pointer-events-none"></div>
            
            {/* Premium Header with Depth - Extra Compact */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900 px-5 py-4">
              {/* Animated grid pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                   linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px'
                }}></div>
              </div>

              {/* Glowing accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-75"></div>
              
              {/* Header content */}
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    {/* Premium icon badge */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg blur-sm opacity-75 animate-pulse-slow"></div>
                      <div className="relative rounded-lg bg-gradient-to-br from-orange-500 to-red-600 p-1.5 shadow-lg">
                        <UserPlus className="text-white" size={20} strokeWidth={2.5} />
                      </div>
                    </div>
                    
                    <div>
                      <h3 id="add-admin-title" className="text-base font-bold text-white tracking-tight flex items-center gap-1">
                        Add New Admin
                        <Sparkles className="text-orange-300" size={14} />
                      </h3>
                      <p className="text-[10px] text-orange-200/90 mt-0.5 font-medium">Create Admin Account</p>
                    </div>
                  </div>
                </div>
                
                {/* Close button */}
                <button 
                  type="button" 
                  className="group rounded-lg p-1.5 text-orange-200 transition-all duration-200 hover:bg-white/10 hover:text-white hover:rotate-90 active:scale-90" 
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>

              {/* Trust indicators */}
              <div className="relative mt-3 flex items-center gap-2 text-[10px]">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <ShieldCheck className="text-green-400" size={10} />
                  <span className="text-white/90 font-medium">Secure</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <Mail className="text-orange-300" size={10} />
                  <span className="text-white/90 font-medium">Email Notify</span>
                </div>
              </div>
            </div>
            {/* Form Content - Extra Compact */}
            <div className="relative p-4">
              {/* Error Alert - Extra Compact */}
              {error && (
                <div 
                  className="mb-2.5 flex items-start space-x-2 rounded-lg border border-red-200/50 bg-gradient-to-br from-red-50 to-rose-50 p-2 shadow-lg shadow-red-500/10"
                  style={{ animation: 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
                  role="alert"
                >
                  <div className="rounded-md bg-red-100 p-1">
                    <AlertCircle className="h-3 w-3 text-red-600" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-semibold text-red-900">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Alert - Extra Compact */}
              {success && (
                <div 
                  className="mb-2.5 flex items-start space-x-2 rounded-lg border border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-teal-50 p-2 shadow-lg shadow-emerald-500/10"
                  style={{ animation: 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
                  role="alert"
                >
                  <div className="rounded-md bg-emerald-100 p-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-semibold text-emerald-900">{success}</p>
                  </div>
                </div>
              )}
            
              <form onSubmit={handleSubmit} className="space-y-2.5">
                {/* Username Input - Extra Compact */}
                <div className="group">
                  <label htmlFor="username" className="mb-1 flex items-center gap-1 text-[10px] font-bold text-slate-800">
                    <User size={11} className="text-orange-600" />
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="w-full rounded-lg border-2 border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-sm text-slate-900 font-medium transition-all duration-300 placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    required
                    autoComplete="username"
                  />
                </div>

                {/* Email Input - Extra Compact */}
                <div className="group">
                  <label htmlFor="email" className="mb-1 flex items-center gap-1 text-[10px] font-bold text-slate-800">
                    <Mail size={11} className="text-orange-600" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full rounded-lg border-2 border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-sm text-slate-900 font-medium transition-all duration-300 placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    autoComplete="email"
                  />
                </div>
                
                {/* Password Input - Extra Compact */}
                <div className="group">
                  <label htmlFor="password" className="mb-1 flex items-center gap-1 text-[10px] font-bold text-slate-800">
                    <KeyRound size={11} className="text-orange-600" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="w-full rounded-lg border-2 border-slate-200 bg-slate-50/50 px-2.5 py-1.5 pr-9 text-sm text-slate-900 font-medium transition-all duration-300 placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-all duration-200 hover:bg-orange-50 hover:text-orange-600 active:scale-95"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={15} strokeWidth={2.5} /> : <Eye size={15} strokeWidth={2.5} />}
                    </button>
                  </div>
                  <p className="mt-0.5 text-[8px] text-slate-500">
                    Min 8 chars: uppercase, lowercase, number, special char
                  </p>
                </div>

                {/* Confirm Password Input - Extra Compact */}
                <div className="group">
                  <label htmlFor="confirmPassword" className="mb-1 flex items-center gap-1 text-[10px] font-bold text-slate-800">
                    <Lock size={11} className="text-orange-600" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      className="w-full rounded-lg border-2 border-slate-200 bg-slate-50/50 px-2.5 py-1.5 pr-9 text-sm text-slate-900 font-medium transition-all duration-300 placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-all duration-200 hover:bg-orange-50 hover:text-orange-600 active:scale-95"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={15} strokeWidth={2.5} /> : <Eye size={15} strokeWidth={2.5} />}
                    </button>
                  </div>
                </div>
                
                {/* Submit Button - Extra Compact */}
                <button
                  type="submit"
                  disabled={loading || !!success}
                  className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-size-200 px-4 py-2 font-bold text-white shadow-lg shadow-orange-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-orange-500/40 hover:bg-pos-100 focus:outline-none focus:ring-4 focus:ring-orange-500/50 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
                  
                  <span className="relative z-10 flex items-center justify-center gap-2 text-sm">
                    {loading ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : success ? (
                      <>
                        <CheckCircle2 size={16} strokeWidth={2.5} />
                        Success!
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} strokeWidth={2.5} />
                        Add Admin
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Email Notification Info - Extra Compact */}
              <div className="mt-3 rounded-lg border border-orange-200/60 bg-gradient-to-br from-orange-50/80 to-red-50/40 p-2">
                <div className="flex items-start space-x-1.5">
                  <div className="rounded-md bg-gradient-to-br from-orange-100 to-red-100 p-1">
                    <Mail className="h-3 w-3 text-orange-600" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[10px] font-bold text-orange-900">Email Notification</h4>
                    <p className="mt-0.5 text-[8px] leading-relaxed text-orange-700/90">
                      System admin notified on account creation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom accent line */}
            <div className="h-0.5 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAdminModal;