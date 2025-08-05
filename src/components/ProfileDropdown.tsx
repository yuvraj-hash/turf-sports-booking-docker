"use client"


import React from "react"
import { LogOut, Calendar } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

type ProfileDropdownProps = {
  user: { name: string; email: string; avatar: string }
  onLogout: () => void
  onClose: () => void
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, onLogout, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();


  const handleLogout = () => {
    onLogout();
    onClose();
    navigate("/");
  };

  const handleDashboard = () => {
    onClose();
    if (location.pathname !== "/dashboard") {
      navigate("/dashboard");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-10" onClick={onClose}></div>

      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#ff5e14]"
            />
            <div>
              <p className="font-semibold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Only show Dashboard if not already on dashboard page */}
        {location.pathname !== "/dashboard" && (
          <div className="py-2">
            <button
              onClick={handleDashboard}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              <Calendar size={16} className="mr-3 text-gray-400" />
              Dashboard
            </button>
          </div>
        )}

        <div className="border-t border-gray-200 py-2">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            <LogOut size={16} className="mr-3" />
            Sign out
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileDropdown;