import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, MapPin, Clock, Users, DollarSign } from 'lucide-react';
import { supabase, insertBooking } from "../lib/supabase";

const Booking: React.FC = () => {
  const [selectedSport, setSelectedSport] = useState('');
  const navigate = useNavigate();

  // Smooth scroll to quick booking section on Home page (SPA)
  const handleCheckAvailability = useCallback(() => {
    if (window.location.pathname === '/' && document.getElementById('quick-booking')) {
      const el = document.getElementById('quick-booking');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate('/', { state: { scrollToQuickBooking: true } });
    }
  }, [navigate]);

  const [showFormError, setShowFormError] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    sport: '',
    date: '',
    time: '',
    players: '',
    duration: '',
    name: '',
    email: '',
    phone: ''
  });
  const [priceTab, setPriceTab] = useState<'pay' | 'member'>('pay');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [duplicateError, setDuplicateError] = useState("");
  const [allSlotsBooked, setAllSlotsBooked] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [formValidated, setFormValidated] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiApp, setUpiApp] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bank, setBank] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [loading, setLoading] = useState(false);

  const sportDescriptions: Record<string, string> = {
    football: '₹150 per person for up to 2 hours. Maximum: 22 players (11 vs 11). Equipment & sportswear available for rent. Membership options available.',
    cricket: '₹200 per person for up to 2 hours. Maximum: 22 players (11 vs 11). Equipment & sportswear available for rent. Membership options available.',
    basketball: '₹150 per person for up to 2 hours. Maximum: 10 players (5 vs 5). Equipment & sportswear available for rent. Membership options available.',
    badminton: '₹100 per person for up to 2 hours. Maximum: 4 players (2 vs 2). Equipment & sportswear available for rent. Membership options available.',
    tennis: '₹100 per person for up to 2 hours. Maximum: 4 players (2 vs 2). Equipment & sportswear available for rent. Membership options available.',
    gym: '₹200 per person for up to 2 hours. Fitness gear and gym attire available for rent. Membership options available.',
    swimming: '₹200 per person for up to 2 hours. Swimwear and safety gear available for rent. Membership options available.'
  };

  const nonMemberPrices: Record<string, string> = {
    football: '₹150 per person for up to 2 hours',
    cricket: '₹200 per person for up to 2 hours',
    basketball: '₹150 per person for up to 2 hours',
    badminton: '₹100 per person for up to 2 hours',
    tennis: '₹100 per person for up to 2 hours',
    gym: '₹200 per person for up to 2 hours',
    swimming: '₹200 per person for up to 2 hours'
  };
  const memberPrices: Record<string, string> = {
    football: '₹1,800/month (up to 3 sessions/week included)',
    cricket: '₹2,400/month (up to 3 sessions/week included)',
    basketball: '₹1,800/month (unlimited access during open hours)',
    badminton: '₹1,200/month (unlimited access during open hours)',
    tennis: '₹1,200/month (unlimited access during open hours)',
    gym: '₹2,000/month (unlimited daily access up to 2 hours/day)',
    swimming: '₹2,000/month (unlimited daily access up to 2 hours/day)'
  };

  const validateName = (name: string) => /^[a-zA-Z ]{2,50}$/.test(name);
  const validateEmail = (email: string) => /^(?=.{6,254}$)([a-zA-Z0-9._%+-]{1,64})@(gmail\.com|yahoo\.(com|co\.in)|outlook\.com|hotmail\.com|icloud\.com|protonmail\.com)$/.test(email);
  const validatePhone = (phone: string) => /^(?:\+91[\-\s]?|91[\-\s]?|0)?[6-9]\d{9}$/.test(phone);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const resetAll = () => {
    setSelectedSport('');
    setShowFormError(false);
    setFormData({
      location: '',
      sport: '',
      date: '',
      time: '',
      players: '',
      duration: '',
      name: '',
      email: '',
      phone: ''
    });
    setPriceTab('pay');
    setShowConfirmModal(false);
    setShowPayModal(false);
    setFormValidated(false);
    setPaymentMethod('card');
    setCardName('');
    setCardNumber('');
    setExpiryMonth('');
    setExpiryYear('');
    setCvv('');
    setUpiApp('');
    setUpiId('');
    setBank('');
    setPaymentStatus('idle');
    setLoading(false);
  };

  const calculateTotalCost = () => {
    if (!selectedSport || !formData.players || !formData.duration) return 0;
    const players = parseInt(formData.players, 10);
    const duration = parseInt(formData.duration, 10);
    if (isNaN(players) || isNaN(duration)) return 0;
    if (priceTab === 'pay') {
      let pricePerPerson = 0;
      switch(selectedSport) {
        case 'football': pricePerPerson = 150; break;
        case 'cricket': pricePerPerson = 200; break;
        case 'basketball': pricePerPerson = 150; break;
        case 'badminton': pricePerPerson = 100; break;
        case 'tennis': pricePerPerson = 100; break;
        case 'gym': pricePerPerson = 200; break;
        case 'swimming': pricePerPerson = 200; break;
        default: pricePerPerson = 0;
      }
      const sessionBlock = 2;
      const blocks = Math.ceil(duration / sessionBlock);
      const total = pricePerPerson * players * blocks;
      return total;
    } else {
      let memberFee = 0;
      let guestFee = 0;
      let guestCount = Math.max(0, players - 1);
      switch(selectedSport) {
        case 'football': memberFee = 1800; guestFee = 150; break;
        case 'cricket': memberFee = 2400; guestFee = 200; break;
        case 'basketball': memberFee = 1800; guestFee = 150; break;
        case 'badminton': memberFee = 1200; guestFee = 100; break;
        case 'tennis': memberFee = 1200; guestFee = 100; break;
        case 'gym': memberFee = 2000; guestFee = 200; break;
        case 'swimming': memberFee = 2000; guestFee = 200; break;
        default: memberFee = 0; guestFee = 0;
      }
      const sessionBlock = 2;
      const blocks = Math.ceil(duration / sessionBlock);
      const guestTotal = guestFee * guestCount * blocks;
      if (guestCount > 0) {
        return memberFee + guestTotal;
      } else {
        return memberFee;
      }
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDuplicateError("");
    setAllSlotsBooked(false);
    let valid = true;
    setNameError(''); setEmailError(''); setPhoneError('');
    if (!selectedSport) {
      setShowFormError(true);
      const sportSection = document.getElementById('sport-selection');
      if (sportSection) {
        sportSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    if (!validateName(formData.name)) {
      setNameError('Please enter a valid name (letters and spaces only, 2-50 characters).');
      valid = false;
    }
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address (gmail, yahoo, outlook, hotmail, icloud, protonmail only).');
      valid = false;
    }
    if (!validatePhone(formData.phone)) {
      setPhoneError('Please enter a valid Indian phone number.');
      valid = false;
    }
    if (formData.date && new Date(formData.date) < new Date(new Date().toDateString())) {
      alert('Please select a valid date (today or future).');
      return;
    }
    if (!valid) return;

    // Check for duplicate booking
    const { data: existing, error: dupError } = await supabase
      .from('bookings')
      .select('id')
      .eq('sport', formData.sport)
      .eq('location', formData.location)
      .eq('time_slot', formData.time)
      .eq('date', formData.date)
      .limit(1);
    if (dupError) {
      alert('Error checking for duplicate booking. Please try again.');
      return;
    }
    if (existing && existing.length > 0) {
      setDuplicateError('Oops! That slot is already taken for the selected options. Please choose a different time slot.');
      return;
    }

    // Check if all slots for this sport and date are booked
    const allSlots = ["8-10","10-12","12-14","14-16","16-18","18-20","20-21"];
    const { data: bookedSlots, error: allError } = await supabase
      .from('bookings')
      .select('time_slot')
      .eq('sport', formData.sport)
      .eq('date', formData.date);
    if (allError) {
      alert('Error checking slot availability. Please try again.');
      return;
    }
    const booked = bookedSlots ? bookedSlots.map(b => b.time_slot) : [];
    const allTaken = allSlots.every(slot => booked.includes(slot));
    if (allTaken) {
      setAllSlotsBooked(true);
      return;
    }

    // Insert booking data into Supabase
    try {
      const bookingData = {
        booking_type: priceTab === 'pay' ? 'pay per use' : 'membership',
        sport: formData.sport,
        location: formData.location,
        time_slot: formData.time,
        date: formData.date,
        players: parseInt(formData.players, 10),
        duration: parseInt(formData.duration, 10),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        total_amount: calculateTotalCost(),
        payment_mode: 'pay_on_spot' as 'online' | 'pay_on_spot',
        razorpay_payment_id: null
      };

      await insertBooking(bookingData);
      setFormValidated(true);
      setShowConfirmModal(true);
    } catch (error) {
      console.error('Error saving booking:', error);
      alert('Error saving booking to database. Please try again.');
      return;
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPaymentStatus('idle');

    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setPaymentStatus('error');
      setLoading(false);
      alert('Failed to load Razorpay SDK. Please try again.');
      return;
    }

    // Prepare Razorpay options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: calculateTotalCost() * 100, // Amount in paise
      currency: 'INR',
      name: 'ArenaHub',
      description: `Booking for ${selectedSport}`,
      image: 'https://your-logo-url.com/logo.png', // Replace with your logo URL
      handler: async function (response: { razorpay_payment_id: string }) {
        // Save booking with payment details to Supabase
        const bookingData = {
          booking_type: priceTab === 'pay' ? 'pay per use' : 'membership',
          sport: formData.sport,
          location: formData.location,
          time_slot: formData.time,
          date: formData.date,
          players: parseInt(formData.players, 10),
          duration: parseInt(formData.duration, 10),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          total_amount: calculateTotalCost(),
          payment_mode: 'online' as 'online' | 'pay_on_spot',
          razorpay_payment_id: response.razorpay_payment_id
        };

        const { error } = await supabase
          .from('bookings')
          .insert([bookingData]);

        if (error) {
          console.error('Error saving booking:', error);
          setPaymentStatus('error');
          setLoading(false);
          alert('Error saving booking after payment. Please contact support.');
          return;
        }

        setPaymentStatus('success');
        setLoading(false);
        setTimeout(() => {
          resetAll();
        }, 2000);
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone
      },
      notes: {
        booking_type: priceTab === 'pay' ? 'pay per use' : 'membership'
      },
      theme: {
        color: '#ff5e14'
      }
    };

    // Initialize Razorpay
    const rzp = new (window as any).Razorpay(options);
    rzp.on('payment.failed', function (response: any) {
      console.error('Payment failed:', response.error);
      setPaymentStatus('error');
      setLoading(false);
      alert('Payment failed. Please try again.');
    });
    rzp.open();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div 
        className="relative bg-cover bg-center py-24" 
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=compress&fit=crop&w=1600&q=80')"
        }}
      >
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Book Your Sports Venue</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Choose from our premium sports facilities in Chennai and Hyderabad
          </p>
        </div>
      </div>

      <div id="sport-selection" className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-[#2f3241] mb-8">
          Let the Games Begin – Select Your Sport or Workout Option
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {[
              { id: 'football', name: 'Football', image: 'https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=300' },
              { id: 'cricket', name: 'Cricket', image: '/cricket.jpeg' },
              { id: 'basketball', name: 'Basketball', image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=300' },
              { id: 'badminton', name: 'Badminton', image: 'https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg?auto=compress&cs=tinysrgb&w=300' }
            ].map(sport => (
              <div
                key={sport.id}
                className={`relative cursor-pointer rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-1 ${selectedSport === sport.id ? 'ring-4 ring-[#ff5e14] scale-105' : ''}`}
                onClick={() => {
                  setSelectedSport(sport.id);
                  setFormData(prev => ({ ...prev, sport: sport.id }));
                  setShowFormError(false);
                }}
              >
                <img 
                  src={sport.image} 
                  alt={sport.name}
                  className="w-full h-32 object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-center">
                  <h3 className="font-semibold">{sport.name}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'tennis', name: 'Tennis', image: 'https://images.pexels.com/photos/8224728/pexels-photo-8224728.jpeg?auto=compress&cs=tinysrgb&w=300' },
              { id: 'swimming', name: 'Swimming Pool', image: 'https://images.pexels.com/photos/261185/pexels-photo-261185.jpeg?auto=compress&cs=tinysrgb&w=300' },
              { id: 'gym', name: 'Gym', image: 'https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=300' }
            ].map(sport => (
              <div
                key={sport.id}
                className={`relative cursor-pointer rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-1 ${selectedSport === sport.id ? 'ring-4 ring-[#ff5e14] scale-105' : ''}`}
                onClick={() => {
                  setSelectedSport(sport.id);
                  setFormData(prev => ({ ...prev, sport: sport.id }));
                  setShowFormError(false);
                }}
              >
                <img 
                  src={sport.image} 
                  alt={sport.name}
                  className="w-full h-32 object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-center">
                  <h3 className="font-semibold">{sport.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
        {selectedSport && (
          <div className="text-center mt-8">
            <p className="text-xl font-medium text-[#ff5e14]">
              Selected Sport: {selectedSport.charAt(0).toUpperCase() + selectedSport.slice(1)}
            </p>
          </div>
        )}
        {showFormError && (
          <div className="mt-8 text-center text-red-600 bg-red-100 p-4 rounded-md">
            Please select a sport to continue
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 relative">
          <button
            type="button"
            className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors duration-200 group"
            onClick={handleCheckAvailability}
            title="Go to Quick Booking on Home page"
          >
            <Info className="w-4 h-4 text-white group-hover:text-blue-100" />
            <span>Check Availability</span>
          </button>
          <div className="flex justify-center mb-8">
            <button
              type="button"
              className={`px-6 py-2 rounded-l-md font-semibold border border-[#ff5e14] focus:outline-none transition-colors duration-200 ${priceTab === 'pay' ? 'bg-[#ff5e14] text-white' : 'bg-white text-[#ff5e14]'}`}
              onClick={() => setPriceTab('pay')}
              aria-pressed={priceTab === 'pay'}
            >
              Pay Per Use
            </button>
            <button
              type="button"
              className={`px-6 py-2 rounded-r-md font-semibold border-t border-b border-r border-[#ff5e14] focus:outline-none transition-colors duration-200 ${priceTab === 'member' ? 'bg-[#ff5e14] text-white' : 'bg-white text-[#ff5e14]'}`}
              onClick={() => setPriceTab('member')}
              aria-pressed={priceTab === 'member'}
            >
              Membership
            </button>
          </div>
          {selectedSport && (
            <div className="mb-6 text-center">
              <span className="inline-block px-4 py-2 rounded bg-gray-100 text-[#ff5e14] font-semibold text-base">
                {priceTab === 'pay' ? nonMemberPrices[selectedSport] : memberPrices[selectedSport]}
              </span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Selected Sport */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Sport
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
                  value={selectedSport ? (selectedSport === 'swimming' ? 'Swimming Pool' : selectedSport.charAt(0).toUpperCase() + selectedSport.slice(1)) : ''}
                  readOnly
                  tabIndex={-1}
                  placeholder="Select your sport above"
                />
              </div>
              {/* Location Field - auto set to Chennai and readOnly for Gym/Swimming */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline-block w-4 h-4 mr-2" />
                  Location
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff5e14] focus:border-transparent"
                  value={((selectedSport === 'swimming' || selectedSport === 'gym') ? 'chennai' : formData.location)}
                  onChange={(e) => {
                    if (selectedSport === 'swimming' || selectedSport === 'gym') return;
                    setFormData({...formData, location: e.target.value});
                    setShowFormError(false);
                  }}
                  required
                  readOnly={selectedSport === 'swimming' || selectedSport === 'gym'}
                  disabled={selectedSport === 'swimming' || selectedSport === 'gym'}
                >
                  <option value="">Select Location</option>
                  <option value="chennai">Chennai Central</option>
                  <option value="hyderabad" disabled={selectedSport === 'swimming' || selectedSport === 'gym'}>Hyderabad Jubilee Hills</option>
                </select>
                {(selectedSport === 'swimming' || selectedSport === 'gym') && (
                  <span className="text-xs text-orange-600">This facility is only available in Chennai.</span>
                )}
              </div>
              {/* Date Field (now before Time Slot) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline-block w-4 h-4 mr-2" />
                  Date
                </label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff5e14] focus:border-transparent"
                  value={formData.date}
                  onChange={(e) => {
                    const val = e.target.value;
                    // If selected date is before today, ignore
                    const todayStr = new Date().toISOString().split('T')[0];
                    if (val < todayStr) return;
                    setFormData({ ...formData, date: val, time: '' }); // Reset time if date changes
                  }}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              {/* Time Slot Field (now after Date) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline-block w-4 h-4 mr-2" />
                  Time Slot
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff5e14] focus:border-transparent"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                >
                  <option value="">Select Time</option>
                  {(() => {
                    // Time slot definitions (24h format for comparison)
                    const slots = [
                      { value: "8-10", label: "8:00 AM - 10:00 AM", start: 8, end: 10 },
                      { value: "10-12", label: "10:00 AM - 12:00 PM", start: 10, end: 12 },
                      { value: "12-14", label: "12:00 PM - 2:00 PM", start: 12, end: 14 },
                      { value: "14-16", label: "2:00 PM - 4:00 PM", start: 14, end: 16 },
                      { value: "16-18", label: "4:00 PM - 6:00 PM", start: 16, end: 18 },
                      { value: "18-20", label: "6:00 PM - 8:00 PM", start: 18, end: 20 },
                      { value: "20-21", label: "8:00 PM - 9:00 PM", start: 20, end: 21 },
                    ];
                    const today = new Date();
                    const selectedDate = formData.date ? new Date(formData.date) : null;
                    const isToday = selectedDate &&
                      today.getFullYear() === selectedDate.getFullYear() &&
                      today.getMonth() === selectedDate.getMonth() &&
                      today.getDate() === selectedDate.getDate();
                    const currentHour = today.getHours() + today.getMinutes() / 60;
                    return slots.map(slot => {
                      let disabled = false;
                      let message = '';
                      if (selectedDate) {
                        if (isToday && slot.end <= currentHour) {
                          disabled = true;
                          message = 'Time not applicable';
                        }
                      }
                      return (
                        <option key={slot.value} value={slot.value} disabled={disabled}>
                          {slot.label} {disabled ? `(${message})` : ''}
                        </option>
                      );
                    });
                  })()}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline-block w-4 h-4 mr-2" />
                  Number of Persons
                </label>
                <input 
                  type="number"
                  min={(selectedSport && ['tennis','cricket','football','basketball','badminton'].includes(selectedSport)) ? 2 : 1}
                  max={(() => {
                    switch(selectedSport) {
                      case 'football': return 22;
                      case 'cricket': return 22;
                      case 'basketball': return 10;
                      case 'badminton': return 4;
                      case 'tennis': return 4;
                      case 'gym': return 15;
                      case 'swimming': return 15;
                      default: return 99;
                    }
                  })()}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff5e14] focus:border-transparent"
                  placeholder="Enter number of players"
                  value={formData.players}
                  onChange={(e) => setFormData({...formData, players: e.target.value})}
                  required
                  disabled={priceTab === 'member'}
                />
                {selectedSport && priceTab === 'member' && Number(formData.players) > 1 && (
                  <p className="text-xs text-orange-600 mt-1">Membership is for a single person only. Charges applicable for non-member guest access.</p>
                )}
                {selectedSport && formData.players && Number(formData.players) > ((() => {
                  switch(selectedSport) {
                    case 'football': return 22;
                    case 'cricket': return 22;
                    case 'basketball': return 10;
                    case 'badminton': return 4;
                    case 'tennis': return 4;
                    case 'gym': return 15;
                    case 'swimming': return 15;
                    default: return 99;
                  }
                })()) && (
                  <p className="text-xs text-red-500 mt-1">Maximum players for {selectedSport.charAt(0).toUpperCase() + selectedSport.slice(1)} is {(() => {
                  switch(selectedSport) {
                    case 'football': return 22;
                    case 'cricket': return 22;
                    case 'basketball': return 10;
                    case 'badminton': return 4;
                    case 'tennis': return 4;
                    case 'gym': return 15;
                    case 'swimming': return 15;
                    default: return 99;
                  }
                })()}.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline-block w-4 h-4 mr-2" />
                  Duration
                </label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff5e14] focus:border-transparent"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  required
                >
                  <option value="">Select Duration</option>
                  <option value="1">1 Hour</option>
                  <option value="2">2 Hours</option>
                  <option value="3">3 Hours</option>
                  <option value="4">4 Hours</option>
                </select>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input 
                    type="text"
                    className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff5e14] focus:border-transparent ${nameError ? 'border-red-500' : ''}`}
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => { setFormData({...formData, name: e.target.value}); setNameError(''); }}
                    required
                    aria-invalid={!!nameError}
                    aria-describedby="name-error"
                  />
                  {nameError && <span id="name-error" className="text-xs text-red-500">{nameError}</span>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input 
                    type="email"
                    className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff5e14] focus:border-transparent ${emailError ? 'border-red-500' : ''}`}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => { setFormData({...formData, email: e.target.value}); setEmailError(''); }}
                    required
                    aria-invalid={!!emailError}
                    aria-describedby="email-error"
                  />
                  {emailError && <span id="email-error" className="text-xs text-red-500">{emailError}</span>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input 
                    type="tel"
                    className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff5e14] focus:border-transparent ${phoneError ? 'border-red-500' : ''}`}
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => { setFormData({...formData, phone: e.target.value}); setPhoneError(''); }}
                    required
                    aria-invalid={!!phoneError}
                    aria-describedby="phone-error"
                  />
                  {phoneError && <span id="phone-error" className="text-xs text-red-500">{phoneError}</span>}
                </div>
              </div>
            </div>

            <div className="md:col-span-2 text-right text-lg font-semibold text-[#2f3241]">
              Total Amount: ₹{calculateTotalCost()}
            </div>

            {duplicateError && (
              <div className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded-md font-semibold">
                Oops! That slot is already taken for the selected options. Please choose a different time slot.
              </div>
            )}
            <div className="flex justify-end gap-4 mt-4 md:col-span-2">
              <button 
                type="submit"
                style={{ fontSize: '1rem', padding: '10px 20px', background: '#22c55e', color: 'white', borderRadius: '0.375rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5em' }}
                className="hover:bg-green-700 transition-colors duration-300"
                disabled={((selectedSport === 'swimming' || selectedSport === 'gym') && formData.location === 'hyderabad') || allSlotsBooked}
              >
                Confirm Booking
              </button>
              <button 
                type="button"
                className="px-8 py-3 bg-gray-400 text-white font-medium rounded-md hover:bg-gray-500 transition-colors duration-300"
                onClick={resetAll}
              >
                Clear
              </button>
            </div>
            {allSlotsBooked && (
              <div className="mt-4 text-center text-red-700 bg-red-100 p-3 rounded-md font-semibold">
                All time slots for this sport are currently booked. Please check back for availability on another day.
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {selectedSport === 'gym' ? (
            <>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-[#2f3241]">Gym Facilities</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• State-of-the-art equipment</li>
                  <li>• Personal trainers available</li>
                  <li>• Cardio section</li>
                  <li>• Weight training area</li>
                  <li>• Locker rooms</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-[#2f3241]">Membership Benefits</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Free fitness assessment</li>
                  <li>• Workout plan</li>
                  <li>• Access to all equipment</li>
                  <li>• Shower facilities</li>
                  <li>• Fitness tracking</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-[#2f3241]">Additional Services</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Nutrition guidance</li>
                  <li>• Group classes</li>
                  <li>• Supplements store</li>
                  <li>• Towel service</li>
                  <li>• Parking facility</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-[#2f3241]">Venue Features</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Professional grade facilities</li>
                  <li>• Well-maintained courts/fields</li>
                  <li>• Floodlights for evening games</li>
                  <li>• Equipment rental available</li>
                  <li>• First aid support</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-[#2f3241]">Amenities</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Changing rooms</li>
                  <li>• Shower facilities</li>
                  <li>• Drinking water</li>
                  <li>• Seating area</li>
                  <li>• Parking space</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-[#2f3241]">Support</h3>
                <div className="space-y-4 text-gray-600">
                  <p className="flex items-center">
                    <span className="w-8">📞</span> +91 9876543210
                  </p>
                  <p className="flex items-center">
                    <span className="w-8">✉️</span> support@arenahub.com
                  </p>
                  <p className="flex items-center">
                    <span className="w-8">⏰</span> 8 AM - 9 PM (Daily)
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Modal open={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
        <div className="text-center w-full max-w-lg mx-auto p-6" style={{ minWidth: 340, maxWidth: 480 }}>
          <h2 className="text-2xl font-bold mb-4 text-[#2f3241]">Booking Confirmed!</h2>
          <p className="mb-2">Thank you, {formData.name}, for booking <span className="font-semibold">{selectedSport ? (selectedSport === 'swimming' ? 'Swimming Pool' : selectedSport.charAt(0).toUpperCase() + selectedSport.slice(1)) : ''}</span>.</p>
          <p className="mb-2">We have received your booking details and will contact you soon.</p>
          <p className="mb-4 text-orange-600 font-medium">Booking will be treated as Pay on Spot unless paid online.</p>
          {(selectedSport === 'swimming' || selectedSport === 'gym') && formData.location === 'hyderabad' && (
            <div className="mt-4 mb-2 p-3 bg-red-100 border border-red-200 rounded text-red-700 text-sm">
              Location not available for this sport.
            </div>
          )}
          <div className="mt-4 mb-2 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-900 text-sm">
            <strong>Note:</strong> To secure your slot, complete the online payment at the earliest — priority is given to the first successful payment. If someone else books the same slot and pays before you, your booking may be canceled, including for on-spot registrations.
          </div>
          <button className="mt-6 px-6 py-2 bg-[#ff5e14] text-white rounded-md mr-4" onClick={() => setShowConfirmModal(false)}>Close</button>
          <button
            className="mt-6 px-6 py-2 bg-green-600 text-white rounded-md"
            onClick={() => { setShowConfirmModal(false); setShowPayModal(true); }}
            disabled={(selectedSport === 'swimming' || selectedSport === 'gym') && formData.location === 'hyderabad'}
          >
            Pay Online
          </button>
        </div>
      </Modal>

      <Modal open={showPayModal} onClose={() => setShowPayModal(false)}>
        <div className="w-full max-w-2xl mx-auto p-4" style={{ minWidth: 420, maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
          <h2 className="text-2xl font-bold mb-4 text-[#2f3241] text-center">Booking Payment</h2>
          <form className="space-y-4" onSubmit={handlePayment}>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
              <div className="col-span-2 md:col-span-1">
                <label className="font-medium text-gray-700">Sport:</label>
                <span className="ml-2 text-gray-900">{selectedSport ? (selectedSport === 'swimming' ? 'Swimming Pool' : selectedSport.charAt(0).toUpperCase() + selectedSport.slice(1)) : ''}</span>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="font-medium text-gray-700">Name:</label>
                <span className="ml-2 text-gray-900">{formData.name}</span>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="font-medium text-gray-700">Email:</label>
                <span className="ml-2 text-gray-900">{formData.email}</span>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="font-medium text-gray-700">Phone:</label>
                <span className="ml-2 text-gray-900">{formData.phone}</span>
              </div>
              <div className="col-span-2">
                <label className="font-medium text-gray-700">Amount to Pay:</label>
                <span className="ml-2 font-bold text-[#ff5e14] text-lg">₹{calculateTotalCost()}</span>
              </div>
            </div>
            <div className="space-y-3 mt-6">
              <button 
                type="submit" 
                className="w-full px-6 py-3 bg-[#ff5e14] text-white rounded-md font-semibold hover:bg-[#e54d00] transition-colors duration-300"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Proceed to Pay with Razorpay'}
              </button>
              <button 
                type="button" 
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-md"
                onClick={() => setShowPayModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              {paymentStatus === 'success' && <div className="text-green-600 text-center font-semibold mt-2">Payment Successful! Booking Confirmed.</div>}
              {paymentStatus === 'error' && <div className="text-red-600 text-center font-semibold mt-2">Payment Failed. Please try again.</div>}
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

const Modal = ({ open, onClose, children }: { open: boolean, onClose: () => void, children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

export default Booking;