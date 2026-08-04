import { useState, useEffect } from 'react';
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

// Supabase Integration
import { supabase } from './supabaseClient';
import {
  getProfile,
  getVendors,
  saveVendorProfile,
  getBrideData,
  saveBrideOnboarding,
  toggleChecklistItem,
  addChecklistItem,
  addBudgetLine,
  getEnquiries,
  createEnquiry,
  updateEnquiryStatus,
  updateEnquiryMessages,
  getSearchMisses,
  logSearchMiss
} from './services/supabaseService';

const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

const isUuid = (str) => {
  if (!str) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

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

  // Initialize and load data from Supabase if configured
  useEffect(() => {
    if (!isSupabaseConfigured) {
      console.info('Supabase is not configured. CelebrateIT is running in mock-only mode.');
      return;
    }

    // 1. Load active vendors
    const loadVendors = async () => {
      const dbVendors = await getVendors();
      if (dbVendors && dbVendors.length > 0) {
        setVendors(dbVendors);
      }
    };
    loadVendors();

    // 2. Setup auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user || null;
        if (user) {
          const profile = await getProfile(user.id);
          const role = profile?.role || user.user_metadata?.role || 'BRIDE';
          const name = profile?.name || user.user_metadata?.name || user.email;

          setCurrentUser({ id: user.id, name, email: user.email, role });

          if (role === 'BRIDE') {
            const brideData = await getBrideData(user.id);
            if (brideData && brideData.weddingId) {
              setBride(brideData);
              setViewMode('bride_dashboard');
            } else {
              setBride({
                id: user.id,
                name,
                email: user.email,
                role: 'BRIDE',
                celebrations: []
              });
              setOnboardingOpen(true);
            }
            const dbEnqs = await getEnquiries(user.id, 'BRIDE');
            setEnquiries(dbEnqs);
          } else if (role === 'VENDOR') {
            const allVendors = await getVendors();
            let vendorProf = allVendors.find(v => v.id === user.id);
            if (!vendorProf) {
              vendorProf = await saveVendorProfile({
                id: user.id,
                businessName: name,
                category: 'Venue',
                areasServed: [],
                celebrationsServed: 'BOTH',
                priceFrom: 0,
                description: '',
                completenessScore: 0,
                isLive: false
              });
              setVendors(prev => [...prev, vendorProf]);
            }
            setViewMode('vendor_dashboard');
            const dbEnqs = await getEnquiries(user.id, 'VENDOR');
            setEnquiries(dbEnqs);
          } else if (role === 'ADMIN') {
            setViewMode('admin_dashboard');
            const dbMisses = await getSearchMisses();
            setSearchMisses(dbMisses);
            const dbEnqs = await getEnquiries(user.id, 'ADMIN');
            setEnquiries(dbEnqs);
          }
        } else {
          setCurrentUser(null);
          setViewMode('landing');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Auth Handlers
  const handleOpenAuth = (mode) => {
    setAuthModal({ isOpen: true, mode });
  };

  const handleAuthSuccess = async (user) => {
    setCurrentUser(user);
    if (!isSupabaseConfigured) {
      if (user.role === 'BRIDE') {
        setOnboardingOpen(true);
      } else if (user.role === 'VENDOR') {
        setViewMode('vendor_dashboard');
      } else if (user.role === 'ADMIN') {
        setViewMode('admin_dashboard');
      }
      return;
    }

    // Let useEffect handle real Supabase role transitions, but quick visual fallbacks
    if (user.role === 'BRIDE') {
      const brideData = await getBrideData(user.id);
      if (brideData && brideData.weddingId) {
        setBride(brideData);
        setViewMode('bride_dashboard');
      } else {
        setOnboardingOpen(true);
      }
    } else if (user.role === 'VENDOR') {
      setViewMode('vendor_dashboard');
    } else if (user.role === 'ADMIN') {
      setViewMode('admin_dashboard');
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    setViewMode('landing');
  };

  const handleSwitchRole = async (targetRole) => {
    if (!isSupabaseConfigured) {
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
      return;
    }

    // Demo simulation for logged-in user in Supabase mode
    if (targetRole === 'BRIDE') {
      setCurrentUser({ id: 'b1', name: 'Nomsa (Demo)', email: 'nomsa@example.com', role: 'BRIDE' });
      const brideData = await getBrideData('b1') || INITIAL_BRIDE;
      setBride(brideData);
      setViewMode('bride_dashboard');
    } else if (targetRole === 'VENDOR') {
      setCurrentUser({ id: 'v1', name: 'Greenhouse (Demo)', email: 'vendor@example.com', role: 'VENDOR' });
      setViewMode('vendor_dashboard');
    } else if (targetRole === 'ADMIN') {
      setCurrentUser({ id: 'admin1', name: 'Admin (Demo)', email: 'admin@celebrateit.co.za', role: 'ADMIN' });
      setViewMode('admin_dashboard');
    }
  };

  // Onboarding Complete
  const handleOnboardingComplete = async (newBrideData) => {
    if (!isSupabaseConfigured) {
      setBride(newBrideData);
      setOnboardingOpen(false);
      setViewMode('bride_dashboard');
      return;
    }

    try {
      await saveBrideOnboarding(
        currentUser.id,
        newBrideData.overallBudget,
        newBrideData.celebrations
      );
      const fullBrideData = await getBrideData(currentUser.id);
      setBride(fullBrideData || newBrideData);
      setOnboardingOpen(false);
      setViewMode('bride_dashboard');
    } catch (err) {
      console.error('Error completing onboarding:', err);
      // Fallback so the app doesn't crash if database is not fully set up
      setBride(newBrideData);
      setOnboardingOpen(false);
      setViewMode('bride_dashboard');
    }
  };

  // Directory & Vendor Selection
  const handleSelectVendor = (vendor) => {
    setSelectedVendorForProfile(vendor);
  };

  const handleOpenEnquiryFromProfile = (vendor) => {
    setSelectedVendorForProfile(null);
    setSelectedVendorForEnquiry(vendor);
  };

  const handleSendEnquiry = async (newEnquiry) => {
    if (!isSupabaseConfigured || !isUuid(newEnquiry.brideId) || !isUuid(newEnquiry.vendorId)) {
      setEnquiries([newEnquiry, ...enquiries]);
      setInboxOpen(true);
      return;
    }

    try {
      const dbEnquiry = await createEnquiry(newEnquiry);
      setEnquiries(prev => [dbEnquiry, ...prev]);
      setInboxOpen(true);
    } catch (err) {
      console.error('Error sending enquiry:', err);
    }
  };

  // Inbox & Replies
  const handleSendReply = async (enquiryId, messageObj) => {
    // Optimistic local state update
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

    if (!isSupabaseConfigured || !isUuid(enquiryId)) return;

    try {
      const target = enquiries.find(e => e.id === enquiryId);
      if (target) {
        const nextMessages = [...target.messages, messageObj];
        const nextStatus = target.status === 'SENT' ? 'REPLIED' : target.status;
        await updateEnquiryMessages(enquiryId, nextMessages);
        await updateEnquiryStatus(enquiryId, nextStatus);
      }
    } catch (err) {
      console.error('Error sending reply:', err);
    }
  };

  // Mark Booked
  const handleMarkBooked = async (enquiryId) => {
    if (!isSupabaseConfigured || !isUuid(enquiryId)) {
      // In-memory fallback
      setEnquiries((prev) =>
        prev.map((e) => {
          if (e.id !== enquiryId) return e;
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
      return;
    }

    try {
      const enq = enquiries.find(e => e.id === enquiryId);
      if (!enq) return;

      await updateEnquiryStatus(enquiryId, 'BOOKED');
      const planned = enq.guestCount * 250 || 25000;
      await addBudgetLine(enq.celebrationId, enq.vendorName, planned, planned, enq.vendorName);

      if (currentUser?.role === 'BRIDE' && isUuid(currentUser.id)) {
        const fullBrideData = await getBrideData(currentUser.id);
        if (fullBrideData) {
          setBride(fullBrideData);
        }
      }
      setEnquiries(prev => prev.map(e => e.id === enquiryId ? { ...e, status: 'BOOKED' } : e));
    } catch (err) {
      console.error('Error booking vendor:', err);
    }
  };

  // SearchMiss log handler
  const handleLogSearchMiss = async (missObj) => {
    if (!isSupabaseConfigured) {
      setSearchMisses([missObj, ...searchMisses]);
      return;
    }

    try {
      await logSearchMiss(missObj.category, missObj.area);
      const dbMisses = await getSearchMisses();
      setSearchMisses(dbMisses);
    } catch (err) {
      console.error('Error logging search miss:', err);
    }
  };

  // Vendor Editor Save
  const handleSaveVendor = async (updatedVendor) => {
    if (!isSupabaseConfigured || !isUuid(updatedVendor.id)) {
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
      return;
    }

    try {
      const saved = await saveVendorProfile(updatedVendor);
      setVendors((prev) => {
        const idx = prev.findIndex((v) => v.id === saved.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = saved;
          return copy;
        }
        return [...prev, saved];
      });
      setViewMode('vendor_dashboard');
    } catch (err) {
      console.error('Error saving vendor profile:', err);
    }
  };

  // Admin toggle vendor live/paused
  const handleToggleVendorLive = async (vendorId) => {
    if (!isSupabaseConfigured || !isUuid(vendorId)) {
      setVendors((prev) =>
        prev.map((v) => (v.id === vendorId ? { ...v, isLive: !v.isLive } : v))
      );
      return;
    }

    try {
      const target = vendors.find(v => v.id === vendorId);
      if (target) {
        const updated = { ...target, isLive: !target.isLive };
        const saved = await saveVendorProfile(updated);
        setVendors(prev => prev.map(v => v.id === vendorId ? saved : v));
      }
    } catch (err) {
      console.error('Error toggling vendor live status:', err);
    }
  };

  // Bride data changes inside dashboard (Checklist checking, adding tasks, budget lines)
  const handleUpdateBride = async (updatedBride) => {
    setBride(updatedBride);

    if (!isSupabaseConfigured || !isUuid(updatedBride.id)) return;

    try {
      // Find diffs
      for (const cOld of bride.celebrations) {
        const cNew = updatedBride.celebrations.find(c => c.id === cOld.id);
        if (!cNew) continue;

        // 1. Check for checklists toggled
        for (const itemNew of cNew.checklist) {
          const itemOld = cOld.checklist.find(i => i.id === itemNew.id);
          if (itemOld && itemOld.done !== itemNew.done) {
            await toggleChecklistItem(itemNew.id, itemNew.done);
          }
        }

        // 2. Check for added checklist items
        const addedItems = cNew.checklist.filter(itemNew => !cOld.checklist.some(i => i.id === itemNew.id));
        for (const item of addedItems) {
          const dbItem = await addChecklistItem(cNew.id, item.title, item.dueDate);
          setBride(prev => ({
            ...prev,
            celebrations: prev.celebrations.map(c => {
              if (c.id !== cNew.id) return c;
              return {
                ...c,
                checklist: c.checklist.map(ch => ch.id === item.id ? dbItem : ch)
              };
            })
          }));
        }

        // 3. Check for added budget lines
        const addedLines = cNew.budgetLines.filter(lineNew => !cOld.budgetLines.some(l => l.id === lineNew.id));
        for (const line of addedLines) {
          const dbLine = await addBudgetLine(cNew.id, line.category, line.planned, line.actuallySpent, line.linkedVendor);
          setBride(prev => ({
            ...prev,
            celebrations: prev.celebrations.map(c => {
              if (c.id !== cNew.id) return c;
              return {
                ...c,
                budgetLines: c.budgetLines.map(bl => bl.id === line.id ? dbLine : bl)
              };
            })
          }));
        }
      }
    } catch (err) {
      console.error('Error syncing bride updates to Supabase:', err);
    }
  };

  // Vendor profiles scoping
  const activeVendorProfile = currentUser?.role === 'VENDOR'
    ? (vendors.find(v => v.id === currentUser.id) || vendors[0])
    : vendors[0];

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
            onUpdateBride={handleUpdateBride}
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
            vendor={activeVendorProfile}
            enquiries={enquiries}
            onOpenListingEditor={() => setViewMode('vendor_editor')}
            onOpenInbox={() => setInboxOpen(true)}
          />
        )}

        {viewMode === 'vendor_editor' && (
          <VendorListingEditor
            vendor={activeVendorProfile}
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
