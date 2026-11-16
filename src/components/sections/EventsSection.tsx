import React, { useState } from 'react';
import { WEDDING_CONFIG, EventDetails } from '../../data/weddingConfig';
import {
  Calendar,
  MapPin,
  CalendarPlus,
  ChevronDown,
} from 'lucide-react';
import { getGoogleCalendarUrl, downloadIcsFile } from '../../utils/calendar';

export const EventsSection: React.FC = () => {
  const [activeCalendarMenuId, setActiveCalendarMenuId] = useState<string | null>(null);

  const handleOpenGoogleCal = (event: EventDetails) => {
    const endIso = event.endDateIso || event.dateIso;
    const url = getGoogleCalendarUrl(
      `C. Vignesh & S. Pavithra - ${event.title}`,
      event.notes || '',
      event.addressLines.join(', '),
      event.dateIso,
      endIso
    );
    window.open(url, '_blank', 'noopener,noreferrer');
    setActiveCalendarMenuId(null);
  };

  const handleDownloadIcs = (event: EventDetails) => {
    const endIso = event.endDateIso || event.dateIso;
    downloadIcsFile(
      `C. Vignesh & S. Pavithra - ${event.title}`,
      event.notes || '',
      event.addressLines.join(', '),
      event.dateIso,
      endIso,
      `vignesh-pavithra-${event.id}`
    );
    setActiveCalendarMenuId(null);
  };

  const events = WEDDING_CONFIG.events;

  return (
    <section id="events" className="relative py-12 sm:py-16 md:py-20 px-3 sm:px-6 md:pr-8 lg:pr-12 xl:pr-16 md:pl-[24vw] bg-[#F6EDDC] overflow-hidden select-none md:flex md:flex-col md:items-end">
      {/* ── Background: Authentic Dravidian Temple Architecture (Same as Hero) ── */}
      <div className="hidden md:block absolute inset-0 pointer-events-none select-none z-0">
        <img
          src="/assets/temple_hero_clean_v3.png"
          alt="Sacred Dravidian Temple Sandalwood Pillars"
          className="w-full h-full object-cover object-center opacity-50"
        />
      </div>

      <div className="block md:hidden absolute inset-0 pointer-events-none select-none z-0">
        <img
          src="/assets/temple_hero_mobile_v3.png"
          alt="Sacred Dravidian Temple Towers"
          className="w-full h-full object-cover object-center opacity-65"
        />
      </div>

      {/* Subtle Warm Golden Aura */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255, 238, 190, 0.35) 0%, rgba(246, 237, 220, 0.65) 65%, #F6EDDC 100%)',
        }}
      />

      {/* Top-Right Corner Botanical Leafy Branch */}
      <div className="absolute top-0 right-0 pointer-events-none select-none z-10 opacity-80 sm:opacity-90">
        <svg width="150" height="110" viewBox="0 0 150 110" fill="none" className="w-24 h-18 sm:w-36 sm:h-28">
          <path d="M150 0 C 120 20, 90 35, 60 45" stroke="#7A8B63" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M60 45 C 50 35, 48 20, 58 12 C 68 8, 72 18, 60 45 Z" fill="#6B8A4E" opacity="0.85" />
          <path d="M85 35 C 75 22, 76 8, 88 5 C 98 4, 100 16, 85 35 Z" fill="#7A9A5B" opacity="0.9" />
          <path d="M110 25 C 102 12, 105 2, 116 0 C 126 0, 126 12, 110 25 Z" fill="#5D7A41" opacity="0.85" />
          <path d="M135 15 C 130 5, 134 -2, 142 -2 C 148 -2, 147 6, 135 15 Z" fill="#8CA073" opacity="0.85" />
          <path d="M75 42 C 78 52, 90 56, 96 48 C 100 40, 90 35, 75 42 Z" fill="#5D7A41" opacity="0.8" />
          <path d="M100 30 C 106 40, 118 42, 122 35 C 125 28, 115 24, 100 30 Z" fill="#6B8A4E" opacity="0.8" />
        </svg>
      </div>

      {/* Bottom-Left Corner Floral Bouquet (Pink Roses, White Blossoms & Foliage) */}
      <div className="absolute bottom-0 left-0 pointer-events-none select-none z-10 opacity-85 sm:opacity-95 drop-shadow-sm">
        <svg width="150" height="120" viewBox="0 0 150 120" fill="none" className="w-24 h-20 sm:w-36 sm:h-30">
          <path d="M0 120 C 20 95, 40 90, 55 102 C 45 115, 25 125, 0 120 Z" fill="#5E7A44" opacity="0.85" />
          <path d="M25 120 C 45 80, 70 85, 78 98 C 65 110, 40 120, 25 120 Z" fill="#4B6336" opacity="0.8" />
          <path d="M0 90 C 20 65, 45 68, 52 80 C 40 92, 15 100, 0 90 Z" fill="#6B8A4E" opacity="0.85" />
          <path d="M40 110 C 60 70, 85 75, 95 90 C 80 105, 55 115, 40 110 Z" fill="#7A9A5B" opacity="0.85" />

          {/* Pink Blossom 1 */}
          <g transform="translate(32, 92)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C -7 -10, -5 -16, 0 -18 C 5 -16, 7 -10, 0 0 Z"
                fill="#FDA4AF"
                opacity="0.9"
                transform={`rotate(${angle})`}
              />
            ))}
            <circle cx="0" cy="0" r="4" fill="#F43F5E" />
            <circle cx="0" cy="2" r="2" fill="#FDE047" />
          </g>

          {/* White Jasmine Blossom */}
          <g transform="translate(62, 102)">
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C -5 -8, -4 -13, 0 -15 C 4 -13, 5 -8, 0 0 Z"
                fill="#FFFDF9"
                stroke="#E5D8C4"
                strokeWidth="0.5"
                opacity="0.95"
                transform={`rotate(${angle})`}
              />
            ))}
            <circle cx="0" cy="0" r="3" fill="#FDE047" />
          </g>

          {/* Small Pink Blossom */}
          <g transform="translate(14, 110)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C -5 -7, -3 -11, 0 -12 C 3 -11, 5 -7, 0 0 Z"
                fill="#F472B6"
                opacity="0.85"
                transform={`rotate(${angle})`}
              />
            ))}
            <circle cx="0" cy="0" r="2.5" fill="#FDE047" />
          </g>
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto flex flex-col items-center justify-center my-auto">
        {/* ── Desktop Editorial Header (Hidden on Mobile) ── */}
        <div className="hidden md:block relative z-10 text-center mb-2.5 sm:mb-3.5 max-w-2xl mx-auto px-2 shrink-0">
          {/* 4-Point Golden Star */}
          <div className="flex justify-center mb-0.5 sm:mb-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-[#C49A58]">
              <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" fill="#C49A58" />
            </svg>
          </div>

          {/* Auspicious Milestone Pill */}
          <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-[#FFFDF9]/95 border border-[#C49A58]/70 px-3 py-0.5 sm:py-1 rounded-full shadow-2xs mb-1">
            <span className="text-[10px] sm:text-xs">🪷</span>
            <span className="text-[9px] sm:text-[10px] font-serif-royal font-bold uppercase tracking-widest text-[#98502F]">
              Sacred Auspicious Milestones
            </span>
            <span className="text-[10px] sm:text-xs">🪷</span>
          </div>

          {/* Main Heading — Exactly "Events Timeline" as Requested */}
          <h2 className="font-serif-royal text-xl sm:text-2xl md:text-3xl font-bold text-[#3E2723] tracking-wide mb-0.5 sm:mb-1 uppercase leading-tight">
            Events Timeline
          </h2>

          {/* Subtitle with Ornamental Flourish Lines */}
          <div className="flex items-center justify-center space-x-2 sm:space-x-3">
            <div className="h-[1px] w-8 sm:w-14 bg-gradient-to-r from-transparent via-[#C49A58] to-[#C49A58]" />
            <p className="font-cormorant italic text-[11px] sm:text-xs md:text-sm text-[#6E6053]">
              A sacred journey from the Nilgiri hills to royal Madurai
            </p>
            <div className="h-[1px] w-8 sm:w-14 bg-gradient-to-l from-transparent via-[#C49A58] to-[#C49A58]" />
          </div>
        </div>

        {/* Mobile Header: matches Wedding Venues heading style */}
        <div className="block md:hidden text-center mb-1 xs:mb-1.5 shrink-0 px-2">
          <div className="flex justify-center mb-0.5">
            <svg width="22" height="13" viewBox="0 0 26 15" fill="none">
              <path d="M13 1 C11 5 7 7 2 8 C7 9 11 11 13 15 C15 11 19 9 24 8 C19 7 15 5 13 1 Z" fill="#C49A58" opacity="0.9" />
              <circle cx="13" cy="8" r="1.5" fill="#98502F" />
            </svg>
          </div>
          <div className="inline-flex items-center space-x-1.5 bg-[#FFFDF9]/95 border border-[#C49A58]/70 px-3 py-0.5 rounded-full shadow-2xs mb-0.5">
            <span className="text-[9px] text-[#C49A58]">✦</span>
            <span className="text-[8px] xs:text-[9px] font-serif-royal font-bold uppercase tracking-widest text-[#98502F]">
              Sacred Auspicious Milestones
            </span>
            <span className="text-[9px] text-[#C49A58]">✦</span>
          </div>
          <h2 className="font-serif-royal text-lg xs:text-xl font-bold text-[#3E2723] tracking-wide mb-0.5 uppercase leading-tight">
            Events Timeline
          </h2>
          <div className="flex items-center justify-center space-x-2 mb-0.5">
            <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#C49A58]/70" />
            <p className="font-cormorant italic text-[10px] xs:text-[11px] text-[#6E6053]">
              A sacred journey from the Nilgiri hills to royal Madurai
            </p>
            <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#C49A58]/70" />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* ── DESKTOP TIMELINE: Horizontal Layout Matching Reference Image ── */}
        {/* (3 Arched Pictures + Glowing Horizontal Timeline + Lotus Nodes + 3 Columns) */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div className="hidden md:block relative w-full pt-1 pb-1">
          {/* Continuous Background Golden Line */}
          <div className="absolute left-6 right-6 top-[165px] h-[1.5px] bg-[#E5D8C4]/80 z-0" />

          {/* Glowing Golden Line */}
          <div className="absolute left-6 right-6 top-[165px] h-[2.5px] bg-gradient-to-r from-[#D4A359] via-[#E6B86A] to-[#98502F] shadow-[0_0_14px_rgba(212,163,89,0.9)] z-10" />

          {/* Left & Right Glowing Terminal Dots */}
          <div className="absolute left-4 top-[165px] -translate-y-1/2 w-2 h-2 rounded-full bg-[#D4A359] shadow-[0_0_8px_#D4A359] z-10" />
          <div className="absolute right-4 top-[165px] -translate-y-1/2 w-2 h-2 rounded-full bg-[#D4A359] shadow-[0_0_8px_#D4A359] z-10" />

          {/* Intermediate Golden 4-Point Star Sparklers (between cards) */}
          <div className="absolute left-[33.3%] top-[165px] -translate-x-1/2 -translate-y-1/2 z-15 pointer-events-none">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#C49A58] animate-pulse">
              <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" fill="#D4A359" />
            </svg>
          </div>
          <div className="absolute left-[66.6%] top-[165px] -translate-x-1/2 -translate-y-1/2 z-15 pointer-events-none">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#C49A58] animate-pulse">
              <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" fill="#D4A359" />
            </svg>
          </div>

          {/* 3 Horizontal Columns Grid */}
          <div className="grid grid-cols-3 gap-5 lg:gap-7 xl:gap-8 relative z-20">
            {/* ── DESKTOP COLUMN 1: Engagement – Ooty ── */}
            {(() => {
              const ev = events[0];
              const isMenuOpen = activeCalendarMenuId === ev.id;
              return (
                <div key={ev.id} className="relative flex flex-col items-center group">
                  {/* Top Jharokha Arch Picture */}
                  <div className="w-full h-[165px] flex items-end justify-center overflow-hidden pb-1 transition-transform duration-300 group-hover:scale-[1.02]">
                    <img
                      src="/assets/events/arch_ooty_clean.png"
                      alt="Engagement - Nilgiri Hills & Ooty Heritage Train"
                      className="w-auto h-full max-h-[160px] object-contain drop-shadow-sm select-none"
                    />
                  </div>

                  {/* Lotus Node on the Timeline */}
                  <div className="relative z-20 -my-4 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#FFFDF9] border-2 border-[#D4A359] shadow-md flex items-center justify-center transition-all duration-300 p-0.5 ring-4 ring-[#D4A359]/40 border-[#98502F] scale-110 shadow-[0_0_14px_rgba(212,163,89,0.7)]">
                      <img src="/assets/events/lotus_disc_gold.png" alt="Sacred Lotus" className="w-full h-full object-contain" />
                    </div>
                  </div>

                  {/* Bottom Ivory Card */}
                  <div className="relative w-full rounded-2xl pt-6 pb-3.5 px-3.5 bg-[#FFFDF9]/95 border border-[#C49A58]/70 shadow-sm backdrop-blur-md text-center transition-all duration-300 group-hover:shadow-md flex flex-col justify-between min-h-[185px]">
                    {/* Corner Notched Decorative Accents */}
                    <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-[#D4A359]/70 rounded-tl" />
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-[#D4A359]/70 rounded-tr" />
                    <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-[#D4A359]/70 rounded-bl" />
                    <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-[#D4A359]/70 rounded-br" />

                    <div>
                      <p className="font-serif-royal text-[10px] font-bold tracking-widest text-[#98502F] uppercase">
                        01 · ENGAGEMENT
                      </p>
                      <h3 className="font-serif-royal text-sm lg:text-[15px] font-bold text-[#3E2723] mt-0.5 leading-snug uppercase tracking-wide">
                        Engagement – Ooty
                      </h3>

                      <div className="flex items-center justify-center space-x-1.5 text-[11px] text-[#45352A] mt-2 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#98502F] shrink-0" />
                        <span>13 December 2026</span>
                        <span className="text-[#98502F] font-bold">•</span>
                        <span>6:00 PM onwards</span>
                      </div>

                      <div className="flex items-start justify-center space-x-1.5 text-[10.5px] text-[#5C4D41] mt-1.5 leading-snug">
                        <MapPin className="w-3.5 h-3.5 text-[#98502F] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-[#3E2723]">Sri Srinivasa Perumal Kalyana Mandapam</p>
                          <p className="text-[10px] text-[#766B60]">Ooty · 643001</p>
                        </div>
                      </div>
                    </div>

                    {/* Calendar Action Button */}
                    <div className="relative mt-2.5 pt-2 border-t border-[#E8DEC9]/80">
                      <button
                        onClick={() => setActiveCalendarMenuId(isMenuOpen ? null : ev.id)}
                        className="w-full inline-flex items-center justify-center space-x-1.5 py-1 px-3 bg-[#FAF5EC] hover:bg-[#FFFDF9] border border-[#C49A58] text-[#45352A] rounded-full text-[10.5px] font-serif-royal font-bold uppercase tracking-wider shadow-2xs cursor-pointer transition-all active:scale-98"
                      >
                        <CalendarPlus className="w-3 h-3 text-[#98502F]" />
                        <span>ADD TO CALENDAR</span>
                        <ChevronDown className={`w-2.5 h-2.5 text-[#766B60] transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isMenuOpen && (
                        <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#FFFDF9] border-2 border-[#98502F] rounded-xl p-1 shadow-2xl z-50 space-y-0.5 animate-fadeIn">
                          <button
                            onClick={() => handleOpenGoogleCal(ev)}
                            className="w-full text-left px-2.5 py-1.5 text-xs font-serif-royal font-bold hover:bg-[#FAF5EC] rounded-lg text-[#3E2723] flex items-center justify-between cursor-pointer"
                          >
                            <div className="flex items-center space-x-1.5">
                              <span>📅</span>
                              <span>Google Calendar</span>
                            </div>
                            <span className="text-[9.5px] text-[#98502F] bg-[#FAF5EC] border border-[#E5D8C4] px-1 rounded font-semibold">Web</span>
                          </button>
                          <button
                            onClick={() => handleDownloadIcs(ev)}
                            className="w-full text-left px-2.5 py-1.5 text-xs font-serif-royal font-bold hover:bg-[#FAF5EC] rounded-lg text-[#3E2723] flex items-center justify-between cursor-pointer"
                          >
                            <div className="flex items-center space-x-1.5">
                              <span>🍎</span>
                              <span>Apple / Outlook</span>
                            </div>
                            <span className="text-[9.5px] text-[#98502F] bg-[#FAF5EC] border border-[#E5D8C4] px-1 rounded font-semibold">.ics</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ── DESKTOP COLUMN 2: Auspicious Muhurtham (Center Highlighted) ── */}
            {(() => {
              const ev = events[1];
              const isMenuOpen = activeCalendarMenuId === ev.id;
              return (
                <div key={ev.id} className="relative flex flex-col items-center group">
                  {/* Top Jharokha Arch Picture (Slightly taller canopy) */}
                  <div className="w-full h-[165px] flex items-end justify-center overflow-hidden pb-1 transition-transform duration-300 group-hover:scale-[1.02]">
                    <img
                      src="/assets/events/arch_mandapam_clean.png"
                      alt="Sacred Muhurtham Mandapam"
                      className="w-auto h-full max-h-[175px] object-contain drop-shadow-md select-none scale-105"
                    />
                  </div>

                  {/* Lotus Node on the Timeline */}
                  <div className="relative z-20 -my-4 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#FFFDF9] border-2 border-[#98502F] shadow-md flex items-center justify-center transition-all duration-300 p-0.5 ring-4 ring-amber-500/50 scale-110 shadow-[0_0_18px_rgba(234,88,12,0.6)]">
                      <img src="/assets/events/lotus_disc_gold.png" alt="Sacred Lotus" className="w-full h-full object-contain" />
                    </div>
                  </div>

                  {/* Bottom Ivory Card with Rich Warm Terracotta Border */}
                  <div className="relative w-full rounded-2xl pt-6 pb-3.5 px-3.5 bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E8]/85 to-[#FFFDF9] border-2 border-[#98502F] ring-1 ring-[#D4A359]/70 shadow-md shadow-[#98502F]/10 backdrop-blur-md text-center transition-all duration-300 group-hover:shadow-lg flex flex-col justify-between min-h-[185px]">
                    {/* Corner Notched Decorative Accents */}
                    <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-[#98502F]/80 rounded-tl" />
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-[#98502F]/80 rounded-tr" />
                    <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-[#98502F]/80 rounded-bl" />
                    <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-[#98502F]/80 rounded-br" />

                    <div>
                      <p className="font-serif-royal text-[10px] font-bold tracking-widest text-[#98502F] uppercase">
                        02 · THE WEDDING
                      </p>
                      <h3 className="font-serif-royal text-sm lg:text-[15px] font-bold text-[#3E2723] mt-0.5 leading-snug uppercase tracking-wide">
                        Auspicious Muhurtham
                      </h3>

                      <div className="flex items-center justify-center space-x-1.5 text-[11px] mt-2 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#98502F] shrink-0" />
                        <span className="text-[#45352A]">14 December 2026</span>
                        <span className="text-[#98502F] font-bold">•</span>
                        <span className="text-[#8C3A1A] font-bold">6:15 AM – 7:15 AM</span>
                      </div>

                      <div className="flex items-start justify-center space-x-1.5 text-[10.5px] text-[#5C4D41] mt-1.5 leading-snug">
                        <MapPin className="w-3.5 h-3.5 text-[#98502F] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-[#3E2723]">Sri Srinivasa Perumal Kalyana Mandapam</p>
                          <p className="text-[10px] text-[#766B60]">Ooty · 643001</p>
                        </div>
                      </div>
                    </div>

                    {/* Calendar Action Button */}
                    <div className="relative mt-2.5 pt-2 border-t border-[#E8DEC9]/80">
                      <button
                        onClick={() => setActiveCalendarMenuId(isMenuOpen ? null : ev.id)}
                        className="w-full inline-flex items-center justify-center space-x-1.5 py-1 px-3 bg-gradient-to-r from-[#8C3A1A] to-[#6E2C12] hover:brightness-105 text-[#FFF1B8] border border-[#D4A359] rounded-full text-[10.5px] font-serif-royal font-bold uppercase tracking-wider shadow-md cursor-pointer transition-all active:scale-98"
                      >
                        <CalendarPlus className="w-3 h-3 text-[#FFF1B8]" />
                        <span>ADD TO CALENDAR</span>
                        <ChevronDown className={`w-2.5 h-2.5 text-[#FFF1B8] transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isMenuOpen && (
                        <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#FFFDF9] border-2 border-[#98502F] rounded-xl p-1 shadow-2xl z-50 space-y-0.5 animate-fadeIn">
                          <button
                            onClick={() => handleOpenGoogleCal(ev)}
                            className="w-full text-left px-2.5 py-1.5 text-xs font-serif-royal font-bold hover:bg-[#FAF5EC] rounded-lg text-[#3E2723] flex items-center justify-between cursor-pointer"
                          >
                            <div className="flex items-center space-x-1.5">
                              <span>📅</span>
                              <span>Google Calendar</span>
                            </div>
                            <span className="text-[9.5px] text-[#98502F] bg-[#FAF5EC] border border-[#E5D8C4] px-1 rounded font-semibold">Web</span>
                          </button>
                          <button
                            onClick={() => handleDownloadIcs(ev)}
                            className="w-full text-left px-2.5 py-1.5 text-xs font-serif-royal font-bold hover:bg-[#FAF5EC] rounded-lg text-[#3E2723] flex items-center justify-between cursor-pointer"
                          >
                            <div className="flex items-center space-x-1.5">
                              <span>🍎</span>
                              <span>Apple / Outlook</span>
                            </div>
                            <span className="text-[9.5px] text-[#98502F] bg-[#FAF5EC] border border-[#E5D8C4] px-1 rounded font-semibold">.ics</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ── DESKTOP COLUMN 3: Reception – Madurai ── */}
            {(() => {
              const ev = events[2];
              const isMenuOpen = activeCalendarMenuId === ev.id;
              return (
                <div key={ev.id} className="relative flex flex-col items-center group">
                  {/* Top Jharokha Arch Picture */}
                  <div className="w-full h-[165px] flex items-end justify-center overflow-hidden pb-1 transition-transform duration-300 group-hover:scale-[1.02]">
                    <img
                      src="/assets/events/arch_madurai_clean.png"
                      alt="Reception - Madurai Meenakshi Temple Gopuram"
                      className="w-auto h-full max-h-[160px] object-contain drop-shadow-sm select-none"
                    />
                  </div>

                  {/* Lotus Node on the Timeline */}
                  <div className="relative z-20 -my-4 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#FFFDF9] border-2 border-[#D4A359] shadow-md flex items-center justify-center transition-all duration-300 p-0.5 ring-4 ring-[#D4A359]/40 border-[#98502F] scale-110 shadow-[0_0_14px_rgba(212,163,89,0.7)]">
                      <img src="/assets/events/lotus_disc_gold.png" alt="Sacred Lotus" className="w-full h-full object-contain" />
                    </div>
                  </div>

                  {/* Bottom Ivory Card */}
                  <div className="relative w-full rounded-2xl pt-6 pb-3.5 px-3.5 bg-[#FFFDF9]/95 border border-[#C49A58]/70 shadow-sm backdrop-blur-md text-center transition-all duration-300 group-hover:shadow-md flex flex-col justify-between min-h-[185px]">
                    {/* Corner Notched Decorative Accents */}
                    <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-[#D4A359]/70 rounded-tl" />
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-[#D4A359]/70 rounded-tr" />
                    <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-[#D4A359]/70 rounded-bl" />
                    <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-[#D4A359]/70 rounded-br" />

                    <div>
                      <p className="font-serif-royal text-[10px] font-bold tracking-widest text-[#98502F] uppercase">
                        03 · RECEPTION
                      </p>
                      <h3 className="font-serif-royal text-sm lg:text-[15px] font-bold text-[#3E2723] mt-0.5 leading-snug uppercase tracking-wide">
                        Reception – Madurai
                      </h3>

                      <div className="flex items-center justify-center space-x-1.5 text-[11px] text-[#45352A] mt-2 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#98502F] shrink-0" />
                        <span>15 December 2026</span>
                        <span className="text-[#98502F] font-bold">•</span>
                        <span>From 6:00 PM onwards</span>
                      </div>

                      <div className="flex items-start justify-center space-x-1.5 text-[10.5px] text-[#5C4D41] mt-1.5 leading-snug">
                        <MapPin className="w-3.5 h-3.5 text-[#98502F] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-[#3E2723]">Raja Muthiah Mandram</p>
                          <p className="text-[10px] text-[#766B60]">Madurai · 625020</p>
                        </div>
                      </div>
                    </div>

                    {/* Calendar Action Button */}
                    <div className="relative mt-2.5 pt-2 border-t border-[#E8DEC9]/80">
                      <button
                        onClick={() => setActiveCalendarMenuId(isMenuOpen ? null : ev.id)}
                        className="w-full inline-flex items-center justify-center space-x-1.5 py-1 px-3 bg-[#FAF5EC] hover:bg-[#FFFDF9] border border-[#C49A58] text-[#45352A] rounded-full text-[10.5px] font-serif-royal font-bold uppercase tracking-wider shadow-2xs cursor-pointer transition-all active:scale-98"
                      >
                        <CalendarPlus className="w-3 h-3 text-[#98502F]" />
                        <span>ADD TO CALENDAR</span>
                        <ChevronDown className={`w-2.5 h-2.5 text-[#766B60] transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isMenuOpen && (
                        <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#FFFDF9] border-2 border-[#98502F] rounded-xl p-1 shadow-2xl z-50 space-y-0.5 animate-fadeIn">
                          <button
                            onClick={() => handleOpenGoogleCal(ev)}
                            className="w-full text-left px-2.5 py-1.5 text-xs font-serif-royal font-bold hover:bg-[#FAF5EC] rounded-lg text-[#3E2723] flex items-center justify-between cursor-pointer"
                          >
                            <div className="flex items-center space-x-1.5">
                              <span>📅</span>
                              <span>Google Calendar</span>
                            </div>
                            <span className="text-[9.5px] text-[#98502F] bg-[#FAF5EC] border border-[#E5D8C4] px-1 rounded font-semibold">Web</span>
                          </button>
                          <button
                            onClick={() => handleDownloadIcs(ev)}
                            className="w-full text-left px-2.5 py-1.5 text-xs font-serif-royal font-bold hover:bg-[#FAF5EC] rounded-lg text-[#3E2723] flex items-center justify-between cursor-pointer"
                          >
                            <div className="flex items-center space-x-1.5">
                              <span>🍎</span>
                              <span>Apple / Outlook</span>
                            </div>
                            <span className="text-[9.5px] text-[#98502F] bg-[#FAF5EC] border border-[#E5D8C4] px-1 rounded font-semibold">.ics</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* ── MOBILE TIMELINE: Centered Vertical Cards Matching Target Mockup ── */}
        {/* (NO side line, Framed Arch Pictures + Ivory Notched Cards + Lotus Dividers) */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div className="block md:hidden relative w-full max-w-[325px] xs:max-w-[345px] sm:max-w-[360px] mx-auto pt-0.5 pb-0.5">
          <div className="relative z-20 flex flex-col items-center">
            {/* ── MOBILE EVENT 1: Engagement — Ooty ── */}
            {(() => {
              const ev = events[0];
              const isMenuOpen = activeCalendarMenuId === ev.id;
              return (
                <div key={ev.id} className="relative w-full shrink-0">
                  {/* Top Framed Arch Artwork with Green Foliage Flanks */}
                  <div className="flex h-10 xs:h-11 sm:h-12 w-full items-center justify-center mb-0.5 pointer-events-none">
                    <img
                      src="/assets/events/mobile_frame_ooty_2x.png"
                      alt="Engagement – Nilgiri Hills & Ooty Heritage Train"
                      className="h-full w-auto max-w-[200px] xs:max-w-[220px] object-contain drop-shadow-sm select-none"
                    />
                  </div>

                  {/* Card 1: Ivory with Notched Corners */}
                  <div className="relative w-full rounded-2xl bg-[#FFFDF9]/95 border border-[#C49A58]/70 shadow-xs backdrop-blur-md overflow-hidden text-center transition-all duration-300 py-1.5 px-3 xs:px-3.5">
                    {/* Corner Notched Decorative Accents */}
                    <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t-1.5 border-l-1.5 border-[#D4A359]/70 rounded-tl" />
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t-1.5 border-r-1.5 border-[#D4A359]/70 rounded-tr" />
                    <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b-1.5 border-l-1.5 border-[#D4A359]/70 rounded-bl" />
                    <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b-1.5 border-r-1.5 border-[#D4A359]/70 rounded-br" />

                    {/* Top Step Tag with Gold Accent Lines */}
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#C49A58]" />
                      <span className="font-serif-royal text-[9px] xs:text-[9.5px] font-bold tracking-[0.16em] text-[#98502F] uppercase">
                        01 · ENGAGEMENT
                      </span>
                      <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#C49A58]" />
                    </div>

                    {/* Event Title */}
                    <h3 className="font-serif-royal text-[13px] xs:text-[14px] font-bold text-[#3E2723] mt-0.5 leading-tight uppercase tracking-wide">
                      ENGAGEMENT – OOTY
                    </h3>

                    {/* Date & Time Row */}
                    <div className="mt-1 flex items-center justify-center space-x-1.5 text-[10px] xs:text-[10.5px] text-[#45352A]">
                      <span className="text-blue-600 text-xs">📅</span>
                      <span className="font-medium">13 December 2026</span>
                      <span className="text-[#98502F] font-bold">•</span>
                      <span className="text-[#6E6053] font-medium">🕒 6:00 PM onwards</span>
                    </div>

                    {/* Venue Row */}
                    <div className="mt-0.5 text-[9.5px] xs:text-[10px] text-[#5C4D41] leading-tight text-center">
                      <p className="font-medium text-[#3E2723]">
                        <span className="text-pink-600 text-xs">📍</span> Sri Srinivasa Perumal Kalyana Mandapam
                      </p>
                      <p className="text-[#766B60] text-[9px] xs:text-[9.5px]">Ooty · 643001</p>
                    </div>

                    {/* Terracotta Action Button */}
                    <div className="mt-1.5">
                      <button
                        onClick={() => setActiveCalendarMenuId(isMenuOpen ? null : ev.id)}
                        className="w-full inline-flex items-center justify-center space-x-1.5 py-1 px-3 bg-[#8C3A1A] hover:bg-[#782F13] text-[#FFF1B8] border border-[#D4A359]/70 rounded-full text-[10px] xs:text-[10.5px] font-serif-royal font-bold uppercase tracking-wider shadow-xs cursor-pointer transition-all active:scale-98"
                      >
                        <CalendarPlus className="w-3 h-3 text-[#FFF1B8]" />
                        <span>ADD TO CALENDAR</span>
                        <ChevronDown className={`w-2.5 h-2.5 text-[#FFF1B8] transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isMenuOpen && (
                        <div className="mt-1.5 pt-1.5 border-t border-dashed border-[#8C3A1A]/40 grid grid-cols-2 gap-2 animate-fadeIn">
                          <button
                            onClick={() => handleOpenGoogleCal(ev)}
                            className="flex items-center justify-center space-x-1 py-1 px-2 bg-[#FFFDF9] hover:bg-[#FAF5EC] active:scale-95 border-1.5 border-[#8C3A1A] rounded-lg text-[#8C3A1A] font-serif-royal font-bold text-[10px] shadow-xs cursor-pointer"
                          >
                            <span>📅</span>
                            <span>Google Cal</span>
                            <span className="text-[7.5px] text-white bg-[#8C3A1A] px-1 rounded font-semibold">Web</span>
                          </button>
                          <button
                            onClick={() => handleDownloadIcs(ev)}
                            className="flex items-center justify-center space-x-1 py-1 px-2 bg-[#FFFDF9] hover:bg-[#FAF5EC] active:scale-95 border-1.5 border-[#8C3A1A] rounded-lg text-[#8C3A1A] font-serif-royal font-bold text-[10px] shadow-xs cursor-pointer"
                          >
                            <span>🍎</span>
                            <span>Outlook</span>
                            <span className="text-[7.5px] text-white bg-[#8C3A1A] px-1 rounded font-semibold">.ics</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ── Sacred Lotus Divider between Card 1 & 2 ── */}
            <div className="my-1 xs:my-1.5 flex justify-center items-center w-full pointer-events-none select-none">
              <img
                src="/assets/events/mobile_divider_lotus_2x.png"
                alt=""
                className="h-2.5 xs:h-3 w-auto max-w-[210px] xs:max-w-[230px] object-contain opacity-90"
              />
            </div>

            {/* ── MOBILE EVENT 2: Wedding — Auspicious Muhurtham ── */}
            {(() => {
              const ev = events[1];
              const isMenuOpen = activeCalendarMenuId === ev.id;
              return (
                <div key={ev.id} className="relative w-full shrink-0">
                  {/* Top Framed Arch Artwork with Green Foliage Flanks */}
                  <div className="flex h-10 xs:h-11 sm:h-12 w-full items-center justify-center mb-0.5 pointer-events-none">
                    <img
                      src="/assets/events/mobile_frame_mandapam_2x.png"
                      alt="Auspicious Muhurtham Mandapam"
                      className="h-full w-auto max-w-[200px] xs:max-w-[220px] object-contain drop-shadow-sm select-none"
                    />
                  </div>

                  {/* Card 2: Highlighted with rich warm terracotta/gold & Muhurtham Badge */}
                  <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E8] to-[#FFFDF9] border-1.5 border-[#98502F] shadow-sm backdrop-blur-md overflow-hidden text-center transition-all duration-300 py-1.5 px-3 xs:px-3.5">
                    {/* Corner Notched Decorative Accents */}
                    <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t-1.5 border-l-1.5 border-[#98502F]/80 rounded-tl" />
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t-1.5 border-r-1.5 border-[#98502F]/80 rounded-tr" />
                    <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b-1.5 border-l-1.5 border-[#98502F]/80 rounded-bl" />
                    <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b-1.5 border-r-1.5 border-[#98502F]/80 rounded-br" />

                    {/* Top Step Tag + MUHURTHAM Badge */}
                    <div className="flex items-center justify-between relative px-0.5">
                      <div className="flex items-center space-x-1.5">
                        <div className="h-[1px] w-4 xs:w-5 bg-gradient-to-r from-transparent to-[#C49A58]" />
                        <span className="font-serif-royal text-[9px] xs:text-[9.5px] font-bold tracking-[0.16em] text-[#98502F] uppercase">
                          02 · THE WEDDING
                        </span>
                        <div className="h-[1px] w-4 xs:w-5 bg-gradient-to-l from-transparent to-[#C49A58]" />
                      </div>
                      <span className="text-[8px] xs:text-[8.5px] font-serif-royal font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#8C3A1A] text-white shadow-2xs">
                        MUHURTHAM
                      </span>
                    </div>

                    {/* Event Title */}
                    <h3 className="font-serif-royal text-[13px] xs:text-[14px] font-bold text-[#3E2723] mt-0.5 leading-tight uppercase tracking-wide">
                      AUSPICIOUS MUHURTHAM
                    </h3>

                    {/* Date & Time Row */}
                    <div className="mt-1 flex items-center justify-center space-x-1.5 text-[10px] xs:text-[10.5px] text-[#45352A]">
                      <span className="text-blue-600 text-xs">📅</span>
                      <span className="font-medium">14 December 2026</span>
                      <span className="text-[#98502F] font-bold">•</span>
                      <span className="text-[#8C3A1A] font-bold">🕒 6:15 AM – 7:15 AM</span>
                    </div>

                    {/* Venue Row */}
                    <div className="mt-0.5 text-[9.5px] xs:text-[10px] text-[#5C4D41] leading-tight text-center">
                      <p className="font-medium text-[#3E2723]">
                        <span className="text-pink-600 text-xs">📍</span> Sri Srinivasa Perumal Kalyana Mandapam
                      </p>
                      <p className="text-[#766B60] text-[9px] xs:text-[9.5px]">Ooty · 643001</p>
                    </div>

                    {/* Terracotta Action Button */}
                    <div className="mt-1.5">
                      <button
                        onClick={() => setActiveCalendarMenuId(isMenuOpen ? null : ev.id)}
                        className="w-full inline-flex items-center justify-center space-x-1.5 py-1 px-3 bg-[#8C3A1A] hover:bg-[#782F13] text-[#FFF1B8] border border-[#D4A359]/70 rounded-full text-[10px] xs:text-[10.5px] font-serif-royal font-bold uppercase tracking-wider shadow-xs cursor-pointer transition-all active:scale-98"
                      >
                        <CalendarPlus className="w-3 h-3 text-[#FFF1B8]" />
                        <span>ADD TO CALENDAR</span>
                        <ChevronDown className={`w-2.5 h-2.5 text-[#FFF1B8] transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isMenuOpen && (
                        <div className="mt-1.5 pt-1.5 border-t border-dashed border-[#8C3A1A]/40 grid grid-cols-2 gap-2 animate-fadeIn relative z-20">
                          <button
                            onClick={() => handleOpenGoogleCal(ev)}
                            className="flex items-center justify-center space-x-1 py-1 px-2 bg-[#FFFDF9] hover:bg-[#FAF5EC] active:scale-95 border-1.5 border-[#8C3A1A] rounded-lg text-[#8C3A1A] font-serif-royal font-bold text-[10px] shadow-xs cursor-pointer"
                          >
                            <span>📅</span>
                            <span>Google Cal</span>
                            <span className="text-[7.5px] text-white bg-[#8C3A1A] px-1 rounded font-semibold">Web</span>
                          </button>
                          <button
                            onClick={() => handleDownloadIcs(ev)}
                            className="flex items-center justify-center space-x-1 py-1 px-2 bg-[#FFFDF9] hover:bg-[#FAF5EC] active:scale-95 border-1.5 border-[#8C3A1A] rounded-lg text-[#8C3A1A] font-serif-royal font-bold text-[10px] shadow-xs cursor-pointer"
                          >
                            <span>🍎</span>
                            <span>Outlook</span>
                            <span className="text-[7.5px] text-white bg-[#8C3A1A] px-1 rounded font-semibold">.ics</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ── Sacred Lotus Divider between Card 2 & 3 ── */}
            <div className="my-1 xs:my-1.5 flex justify-center items-center w-full pointer-events-none select-none">
              <img
                src="/assets/events/mobile_divider_lotus_2x.png"
                alt=""
                className="h-2.5 xs:h-3 w-auto max-w-[210px] xs:max-w-[230px] object-contain opacity-90"
              />
            </div>

            {/* ── MOBILE EVENT 3: Reception — Madurai ── */}
            {(() => {
              const ev = events[2];
              const isMenuOpen = activeCalendarMenuId === ev.id;
              return (
                <div key={ev.id} className="relative w-full shrink-0">
                  {/* Top Framed Arch Artwork with Green Foliage Flanks */}
                  <div className="flex h-10 xs:h-11 sm:h-12 w-full items-center justify-center mb-0.5 pointer-events-none">
                    <img
                      src="/assets/events/mobile_frame_madurai_2x.png"
                      alt="Reception – Madurai Meenakshi Temple Gopuram"
                      className="h-full w-auto max-w-[200px] xs:max-w-[220px] object-contain drop-shadow-sm select-none"
                    />
                  </div>

                  {/* Card 3: Ivory with Notched Corners */}
                  <div className="relative w-full rounded-2xl bg-[#FFFDF9]/95 border border-[#C49A58]/70 shadow-xs backdrop-blur-md overflow-hidden text-center transition-all duration-300 py-1.5 px-3 xs:px-3.5">
                    {/* Corner Notched Decorative Accents */}
                    <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t-1.5 border-l-1.5 border-[#D4A359]/70 rounded-tl" />
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t-1.5 border-r-1.5 border-[#D4A359]/70 rounded-tr" />
                    <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b-1.5 border-l-1.5 border-[#D4A359]/70 rounded-bl" />
                    <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b-1.5 border-r-1.5 border-[#D4A359]/70 rounded-br" />

                    {/* Top Step Tag with Gold Accent Lines */}
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#C49A58]" />
                      <span className="font-serif-royal text-[9px] xs:text-[9.5px] font-bold tracking-[0.16em] text-[#98502F] uppercase">
                        03 · RECEPTION
                      </span>
                      <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#C49A58]" />
                    </div>

                    {/* Event Title */}
                    <h3 className="font-serif-royal text-[13px] xs:text-[14px] font-bold text-[#3E2723] mt-0.5 leading-tight uppercase tracking-wide">
                      RECEPTION – MADURAI
                    </h3>

                    {/* Date & Time Row */}
                    <div className="mt-1 flex items-center justify-center space-x-1.5 text-[10px] xs:text-[10.5px] text-[#45352A]">
                      <span className="text-blue-600 text-xs">📅</span>
                      <span className="font-medium">15 December 2026</span>
                      <span className="text-[#98502F] font-bold">•</span>
                      <span className="text-[#6E6053] font-medium">🕒 From 6:00 PM onwards</span>
                    </div>

                    {/* Venue Row */}
                    <div className="mt-0.5 text-[9.5px] xs:text-[10px] text-[#5C4D41] leading-tight text-center">
                      <p className="font-medium text-[#3E2723]">
                        <span className="text-pink-600 text-xs">📍</span> Raja Muthiah Mandram
                      </p>
                      <p className="text-[#766B60] text-[9px] xs:text-[9.5px]">Madurai · 625020</p>
                    </div>

                    {/* Terracotta Action Button */}
                    <div className="mt-1.5">
                      <button
                        onClick={() => setActiveCalendarMenuId(isMenuOpen ? null : ev.id)}
                        className="w-full inline-flex items-center justify-center space-x-1.5 py-1 px-3 bg-[#8C3A1A] hover:bg-[#782F13] text-[#FFF1B8] border border-[#D4A359]/70 rounded-full text-[10px] xs:text-[10.5px] font-serif-royal font-bold uppercase tracking-wider shadow-xs cursor-pointer transition-all active:scale-98"
                      >
                        <CalendarPlus className="w-3 h-3 text-[#FFF1B8]" />
                        <span>ADD TO CALENDAR</span>
                        <ChevronDown className={`w-2.5 h-2.5 text-[#FFF1B8] transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isMenuOpen && (
                        <div className="mt-1.5 pt-1.5 border-t border-dashed border-[#8C3A1A]/40 grid grid-cols-2 gap-2 animate-fadeIn">
                          <button
                            onClick={() => handleOpenGoogleCal(ev)}
                            className="flex items-center justify-center space-x-1 py-1 px-2 bg-[#FFFDF9] hover:bg-[#FAF5EC] active:scale-95 border-1.5 border-[#8C3A1A] rounded-lg text-[#8C3A1A] font-serif-royal font-bold text-[10px] shadow-xs cursor-pointer"
                          >
                            <span>📅</span>
                            <span>Google Cal</span>
                            <span className="text-[7.5px] text-white bg-[#8C3A1A] px-1 rounded font-semibold">Web</span>
                          </button>
                          <button
                            onClick={() => handleDownloadIcs(ev)}
                            className="flex items-center justify-center space-x-1 py-1 px-2 bg-[#FFFDF9] hover:bg-[#FAF5EC] active:scale-95 border-1.5 border-[#8C3A1A] rounded-lg text-[#8C3A1A] font-serif-royal font-bold text-[10px] shadow-xs cursor-pointer"
                          >
                            <span>🍎</span>
                            <span>Outlook</span>
                            <span className="text-[7.5px] text-white bg-[#8C3A1A] px-1 rounded font-semibold">.ics</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Bottom Subtle Journey Flourish Divider (Desktop Only) */}
        <div className="hidden md:flex items-center justify-center space-x-2 sm:space-x-3 mt-4 sm:mt-6 text-center">
          <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent via-[#C49A58] to-[#C49A58]" />
          <span className="text-xs sm:text-sm text-[#C49A58]">🪷</span>
          <p className="font-cormorant italic text-[11px] sm:text-xs md:text-sm text-[#766B60] tracking-wide">
            A journey of love, tradition &amp; togetherness
          </p>
          <span className="text-xs sm:text-sm text-[#C49A58]">🪷</span>
          <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent via-[#C49A58] to-[#C49A58]" />
        </div>
      </div>
    </section>
  );
};
