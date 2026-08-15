import React from 'react';
import { CelebrateLogo } from './CustomIcons';

export default function Footer() {
  return (
    <footer className="border-t border-[#E6DED6] bg-[#F9F5F2] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-sans text-[#1A1816]/70">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <CelebrateLogo className="h-6 opacity-80" />
          <span>© 2026 Celebrate IT. Made with care in South Africa.</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-[#1A1816]/60">
          <span>Gauteng • Sandton • Soweto • Pretoria</span>
        </div>
      </div>
    </footer>
  );
}

