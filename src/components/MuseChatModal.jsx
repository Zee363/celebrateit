import React, { useState } from 'react';
import { MiniMuseMark } from './CustomIcons';

export default function MuseChatModal({
  isOpen,
  onClose,
  bride,
  vendors,
  onLogSearchMiss,
  onOpenVendorProfile,
  currentUser
}) {
  const userName = currentUser?.name || bride?.name || 'there';
  const celebrationsCount = bride?.celebrations?.length || 2;

  const [messages, setMessages] = useState([
    {
      id: 'm_init',
      role: 'muse',
      content: `Hello ${userName}! I'm Muse, your personal wedding planning assistant. I already know about your ${celebrationsCount} celebration setup. How can I help you balance budgets, dates, or find local vendors today?`
    }
  ]);

  const [inputVal, setInputVal] = useState('');

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setInputVal('');

    const newMsgs = [...messages, { id: 'msg_' + Date.now(), role: 'user', content: userText }];
    setMessages(newMsgs);

    // 1. Try backend API if VITE_API_URL is configured
    if (import.meta.env.VITE_API_URL) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/muse-reply`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: userText, bride, vendors, history: newMsgs })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.text) {
            setMessages((prev) => [
              ...prev,
              {
                id: 'msg_res_' + Date.now(),
                role: 'muse',
                content: data.text
              }
            ]);
            return;
          }
        }
      } catch (error) {
        console.warn('Backend Muse API unavailable, using built-in Muse assistant:', error);
      }
    }

    // 2. Built-in smart Muse assistant engine (Fallback client-side)
    setTimeout(() => {
      let museReply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('greetings')) {
        museReply = `Hello ${userName}! I am Muse, your dedicated South African wedding planning expert. I am here to help you plan both your Traditional Day and your White Wedding.\n\n` +
          `You can ask me about:\n` +
          `• Gauteng wedding venues (Sandton, Soweto, Pretoria)\n` +
          `• Traditional catering, menus, and spit braai suppliers\n` +
          `• Bespoke traditional attire, beadwork, and couture designers\n` +
          `• Planning budget splits and coordinating timeline dates\n\n` +
          `What aspect of your dual celebrations would you like to discuss today?`;
      } else if (lower.includes('cater') || lower.includes('food') || lower.includes('braai') || lower.includes('menu') || lower.includes('eat')) {
        const liveCaterers = (vendors || []).filter((v) => v.isLive && v.category === 'Catering');
        if (liveCaterers.length > 0) {
          museReply = `I found ${liveCaterers.length} verified catering partner(s) serving Gauteng:\n\n` +
            liveCaterers.map(c => `• **${c.businessName}** (Starting from R ${c.priceFrom.toLocaleString('en-ZA')}) - ${c.description}`).join('\n\n') +
            `\n\nFor a traditional day, authentic spit braais and sides are highly popular. Let me know if you would like me to connect you with them!`;
        } else {
          museReply = `I searched our live vendor directory for catering in your area, but we don't have an active listing matching that criteria yet. I've recorded this request for our recruitment team!\n\n` +
            `Generally, we recommend reserving R25 000 - R40 000 of your traditional budget for catering (like Ubuntu Culinary Art & Catering) when hosting around 180 guests.`;
          if (onLogSearchMiss) {
            onLogSearchMiss({
              id: 'sm_muse_' + Date.now(),
              category: 'Catering',
              area: bride?.celebrations?.[0]?.area || 'Sandton',
              createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
            });
          }
        }
      } else if (lower.includes('designer') || lower.includes('dress') || lower.includes('gown') || lower.includes('attire') || lower.includes('suit') || lower.includes('tailor') || lower.includes('beadwork')) {
        museReply = `For traditional attire, bespoke suits, and gorgeous white wedding gowns in Gauteng, here are highly recommended designers:\n\n` +
          `• **Ntozinhle Designs (Soweto)**: Specializes in stunning traditional Zulu beadwork and modern-traditional mashups.\n` +
          `• **Orapeleng Modutle (Sandton)**: High-end custom couture white wedding gowns and luxury bridal wear.\n` +
          `• **Biji La Maison (Johannesburg)**: Internationally renowned for bespoke corsetry and tailored bridal attire.\n\n` +
          `Would you like to search the vendor directory for more options, or look into attire budgets?`;
      } else if (lower.includes('venue') || lower.includes('place') || lower.includes('hall') || lower.includes('location')) {
        const liveVenues = (vendors || []).filter((v) => v.isLive && v.category === 'Venue');
        if (liveVenues.length > 0) {
          museReply = `Here are active venue options in Sandton & Johannesburg for your celebrations:\n\n` +
            liveVenues.map(v => `• **${v.businessName}** (From R ${v.priceFrom.toLocaleString('en-ZA')}) - ${v.description}`).join('\n\n') +
            `\n\nYou can view their price ranges and photos in the directory.`;
        } else {
          museReply = `We are currently onboarding new luxury & traditional venues in Gauteng. I've logged this search for our team!\n\n` +
            `Generally, the White Wedding venue package (like The Greenhouse Sandton) represents about 45% of the overall budget, starting around R45 000.`;
        }
      } else if (lower.includes('photo') || lower.includes('camera') || lower.includes('video') || lower.includes('film')) {
        const photographers = (vendors || []).filter((v) => v.isLive && v.category === 'Photography');
        if (photographers.length > 0) {
          museReply = `Here are top-rated photographers for traditional attire and white weddings in Gauteng:\n\n` +
            photographers.map(p => `• **${p.businessName}** (From R ${p.priceFrom.toLocaleString('en-ZA')}) - Rating: ★ ${p.rating}`).join('\n\n');
        } else {
          museReply = `I can help connect you with documentary-style wedding photographers across Johannesburg and Pretoria. Typically, Thando M. Photography (from R18 000) captures rich traditional colors beautifully.`;
        }
      } else if (lower.includes('budget') || lower.includes('cost') || lower.includes('rand') || lower.includes('split') || lower.includes('money')) {
        const totalB = bride?.overallBudget || 600000;
        const tradAlloc = Math.round(totalB * 0.37);
        const whiteAlloc = Math.round(totalB * 0.63);
        museReply = `For your budget of R ${totalB.toLocaleString('en-ZA')}, here is the recommended split between your events:\n\n` +
          `• **Traditional Day**: R ${tradAlloc.toLocaleString('en-ZA')} (37% — attire, lobola proceedings, spit braai & tents)\n` +
          `• **White Wedding**: R ${whiteAlloc.toLocaleString('en-ZA')} (63% — venue banqueting, gown, photography & decor)\n\n` +
          `Would you like to adjust these numbers on your dashboard?`;
      } else if (lower.includes('date') || lower.includes('clash') || lower.includes('when') || lower.includes('time') || lower.includes('spacing')) {
        museReply = `When planning both a Traditional celebration and a White wedding, spacing your two ceremonies by 3 to 4 weeks gives your family travel breathing room and lets your budget flow smoothly! Let me know if you want to inspect your target dates.`;
      } else if (lower.includes('lobola') || lower.includes('elder') || lower.includes('agreement')) {
        museReply = `Traditional lobola proceedings and negotiations are foundational. We recommend starting family elder alignments at least 2 to 3 months before your traditional celebration. Make sure you set a dedicated budget line for family gifts and logistics!`;
      } else if (lower.includes('help') || lower.includes('features') || lower.includes('what can you do')) {
        museReply = `I can walk you through the planning details of your dual celebrations. Ask me questions such as:\n\n` +
          `1. "How do I split my budget?"\n` +
          `2. "Where can I find a traditional catering supplier?"\n` +
          `3. "What spacing should I leave between my dates?"\n` +
          `4. "Can you recommend a traditional dress designer?"`;
      } else {
        museReply = `I understand! I'm here to support your dual-wedding planning. Could you specify if you are asking about budgeting ratios, finding a caterer/venue in Gauteng, attire fittings, or timeline date clash checks?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'msg_res_' + Date.now(),
          role: 'muse',
          content: museReply
        }
      ]);
    }, 300);
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
                className={`p-4 rounded-2xl max-w-lg leading-relaxed whitespace-pre-line ${m.role === 'user'
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
