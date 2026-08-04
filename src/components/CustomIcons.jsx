import React from 'react';

// Official Brand Logo (Interlocking Gold Rings with Diamond + 3 Sparkle Stars + Celebrate IT text)
export function CelebrateLogo({ className = 'h-8', light = false }) {
  const textClass = light ? 'text-white' : 'text-[#1A1816]';
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <svg className="w-11 h-8 shrink-0" viewBox="0 0 54 40" fill="none">
        {/* Left 4-point sparkle star */}
        <path d="M11 16c0 2.5-1.2 3.8-3.8 3.8 2.6 0 3.8 1.2 3.8 3.8 0-2.6 1.2-3.8 3.8-3.8-2.6 0-3.8-1.2-3.8-3.8z" fill="#9E784B" />
        
        {/* Top-center 4-point sparkle star */}
        <path d="M26 4c0 2.2-1.1 3.3-3.3 3.3 2.2 0 3.3 1.1 3.3 3.3 0-2.2 1.1-3.3 3.3-3.3-2.2 0-3.3-1.1-3.3-3.3z" fill="#9E784B" />
        
        {/* Right 4-point sparkle star */}
        <path d="M47 15c0 2-1 3-3 3 2 0 3 1 3 3 0-2 1-3 3-3-2 0-3-1-3-3z" fill="#9E784B" />

        {/* Interlocking Rings */}
        <circle cx="21" cy="25" r="9.5" stroke="#9E784B" strokeWidth="1.5" />
        <circle cx="33" cy="25" r="9.5" stroke="#9E784B" strokeWidth="1.5" />

        {/* Solitaire Diamond on top of the Right Ring */}
        <g stroke="#9E784B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <polygon points="30,15 36,15 39,11 27,11" fill="#FFFFFF" />
          <polygon points="27,11 39,11 33,6" fill="#FFFFFF" />
          <line x1="33" y1="6" x2="33" y2="15" />
          <line x1="30" y1="15" x2="33" y2="11" />
          <line x1="36" y1="15" x2="33" y2="11" />
        </g>
      </svg>
      <span className={`font-serif text-xl sm:text-2xl font-medium tracking-tight ${textClass}`}>
        Celebrate IT
      </span>
    </div>
  );
}

// Muse Icon (An elegant serif 'M' in a gold-accented badge)
export function MuseIcon({ className = 'w-10 h-10' }) {
  return (
    <div className={`rounded-full bg-[#1A1816] text-[#9E784B] flex items-center justify-center font-serif font-medium border border-[#9E784B]/40 shadow-xs select-none ${className}`}>
      <span className="text-xl font-serif tracking-tight leading-none">M</span>
    </div>
  );
}

// Mini Muse Mark (An M mark for chat bubbles and badges)
export function MiniMuseMark({ className = 'w-7 h-7' }) {
  return (
    <div className={`rounded-full bg-[#1A1816] text-[#9E784B] flex items-center justify-center font-serif font-medium border border-[#9E784B]/40 shrink-0 select-none ${className}`}>
      <span className="text-xs font-serif leading-none">M</span>
    </div>
  );
}

// Feature 1: Splits your budget (Dual circles representing traditional & white split down the center)
export function FeatureBudgetIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="14" r="5" stroke="#9E784B" />
      <circle cx="15" cy="14" r="5" />
      <line x1="12" y1="5" x2="12" y2="19" stroke="#9E784B" strokeDasharray="3 3" />
      <path d="M8 8a4 4 0 0 1 8 0" />
    </svg>
  );
}

// Feature 2: Checklist (Double checkboxes linked together)
export function FeatureChecklistIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {/* First checklist box */}
      <rect x="3" y="5" width="8" height="8" rx="1.5" stroke="#9E784B" />
      <polyline points="5 9 7 11 9 7" stroke="#9E784B" />
      {/* Second checklist box */}
      <rect x="13" y="11" width="8" height="8" rx="1.5" />
      <polyline points="15 15 17 17 19 13" />
      {/* Connecting link */}
      <path d="M11 9h2v2" stroke="#9E784B" strokeDasharray="2 2" />
    </svg>
  );
}

// Feature 3: Finds vendors (Storefront with interlocking rings in the archway)
export function FeatureDirectoryIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-6 9 6v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
      <polyline points="9 22 9 14 15 14 15 22" />
      <circle cx="10.5" cy="10" r="2.5" stroke="#9E784B" />
      <circle cx="13.5" cy="10" r="2.5" stroke="#9E784B" />
    </svg>
  );
}

// Feature 4: Keeps two dates from clashing (Overlapping calendars with a link)
export function FeatureClashIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {/* Back calendar */}
      <rect x="3" y="4" width="12" height="12" rx="1.5" stroke="#9E784B" />
      <line x1="3" y1="8" x2="15" y2="8" stroke="#9E784B" />
      {/* Front calendar */}
      <rect x="9" y="8" width="12" height="12" rx="1.5" />
      <line x1="9" y1="12" x2="21" y2="12" />
      {/* Link between dates */}
      <path d="M11 6a2 2 0 0 1 4 4" stroke="#9E784B" strokeDasharray="2 2" />
    </svg>
  );
}

// Padlock security icon
export function PadlockIcon({ className = 'w-4 h-4 text-stone-400' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
