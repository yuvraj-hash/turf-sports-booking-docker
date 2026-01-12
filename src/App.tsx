import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { User, Heart, Award, MapPin, ChevronRight, LogIn, LogOut, UserCircle, Menu, X } from 'lucide-react';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Services from './components/Services';
import Venues from './components/Venues';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import LoginModal from './components/modals/LoginModal';
import RegisterModal from './components/modals/RegisterModal';
import ForgotPasswordModal from './components/modals/ForgotPasswordModal';
import ProfileDropdown from './components/ProfileDropdown';
import About from './pages/About';
import Contact from './pages/Contact';
import Events from './pages/Events';
import Booking from './pages/Booking';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Confirm from './components/modals/Confirm';
import ResetPassword from './components/modals/ResetPassword';
import { getCurrentUser, signOut } from './lib/supabase';

function App() {
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true); // New state for user session check
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [user, setUser] = useState<null | { name: string; email: string; avatar: string; phone?: string; gender?: string; selectedSports?: string[] }>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser && currentUser.email) {
          setUser({
            name: currentUser.user_metadata?.full_name || 'User',
            email: currentUser.email || '',
            avatar: currentUser.user_metadata?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.user_metadata?.full_name || 'User')}&background=FF5E14&color=fff`,
            phone: currentUser.user_metadata?.phone || '',
            gender: currentUser.user_metadata?.gender || 'male',
            selectedSports: currentUser.user_metadata?.selectedSports || []
          });
          navigate('/dashboard'); // Redirect to dashboard on successful session check
          setCurrentPage('dashboard');
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
        console.error('Session check error:', error);
      } finally {
        setUserLoading(false); // Mark session check as complete
      }
    };
    checkUserSession();
  }, []);

  const handleLogin = (userData: { name: string; email: string; rememberMe?: boolean }) => {
    setUser({
      name: userData.name,
      email: userData.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=FF5E14&color=fff`
    });
    setShowLoginModal(false);
    navigate('/dashboard'); // Redirect to dashboard after login
    setCurrentPage('dashboard');
  };

  const handleRegister = (userData: { name: string; email: string; rememberMe?: boolean }) => {
    setUser({
      name: userData.name,
      email: userData.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=FF5E14&color=fff`
    });
    setShowRegisterModal(false);
    navigate('/dashboard'); // Redirect to dashboard after registration
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      navigate('/');
      setCurrentPage('home');
    } catch (error) {
      setUser(null);
      navigate('/');
      console.error('Logout error:', error);
    }
  };

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    setMenuOpen(false);
    navigate(page === 'home' ? '/' : `/${page}`);
  };

  const handleBookNow = () => {
    navigate('/booking');
    setCurrentPage('booking');
  };

  const handleForgotPasswordClick = () => {
    setShowLoginModal(false);
    setShowForgotPasswordModal(true);
  };

  if (loading && window.location.pathname === '/') {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-[#2f3241] text-white py-2 px-4 text-sm hidden md:block">
        <div className="container mx-auto flex justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-[#ff5e14] mr-2">
                <MapPin size={14} />
              </span>
              <span>Chennai & Hyderabad</span>
            </div>
            <div className="flex items-center">
              <span className="text-[#ff5e14] mr-2">
                <Award size={14} />
              </span>
              <span>Premium Sports & Fitness Facilities</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a href="tel:+919876543210" className="hover:text-[#ff5e14] transition">+91 9876543210</a>
            <a href="mailto:info@arenahub.com" className="hover:text-[#ff5e14] transition">info@arenahub.com</a>
          </div>
        </div>
      </div>

      <Navbar 
        user={user}
        onLoginClick={() => setShowLoginModal(true)}
        onRegisterClick={() => setShowRegisterModal(true)}
        onLogout={handleLogout}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onNavigation={handleNavigation}
        onBookNowClick={handleBookNow}
        currentPage={currentPage}
      />

      <main className={menuOpen ? 'hidden' : 'flex-grow'}>
        <Routes>
          <Route path="/" element={
            <>
              <Hero onBookNow={handleBookNow} />
              <Features />
              <Services onBookNow={handleBookNow} />
              <Venues onBookNow={handleBookNow} />
              <Testimonials />
            </>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/events" element={<Events />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route
            path="/dashboard"
            element={
              userLoading ? (
                <div className="text-center py-20 text-xl">Checking session...</div>
              ) : user ? (
                <Dashboard />
              ) : (
                <div className="text-center py-20 text-xl">Please log in to access the dashboard.</div>
              )
            }
          />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <Footer className={menuOpen ? 'hidden' : 'block'} />

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onRegisterClick={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
        onForgotPasswordClick={handleForgotPasswordClick}
      />
      
      <RegisterModal 
        isOpen={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)}
        onLoginClick={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />

      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onLoginClick={() => {
          setShowForgotPasswordModal(false);
          setShowLoginModal(true);
        }}
      />

      <a href="#top" className="fixed bottom-5 right-5 bg-[#ff5e14] text-white p-3 rounded-full shadow-lg hover:bg-[#2f3241] transition-all duration-300 z-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </a>
    </div>
  );
}

export default App;