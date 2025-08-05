"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { X, Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react"
import { loginUser, persistSession, loginWithOAuth } from "../../utils/auth-utils"

type LoginModalProps = {
  isOpen: boolean
  onClose: () => void
  onLogin: (userData: { name: string; email: string; rememberMe: boolean }) => void
  onRegisterClick: () => void
  onForgotPasswordClick: () => void
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegisterClick,
  onForgotPasswordClick,
}) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const location = useLocation()
  const navigate = useNavigate()

  // Check for errors from OAuth callback
  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error)
    }
  }, [location.state])

  if (!isOpen) return null

  // Toast message for Google sign-in
  const Toast = () => (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#ff5e14] rounded-lg shadow-lg text-[#2f3241] text-sm font-medium animate-fade-in">
        <svg className="w-5 h-5 text-[#ff5e14]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9444 17.5885 17.2268 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"/>
          <path d="M12.24 24.0008C15.4764 24.0008 18.2058 22.9382 20.19 21.1039L16.323 18.1056C15.2527 18.8375 13.862 19.252 12.24 19.252C9.11336 19.252 6.45946 17.1399 5.50693 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.24 24.0008Z" fill="#34A853"/>
          <path d="M5.50693 14.3003C5.02266 12.8149 5.02266 11.2297 5.50693 9.74438V6.65356H1.5166C-0.18501 10.0059 -0.18501 14.0387 1.5166 17.3912L5.50693 14.3003Z" fill="#FBBC05"/>
          <path d="M12.24 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2735 3.11862C18.2236 1.1893 15.5278 0.047607 12.24 0.047607C7.7029 0.047607 3.55371 2.60485 1.5166 6.65356L5.50693 9.74438C6.45946 6.90475 9.11336 4.74966 12.24 4.74966Z" fill="#EA4335"/>
        </svg>
        Why type? <span className="font-semibold">Sign in instantly with Google</span>
      </div>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (!email || !password) {
      setError("Please enter both email and password.")
      setLoading(false)
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.")
      setLoading(false)
      return
    }

    try {
      const user = await loginUser(email, password)
      await persistSession(rememberMe)

      setSuccess("Login successful! Welcome back.")

      setTimeout(() => {
        onLogin({
          name: user.full_name,
          email: user.email,
          rememberMe,
        })
        navigate("/dashboard")
        setEmail("")
        setPassword("")
        setRememberMe(false)
        setSuccess("")
        setError("")
      }, 1000)
    } catch (error: any) {
      setError(error.message || "Login failed. Please try again.")
    }

    setLoading(false)
  }

  const handleOAuthLogin = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const user = await loginWithOAuth('google')
      await persistSession(rememberMe)

      setSuccess("Successfully logged in with Google!")

      setTimeout(() => {
        onLogin({
          name: user.full_name,
          email: user.email || '',
          rememberMe,
        })
        setEmail("")
        setPassword("")
        setRememberMe(false)
        setSuccess("")
        setError("")
      }, 1000)
    } catch (error: any) {
      setError(error.message || "Failed to login with Google. Please try again.")
    }

    setLoading(false)
  }

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4 text-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

          <div className="w-full max-w-md transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
            <div className="flex justify-between items-center border-b px-6 py-4 bg-gradient-to-r from-[#2f3241] to-[#394153]">
              <div className="flex items-center">
                <Lock className="text-[#ff5e14] mr-2" size={20} />
                <h3 className="text-lg font-medium text-white">Welcome Back</h3>
              </div>
              <button type="button" className="text-white hover:text-gray-300" onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
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
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff5e14] focus:border-[#ff5e14]"
                      placeholder="Enter your password"
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

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-[#ff5e14] focus:ring-[#ff5e14] border-gray-300 rounded"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-[#ff5e14] hover:text-[#e54d00]"
                    onClick={onForgotPasswordClick}
                  >
                    Forgot password?
                  </button>
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
                      Signing in...
                    </div>
                  ) : success ? (
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Success!
                    </div>
                  ) : (
                    "Sign in"
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
                Sign in with Google
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="text-[#ff5e14] hover:text-[#e54d00] font-medium"
                    onClick={onRegisterClick}
                  >
                    Create account
                  </button>
                </p>
              </div>

              <div className="mt-6 p-3 bg-blue-50 rounded-md border border-blue-200">
                <p className="text-xs text-blue-700 mb-2 font-medium">🔒 Secure Authentication</p>
                <p className="text-xs text-blue-600">
                  Your login is protected with encrypted passwords and secure sessions.
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

export default LoginModal