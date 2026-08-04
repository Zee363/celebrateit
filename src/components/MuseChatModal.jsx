import React, { useState } from 'react';
import { MiniMuseMark } from './CustomIcons';

export default function MuseChatModal({
  isOpen,
  onClose,
  bride,
  vendors,
  onLogSearchMiss,
  onOpenVendorProfile
}) {
  const [messages, setMessages] = useState([
    {
      id: 'm_init',
      role: 'muse',
      content: `Hello ${bride?.name || 'there'}! I'm Muse, your personal wedding planning assistant. I already know about your ${bride?.celebrations?.length || 1} celebration setup. How can I help you balance budgets, dates, or find local vendors today?`
    }
  ]);

  const [inputVal, setInputVal] = useState('');

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setInputVal('');

    const newMsgs = [...messages, { id: 'msg_' + Date.now(), role: 'user', content: userText }];
    setMessages(newMsgs);

    setTimeout(() => {
      let museReply = "";
      const lower = userText.toLowerCase();

      // Check for vendor query
      if (lower.includes('cater') || lower.includes('food') || lower.includes('spit braai')) {
        const liveCaterers = vendors.filter((v) => v.isLive && v.category === 'Catering');
        if (liveCaterers.length > 0) {
          museReply = `I found ${liveCaterers.length} active catering team(s) serving Gauteng:\n`;
          liveCaterers.forEach((c) => {
            museReply += `• ${c.businessName} (Starting from R ${c.priceFrom.toLocaleString('en-ZA')})\n`;
          });
          museReply += `\nWould you like to view their details or send a direct enquiry?`;
        } else {
          museReply = `I searched our live vendor directory for catering in your area, but we don't have an active listing matching that criteria yet. I've recorded this supply gap for our recruitment team.`;
          onLogSearchMiss({
            id: 'sm_muse_' + Date.now(),
            category: 'Catering',
            area: bride?.celebrations?.[0]?.area || 'Sandton',
            createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          });
        }
      } else if (lower.includes('venue') || lower.includes('place') || lower.includes('location')) {
        const liveVenues = vendors.filter((v) => v.isLive && v.category === 'Venue');
        if (liveVenues.length > 0) {
          museReply = `Here are active venue options in Sandton & Johannesburg:\n`;
          liveVenues.forEach((v) => {
            museReply += `• ${v.businessName} — From R ${v.priceFrom.toLocaleString('en-ZA')}\n`;
          });
        } else {
          museReply = `No active venue listings found for that criteria right now. I've logged this to help expand our partner network.`;
        }
      } else if (lower.includes('budget') || lower.includes('split') || lower.includes('cost')) {
        const overall = bride?.overallBudget || 600000;
        const tradB = Math.round(overall * 0.37);
        const whiteB = Math.round(overall * 0.63);
        museReply = `For your total budget of R ${overall.toLocaleString('en-ZA')}, here is how I recommend splitting it:\n• Traditional Day: R ${tradB.toLocaleString('en-ZA')} (Focus on traditional catering, tents & attire)\n• White Wedding: R ${whiteB.toLocaleString('en-ZA')} (Focus on venue reception & photography)`;
      } else if (lower.includes('clash') || lower.includes('date') || lower.includes('timeline')) {
        museReply = `Checking your dates: Traditional Day is scheduled for ${bride?.celebrations?.[0]?.date || '14 Nov 2026'}, and White Wedding is scheduled for ${bride?.celebrations?.[1]?.date || '5 Dec 2026'}. That leaves 3 weeks between events, which is a great timeline buffer for logistics and family rest.`;
      } else {
        museReply = `I'm right here with you! Whether you need to adjust budget lines in Rands, manage checklist items for both weddings, or locate verified local vendors in Soweto or Sandton, just let me know.`;
      }

      setMessages((prev) => [
        ...prev,
        { id: 'msg_res_' + Date.now(), role: 'muse', content: museReply }
      ]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white border border-[#E6DED6] rounded-2xl max-w-2xl w-full h-[650px] flex flex-col shadow-2xl relative overflow-hidden font-sans">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E6DED6] bg-[#F9F5F2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MiniMuseMark className="w-10 h-10 shadow-xs" />
            <div>
              <h3 className="font-serif text-lg font-medium text-[#1A1816]">Muse Assistant</h3>
              <p className="text-xs text-[#1A1816]/60">South African Wedding Planning Expert</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-[#1A1816] text-2xl font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Message Trajectory */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'items-start gap-3'}`}
            >
              {m.role === 'muse' && (
                <MiniMuseMark className="w-8 h-8 shrink-0 mt-1" />
              )}
              <div
                className={`p-4 rounded-2xl max-w-lg leading-relaxed whitespace-pre-line ${
                  m.role === 'user'
                    ? 'bg-[#1A1816] text-white rounded-tr-xs ml-auto'
                    : 'bg-[#F9F5F2] border border-[#E6DED6] text-[#1A1816] rounded-tl-xs'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSend} className="p-4 border-t border-[#E6DED6] bg-white flex gap-2">
          <input
            type="text"
            required
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask Muse about budget split, caterers, or dates..."
            className="flex-1 bg-[#F9F5F2] border border-[#E6DED6] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#1A1816] focus:outline-none focus:border-[#9E784B]"
          />
          <button
            type="submit"
            className="bg-[#9E784B] text-white px-5 py-3 rounded-xl font-semibold text-xs hover:bg-[#8A673E] transition-colors cursor-pointer"
          >
            Ask Muse
          </button>
        </form>

      </div>
    </div>
  );
}
