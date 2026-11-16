import React, { useState } from 'react';
import { WEDDING_CONFIG } from '../../data/weddingConfig';
import { GoldDivider, CornerOrnament, MandapamEntranceArch } from '../ui/TraditionalBorders';
import {
  MapPin,
  Navigation,
  Copy,
  Check,
  Plane,
  Train,
  Car,
  Phone,
  Info,
  Building,
  ThermometerSnowflake,
  Sparkles,
  Mountain,
  Landmark,
  Compass,
} from 'lucide-react';

export const VenueSection: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeVenueTab, setActiveVenueTab] = useState<'both' | 'ooty' | 'madurai'>('both');
  const [mousePosMap, setMousePosMap] = useState<Record<string, { x: number; y: number }>>({});

  const handleCopyAddress = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleNavigate = (query: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCardMouseMove = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePosMap((prev) => ({ ...prev, [id]: { x, y } }));
  };

  const handleCardMouseLeave = (id: string) => {
    setMousePosMap((prev) => ({ ...prev, [id]: { x: 0, y: 0 } }));
  };

  const venuesToDisplay =
    activeVenueTab === 'both'
      ? WEDDING_CONFIG.venues
      : WEDDING_CONFIG.venues.filter((v) =>
          activeVenueTab === 'ooty' ? v.id === 'ooty-mandapam' : v.id === 'madurai-mandapam'
        );

  return (
    <section id="venue" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#FAF5EC] overflow-hidden select-none">
      {/* ── Continuous Dravidian Temple Architectural Side Pillars ── */}
      <div className="absolute top-0 bottom-0 left-0 w-32 sm:w-48 lg:w-64 pointer-events-none opacity-20 sm:opacity-25 z-0 overflow-hidden mix-blend-multiply">
        <img
          src="/assets/temple_hd_left.png"
          alt="Temple Pillar Left"
          className="h-full w-full object-cover object-left"
        />
      </div>
      <div className="absolute top-0 bottom-0 right-0 w-32 sm:w-48 lg:w-64 pointer-events-none opacity-20 sm:opacity-25 z-0 overflow-hidden mix-blend-multiply">
        <img
          src="/assets/temple_hd_right.png"
          alt="Temple Pillar Right"
          className="h-full w-full object-cover object-right"
        />
      </div>

      {/* ── 3D Temple Ambient Glow ── */}
      <div
        className="theme-ambient-glow absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 85% 55% at 50% 30%, rgba(255, 238, 190, 0.45) 0%, rgba(246, 237, 220, 0.20) 55%, transparent 85%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ── Section Cinematic Header ── */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center space-x-2 bg-[#FFFDF9]/95 border-2 border-[#C49A58]/70 px-4 py-1.5 rounded-full shadow-md mb-3 backdrop-blur-xs">
            <Compass className="w-4 h-4 text-[#C49A58]" />
            <span className="text-[11px] font-serif-royal font-bold uppercase tracking-widest text-[#98502F]">
              ✦ Sacred Wedding Destinations ✦
            </span>
          </div>
          <h2 className="font-serif-royal text-3xl sm:text-5xl font-bold text-[#45352A] mt-2 mb-2 tracking-wide">
            Wedding Venues
          </h2>
          <p className="font-cormorant italic text-lg sm:text-2xl text-[#766B60] max-w-xl mx-auto">
            &ldquo;From the mist-crowned Nilgiris to the timeless cultural citadel of Madurai.&rdquo;
          </p>
          <GoldDivider className="my-5" />

          {/* Interactive 3D Gateway Switcher */}
          <div className="flex items-center justify-center space-x-2 mt-4">
            <div className="inline-flex items-center bg-[#FFFDF9] border border-[#E5D8C4] rounded-full p-1 shadow-xs">
              <button
                onClick={() => setActiveVenueTab('both')}
                className={`px-4 py-1.5 rounded-full text-xs font-serif-royal font-semibold transition-all cursor-pointer ${
                  activeVenueTab === 'both'
                    ? 'bg-[#98502F] text-white shadow-xs'
                    : 'text-[#766B60] hover:text-[#45352A]'
                }`}
              >
                Dual Portals (All)
              </button>
              <button
                onClick={() => setActiveVenueTab('ooty')}
                className={`px-4 py-1.5 rounded-full text-xs font-serif-royal font-semibold transition-all cursor-pointer flex items-center space-x-1 ${
                  activeVenueTab === 'ooty'
                    ? 'bg-[#98502F] text-white shadow-xs'
                    : 'text-[#766B60] hover:text-[#45352A]'
                }`}
              >
                <Mountain className="w-3.5 h-3.5" />
                <span>Ooty Muhurtham</span>
              </button>
              <button
                onClick={() => setActiveVenueTab('madurai')}
                className={`px-4 py-1.5 rounded-full text-xs font-serif-royal font-semibold transition-all cursor-pointer flex items-center space-x-1 ${
                  activeVenueTab === 'madurai'
                    ? 'bg-[#98502F] text-white shadow-xs'
                    : 'text-[#766B60] hover:text-[#45352A]'
                }`}
              >
                <Landmark className="w-3.5 h-3.5" />
                <span>Madurai Reception</span>
              </button>
            </div>
          </div>
        </div>

        {/* Engagement Notice Banner */}
        <div className="mb-10 p-4 sm:p-5 bg-[#FFFDF9]/95 border-2 border-[#C49A58] rounded-3xl flex items-center justify-between flex-col sm:flex-row gap-4 shadow-md backdrop-blur-xs">
          <div className="flex items-center space-x-3.5 text-xs sm:text-sm text-[#45352A] text-left">
            <div className="w-10 h-10 rounded-full bg-[#FAF5EC] border-2 border-[#C49A58] flex items-center justify-center text-[#98502F] shrink-0 shadow-2xs">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif-royal font-bold text-[#98502F]">Engagement Ceremony:</span>{' '}
              <span className="text-[#6E6053]">Sunday, 13 December 2026 • Venue details to be confirmed shortly.</span>
            </div>
          </div>
          <span className="text-[11px] font-serif-royal uppercase tracking-wider text-[#98502F] font-bold bg-[#FAF5EC] px-4 py-1.5 rounded-full border border-[#C49A58]">
            Sunday, 13 Dec 2026
          </span>
        </div>

        {/* ── 3D Dimensional Venue Portals Inside Traditional Mandapam Entrance Arch (Sketch Picture 2) ── */}
        <MandapamEntranceArch>
          <div
            className={`grid gap-8 sm:gap-10 ${
              activeVenueTab === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-2xl mx-auto'
            }`}
            style={{ perspective: '1500px' }}
          >
            {venuesToDisplay.map((venue) => {
              const isCopied = copiedId === venue.id;
              const isOoty = venue.id === 'ooty-mandapam';
              const mousePos = mousePosMap[venue.id] || { x: 0, y: 0 };

              return (
                <div
                  key={venue.id}
                  onMouseMove={(e) => handleCardMouseMove(venue.id, e)}
                  onMouseLeave={() => handleCardMouseLeave(venue.id)}
                  className="relative flex flex-col justify-between transition-transform duration-300 ease-out preserve-3d"
                  style={{
                    transform: `rotateY(${mousePos.x * 5}deg) rotateX(${mousePos.y * -5}deg)`,
                  }}
                >
                  <div className="relative h-full bg-[#FFFDF9] border-3 border-[#C49A58] rounded-[2.5rem] p-7 sm:p-10 shadow-2xl transition-all duration-300 flex flex-col justify-between">
                    {/* Decorative Corner Ornaments */}
                    <CornerOrnament position="top-right" className="absolute top-4 right-4 w-9 h-9 opacity-55" />
                    <CornerOrnament position="bottom-left" className="absolute bottom-4 left-4 w-9 h-9 opacity-55" />

                    <div>
                      {/* Atmospheric Portal Header */}
                      <div className="flex items-center justify-between gap-3 mb-5">
                        <span className="text-xs font-serif-royal font-bold text-[#98502F] uppercase tracking-wider bg-[#FAF5EC] px-4 py-1 rounded-full border border-[#C49A58] shadow-2xs">
                          {isOoty ? '🌲 Nilgiris Mountain Sanctuary' : '🏛️ Timeless Pandya Heritage'}
                        </span>
                        <span className="text-2xl animate-float-slow">
                          {isOoty ? '🛕' : '👑'}
                        </span>
                      </div>

                      <h3 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#45352A] mb-1">
                        {venue.name}
                      </h3>
                      <p className="text-xs font-serif-royal text-[#766B60] mb-5 font-semibold">
                        {venue.landmark} • {venue.title}
                      </p>

                      {/* Address Box */}
                      <div className="bg-[#FAF5EC]/90 border-2 border-[#E5D8C4] rounded-2xl p-4 mb-5 text-left flex items-start justify-between gap-3">
                        <div className="flex items-start space-x-2.5">
                          <MapPin className="w-4 h-4 text-[#98502F] shrink-0 mt-0.5" />
                          <p className="text-xs text-[#45352A] leading-relaxed font-medium">
                            {venue.address}
                          </p>
                        </div>

                        <button
                          onClick={() => handleCopyAddress(venue.id, venue.address)}
                          className={`shrink-0 flex items-center space-x-1 px-3 py-1.5 rounded-full text-[11px] font-serif-royal font-semibold border-2 transition-all cursor-pointer ${
                            isCopied
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                              : 'bg-[#FFFDF9] hover:bg-[#FAF5EC] border-[#C49A58] text-[#45352A]'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#98502F]" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Climate & Weather Recommendation Badge */}
                      {venue.travelGuide?.climateTips && (
                        <div className="flex items-start space-x-2.5 text-xs text-[#6E6053] bg-[#FAF5EC] p-3 rounded-2xl border border-[#C49A58]/50 mb-5">
                          <ThermometerSnowflake className="w-4 h-4 text-[#98502F] shrink-0 mt-0.5" />
                          <span>
                            <strong>Weather &amp; Attire:</strong> {venue.travelGuide.climateTips}
                          </span>
                        </div>
                      )}

                      {/* Travel Guide List */}
                      <div className="space-y-2.5 mb-8 text-left text-xs text-[#6E6053]">
                        {venue.travelGuide?.nearestAirport && (
                          <div className="flex items-start space-x-2.5">
                            <Plane className="w-4 h-4 text-[#C49A58] shrink-0 mt-0.5" />
                            <span><strong>Airport:</strong> {venue.travelGuide.nearestAirport}</span>
                          </div>
                        )}

                        {venue.travelGuide?.nearestRailway && (
                          <div className="flex items-start space-x-2.5">
                            <Train className="w-4 h-4 text-[#C49A58] shrink-0 mt-0.5" />
                            <span><strong>Railway:</strong> {venue.travelGuide.nearestRailway}</span>
                          </div>
                        )}

                        {venue.travelGuide?.parking && (
                          <div className="flex items-start space-x-2.5">
                            <Car className="w-4 h-4 text-[#C49A58] shrink-0 mt-0.5" />
                            <span><strong>Parking:</strong> {venue.travelGuide.parking}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions: Google Maps Direct Launch */}
                    <div className="pt-4 border-t border-[#E8DEC9]">
                      <button
                        onClick={() => handleNavigate(venue.address)}
                        className="w-full inline-flex items-center justify-center space-x-2 py-3 px-5 bg-gradient-to-r from-[#98502F] to-[#7d3f23] hover:brightness-110 text-white rounded-full text-xs font-serif-royal font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                      >
                        <Navigation className="w-4 h-4 text-[#FFF1B8]" />
                        <span>Open Live Route in Google Maps</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </MandapamEntranceArch>
      </div>
    </section>
  );
};
