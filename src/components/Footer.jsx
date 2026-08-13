import React from 'react';
import { CelebrateLogo } from './CustomIcons';

export default function Footer({ onSwitchRole }) {
  return (
    <footer className="border-t border-[#E6DED6] bg-[#F9F5F2] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-sans text-[#1A1816]/70">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <CelebrateLogo className="h-6 opacity-80" />
          <span>© 2026 Celebrate IT. Made with care in South Africa.</span>
        </div>

        {/* Role Switcher for Development/Testing */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-[#1A1816]/60">Switch Role:</span>
          <button
            onClick={() => onSwitchRole('BRIDE')}
            className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-white border border-[#E6DED6] text-[#1A1816] hover:border-[#9E784B] cursor-pointer transition-all"
          >
            Bride
          </button>
          <button
            onClick={() => onSwitchRole('VENDOR')}
            className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-white border border-[#E6DED6] text-[#1A1816] hover:border-[#9E784B] cursor-pointer transition-all"
          >
            Vendor
          </button>
          <button
            onClick={() => onSwitchRole('ADMIN')}
            className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-white border border-[#E6DED6] text-[#1A1816] hover:border-[#9E784B] cursor-pointer transition-all"
          >
            Admin
          </button>
        </div>
      </div>
    </footer>
  );
}
