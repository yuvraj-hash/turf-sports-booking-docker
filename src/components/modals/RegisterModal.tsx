"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { X, Eye, EyeOff, User, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react"
import { createUser } from "../../utils/authService"
import { loginWithOAuth } from "../../utils/auth-utils"
import { sendConfirmationEmailWithResend } from "../../lib/supabase"

type RegisterModalProps = {
  isOpen: boolean
  onClose: () => void
  onLoginClick: () => void
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onLoginClick }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const location = useLocation()

  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error)
    }
  }, [location.state])

  if (!isOpen) return null
  // Toast message for Google sign-up
  const Toast = () => (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#ff5e14] rounded-lg shadow-lg text-[#2f3241] text-sm font-medium animate-fade-in">
        <svg className="w-5 h-5 text-[#ff5e14]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9444 17.5885 17.2268 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"/>
          <path d="M12.24 24.0008C15.4764 24.0008 18.2058 22.9382 20.19 21.1039L16.323 18.1056C15.2527 18.8375 13.862 19.252 12.24 19.252C9.11336 19.252 6.45946 17.1399 5.50693 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.24 24.0008Z" fill="#34A853"/>
          <path d="M5.50693 14.3003C5.02266 12.8149 5.02266 11.2297 5.50693 9.74438V6.65356H1.5166C-0.18501 10.0059 -0.18501 14.0387 1.5166 17.3912L5.50693 14.3003Z" fill="#FBBC05"/>
          <path d="M12.24 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2735 3.11862C18.2236 1.1893 15.5278 0.047607 12.24 0.047607C7.7029 0.047607 3.55371 2.60485 1.5166 6.65356L5.50693 9.74438C6.45946 6.90475 9.11336 4.74966 12.24 4.74966Z" fill="#EA4335"/>
        </svg>
        Why type? <span className="font-semibold">Sign up instantly with Google</span>
      </div>
    </div>
  );

  const isPasswordStrong = (password: string) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required")
      setLoading(false)
      return
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters long")
      setLoading(false)
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address")
      setLoading(false)
      return
    }

    if (!isPasswordStrong(password)) {
      setError("Password must be at least 8 characters with uppercase, lowercase, number, and special character")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (!acceptTerms) {
      setError("You must accept the terms and conditions")
      setLoading(false)
      return
    }

    try {
      const { user, verificationToken } = await createUser({
        email: email.toLowerCase().trim(),
        password,
        fullName: name.trim(),
      })

      await sendConfirmationEmailWithResend(email.toLowerCase().trim(), name.trim(), verificationToken, 'confirmation')

      setSuccess("Account created successfully! Please check your email to verify your account.")

      setTimeout(() => {
        setName("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setAcceptTerms(false)
        setSuccess("")
        setError("")
        onLoginClick()
      }, 2000)
    } catch (error: any) {
      console.error("Registration error:", error)
      setError(error.message || "Database error saving new user. Please try again.")
    }

    setLoading(false)
  }

  const handleOAuthLogin = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const user = await loginWithOAuth('google')
      setSuccess("Successfully registered with Google!")

      setTimeout(() => {
        onLoginClick()
        setName("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setAcceptTerms(false)
        setSuccess("")
        setError("")
      }, 1000)
    } catch (error: any) {
      setError(error.message || "Failed to register with Google. Please try again.")
    }

    setLoading(false)
  }

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-[60vh] items-center justify-center p-4 text-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

          <div className="w-full max-w-lg min-h-[300px] transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
            <div className="flex justify-between items-center border-b px-6 py-4 bg-gradient-to-r from-[#2f3241] to-[#394153]">
              <div className="flex items-center">
                <User className="text-[#ff5e14] mr-2" size={20} />
                <h3 className="text-lg font-medium text-white">Join ArenaHub</h3>
              </div>
              <button type="button" className="text-white hover:text-gray-300" onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff5e14] focus:border-[#ff5e14]"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="register-email"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff5e14] focus:border-[#ff5e14]"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="register-password"
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff5e14] focus:border-[#ff5e14]"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirm-password"
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff5e14] focus:border-[#ff5e14]"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="mb-6 flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 text-[#ff5e14] focus:ring-[#ff5e14] border-gray-300 rounded"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    required
                  />
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-600">
                      I accept the Terms and Conditions and Privacy Policy
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !!success}
                  className="w-full bg-[#ff5e14] text-white py-2 px-4 rounded-md hover:bg-[#e54d00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff5e14] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating account...
                    </div>
                  ) : success ? (
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Success!
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>

                {(error || success) && (
                  <div className={`mt-2 text-sm text-center ${error ? 'text-red-700' : 'text-green-700'}`}>
                    {error ? <AlertCircle className="w-4 h-4 inline mr-1" /> : <CheckCircle className="w-4 h-4 inline mr-1" />}
                    <span>{error || success}</span>
                  </div>
                )}
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOAuthLogin}
                disabled={loading || !!success}
                className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff5e14] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9444 17.5885 17.2268 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"/>
                  <path d="M12.24 24.0008C15.4764 24.0008 18.2058 22.9382 20.19 21.1039L16.323 18.1056C15.2527 18.8375 13.862 19.252 12.24 19.252C9.11336 19.252 6.45946 17.1399 5.50693 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.24 24.0008Z" fill="#34A853"/>
                  <path d="M5.50693 14.3003C5.02266 12.8149 5.02266 11.2297 5.50693 9.74438V6.65356H1.5166C-0.18501 10.0059 -0.18501 14.0387 1.5166 17.3912L5.50693 14.3003Z" fill="#FBBC05"/>
                  <path d="M12.24 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2735 3.11862C18.2236 1.1893 15.5278 0.047607 12.24 0.047607C7.7029 0.047607 3.55371 2.60485 1.5166 6.65356L5.50693 9.74438C6.45946 6.90475 9.11336 4.74966 12.24 4.74966Z" fill="#EA4335"/>
                </svg>
                Sign up with Google
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-[#ff5e14] hover:text-[#e54d00] font-medium"
                    onClick={onLoginClick}
                  >
                    Sign in
                  </button>
                </p>
              </div>

              <div className="mt-6 p-3 bg-green-50 rounded-md border border-green-200">
                <p className="text-xs text-green-700 font-medium mb-1">🔒 Secure Registration</p>
                <p className="text-xs text-green-600">
                  Your account is protected with encrypted passwords.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toast />
    </>
  )
}

export default RegisterModal