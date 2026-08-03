import React, { useState } from 'react';

export default function EnquiryModal({ vendor, bride, isOpen, onClose, onSendEnquiry }) {
  if (!isOpen || !vendor || !bride) return null;

  const celebrations = bride.celebrations || [];
  const [selectedCelebrationId, setSelectedCelebrationId] = useState(
    celebrations[0]?.id || ''
  );

  const selectedCelebration =
    celebrations.find((c) => c.id === selectedCelebrationId) || celebrations[0];

  const [messageText, setMessageText] = useState(
    `Hi ${vendor.businessName}! We love your portfolio and would like to inquire about availability and pricing for our upcoming ${selectedCelebration?.title || 'wedding'}.`
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCelebration) return;

    const newEnquiry = {
      id: 'e_' + Date.now(),
      brideId: bride.id,
      brideName: bride.name,
      vendorId: vendor.id,
      vendorName: vendor.businessName,
      celebrationId: selectedCelebration.id,
      celebrationType: selectedCelebration.title,
      date: selectedCelebration.date,
      area: selectedCelebration.area,
      guestCount: selectedCelebration.guestCount,
      budgetBand: `R ${selectedCelebration.budget.toLocaleString('en-ZA')}`,
      status: 'SENT',
      messages: [
        {
          id: 'm_' + Date.now(),
          sender: bride.name,
          body: messageText,
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        }
      ]
    };

    onSendEnquiry(newEnquiry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white border border-[#E6DED6] rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative font-sans">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-[#1A1816] text-xl font-bold cursor-pointer"
        >
          &times;
        </button>

        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#9E784B]">
            SEND ENQUIRY
          </span>
          <h3 className="font-serif text-2xl font-medium text-[#1A1816]">
            Enquire with {vendor.businessName}
          </h3>
          <p className="text-xs text-[#1A1816]/70">
            Enquiries are automatically populated with your celebration details so you never have to re-type them.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Celebration Selection */}
          <div className="space-y-1">
            <label className="font-semibold text-[#1A1816]/80">Which celebration is this for?</label>
            <select
              value={selectedCelebrationId}
              onChange={(e) => setSelectedCelebrationId(e.target.value)}
              className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3 py-2.5 text-xs text-[#1A1816] font-semibold"
            >
              {celebrations.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.type}) — {c.date} in {c.area}
                </option>
              ))}
            </select>
          </div>

          {/* Auto-filled details summary box */}
          {selectedCelebration && (
            <div className="bg-[#F9F5F2] border border-[#E6DED6] rounded-xl p-4 space-y-2 text-xs">
              <div className="font-semibold text-[#9E784B]">Auto-filled Celebration Details</div>
              <div className="grid grid-cols-2 gap-2 text-[#1A1816]/80">
                <div>Date: <strong className="text-[#1A1816]">{selectedCelebration.date}</strong></div>
                <div>Area: <strong className="text-[#1A1816]">{selectedCelebration.area}</strong></div>
                <div>Guests: <strong className="text-[#1A1816]">{selectedCelebration.guestCount}</strong></div>
                <div>Planned Budget: <strong className="text-[#1A1816]">R {selectedCelebration.budget.toLocaleString('en-ZA')}</strong></div>
              </div>
            </div>
          )}

          {/* Message Text */}
          <div className="space-y-1">
            <label className="font-semibold text-[#1A1816]/80">Your Message to Vendor</label>
            <textarea
              rows={4}
              required
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg p-3 text-xs text-[#1A1816] focus:outline-none focus:border-[#9E784B]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1A1816] text-white py-3 rounded-lg font-semibold hover:bg-[#2A2623] transition-colors cursor-pointer text-xs uppercase tracking-wider"
          >
            Send enquiry to vendor
          </button>

        </form>

      </div>
    </div>
  );
}
