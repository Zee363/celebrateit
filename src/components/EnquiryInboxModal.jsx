import React, { useState } from 'react';

export default function EnquiryInboxModal({
  isOpen,
  onClose,
  enquiries,
  currentRole,
  onSendReply,
  onMarkBooked
}) {
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(
    enquiries[0]?.id || ''
  );
  const [replyText, setReplyText] = useState('');

  if (!isOpen) return null;

  const activeEnquiry =
    enquiries.find((e) => e.id === selectedEnquiryId) || enquiries[0];

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeEnquiry) return;

    onSendReply(activeEnquiry.id, {
      id: 'm_' + Date.now(),
      sender: currentRole === 'VENDOR' ? activeEnquiry.vendorName : activeEnquiry.brideName,
      body: replyText.trim(),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    });

    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white border border-[#E6DED6] rounded-2xl max-w-4xl w-full h-[600px] flex flex-col shadow-2xl relative overflow-hidden font-sans">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E6DED6] flex items-center justify-between bg-[#F9F5F2]">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#9E784B]">
              COMMUNICATION HUB
            </span>
            <h3 className="font-serif text-xl font-medium text-[#1A1816]">
              {currentRole === 'VENDOR' ? 'Vendor Enquiry Inbox' : 'My Sent Enquiries'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-[#1A1816] text-xl font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Body grid: Left threads list (1/3), Right active chat thread (2/3) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Threads Sidebar */}
          <div className="md:col-span-4 border-r border-[#E6DED6] bg-[#F9F5F2]/50 overflow-y-auto p-3 space-y-2">
            {enquiries.length > 0 ? (
              enquiries.map((e) => (
                <div
                  key={e.id}
                  onClick={() => setSelectedEnquiryId(e.id)}
                  className={`p-3.5 rounded-xl border text-xs space-y-1 cursor-pointer transition-all ${
                    selectedEnquiryId === e.id
                      ? 'bg-white border-[#9E784B] shadow-xs'
                      : 'bg-[#F9F5F2] border-[#E6DED6] hover:border-stone-400'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#1A1816]">
                      {currentRole === 'VENDOR' ? e.brideName : e.vendorName}
                    </span>
                    <span className="text-[10px] bg-[#9E784B]/10 text-[#9E784B] px-2 py-0.5 rounded-xs font-semibold">
                      {e.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#1A1816]/70 truncate">
                    {e.celebrationType} • {e.date}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-xs text-stone-500 text-center">No enquiries yet</div>
            )}
          </div>

          {/* Active Thread Detail */}
          <div className="md:col-span-8 flex flex-col h-full bg-white overflow-hidden">
            {activeEnquiry ? (
              <>
                {/* Thread Top Info */}
                <div className="p-4 border-b border-[#E6DED6] bg-[#F9F5F2]/30 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-serif text-base font-semibold text-[#1A1816]">
                      {currentRole === 'VENDOR' ? activeEnquiry.brideName : activeEnquiry.vendorName}
                    </div>
                    <div className="text-[#1A1816]/70">
                      {activeEnquiry.celebrationType} in {activeEnquiry.area} ({activeEnquiry.date})
                    </div>
                  </div>

                  {currentRole === 'VENDOR' && activeEnquiry.status !== 'BOOKED' && (
                    <button
                      onClick={() => onMarkBooked(activeEnquiry.id)}
                      className="bg-[#9E784B] text-white px-3.5 py-1.5 rounded-lg font-semibold hover:bg-[#8A673E] transition-colors cursor-pointer text-xs"
                    >
                      Mark as Booked ✓
                    </button>
                  )}
                </div>

                {/* Messages List */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                  {activeEnquiry.messages?.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3.5 rounded-2xl max-w-lg ${
                        (currentRole === 'VENDOR' && m.sender === activeEnquiry.vendorName) ||
                        (currentRole === 'BRIDE' && m.sender === activeEnquiry.brideName)
                          ? 'bg-[#1A1816] text-white ml-auto rounded-tr-xs'
                          : 'bg-[#F9F5F2] border border-[#E6DED6] text-[#1A1816] rounded-tl-xs'
                      }`}
                    >
                      <div className="font-semibold text-[10px] opacity-75 mb-1">{m.sender}</div>
                      <div className="leading-relaxed">{m.body}</div>
                      <div className="text-[9px] opacity-60 text-right mt-1">{m.createdAt}</div>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleReplySubmit} className="p-3 border-t border-[#E6DED6] flex gap-2">
                  <input
                    type="text"
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a message reply..."
                    className="flex-1 bg-[#F9F5F2] border border-[#E6DED6] rounded-xl px-3.5 py-2 text-xs text-[#1A1816] focus:outline-none focus:border-[#9E784B]"
                  />
                  <button
                    type="submit"
                    className="bg-[#1A1816] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#2A2623] cursor-pointer"
                  >
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-stone-400">
                Select a message thread to view conversation
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
