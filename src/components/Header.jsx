import React, { useState, useEffect } from 'react';
import { Search, Globe, Menu, UserCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Header({ onSearch }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [location, setLocation] = useState('');
  const [guestCounts, setGuestCounts] = useState({
    adults: 1,
    children: 0,
    infants: 0
  });
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  const totalGuests = guestCounts.adults + guestCounts.children;

  const updateGuestCount = (type, action) => {
    setGuestCounts(prev => {
      const current = prev[type];
      const newVal = action === 'plus' ? current + 1 : Math.max(0, current - 1);
      
      // If adding child/infant and adults is 0, auto-set adults to 1
      if (action === 'plus' && (type === 'children' || type === 'infants') && prev.adults === 0) {
        return { ...prev, adults: 1, [type]: newVal };
      }
      
      // Minimum 1 adult if there are children or infants
      if (action === 'minus' && type === 'adults' && newVal === 0 && (prev.children > 0 || prev.infants > 0)) {
        return prev;
      }

      return { ...prev, [type]: newVal };
    });
  };
  const [activeSearchTab, setActiveSearchTab] = useState('where'); // where, checkin, checkout, who
  const [viewDate, setViewDate] = useState(new Date(2025, 3, 1)); // Start at April 2025 (current year)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleSearchClick = () => {
    onSearch({ location, guests: totalGuests, guestCounts, checkIn, checkOut });
    setShowSearchOverlay(false);
  };

  const formatDate = (date) => {
    if (!date) return 'Add dates';
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const generateCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    // Prefix empty slots
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
    }
    return days;
  };

  const handleDateClick = (date) => {
    const dateStr = date.toISOString();
    if (activeSearchTab === 'checkin') {
      setCheckIn(dateStr);
      setCheckOut(null); // Reset checkout if checkin changes
      setActiveSearchTab('checkout');
    } else if (activeSearchTab === 'checkout') {
      if (checkIn && dateStr <= checkIn) {
        setCheckIn(dateStr);
      } else {
        setCheckOut(dateStr);
        setActiveSearchTab('who');
      }
    }
  };

  const changeMonth = (offset) => {
    const nextDate = new Date(viewDate);
    nextDate.setMonth(nextDate.getMonth() + offset);
    setViewDate(nextDate);
  };

  const monthName = viewDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const calendarDays = generateCalendar();

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out flex items-center bg-white 
          ${isScrolled ? 'h-[72px] shadow-[0_2px_4px_rgba(0,0,0,0.04)]' : 'h-[80px] border-b-[1px] border-airbnb-border'}
        `}
      >
        <div className="w-full px-6 md:px-12">
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            {/* Logo */}
            <div className="flex items-center gap-1.5 cursor-pointer group" onClick={() => { setLocation(''); setCheckIn(null); setCheckOut(null); onSearch({ location: '', guests: 1, checkIn: null, checkOut: null }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <div className="text-airbnb-red block group-hover:scale-110 transition-transform">
                 <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="block h-8 w-8 fill-current"><path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179h-.011l-.176.185c-2.044 2.1-4.392 3.415-6.57 3.614l-.414.019-.247.001c-3.48 0-6.358-2.416-6.358-6.478 0-1.541.56-3.136 1.732-5.111l.169-.283c1.025-1.688 5.759-10.158 7.373-13.439l.526-1.047C12.537 1.963 13.992 1 16 1zm0 2c-1.232 0-2.043.513-3.141 2.473l-.513 1.02c-1.569 3.176-6.282 11.609-7.29 13.268l-.16.273c-1.06 1.777-1.538 3.09-1.538 4.488 0 2.824 1.83 4.478 4.358 4.478 1.439 0 3.245-.98 5.174-2.903l.259-.264.453-.473c1.119-1.127 2.158-1.577 2.398-1.577s1.279.45 2.397 1.571l.454.478.261.266c1.933 1.927 3.737 2.903 5.176 2.903 2.528 0 4.357-1.654 4.357-4.478 0-1.399-.479-2.711-1.538-4.488l-.16-.273c-1.008-1.659-5.721-10.092-7.291-13.268l-.512-1.02C18.043 3.513 17.232 3 16 3zm0 10c2.723 0 5.044 1.541 6.138 3.824l.081.185c.421.996.657 2.221.758 3.42l.023.471.01.408c0 1.96-1.22 3.696-3.003 4.44l-.24.091c-1.054.364-2.316.56-3.626.56-1.31 0-2.572-.196-3.626-.56l-.24-.09c-1.783-.745-3.003-2.481-3.003-4.44l.01-.408.023-.471c.101-1.199.337-2.424.758-3.42l.081-.185C10.956 14.541 13.277 13 16 13zm0 2c-1.87 0-3.523 1.012-4.4 2.553l-.066.126a11.12 11.12 0 0 0-.665 2.842l-.013.21-.01.269c0 1.047.66 1.97 1.624 2.373l.169.062c.797.275 1.77.432 2.76.432 1 0 1.972-.157 2.76-.432l.169-.062c.963-.403 1.624-1.326 1.624-2.373l-.011-.27-.013-.209a11.12 11.12 0 0 0-.665-2.842l-.066-.126C19.523 16.012 17.87 15 16 15z"></path></svg>
              </div>
              <span className="text-airbnb-red font-bold text-xl lg:text-2xl hidden lg:block tracking-tighter">airbnb</span>
            </div>

            {/* Search Bar */}
            <div 
              onClick={() => { setShowSearchOverlay(true); setActiveSearchTab('where'); }}
              className={`border-[1px] border-airbnb-border w-full md:w-auto rounded-full shadow-airbnb hover:shadow-airbnb-hover transition-all duration-300 cursor-pointer flex items-center bg-white overflow-hidden
                ${isScrolled ? 'py-1.5 scale-95 md:scale-100' : 'py-2 mt-1 md:mt-0'}
              `}
            >
              <div className="flex flex-row items-center justify-between w-full font-semibold text-[13px] md:text-sm">
                <div className="px-4 md:px-6 border-r-[1px] border-airbnb-border flex-1 md:flex-none max-w-[140px] truncate">
                  {location || 'Anywhere'}
                </div>
                <div className="hidden sm:block px-4 md:px-6 border-r-[1px] border-airbnb-border flex-1 text-center truncate">
                  {checkIn ? `${formatDate(checkIn)}${checkOut ? ` - ${formatDate(checkOut)}` : ''}` : 'Any week'}
                </div>
                <div className="pl-4 md:pl-6 pr-2 text-airbnb-muted flex flex-row items-center gap-3">
                  <div className="hidden sm:block font-normal truncate max-w-[100px]">
                    {totalGuests > 0 ? (
                      `${totalGuests} guest${totalGuests !== 1 ? 's' : ''}${guestCounts.infants > 0 ? `, ${guestCounts.infants} infant${guestCounts.infants !== 1 ? 's' : ''}` : ''}`
                    ) : 'Add guests'}
                  </div>
                  <div className="w-8 h-8 md:w-8 md:h-8 bg-airbnb-red rounded-full text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95">
                    <Search size={12} strokeWidth={4} />
                  </div>
                </div>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex flex-row items-center gap-4 relative user-menu-container">
              <div className="hidden lg:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer">
                Airbnb your home
              </div>
              <div 
                onClick={(e) => { e.stopPropagation(); setIsUserMenuOpen(!isUserMenuOpen); }}
                className="p-1 md:py-2 md:px-3 border-[1px] border-airbnb-border flex flex-row items-center gap-3 rounded-[24px] cursor-pointer hover:shadow-airbnb-hover transition bg-white"
              >
                <Menu size={16} strokeWidth={3} />
                <div className="hidden md:block">
                  <UserCircle size={30} className="text-airbnb-muted" />
                </div>
              </div>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-[60px] w-64 bg-white rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.12)] border border-neutral-200 py-2 z-[60] overflow-hidden"
                  >
                    <div className="flex flex-col">
                      <div className="px-4 py-3 hover:bg-neutral-100 transition cursor-pointer font-semibold text-sm">Sign up</div>
                      <div className="px-4 py-3 hover:bg-neutral-100 transition cursor-pointer text-sm">Log in</div>
                      <div className="w-full h-[1px] bg-neutral-200 my-2"></div>
                      <div className="px-4 py-3 hover:bg-neutral-100 transition cursor-pointer text-sm">Airbnb your home</div>
                      <div className="px-4 py-3 hover:bg-neutral-100 transition cursor-pointer text-sm">Help Centre</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {showSearchOverlay && (
          <div className="fixed inset-0 z-[100] flex flex-col pt-10 px-4 md:px-20 bg-neutral-100/95 backdrop-blur-md overflow-y-auto pb-20">
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="w-full max-w-4xl mx-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex gap-8 text-lg font-medium">
                  <span className="border-b-2 border-black pb-2 cursor-pointer">Stays</span>
                  <span className="text-neutral-500 cursor-pointer">Experiences</span>
                </div>
                <button 
                  onClick={() => setShowSearchOverlay(false)}
                  className="p-2 bg-white rounded-full shadow-md hover:scale-110 transition"
                >
                  <X />
                </button>
              </div>

              <div className="bg-white rounded-3xl md:rounded-full border shadow-xl flex flex-col md:flex-row items-center overflow-hidden mb-6">
                <div 
                  onClick={() => setActiveSearchTab('where')}
                  className={`flex-1 w-full px-8 py-4 transition cursor-pointer ${activeSearchTab === 'where' ? 'bg-white shadow-lg z-10' : 'hover:bg-neutral-200'}`}
                >
                  <div className="text-xs font-bold uppercase">Where</div>
                  <input 
                    type="text" 
                    placeholder="Search destinations" 
                    className="bg-transparent outline-none w-full text-sm font-light" 
                    autoFocus 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="hidden md:block w-[1px] h-8 bg-neutral-200"></div>
                
                <div 
                  onClick={() => setActiveSearchTab('checkin')}
                  className={`flex-1 w-full px-8 py-4 transition cursor-pointer ${activeSearchTab === 'checkin' ? 'bg-white shadow-lg z-10' : 'hover:bg-neutral-200'}`}
                >
                  <div className="text-xs font-bold uppercase">Check in</div>
                  <div className={`text-sm font-light ${checkIn ? 'text-black' : 'text-neutral-500'}`}>
                    {checkIn ? formatDate(checkIn) : 'Add dates'}
                  </div>
                </div>
                <div className="hidden md:block w-[1px] h-8 bg-neutral-200"></div>
                
                <div 
                  onClick={() => setActiveSearchTab('checkout')}
                  className={`flex-1 w-full px-8 py-4 transition cursor-pointer ${activeSearchTab === 'checkout' ? 'bg-white shadow-lg z-10' : 'hover:bg-neutral-200'}`}
                >
                  <div className="text-xs font-bold uppercase">Check out</div>
                  <div className={`text-sm font-light ${checkOut ? 'text-black' : 'text-neutral-500'}`}>
                    {checkOut ? formatDate(checkOut) : 'Add dates'}
                  </div>
                </div>
                <div className="hidden md:block w-[1px] h-8 bg-neutral-200"></div>
                
                <div 
                  onClick={() => setActiveSearchTab('who')}
                  className={`flex-1 w-full px-8 py-4 transition cursor-pointer ${activeSearchTab === 'who' ? 'bg-white shadow-lg z-10' : 'hover:bg-neutral-200'} flex items-center justify-between gap-2`}
                >
                  <div className="flex-1">
                    <div className="text-xs font-bold uppercase">Who</div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-light">
                        {totalGuests > 0 ? (
                          `${totalGuests} guest${totalGuests !== 1 ? 's' : ''}${guestCounts.infants > 0 ? `, ${guestCounts.infants} infant${guestCounts.infants !== 1 ? 's' : ''}` : ''}`
                        ) : 'Add guests'}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={handleSearchClick}
                    className="flex items-center gap-2 bg-airbnb-red text-white py-3 px-6 rounded-full font-bold shadow-lg"
                  >
                    <Search size={18} />
                    <span>Search</span>
                  </button>
                </div>
              </div>

              {/* Calendar / Options View */}
              <div className="bg-white rounded-[32px] p-8 shadow-2xl max-w-2xl mx-auto">
                {activeSearchTab === 'where' && (
                  <div>
                    <h4 className="text-sm font-bold mb-4">Search by region</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {['I\'m flexible', 'India', 'Southeast Asia'].map(region => (
                        <div 
                          key={region}
                          onClick={() => { setLocation(region === 'I\'m flexible' ? '' : region); setActiveSearchTab('checkin'); }}
                          className="flex flex-col gap-2 cursor-pointer group"
                        >
                          <div className="aspect-video bg-neutral-100 rounded-xl border group-hover:border-black transition overflow-hidden">
                            <img src={`https://picsum.photos/seed/${region}/300/200`} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                          </div>
                          <span className="text-xs font-medium">{region}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(activeSearchTab === 'checkin' || activeSearchTab === 'checkout') && (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-between w-full mb-6">
                      <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-neutral-100 rounded-full transition">
                        <ChevronLeft size={20} />
                      </button>
                      <h4 className="text-lg font-bold">{monthName}</h4>
                      <button onClick={() => changeMonth(1)} className="p-2 hover:bg-neutral-100 rounded-full transition">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 w-full text-center">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} className="text-[10px] font-bold text-neutral-400 uppercase mb-2">{d}</div>)}
                      {calendarDays.map((date, idx) => {
                        if (!date) return <div key={`empty-${idx}`} className="h-12 w-full"></div>;
                        
                        const dateStr = date.toISOString();
                        const isCheckIn = checkIn === dateStr;
                        const isCheckOut = checkOut === dateStr;
                        const isInRange = checkIn && checkOut && dateStr > checkIn && dateStr < checkOut;
                        const isToday = new Date().toDateString() === date.toDateString();
                        
                        return (
                          <div 
                            key={dateStr}
                            onClick={() => handleDateClick(date)}
                            className={`h-12 w-full flex items-center justify-center cursor-pointer transition relative
                              ${isCheckIn || isCheckOut ? 'bg-black text-white rounded-full z-10' : ''}
                              ${isInRange ? 'bg-neutral-100' : 'hover:border rounded-full'}
                              ${isToday && !isCheckIn && !isCheckOut ? 'underline decoration-2 underline-offset-4 font-bold' : ''}
                            `}
                          >
                            <span className="text-sm font-medium">{date.getDate()}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeSearchTab === 'who' && (
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center pb-6 border-b border-neutral-100">
                      <div>
                        <div className="font-bold">Adults</div>
                        <div className="text-sm text-neutral-500 font-light">Ages 13 or above</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => updateGuestCount('adults', 'minus')} 
                          disabled={guestCounts.adults === 0 || (guestCounts.adults === 1 && (guestCounts.children > 0 || guestCounts.infants > 0))}
                          className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:border-black transition disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <span className="w-4 text-center font-normal">{guestCounts.adults}</span>
                        <button 
                          onClick={() => updateGuestCount('adults', 'plus')} 
                          className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:border-black transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pb-6 border-b border-neutral-100">
                      <div>
                        <div className="font-bold">Children</div>
                        <div className="text-sm text-neutral-500 font-light">Ages 2–12</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => updateGuestCount('children', 'minus')} 
                          disabled={guestCounts.children === 0}
                          className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:border-black transition disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <span className="w-4 text-center font-normal">{guestCounts.children}</span>
                        <button 
                          onClick={() => updateGuestCount('children', 'plus')} 
                          className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:border-black transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold">Infants</div>
                        <div className="text-sm text-neutral-500 font-light">Under 2</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => updateGuestCount('infants', 'minus')} 
                          disabled={guestCounts.infants === 0}
                          className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:border-black transition disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <span className="w-4 text-center font-normal">{guestCounts.infants}</span>
                        <button 
                          onClick={() => updateGuestCount('infants', 'plus')} 
                          className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:border-black transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

