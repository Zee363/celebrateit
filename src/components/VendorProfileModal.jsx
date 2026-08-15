import React, { useState } from 'react';

export default function VendorProfileModal({ vendor, isOpen, onClose, onOpenEnquiry }) {
  const [selectedPackageIds, setSelectedPackageIds] = useState([]);

  if (!isOpen || !vendor) return null;

  const vendorPackages = vendor.packages || [];
  const hasPdfBrochure = Boolean(vendor.brochurePdfUrl);

  const togglePackageSelect = (pkgId) => {
    if (selectedPackageIds.includes(pkgId)) {
      setSelectedPackageIds(selectedPackageIds.filter(id => id !== pkgId));
    } else {
      setSelectedPackageIds([...selectedPackageIds, pkgId]);
    }
  };

  // Calculate estimated total based on selected packages
  const selectedPackages = vendorPackages.filter(p => selectedPackageIds.includes(p.id));
  const estimatedPackageTotal = selectedPackages.reduce((acc, p) => acc + p.price, 0);

  const handleSendEnquiryWithSelection = () => {
    onOpenEnquiry(vendor, selectedPackages, estimatedPackageTotal);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto font-sans">
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
                Serves: <strong className="text-[#1A1816]">{vendor.areasServed ? vendor.areasServed.join(', ') : 'Gauteng'}</strong>
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
        <div className="space-y-2 border-t border-[#E6DED6] pt-4 text-sm text-[#1A1816]/80 leading-relaxed">
          <h4 className="font-serif text-lg font-medium text-[#1A1816]">About {vendor.businessName}</h4>
          <p>{vendor.description}</p>
        </div>

        {/* Suitability & PDF Brochure Download */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-[#F9F5F2] border border-[#E6DED6] rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#1A1816]/80">Celebration Suitability</span>
              <div className="text-xs font-semibold text-[#9E784B]">
                {vendor.celebrationsServed === 'BOTH'
                  ? 'Equipped for Traditional & White Weddings'
                  : `Specialized in ${vendor.celebrationsServed} weddings only`}
              </div>
            </div>
          </div>

          {hasPdfBrochure ? (
            <a
              href={vendor.brochurePdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center justify-between hover:bg-emerald-100 transition-colors cursor-pointer group"
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">DOCUMENT DOWNLOAD</span>
                <div className="text-xs font-bold flex items-center gap-1.5 text-emerald-950">
                  {vendor.brochureFileName || 'Official Pricing Brochure (PDF)'}
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 group-hover:underline">Download →</span>
            </a>
          ) : (
            <div className="p-4 bg-[#F9F5F2] border border-[#E6DED6] rounded-xl text-xs text-[#1A1816]/60 flex items-center">
              <span>Custom quotes provided upon enquiry.</span>
            </div>
          )}
        </div>

        {/* NEW FEATURE: Bride Service Package Selection */}
        {vendorPackages.length > 0 && (
          <div className="space-y-3 border-t border-[#E6DED6] pt-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-serif text-lg font-medium text-[#1A1816]">Choose What You Need From {vendor.businessName}</h4>
                <p className="text-xs text-[#1A1816]/60">Select package options to build your tailored quote before sending an enquiry.</p>
              </div>

              {selectedPackageIds.length > 0 && (
                <div className="text-right">
                  <span className="text-[10px] uppercase font-semibold text-[#1A1816]/60">Estimated Selection</span>
                  <div className="font-serif font-bold text-lg text-[#9E784B]">
                    R {estimatedPackageTotal.toLocaleString('en-ZA')}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2.5">
              {vendorPackages.map((pkg) => {
                const isSelected = selectedPackageIds.includes(pkg.id);
                return (
                  <div
                    key={pkg.id}
                    onClick={() => togglePackageSelect(pkg.id)}
                    className={`p-4 rounded-xl border flex items-start gap-3 transition-all cursor-pointer ${isSelected
                        ? 'bg-[#9E784B]/10 border-[#9E784B] text-[#1A1816]'
                        : 'bg-[#F9F5F2] border-[#E6DED6] hover:border-[#9E784B]/60 text-[#1A1816]'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => { }}
                      className="mt-1 accent-[#9E784B] w-4 h-4 rounded-xs cursor-pointer"
                    />
                    <div className="space-y-0.5 text-xs w-full">
                      <div className="flex justify-between items-center font-semibold text-sm">
                        <span>{pkg.title}</span>
                        <span className="font-serif text-[#9E784B] font-bold">
                          R {pkg.price.toLocaleString('en-ZA')} {pkg.type === 'PER_GUEST' ? '/ guest' : ''}
                        </span>
                      </div>
                      {pkg.description && (
                        <p className="text-xs text-[#1A1816]/70">{pkg.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Gallery */}
        {vendor.photos?.length > 1 && (
          <div className="space-y-2 border-t border-[#E6DED6] pt-4">
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
        <div className="pt-4 border-t border-[#E6DED6] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#1A1816]/70">
            {selectedPackageIds.length > 0
              ? `${selectedPackageIds.length} item${selectedPackageIds.length > 1 ? 's' : ''} selected (Est: R ${estimatedPackageTotal.toLocaleString('en-ZA')})`
              : 'Direct enquiry without package pre-selection'}
          </div>

          <button
            onClick={handleSendEnquiryWithSelection}
            className="w-full sm:w-auto bg-[#1A1816] text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-[#2A2623] transition-all cursor-pointer shadow-xs"
          >
            {selectedPackageIds.length > 0 ? `Enquire with Selected Quote (R ${estimatedPackageTotal.toLocaleString('en-ZA')})` : `Send Enquiry to ${vendor.businessName}`}
          </button>
        </div>

      </div>
    </div>
  );
}

