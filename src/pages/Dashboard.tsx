import React, { useState, useEffect } from "react";

import { User, Calendar, ClipboardList, Star, CreditCard, Gift, MessageCircle, Camera, Eye, EyeOff, Check, X } from "lucide-react";
import { getUserSession } from "../utils/auth-utils"; // Adjusted path if needed

// Sidebar modules for dashboard navigation
const modules = [
  { key: "profile", label: "Profile Management", icon: <User size={18} className="mr-2" /> },
  { key: "booking", label: "Booking History", icon: <ClipboardList size={18} className="mr-2" /> },
  { key: "event", label: "Event Activity", icon: <Calendar size={18} className="mr-2" /> },
  { key: "membership", label: "Membership Details", icon: <Star size={18} className="mr-2" /> },
  { key: "loyalty", label: "Loyalty Pass", icon: <Gift size={18} className="mr-2" /> },
  { key: "payment", label: "Payment & Refund", icon: <CreditCard size={18} className="mr-2" /> },
  { key: "feedback", label: "Feedback & Ratings", icon: <MessageCircle size={18} className="mr-2" /> },
];

// Dummy sports list for selection
const sportsList = [
  "Cricket", "Football", "Basketball", "Tennis", "Badminton", "Swimming", "Gym", "Athletics"
];

const Dashboard: React.FC = () => {
  const [activeModule, setActiveModule] = useState("profile");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Profile states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("male");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  
  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Message states
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  // Form validation states
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isEditing, setIsEditing] = useState(false);

  // Avatar upload handler
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage("File size should be less than 5MB");
        setMessageType("error");
        setTimeout(() => setMessage(""), 3000);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Sports selection handler
  const handleSportSelect = (sport: string) => {
    if (selectedSports.includes(sport)) {
      setSelectedSports(selectedSports.filter(s => s !== sport));
    } else if (selectedSports.length < 3) {
      setSelectedSports([...selectedSports, sport]);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) newErrors.phone = "Phone number is invalid";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save profile handler
  const handleSaveProfile = () => {
    if (!validateForm()) {
      setMessage("Please fix the errors below");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    
    // Add API call here
    setMessage("Profile updated successfully!");
    setMessageType("success");
    setTimeout(() => setMessage(""), 3000);
  };

  // Change password handler
  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("Please fill all password fields.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    if (newPassword.length < 8) {
      setMessage("New password must be at least 8 characters long.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    
    // Add API call here
    setMessage("Password changed successfully!");
    setMessageType("success");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setMessage(""), 3000);
  };

  // Reset password handler
  const handleResetPassword = () => {
    // Add API call here
    setMessage("Password reset link sent to your email.");
    setMessageType("success");
    setTimeout(() => setMessage(""), 3000);
  };

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return { strength: 'weak', color: 'bg-red-500' };
    if (password.length < 8) return { strength: 'medium', color: 'bg-yellow-500' };
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)) {
      return { strength: 'strong', color: 'bg-green-500' };
    }
    return { strength: 'good', color: 'bg-blue-500' };
  };

  useEffect(() => {
    // Fetch user session/account details
    const fetchUserSession = async () => {
      const user = await getUserSession();
      if (user) {
        setName(user.name || "");
        setEmail(user.email || "");
        // Use fallback values if phone and gender are not present
        setPhone(user.phone !== undefined ? user.phone.toString() : "");
        setGender(user.gender !== undefined ? user.gender.toString() : "male");
        setAvatar(user.avatar || null);
      }
    };
    fetchUserSession();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className={`${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'} transition-all duration-300 bg-white rounded-2xl shadow-xl border border-gray-200/50 backdrop-blur-sm`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  {!sidebarCollapsed && (
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-[#ff5e14] to-[#ff8c42] bg-clip-text text-transparent">
                      Dashboard
                    </h2>
                  )}
                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="lg:block hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg className={`w-5 h-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                  </button>
                </div>
                
                <nav className="space-y-2">
                  {modules.map((mod) => (
                    <button
                      key={mod.key}
                      className={`flex items-center w-full px-4 py-3 rounded-xl text-left font-medium transition-all duration-200 group ${
                        activeModule === mod.key 
                          ? "bg-gradient-to-r from-[#ff5e14] to-[#ff8c42] text-white shadow-lg shadow-orange-500/25" 
                          : "text-gray-600 hover:bg-gray-50 hover:text-[#ff5e14]"
                      }`}
                      onClick={() => setActiveModule(mod.key)}
                      title={sidebarCollapsed ? mod.label : ''}
                    >
                      <span className={`${activeModule === mod.key ? 'text-white' : 'text-gray-500 group-hover:text-[#ff5e14]'}`}>
                        {mod.icon}
                      </span>
                      {!sidebarCollapsed && (
                        <span className="truncate">{mod.label}</span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-200/50 backdrop-blur-sm">
              <div className="p-6 lg:p-8">
                {activeModule === "profile" && (
                  <div className="space-y-8">
                    {/* Header */}
                    <div className="border-b border-gray-200 pb-6">
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">Profile Management</h3>
                      <p className="text-gray-600">Manage your personal information and preferences</p>
                    </div>

                    {/* Message Alert */}
                    {message && (
                      <div className={`p-4 rounded-xl flex items-center gap-3 ${
                        messageType === "success" 
                          ? "bg-green-50 border border-green-200 text-green-800" 
                          : "bg-red-50 border border-red-200 text-red-800"
                      }`}>
                        {messageType === "success" ? <Check size={20} /> : <X size={20} />}
                        <span className="font-medium">{message}</span>
                      </div>
                    )}

                    {/* Profile Information */}
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-6 lg:p-8 border border-gray-200/50">
                      <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <User size={20} className="text-[#ff5e14]" />
                        Personal Information
                      </h4>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center space-y-4">
                          <div className="relative group">
                            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-gray-100 to-gray-200">
                              <img
                                src={avatar || `https://ui-avatars.com/api/?name=${name || 'User'}&background=ff5e14&color=fff&size=128`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <label 
                              htmlFor="avatar-upload" 
                              className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#ff5e14] to-[#ff8c42] text-white rounded-full p-3 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-110"
                            >
                              <Camera size={16} />
                              <input 
                                id="avatar-upload" 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleAvatarChange} 
                              />
                            </label>
                          </div>
                          <p className="text-sm text-gray-500 text-center">
                            Click the camera icon to upload<br />
                            <span className="text-xs">Max size: 5MB</span>
                          </p>
                        </div>

                        {/* Form Fields */}
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Full Name *</label>
                            <input 
                              type="text" 
                              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 ${
                                errors.name 
                                  ? 'border-red-300 focus:ring-red-500' 
                                  : 'border-gray-200 focus:ring-[#ff5e14] focus:border-[#ff5e14]'
                              }`}
                              placeholder="Enter your full name"
                              value={name} 
                              readOnly
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Email Address *</label>
                            <input 
                              type="email" 
                              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 ${
                                errors.email 
                                  ? 'border-red-300 focus:ring-red-500' 
                                  : 'border-gray-200 focus:ring-[#ff5e14] focus:border-[#ff5e14]'
                              }`}
                              placeholder="Enter your email"
                              value={email} 
                              readOnly
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Phone Number *</label>
                            <input 
                              type="tel" 
                              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 ${
                                errors.phone 
                                  ? 'border-red-300 focus:ring-red-500' 
                                  : 'border-gray-200 focus:ring-[#ff5e14] focus:border-[#ff5e14]'
                              }`}
                              placeholder="Enter your phone number"
                              value={phone} 
                              onChange={e => {
                                setPhone(e.target.value);
                                if (errors.phone) setErrors({...errors, phone: ''});
                              }} 
                              disabled={!isEditing}
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Gender</label>
                            <select 
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff5e14] focus:border-[#ff5e14] transition-all duration-200"
                              value={gender} 
                              onChange={e => setGender(e.target.value)}
                              disabled={!isEditing}
                            >
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Sports Preferences */}
                      <div className="mt-8 pt-8 border-t border-gray-200">
                        <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Star size={18} className="text-[#ff5e14]" />
                          Top 3 Sports Preferences
                        </h5>
                        <p className="text-sm text-gray-600 mb-4">Select up to 3 sports you're most interested in</p>
                        <div className="flex flex-wrap gap-3">
                          {sportsList.map(sport => (
                            <button
                              key={sport}
                              type="button"
                              className={`px-4 py-2 rounded-xl border-2 font-medium transition-all duration-200 ${
                                selectedSports.includes(sport) 
                                  ? "bg-gradient-to-r from-[#ff5e14] to-[#ff8c42] text-white border-[#ff5e14] shadow-lg shadow-orange-500/25 transform scale-105" 
                                  : "bg-white text-gray-600 border-gray-200 hover:border-[#ff5e14] hover:text-[#ff5e14] hover:bg-orange-50"
                              } ${!selectedSports.includes(sport) && selectedSports.length >= 3 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                              onClick={() => handleSportSelect(sport)}
                              disabled={!selectedSports.includes(sport) && selectedSports.length >= 3}
                            >
                              {sport}
                              {selectedSports.includes(sport) && (
                                <Check size={16} className="ml-2 inline" />
                              )}
                            </button>
                          ))}
                        </div>
                        {selectedSports.length > 0 && (
                          <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-200">
                            <p className="text-sm text-orange-800">
                              Selected: <strong>{selectedSports.join(', ')}</strong> ({selectedSports.length}/3)
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Edit Button */}
                      {!isEditing && (
                        <div className="mt-6 flex justify-end">
                          <button type="button" className="px-6 py-2 bg-[#ff5e14] text-white rounded-lg font-semibold shadow hover:bg-[#e04e0e] transition" onClick={() => setIsEditing(true)}>
                            Edit
                          </button>
                        </div>
                      )}
                      {isEditing && (
                        <div className="mt-6 flex justify-end gap-2">
                          <button type="button" className="px-6 py-2 bg-gray-200 text-[#2f3241] rounded-lg font-semibold shadow hover:bg-gray-300 transition" onClick={() => setIsEditing(false)}>
                            Cancel
                          </button>
                          <button type="button" className="px-6 py-2 bg-[#ff5e14] text-white rounded-lg font-semibold shadow hover:bg-[#e04e0e] transition" onClick={handleSaveProfile}>
                            Save Profile
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Password Management */}
                    <div className="bg-gradient-to-br from-gray-50 to-red-50/30 rounded-2xl p-6 lg:p-8 border border-gray-200/50">
                      <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#ff5e14]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Security Settings
                      </h4>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Current Password</label>
                          <div className="relative">
                            <input 
                              type={showCurrentPassword ? "text" : "password"}
                              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff5e14] focus:border-[#ff5e14] transition-all duration-200"
                              placeholder="Enter current password"
                              value={currentPassword} 
                              onChange={e => setCurrentPassword(e.target.value)} 
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">New Password</label>
                          <div className="relative">
                            <input 
                              type={showNewPassword ? "text" : "password"}
                              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff5e14] focus:border-[#ff5e14] transition-all duration-200"
                              placeholder="Enter new password"
                              value={newPassword} 
                              onChange={e => setNewPassword(e.target.value)} 
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          {newPassword && (
                            <div className="mt-2">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrength(newPassword).color}`} 
                                       style={{width: `${Math.min((newPassword.length / 12) * 100, 100)}%`}}></div>
                                </div>
                                <span className="text-xs text-gray-600 capitalize">{getPasswordStrength(newPassword).strength}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Confirm New Password</label>
                          <div className="relative">
                            <input 
                              type={showConfirmPassword ? "text" : "password"}
                              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff5e14] focus:border-[#ff5e14] transition-all duration-200"
                              placeholder="Confirm new password"
                              value={confirmPassword} 
                              onChange={e => setConfirmPassword(e.target.value)} 
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          {confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                          )}
                        </div>

                        <div className="flex flex-col gap-3 lg:justify-end">
                          <button 
                            type="button" 
                            className="px-6 py-3 bg-gradient-to-r from-[#ff5e14] to-[#ff8c42] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#ff5e14] focus:ring-offset-2"
                            onClick={handleChangePassword}
                          >
                            Change Password
                          </button>
                          <button 
                            type="button" 
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                            onClick={handleResetPassword}
                          >
                            Reset Password
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Placeholder for other modules */}
                {activeModule !== "profile" && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🚧</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h3>
                    <p className="text-gray-600">The {modules.find(m => m.key === activeModule)?.label} section is under development.</p>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;