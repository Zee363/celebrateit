import React, { useState, useEffect } from 'react';

export default function VendorListingEditor({ vendor, onSaveVendor, onBackToDashboard }) {
  const [businessName, setBusinessName] = useState(vendor?.businessName || '');
  const [category, setCategory] = useState(vendor?.category || 'Venue');
  const [priceFrom, setPriceFrom] = useState(vendor?.priceFrom || 15000);
  const [celebrationsServed, setCelebrationsServed] = useState(vendor?.celebrationsServed || 'BOTH');
  const [description, setDescription] = useState(vendor?.description || '');
  const [coverPhoto, setCoverPhoto] = useState(vendor?.coverPhoto || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80');
  const [areas, setAreas] = useState(vendor?.areasServed || ['Sandton', 'Johannesburg']);

  // PDF Brochure & Service Packages state
  const [brochurePdfUrl, setBrochurePdfUrl] = useState(vendor?.brochurePdfUrl || '');
  const [brochureFileName, setBrochureFileName] = useState(vendor?.brochureFileName || '');
  const [packages, setPackages] = useState(vendor?.packages || [
    { id: 'p_1', title: 'Main Package Service', price: 15000, type: 'FIXED', description: 'Comprehensive package tailored for weddings' }
  ]);

  // Package builder draft input
  const [newPkgTitle, setNewPkgTitle] = useState('');
  const [newPkgPrice, setNewPkgPrice] = useState('');
  const [newPkgType, setNewPkgType] = useState('FIXED');
  const [newPkgDesc, setNewPkgDesc] = useState('');

  // Initialize form when vendor changes
  useEffect(() => {
    if (vendor) {
      setBusinessName(vendor.businessName || '');
      setCategory(vendor.category || 'Venue');
      setPriceFrom(vendor.priceFrom ?? 15000);
      setCelebrationsServed(vendor.celebrationsServed || 'BOTH');
      setDescription(vendor.description || '');
      setCoverPhoto(vendor.coverPhoto || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80');
      setAreas(vendor.areasServed && Array.isArray(vendor.areasServed) ? vendor.areasServed : []);
      setBrochurePdfUrl(vendor.brochurePdfUrl || '');
      setBrochureFileName(vendor.brochureFileName || '');
      setPackages(vendor.packages || []);
    }
  }, [vendor?.id]);

  // Calculate completeness score automatically
  let score = 0;
  if (businessName.trim()) score += 20;
  if (category) score += 15;
  if (priceFrom > 0) score += 15;
  if (description.length > 20) score += 20;
  if (coverPhoto) score += 15;
  if (areas.length > 0) score += 15;

  const isLive = score >= 70;

  const toggleArea = (areaName) => {
    if (areas.includes(areaName)) {
      setAreas(areas.filter((a) => a !== areaName));
    } else {
      setAreas([...areas, areaName]);
    }
  };

  const handleAddPackage = (e) => {
    e.preventDefault();
    if (!newPkgTitle.trim() || !newPkgPrice) return;

    const newPkg = {
      id: 'pkg_' + Date.now(),
      title: newPkgTitle.trim(),
      price: Number(newPkgPrice),
      type: newPkgType,
      description: newPkgDesc.trim()
    };

    setPackages([...packages, newPkg]);
    setNewPkgTitle('');
    setNewPkgPrice('');
    setNewPkgDesc('');
  };

  const handleDeletePackage = (pkgId) => {
    setPackages(packages.filter(p => p.id !== pkgId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedVendor = {
      ...vendor,
      id: vendor?.id || 'v_' + Date.now(),
      businessName,
      category,
      priceFrom: Number(priceFrom),
      celebrationsServed,
      description,
      coverPhoto,
      areasServed: areas,
      brochurePdfUrl,
      brochureFileName: brochureFileName || (brochurePdfUrl ? 'Brochure_Pricing.pdf' : ''),
      packages,
      completenessScore: score,
      isLive: isLive,
      rating: vendor?.rating || 5.0,
      reviewsCount: vendor?.reviewsCount || 1,
      tier: vendor?.tier || 'STANDARD',
      photos: vendor?.photos || [coverPhoto]
    };

    onSaveVendor(updatedVendor);
  };

  return (
    <div className="min-h-screen bg-[#F9F5F2] pt-28 pb-12 px-4 sm:px-6 lg:px-12 font-sans space-y-8">

      {/* Header */}
      <div className="max-w-4xl mx-auto flex items-center justify-between border-b border-[#E6DED6] pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#9E784B]">
            VENDOR LISTING EDITOR
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#1A1816]">
            Edit Business Profile & Pricing Packages
          </h1>
          <p className="text-xs text-[#1A1816]/70">
            Listings auto-publish as soon as completeness passes 70%. Upload brochures and custom service options.
          </p>
        </div>

        <button
          onClick={onBackToDashboard}
          className="text-xs font-semibold bg-white border border-[#E6DED6] text-[#1A1816] px-4 py-2.5 rounded-lg hover:bg-stone-50 transition-colors"
        >
          ← Dashboard
        </button>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Main Form (8 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 bg-white border border-[#E6DED6] rounded-2xl p-6 space-y-6 shadow-xs">

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#1A1816]/80">Business Name</label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Royal Heritage Decor"
              className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3.5 py-2.5 text-sm text-[#1A1816] focus:outline-none focus:border-[#9E784B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1A1816]/80">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3 py-2.5 text-xs text-[#1A1816]"
              >
                <option value="Venue">Venue</option>
                <option value="Photography">Photography</option>
                <option value="Catering">Catering</option>
                <option value="Attire">Attire</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1A1816]/80">Starting Price (Rands)</label>
              <input
                type="number"
                required
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value)}
                className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3 py-2.5 text-xs text-[#1A1816]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#1A1816]/80">Celebrations Served (Required)</label>
            <div className="grid grid-cols-3 gap-2">
              {['BOTH', 'TRADITIONAL', 'WHITE'].map((choice) => (
                <button
                  type="button"
                  key={choice}
                  onClick={() => setCelebrationsServed(choice)}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold text-center transition-all ${celebrationsServed === choice
                      ? 'border-[#9E784B] bg-[#9E784B]/10 text-[#9E784B]'
                      : 'border-[#E6DED6] bg-white text-[#1A1816]/70'
                    }`}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#1A1816]/80">Gauteng Areas Served</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {['Sandton', 'Johannesburg', 'Soweto', 'Pretoria', 'Midrand'].map((area) => (
                <button
                  type="button"
                  key={area}
                  onClick={() => toggleArea(area)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${areas.includes(area)
                      ? 'border-[#1A1816] bg-[#1A1816] text-white'
                      : 'border-[#E6DED6] bg-white text-[#1A1816]/70'
                    }`}
                >
                  {area} {areas.includes(area) ? '(Selected)' : ''}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#1A1816]/80">Cover Photo Image URL</label>
            <input
              type="text"
              value={coverPhoto}
              onChange={(e) => setCoverPhoto(e.target.value)}
              className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3 py-2 text-xs text-[#1A1816]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#1A1816]/80">Business Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your services, traditions catered for, and unique selling points..."
              className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg p-3 text-xs text-[#1A1816] focus:outline-none focus:border-[#9E784B]"
            />
          </div>

          {/* NEW FEATURE: PDF Brochure Upload / Link */}
          <div className="border-t border-[#E6DED6] pt-4 space-y-3">
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-[#1A1816]">PDF Price List / Brochure (Optional)</label>
              <p className="text-[11px] text-[#1A1816]/60">Allow brides to download and peruse your full PDF catalog directly from your listing.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[#1A1816]/70">PDF Document URL</label>
                <input
                  type="url"
                  value={brochurePdfUrl}
                  onChange={(e) => setBrochurePdfUrl(e.target.value)}
                  placeholder="https://.../brochure.pdf"
                  className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3 py-2 text-xs text-[#1A1816] mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#1A1816]/70">Display File Name</label>
                <input
                  type="text"
                  value={brochureFileName}
                  onChange={(e) => setBrochureFileName(e.target.value)}
                  placeholder="e.g. Venue_Packages_2026.pdf"
                  className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3 py-2 text-xs text-[#1A1816] mt-1"
                />
              </div>
            </div>
          </div>

          {/* NEW FEATURE: Custom Service Packages Builder */}
          <div className="border-t border-[#E6DED6] pt-4 space-y-4">
            <div>
              <label className="text-xs font-bold text-[#1A1816]">Custom Service Packages & Items</label>
              <p className="text-[11px] text-[#1A1816]/60">Brides can check off these specific items when viewing your profile to build custom quotes!</p>
            </div>

            {/* List Existing Packages */}
            <div className="space-y-2">
              {packages.map((pkg) => (
                <div key={pkg.id} className="p-3 bg-[#F9F5F2] border border-[#E6DED6] rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-[#1A1816]">
                      {pkg.title} — <span className="text-[#9E784B] font-serif font-bold">R {pkg.price.toLocaleString('en-ZA')}</span> {pkg.type === 'PER_GUEST' ? '/ guest' : ''}
                    </div>
                    {pkg.description && <p className="text-[11px] text-[#1A1816]/70">{pkg.description}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeletePackage(pkg.id)}
                    className="text-red-600 hover:text-red-800 font-semibold text-xs cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Package Sub-form */}
            <div className="p-4 border border-dashed border-[#9E784B]/40 rounded-xl bg-[#9E784B]/5 space-y-3">
              <h5 className="text-xs font-bold text-[#9E784B] uppercase tracking-wider">+ Add Package / Service Option</h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={newPkgTitle}
                  onChange={(e) => setNewPkgTitle(e.target.value)}
                  placeholder="Service Title (e.g. Drone Footage)"
                  className="bg-white border border-[#E6DED6] rounded-lg px-2.5 py-1.5 text-xs text-[#1A1816]"
                />
                <input
                  type="number"
                  value={newPkgPrice}
                  onChange={(e) => setNewPkgPrice(e.target.value)}
                  placeholder="Price (R)"
                  className="bg-white border border-[#E6DED6] rounded-lg px-2.5 py-1.5 text-xs text-[#1A1816]"
                />
                <select
                  value={newPkgType}
                  onChange={(e) => setNewPkgType(e.target.value)}
                  className="bg-white border border-[#E6DED6] rounded-lg px-2.5 py-1.5 text-xs text-[#1A1816]"
                >
                  <option value="FIXED">Fixed Total Price</option>
                  <option value="PER_GUEST">Per Guest Price</option>
                </select>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPkgDesc}
                  onChange={(e) => setNewPkgDesc(e.target.value)}
                  placeholder="Short description of what is included..."
                  className="w-full bg-white border border-[#E6DED6] rounded-lg px-2.5 py-1.5 text-xs text-[#1A1816]"
                />
                <button
                  type="button"
                  onClick={handleAddPackage}
                  className="bg-[#9E784B] text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#8A673E] cursor-pointer whitespace-nowrap"
                >
                  Add Option
                </button>
              </div>
            </div>

          </div>

          <button
            type="submit"
            className="w-full bg-[#1A1816] text-white py-3 rounded-lg text-xs font-semibold hover:bg-[#2A2623] transition-colors cursor-pointer shadow-xs"
          >
            Save & Publish Listing Profile
          </button>
        </form>

        {/* Sidebar: Completeness Score & Live Status (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#E6DED6] rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="font-serif text-lg font-medium text-[#1A1816]">Listing Status</h3>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>Completeness Score</span>
                <span className="text-[#9E784B]">{score}%</span>
              </div>
              <div className="h-2 bg-[#F9F5F2] rounded-full overflow-hidden border border-[#E6DED6]">
                <div
                  className="h-full bg-[#9E784B] transition-all duration-300"
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border text-xs space-y-1 bg-[#F9F5F2] border-[#E6DED6]">
              <div className="font-semibold text-[#1A1816]">
                Status: {isLive ? 'LIVE in Search' : 'DRAFT (Needs 70%)'}
              </div>
              <p className="text-[11px] text-[#1A1816]/70 leading-relaxed">
                {isLive
                  ? 'Your listing is active! Brides can browse and send direct enquiries.'
                  : 'Complete description and areas to automatically publish your profile.'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

