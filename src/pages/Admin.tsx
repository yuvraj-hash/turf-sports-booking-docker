"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Users,
  Calendar,
  LogOut,
  Search,
  Shield,
  Plus,
  Clock,
  XCircle,
  Edit,
  Trash2,
  BarChart3,
  TrendingUp,
} from "lucide-react"
import AdminLoginModal from "../components/modals/AdminLoginModal"
import AddAdminModal from "../components/modals/AddAdminModal"
import { getBookings, getRegistrations, getNewsletterSubscribers, type Booking, type Registration, type NewsletterSubscriber } from "../lib/supabase"

const Admin: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("bookings")
  const [activeScheduleTab, setActiveScheduleTab] = useState("events")
  const [bookingSubTab, setBookingSubTab] = useState("sports")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showAddAdminModal, setShowAddAdminModal] = useState(false)
  const [adminData, setAdminData] = useState<{ username: string; email: string } | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [showEventForm, setShowEventForm] = useState(false)
  const [showSportForm, setShowSportForm] = useState(false)
  const [showBlockForm, setShowBlockForm] = useState(false)
  const [editEvent, setEditEvent] = useState<any | null>(null)
  const [editSport, setEditSport] = useState<any | null>(null)
  const [editBlock, setEditBlock] = useState<any | null>(null)

  // Loading states
  const [isLoadingBookings, setIsLoadingBookings] = useState(true)
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(true)
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(true)

  // Form states
  const [eventForm, setEventForm] = useState({
    name: "",
    date: "",
    time: "",
    venue: "chennai",
    capacity: "",
    notes: "",
  })

  const [sportForm, setSportForm] = useState({
    sport: "",
    date: "",
    timeSlot: "",
    venue: "chennai",
    coach: "",
    maxParticipants: "",
    notes: "",
  })

  const [blockForm, setBlockForm] = useState({
    date: "",
    timeSlot: "",
    venue: "chennai",
    reason: "",
    description: "",
  })

  // Real data from Supabase - Bookings (Sports + Events)
  const [allBookings, setAllBookings] = useState<Booking[]>([])
  const [sportsBookings, setSportsBookings] = useState<Booking[]>([])
  const [eventBookings, setEventBookings] = useState<Booking[]>([])

  // Real data from Supabase - Event Registrations
  const [eventRegistrations, setEventRegistrations] = useState<Registration[]>([])

  // Real data from Supabase - Newsletter Subscribers
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])

  // Mock scheduled events and sports
  const [scheduledEvents, setScheduledEvents] = useState([
    {
      id: 1,
      name: "Corporate Cricket Tournament",
      date: "2025-03-20",
      time: "09:00-18:00",
      venue: "Chennai Central",
      capacity: 100,
      status: "active",
    },
    {
      id: 2,
      name: "Badminton Championship",
      date: "2025-03-25",
      time: "10:00-17:00",
      venue: "Hyderabad",
      capacity: 50,
      status: "active",
    },
  ])

  const [scheduledSports, setScheduledSports] = useState([
    {
      id: 1,
      sport: "Football",
      date: "2025-03-15",
      timeSlot: "14:00-16:00",
      venue: "Chennai Central",
      coach: "Ravi Kumar",
      maxParticipants: 22,
      status: "active",
    },
    {
      id: 2,
      sport: "Basketball",
      date: "2025-03-16",
      timeSlot: "18:00-20:00",
      venue: "Hyderabad",
      coach: "Priya Singh",
      maxParticipants: 10,
      status: "active",
    },
  ])

  const [blockedSlots, setBlockedSlots] = useState([
    {
      id: 1,
      date: "2025-03-18",
      timeSlot: "10:00-12:00",
      venue: "Chennai Central",
      reason: "Maintenance",
      description: "Court maintenance and cleaning",
    },
    {
      id: 2,
      date: "2025-03-19",
      timeSlot: "14:00-16:00",
      venue: "Hyderabad",
      reason: "Weather",
      description: "Heavy rain expected",
    },
  ])

  const timeSlots = [
    "08:00-10:00",
    "10:00-12:00",
    "12:00-14:00",
    "14:00-16:00",
    "16:00-18:00",
    "18:00-20:00",
    "20:00-21:00",
  ]

  const sports = ["Football", "Cricket", "Basketball", "Badminton", "Tennis", "Gym"]
  const venues = [
    { value: "chennai", label: "Chennai Central" },
    { value: "hyderabad", label: "Hyderabad Jubilee Hills" },
  ]

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = () => {
      const sessionData = localStorage.getItem("adminSession") || sessionStorage.getItem("adminSession")
      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData)
          setAdminData({
            username: parsed.username,
            email: parsed.email,
          })
          setIsAuthenticated(true)
        } catch (error) {
          console.error("Invalid session data")
          clearSession()
        }
      } else {
        setShowLoginModal(true)
      }
    }

    checkSession()
  }, [])

  // Fetch real bookings, registrations, and subscribers from Supabase
  useEffect(() => {
    const fetchData = async () => {  
      if (!isAuthenticated) {
        console.log('⚠️ Not authenticated, skipping data fetch');
        return;
      }
      
      console.log('🔄 Starting data fetch...');
      
      try {
        // Fetch bookings
        setIsLoadingBookings(true);
        console.log('📡 Fetching bookings from Supabase...');
        const bookingsData = await getBookings();
        console.log('✅ Bookings fetched:', bookingsData.length);
        console.log('📋 Sample booking data:', bookingsData[0]);
        setAllBookings(bookingsData);
        
        // Separate bookings by type (sports vs events)
        const sports = bookingsData.filter(b => b.booking_type === 'sports');
        const events = bookingsData.filter(b => b.booking_type === 'events');
        console.log('⚽ Sports bookings:', sports.length);
        console.log('🎪 Event bookings:', events.length);
        
        // Log all booking dates to see what's in the database
        if (bookingsData.length > 0) {
          console.log('📅 All booking dates in database:');
          bookingsData.forEach((b, index) => {
            console.log(`  ${index + 1}. ${b.sport} - Date: ${b.date} (Type: ${b.booking_type})`);
          });
        } else {
          console.warn('⚠️ No bookings found in database!');
        }
        
        setSportsBookings(sports);
        setEventBookings(events);
        setIsLoadingBookings(false);

        // Fetch registrations
        setIsLoadingRegistrations(true);
        const registrationsData = await getRegistrations();
        console.log('✅ Registrations fetched:', registrationsData.length);
        setEventRegistrations(registrationsData);
        setIsLoadingRegistrations(false);

        // Fetch newsletter subscribers
        setIsLoadingSubscribers(true);
        const subscribersData = await getNewsletterSubscribers();
        console.log('✅ Subscribers fetched:', subscribersData.length);
        setSubscribers(subscribersData);
        setIsLoadingSubscribers(false);
        
        console.log('✅ All data fetched successfully!');
      } catch (error) {
        console.error('❌ Error fetching data:', error);
        setIsLoadingBookings(false);
        setIsLoadingRegistrations(false);
        setIsLoadingSubscribers(false);
      }
    };

    fetchData();
  }, [isAuthenticated])

  const clearSession = () => {
    localStorage.removeItem("adminSession")
    sessionStorage.removeItem("adminSession")
    setIsAuthenticated(false)
    setAdminData(null)
  }

  const handleLogin = (userData: { username: string; email: string; rememberMe: boolean }) => {
    setAdminData({ username: userData.username, email: userData.email })
    setIsAuthenticated(true)
    setShowLoginModal(false)
    
    // Store session data
    const sessionData = JSON.stringify({
      username: userData.username,
      email: userData.email,
    })
    if (userData.rememberMe) {
      localStorage.setItem("adminSession", sessionData)
    } else {
      sessionStorage.setItem("adminSession", sessionData)
    }
  }

  const handleAddAdmin = (newAdminData: { username: string; email: string; password: string }) => {
    alert(`New admin "${newAdminData.username}" has been successfully added!`)
    setShowAddAdminModal(false)
  }

  const handleLogout = () => {
    clearSession()
    navigate("/")
  }

  // Edit and Delete Handlers
  const handleEditEvent = (event: any) => {
    setEditEvent(event)
    setEventForm({
      name: event.name,
      date: event.date,
      time: event.time,
      venue: venues.find((v) => v.label === event.venue)?.value || "chennai",
      capacity: event.capacity.toString(),
      notes: event.notes || "",
    })
    setShowEventForm(true)
  }

  const handleDeleteEvent = (id: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setScheduledEvents(scheduledEvents.filter((event) => event.id !== id))
      alert("Event deleted successfully!")
      // TODO: Send delete request to backend API
      // await fetch(`/api/scheduled-events/${id}`, { method: 'DELETE' });
    }
  }

  const handleEditSport = (sport: any) => {
    setEditSport(sport)
    setSportForm({
      sport: sport.sport,
      date: sport.date,
      timeSlot: sport.timeSlot,
      venue: venues.find((v) => v.label === sport.venue)?.value || "chennai",
      coach: sport.coach,
      maxParticipants: sport.maxParticipants.toString(),
      notes: sport.notes || "",
    })
    setShowSportForm(true)
  }

  const handleDeleteSport = (id: number) => {
    if (confirm("Are you sure you want to delete this sport session?")) {
      setScheduledSports(scheduledSports.filter((sport) => sport.id !== id))
      alert("Sport session deleted successfully!")
      // TODO: Send delete request to backend API
      // await fetch(`/api/scheduled-sports/${id}`, { method: 'DELETE' });
    }
  }

  const handleEditBlock = (block: any) => {
    setEditBlock(block)
    setBlockForm({
      date: block.date,
      timeSlot: block.timeSlot,
      venue: venues.find((v) => v.label === block.venue)?.value || "chennai",
      reason: block.reason,
      description: block.description,
    })
    setShowBlockForm(true)
  }

  const handleDeleteBlock = (id: number) => {
    if (confirm("Are you sure you want to delete this blocked slot?")) {
      setBlockedSlots(blockedSlots.filter((slot) => slot.id !== id))
      alert("Blocked slot deleted successfully!")
      // TODO: Send delete request to backend API
      // await fetch(`/api/blocked-slots/${id}`, { method: 'DELETE' });
    }
  }

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const eventData = {
      id: editEvent ? editEvent.id : scheduledEvents.length + 1,
      name: eventForm.name,
      date: eventForm.date,
      time: eventForm.time,
      venue: venues.find((v) => v.value === eventForm.venue)?.label || eventForm.venue,
      capacity: Number.parseInt(eventForm.capacity),
      status: editEvent ? editEvent.status : "active",
      notes: eventForm.notes,
    }
    if (editEvent) {
      setScheduledEvents(scheduledEvents.map((event) => (event.id === editEvent.id ? eventData : event)))
      alert("Event updated successfully!")
      // TODO: Send update request to backend API
      // await fetch(`/api/scheduled-events/${editEvent.id}`, { method: 'PUT', body: JSON.stringify(eventData) });
    } else {
      setScheduledEvents([...scheduledEvents, eventData])
      alert("Event scheduled successfully!")
      // TODO: Send new event to backend API
      // await fetch('/api/scheduled-events', { method: 'POST', body: JSON.stringify(eventData) });
    }
    setEventForm({ name: "", date: "", time: "", venue: "chennai", capacity: "", notes: "" })
    setShowEventForm(false)
    setEditEvent(null)
  }

  const handleSportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const sportData = {
      id: editSport ? editSport.id : scheduledSports.length + 1,
      sport: sportForm.sport,
      date: sportForm.date,
      timeSlot: sportForm.timeSlot,
      venue: venues.find((v) => v.value === sportForm.venue)?.label || sportForm.venue,
      coach: sportForm.coach,
      maxParticipants: Number.parseInt(sportForm.maxParticipants),
      status: editSport ? editSport.status : "active",
      notes: sportForm.notes,
    }
    if (editSport) {
      setScheduledSports(scheduledSports.map((sport) => (sport.id === editSport.id ? sportData : sport)))
      alert("Sport session updated successfully!")
      // TODO: Send update request to backend API
      // await fetch(`/api/scheduled-sports/${editSport.id}`, { method: 'PUT', body: JSON.stringify(sportData) });
    } else {
      setScheduledSports([...scheduledSports, sportData])
      alert("Sport session scheduled successfully!")
      // TODO: Send new sport session to backend API
      // await fetch('/api/scheduled-sports', { method: 'POST', body: JSON.stringify(sportData) });
    }
    setSportForm({ sport: "", date: "", timeSlot: "", venue: "chennai", coach: "", maxParticipants: "", notes: "" })
    setShowSportForm(false)
    setEditSport(null)
  }

  const handleBlockSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const blockData = {
      id: editBlock ? editBlock.id : blockedSlots.length + 1,
      date: blockForm.date,
      timeSlot: blockForm.timeSlot,
      venue: venues.find((v) => v.value === blockForm.venue)?.label || blockForm.venue,
      reason: blockForm.reason,
      description: blockForm.description,
    }
    if (editBlock) {
      setBlockedSlots(blockedSlots.map((slot) => (slot.id === editBlock.id ? blockData : slot)))
      alert("Blocked slot updated successfully!")
      // TODO: Send update request to backend API
      // await fetch(`/api/blocked-slots/${editBlock.id}`, { method: 'PUT', body: JSON.stringify(blockData) });
    } else {
      setBlockedSlots([...blockedSlots, blockData])
      alert("Time slot blocked successfully!")
      // TODO: Send new blocked slot to backend API
      // await fetch('/api/blocked-slots', { method: 'POST', body: JSON.stringify(blockData) });
    }
    setBlockForm({ date: "", timeSlot: "", venue: "chennai", reason: "", description: "" })
    setShowBlockForm(false)
    setEditBlock(null)
  }

  // Filter bookings based on search term and today's date
  const today = new Date().toISOString().split("T")[0]
  console.log('\n═══════════════════════════════════════');
  console.log('📅 TODAY\'S DATE FOR FILTERING:', today);
  console.log('═══════════════════════════════════════');
  console.log('📊 Total bookings fetched:', allBookings.length);
  console.log('⚽ Sports bookings (all):', sportsBookings.length);
  console.log('🎪 Event bookings:', eventBookings.length);
  console.log('═══════════════════════════════════════\n');
  
  // Filter sports bookings to exclude Gym and Swimming Pool (only actual sports)
  const actualSportsBookings = sportsBookings.filter((booking) => {
    const sportLower = booking.sport.toLowerCase();
    return !sportLower.includes('gym') && !sportLower.includes('swimming');
  });
  
  const filteredSportsBookings = actualSportsBookings.filter((booking) =>
    Object.values(booking).some((value) => value?.toString().toLowerCase().includes(searchTerm.toLowerCase())),
  )
  const filteredEventBookings = eventBookings.filter((booking) =>
    Object.values(booking).some((value) => value?.toString().toLowerCase().includes(searchTerm.toLowerCase())),
  )
  
  // Normalize date format for comparison (handle both YYYY-MM-DD and other formats)
  const normalizeDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };
  
  const todaySportsBookings = actualSportsBookings.filter((booking) => {
    try {
      const normalized = normalizeDate(booking.date);
      const isToday = normalized === today;
      console.log(`🔍 Checking sports booking: ${booking.sport}`);
      console.log(`   - Original date: ${booking.date}`);
      console.log(`   - Normalized: ${normalized}`);
      console.log(`   - Today: ${today}`);
      console.log(`   - Match: ${isToday ? '✅ YES' : '❌ NO'}`);
      if (isToday) {
        console.log('✅ TODAY\'S SPORTS BOOKING FOUND:', booking.sport, booking.location, booking.time_slot);
      }
      return isToday;
    } catch (error) {
      console.error('❌ Error normalizing date:', error);
      return booking.date === today;
    }
  });
  
  const todayEventBookings = eventBookings.filter((booking) => {
    try {
      const normalized = normalizeDate(booking.date);
      const isToday = normalized === today;
      console.log(`🔍 Checking event booking: ${booking.sport}`);
      console.log(`   - Original date: ${booking.date}`);
      console.log(`   - Normalized: ${normalized}`);
      console.log(`   - Today: ${today}`);
      console.log(`   - Match: ${isToday ? '✅ YES' : '❌ NO'}`);
      if (isToday) {
        console.log('✅ TODAY\'S EVENT BOOKING FOUND:', booking.sport, booking.location, booking.time_slot);
      }
      return isToday;
    } catch (error) {
      console.error('❌ Error normalizing date:', error);
      return booking.date === today;
    }
  });
  
  console.log('\n═══════════════════════════════════════');
  console.log('📊 FILTERING RESULTS:');
  console.log('═══════════════════════════════════════');
  console.log('⚽ Today\'s Sports Bookings:', todaySportsBookings.length);
  console.log('🎪 Today\'s Event Bookings:', todayEventBookings.length);
  console.log('🎯 Actual Sports (excl gym/pool):', actualSportsBookings.length);
  console.log('═══════════════════════════════════════\n');

  // Filter recent bookings (today) and scheduled bookings (future)
  const recentBookings = allBookings.filter((booking) => {
    try {
      return normalizeDate(booking.date) === today;
    } catch {
      return booking.date === today;
    }
  });
  
  const scheduledBookings = allBookings.filter((booking) => {
    try {
      return new Date(normalizeDate(booking.date)) > new Date(today);
    } catch {
      return new Date(booking.date) > new Date(today);
    }
  });
  
  // Sort scheduled bookings by date (earliest first)
  const sortedScheduledBookings = [...scheduledBookings].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  
  // Filter subscribers based on search term
  const filteredSubscribers = subscribers.filter((subscriber) =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  
  // Analytics calculations
  // Calculate peak booking hours
  const frequencies: Record<string, number> = {}
  timeSlots.forEach((slot) => (frequencies[slot] = 0))
  ;[...actualSportsBookings, ...eventBookings].forEach((booking) => {
    const slot = booking.time_slot
    if (frequencies[slot]) frequencies[slot]++
    else frequencies[slot] = 1
  })
  const peakHours = Object.keys(frequencies).reduce((a, b) => (frequencies[a] > frequencies[b] ? a : b), timeSlots[0])
  
  // Calculate most popular sport
  const sportFrequencies: Record<string, number> = {}
  actualSportsBookings.forEach((booking) => {
    if (sportFrequencies[booking.sport]) sportFrequencies[booking.sport]++
    else sportFrequencies[booking.sport] = 1
  })
  const mostPopularSport = Object.keys(sportFrequencies).reduce(
    (a, b) => (sportFrequencies[a] > sportFrequencies[b] ? a : b),
    actualSportsBookings[0]?.sport || "None",
  )
  const totalSportBookings = actualSportsBookings.length
  const popularSportPercentage =
    totalSportBookings > 0 ? ((sportFrequencies[mostPopularSport] / totalSportBookings) * 100).toFixed(0) : "0"
  
  // Calculate average session duration from booking duration field
  const durations = [...actualSportsBookings, ...eventBookings].map((booking) => booking.duration)
  const averageDurationMinutes =
    durations.length > 0 ? durations.reduce((sum, duration) => sum + duration, 0) / durations.length : 0
  const averageDurationHours = (averageDurationMinutes / 60).toFixed(1)

  // Show login modal if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Shield size={64} className="text-[#ff5e14] mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[#2f3241] mb-2">Admin Access Required</h1>
            <p className="text-gray-600 mb-4">Please login to access the admin dashboard</p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-[#ff5e14] text-white px-6 py-2 rounded-md hover:bg-[#e54d00] transition-colors duration-300"
            >
              Login as Admin
            </button>
          </div>
        </div>

        <AdminLoginModal
          isOpen={showLoginModal}
          onClose={() => {
            setShowLoginModal(false)
            navigate("/")
          }}
          onLogin={handleLogin}
          onAddAdmin={() => {
            setShowLoginModal(false)
            setShowAddAdminModal(true)
          }}
        />

        <AddAdminModal
          isOpen={showAddAdminModal}
          onClose={() => {
            setShowAddAdminModal(false)
            setShowLoginModal(true)
          }}
          onAddAdmin={handleAddAdmin}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50">
      {/* Premium Header with Glassmorphism */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-orange-100/50 shadow-lg shadow-orange-500/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            {/* Left Section - Admin Info */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl blur-md opacity-75 animate-pulse-slow"></div>
                <div className="relative rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-3 shadow-xl">
                  <Shield className="text-white" size={28} strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-orange-900 bg-clip-text text-transparent">Admin Dashboard</h1>
                <p className="text-sm text-slate-600 font-medium">Welcome back, <span className="text-orange-600 font-semibold">{adminData?.username}</span></p>
              </div>
            </div>
            
            {/* Right Section - Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAddAdminModal(true)}
                className="group relative overflow-hidden flex items-center px-5 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl shadow-lg shadow-orange-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
                <Users size={18} className="mr-2 relative z-10" strokeWidth={2.5} />
                <span className="relative z-10 font-semibold">Add Admin</span>
              </button>
              <button
                onClick={handleLogout}
                className="group flex items-center px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl border-2 border-slate-200 transition-all duration-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 hover:scale-105 active:scale-95"
              >
                <LogOut size={18} className="mr-2 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                <span className="font-semibold">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Premium Stats Cards with Depth Psychology */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          {/* Sports Bookings Card */}
          <div className="group relative overflow-hidden bg-white rounded-2xl border border-blue-100/50 shadow-lg shadow-blue-500/5 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/30 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Users className="text-white" size={24} strokeWidth={2.5} />
                </div>
                <div className="px-2.5 py-1 bg-blue-100 rounded-full">
                  <TrendingUp size={14} className="text-blue-600" />
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-600 mb-1">Sports Bookings</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{actualSportsBookings.length}</p>
              <div className="mt-3 pt-3 border-t border-blue-100">
                <p className="text-xs text-slate-500">Active sports (excl. gym)</p>
              </div>
            </div>
          </div>

          {/* Event Bookings Card */}
          <div className="group relative overflow-hidden bg-white rounded-2xl border border-green-100/50 shadow-lg shadow-green-500/5 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg shadow-green-500/30 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Calendar className="text-white" size={24} strokeWidth={2.5} />
                </div>
                <div className="px-2.5 py-1 bg-green-100 rounded-full">
                  <TrendingUp size={14} className="text-green-600" />
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-600 mb-1">Event Bookings</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">{eventBookings.length}</p>
              <div className="mt-3 pt-3 border-t border-green-100">
                <p className="text-xs text-slate-500">Confirmed events</p>
              </div>
            </div>
          </div>

          {/* Scheduled Events Card */}
          <div className="group relative overflow-hidden bg-white rounded-2xl border border-yellow-100/50 shadow-lg shadow-yellow-500/5 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/10 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg shadow-yellow-500/30 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Clock className="text-white" size={24} strokeWidth={2.5} />
                </div>
                <div className="px-2.5 py-1 bg-yellow-100 rounded-full">
                  <Calendar size={14} className="text-yellow-600" />
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-600 mb-1">Scheduled Events</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">{scheduledEvents.length}</p>
              <div className="mt-3 pt-3 border-t border-yellow-100">
                <p className="text-xs text-slate-500">Upcoming</p>
              </div>
            </div>
          </div>

          {/* Blocked Slots Card */}
          <div className="group relative overflow-hidden bg-white rounded-2xl border border-red-100/50 shadow-lg shadow-red-500/5 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/30 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <XCircle className="text-white" size={24} strokeWidth={2.5} />
                </div>
                <div className="px-2.5 py-1 bg-red-100 rounded-full">
                  <Clock size={14} className="text-red-600" />
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-600 mb-1">Blocked Slots</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">{blockedSlots.length}</p>
              <div className="mt-3 pt-3 border-t border-red-100">
                <p className="text-xs text-slate-500">Maintenance</p>
              </div>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 rounded-2xl shadow-xl shadow-purple-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <TrendingUp className="text-white" size={24} strokeWidth={2.5} />
                </div>
                <div className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                  <BarChart3 size={14} className="text-white" />
                </div>
              </div>
              <p className="text-sm font-semibold text-purple-100 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-white">₹{((allBookings.reduce((sum, b) => sum + b.total_amount, 0)) / 1000).toFixed(1)}k</p>
              <div className="mt-3 pt-3 border-t border-white/20">
                <p className="text-xs text-purple-200">From {allBookings.length} bookings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Navigation Tabs with Smooth Animations */}
        <div className="flex flex-wrap gap-3 mb-8 p-2 bg-white/60 backdrop-blur-xl rounded-2xl border border-orange-100/50 shadow-lg shadow-orange-500/5">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`group relative overflow-hidden flex items-center px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "bookings"
                ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/30 scale-105"
                : "bg-white text-slate-700 hover:bg-orange-50 hover:text-orange-600 border border-slate-200"
            }`}
          >
            {activeTab === "bookings" && (
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
            )}
            <Users size={18} className="mr-2 relative z-10" strokeWidth={2.5} />
            <span className="relative z-10">View Bookings</span>
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`group relative overflow-hidden flex items-center px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "schedule"
                ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/30 scale-105"
                : "bg-white text-slate-700 hover:bg-orange-50 hover:text-orange-600 border border-slate-200"
            }`}
          >
            {activeTab === "schedule" && (
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
            )}
            <Calendar size={18} className="mr-2 relative z-10" strokeWidth={2.5} />
            <span className="relative z-10">Schedule</span>
          </button>
          <button
            onClick={() => setActiveTab("subscribers")}
            className={`group relative overflow-hidden flex items-center px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "subscribers"
                ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/30 scale-105"
                : "bg-white text-slate-700 hover:bg-orange-50 hover:text-orange-600 border border-slate-200"
            }`}
          >
            {activeTab === "subscribers" && (
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
            )}
            <Users size={18} className="mr-2 relative z-10" strokeWidth={2.5} />
            <span className="relative z-10">Subscribers</span>
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`group relative overflow-hidden flex items-center px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "analytics"
                ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/30 scale-105"
                : "bg-white text-slate-700 hover:bg-orange-50 hover:text-orange-600 border border-slate-200"
            }`}
          >
            {activeTab === "analytics" && (
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
            )}
            <BarChart3 size={18} className="mr-2 relative z-10" strokeWidth={2.5} />
            <span className="relative z-10">Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab("recent-scheduled")}
            className={`group relative overflow-hidden flex items-center px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "recent-scheduled"
                ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/30 scale-105"
                : "bg-white text-slate-700 hover:bg-orange-50 hover:text-orange-600 border border-slate-200"
            }`}
          >
            {activeTab === "recent-scheduled" && (
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
            )}
            <Clock size={18} className="mr-2 relative z-10" strokeWidth={2.5} />
            <span className="relative z-10">Recent & Scheduled</span>
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "bookings" && (
          <div>
            {/* Premium Search Bar and Sub Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setBookingSubTab("today")}
                  className={`group px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                    bookingSubTab === "today"
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/30 scale-105"
                      : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200"
                  }`}
                >
                  <span className="relative z-10">Today's Bookings</span>
                </button>
                <button
                  onClick={() => setBookingSubTab("sports")}
                  className={`group px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                    bookingSubTab === "sports"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                  }`}
                >
                  <span className="relative z-10">Sports Bookings</span>
                </button>
                <button
                  onClick={() => setBookingSubTab("events")}
                  className={`group px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                    bookingSubTab === "events"
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30 scale-105"
                      : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                  }`}
                >
                  <span className="relative z-10">Event Bookings</span>
                </button>
              </div>

              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search bookings..."
                  className="w-full sm:w-80 pl-11 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-300 font-medium text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={20} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" strokeWidth={2.5} />
              </div>
            </div>

            {/* Premium Tables with Modern Design */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-900/5 p-6">
              {bookingSubTab === "today" && (
                <div className="space-y-8">
                  {/* Today's Sports Bookings */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-800">
                      Today's Sports Bookings ({todaySportsBookings.length})
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-blue-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sport</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Location
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {todaySportsBookings.length > 0 ? (
                            todaySportsBookings.map((booking) => (
                              <tr key={booking.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {booking.sport}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">{booking.time_slot}</td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{booking.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{booking.location}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="px-4 py-3 text-sm text-gray-500 text-center">
                                No sports bookings for today.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Today's Event Bookings */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-green-800">
                      Today's Event Bookings ({todayEventBookings.length})
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-green-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Participants
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {todayEventBookings.length > 0 ? (
                            todayEventBookings.map((booking) => (
                              <tr key={booking.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {booking.sport} - {booking.location}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">{booking.time_slot}</td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{booking.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{booking.players}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="px-4 py-3 text-sm text-gray-500 text-center">
                                No event bookings for today.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {bookingSubTab === "sports" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-800">
                    Sports Bookings ({filteredSportsBookings.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-blue-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sport</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredSportsBookings.length > 0 ? (
                          filteredSportsBookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {booking.sport}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">{booking.date}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{booking.time_slot}</td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{booking.name}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{booking.location}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-4 py-3 text-sm text-gray-500 text-center">
                              No sports bookings found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {bookingSubTab === "events" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-green-800">
                    Event Bookings ({filteredEventBookings.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-green-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Participants
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredEventBookings.length > 0 ? (
                          filteredEventBookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {booking.sport} - {booking.location}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">{booking.date}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{booking.time_slot}</td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{booking.name}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{booking.players}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-4 py-3 text-sm text-gray-500 text-center">
                              No event bookings found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "schedule" && (
          <div>
            {/* Schedule Navigation */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveScheduleTab("events")}
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-300 ${
                  activeScheduleTab === "events"
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Calendar size={16} className="inline-block mr-2" />
                Event Scheduling
              </button>
              <button
                onClick={() => setActiveScheduleTab("sports")}
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-300 ${
                  activeScheduleTab === "sports" ? "bg-blue-500 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Users size={16} className="inline-block mr-2" />
                Sport Scheduling
              </button>
              <button
                onClick={() => setActiveScheduleTab("blocked")}
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-300 ${
                  activeScheduleTab === "blocked" ? "bg-red-500 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                <XCircle size={16} className="inline-block mr-2" />
                Block Time Slots
              </button>
            </div>

            {/* Event Scheduling */}
            {activeScheduleTab === "events" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Event Scheduling</h2>
                  <button
                    onClick={() => {
                      setEditEvent(null)
                      setEventForm({ name: "", date: "", time: "", venue: "chennai", capacity: "", notes: "" })
                      setShowEventForm(!showEventForm)
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300 flex items-center"
                  >
                    <Plus size={16} className="mr-2" />
                    Schedule New Event
                  </button>
                </div>

                {/* Event Form */}
                {showEventForm && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">{editEvent ? "Edit Event" : "Schedule New Event"}</h3>
                    <form onSubmit={handleEventSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                          value={eventForm.name}
                          onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                          value={eventForm.date}
                          onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input
                          type="text"
                          placeholder="e.g., 09:00-18:00"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                          value={eventForm.time}
                          onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                          value={eventForm.venue}
                          onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                        >
                          {venues.map((venue) => (
                            <option key={venue.value} value={venue.value}>
                              {venue.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity</label>
                        <input
                          type="number"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                          value={eventForm.capacity}
                          onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                          value={eventForm.notes}
                          onChange={(e) => setEventForm({ ...eventForm, notes: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2 flex space-x-4">
                        <button
                          type="submit"
                          className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors duration-300"
                        >
                          {editEvent ? "Update Event" : "Schedule Event"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowEventForm(false)
                            setEditEvent(null)
                            setEventForm({ name: "", date: "", time: "", venue: "chennai", capacity: "", notes: "" })
                          }}
                          className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Scheduled Events List */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Scheduled Events</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-green-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Event Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venue</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {scheduledEvents.map((event) => (
                          <tr key={event.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{event.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{event.date}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{event.time}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{event.venue}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{event.capacity}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {event.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium space-x-2">
                              <button
                                onClick={() => handleEditEvent(event)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(event.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Sport Scheduling */}
            {activeScheduleTab === "sports" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Sport Scheduling</h2>
                  <button
                    onClick={() => {
                      setEditSport(null)
                      setSportForm({
                        sport: "",
                        date: "",
                        timeSlot: "",
                        venue: "chennai",
                        coach: "",
                        maxParticipants: "",
                        notes: "",
                      })
                      setShowSportForm(!showSportForm)
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center"
                  >
                    <Plus size={16} className="mr-2" />
                    Schedule New Sport Session
                  </button>
                </div>

                {/* Sport Form */}
                {showSportForm && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {editSport ? "Edit Sport Session" : "Schedule New Sport Session"}
                    </h3>
                    <form onSubmit={handleSportSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sport Type</label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          value={sportForm.sport}
                          onChange={(e) => setSportForm({ ...sportForm, sport: e.target.value })}
                          required
                        >
                          <option value="">Select Sport</option>
                          {sports.map((sport) => (
                            <option key={sport} value={sport}>
                              {sport}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          value={sportForm.date}
                          onChange={(e) => setSportForm({ ...sportForm, date: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          value={sportForm.timeSlot}
                          onChange={(e) => setSportForm({ ...sportForm, timeSlot: e.target.value })}
                          required
                        >
                          <option value="">Select Time Slot</option>
                          {timeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          value={sportForm.venue}
                          onChange={(e) => setSportForm({ ...sportForm, venue: e.target.value })}
                        >
                          {venues.map((venue) => (
                            <option key={venue.value} value={venue.value}>
                              {venue.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Coach/Trainer</label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          value={sportForm.coach}
                          onChange={(e) => setSportForm({ ...sportForm, coach: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                        <input
                          type="number"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          value={sportForm.maxParticipants}
                          onChange={(e) => setSportForm({ ...sportForm, maxParticipants: e.target.value })}
                          required
                        />
                      </div>
                      <div className="md:col-span-2 flex space-x-4">
                        <button
                          type="submit"
                          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
                        >
                          {editSport ? "Update Sport Session" : "Schedule Sport Session"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowSportForm(false)
                            setEditSport(null)
                            setSportForm({
                              sport: "",
                              date: "",
                              timeSlot: "",
                              venue: "chennai",
                              coach: "",
                              maxParticipants: "",
                              notes: "",
                            })
                          }}
                          className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Scheduled Sports List */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Scheduled Sport Sessions</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-blue-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sport</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Slot</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venue</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coach</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Max Participants
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {scheduledSports.map((sport) => (
                          <tr key={sport.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {sport.sport}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">{sport.date}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{sport.timeSlot}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{sport.venue}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{sport.coach}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{sport.maxParticipants}</td>
                            <td className="px-6 py-4 text-sm font-medium space-x-2">
                              <button
                                onClick={() => handleEditSport(sport)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteSport(sport.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Block Time Slots */}
            {activeScheduleTab === "blocked" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Block Time Slots</h2>
                  <button
                    onClick={() => {
                      setEditBlock(null)
                      setBlockForm({ date: "", timeSlot: "", venue: "chennai", reason: "", description: "" })
                      setShowBlockForm(!showBlockForm)
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300 flex items-center"
                  >
                    <XCircle size={16} className="mr-2" />
                    Block New Time Slot
                  </button>
                </div>

                {/* Block Form */}
                {showBlockForm && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {editBlock ? "Edit Blocked Slot" : "Block Time Slot"}
                    </h3>
                    <form onSubmit={handleBlockSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                          value={blockForm.date}
                          onChange={(e) => setBlockForm({ ...blockForm, date: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                          value={blockForm.timeSlot}
                          onChange={(e) => setBlockForm({ ...blockForm, timeSlot: e.target.value })}
                          required
                        >
                          <option value="">Select Time Slot</option>
                          {timeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                          value={blockForm.venue}
                          onChange={(e) => setBlockForm({ ...blockForm, venue: e.target.value })}
                        >
                          {venues.map((venue) => (
                            <option key={venue.value} value={venue.value}>
                              {venue.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                          value={blockForm.reason}
                          onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
                          required
                        >
                          <option value="">Select Reason</option>
                          <option value="Maintenance">Maintenance</option>
                          <option value="Weather">Weather</option>
                          <option value="Private Event">Private Event</option>
                          <option value="Emergency">Emergency</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                          rows={3}
                          value={blockForm.description}
                          onChange={(e) => setBlockForm({ ...blockForm, description: e.target.value })}
                          placeholder="Additional details about the blocking reason..."
                        />
                      </div>
                      <div className="md:col-span-2 flex space-x-4">
                        <button
                          type="submit"
                          className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors duration-300"
                        >
                          {editBlock ? "Update Blocked Slot" : "Block Time Slot"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowBlockForm(false)
                            setEditBlock(null)
                            setBlockForm({ date: "", timeSlot: "", venue: "chennai", reason: "", description: "" })
                          }}
                          className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Blocked Slots List */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Blocked Time Slots</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-red-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Slot</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venue</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {blockedSlots.map((slot) => (
                          <tr key={slot.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">{slot.date}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{slot.timeSlot}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{slot.venue}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  slot.reason === "Maintenance"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : slot.reason === "Weather"
                                      ? "bg-blue-100 text-blue-800"
                                      : slot.reason === "Emergency"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {slot.reason}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">{slot.description}</td>
                            <td className="px-6 py-4 text-sm font-medium space-x-2">
                              <button
                                onClick={() => handleEditBlock(slot)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteBlock(slot.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "subscribers" && (
          <div>
            {/* Search Bar */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Newsletter Subscribers</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search subscribers..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5e14] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Subscribers Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Users className="text-indigo-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                    <p className="text-2xl font-bold text-gray-900">{subscribers.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="text-green-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Subscribers</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {subscribers.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="text-blue-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        subscribers.filter((s) => new Date(s.created_at).getMonth() === new Date().getMonth())
                          .length
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscribers Table */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-indigo-800">
                Subscriber List ({filteredSubscribers.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-indigo-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subscribed Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSubscribers.length > 0 ? (
                      filteredSubscribers.map((subscriber) => (
                        <tr key={subscriber.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                  <span className="text-sm font-medium text-indigo-600">
                                    {subscriber.email.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{subscriber.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(subscriber.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                if (
                                  confirm(`Are you sure you want to remove ${subscriber.email} from the newsletter?`)
                                ) {
                                  setSubscribers(subscribers.filter((s) => s.id !== subscriber.id))
                                  alert("Subscriber removed successfully!")
                                }
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-sm text-gray-500 text-center">
                          No subscribers found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Analytics Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Peak Booking Hours</h3>
                <p className="text-3xl font-bold">{peakHours}</p>
                <p className="text-sm opacity-90">Most popular time slot</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Most Popular Sport</h3>
                <p className="text-3xl font-bold">{mostPopularSport}</p>
                <p className="text-sm opacity-90">{popularSportPercentage}% of all sports bookings</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Average Session Duration</h3>
                <p className="text-3xl font-bold">{averageDurationHours} hrs</p>
                <p className="text-sm opacity-90">Per booking session</p>
              </div>
            </div>
          </div>
        )}

        {/* Recent & Scheduled Bookings Tab */}
        {activeTab === "recent-scheduled" && (
          <div className="space-y-8">
            {/* Stats Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Bookings Stats */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-2xl shadow-xl shadow-orange-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/40 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-xl transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <Clock className="text-white" size={32} strokeWidth={2.5} />
                    </div>
                    <div className="text-right">
                      <p className="text-white/80 text-sm font-semibold mb-2">Today's Bookings</p>
                      <p className="text-5xl font-bold text-white">{recentBookings.length}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/20">
                    <p className="text-white/90 text-sm">Active bookings for {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>

              {/* Scheduled Bookings Stats */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl shadow-xl shadow-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-xl transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <Calendar className="text-white" size={32} strokeWidth={2.5} />
                    </div>
                    <div className="text-right">
                      <p className="text-white/80 text-sm font-semibold mb-2">Upcoming Bookings</p>
                      <p className="text-5xl font-bold text-white">{scheduledBookings.length}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/20">
                    <p className="text-white/90 text-sm">Scheduled for future dates</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bookings Section */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-orange-200/50 shadow-xl shadow-orange-900/5 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <Clock className="text-white" size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Recent Bookings (Today)</h3>
                      <p className="text-white/80 text-xs">All bookings made for today</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                    <span className="text-white font-bold text-sm">{recentBookings.length} Total</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {recentBookings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-orange-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Sport/Event</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Time Slot</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Location</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Players</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentBookings.map((booking) => (
                          <tr key={booking.id} className="hover:bg-orange-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                booking.booking_type === 'sports' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {booking.booking_type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="text-sm font-medium text-gray-900">{booking.sport}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 font-medium">{booking.time_slot}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                              <div className="text-xs text-gray-500">{booking.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.location}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Users size={14} className="text-gray-400 mr-1" />
                                <span className="text-sm font-semibold text-gray-900">{booking.players}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-bold text-green-600">₹{booking.total_amount}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                      <Clock className="text-orange-600" size={32} />
                    </div>
                    <p className="text-gray-500 font-medium">No bookings for today</p>
                    <p className="text-gray-400 text-sm mt-1">Recent bookings will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Scheduled Bookings Section */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-blue-200/50 shadow-xl shadow-blue-900/5 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <Calendar className="text-white" size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Scheduled Bookings (Upcoming)</h3>
                      <p className="text-white/80 text-xs">Future bookings sorted by date</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                    <span className="text-white font-bold text-sm">{scheduledBookings.length} Total</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {sortedScheduledBookings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-blue-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Sport/Event</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Time Slot</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Location</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Players</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sortedScheduledBookings.map((booking) => {
                          const bookingDate = new Date(booking.date);
                          const daysUntil = Math.ceil((bookingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                          
                          return (
                            <tr key={booking.id} className="hover:bg-blue-50 transition-colors duration-200">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-gray-900">
                                  {bookingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                                <div className="text-xs text-blue-600 font-semibold">
                                  {daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                  booking.booking_type === 'sports' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {booking.booking_type}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{booking.sport}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 font-medium">{booking.time_slot}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                                <div className="text-xs text-gray-500">{booking.email}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.location}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Users size={14} className="text-gray-400 mr-1" />
                                  <span className="text-sm font-semibold text-gray-900">{booking.players}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-green-600">₹{booking.total_amount}</div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <Calendar className="text-blue-600" size={32} />
                    </div>
                    <p className="text-gray-500 font-medium">No scheduled bookings</p>
                    <p className="text-gray-400 text-sm mt-1">Future bookings will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Premium Footer */}
      <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-8 mt-12 border-t border-orange-500/20">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Shield className="text-orange-500" size={20} strokeWidth={2.5} />
            <p className="text-sm font-semibold">© 2025 ArenaHub Admin Portal</p>
          </div>
          <p className="text-xs text-slate-400">All Rights Reserved • Secure Dashboard</p>
        </div>
      </footer>

      {/* Add Admin Modal */}
      <AddAdminModal
        isOpen={showAddAdminModal}
        onClose={() => setShowAddAdminModal(false)}
        onAddAdmin={handleAddAdmin}
      />
    </div>
  )
}

export default Admin
