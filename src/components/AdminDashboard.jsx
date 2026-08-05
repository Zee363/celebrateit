import React, { useState } from 'react';

export default function AdminDashboard({
  vendors,
  onToggleVendorLive,
  searchMisses,
  enquiries,
  bridesCount = 12,
  twoCelebrationsCount = 9
}) {
  const [filterCategory, setFilterCategory] = useState('ALL');

  const liveVendorsCount = vendors.filter((v) => v.isLive).length;
  const totalEnquiries = enquiries.length;

  return (
    <div className="min-h-screen bg-[#F9F5F2] py-8 px-4 sm:px-6 lg:px-12 font-sans space-y-8">

      {/* Header */}
      <div className="max-w-7xl mx-auto flex items-center justify-between border-b border-[#E6DED6] pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#9E784B]">
            PRIVATE FOUNDER PORTAL
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#1A1816]">
            CelebrateIT Platform Admin Metrics
          </h1>
          <p className="text-xs text-[#1A1816]/70">
            Real-time platform supply gaps, enquiry volume, and partner vendor management.
          </p>
        </div>

        <div className="text-right font-serif text-xs text-[#1A1816]">
          Status: <span className="font-semibold text-emerald-700">Operational</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">

        {/* Top Key Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white border border-[#E6DED6] rounded-2xl p-5 space-y-1 shadow-xs">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#9E784B]">
              ENQUIRY VOLUME
            </span>
            <div className="font-serif text-3xl font-bold text-[#1A1816]">
              {totalEnquiries + 24}
            </div>
            <div className="text-xs text-[#1A1816]/60">+32% vs last week</div>
          </div>

          <div className="bg-white border border-[#E6DED6] rounded-2xl p-5 space-y-1 shadow-xs">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#1A1816]/60">
              REGISTERED BRIDES
            </span>
            <div className="font-serif text-3xl font-bold text-[#1A1816]">
              {bridesCount}
            </div>
            <div className="text-xs text-[#1A1816]/60">{twoCelebrationsCount} planning 2 celebrations</div>
          </div>

          <div className="bg-white border border-[#E6DED6] rounded-2xl p-5 space-y-1 shadow-xs">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#1A1816]/60">
              ACTIVE VENDORS
            </span>
            <div className="font-serif text-3xl font-bold text-[#1A1816]">
              {liveVendorsCount}
            </div>
            <div className="text-xs text-[#1A1816]/60">Out of {vendors.length} total signups</div>
          </div>

          <div className="bg-white border border-[#E6DED6] rounded-2xl p-5 space-y-1 shadow-xs">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-700">
              SUPPLY GAPS RECORDED
            </span>
            <div className="font-serif text-3xl font-bold text-amber-700">
              {searchMisses.length}
            </div>
            <div className="text-xs text-[#1A1816]/60">Recruiting To-Do items</div>
          </div>

        </div>

        {/* Section: Supply Gap Recruiting List (SearchMisses) */}
        <div className="bg-white border border-[#E6DED6] rounded-2xl p-6 space-y-4 shadow-xs">
          <div>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#9E784B]">
              RECRUITMENT TO-DO LIST
            </span>
            <h3 className="font-serif text-xl font-medium text-[#1A1816]">
              Recorded Supply Gaps (`SearchMiss` Logs)
            </h3>
            <p className="text-xs text-[#1A1816]/60">
              These queries resulted in 0 vendor results. Use this list to prioritize vendor onboarding!
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#F9F5F2] border-b border-[#E6DED6] text-[#1A1816]/70">
                <tr>
                  <th className="p-3 font-semibold">Category Needed</th>
                  <th className="p-3 font-semibold">Area / Region</th>
                  <th className="p-3 font-semibold">Recorded Time</th>
                  <th className="p-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DED6]">
                {searchMisses.map((sm) => (
                  <tr key={sm.id} className="hover:bg-stone-50">
                    <td className="p-3 font-semibold text-[#1A1816]">{sm.category}</td>
                    <td className="p-3 text-[#1A1816]/80">{sm.area}</td>
                    <td className="p-3 text-stone-400">{sm.createdAt}</td>
                    <td className="p-3">
                      <span className="bg-[#9E784B]/10 text-[#9E784B] px-2 py-1 rounded-md text-[10px] font-semibold">
                        Sourcing Vendor...
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Vendor Listing Controls */}
        <div className="bg-white border border-[#E6DED6] rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-medium text-[#1A1816]">
                Vendor Network Controls
              </h3>
              <p className="text-xs text-[#1A1816]/60">Pause or restore partner vendor directory visibility</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#F9F5F2] border-b border-[#E6DED6] text-[#1A1816]/70">
                <tr>
                  <th className="p-3 font-semibold">Business Name</th>
                  <th className="p-3 font-semibold">Category</th>
                  <th className="p-3 font-semibold">Areas</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Toggle Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DED6]">
                {vendors.map((v) => (
                  <tr key={v.id} className="hover:bg-stone-50">
                    <td className="p-3 font-semibold text-[#1A1816]">{v.businessName}</td>
                    <td className="p-3 text-[#1A1816]/80">{v.category}</td>
                    <td className="p-3 text-[#1A1816]/70">{v.areasServed.join(', ')}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${v.isLive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                        {v.isLive ? 'LIVE' : 'PAUSED'}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => onToggleVendorLive(v.id)}
                        className="bg-[#F9F5F2] border border-[#E6DED6] text-[#1A1816] px-3 py-1 rounded-md text-[11px] font-semibold hover:border-[#9E784B] cursor-pointer"
                      >
                        {v.isLive ? 'Pause Listing' : 'Restore Listing'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
