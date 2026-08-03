import React from 'react';

export default function HeroSection({ onPlanClick, onVendorClick }) {
  return (
    <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 lg:pr-4">
            <div className="inline-block">
              <span className="font-sans text-xs font-semibold tracking-widest uppercase text-[#9E784B]">
                FOR SOUTH AFRICAN BRIDES
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] font-medium leading-[1.12] text-[#1A1816] tracking-tight">
              Plan your traditional celebration and your white wedding, together.
            </h1>

            <p className="font-sans text-base sm:text-lg text-[#1A1816]/80 leading-relaxed max-w-xl">
              One calm home for both of your big days — the budget, the checklist, the family, the venues. Made for brides in Johannesburg, Sandton, Pretoria, Midrand and Soweto.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onPlanClick}
                className="font-sans text-sm font-semibold bg-[#1A1816] text-white px-7 py-3.5 rounded-lg hover:bg-[#2A2623] transition-all shadow-xs cursor-pointer active:scale-95"
              >
                Plan my weddings
              </button>
              <button
                onClick={onVendorClick}
                className="font-sans text-sm font-semibold bg-[#FFFFFF] text-[#1A1816] border border-[#E6DED6] px-7 py-3.5 rounded-lg hover:bg-stone-50 hover:border-[#1A1816]/30 transition-all cursor-pointer active:scale-95"
              >
                List my business
              </button>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-2xl overflow-hidden border border-[#E6DED6] shadow-sm bg-[#FFFFFF]">
                <img
                  src="/hero-wedding.png"
                  alt="Elegant South African wedding table setting with romantic flowers and crystal tableware"
                  className="w-full h-[460px] sm:h-[540px] object-cover object-center"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
