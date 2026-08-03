import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MeetMuseSection from './components/MeetMuseSection';
import ValuePropsSection from './components/ValuePropsSection';
import Footer from './components/Footer';

// App Modals & Views
import AuthModal from './components/AuthModal';
import BrideOnboardingModal from './components/BrideOnboardingModal';
import BrideDashboard from './components/BrideDashboard';
import VendorDirectory from './components/VendorDirectory';
import VendorProfileModal from './components/VendorProfileModal';
import EnquiryModal from './components/EnquiryModal';
import EnquiryInboxModal from './components/EnquiryInboxModal';
import VendorDashboard from './components/VendorDashboard';
import VendorListingEditor from './components/VendorListingEditor';
import MuseChatModal from './components/MuseChatModal';
import AdminDashboard from './components/AdminDashboard';

// Mock Seed Data
import {
  INITIAL_VENDORS,
  INITIAL_BRIDE,
  INITIAL_ENQUIRIES,
  INITIAL_SEARCH_MISSES
} from './data/mockData';

export default function App() {
  // Navigation & View Mode
  const [viewMode, setViewMode] = useState('landing'); // 'landing' | 'bride_dashboard' | 'vendor_directory' | 'vendor_dashboard' | 'vendor_editor' | 'admin_dashboard'

  // Global State Datasets
  const [currentUser, setCurrentUser] = useState(null); // { id, name, email, role }
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  const [bride, setBride] = useState(INITIAL_BRIDE);
  const [enquiries, setEnquiries] = useState(INITIAL_ENQUIRIES);
  const [searchMisses, setSearchMisses] = useState(INITIAL_SEARCH_MISSES);

  // Modal Controls
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [selectedVendorForProfile, setSelectedVendorForProfile] = useState(null);
  const [selectedVendorForEnquiry, setSelectedVendorForEnquiry] = useState(null);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [museOpen, setMuseOpen] = useState(false);

  // Auth Handlers
  const handleOpenAuth = (mode) => {
    setAuthModal({ isOpen: true, mode });
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'BRIDE') {
      setOnboardingOpen(true);
    } else if (user.role === 'VENDOR') {
      setViewMode('vendor_dashboard');
    } else if (user.role === 'ADMIN') {
      setViewMode('admin_dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setViewMode('landing');
  };

  const handleSwitchRole = (targetRole) => {
    if (targetRole === 'BRIDE') {
      setCurrentUser({ id: bride.id, name: bride.name, email: bride.email, role: 'BRIDE' });
      setViewMode('bride_dashboard');
    } else if (targetRole === 'VENDOR') {
      setCurrentUser({ id: 'v1', name: vendors[0].businessName, email: 'vendor@example.com', role: 'VENDOR' });
      setViewMode('vendor_dashboard');
    } else if (targetRole === 'ADMIN') {
      setCurrentUser({ id: 'admin1', name: 'Founder Admin', email: 'admin@celebrateit.co.za', role: 'ADMIN' });
      setViewMode('admin_dashboard');
    }
  };

  // Onboarding Complete
  const handleOnboardingComplete = (newBrideData) => {
    setBride(newBrideData);
    setOnboardingOpen(false);
    setViewMode('bride_dashboard');
  };

  // Directory & Vendor Selection
  const handleSelectVendor = (vendor) => {
    setSelectedVendorForProfile(vendor);
  };

  const handleOpenEnquiryFromProfile = (vendor) => {
    setSelectedVendorForProfile(null);
    setSelectedVendorForEnquiry(vendor);
  };

  const handleSendEnquiry = (newEnquiry) => {
    setEnquiries([newEnquiry, ...enquiries]);
    setInboxOpen(true);
  };

  // Inbox & Replies
  const handleSendReply = (enquiryId, messageObj) => {
    setEnquiries((prev) =>
      prev.map((e) => {
        if (e.id !== enquiryId) return e;
        return {
          ...e,
          status: e.status === 'SENT' ? 'REPLIED' : e.status,
          messages: [...e.messages, messageObj]
        };
      })
    );
  };

  // Cross-role effect: Vendor marks Enquiry BOOKED -> Add matching budget line to Bride celebration!
  const handleMarkBooked = (enquiryId) => {
    setEnquiries((prev) =>
      prev.map((e) => {
        if (e.id !== enquiryId) return e;
        
        // Add budget line to bride's matching celebration
        const targetCelebId = e.celebrationId;
        setBride((prevBride) => ({
          ...prevBride,
          celebrations: prevBride.celebrations.map((c) => {
            if (c.id !== targetCelebId) return c;
            return {
              ...c,
              budgetLines: [
                ...c.budgetLines,
                {
                  id: 'bl_booked_' + Date.now(),
                  category: e.vendorName,
                  planned: e.guestCount * 250 || 25000,
                  actuallySpent: e.guestCount * 250 || 25000,
                  linkedVendor: e.vendorName
                }
              ]
            };
          })
        }));

        return { ...e, status: 'BOOKED' };
      })
    );
  };

  // SearchMiss log handler
  const handleLogSearchMiss = (missObj) => {
    setSearchMisses([missObj, ...searchMisses]);
  };

  // Vendor Editor Save
  const handleSaveVendor = (updatedVendor) => {
    setVendors((prev) => {
      const idx = prev.findIndex((v) => v.id === updatedVendor.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updatedVendor;
        return copy;
      }
      return [...prev, updatedVendor];
    });
    setViewMode('vendor_dashboard');
  };

  // Admin toggle vendor live/paused
  const handleToggleVendorLive = (vendorId) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, isLive: !v.isLive } : v))
    );
  };

  return (
    <div className="min-h-screen bg-[#F9F5F2] text-[#1A1816] font-sans antialiased selection:bg-[#9E784B] selection:text-white flex flex-col justify-between">
      
      <div>
        {/* Navigation Bar */}
        <Navbar
          onOpenAuth={handleOpenAuth}
          currentUser={currentUser}
          onOpenDashboard={() => {
            if (currentUser?.role === 'BRIDE') setViewMode('bride_dashboard');
            else if (currentUser?.role === 'VENDOR') setViewMode('vendor_dashboard');
            else if (currentUser?.role === 'ADMIN') setViewMode('admin_dashboard');
          }}
          onLogout={handleLogout}
        />

        {/* Dynamic Main Views */}
        {viewMode === 'landing' && (
          <main>
            <HeroSection
              onPlanClick={() => handleOpenAuth('signup')}
              onVendorClick={() => handleOpenAuth('signup')}
            />
            <MeetMuseSection onOpenMuse={() => setMuseOpen(true)} />
            <ValuePropsSection />
          </main>
        )}

        {viewMode === 'bride_dashboard' && (
          <BrideDashboard
            bride={bride}
            onOpenDirectory={() => setViewMode('vendor_directory')}
            onOpenMuse={() => setMuseOpen(true)}
            onUpdateBride={setBride}
            onOpenEnquiries={() => setInboxOpen(true)}
          />
        )}

        {viewMode === 'vendor_directory' && (
          <VendorDirectory
            vendors={vendors}
            onSelectVendor={handleSelectVendor}
            onLogSearchMiss={handleLogSearchMiss}
            onBackToDashboard={() => setViewMode('bride_dashboard')}
          />
        )}

        {viewMode === 'vendor_dashboard' && (
          <VendorDashboard
            vendor={vendors[0]}
            enquiries={enquiries}
            onOpenListingEditor={() => setViewMode('vendor_editor')}
            onOpenInbox={() => setInboxOpen(true)}
          />
        )}

        {viewMode === 'vendor_editor' && (
          <VendorListingEditor
            vendor={vendors[0]}
            onSaveVendor={handleSaveVendor}
            onBackToDashboard={() => setViewMode('vendor_dashboard')}
          />
        )}

        {viewMode === 'admin_dashboard' && (
          <AdminDashboard
            vendors={vendors}
            onToggleVendorLive={handleToggleVendorLive}
            searchMisses={searchMisses}
            enquiries={enquiries}
          />
        )}
      </div>

      {/* Global Modals */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
        mode={authModal.mode}
        onAuthSuccess={handleAuthSuccess}
      />

      <BrideOnboardingModal
        isOpen={onboardingOpen}
        user={currentUser}
        onComplete={handleOnboardingComplete}
      />

      <VendorProfileModal
        vendor={selectedVendorForProfile}
        isOpen={!!selectedVendorForProfile}
        onClose={() => setSelectedVendorForProfile(null)}
        onOpenEnquiry={handleOpenEnquiryFromProfile}
      />

      <EnquiryModal
        vendor={selectedVendorForEnquiry}
        bride={bride}
        isOpen={!!selectedVendorForEnquiry}
        onClose={() => setSelectedVendorForEnquiry(null)}
        onSendEnquiry={handleSendEnquiry}
      />

      <EnquiryInboxModal
        isOpen={inboxOpen}
        onClose={() => setInboxOpen(false)}
        enquiries={enquiries}
        currentRole={currentUser?.role || 'BRIDE'}
        onSendReply={handleSendReply}
        onMarkBooked={handleMarkBooked}
      />

      <MuseChatModal
        isOpen={museOpen}
        onClose={() => setMuseOpen(false)}
        bride={bride}
        vendors={vendors}
        onLogSearchMiss={handleLogSearchMiss}
        onOpenVendorProfile={handleSelectVendor}
      />

      {/* Footer */}
      <Footer onSwitchRole={handleSwitchRole} />

    </div>
  );
}
