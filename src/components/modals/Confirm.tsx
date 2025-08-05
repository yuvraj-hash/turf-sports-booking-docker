"use client"

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { verifyUserEmail } from "../../utils/authService" // Changed import to authService
import { AlertCircle, CheckCircle } from "lucide-react"

const ConfirmEmail: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get("token")

    if (!token) {
      setMessage("Invalid or missing verification token.")
      setIsLoading(false)
      return
    }

    const verifyEmail = async () => {
      try {
        await verifyUserEmail(token)
        setMessage("Email verified successfully! Redirecting to login...")
        setTimeout(() => navigate("/"), 2000)
      } catch (error: any) {
        setMessage(error.message || "Failed to verify email. Please try again or contact support.")
      } finally {
        setIsLoading(false)
      }
    }

    verifyEmail()
  }, [location, navigate])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-gray-100">
        <div className="w-full max-w-md transform overflow-hidden rounded-lg bg-white text-center shadow-xl p-6">
          <svg
            className="animate-spin mx-auto h-10 w-10 text-[#ff5e14]"
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
          <p className="mt-2 text-gray-600">Verifying your email...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md transform overflow-hidden rounded-lg bg-white text-center shadow-xl p-6">
        {message && (
          <div className="mb-4">
            {message.includes("successfully") ? (
              <div className="flex items-center justify-center text-green-600">
                <CheckCircle className="w-6 h-6 mr-2" />
                <p>{message}</p>
              </div>
            ) : (
              <div className="flex items-center justify-center text-red-600">
                <AlertCircle className="w-6 h-6 mr-2" />
                <p>{message}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ConfirmEmail