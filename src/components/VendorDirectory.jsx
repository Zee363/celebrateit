import React, { useState } from 'react';

export default function VendorDirectory({
  vendors,
  onSelectVendor,
  onLogSearchMiss,
  onBackToDashboard
}) {
  const [selectedCelebration, setSelectedCelebration] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedArea, setSelectedArea] = useState('ALL');
  
  // Search Miss form state
  const [missCategory, setMissCategory] = useState('');
  const [missArea, setMissArea] = useState('Sandton');
  const [missLogged, setMissLogged] = useState(false);

  // Filter vendors (only live vendors)
  const filteredVendors = vendors.filter((v) => {
    if (!v.isLive) return false;
    
    if (selectedCelebration !== 'ALL') {
      if (v.celebrationsServed !== 'BOTH' && v.celebrationsServed !== selectedCelebration) {
        return false;
      }
    }

    if (selectedCategory !== 'ALL' && v.category !== selectedCategory) {
      return false;
    }

    if (selectedArea !== 'ALL' && !v.areasServed.includes(selectedArea)) {
      return false;
    }

    return true;
  });

  // Sort by Featured first then rating
  const sortedVendors = [...filteredVendors].sort((a, b) => {
    if (a.tier === 'FEATURED' && b.tier !== 'FEATURED') return -1;
    if (b.tier === 'FEATURED' && a.tier !== 'FEATURED') return 1;
    return (b.rating || 0) - (a.rating || 0);
  });

  const handleSearchMissSubmit = (e) => {
    e.preventDefault();
    if (!missCategory.trim()) return;

    onLogSearchMiss({
      id: 'sm_' + Date.now(),
      category: missCategory.trim(),
      area: missArea,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    });

    setMissLogged(true);
    setMissCategory('');
  };

  return (
    <div className="min-h-screen bg-[#F9F5F2] pt-28 pb-12 px-4 sm:px-6 lg:px-12 font-sans space-y-8">
      
      {/* Header Bar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E6DED6] pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#9E784B]">
            CURATED DIRECTORY
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#1A1816]">
            Find Vendors for Your Wedding
          </h1>
          <p className="text-xs sm:text-sm text-[#1A1816]/70">
            Browse verified local professionals serving traditional celebrations and white weddings in Gauteng.
          </p>
        </div>

        {onBackToDashboard && (
          <button
            onClick={onBackToDashboard}
            className="text-xs font-semibold bg-white border border-[#E6DED6] text-[#1A1816] px-4 py-2.5 rounded-lg hover:bg-stone-50 transition-colors"
          >
            ← Back to Dashboard
          </button>
        )}
      </div>

      <div className="max-w-7xl mx-auto space-y-8">

        {/* Filter Controls */}
        <div className="bg-white border border-[#E6DED6] rounded-2xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-xs">
          
          {/* Celebration Filter */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#1A1816]/80">Celebration Type</label>
            <select
              value={selectedCelebration}
              onChange={(e) => setSelectedCelebration(e.target.value)}
              className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3 py-2.5 text-xs text-[#1A1816] focus:outline-none focus:border-[#9E784B]"
            >
              <option value="ALL">All Celebrations (Both / Any)</option>
              <option value="TRADITIONAL">Traditional Celebration</option>
              <option value="WHITE">White Wedding</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#1A1816]/80">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3 py-2.5 text-xs text-[#1A1816] focus:outline-none focus:border-[#9E784B]"
            >
              <option value="ALL">All Categories</option>
              <option value="Venue">Venues</option>
              <option value="Photography">Photography & Videography</option>
              <option value="Catering">Catering & Banqueting</option>
              <option value="Attire">Bridal & Traditional Attire</option>
            </select>
          </div>

          {/* Area Filter */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#1A1816]/80">Area / Region</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3 py-2.5 text-xs text-[#1A1816] focus:outline-none focus:border-[#9E784B]"
            >
              <option value="ALL">All Areas (Gauteng)</option>
              <option value="Sandton">Sandton</option>
              <option value="Johannesburg">Johannesburg</option>
              <option value="Soweto">Soweto</option>
              <option value="Pretoria">Pretoria</option>
              <option value="Midrand">Midrand</option>
            </select>
          </div>

        </div>

        {/* Vendors Grid */}
        {sortedVendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedVendors.map((v) => (
              <div
                key={v.id}
                onClick={() => onSelectVendor(v)}
                className="bg-white border border-[#E6DED6] rounded-2xl overflow-hidden hover:border-[#9E784B] transition-all duration-200 cursor-pointer group shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 bg-stone-100 overflow-hidden">
                    <img
                      src={v.coverPhoto}
                      alt={v.businessName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-[#1A1816]/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wider uppercase">
                      {v.category}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-xl font-medium text-[#1A1816] group-hover:text-[#9E784B] transition-colors">
                        {v.businessName}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-semibold text-[#1A1816]">
                        <span>★</span> {v.rating} ({v.reviewsCount})
                      </div>
                    </div>

                    <p className="text-xs text-[#1A1816]/70 line-clamp-2 leading-relaxed">
                      {v.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] bg-[#F9F5F2] border border-[#E6DED6] px-2 py-0.5 rounded-xs text-[#9E784B] font-semibold">
                        Serves: {v.celebrationsServed === 'BOTH' ? 'Traditional & White' : v.celebrationsServed + ' Only'}
                      </span>
                      {v.areasServed.map((area, i) => (
                        <span key={i} className="text-[10px] bg-[#F9F5F2] border border-[#E6DED6] px-2 py-0.5 rounded-xs text-[#1A1816]/70">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-[#E6DED6]/50 flex items-center justify-between mt-4">
                  <div className="text-xs">
                    <span className="text-[#1A1816]/60">From </span>
                    <strong className="font-serif text-sm text-[#1A1816]">
                      R {v.priceFrom.toLocaleString('en-ZA')}
                    </strong>
                  </div>
                  <span className="text-xs font-semibold text-[#9E784B] group-hover:underline">
                    View details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Zero Results Fallback (SearchMiss trigger) */
          <div className="bg-white border border-[#E6DED6] rounded-2xl p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#F9F5F2] text-[#9E784B] border border-[#E6DED6] flex items-center justify-center mx-auto text-xl">
              <svg className="w-5 h-5 text-[#9E784B]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-medium text-[#1A1816]">
                No matching vendors found yet
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#1A1816]/70 max-w-lg mx-auto">
                We are constantly expanding our vetted network of local artisans and suppliers in Gauteng. Tell us who or what category you'd like to see!
              </p>
            </div>

            {missLogged ? (
              <div className="p-4 bg-[#9E784B]/10 border border-[#9E784B]/30 text-[#9E784B] rounded-xl text-xs font-semibold">
                Thank you! We've recorded your request and our recruiting team will source vendors for this gap.
              </div>
            ) : (
              <form onSubmit={handleSearchMissSubmit} className="space-y-4 max-w-md mx-auto text-left font-sans">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1A1816]/80">Vendor Category Needed</label>
                  <input
                    type="text"
                    required
                    value={missCategory}
                    onChange={(e) => setMissCategory(e.target.value)}
                    placeholder="e.g. Marimba Band, Traditional Beer Brewer"
                    className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3.5 py-2.5 text-xs text-[#1A1816]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1A1816]/80">Target Area</label>
                  <select
                    value={missArea}
                    onChange={(e) => setMissArea(e.target.value)}
                    className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3.5 py-2.5 text-xs text-[#1A1816]"
                  >
                    <option value="Sandton">Sandton</option>
                    <option value="Soweto">Soweto</option>
                    <option value="Johannesburg">Johannesburg</option>
                    <option value="Pretoria">Pretoria</option>
                    <option value="Midrand">Midrand</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#1A1816] text-white py-2.5 rounded-lg text-xs font-semibold hover:bg-[#2A2623] transition-colors cursor-pointer"
                >
                  Submit Request to CelebrateIT Team
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
