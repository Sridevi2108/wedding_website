import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Volume2,
  VolumeX,
  Lock,
} from 'lucide-react';
import { weddingAudio } from '../../utils/weddingAudio';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  activeSection: string;
  onPlantBlessingClick: () => void;
  onAdminClick: () => void;
  onNavClick?: (id: string) => void;
  isDarkTheme: boolean;
  onThemeToggle: () => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'couple', label: 'The Couple' },
  { id: 'events', label: 'Events Timeline' },
  { id: 'venue', label: 'Venue' },
  { id: 'invitation', label: 'Invitation' },
  { id: 'blessings', label: 'Blessings' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onPlantBlessingClick,
  onAdminClick,
  onNavClick,
  isDarkTheme,
  onThemeToggle,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(weddingAudio.getIsPlaying());

  useEffect(() => {
    weddingAudio.setupAutoPlay();
    return weddingAudio.subscribe((playing) => setIsPlayingMusic(playing));
  }, []);

  const handleToggleMusic = () => {
    weddingAudio.toggle();
  };

  const handleNavClick = (id: string) => {
    setIsMobileOpen(false);
    if (onNavClick) {
      onNavClick(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* ── DESKTOP NAVBAR (lg:flex) ── */}
      <nav className="hidden lg:block fixed top-0 left-0 right-0 z-40 bg-[#FFFDF9]/95 shadow-xs backdrop-blur-md py-2.5 sm:py-3 transition-all duration-300 pointer-events-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          {/* Brand / Logo (Clean without design lines) */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-left group cursor-pointer focus:outline-none flex items-center space-x-2"
          >
            <div className="shrink-0 w-8 h-8 flex items-center justify-center">
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none" className="text-[#C49A58] drop-shadow-xs">
                <path d="M14 4 L16 1 L18 4 Z" fill="#98502F" />
                <circle cx="16" cy="2" r="1" fill="#FFF1B8" />
                <path d="M12 5 L20 5 L19 8 L13 8 Z" fill="#C49A58" stroke="#98502F" strokeWidth="0.5" />
                <path d="M10 9 L22 9 L21 13 L11 13 Z" fill="#D4A76A" stroke="#98502F" strokeWidth="0.5" />
                <path d="M8 14 L24 14 L23 18 L9 18 Z" fill="#C49A58" stroke="#98502F" strokeWidth="0.5" />
                <path d="M6 19 L26 19 L25 24 L7 24 Z" fill="#D4A76A" stroke="#98502F" strokeWidth="0.5" />
                <path d="M4 25 L28 25 L28 31 L4 31 Z" fill="#98502F" />
                <path d="M12 31 C 12 27, 20 27, 20 31 Z" fill="#FFFDF9" />
              </svg>
            </div>

            <div>
              <span className="font-serif-royal text-base lg:text-lg font-bold tracking-wider text-[#45352A] group-hover:text-[#98502F] transition-colors leading-tight block">
                VIGNESH &amp; PAVITHRA
              </span>
              <span className="text-[10px] font-serif-royal uppercase tracking-widest text-[#766B60] font-semibold block mt-0.5">
                14 DECEMBER 2026
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="flex items-center space-x-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-serif-royal tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D48B28] to-[#98502F] text-white font-bold shadow-md scale-105'
                      : 'text-[#45352A] hover:text-[#98502F] font-semibold hover:bg-[#FAF5EC]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right: Theme and Audio Toggles */}
          <div className="flex items-center space-x-3">
            <ThemeToggle isDark={isDarkTheme} onToggle={onThemeToggle} />
            <button
              data-audio-toggle
              onClick={handleToggleMusic}
              className={`p-2 rounded-full border border-[#C49A58]/80 shadow-xs transition-all cursor-pointer ${
                isPlayingMusic ? 'bg-[#98502F] text-white' : 'bg-[#FFFDF9] text-[#766B60] hover:text-[#45352A]'
              }`}
              title={isPlayingMusic ? 'Turn Off Music' : 'Turn On Music'}
              aria-label={isPlayingMusic ? 'Turn Off Music' : 'Turn On Music'}
            >
              {isPlayingMusic ? <Volume2 className="w-4 h-4 text-[#FFF1B8]" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE FLOATING PILLS HEADER (lg:hidden) matching target design ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 p-3 sm:p-4 flex items-center justify-between pointer-events-none">
        {/* Left Floating Pill: MENU */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="pointer-events-auto flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-b from-[#FFFDF9] to-[#F5EAD4] border border-[#C49A58]/80 text-[#7A3A1B] hover:text-[#98502F] active:scale-95 transition-all cursor-pointer shadow-none"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-4 h-4 text-[#8C3814]" />
          <span className="font-serif-royal text-xs font-bold tracking-wider uppercase text-[#7A3A1B]">Menu</span>
        </button>

        {/* Right Floating Theme and Music Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          <ThemeToggle isDark={isDarkTheme} onToggle={onThemeToggle} />
          <button
            data-audio-toggle
            onClick={handleToggleMusic}
            className={`p-2 sm:p-2.5 rounded-full border shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
              isPlayingMusic
                ? 'bg-gradient-to-b from-[#98502F] to-[#7A3E20] border-[#C49A58] text-[#FFF1B8] shadow-[0_0_10px_rgba(196,154,88,0.4)]'
                : 'bg-gradient-to-b from-[#FFFDF9] to-[#F5EAD4] border-[#C49A58]/80 text-[#7A3A1B]'
            }`}
            aria-label={isPlayingMusic ? 'Turn Off Music' : 'Turn On Music'}
            title={isPlayingMusic ? 'Turn Off Music' : 'Turn On Music'}
          >
            {isPlayingMusic ? (
              <Volume2 className="w-4 h-4 text-[#FFF1B8] animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#8C3814]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu & Backdrop (High contrast, clearly visible) */}
      {isMobileOpen && (
        <>
          <div
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden animate-fadeIn"
          />
          <div className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-[#FFFDF9] border-r-2 border-[#C49A58] p-6 shadow-2xl z-[100] flex flex-col justify-between lg:hidden animate-fadeIn">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E5D8C4]">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <svg width="26" height="26" viewBox="0 0 32 32" fill="none" className="text-[#C49A58]">
                      <path d="M14 4 L16 1 L18 4 Z" fill="#98502F" />
                      <circle cx="16" cy="2" r="1" fill="#FFF1B8" />
                      <path d="M12 5 L20 5 L19 8 L13 8 Z" fill="#C49A58" stroke="#98502F" strokeWidth="0.5" />
                      <path d="M10 9 L22 9 L21 13 L11 13 Z" fill="#D4A76A" stroke="#98502F" strokeWidth="0.5" />
                      <path d="M8 14 L24 14 L23 18 L9 18 Z" fill="#C49A58" stroke="#98502F" strokeWidth="0.5" />
                      <path d="M6 19 L26 19 L25 24 L7 24 Z" fill="#D4A76A" stroke="#98502F" strokeWidth="0.5" />
                      <path d="M4 25 L28 25 L28 31 L4 31 Z" fill="#98502F" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif-royal font-bold text-sm text-[#45352A]">VIGNESH &amp; PAVITHRA</h3>
                    <p className="text-[10px] font-serif-royal uppercase tracking-wider text-[#98502F] font-semibold">14 DECEMBER 2026</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1.5 text-[#766B60] hover:text-[#98502F] rounded-full hover:bg-[#FAF5EC] cursor-pointer"
                  aria-label="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links - Bold, High-Contrast, Clearly Visible */}
              <div className="space-y-2">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl font-serif-royal text-sm font-bold tracking-wide transition-all cursor-pointer flex items-center justify-between ${
                        isActive
                          ? 'bg-gradient-to-r from-[#D48B28] via-[#B87333] to-[#98502F] text-white shadow-md border border-[#C49A58]'
                          : 'bg-[#FAF5EC] text-[#45352A] hover:text-[#98502F] hover:bg-[#F3EAD9] border border-[#E5D8C4] shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className={`text-xs ${isActive ? 'text-[#FFF1B8]' : 'text-[#C49A58]'}`}>✦</span>
                        <span className="font-bold">{item.label}</span>
                      </div>
                      {isActive && <span className="text-[11px] text-[#FFF1B8] font-bold">Active</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5D8C4] flex items-center justify-between text-xs text-[#766B60]">
              <button
                onClick={() => {
                  setIsMobileOpen(false);
                  onAdminClick();
                }}
                className="flex items-center space-x-1.5 text-[#766B60] hover:text-[#98502F] py-1 cursor-pointer font-semibold"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Family Moderation</span>
              </button>
              <span className="text-[10px] font-serif-royal text-[#98502F] font-bold">Ooty &amp; Madurai</span>
            </div>
          </div>
        </>
      )}
    </>
  );
};
