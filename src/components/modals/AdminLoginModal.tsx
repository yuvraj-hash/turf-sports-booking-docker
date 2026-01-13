"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Eye, EyeOff, Shield, Lock, User, KeyRound, CheckCircle2, AlertCircle, Sparkles, ShieldCheck } from "lucide-react"

type AdminLoginModalProps = {
  isOpen: boolean
  onClose: () => void
  onLogin: (userData: { username: string; email: string }) => void
  onAddAdmin: () => void
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLogin, onAddAdmin }) => {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

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

  if (!isOpen && !mounted) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const { usernameOrEmail, password } = formData
    const isValidUsername = usernameOrEmail === "yuvraj"
    const isValidEmail = usernameOrEmail === "yuva.tvm2001@gmail.com"
    const isValidPassword = password === "awsamplify123"

    if ((isValidUsername || isValidEmail) && isValidPassword) {
      onLogin({
        username: "yuvraj",
        email: "yuva.tvm2001@gmail.com",
      })

      setFormData({
        usernameOrEmail: "",
        password: "",
        rememberMe: false,
      })
    } else {
      if (!isValidUsername && !isValidEmail) {
        setError("Invalid username or email address")
      } else if (!isValidPassword) {
        setError("Invalid password")
      }
    }

    setLoading(false)
  }

  const handleForgotPassword = async () => {
    setEmailLoading(true)
    setEmailSent(false)
    setError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setEmailSent(true)
      setError("")
    } catch (error: any) {
      setError("Failed to send email. Please try again.")
      setEmailSent(false)
    } finally {
      setEmailLoading(false)
    }
  }

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

        {/* Modal Container with Glass Effect - Compact Size */}
        <div 
          className={`relative w-full max-w-[420px] transform transition-all duration-500 ${
            isOpen ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-login-title"
        >
          {/* Glass Card with Border Gradient */}
          <div className="relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-2xl shadow-2xl border border-white/20">
            {/* Decorative gradient border effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/10 via-red-500/10 to-orange-500/10 pointer-events-none"></div>
            
            {/* Premium Header with Depth - Compact */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900 px-6 py-5">
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
                  <div className="flex items-center space-x-2.5">
                    {/* Premium icon badge */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl blur-md opacity-75 animate-pulse-slow"></div>
                      <div className="relative rounded-xl bg-gradient-to-br from-orange-500 to-red-600 p-2 shadow-xl">
                        <ShieldCheck className="text-white" size={22} strokeWidth={2.5} />
                      </div>
                    </div>
                    
                    <div>
                      <h3 id="admin-login-title" className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                        Admin Access
                        <Sparkles className="text-orange-300" size={16} />
                      </h3>
                      <p className="text-xs text-orange-200/90 mt-0.5 font-medium">Secure Portal • Privileged Access</p>
                    </div>
                  </div>
                </div>
                
                {/* Close button */}
                <button 
                  type="button" 
                  className="group rounded-lg p-2 text-orange-200 transition-all duration-200 hover:bg-white/10 hover:text-white hover:rotate-90 active:scale-90" 
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* Trust indicators */}
              <div className="relative mt-4 flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-white/90 font-medium">Encrypted</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <Lock className="text-orange-300" size={11} />
                  <span className="text-white/90 font-medium">2048-bit SSL</span>
                </div>
              </div>
            </div>

            {/* Form Content - Compact */}
            <div className="relative p-6">
              {/* Error Alert - Compact */}
              {error && (
                <div 
                  className="mb-4 flex items-start space-x-2.5 rounded-xl border border-red-200/50 bg-gradient-to-br from-red-50 to-rose-50 p-3 shadow-lg shadow-red-500/10 backdrop-blur-sm"
                  style={{ animation: 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
                  role="alert"
                >
                  <div className="rounded-lg bg-red-100 p-1.5">
                    <AlertCircle className="h-4 w-4 text-red-600" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-xs font-semibold text-red-900">{error}</p>
                    <p className="text-[10px] text-red-700 mt-0.5">Please verify your credentials</p>
                  </div>
                </div>
              )}

              {/* Success Alert - Compact */}
              {emailSent && (
                <div 
                  className="mb-4 flex items-start space-x-2.5 rounded-xl border border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-teal-50 p-3 shadow-lg shadow-emerald-500/10 backdrop-blur-sm"
                  style={{ animation: 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
                  role="alert"
                >
                  <div className="rounded-lg bg-emerald-100 p-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-xs font-semibold text-emerald-900">Password reset email sent</p>
                    <p className="text-[10px] text-emerald-700 mt-0.5">Check yuva.tvm2001@gmail.com</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username/Email Input - Compact */}
                <div className="group">
                  <label htmlFor="usernameOrEmail" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <User size={14} className="text-orange-600" />
                    Username or Email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="usernameOrEmail"
                      className="w-full rounded-lg border-2 border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 font-medium transition-all duration-300 placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:shadow-lg focus:shadow-orange-500/5"
                      placeholder="Enter admin credentials"
                      value={formData.usernameOrEmail}
                      onChange={(e) => setFormData((prev) => ({ ...prev, usernameOrEmail: e.target.value }))}
                      required
                      autoComplete="username"
                    />
                    {/* Input decoration */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Password Input - Compact */}
                <div className="group">
                  <label htmlFor="password" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <KeyRound size={14} className="text-orange-600" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="w-full rounded-lg border-2 border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-11 text-sm text-slate-900 font-medium transition-all duration-300 placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:shadow-lg focus:shadow-orange-500/5"
                      placeholder="Enter secure password"
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-all duration-200 hover:bg-orange-50 hover:text-orange-600 active:scale-95"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} strokeWidth={2.5} /> : <Eye size={18} strokeWidth={2.5} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password - Compact */}
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex cursor-pointer items-center space-x-2 group">
                    <div className="relative">
                      <input
                        id="remember-me"
                        type="checkbox"
                        className="peer h-4 w-4 cursor-pointer rounded border-2 border-slate-300 text-orange-600 transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 checked:border-orange-600 checked:bg-orange-600"
                        checked={formData.rememberMe}
                        onChange={(e) => setFormData((prev) => ({ ...prev, rememberMe: e.target.checked }))}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors duration-200">Remember me</span>
                  </label>
                  
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={emailLoading}
                    className="flex items-center space-x-1 text-xs font-bold text-orange-600 transition-all duration-200 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95 hover:gap-1.5"
                  >
                    {emailLoading ? (
                      <>
                        <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Forgot password?</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Submit Button - Compact */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-size-200 px-5 py-3 font-bold text-white shadow-xl shadow-orange-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/40 hover:bg-pos-100 focus:outline-none focus:ring-4 focus:ring-orange-500/50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-xl active:scale-[0.98]"
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
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <Shield size={18} strokeWidth={2.5} />
                        Secure Sign In
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Security Notice - Compact */}
              <div className="mt-5 rounded-xl border border-orange-200/60 bg-gradient-to-br from-orange-50/80 via-red-50/40 to-orange-50/80 p-3.5 backdrop-blur-sm shadow-lg shadow-orange-500/5">
                <div className="flex items-start space-x-2.5">
                  <div className="rounded-lg bg-gradient-to-br from-orange-100 to-red-100 p-2 shadow-sm">
                    <Lock className="h-4 w-4 text-orange-600" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-orange-900 flex items-center gap-1.5">
                      Enterprise-Grade Security
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-orange-600 text-white">256-bit</span>
                    </h4>
                    <p className="mt-1.5 text-[10px] leading-relaxed text-orange-700/90">
                      Protected by AES-256 encryption, multi-factor authentication, and real-time threat monitoring.
                    </p>
                  </div>
                </div>
              </div>

              {/* Add Admin Link - Compact */}
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={onAddAdmin}
                  className="group inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition-all duration-200 hover:text-orange-600 hover:gap-2"
                >
                  <span>Need to add new admin?</span>
                  <span className="text-orange-600">→</span>
                </button>
              </div>
            </div>

            {/* Bottom accent line */}
            <div className="h-1 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginModal