import React, { useState, useEffect, useRef } from 'react';
import { WEDDING_CONFIG, EventDetails, Blessing } from '../../data/weddingConfig';
import { getGoogleCalendarUrl, downloadIcsFile } from '../../utils/calendar';
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Navigation,
  Download,
  CalendarPlus,
  Check,
  Copy,
  Maximize2,
  Minimize2,
  Share2,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

interface HeroSectionProps {
  blessings: Blessing[];
  onPlantBlessingClick: () => void;
  onOpenMenu?: () => void;
  isDarkTheme: boolean;
  activeSection: string;
  onActiveSectionChange?: (section: string) => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

const PARTICLES_PER_SECTION = 24;
const AMBIENT_SCENE_COUNT = 6;

const AMBIENT_PARTICLES = Array.from({ length: PARTICLES_PER_SECTION * AMBIENT_SCENE_COUNT }, (_, index) => {
  const sectionIndex = Math.floor(index / PARTICLES_PER_SECTION);
  const localIndex = index % PARTICLES_PER_SECTION;
  const isLotus = localIndex === 12;
  const isSparkle = localIndex === 18;
  const isBlurred = localIndex % 3 !== 0;
  const sectionOffset = ((localIndex * 47 + 13) % 91) / 100;

  return {
    left: `${(localIndex * 37 + 11) % 96}%`,
    top: `${((sectionIndex + sectionOffset) / AMBIENT_SCENE_COUNT) * 100}%`,
    delay: `-${(index * 7) % 29}s`,
    duration: `${12 + (index * 5) % 9}s`,
    size: isLotus ? '1.2rem' : isSparkle ? '0.95rem' : `${8 + (localIndex % 5) * 2}px`,
    blur: isLotus || isSparkle || !isBlurred ? 0 : 1 + (localIndex % 4) * 0.6,
    opacity: isLotus ? 0.55 : isSparkle ? 0.65 : isBlurred ? 0.32 : 0.48,
    symbol: isLotus ? '🪷' : isSparkle ? '✦' : null,
  };
});

const WeddingSectionOrnament = () => (
  <div className="wedding-section-ornament" aria-hidden="true">
    <span>✦</span>
    <span className="wedding-section-ornament__lotus">🪷</span>
    <span>✦</span>
  </div>
);

// 3-Page Official Wedding Invitation PDF Pages
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

export const HeroSection: React.FC<HeroSectionProps> = ({
  blessings,
  onPlantBlessingClick,
  onOpenMenu,
  isDarkTheme,
  activeSection,
  onActiveSectionChange,
}) => {
  // Target: Monday, 14 December 2026 06:15 AM IST (Asia/Kolkata)
  const targetTime = new Date('2026-12-14T06:15:00+05:30').getTime();

  const calculateTimeLeft = (): TimeRemaining => {
    const now = Date.now();
    const diff = targetTime - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isPast: false };
  };

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(calculateTimeLeft);
  const [pulseSeconds, setPulseSeconds] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Events scene state
  const [activeCalendarMenuId, setActiveCalendarMenuId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Invitation scene state (PDF pages viewer with 3D tilt & fullscreen lightbox)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [invitationPageIndex, setInvitationPageIndex] = useState<number>(0);
  const [invitationTilt, setInvitationTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isInvitationHovered, setIsInvitationHovered] = useState<boolean>(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Countdown timer interval
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
      setPulseSeconds(true);
      setTimeout(() => setPulseSeconds(false), 300);
    }, 1000);
    return () => clearInterval(timer);
  }, [targetTime]);

  // Keyboard navigation for Fullscreen PDF Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setInvitationPageIndex((prev) => (prev < INVITATION_PAGES.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setInvitationPageIndex((prev) => (prev > 0 ? prev - 1 : INVITATION_PAGES.length - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  // Calendar & Directions helpers
  const handleOpenGoogleCal = (event: EventDetails) => {
    const endIso = event.endDateIso || event.dateIso;
    const url = getGoogleCalendarUrl(
      `C. Vignesh & S. Pavithra - ${event.title}`,
      `${event.notes || ''}\nAttire: ${event.attireSuggestion || ''}`,
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
      `${event.notes || ''}\nAttire: ${event.attireSuggestion || ''}`,
      event.addressLines.join(', '),
      event.dateIso,
      endIso,
      `vignesh-pavithra-${event.id}`
    );
    setActiveCalendarMenuId(null);
  };

  const handleGetDirections = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSectionJump = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    onActiveSectionChange?.(sectionId);
  };

  const handleCopyAddress = (id: string, address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownloadBlessingsPDF = () => {
    if (!blessings || blessings.length === 0) {
      alert('No blessings recorded yet to download.');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Wedding Blessings — C. Vignesh &amp; S. Pavithra</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap');
    @page { size: A4; margin: 14mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { font-family: 'Cormorant Garamond', Georgia, serif; background: #FFFDF9; color: #3E2723; margin: 0; padding: 24px; }
    .no-print-bar { text-align: center; margin-bottom: 24px; padding: 12px; background: #FAF5EC; border: 1px solid #C49A58; border-radius: 12px; }
    .btn-save { background: linear-gradient(135deg, #D48B28, #98502F); color: #FFFFFF; border: none; padding: 10px 28px; border-radius: 9999px; font-family: 'Cinzel', serif; font-size: 13px; font-weight: 700; cursor: pointer; }
    .header-box { text-align: center; border-bottom: 2px solid #C49A58; padding-bottom: 18px; margin-bottom: 22px; }
    .ganesha-title { font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 0.2em; color: #98502F; margin-bottom: 6px; font-weight: 700; text-transform: uppercase; }
    .main-title { font-family: 'Cinzel', serif; font-size: 24px; font-weight: 800; color: #8C321A; margin: 4px 0; }
    .event-info { font-family: 'Cinzel', serif; font-size: 12px; color: #98502F; font-weight: 700; margin: 4px 0; }
    .subtitle { font-style: italic; color: #766B60; font-size: 14px; margin-top: 6px; }
    .count-badge { display: inline-block; margin-top: 8px; padding: 3px 14px; border-radius: 9999px; background: #FAF5EC; border: 1px solid #D4A359; font-family: 'Cinzel', serif; font-size: 11px; font-weight: 700; color: #7D321B; }
    .blessings-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
    .blessing-card { border: 1px solid #D4A359; background: #FFFDF9; border-radius: 12px; padding: 12px 16px; break-inside: avoid; }
    .guest-header { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px dashed #E5D8C4; padding-bottom: 4px; margin-bottom: 8px; }
    .guest-name { font-family: 'Cinzel', serif; font-size: 13px; font-weight: 700; color: #98502F; }
    .guest-time { font-size: 11px; color: #8C827A; font-style: italic; }
    .guest-message { font-size: 14px; font-style: italic; color: #3E2723; line-height: 1.5; margin: 0; }
    .doc-footer { text-align: center; margin-top: 28px; padding-top: 14px; border-top: 1px solid #E5D8C4; font-family: 'Cinzel', serif; font-size: 11px; color: #766B60; }
    @media print { .no-print-bar { display: none; } body { padding: 0; background: #FFF; } }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <button class="btn-save" onclick="window.print()">📥 Save as PDF / Print Document</button>
  </div>
  <div class="header-box">
    <div class="ganesha-title">卐 &nbsp; Om Shree Ganeshay Namah &nbsp; 卐</div>
    <div class="main-title">Royal Wedding Blessings</div>
    <div class="event-info">C. Vignesh &amp; S. Pavithra • 14 December 2026 • Ooty &amp; Madurai</div>
    <div class="subtitle">&ldquo;A treasured keepsake of heartfelt prayers, love, and warm wishes.&rdquo;</div>
    <div class="count-badge">🌸 ${blessings.length} Wedding Blessings Received</div>
  </div>
  <div class="blessings-grid">
    ${blessings.map((b) => `
      <div class="blessing-card">
        <div class="guest-header">
          <span class="guest-name">${(b.guestName || 'Well Wisher').replace(/</g, '&lt;')}</span>
          <span class="guest-time">${b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '14 Dec 2026'}</span>
        </div>
        <p class="guest-message">&ldquo;${(b.message || '').replace(/</g, '&lt;')}&rdquo;</p>
      </div>`).join('')}
  </div>
  <div class="doc-footer">
    ✿ Thank you for blessing our sacred union • Vignesh &amp; Pavithra ✿
  </div>
  <script>
    window.onload = function() { setTimeout(function() { window.print(); }, 400); };
  </script>
</body>
</html>`;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleShareWhatsApp = () => {
    const text = `🌸 *Wedding Invitation: C. Vignesh & S. Pavithra* 🌸\n\nTogether with the family, we cordially invite you to celebrate the auspicious wedding ceremony on *Monday, 14 December 2026* at Ooty, followed by the Grand Reception at Madurai.\n\n${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const events = WEDDING_CONFIG.events;

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full bg-[#F6EDDC] select-none p-0 m-0"
    >
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── 1. SCROLLING SANDALWOOD BACKGROUND & CAMERA ── */}
      {/* Temple architecture is shown on the hero section */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div
        className={`mobile-architecture-stage absolute inset-x-0 top-0 h-screen z-0 pointer-events-none select-none overflow-hidden ${
          activeSection === 'home' ? 'mobile-architecture-stage--home' : ''
        }`}
        style={{
          transform: `translate3d(${mousePos.x * -8}px, ${mousePos.y * -5}px, 0px) rotateY(${mousePos.x * 0.4}deg)`,
          transformOrigin: '50% 60%',
          transition: 'transform 0.15s ease-out',
        }}
      >
        {/* Authentic Dravidian Temple Architecture (Desktop) */}
        <div className="theme-light-architecture hidden md:block absolute inset-0">
          <img
            src="/assets/temple_hero_clean_v3.png"
            alt="Dravidian Temple Sandalwood Pillars"
            className="w-full h-full object-cover object-center select-none"
          />
        </div>

        {/* Mobile: Symmetrical Dravidian Temple Architecture */}
        <div className="theme-light-architecture block md:hidden absolute inset-0 overflow-hidden pointer-events-none select-none">
          <img
            src="/assets/temple_hero_mobile_v3.png"
            alt="Dravidian Temple Towers"
            className="w-full h-full object-cover object-center select-none"
          />
        </div>

        <div className="theme-dark-architecture theme-dark-architecture--desktop absolute inset-0" aria-hidden="true" />
        <div className="theme-dark-architecture theme-dark-architecture--mobile absolute inset-0" aria-hidden="true" />

        {/* Golden Sunbeam Aura (Desktop) */}
        <div
          className="theme-ambient-glow hidden md:block absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 75% 55% at 50% 30%, rgba(255, 238, 190, 0.45) 0%, rgba(255, 238, 190, 0.15) 45%, transparent 75%)',
          }}
        />

        {/* Floating Sacred Rose & Jasmine Petals */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { left: '8%', delay: '0s', dur: '12s', size: 'w-2.5 h-3.5', depth: 25, color: 'bg-gradient-to-br from-[#FFD6DC] to-[#FCA5A5]' },
            { left: '22%', delay: '3s', dur: '14s', size: 'w-3 h-4', depth: 55, color: 'bg-gradient-to-br from-[#FFE4E6] to-[#FDA4AF]' },
            { left: '38%', delay: '1.5s', dur: '11s', size: 'w-2 h-3', depth: 15, color: 'bg-gradient-to-br from-[#FFFDF9] to-[#FDE047]/30' },
            { left: '62%', delay: '4.5s', dur: '15s', size: 'w-2.5 h-3.5', depth: 70, color: 'bg-gradient-to-br from-[#FFD6DC] to-[#F87171]/70' },
            { left: '78%', delay: '2s', dur: '13s', size: 'w-3 h-4', depth: 40, color: 'bg-gradient-to-br from-[#FFE4E6] to-[#FDA4AF]' },
            { left: '90%', delay: '5s', dur: '16s', size: 'w-2 h-3', depth: 20, color: 'bg-gradient-to-br from-[#FFFDF9] to-[#FECDD3]' },
          ].map((p, i) => (
            <div
              key={i}
              className={`absolute top-0 ${p.size} rounded-[60%_40%_70%_30%] ${p.color} border border-[#C49A58]/40 shadow-xs animate-float-petal`}
              style={{
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.dur,
                transform: `translate3d(${mousePos.x * p.depth}px, ${mousePos.y * p.depth}px, 0px)`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="wedding-ambient-particles absolute inset-0 z-[1] overflow-hidden pointer-events-none" aria-hidden="true">
        {AMBIENT_PARTICLES.map((particle, index) => (
          <span
            key={index}
            className={`wedding-ambient-particle ${
              particle.symbol
                ? `wedding-ambient-particle--${particle.symbol === '🪷' ? 'lotus' : 'sparkle'}`
                : 'wedding-ambient-particle--petal'
            }`}
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
              width: particle.symbol ? undefined : particle.size,
              height: particle.symbol ? undefined : particle.size,
              fontSize: particle.symbol ? particle.size : undefined,
              filter: particle.blur ? `blur(${particle.blur}px)` : undefined,
              opacity: particle.opacity,
            }}
          >
            {particle.symbol}
          </span>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 0: HERO ENTRANCE (Vignesh & Pavithra Announcement) ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section
        id="home"
        className="relative z-10 w-full min-h-screen flex flex-col items-center justify-between pt-6 xs:pt-8 sm:pt-10 pb-6 px-3 sm:px-4 text-center"
      >
        <div className="relative w-full max-w-xl mx-auto text-center px-2 sm:px-4 flex flex-col items-center justify-between h-full my-auto space-y-4 sm:space-y-6">
          {/* Ganesha Crest */}
          <div className="mb-4 flex flex-col items-center text-center sm:mb-6">
            <div className="w-12 h-12 xs:w-13 xs:h-13 sm:w-14 sm:h-14 mx-auto mb-1">
              <img
                src={isDarkTheme ? '/assets/dark-theme/ganesha-gold.png' : '/assets/ganesha-authentic.png'}
                alt="Lord Ganesha Motif"
                className="w-full h-full object-contain"
              />
            </div>

            {/* 5-Petal Golden Lotus Divider Motif */}
            <div className="flex items-center justify-center space-x-2 my-1.5 sm:my-2">
              <div className="h-[1px] w-12 xs:w-16 sm:w-20 bg-gradient-to-r from-transparent via-[#C49A58] to-[#C49A58]" />
              <svg width="26" height="16" viewBox="0 0 32 20" fill="none" className="text-[#C49A58]">
                <path d="M16 2 C14 7 14 12 16 17 C18 12 18 7 16 2 Z" fill="#D49A3D" />
                <path d="M16 4 C15 8 15 11 16 15 C17 11 17 8 16 4 Z" fill="#F3D17A" />
                <path d="M16 17 C13 13 10 8 11 5 C13 8 15 13 16 17 Z" fill="#C4882F" />
                <path d="M15.5 15 C13.5 12 11.5 8 12 6 C13.5 8.5 15 12 15.5 15 Z" fill="#E8BD65" />
                <path d="M16 17 C19 13 22 8 21 5 C19 8 17 13 16 17 Z" fill="#C4882F" />
                <path d="M16.5 15 C18.5 12 20.5 8 20 6 C18.5 8.5 17 12 16.5 15 Z" fill="#E8BD65" />
                <path d="M16 17 C11 15 6 12 7 9 C10 11 14 15 16 17 Z" fill="#A86E20" />
                <path d="M16 17 C21 15 26 12 25 9 C22 11 18 15 16 17 Z" fill="#A86E20" />
                <path d="M12 17 C14 19 18 19 20 17 Z" fill="#8C5514" />
              </svg>
              <div className="h-[1px] w-12 xs:w-16 sm:w-20 bg-gradient-to-l from-transparent via-[#C49A58] to-[#C49A58]" />
            </div>
          </div>

          {/* Traditional Wedding Invitation Wording */}
          <div className="flex flex-col items-center text-center">
            <p className="mb-4 font-cormorant text-lg font-semibold italic text-[#9A4F15] sm:mb-5 sm:text-xl">
              Together with their families
            </p>

            <h1 className="flex flex-col items-center font-serif-royal font-bold leading-tight">
              <span className="text-[29px] xs:text-[33px] sm:text-4xl md:text-5xl tracking-wider text-[#7A281E] uppercase">
                C. Vignesh
              </span>

              <span className="my-1 flex items-center justify-center gap-3 font-light text-xl text-[#C49A58] sm:my-1.5 sm:text-2xl">
                <span className="h-px w-12 xs:w-16 sm:w-20 bg-[#C49A58]/80" />
                <span>&amp;</span>
                <span className="h-px w-12 xs:w-16 sm:w-20 bg-[#C49A58]/80" />
              </span>

              <span className="text-[29px] xs:text-[33px] sm:text-4xl md:text-5xl tracking-wider text-[#7A281E] uppercase">
                S. Pavithra
              </span>
            </h1>

            <p className="mx-auto mt-3 max-w-sm font-cormorant text-xl font-semibold italic leading-relaxed text-[#9A4F15] sm:mt-4 sm:max-w-md sm:text-2xl">
              Invite you to celebrate their wedding
            </p>

            {/* Wedding Date & Palm Motif */}
            <div className="mt-3 flex flex-col items-center sm:mt-4">
              <div className="flex items-center space-x-2 mb-0.5">
                <div className="h-[0.5px] w-8 sm:w-12 bg-[#C49A58]/60" />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#C49A58]">
                  <path d="M12 2 L12 22 M7 8 C9 6, 11 6, 12 7 C13 6, 15 6, 17 8 M5 14 C8 12, 10 12, 12 13 C14 12, 16 12, 19 14" stroke="#C49A58" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <div className="h-[0.5px] w-8 sm:w-12 bg-[#C49A58]/60" />
              </div>
              <span className="font-serif-royal text-[11px] xs:text-xs sm:text-sm font-bold tracking-[0.2em] text-[#7A281E] uppercase">
                Monday, 14 December 2026
              </span>
            </div>
          </div>

          {/* 4-Card Auspicious Countdown Timer */}
          <div className="flex flex-col items-center text-center">
            <div className="grid grid-cols-4 gap-2 xs:gap-2.5 sm:gap-3 max-w-[340px] xs:max-w-[370px] sm:max-w-md mx-auto w-full">
              {[
                { label: 'DAYS', val: timeLeft.days },
                { label: 'HOURS', val: timeLeft.hours },
                { label: 'MINS', val: timeLeft.minutes },
                { label: 'SECS', val: timeLeft.seconds, pulse: true },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl sm:rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-center bg-gradient-to-b from-[#FFFDF9] to-[#FAF5EC] border border-[#C49A58]/80 shadow-md backdrop-blur-sm"
                >
                  <span
                    className={`font-serif-royal text-xl xs:text-2xl sm:text-3xl font-bold text-[#7A281E] leading-none transition-transform duration-200 ${
                      item.pulse && pulseSeconds ? 'scale-110 text-[#98502F]' : ''
                    }`}
                  >
                    {String(item.val).padStart(2, '0')}
                  </span>
                  <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-serif-royal uppercase tracking-widest text-[#8C5514] font-semibold mt-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section Menu */}
          <div className="flex flex-col items-center">
            <div className="flex max-w-[360px] flex-wrap items-center justify-center gap-2">
              {[
                { id: 'events', label: '🎉 Events Timeline' },
                { id: 'venue', label: '📍 Wedding Venue' },
                { id: 'invitation', label: '💌 Invitation' },
                { id: 'blessings', label: '🌸 Blessings' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSectionJump(item.id)}
                  className="rounded-full border border-[#C49A58]/80 bg-[#FFFDF9]/90 px-2.5 py-1.5 font-serif-royal text-[9px] xs:text-[10px] font-bold text-[#7A3A1B] shadow-sm transition-colors hover:bg-[#FAF5EC] cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
          <span className="font-serif-royal text-[9px] tracking-widest uppercase text-[#8C5514] mb-1">Scroll to Explore</span>
          <div className="w-4 h-7 rounded-full border border-[#C49A58] flex items-start justify-center p-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#98502F] animate-bounce" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 2: EVENTS TIMELINE (Horizontal Desktop, Vertical Mobile) ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section
        id="events"
        className="wedding-scroll-scene relative z-10 w-full min-h-screen flex flex-col items-center justify-center pt-16 pb-10 px-2 sm:px-6 md:pr-8 lg:pr-12 xl:pr-16 md:pl-[24vw]"
      >
        <WeddingSectionOrnament />
        <div className="w-[82vw] max-w-xl md:w-full md:max-w-3xl lg:max-w-[880px] xl:max-w-[980px] mx-auto md:mr-0 flex flex-col items-center justify-center my-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 shrink-0 px-2">
            <div className="flex justify-center mb-1">
              <svg width="22" height="13" viewBox="0 0 26 15" fill="none">
                <path d="M13 1 C11 5 7 7 2 8 C7 9 11 11 13 15 C15 11 19 9 24 8 C19 7 15 5 13 1 Z" fill="#C49A58" opacity="0.9" />
                <circle cx="13" cy="8" r="1.5" fill="#98502F" />
              </svg>
            </div>
            <div className="inline-flex items-center space-x-1.5 bg-[#FFFDF9]/95 border-2 border-[#C49A58] px-5 py-1.5 rounded-full shadow-md mb-2.5">
              <span className="text-xs text-[#C49A58]">✦</span>
              <span className="text-sm sm:text-base font-serif-royal font-bold uppercase tracking-widest text-[#98502F]">
                Events Timeline
              </span>
              <span className="text-xs text-[#C49A58]">✦</span>
            </div>
            <p className="mt-1 font-cormorant text-sm sm:text-base italic text-[#766B60]">
              Be a part of our special moments
            </p>
          </div>

          {/* DESKTOP TIMELINE: 3 Horizontal Columns Grid */}
          <div className="hidden md:block relative w-full pt-1 pb-1">
            <div className="grid grid-cols-3 gap-5 lg:gap-7 relative z-20">
              {events.map((ev, idx) => {
                const isMenuOpen = activeCalendarMenuId === ev.id;
                const images = [
                  '/assets/events/arch_ooty_hd.png',
                  '/assets/events/arch_mandapam_hd.png',
                  '/assets/events/arch_madurai_hd.png',
                ];
                return (
                  <div key={ev.id} className="relative flex flex-col items-center group">
                    {/* Top Arched Picture */}
                    <div className="w-full h-[150px] flex items-end justify-center overflow-hidden pb-1 transition-transform duration-300 group-hover:scale-105">
                      <img
                        src={images[idx]}
                        alt={ev.title}
                        className="w-auto h-full max-h-[145px] object-contain drop-shadow-md select-none"
                      />
                    </div>

                    {/* Lotus Node */}
                    <div className="relative z-20 -my-3 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-[#FFFDF9] border-2 border-[#D4A359] shadow-md flex items-center justify-center p-0.5">
                        <img src="/assets/events/lotus_disc_gold.png" alt="Sacred Lotus" className="w-full h-full object-contain" />
                      </div>
                    </div>

                    {/* Bottom Card */}
                    <div className="theme-card theme-card--glass relative w-full rounded-2xl pt-5 pb-3 px-3.5 bg-[#FFFDF9]/95 shadow-xl backdrop-blur-md text-center flex flex-col justify-between min-h-[190px]">
                      <div>
                        <span className="text-[10px] font-serif-royal uppercase font-bold tracking-wider text-[#98502F]">
                          {ev.dateStr}
                        </span>
                        <h4 className="font-serif-royal text-base font-bold text-[#45352A] mt-1 leading-snug">
                          {ev.title}
                        </h4>
                        <p className="font-serif-royal text-xs text-[#766B60] mt-1 font-semibold">
                          {ev.timeStr}
                        </p>
                        <p className="font-cormorant italic text-xs font-bold text-[#8C5514] mt-1">
                          {ev.venueName}, {ev.city}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-center gap-1.5 mt-2.5 pt-2 border-t border-[#E5D8C4]">
                        <button
                          onClick={() => setActiveCalendarMenuId(isMenuOpen ? null : ev.id)}
                          className="px-3 py-1.5 bg-[#FAF5EC] border border-[#C49A58]/70 text-[#7A3A1B] rounded-full text-[11px] font-serif-royal font-bold flex items-center space-x-1 cursor-pointer hover:bg-[#F3E7D3]"
                        >
                          <CalendarPlus className="w-3.5 h-3.5 text-[#98502F]" />
                          <span>Calendar</span>
                        </button>
                        <button
                          onClick={() => handleGetDirections(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.mapQuery || ev.venueName)}`)}
                          className="px-3 py-1.5 bg-gradient-to-r from-[#D48B28] to-[#98502F] text-white rounded-full text-[11px] font-serif-royal font-bold flex items-center space-x-1 cursor-pointer hover:brightness-105"
                        >
                          <Navigation className="w-3.5 h-3.5 text-[#FFF1B8]" />
                          <span>Directions</span>
                        </button>
                      </div>

                      {/* Calendar Dropdown */}
                      {isMenuOpen && (
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-[#FFFDF9] border border-[#C49A58] rounded-xl shadow-xl p-1.5 z-30 min-w-[140px] text-left text-xs font-serif-royal">
                          <button
                            onClick={() => handleOpenGoogleCal(ev)}
                            className="w-full text-left px-2 py-1 hover:bg-[#FAF5EC] text-[#45352A] rounded-lg"
                          >
                            Google Calendar
                          </button>
                          <button
                            onClick={() => handleDownloadIcs(ev)}
                            className="w-full text-left px-2 py-1 hover:bg-[#FAF5EC] text-[#45352A] rounded-lg"
                          >
                            Apple / Outlook (.ics)
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MOBILE TIMELINE: 3 Vertical Cards */}
          <div className="block md:hidden w-full space-y-5 px-2">
            {events.map((ev, idx) => {
              const images = [
                '/assets/events/arch_ooty_hd.png',
                '/assets/events/arch_mandapam_hd.png',
                '/assets/events/arch_madurai_hd.png',
              ];
              const isMenuOpen = activeCalendarMenuId === ev.id;
              return (
                <div
                  key={ev.id}
                  className="theme-card theme-card--glass bg-[#FFFDF9]/95 w-[94%] mx-auto rounded-2xl p-2.5 shadow-xl flex items-center gap-2.5 text-left"
                >
                  <div className="w-16 h-18 shrink-0 rounded-xl overflow-hidden bg-[#FAF5EC] border border-[#C49A58]/40 flex items-center justify-center">
                    <img src={images[idx]} alt={ev.title} className="w-full h-full object-contain" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-serif-royal uppercase font-bold text-[#98502F] block">
                      {ev.dateStr}
                    </span>
                    <h4 className="font-serif-royal text-sm font-bold text-[#45352A] mt-0.5">
                      {ev.title}
                    </h4>
                    <p className="font-serif-royal text-[11px] text-[#766B60] mt-0.5">
                      {ev.timeStr}
                    </p>
                    <p className="font-cormorant text-xs font-bold leading-snug text-[#8C5514] mt-0.5">
                      {ev.venueName}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleOpenGoogleCal(ev)}
                        className="px-2.5 py-1 bg-[#FAF5EC] border border-[#C49A58]/60 text-[#7A3A1B] rounded-full text-[10px] font-serif-royal font-bold flex items-center space-x-1"
                      >
                        <CalendarPlus className="w-3 h-3 text-[#98502F]" />
                        <span>Calendar</span>
                      </button>
                      <button
                        onClick={() => handleGetDirections(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.mapQuery || ev.venueName)}`)}
                        className="px-2.5 py-1 bg-gradient-to-r from-[#D48B28] to-[#98502F] text-white rounded-full text-[10px] font-serif-royal font-bold flex items-center space-x-1"
                      >
                        <Navigation className="w-3 h-3 text-[#FFF1B8]" />
                        <span>Map</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 3: WEDDING VENUES (Ooty & Madurai on 1 Screen) ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section
        id="venue"
        className="wedding-scroll-scene relative z-10 w-full min-h-screen flex flex-col items-center justify-start pt-10 sm:pt-12 pb-10 px-4 text-center"
      >
        <WeddingSectionOrnament />
        <div className="max-w-4xl lg:max-w-5xl w-full mx-auto px-2 py-0 text-center">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex justify-center mb-1">
              <svg width="22" height="13" viewBox="0 0 26 15" fill="none">
                <path d="M13 1 C11 5 7 7 2 8 C7 9 11 11 13 15 C15 11 19 9 24 8 C19 7 15 5 13 1 Z" fill="#C49A58" opacity="0.9" />
                <circle cx="13" cy="8" r="1.5" fill="#98502F" />
              </svg>
            </div>
            <div className="inline-flex items-center space-x-1.5 bg-[#FFFDF9]/95 border-2 border-[#C49A58] px-4 py-1 rounded-full shadow-md mb-2">
              <span className="text-xs text-[#C49A58]">✦</span>
              <span className="text-xs sm:text-sm font-serif-royal font-bold uppercase tracking-widest text-[#98502F]">
                Wedding Venues
              </span>
              <span className="text-xs text-[#C49A58]">✦</span>
            </div>
          </div>

          {/* 2 Venue Cards Grid */}
          <div className="w-[76vw] md:w-full grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto">
            {[
              {
                id: 'ooty-mandapam',
                tag: 'Ooty Muhurtham',
                name: 'Sri Srinivasa Perumal Kalyana Mandapam',
                landmark: 'Near Mahindra Showroom, Ettines Road',
                fullAddress: 'Ettines Road, Near Mahindra Showroom, Ooty, The Nilgiris, Tamil Nadu - 643001',
                image: '/assets/venues/ooty-mandapam.png',
                mapUrl: 'https://maps.google.com/?q=Sri+Srinivasa+Perumal+Kalyana+Mandapam+Ettines+Road+Ooty',
              },
              {
                id: 'madurai-mandapam',
                tag: 'Madurai Reception',
                name: 'GT Palace Thirumana Mandapam',
                landmark: 'Natham Main Road, Paraipatti Vilakku',
                fullAddress: 'Natham Main Road, Paraipatti Vilakku, Madurai, Tamil Nadu - 625014',
                image: '/assets/venues/gt-palace.png',
                mapUrl: 'https://maps.google.com/?q=GT+Palace+Thirumana+Mandapam+Natham+Main+Road+Madurai',
              },
            ].map((v) => (
              <div
                key={v.id}
                className="theme-card theme-card--glass bg-[#FFFDF9]/95 rounded-2xl sm:rounded-3xl p-2 md:p-3 shadow-2xl backdrop-blur-md grid grid-cols-[80px_minmax(0,1fr)] gap-3 md:flex md:flex-col md:gap-0 text-left"
              >
                {/* Photo */}
                <div className="col-start-1 row-start-1 h-[104px] w-full rounded-xl sm:rounded-2xl overflow-hidden border border-[#C49A58]/50 mb-0 md:mb-2.5 bg-black/5">
                  <img src={v.image} alt={v.name} className="w-full h-full object-cover object-center" />
                </div>

                <div className="col-start-2 row-start-1 min-w-0">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FAF5EC] border border-[#C49A58]/70 text-[#98502F] font-serif-royal font-bold text-[9px] uppercase tracking-wider mb-1">
                    {v.tag}
                  </span>

                  <h3 className="font-serif-royal text-xs md:text-base font-bold text-[#45352A] leading-snug">
                    {v.name}
                  </h3>

                  <p className="font-cormorant italic text-xs text-[#766B60] mt-0.5">
                    {v.landmark}
                  </p>

                  <div className="mt-2 p-2.5 rounded-xl bg-[#FAF5EC]/90 border border-[#C49A58]/70 flex items-center justify-between text-left">
                    <p className="font-serif-royal text-[10px] text-[#45352A] pr-2 leading-tight">
                      {v.fullAddress}
                    </p>
                    <button
                      onClick={() => handleCopyAddress(v.id, v.fullAddress)}
                      className="p-1 text-[#98502F] hover:text-[#7A3A1B] cursor-pointer shrink-0"
                      title="Copy Address"
                    >
                      {copiedId === v.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleGetDirections(v.mapUrl)}
                  className="col-start-2 row-start-2 mt-2 w-full py-1.5 md:mt-3 md:py-2 bg-gradient-to-r from-[#D48B28] via-[#B87333] to-[#98502F] hover:brightness-105 active:scale-98 text-white rounded-xl font-serif-royal font-bold text-[10px] md:text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-md cursor-pointer transition-all"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#FFF1B8]" />
                  <span>Open in Google Maps</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 4: DIGITAL INVITATION (The Royal Patrika & PDF) ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section
        id="invitation"
        className="wedding-scroll-scene relative z-10 w-full min-h-screen flex flex-col items-center justify-center pt-16 pb-10 px-3 sm:px-4 text-center"
      >
        <WeddingSectionOrnament />
        <div className="max-w-2xl w-full mx-auto px-1 sm:px-2 py-1 text-center">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-5">
            <div className="flex justify-center mb-1">
              <svg width="24" height="14" viewBox="0 0 24 14" fill="none" className="text-[#C49A58]">
                <path d="M12 1 C10 5 7 7 2 8 C7 9 10 11 12 14 C14 11 17 9 22 8 C17 7 14 5 12 1 Z" fill="#C49A58" opacity="0.9" />
                <circle cx="12" cy="7.5" r="1.5" fill="#98502F" />
              </svg>
            </div>
            <div className="inline-flex items-center space-x-1.5 bg-[#FFFDF9]/95 border border-[#C49A58]/70 px-3.5 py-0.5 rounded-full shadow-2xs">
              <span className="text-[10px] text-[#C49A58]">✦</span>
              <span className="text-[9px] sm:text-[10px] font-serif-royal font-bold uppercase tracking-widest text-[#98502F]">
                Official Wedding Invitation
              </span>
              <span className="text-[10px] text-[#C49A58]">✦</span>
            </div>
          </div>

          {/* 3D Tilt Invitation Card */}
          <div
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
              const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
              setInvitationTilt({ x: x * 10, y: -y * 10 });
            }}
            onMouseEnter={() => setIsInvitationHovered(true)}
            onMouseLeave={() => {
              setIsInvitationHovered(false);
              setInvitationTilt({ x: 0, y: 0 });
            }}
            onClick={() => setIsLightboxOpen(true)}
            className="relative cursor-pointer group mx-auto max-w-[270px] xs:max-w-[300px] sm:max-w-[340px] rounded-2xl sm:rounded-3xl p-2 bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#FFFDF9] border-2 sm:border-3 border-[#C49A58] shadow-2xl transition-transform duration-200 ease-out select-none"
            style={{
              transform: `perspective(1000px) rotateY(${invitationTilt.x}deg) rotateX(${invitationTilt.y}deg) scale(${isInvitationHovered ? 1.02 : 1})`,
              transformStyle: 'preserve-3d',
            }}
            title="Click to view full screen"
          >
            {/* Rendered PDF Page Image */}
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-inner border border-[#E5D8C4] bg-white aspect-[894/1258]">
              <img
                src={INVITATION_PAGES[invitationPageIndex].image}
                alt={`Wedding Invitation - ${INVITATION_PAGES[invitationPageIndex].title}`}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>

            {/* Prev / Next Chevrons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setInvitationPageIndex((prev) => (prev > 0 ? prev - 1 : INVITATION_PAGES.length - 1));
              }}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#FFFDF9]/95 border border-[#C49A58] text-[#98502F] flex items-center justify-center opacity-85 hover:opacity-100 shadow-md cursor-pointer"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setInvitationPageIndex((prev) => (prev < INVITATION_PAGES.length - 1 ? prev + 1 : 0));
              }}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#FFFDF9]/95 border border-[#C49A58] text-[#98502F] flex items-center justify-center opacity-85 hover:opacity-100 shadow-md cursor-pointer"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4">
            <a
              href="/assets/invitation/wedding_invitation.pdf"
              download="C-Vignesh-and-S-Pavithra-Wedding-Invitation.pdf"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#FFFDF9] hover:bg-[#FAF5EC] border border-[#C49A58] text-[#45352A] rounded-full text-xs font-serif-royal font-bold shadow-xs cursor-pointer transition-all active:scale-98"
            >
              <Download className="w-3.5 h-3.5 text-[#98502F]" />
              <span>Download PDF</span>
            </a>

            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full text-xs font-serif-royal font-bold shadow-xs cursor-pointer transition-all active:scale-98"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 5: WEDDING BLESSINGS (Post Blessings & Showcase) ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section
        id="blessings"
        className="wedding-scroll-scene relative z-10 w-full min-h-screen flex flex-col items-center justify-center pt-16 pb-10 px-3 sm:px-6 text-center"
      >
        <WeddingSectionOrnament />
        <div className="w-[82vw] md:w-full max-w-5xl mx-auto px-2 py-1 flex flex-col items-center">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-5">
            <div className="flex justify-center mb-1">
              <svg width="24" height="14" viewBox="0 0 24 14" fill="none" className="text-[#C49A58]">
                <path d="M12 1 C10 5 7 7 2 8 C7 9 10 11 12 14 C14 11 17 9 22 8 C17 7 14 5 12 1 Z" fill="#C49A58" opacity="0.9" />
                <circle cx="12" cy="7.5" r="1.5" fill="#98502F" />
              </svg>
            </div>
            <div className="inline-flex items-center space-x-1.5 bg-[#FFFDF9]/95 border border-[#C49A58]/70 px-3.5 py-0.5 rounded-full shadow-2xs mb-1">
              <span className="text-[10px] text-[#C49A58]">✦</span>
              <span className="text-[9px] sm:text-[10px] font-serif-royal font-bold uppercase tracking-widest text-[#98502F]">
                Wedding Blessings
              </span>
              <span className="text-[10px] text-[#C49A58]">✦</span>
            </div>
            <h2 className="font-serif-royal text-xl sm:text-3xl font-bold text-[#7A281E]">
              Post Your Blessings
            </h2>
            <p className="font-cormorant italic text-xs sm:text-sm text-[#766B60] mt-0.5">
              Leave your heartfelt prayers, wishes and love for Vignesh &amp; Pavithra
            </p>
          </div>

          {/* Action Card */}
          <div className="theme-card bg-[#FFFDF9]/95 border-2 border-[#C49A58] rounded-2xl sm:rounded-[2rem] p-3.5 sm:p-5 shadow-xl backdrop-blur-md max-w-2xl w-full mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 p-1 rounded-2xl bg-[#FAF5EC] border border-[#C49A58]/80 flex items-center justify-center">
                <img
                  src={isDarkTheme ? '/assets/dark-theme/ganesha-gold.png' : '/assets/ganesha-authentic.png'}
                  alt="Ganesha"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="font-serif-royal font-bold text-xs sm:text-base text-[#45352A]">
                  Shower Your Divine Blessings
                </h4>
                <p className="font-cormorant italic text-[11px] sm:text-xs text-[#766B60]">
                  Your presence, prayers, and love are our greatest treasure.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={onPlantBlessingClick}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-[#D48B28] via-[#B87333] to-[#98502F] hover:brightness-110 active:scale-98 text-white font-serif-royal font-bold text-[11px] sm:text-xs uppercase tracking-wider rounded-full shadow-md cursor-pointer transition-all shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFF1B8]" />
                <span>Post Your Blessings</span>
              </button>
              <button
                onClick={handleDownloadBlessingsPDF}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#FFFDF9] hover:bg-[#FAF5EC] border border-[#C49A58] text-[#98502F] font-serif-royal font-bold text-[11px] sm:text-xs uppercase tracking-wider rounded-full shadow-xs cursor-pointer transition-all shrink-0"
                title="Download all blessings as PDF"
              >
                <Download className="w-3.5 h-3.5 text-[#98502F]" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* Counter Bar */}
          <div className="w-full flex items-center justify-between gap-1.5 mb-3 px-1">
            <span className="text-[10px] sm:text-[11px] font-serif-royal font-semibold text-[#766B60]">
              🌸 {blessings.length} Wedding Blessings Received
            </span>
            <button
              onClick={handleDownloadBlessingsPDF}
              className="inline-flex items-center space-x-1 text-[10px] sm:text-[11px] font-serif-royal font-semibold text-[#98502F] hover:text-[#7D321B] hover:underline cursor-pointer"
            >
              <Download className="w-3 h-3 text-[#98502F]" />
              <span>Download as PDF</span>
            </button>
          </div>

          {/* Scrollable Blessings Grid */}
          <div className="w-full max-h-[34vh] sm:max-h-[46vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {blessings.map((b) => (
                <div
                  key={b.id}
                  className="theme-card bg-[#FFFDF9]/95 border-2 border-[#C49A58] rounded-xl sm:rounded-2xl p-3.5 sm:p-4 shadow-lg backdrop-blur-md flex flex-col text-left hover:scale-[1.01] transition-all"
                >
                  <span className="font-serif-royal font-bold text-[10px] sm:text-[11px] text-[#98502F] mb-1.5">
                    {b.guestName}
                  </span>
                  <p className="font-cormorant italic text-xs sm:text-sm text-[#45352A] leading-relaxed">
                    &ldquo;{b.message}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 6: ROYAL CLOSING FOOTER ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section
        id="footer"
        className="wedding-scroll-scene relative z-10 w-full min-h-screen flex flex-col items-center justify-center pt-16 pb-10 px-4 text-center"
      >
        <WeddingSectionOrnament />
        <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center justify-between text-center py-2 space-y-5">
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12">
              <img
                src={isDarkTheme ? '/assets/dark-theme/ganesha-gold.png' : '/assets/ganesha-authentic.png'}
                alt="Ganesha"
                className="w-full h-full object-contain drop-shadow-sm"
              />
            </div>
            <p className="font-serif-royal text-[9px] sm:text-xs font-semibold tracking-[0.2em] text-[#B87320]">
              ✿ &nbsp; WITH THE BLESSINGS OF OUR ELDERS &nbsp; ✿
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <h4 className="font-serif-royal text-xl sm:text-2xl font-bold tracking-wide text-[#8C321A]">
              C. Vignesh &amp; S. Pavithra
            </h4>

            <div className="flex items-center justify-center gap-3 w-full max-w-sm">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C49A58]" />
              <p className="font-serif-royal text-[10px] sm:text-xs font-bold tracking-[0.18em] text-[#7D321B]">
                14 DECEMBER 2026
              </p>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C49A58]" />
            </div>

            <p className="font-cormorant text-base sm:text-xl italic text-[#85321D]">
              A beautiful beginning,<br />made memorable by you.
            </p>

            <p className="font-cormorant text-xs sm:text-base italic text-[#6E5038] max-w-md">
              Thank you for being part of our special day and blessing our journey ahead.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={handleShareWhatsApp}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-[#9B401D] to-[#7D2D16] text-white rounded-full text-xs font-serif-royal font-bold shadow-md cursor-pointer hover:brightness-105"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Invitation</span>
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('home');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#FFF6E5]/90 border border-[#C49A58] text-[#71351F] rounded-full text-xs font-serif-royal font-bold shadow-sm cursor-pointer hover:bg-[#FAF5EC]"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#98502F]" />
                <span>Back to Beginning</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-0.5 leading-tight pt-2 border-t border-[#C49A58]/30 w-full">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#C49A58]">✿</span>
              <p className="font-serif-royal text-[8px] sm:text-[10px] font-semibold tracking-[0.16em] text-[#9A4A20]">
                A LITTLE ARTISTRY, A LASTING MEMORY
              </p>
              <span className="text-xs text-[#C49A58]">✿</span>
            </div>
            <p className="font-cormorant text-xs italic text-[#76533A]">
              Envisioned with care by
            </p>
            <p className="font-serif-royal text-xs sm:text-sm font-semibold tracking-wide text-[#8C321A]">
              Sridevi ♡
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ── FULLSCREEN DIGITAL INVITATION LIGHTBOX MODAL ── */}
      {/* ══════════════════════════════════════════════════════════════════ */}
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
              onClick={() => setInvitationPageIndex((prev) => (prev > 0 ? prev - 1 : INVITATION_PAGES.length - 1))}
              className="absolute left-2 sm:left-6 z-10 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white border border-white/20 transition-all cursor-pointer hover:scale-110 active:scale-95"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <img
              src={INVITATION_PAGES[invitationPageIndex].image}
              alt={INVITATION_PAGES[invitationPageIndex].title}
              className="max-h-[74vh] sm:max-h-[78vh] max-w-[88vw] sm:max-w-[70vw] object-contain rounded-2xl border-2 border-[#C49A58] shadow-[0_0_40px_rgba(196,154,88,0.35)] select-none animate-fadeIn"
            />

            <button
              onClick={() => setInvitationPageIndex((prev) => (prev < INVITATION_PAGES.length - 1 ? prev + 1 : 0))}
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
                onClick={() => setInvitationPageIndex(idx)}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-serif-royal font-bold transition-all cursor-pointer ${
                  invitationPageIndex === idx
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
  );
};
