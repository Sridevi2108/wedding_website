import React, { useState, useEffect } from 'react';
import { CornerOrnament } from '../ui/TraditionalBorders';
import {
  Maximize2,
  Minimize2,
  Share2,
  Download,
  ChevronLeft,
  ChevronRight,
  Scroll,
} from 'lucide-react';

const INVITATION_PAGES = [
  {
    page: 1,
    title: 'Auspicious Beginning',
    tab: '🪷 Cover • Ganesha',
    subtitle: 'Om Shree Ganeshay Namah',
    image: '/assets/invitation/invitation_page_1.png',
  },
  {
    page: 2,
    title: 'The Sacred Wedding',
    tab: '💑 The Couple & Date',
    subtitle: 'C. Vignesh & S. Pavithra • Dec 14, 2026',
    image: '/assets/invitation/invitation_page_2.png',
  },
  {
    page: 3,
    title: 'Events Timeline & Venues',
    tab: '📜 Events & Venues',
    subtitle: 'Engagement, Muhurtham & Reception',
    image: '/assets/invitation/invitation_page_3.png',
  },
];

export const InvitationSection: React.FC = () => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [cardMousePos, setCardMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleShareWhatsApp = () => {
    const text = `🌸 *Wedding Invitation: C. Vignesh & S. Pavithra* 🌸\n\nTogether with the family, we cordially invite you to celebrate our auspicious wedding ceremony on *Monday, 14 December 2026* at Ooty, followed by the Grand Reception at Madurai.\n\nView our digital wedding invitation:\n${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setCardMousePos({ x: x * 10, y: -y * 10 });
  };

  const handleCardMouseLeave = () => {
    setIsHovered(false);
    setCardMousePos({ x: 0, y: 0 });
  };

  // Keyboard navigation for Fullscreen Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setPageIndex((prev) => (prev < INVITATION_PAGES.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setPageIndex((prev) => (prev > 0 ? prev - 1 : INVITATION_PAGES.length - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  return (
    <section id="invitation" className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#F8F2E7] overflow-hidden select-none">
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

      {/* ── 3D Temple Ambient Aura ── */}
      <div
        className="theme-ambient-glow absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 85% 55% at 50% 25%, rgba(255, 238, 190, 0.50) 0%, rgba(246, 237, 220, 0.20) 55%, transparent 85%)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* ── Section Header ── */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center space-x-2 bg-[#FFFDF9]/95 border-2 border-[#C49A58]/70 px-4 py-1.5 rounded-full shadow-md mb-2 backdrop-blur-xs">
            <Scroll className="w-4 h-4 text-[#C49A58]" />
            <span className="text-[11px] font-serif-royal font-bold uppercase tracking-widest text-[#98502F]">
              ✦ Official Wedding Invitation ✦
            </span>
          </div>
          <h2 className="font-serif-royal text-2xl sm:text-4xl lg:text-5xl font-bold text-[#45352A] mt-1 mb-1 tracking-wide">
            The Royal Patrika
          </h2>
          <p className="font-serif-royal text-xs sm:text-sm text-[#98502F] font-semibold">
            (Hover to tilt · Click to view full screen)
          </p>

          {/* 3-Page Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {INVITATION_PAGES.map((pg, idx) => (
              <button
                key={pg.page}
                onClick={() => setPageIndex(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-serif-royal font-bold transition-all cursor-pointer ${
                  pageIndex === idx
                    ? 'bg-[#98502F] text-white shadow-md scale-105 ring-2 ring-[#C49A58]/50'
                    : 'bg-[#FFFDF9] text-[#766B60] hover:text-[#45352A] border border-[#E5D8C4]'
                }`}
              >
                {pg.tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── 3D Interactive Invitation Patrika Card ── */}
        <div className="relative mx-auto max-w-sm sm:max-w-md" style={{ perspective: '1200px' }}>
          <div
            onMouseMove={handleCardMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleCardMouseLeave}
            onClick={() => setIsLightboxOpen(true)}
            className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#FFFDF9] border-3 sm:border-4 border-[#C49A58] rounded-[2rem] sm:rounded-[2.5rem] p-3 sm:p-4 shadow-2xl transition-transform duration-200 ease-out cursor-pointer group"
            style={{
              transform: `perspective(1000px) rotateY(${cardMousePos.x}deg) rotateX(${cardMousePos.y}deg) scale(${isHovered ? 1.02 : 1})`,
              transformStyle: 'preserve-3d',
            }}
            title="Click to view full screen"
          >
            {/* Corner Ornaments */}
            <CornerOrnament position="top-left" className="absolute top-3 left-3 w-8 h-8 opacity-75 pointer-events-none" />
            <CornerOrnament position="top-right" className="absolute top-3 right-3 w-8 h-8 opacity-75 pointer-events-none" />
            <CornerOrnament position="bottom-left" className="absolute bottom-3 left-3 w-8 h-8 opacity-75 pointer-events-none" />
            <CornerOrnament position="bottom-right" className="absolute bottom-3 right-3 w-8 h-8 opacity-75 pointer-events-none" />

            {/* Rendered PDF Page Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-inner border border-[#E5D8C4] bg-white aspect-[894/1258]">
              <img
                src={INVITATION_PAGES[pageIndex].image}
                alt={`Wedding Invitation - ${INVITATION_PAGES[pageIndex].title}`}
                className="w-full h-full object-contain pointer-events-none"
              />

              {/* Specular golden light sheen tracking mouse */}
              <div
                className="absolute inset-0 pointer-events-none opacity-35 transition-opacity group-hover:opacity-55"
                style={{
                  background: `radial-gradient(circle 260px at ${50 + cardMousePos.x * 3}% ${50 - cardMousePos.y * 3}%, rgba(255,245,215,0.7) 0%, transparent 80%)`,
                }}
              />

              {/* Hover Click to View Full Screen Indicator */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                <span className="px-4 py-2 bg-[#FFFDF9]/95 border border-[#C49A58] text-[#45352A] font-serif-royal text-xs font-bold rounded-full shadow-xl flex items-center space-x-2 transform scale-95 group-hover:scale-100 transition-transform">
                  <Maximize2 className="w-4 h-4 text-[#98502F]" />
                  <span>Click to view full screen</span>
                </span>
              </div>
            </div>

            {/* Prev / Next Page Chevrons on hover */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPageIndex((prev) => (prev > 0 ? prev - 1 : INVITATION_PAGES.length - 1));
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FFFDF9]/95 border border-[#C49A58] text-[#98502F] flex items-center justify-center opacity-80 hover:opacity-100 shadow-md cursor-pointer transition-all"
              title="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setPageIndex((prev) => (prev < INVITATION_PAGES.length - 1 ? prev + 1 : 0));
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FFFDF9]/95 border border-[#C49A58] text-[#98502F] flex items-center justify-center opacity-80 hover:opacity-100 shadow-md cursor-pointer transition-all"
              title="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="inline-flex items-center space-x-2 px-5 py-2 bg-[#98502F] hover:bg-[#7d3f23] text-white rounded-full text-xs font-serif-royal font-bold shadow-md cursor-pointer transition-all active:scale-98"
          >
            <Maximize2 className="w-4 h-4 text-[#FFF1B8]" />
            <span>Click to view full screen</span>
          </button>

          <a
            href="/assets/invitation/wedding_invitation.pdf"
            download="C-Vignesh-and-S-Pavithra-Wedding-Invitation.pdf"
            className="inline-flex items-center space-x-2 px-5 py-2 bg-[#FFFDF9] hover:bg-[#FAF5EC] border-2 border-[#C49A58] text-[#45352A] rounded-full text-xs font-serif-royal font-bold shadow-xs cursor-pointer transition-all active:scale-98"
          >
            <Download className="w-4 h-4 text-[#98502F]" />
            <span>Download PDF</span>
          </a>

          <button
            onClick={handleShareWhatsApp}
            className="inline-flex items-center space-x-2 px-5 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full text-xs font-serif-royal font-bold shadow-xs cursor-pointer transition-all active:scale-98"
          >
            <Share2 className="w-4 h-4" />
            <span>Share on WhatsApp</span>
          </button>
        </div>

        {/* ── Fullscreen Lightbox Modal ── */}
        {isLightboxOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 animate-fadeIn select-none"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Top Header Bar */}
            <div
              className="flex items-center justify-between w-full max-w-4xl mx-auto pb-2 border-b border-white/15"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-amber-400 text-sm">🪷</span>
                  <span className="text-white font-serif-royal font-bold text-sm sm:text-base">
                    C. Vignesh &amp; S. Pavithra — Wedding Invitation
                  </span>
                </div>
                <p className="text-amber-200/80 font-serif-royal text-xs">
                  Page {pageIndex + 1} of {INVITATION_PAGES.length}: {INVITATION_PAGES[pageIndex].title} ({INVITATION_PAGES[pageIndex].subtitle})
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href="/assets/invitation/wedding_invitation.pdf"
                  download="C-Vignesh-and-S-Pavithra-Wedding-Invitation.pdf"
                  className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#FFFDF9]/15 hover:bg-[#FFFDF9]/25 text-white text-xs font-serif-royal border border-white/20 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>

                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
                  title="Close (Esc)"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Center Stage: High-Resolution Page Image with Left & Right Arrows */}
            <div
              className="relative flex-1 flex items-center justify-center py-2 sm:py-4 px-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPageIndex((prev) => (prev > 0 ? prev - 1 : INVITATION_PAGES.length - 1))}
                className="absolute left-2 sm:left-6 z-10 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white border border-white/20 transition-all cursor-pointer hover:scale-110 active:scale-95"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>

              <img
                src={INVITATION_PAGES[pageIndex].image}
                alt={INVITATION_PAGES[pageIndex].title}
                className="max-h-[74vh] sm:max-h-[78vh] max-w-[88vw] sm:max-w-[70vw] object-contain rounded-2xl border-2 border-[#C49A58] shadow-[0_0_40px_rgba(196,154,88,0.35)] select-none animate-fadeIn"
              />

              <button
                onClick={() => setPageIndex((prev) => (prev < INVITATION_PAGES.length - 1 ? prev + 1 : 0))}
                className="absolute right-2 sm:right-6 z-10 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white border border-white/20 transition-all cursor-pointer hover:scale-110 active:scale-95"
                aria-label="Next Page"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </div>

            {/* Bottom Bar: Page Selector Tabs & Download */}
            <div
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full max-w-2xl mx-auto pt-2 border-t border-white/15"
              onClick={(e) => e.stopPropagation()}
            >
              {INVITATION_PAGES.map((pg, idx) => (
                <button
                  key={pg.page}
                  onClick={() => setPageIndex(idx)}
                  className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-serif-royal font-bold transition-all cursor-pointer ${
                    pageIndex === idx
                      ? 'bg-gradient-to-r from-[#D48B28] to-[#98502F] text-white shadow-lg ring-2 ring-amber-400/50 scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-white/80 border border-white/20'
                  }`}
                >
                  {pg.tab}
                </button>
              ))}

              <a
                href="/assets/invitation/wedding_invitation.pdf"
                download="C-Vignesh-and-S-Pavithra-Wedding-Invitation.pdf"
                className="sm:hidden inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white/15 text-white text-xs font-serif-royal border border-white/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
