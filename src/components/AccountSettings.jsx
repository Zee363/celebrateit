import React, { useState } from 'react';

export default function AccountSettings({ user, onSave, onLogout }) {
  const [name, setName] = useState(user?.name || '');
  const [photoUploaded, setPhotoUploaded] = useState(user?.hasPhoto || false);
  const [saved, setSaved] = useState(false);

  const initials = name ? (name.split(' ').length > 1 ? name.split(' ')[0][0] + name.split(' ')[name.split(' ').length-1][0] : name.substring(0,2)).toUpperCase() : 'LN';

  const handleSave = () => {
    onSave({ ...user, name, hasPhoto: photoUploaded });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePhotoUpload = () => {
    // Mocking an upload
    setPhotoUploaded(true);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F9F5F2] py-24 px-4 sm:px-6 lg:px-12 font-sans pt-32">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <span className="text-[11px] font-semibold tracking-widest uppercase text-[#9E784B]">
            YOUR ACCOUNT
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#1A1816] mt-2">
            A little about you.
          </h1>
        </div>

        <div className="bg-white border border-[#E6DED6] rounded-2xl p-6 md:p-8 space-y-8">
          
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            {photoUploaded ? (
              <div className="w-16 h-16 rounded-full border border-[#E6DED6] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" alt="Profile" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full border border-[#E6DED6] bg-[#F9F5F2] flex items-center justify-center text-xl font-bold text-[#9E784B]">
                {initials}
              </div>
            )}
            <div className="space-y-2">
              <p className="text-sm text-[#1A1816]/70">
                A soft, real photo — it makes your planner feel like yours.
              </p>
              <button 
                onClick={handlePhotoUpload}
                className="text-xs font-semibold px-4 py-2 bg-white border border-[#E6DED6] rounded-lg text-[#1A1816] hover:border-[#9E784B] transition-colors cursor-pointer"
              >
                {photoUploaded ? 'Change photo' : 'Upload a photo'}
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 max-w-md">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1A1816]/80 uppercase tracking-wider">YOUR NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F9F5F2] border border-[#E6DED6] focus:border-[#9E784B] focus:ring-1 focus:ring-[#9E784B] rounded-xl px-4 py-3 text-sm text-[#1A1816] transition-all outline-none"
              />
              <p className="text-xs text-[#1A1816]/60 pt-1">
                Your name is only shared with vendors you message
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-[#E6DED6]/60 mt-8 pt-8">
            <button 
              onClick={handleSave}
              className="bg-[#1A1816] text-white px-8 py-3 rounded-lg font-semibold text-sm hover:bg-[#2A2623] transition-all cursor-pointer shadow-xs"
            >
              {saved ? 'Saved!' : 'Save'}
            </button>
            <button 
              onClick={onLogout}
              className="text-sm text-stone-500 hover:text-[#1A1816] underline underline-offset-4 cursor-pointer"
            >
              Sign out
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
