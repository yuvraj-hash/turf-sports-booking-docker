"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Eye, EyeOff, Shield, Lock, User, KeyRound, CheckCircle2, AlertCircle, Sparkles, ShieldCheck } from "lucide-react"

type AdminLoginModalProps = {
  isOpen: boolean
  onClose: () => void
  onLogin: (userData: { username: string; email: string; rememberMe: boolean }) => void
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
        rememberMe: formData.rememberMe,
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

        {/* Modal Container with Glass Effect - Extra Compact */}
        <div 
          className={`relative w-full max-w-[380px] transform transition-all duration-500 ${
            isOpen ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-login-title"
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
                        <ShieldCheck className="text-white" size={20} strokeWidth={2.5} />
                      </div>
                    </div>
                    
                    <div>
                      <h3 id="admin-login-title" className="text-base font-bold text-white tracking-tight flex items-center gap-1">
                        Admin Access
                        <Sparkles className="text-orange-300" size={14} />
                      </h3>
                      <p className="text-[10px] text-orange-200/90 mt-0.5 font-medium">Secure Portal</p>
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
                  <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-white/90 font-medium">Encrypted</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <Lock className="text-orange-300" size={10} />
                  <span className="text-white/90 font-medium">SSL</span>
                </div>
              </div>
            </div>

            {/* Form Content - Extra Compact */}
            <div className="relative p-5">
              {/* Error Alert - Extra Compact */}
              {error && (
                <div 
                  className="mb-3 flex items-start space-x-2 rounded-lg border border-red-200/50 bg-gradient-to-br from-red-50 to-rose-50 p-2.5 shadow-lg shadow-red-500/10"
                  style={{ animation: 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
                  role="alert"
                >
                  <div className="rounded-md bg-red-100 p-1">
                    <AlertCircle className="h-3.5 w-3.5 text-red-600" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-semibold text-red-900">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Alert - Extra Compact */}
              {emailSent && (
                <div 
                  className="mb-3 flex items-start space-x-2 rounded-lg border border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-teal-50 p-2.5 shadow-lg shadow-emerald-500/10"
                  style={{ animation: 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
                  role="alert"
                >
                  <div className="rounded-md bg-emerald-100 p-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-semibold text-emerald-900">Email sent to yuva.tvm2001@gmail.com</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Username/Email Input - Extra Compact */}
                <div className="group">
                  <label htmlFor="usernameOrEmail" className="mb-1 flex items-center gap-1 text-[11px] font-bold text-slate-800">
                    <User size={12} className="text-orange-600" />
                    Username or Email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="usernameOrEmail"
                      className="w-full rounded-lg border-2 border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 font-medium transition-all duration-300 placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10"
                      placeholder="Enter admin credentials"
                      value={formData.usernameOrEmail}
                      onChange={(e) => setFormData((prev) => ({ ...prev, usernameOrEmail: e.target.value }))}
                      required
                      autoComplete="username"
                    />
                  </div>
                </div>

                {/* Password Input - Extra Compact */}
                <div className="group">
                  <label htmlFor="password" className="mb-1 flex items-center gap-1 text-[11px] font-bold text-slate-800">
                    <KeyRound size={12} className="text-orange-600" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="w-full rounded-lg border-2 border-slate-200 bg-slate-50/50 px-3 py-2 pr-10 text-sm text-slate-900 font-medium transition-all duration-300 placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10"
                      placeholder="Enter secure password"
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-all duration-200 hover:bg-orange-50 hover:text-orange-600 active:scale-95"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} strokeWidth={2.5} /> : <Eye size={16} strokeWidth={2.5} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password - Extra Compact */}
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center space-x-1.5 group">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-3.5 w-3.5 cursor-pointer rounded border-2 border-slate-300 text-orange-600 transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 checked:border-orange-600 checked:bg-orange-600"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData((prev) => ({ ...prev, rememberMe: e.target.checked }))}
                    />
                    <span className="text-[11px] font-semibold text-slate-700">Remember me</span>
                  </label>
                  
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={emailLoading}
                    className="text-[11px] font-bold text-orange-600 transition-all duration-200 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {emailLoading ? (
                      <span className="flex items-center gap-1">
                        <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      "Forgot password?"
                    )}
                  </button>
                </div>

                {/* Submit Button - Extra Compact */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-size-200 px-4 py-2.5 font-bold text-white shadow-lg shadow-orange-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-orange-500/40 hover:bg-pos-100 focus:outline-none focus:ring-4 focus:ring-orange-500/50 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
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
                        <Shield size={16} strokeWidth={2.5} />
                        Secure Sign In
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Security Notice - Extra Compact */}
              <div className="mt-4 rounded-lg border border-orange-200/60 bg-gradient-to-br from-orange-50/80 to-red-50/40 p-2.5">
                <div className="flex items-start space-x-2">
                  <div className="rounded-md bg-gradient-to-br from-orange-100 to-red-100 p-1.5">
                    <Lock className="h-3.5 w-3.5 text-orange-600" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[11px] font-bold text-orange-900 flex items-center gap-1">
                      Enterprise Security
                      <span className="inline-flex items-center px-1 py-0.5 rounded text-[8px] font-bold bg-orange-600 text-white">256-bit</span>
                    </h4>
                    <p className="mt-1 text-[9px] leading-relaxed text-orange-700/90">
                      AES-256 encryption with real-time threat monitoring.
                    </p>
                  </div>
                </div>
              </div>

              {/* Add Admin Link - Extra Compact */}
              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={onAddAdmin}
                  className="text-[11px] font-semibold text-slate-600 transition-all duration-200 hover:text-orange-600"
                >
                  Need to add new admin? <span className="text-orange-600">→</span>
                </button>
              </div>
            </div>

            {/* Bottom accent line */}
            <div className="h-0.5 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginModal