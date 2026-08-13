import React, { useState } from 'react';
import { MiniMuseMark } from './CustomIcons';

export default function MuseChatModal({
  isOpen,
  onClose,
  bride,
  vendors,
  onLogSearchMiss,
  onOpenVendorProfile,
  currentUser,
  onUpdateBride
}) {
  const userName = currentUser?.name || bride?.name || 'there';
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [appliedActions, setAppliedActions] = useState({});

  if (!isOpen) return null;

  const handleApplyBudgetAction = (msgId, actionData) => {
    if (!bride || !onUpdateBride) return;
    const { total, trad, white } = actionData;

    const updatedCelebrations = (bride.celebrations || []).map((c) => {
      if (c.type === 'TRADITIONAL') {
        return { ...c, budget: trad };
      } else if (c.type === 'WHITE') {
        return { ...c, budget: white };
      }
      return c;
    });

    const updatedBride = {
      ...bride,
      overallBudget: total,
      celebrations: updatedCelebrations
    };

    onUpdateBride(updatedBride);
    setAppliedActions((prev) => ({ ...prev, [msgId]: 'Budget breakdown applied to dashboard!' }));
  };

  const handleAddChecklistAction = (msgId) => {
    if (!bride || !onUpdateBride) return;

    const newTradTasks = [
      { id: 't_cb_ai_' + Date.now() + '_1', title: 'Confirm traditional lobola agreement details with elders', dueDate: '2026-09-15', done: false },
      { id: 't_cb_ai_' + Date.now() + '_2', title: 'Book spit braai caterer for traditional reception', dueDate: '2026-10-01', done: false }
    ];

    const newWhiteTasks = [
      { id: 'w_cb_ai_' + Date.now() + '_1', title: 'Finalise white wedding venue booking & deposit', dueDate: '2026-09-30', done: false },
      { id: 'w_cb_ai_' + Date.now() + '_2', title: 'Book documentary wedding photographer', dueDate: '2026-10-15', done: false }
    ];

    const updatedCelebrations = (bride.celebrations || []).map((c) => {
      if (c.type === 'TRADITIONAL') {
        return { ...c, checklist: [...(c.checklist || []), ...newTradTasks] };
      } else if (c.type === 'WHITE') {
        return { ...c, checklist: [...(c.checklist || []), ...newWhiteTasks] };
      }
      return c;
    });

    onUpdateBride({
      ...bride,
      celebrations: updatedCelebrations
    });

    setAppliedActions((prev) => ({ ...prev, [msgId]: '4 tasks added to your celebration checklist!' }));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setInputVal('');

    const msgId = 'msg_' + Date.now();
    const newMsgs = [...messages, { id: msgId, role: 'user', content: userText }];
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
      let actionObj = null;
      const lower = userText.toLowerCase();

      if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('greetings')) {
        museReply = `Hello ${userName}! I am Muse, your dedicated South African wedding planning expert. I am here to help you plan both your Traditional Day and your White Wedding.\n\n` +
          `You can ask me about:\n` +
          `• Gauteng wedding venues (Sandton, Soweto, Pretoria)\n` +
          `• Traditional catering, menus, and spit braai suppliers\n` +
          `• Bespoke traditional attire, beadwork, and couture designers\n` +
          `• Planning budget splits and coordinating timeline dates\n\n` +
          `What aspect of your dual celebrations would you like to discuss today?`;
      } else if (lower.includes('budget') || lower.includes('cost') || lower.includes('rand') || lower.includes('split') || lower.includes('money') || (lower.includes('r') && /\d+/.test(lower))) {
        const budgetMatch = lower.replace(/[,.\s]/g, '').match(/r?(\d+)/);
        let customBudget = bride?.overallBudget || 600000;
        if (budgetMatch) {
          const parsed = parseInt(budgetMatch[1], 10);
          if (!isNaN(parsed) && parsed >= 500) {
            customBudget = parsed;
          }
        }
        
        const tradAlloc = Math.round(customBudget * 0.37);
        const whiteAlloc = Math.round(customBudget * 0.63);

        let details = "";
        if (lower.includes('lobola') || lower.includes('attire') || lower.includes('deco') || lower.includes('decor')) {
          details = `\n\nFor your specific query about lobola, attire, and decor:\n` +
            `• **Lobola & Traditional Attire**: Fit comfortably inside your Traditional Day allocation (R ${tradAlloc.toLocaleString('en-ZA')}). We recommend allocating R15 000 - R20 000 for bespoke attire & beadwork.\n` +
            `• **Decor & Styling**: For a white wedding reception, reserve around 10-15% of your White Wedding budget (R ${Math.round(whiteAlloc * 0.12).toLocaleString('en-ZA')}) for luxury floral designs & styling.`;
        }

        museReply = `For your budget of R ${customBudget.toLocaleString('en-ZA')}, here is the recommended split between your events:\n\n` +
          `• **Traditional Day**: R ${tradAlloc.toLocaleString('en-ZA')} (37% — attire, lobola proceedings, spit braai & tents)\n` +
          `• **White Wedding**: R ${whiteAlloc.toLocaleString('en-ZA')} (63% — venue banqueting, gown, photography & decor)` +
          details +
          `\n\nWould you like me to apply these split numbers directly to your dashboard?`;
        
        actionObj = { type: 'apply_budget', total: customBudget, trad: tradAlloc, white: whiteAlloc };
      } else if (lower.includes('task') || lower.includes('checklist') || lower.includes('next') || lower.includes('do next') || lower.includes('todo')) {
        museReply = `Here are essential next steps for your dual celebrations:\n\n` +
          `1. **Traditional Day**: Align family elders on lobola negotiation dates and lock in your traditional spit braai caterer.\n` +
          `2. **White Wedding**: Secure your venue contract in Sandton/Midrand and book your main photographer.\n\n` +
          `Would you like me to add these 4 tasks directly to your celebration checklist?`;

        actionObj = { type: 'add_checklist' };
      } else if (lower.includes('cater') || lower.includes('food') || lower.includes('braai') || lower.includes('menu') || lower.includes('eat')) {
        const liveCaterers = (vendors || []).filter((v) => v.isLive && v.category === 'Catering');
        if (liveCaterers.length > 0) {
          museReply = `I found ${liveCaterers.length} verified catering partner(s) serving Gauteng:\n\n` +
            liveCaterers.map(c => `• **${c.businessName}** (Starting from R ${c.priceFrom.toLocaleString('en-ZA')}) - ${c.description}`).join('\n\n') +
            `\n\nFor a traditional day, authentic spit braais and sides are highly popular. You can view vendor details in the directory!`;
        } else {
          museReply = `I searched our live vendor directory for catering in your area, but we don't have an active listing matching that criteria yet. I've recorded this request for our recruitment team!\n\n` +
            `Generally, we recommend reserving R25 000 - R40 000 of your traditional budget for catering when hosting around 180 guests.`;
          if (onLogSearchMiss) {
            onLogSearchMiss({
              id: 'sm_muse_' + Date.now(),
              category: 'Catering',
              area: bride?.celebrations?.[0]?.area || 'Sandton',
              createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
            });
          }
        }
      } else if (lower.includes('designer') || lower.includes('dress') || lower.includes('gown') || lower.includes('attire') || lower.includes('suit') || lower.includes('beadwork')) {
        museReply = `For traditional attire, bespoke suits, and gorgeous white wedding gowns in Gauteng, here are highly recommended designers:\n\n` +
          `• **Ntozinhle Designs (Soweto)**: Specializes in stunning traditional Zulu beadwork and modern-traditional mashups.\n` +
          `• **Orapeleng Modutle (Sandton)**: High-end custom couture white wedding gowns and luxury bridal wear.\n` +
          `• **Biji La Maison (Johannesburg)**: Internationally renowned for bespoke corsetry and tailored bridal attire.`;
      } else if (lower.includes('venue') || lower.includes('place') || lower.includes('hall') || lower.includes('location')) {
        const liveVenues = (vendors || []).filter((v) => v.isLive && v.category === 'Venue');
        if (liveVenues.length > 0) {
          museReply = `Here are active venue options in Sandton & Johannesburg for your celebrations:\n\n` +
            liveVenues.map(v => `• **${v.businessName}** (From R ${v.priceFrom.toLocaleString('en-ZA')}) - ${v.description}`).join('\n\n') +
            `\n\nYou can view their price ranges and photos in the directory.`;
        } else {
          museReply = `We are currently onboarding new luxury & traditional venues in Gauteng. I've logged this search for our team!\n\n` +
            `Generally, the White Wedding venue package represents about 45% of the overall budget, starting around R45 000.`;
        }
      } else if (lower.includes('photo') || lower.includes('camera') || lower.includes('video') || lower.includes('film')) {
        const photographers = (vendors || []).filter((v) => v.isLive && v.category === 'Photography');
        if (photographers.length > 0) {
          museReply = `Here are top-rated photographers for traditional attire and white weddings in Gauteng:\n\n` +
            photographers.map(p => `• **${p.businessName}** (From R ${p.priceFrom.toLocaleString('en-ZA')}) - Rating: ★ ${p.rating}`).join('\n\n');
        } else {
          museReply = `I can help connect you with documentary-style wedding photographers across Johannesburg and Pretoria. Typically, Thando M. Photography (from R18 000) captures rich traditional colors beautifully.`;
        }
      } else if (lower.includes('date') || lower.includes('clash') || lower.includes('when') || lower.includes('spacing')) {
        museReply = `When planning both a Traditional celebration and a White wedding, spacing your two ceremonies by 3 to 4 weeks gives your family travel breathing room and lets your budget flow smoothly!`;
      } else {
        museReply = `I understand! I'm here to support your dual-wedding planning. Ask me about budget splits, catering suppliers, venues in Gauteng, or generating next checklist tasks!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'msg_res_' + Date.now(),
          role: 'muse',
          content: museReply,
          action: actionObj
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
          {messages.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-6">
              <MiniMuseMark className="w-16 h-16 opacity-80" />
              <div>
                <h4 className="font-serif text-xl font-medium text-[#1A1816]">Ask Muse</h4>
                <p className="text-xs text-[#1A1816]/70 mt-1 max-w-sm">
                  Your South African wedding planning expert. Get instant, tailored suggestions for your celebrations.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md w-full justify-center">
                <button
                  onClick={() => {
                    setInputVal("How should I split my budget of R600,000 between traditional and white weddings?");
                  }}
                  className="bg-white hover:bg-[#F9F5F2] border border-[#E6DED6] rounded-xl px-4 py-2.5 text-xs text-[#1A1816]/80 text-left sm:text-center transition-colors cursor-pointer"
                >
                  💡 Split R600,000 budget
                </button>
                <button
                  onClick={() => {
                    setInputVal("What checklist tasks should I do next for both weddings?");
                  }}
                  className="bg-white hover:bg-[#F9F5F2] border border-[#E6DED6] rounded-xl px-4 py-2.5 text-xs text-[#1A1816]/80 text-left sm:text-center transition-colors cursor-pointer"
                >
                  📅 Generate next tasks
                </button>
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'items-start gap-3'}`}
              >
                {m.role === 'muse' && (
                  <MiniMuseMark className="w-8 h-8 shrink-0 mt-1" />
                )}
                <div className="space-y-2 max-w-lg">
                  <div
                    className={`p-4 rounded-2xl leading-relaxed whitespace-pre-line ${m.role === 'user'
                        ? 'bg-[#1A1816] text-white rounded-tr-xs ml-auto'
                        : 'bg-[#F9F5F2] border border-[#E6DED6] text-[#1A1816] rounded-tl-xs'
                      }`}
                  >
                    {m.content}
                  </div>

                  {/* Interactive Action Chip */}
                  {m.role === 'muse' && m.action && (
                    <div className="pt-1">
                      {appliedActions[m.id] ? (
                        <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-3 py-1.5 rounded-lg font-semibold border border-emerald-200">
                          ✓ {appliedActions[m.id]}
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            if (m.action.type === 'apply_budget') {
                              handleApplyBudgetAction(m.id, m.action);
                            } else if (m.action.type === 'add_checklist') {
                              handleAddChecklistAction(m.id);
                            }
                          }}
                          className="bg-[#9E784B] text-white text-xs px-4 py-2 rounded-lg font-semibold hover:bg-[#8A673E] transition-all shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5"
                        >
                          {m.action.type === 'apply_budget' ? '⚡ Apply Budget Breakdown to Workspace' : '📋 Add 4 Recommended Tasks to Checklist'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSend} className="p-4 border-t border-[#E6DED6] bg-white flex gap-2">
          <input
            type="text"
            required
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask Muse about budget split, tasks, or caterers..."
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
