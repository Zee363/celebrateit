import React, { useState, useEffect } from 'react';
import { CelebrateLogo } from './CustomIcons';

export default function Navbar({
  onOpenAuth,
  currentUser,
  onNavigate,
  currentView,
  onLogout
}) {
  const [scrollUp, setScrollUp] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setScrolled(currentScrollY > 20);

      if (currentScrollY > 40 && currentScrollY < lastScrollY) {
        // User scrolling UP
        setScrollUp(true);
      } else {
        // User scrolling DOWN or at top
        setScrollUp(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper to extract initials
  const getInitials = (name) => {
    if (!name) return 'LN';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(currentUser?.name);

  return (
    <header 
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#F9F5F2]/65 backdrop-blur-xl border border-white/60 rounded-full px-5 py-2 shadow-md flex items-center justify-between transition-all duration-300 ease-in-out font-sans ${
        scrollUp 
          ? 'w-[70%] max-w-2xl py-1.5 px-4 shadow-lg bg-[#F9F5F2]/80' 
          : 'w-[90%] max-w-4xl py-2 px-6'
      }`}
    >
      
      {/* Left: Brand Logo */}
      <div className="flex items-center flex-1">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 group cursor-pointer focus:outline-none"
        >
          <CelebrateLogo className="h-6 sm:h-7 transition-all" />
        </button>
      </div>

      {/* Middle: Navigation Links */}
      {currentUser?.role === 'BRIDE' && (
        <nav className="hidden md:flex items-center justify-center gap-5 sm:gap-7 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#1A1816]/70 flex-1">
          <button
            onClick={() => onNavigate('bride_dashboard')}
            className={`hover:text-[#1A1816] transition-colors cursor-pointer whitespace-nowrap ${
              currentView === 'bride_dashboard' ? 'text-[#9E784B] underline underline-offset-6 decoration-2' : ''
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('vendor_directory')}
            className={`hover:text-[#1A1816] transition-colors cursor-pointer whitespace-nowrap ${
              currentView === 'vendor_directory' ? 'text-[#9E784B] underline underline-offset-6 decoration-2' : ''
            }`}
          >
            Vendors
          </button>
          <button
            onClick={() => onNavigate('messages')}
            className={`hover:text-[#1A1816] transition-colors cursor-pointer whitespace-nowrap ${
              currentView === 'messages' ? 'text-[#9E784B] underline underline-offset-6 decoration-2' : ''
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => onNavigate('planning_together')}
            className={`hover:text-[#1A1816] transition-colors cursor-pointer whitespace-nowrap ${
              currentView === 'planning_together' ? 'text-[#9E784B] underline underline-offset-6 decoration-2' : ''
            }`}
          >
            Planning Together
          </button>
        </nav>
      )}

      {currentUser?.role === 'VENDOR' && (
        <nav className="hidden md:flex items-center justify-center gap-5 sm:gap-7 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#1A1816]/70 flex-1">
          <button
            onClick={() => onNavigate('vendor_dashboard')}
            className={`hover:text-[#1A1816] transition-colors cursor-pointer whitespace-nowrap ${
              currentView === 'vendor_dashboard' ? 'text-[#9E784B] underline underline-offset-6 decoration-2' : ''
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('vendor_editor')}
            className={`hover:text-[#1A1816] transition-colors cursor-pointer whitespace-nowrap ${
              currentView === 'vendor_editor' ? 'text-[#9E784B] underline underline-offset-6 decoration-2' : ''
            }`}
          >
            Edit Listing
          </button>
          <button
            onClick={() => onNavigate('messages')}
            className={`hover:text-[#1A1816] transition-colors cursor-pointer whitespace-nowrap ${
              currentView === 'messages' ? 'text-[#9E784B] underline underline-offset-6 decoration-2' : ''
            }`}
          >
            Enquiries
          </button>
          <button
            onClick={() => onNavigate('vendor_directory')}
            className={`hover:text-[#1A1816] transition-colors cursor-pointer whitespace-nowrap ${
              currentView === 'vendor_directory' ? 'text-[#9E784B] underline underline-offset-6 decoration-2' : ''
            }`}
          >
            Directory Preview
          </button>
        </nav>
      )}

      {/* Right: Auth / Profile */}
      <div className="flex items-center justify-end gap-3 flex-1">
        {currentUser ? (
          <div className="flex items-center gap-3">
            {currentUser.role === 'BRIDE' ? (
              // Avatar Badge linking to Settings
              <button
                onClick={() => onNavigate('account_settings')}
                className="w-8 h-8 rounded-full border border-[#E6DED6] bg-white flex items-center justify-center text-xs font-bold text-[#9E784B] shadow-xs hover:border-[#9E784B] transition-colors cursor-pointer overflow-hidden"
              >
                {currentUser.hasPhoto ? (
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </button>
            ) : (
              // Badge for Vendors / Admins
              <div className="px-2.5 py-1 rounded-full border border-[#E6DED6] bg-white flex items-center justify-center text-[10px] font-bold text-[#9E784B] shadow-xs">
                {currentUser.role === 'VENDOR' ? 'V' : 'A'}
              </div>
            )}
            
            <button
              onClick={onLogout}
              className="font-sans text-[11px] text-stone-500 hover:text-[#1A1816] underline underline-offset-4 cursor-pointer hidden sm:block"
            >
              Sign out
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => onOpenAuth('login')}
              className="font-sans text-xs font-medium text-[#1A1816] hover:opacity-75 transition-opacity px-2 py-1 cursor-pointer"
            >
              Log in
            </button>
            <button
              onClick={() => onOpenAuth('signup')}
              className="font-sans text-xs font-medium bg-[#1A1816] text-white px-4 py-2 rounded-full hover:bg-[#2A2623] transition-all shadow-xs cursor-pointer active:scale-95"
            >
              Get started
            </button>
          </>
        )}
      </div>

    </header>
  );
}
