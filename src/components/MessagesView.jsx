import React, { useState } from 'react';
import { FeatureDirectoryIcon } from './CustomIcons';

export default function MessagesView({ enquiries, onBrowseDirectory, onSendReply, onMarkBooked, currentRole }) {
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(
    enquiries && enquiries.length > 0 ? enquiries[0].id : ''
  );
  const [replyText, setReplyText] = useState('');

  if (!enquiries || enquiries.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#F9F5F2] py-24 px-4 sm:px-6 lg:px-12 font-sans pt-32">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <span className="text-[11px] font-semibold tracking-widest uppercase text-[#9E784B]">
              MESSAGES
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#1A1816] mt-2">
              Your vendor conversations.
            </h1>
            <p className="text-[#1A1816]/80 mt-2 max-w-2xl text-sm md:text-base">
              Every vendor you've spoken to, all in one warm place — with exactly where you stand.
            </p>
          </div>

          <div className="bg-white border border-[#E6DED6] rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#F9F5F2] border border-[#E6DED6] flex items-center justify-center text-[#9E784B]">
              <FeatureDirectoryIcon className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-medium text-[#1A1816]">
              No conversations yet.
            </h3>
            <p className="text-sm text-[#1A1816]/70 max-w-sm mx-auto leading-relaxed">
              When you start a conversation with a vendor from the directory, your messages and dual wedding schedule discussions will appear here.
            </p>
            <div className="pt-2">
              <button 
                onClick={onBrowseDirectory}
                className="bg-[#1A1816] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#2A2623] transition-all cursor-pointer shadow-xs"
              >
                Browse the directory
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeEnquiry = enquiries.find((e) => e.id === selectedEnquiryId) || enquiries[0];

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
    <div className="min-h-[calc(100vh-80px)] bg-[#F9F5F2] py-24 px-4 sm:px-6 lg:px-12 font-sans pt-32">
      <div className="max-w-6xl mx-auto h-[600px] flex flex-col">
        <div>
          <span className="text-[11px] font-semibold tracking-widest uppercase text-[#9E784B]">
            MESSAGES
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#1A1816] mt-2 mb-6">
            Your vendor conversations.
          </h1>
        </div>

        <div className="flex-1 bg-white border border-[#E6DED6] rounded-2xl flex flex-col shadow-sm relative overflow-hidden font-sans">
          {/* Body grid: Left threads list (1/3), Right active chat thread (2/3) */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
            
            {/* Threads Sidebar */}
            <div className="md:col-span-4 border-r border-[#E6DED6] bg-[#F9F5F2]/50 overflow-y-auto p-3 space-y-2">
              {enquiries.map((e) => (
                <div
                  key={e.id}
                  onClick={() => setSelectedEnquiryId(e.id)}
                  className={`p-4 rounded-xl border text-sm space-y-1 cursor-pointer transition-all ${
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
                  <div className="text-xs text-[#1A1816]/70 truncate">
                    {e.celebrationType} • {e.date}
                  </div>
                </div>
              ))}
            </div>

            {/* Active Thread Detail */}
            <div className="md:col-span-8 flex flex-col h-full bg-white overflow-hidden">
              {activeEnquiry ? (
                <>
                  {/* Thread Top Info */}
                  <div className="p-5 border-b border-[#E6DED6] bg-[#F9F5F2]/30 flex items-center justify-between">
                    <div>
                      <div className="font-serif text-lg font-semibold text-[#1A1816]">
                        {currentRole === 'VENDOR' ? activeEnquiry.brideName : activeEnquiry.vendorName}
                      </div>
                      <div className="text-sm text-[#1A1816]/70 mt-0.5">
                        {activeEnquiry.celebrationType} in {activeEnquiry.area} ({activeEnquiry.date})
                      </div>
                    </div>

                    {currentRole === 'VENDOR' && activeEnquiry.status !== 'BOOKED' && (
                      <button
                        onClick={() => onMarkBooked(activeEnquiry.id)}
                        className="bg-[#9E784B] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#8A673E] transition-colors cursor-pointer text-sm shadow-xs"
                      >
                        Mark as Booked ✓
                      </button>
                    )}
                  </div>

                  {/* Messages List */}
                  <div className="flex-1 p-6 overflow-y-auto space-y-4 text-sm">
                    {activeEnquiry.messages?.map((m) => (
                      <div
                        key={m.id}
                        className={`p-4 rounded-2xl max-w-lg shadow-sm ${
                          (currentRole === 'VENDOR' && m.sender === activeEnquiry.vendorName) ||
                          (currentRole === 'BRIDE' && m.sender === activeEnquiry.brideName)
                            ? 'bg-[#1A1816] text-white ml-auto rounded-tr-xs'
                            : 'bg-[#F9F5F2] border border-[#E6DED6] text-[#1A1816] rounded-tl-xs'
                        }`}
                      >
                        <div className="font-semibold text-[10px] uppercase tracking-wider opacity-75 mb-1.5">{m.sender}</div>
                        <div className="leading-relaxed">{m.body}</div>
                        <div className="text-[10px] opacity-60 text-right mt-2">{m.createdAt}</div>
                      </div>
                    ))}
                  </div>

                  {/* Reply Form */}
                  <form onSubmit={handleReplySubmit} className="p-4 border-t border-[#E6DED6] flex gap-3 bg-white">
                    <input
                      type="text"
                      required
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a message reply..."
                      className="flex-1 bg-[#F9F5F2] border border-[#E6DED6] rounded-xl px-4 py-3 text-sm text-[#1A1816] focus:outline-none focus:border-[#9E784B]"
                    />
                    <button
                      type="submit"
                      className="bg-[#1A1816] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#2A2623] cursor-pointer shadow-xs transition-colors"
                    >
                      Send
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-sm text-stone-400">
                  Select a message thread to view conversation
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
