import React from 'react';

export default function Footer({ onSwitchRole }) {
  return (
    <footer className="border-t border-[#E6DED6] bg-[#F9F5F2] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#1A1816]/70">
        <div>
          © 2026 CelebrateIT. Made with care in South Africa.
        </div>

        {/* Development & Role Quick Switchers */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onSwitchRole('BRIDE')}
            className="hover:text-[#1A1816] hover:underline underline-offset-4"
          >
            Bride Portal
          </button>
          <span className="text-[#E6DED6]">•</span>
          <button
            onClick={() => onSwitchRole('VENDOR')}
            className="hover:text-[#1A1816] hover:underline underline-offset-4"
          >
            Vendor Hub
          </button>
          <span className="text-[#E6DED6]">•</span>
          <button
            onClick={() => onSwitchRole('ADMIN')}
            className="hover:text-[#1A1816] hover:underline underline-offset-4"
          >
            Admin View
          </button>
        </div>
      </div>
    </footer>
  );
}
