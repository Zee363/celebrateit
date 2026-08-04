import React from 'react';

export default function VendorDashboard({
  vendor,
  enquiries,
  onOpenListingEditor,
  onOpenInbox
}) {
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'SENT' || e.status === 'REPLIED').length;
  const bookedCount = enquiries.filter((e) => e.status === 'BOOKED').length;

  return (
    <div className="min-h-screen bg-[#F9F5F2] pt-28 pb-12 px-4 sm:px-6 lg:px-12 font-sans space-y-8">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E6DED6] pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#9E784B]">
            VENDOR PORTAL
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#1A1816]">
            {vendor.businessName}
          </h1>
          <p className="text-xs sm:text-sm text-[#1A1816]/70">
            Self-serve listing & enquiry management in Gauteng.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenListingEditor}
            className="bg-[#1A1816] text-white px-5 py-2.5 rounded-lg font-semibold text-xs sm:text-sm hover:bg-[#2A2623] transition-all cursor-pointer shadow-xs"
          >
            Edit Profile Listing
          </button>
          <button
            onClick={onOpenInbox}
            className="bg-[#9E784B] text-white px-5 py-2.5 rounded-lg font-semibold text-xs sm:text-sm hover:bg-[#8A673E] transition-all cursor-pointer shadow-xs"
          >
            Enquiry Inbox ({newEnquiriesCount})
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">

        {/* Top Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white border border-[#E6DED6] rounded-2xl p-5 space-y-1 shadow-xs">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#9E784B]">
              ACTION REQUIRED
            </span>
            <div className="font-serif text-3xl font-bold text-[#1A1816]">
              {newEnquiriesCount}
            </div>
            <div className="text-xs text-[#1A1816]/60">Active Enquiries</div>
          </div>

          <div className="bg-white border border-[#E6DED6] rounded-2xl p-5 space-y-1 shadow-xs">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#1A1816]/60">
              30-DAY STATS
            </span>
            <div className="font-serif text-3xl font-bold text-[#1A1816]">
              142
            </div>
            <div className="text-xs text-[#1A1816]/60">Profile Views</div>
          </div>

          <div className="bg-white border border-[#E6DED6] rounded-2xl p-5 space-y-1 shadow-xs">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#1A1816]/60">
              CONFIRMED
            </span>
            <div className="font-serif text-3xl font-bold text-[#1A1816]">
              {bookedCount}
            </div>
            <div className="text-xs text-[#1A1816]/60">Bookings Secured</div>
          </div>

          <div className="bg-white border border-[#E6DED6] rounded-2xl p-5 space-y-1 shadow-xs">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#1A1816]/60">
              LISTING SCORE
            </span>
            <div className="font-serif text-3xl font-bold text-[#9E784B]">
              {vendor.completenessScore}%
            </div>
            <div className="text-xs text-[#1A1816]/60">
              {vendor.isLive ? '🟢 Live in Directory' : '🟡 Draft'}
            </div>
          </div>

        </div>

        {/* Recent Enquiries List */}
        <div className="bg-white border border-[#E6DED6] rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E6DED6] pb-4">
            <div>
              <h3 className="font-serif text-xl font-medium text-[#1A1816]">
                Incoming Bride Enquiries
              </h3>
              <p className="text-xs text-[#1A1816]/60">Click an enquiry to open the conversation thread</p>
            </div>
            <button
              onClick={onOpenInbox}
              className="text-xs font-semibold text-[#9E784B] hover:underline"
            >
              Open Inbox View →
            </button>
          </div>

          <div className="space-y-3">
            {enquiries.length > 0 ? (
              enquiries.map((e) => (
                <div
                  key={e.id}
                  onClick={onOpenInbox}
                  className="p-4 bg-[#F9F5F2] border border-[#E6DED6] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#9E784B] transition-colors cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-base font-medium text-[#1A1816]">{e.brideName}</span>
                      <span className="text-[10px] bg-[#9E784B]/10 text-[#9E784B] px-2 py-0.5 rounded-xs font-semibold">
                        {e.status}
                      </span>
                    </div>
                    <div className="text-xs text-[#1A1816]/70">
                      {e.celebrationType} • {e.date} • {e.area} ({e.guestCount} guests)
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-[#1A1816]/60">Budget Band</div>
                    <div className="font-serif text-sm font-semibold text-[#1A1816]">
                      {e.budgetBand}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-stone-400">
                No enquiries received yet. Check that your listing is published and live!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
