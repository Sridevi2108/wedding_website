import React, { useState, useEffect, useCallback } from 'react';
import { Blessing } from './data/weddingConfig';
import { Navbar } from './components/layout/Navbar';
import { WeddingLoadingScreen } from './components/layout/WeddingLoadingScreen';
import { HeroSection } from './components/sections/HeroSection';
import { PlantBlessingModal } from './components/tree/PlantBlessingModal';
import { AdminModal } from './components/admin/AdminModal';
import { JasmineGarlandHeader } from './components/ui/TraditionalBorders';
import { fetchLiveBlessings } from './utils/supabaseBlessings';
import { weddingAudio } from './utils/weddingAudio';

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    try {
      return localStorage.getItem('wedding_theme') !== 'light';
    } catch (error) {
      console.warn('Theme preference read notice:', error);
      return document.documentElement.dataset.theme !== 'light';
    }
  });
  const [blessings, setBlessings] = useState<Blessing[]>([]);
  const [isLoadingScreenVisible, setIsLoadingScreenVisible] = useState(true);
  const [isPlantModalOpen, setIsPlantModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const dismissLoadingScreen = useCallback(() => setIsLoadingScreenVisible(false), []);
  // Keep the public tree synchronized with newly approved blessings.
  const fetchBlessings = useCallback(async () => {
    let serverBlessings: Blessing[] = [];
    try {
      serverBlessings = (await fetchLiveBlessings()) as Blessing[];
    } catch (err) {
      console.warn('Live blessings refresh notice:', err);
    }

    // Merge with any blessings submitted in local storage
    let localBlessings: Blessing[] = [];
    try {
      const raw = localStorage.getItem('wedding_local_blessings');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) localBlessings = parsed;
      }
    } catch (e) {
      console.warn('LocalStorage read notice:', e);
    }

    const combined = [...localBlessings];
    for (const b of serverBlessings) {
      if (!combined.some((item) => item.id === b.id)) {
        combined.push(b);
      }
    }

    if (combined.length > 0) {
      setBlessings((current) => {
        const isUnchanged =
          current.length === combined.length &&
          current.every((blessing, index) => {
            const nextBlessing = combined[index] as Blessing;
            return blessing.id === nextBlessing.id && blessing.message === nextBlessing.message;
          });
        return isUnchanged ? current : combined;
      });
    }
  }, []);

  useEffect(() => {
    weddingAudio.setupAutoPlay();
    fetchBlessings();
    const refreshVisiblePage = () => {
      if (document.visibilityState === 'visible') fetchBlessings();
    };
    const intervalId = window.setInterval(refreshVisiblePage, 5000);
    document.addEventListener('visibilitychange', refreshVisiblePage);
    window.addEventListener('focus', refreshVisiblePage);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', refreshVisiblePage);
      window.removeEventListener('focus', refreshVisiblePage);
    };
  }, [fetchBlessings]);

  // Track active section using IntersectionObserver
  useEffect(() => {
    const sectionIds = ['home', 'events', 'venue', 'invitation', 'blessings', 'footer'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('wedding-section-reveal', 'is-visible');
          }
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            const id = entry.target.id;
            if (id === 'footer') {
              setActiveSection('blessings');
            } else if (sectionIds.includes(id)) {
              setActiveSection(id);
            }
          }
        });
      },
      { threshold: [0.4, 0.6] }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const targetId = id === 'blessing-tree' ? 'blessings' : id;
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = isDarkTheme ? 'dark' : 'light';
    try {
      localStorage.setItem('wedding_theme', isDarkTheme ? 'dark' : 'light');
    } catch (error) {
      console.warn('Theme preference save notice:', error);
    }
  }, [isDarkTheme]);

  const toggleTheme = () => {
    document.documentElement.classList.add('theme-transition');
    window.setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 400);
    setIsDarkTheme((current) => !current);
  };

  return (
    <div className="min-h-screen bg-[#F8F2E7] text-[#45352A] flex flex-col selection:bg-[#C49A58]/25 selection:text-[#45352A]">
      {/* Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onPlantBlessingClick={() => setIsPlantModalOpen(true)}
        onAdminClick={() => setIsAdminModalOpen(true)}
        onNavClick={scrollToSection}
        isDarkTheme={isDarkTheme}
        onThemeToggle={toggleTheme}
      />

      {/* Royal Slide-in Menu Drawer (Triggered by in-hero 'Menu' button) */}
      {isMenuDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-start bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-80 max-w-[85vw] h-full bg-[#FFFDF9] border-r-2 border-[#C49A58] p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E5D8C4] mb-6">
                <div>
                  <span className="font-serif-royal font-bold text-lg text-[#45352A]">Vignesh &amp; Pavithra</span>
                  <span className="block text-[10px] font-serif-royal uppercase text-[#98502F]">Royal Wedding Celebration</span>
                </div>
                <button
                  onClick={() => setIsMenuDrawerOpen(false)}
                  className="p-1.5 text-[#766B60] hover:text-[#98502F] rounded-full hover:bg-[#FAF5EC]"
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1 font-serif-royal text-sm">
                {[
                  { id: 'home', label: 'Home' },
                  { id: 'events', label: 'Events Timeline' },
                  { id: 'venue', label: 'Wedding Venues' },
                  { id: 'invitation', label: 'Digital Invitation' },
                  { id: 'blessings', label: 'Post Your Blessings' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setIsMenuDrawerOpen(false);
                      scrollToSection(item.id);
                    }}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-[#FAF5EC] text-[#45352A] hover:text-[#98502F] transition-all cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5D8C4] space-y-3">
              <button
                onClick={() => {
                  setIsMenuDrawerOpen(false);
                  setIsPlantModalOpen(true);
                }}
                className="w-full py-2.5 bg-gradient-to-r from-[#D48B28] to-[#98502F] hover:brightness-105 text-white rounded-xl font-serif-royal text-xs font-semibold shadow-xs cursor-pointer"
              >
                Post Your Blessings
              </button>
              <div className="text-center text-[11px] text-[#766B60] font-serif-royal">
                Monday, 14 December 2026 • Ooty &amp; Madurai
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        {/* ── 100% Unified 3D Temple Scrollytelling Movie Runway ── */}
        <HeroSection
          blessings={blessings}
          onPlantBlessingClick={() => setIsPlantModalOpen(true)}
          onOpenMenu={() => setIsMenuDrawerOpen(true)}
          isDarkTheme={isDarkTheme}
          activeSection={activeSection}
          onActiveSectionChange={setActiveSection}
        />
      </main>

      {isLoadingScreenVisible && <WeddingLoadingScreen onComplete={dismissLoadingScreen} />}

      {/* Plant Blessing Modal Dialog */}
      <PlantBlessingModal
        isOpen={isPlantModalOpen}
        onClose={() => setIsPlantModalOpen(false)}
        onBlessingSubmitted={fetchBlessings}
      />

      {/* Admin Moderation Modal Dialog */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onBlessingsModified={fetchBlessings}
      />
    </div>
  );
}
