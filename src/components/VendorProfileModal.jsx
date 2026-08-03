import React from 'react';

export default function VendorProfileModal({ vendor, isOpen, onClose, onOpenEnquiry }) {
  if (!isOpen || !vendor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-[#E6DED6] rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-[#1A1816] text-2xl font-bold cursor-pointer"
        >
          &times;
        </button>

        {/* Hero Photo & Category */}
        <div className="space-y-4">
          <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden bg-stone-100 border border-[#E6DED6]">
            <img
              src={vendor.coverPhoto}
              alt={vendor.businessName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#9E784B]">
                {vendor.category}
              </span>
              <h2 className="font-serif text-3xl font-medium text-[#1A1816]">
                {vendor.businessName}
              </h2>
              <div className="text-xs text-[#1A1816]/70 pt-1">
                Serves: <strong className="text-[#1A1816]">{vendor.areasServed.join(', ')}</strong>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs text-[#1A1816]/60">Starting from</div>
              <div className="font-serif text-2xl font-bold text-[#1A1816]">
                R {vendor.priceFrom?.toLocaleString('en-ZA')}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 border-t border-[#E6DED6] pt-4 font-sans text-sm text-[#1A1816]/80 leading-relaxed">
          <h4 className="font-serif text-lg font-medium text-[#1A1816]">About {vendor.businessName}</h4>
          <p>{vendor.description}</p>
        </div>

        {/* Suitability for Celebrations */}
        <div className="p-4 bg-[#F9F5F2] border border-[#E6DED6] rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#1A1816]/80">Celebration Suitability</span>
            <div className="text-sm font-semibold text-[#9E784B]">
              {vendor.celebrationsServed === 'BOTH'
                ? 'Equipped for Traditional Celebrations & White Weddings'
                : `Specialized in ${vendor.celebrationsServed} weddings only`}
            </div>
          </div>
        </div>

        {/* Gallery */}
        {vendor.photos?.length > 1 && (
          <div className="space-y-2 font-sans">
            <h4 className="font-serif text-lg font-medium text-[#1A1816]">Portfolio Gallery</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {vendor.photos.map((photo, i) => (
                <img
                  key={i}
                  src={photo}
                  alt={`Portfolio ${i + 1}`}
                  className="w-full h-28 object-cover rounded-lg border border-[#E6DED6]"
                />
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 border-t border-[#E6DED6] flex justify-end">
          <button
            onClick={() => onOpenEnquiry(vendor)}
            className="w-full sm:w-auto bg-[#1A1816] text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-[#2A2623] transition-all cursor-pointer shadow-xs"
          >
            Send Enquiry to {vendor.businessName}
          </button>
        </div>

      </div>
    </div>
  );
}
