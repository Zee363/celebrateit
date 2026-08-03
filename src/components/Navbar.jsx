import React from 'react';

export default function Navbar({ onOpenAuth, currentUser, onOpenDashboard, onLogout }) {
  return (
    <header className="sticky top-0 z-40 bg-[#F9F5F2]/90 backdrop-blur-md border-b border-[#E6DED6]/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-[#1A1816] text-[#F9F5F2] flex items-center justify-center font-serif text-sm font-bold tracking-tighter group-hover:scale-105 transition-transform">
            C
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[#1A1816]">
            Celebrate<span className="font-normal italic text-[#9E784B]">IT</span>
          </span>
        </a>

        {/* Navigation CTAs */}
        <div className="flex items-center gap-6">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <button
                onClick={onOpenDashboard}
                className="font-sans text-sm font-medium text-[#1A1816] hover:text-[#9E784B] transition-colors"
              >
                My Workspace ({currentUser.name})
              </button>
              <button
                onClick={onLogout}
                className="font-sans text-xs text-stone-500 hover:text-[#1A1816] underline underline-offset-4"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('login')}
                className="font-sans text-sm font-medium text-[#1A1816] hover:opacity-75 transition-opacity px-2 py-1"
              >
                Log in
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="font-sans text-sm font-medium bg-[#1A1816] text-white px-5 py-2.5 rounded-lg hover:bg-[#2A2623] transition-all shadow-xs cursor-pointer active:scale-95"
              >
                Get started
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
