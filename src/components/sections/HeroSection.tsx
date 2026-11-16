import React, { useState, useEffect, useRef } from 'react';
import { WEDDING_CONFIG, EventDetails, Blessing } from '../../data/weddingConfig';
import { templeAudio } from '../../utils/audioSynth';
import {
  GoldDivider,
  CornerOrnament,
  TwinElephantsLotusMotif,
  MandapamEntranceArch,
} from '../ui/TraditionalBorders';
import { getGoogleCalendarUrl, downloadIcsFile } from '../../utils/calendar';
import {
  Menu,
  Volume2,
  VolumeX,
  Sparkles,
  Clock,
  ArrowDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Navigation,
  Download,
  CalendarPlus,
  Check,
  Copy,
  ExternalLink,
  Mail,
  MailOpen,
  Maximize2,
  Minimize2,
  Share2,
  PlusCircle,
  Heart,
  ThermometerSnowflake,
  Plane,
  Train,
  Car,
  RotateCcw,
  Sun,
} from 'lucide-react';

interface HeroSectionProps {
  blessings: Blessing[];
  onPlantBlessingClick: () => void;
  onOpenMenu?: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

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
}) => {
  // Target: Monday, 14 December 2026 06:15 AM IST (Asia/Kolkata)
  const targetTime = new Date('2026-12-14T06:15:00+05:30').getTime();
  const runwayRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

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
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Events scene state
  const [activeEventIndex, setActiveEventIndex] = useState(1); // Muhurtham
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
      setPulseSeconds(true);
      setTimeout(() => setPulseSeconds(false), 300);
    }, 1000);
    return () => clearInterval(timer);
  }, [targetTime]);

  // Smooth scroll progress tracking through the 100% unified 1200vh movie runway
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (runwayRef.current) {
            const rect = runwayRef.current.getBoundingClientRect();
            const totalScroll = runwayRef.current.offsetHeight - window.innerHeight;
            if (totalScroll > 0) {
              const currentScroll = -rect.top;
              const p = Math.min(Math.max(currentScroll / totalScroll, 0), 1);
              setScrollProgress(p);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleToggleMusic = () => {
    const playing = templeAudio.toggle();
    setIsPlayingMusic(playing);
  };

  const scrollToAnchor = (pTarget: number) => {
    if (runwayRef.current) {
      const containerTop = runwayRef.current.offsetTop;
      const totalScroll = runwayRef.current.offsetHeight - window.innerHeight;
      const targetY = containerTop + pTarget * totalScroll;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

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

  const handleCopyAddress = (id: string, address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = `🌸 *Wedding Invitation: C. Vignesh & S. Pavithra* 🌸\n\nTogether with the family, we cordially invite you to celebrate the auspicious wedding ceremony on *Monday, 14 December 2026* at Ooty, followed by the Grand Reception at Madurai.\n\nPlease plant your blessings on our interactive 3D Blessings Tree:\n${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // ══════════════════════════════════════════════════════════════════════
  // ── CINEMATIC 3D CAMERA TIMELINE (100% PINNED MOVIE RUNWAY) ──
  // ══════════════════════════════════════════════════════════════════════
  // 0.00 - 0.12: Hero Entrance (Scale 1.04, Gopurams visible on left & right)
  // 0.12 - 0.26: Zoom into sandalwood pillars -> Couple together in center
  // 0.26 - 0.38: Pan LEFT to left sandalwood pillar -> Groom Vignesh
  // 0.38 - 0.49: Pan RIGHT to right sandalwood pillar -> Bride Pavithra
  // 0.49 - 0.63: Pan back to CENTER -> Events Timeline appears in mandapam!
  // 0.63 - 0.76: Move DEEPER inside mandapam with side pillars -> Wedding Venues
  // 0.76 - 0.88: Zoom into golden sanctum niche -> Digital Wedding Invitation
  // 0.88 - 0.97: Glides out to open courtyard with the TWO TEMPLES -> 3D Blessings Tree!
  // 0.97 - 1.00: Temple base -> Royal Closing Footer
  // ══════════════════════════════════════════════════════════════════════

  let templeScale = 1.00;
  let templeX = 0;

  if (scrollProgress < 0.12) {
    // Hero Entrance
    templeScale = 1.00 + (scrollProgress / 0.12) * 0.14;
    templeX = 0;
  } else if (scrollProgress < 0.26) {
    // Zoom in to Couple Together
    const p = (scrollProgress - 0.12) / 0.14;
    templeScale = 1.14 + p * 0.36; // up to 1.50
    templeX = 0;
  } else if (scrollProgress < 0.38) {
    // Pan LEFT to Groom Vignesh
    templeScale = 1.50;
    const p = (scrollProgress - 0.26) / 0.12;
    templeX = -p * 18; // 0% to -18% left
  } else if (scrollProgress < 0.49) {
    // Pan RIGHT to Bride Pavithra (0.38 - 0.46), then smoothly return to center temple (0.46 - 0.49)
    if (scrollProgress < 0.46) {
      const p = (scrollProgress - 0.38) / 0.08;
      templeScale = 1.50;
      templeX = -18 + p * 36; // -18% to +18% right
    } else {
      // Smoothly pull back to natural temple framing (exact same temple as Hero!)
      const p = (scrollProgress - 0.46) / 0.03;
      templeScale = 1.50 - p * 0.50; // 1.50 -> 1.00
      templeX = 18 - p * 18; // +18% -> 0%
    }
  } else if (scrollProgress < 0.63) {
    // Scene 3: Events Timeline — Exact same crystal-clear symmetrical temple as Hero above!
    templeScale = 1.00;
    templeX = 0;
  } else if (scrollProgress < 0.76) {
    // Scene 4: The Sacred Destinations (Wedding Venues)
    // Scale remains at natural majestic scale 1.05 with templeX = 0
    // so BOTH Dravidian temple towers frame the left and right in full HD!
    templeScale = 1.05;
    templeX = 0;
  } else if (scrollProgress < 0.88) {
    // Scene 5: Camera zooms in into sanctum niche for Invitation Patrika
    const p = (scrollProgress - 0.76) / 0.12;
    templeScale = 1.05 + p * 0.40; // 1.05 -> 1.45 (zooms into sanctum niche)
    templeX = 0;
  } else {
    // Scene 6 & 7: Camera opens to courtyard with the TWO TEMPLES (just like Hero page!)
    const p = Math.min(1, (scrollProgress - 0.88) / 0.08);
    templeScale = 1.80 - p * 0.75; // 1.80 -> 1.05 (shows both temples!)
    templeX = 0;
  }

  // Opacities for each movie scene
  // 1. Hero Opacity (0.00 - 0.12)
  const heroOpacity = Math.max(0, 1 - scrollProgress / 0.10);
  const heroTranslateY = -(scrollProgress / 0.10) * 60;
  const heroPointerEvents = scrollProgress < 0.09 ? 'auto' : 'none';

  // 2A. Couple Together Opacity (0.12 - 0.26)
  let coupleOpacity = 0;
  if (scrollProgress >= 0.12 && scrollProgress < 0.26) {
    if (scrollProgress < 0.16) coupleOpacity = (scrollProgress - 0.12) / 0.04;
    else if (scrollProgress < 0.22) coupleOpacity = 1;
    else coupleOpacity = Math.max(0, 1 - (scrollProgress - 0.22) / 0.04);
  }

  // 2B. Groom Opacity (0.26 - 0.38)
  let groomOpacity = 0;
  if (scrollProgress >= 0.26 && scrollProgress < 0.38) {
    if (scrollProgress < 0.29) groomOpacity = (scrollProgress - 0.26) / 0.03;
    else if (scrollProgress < 0.35) groomOpacity = 1;
    else groomOpacity = Math.max(0, 1 - (scrollProgress - 0.35) / 0.03);
  }

  // 2C. Bride Opacity (0.38 - 0.49)
  let brideOpacity = 0;
  if (scrollProgress >= 0.38 && scrollProgress < 0.49) {
    if (scrollProgress < 0.41) brideOpacity = (scrollProgress - 0.38) / 0.03;
    else if (scrollProgress < 0.46) brideOpacity = 1;
    else brideOpacity = Math.max(0, 1 - (scrollProgress - 0.46) / 0.03);
  }

  // 3. Events Timeline Opacity (0.49 - 0.63) — Replaces "entering sacred mandabam"
  let eventsOpacity = 0;
  if (scrollProgress >= 0.49 && scrollProgress < 0.63) {
    if (scrollProgress < 0.52) eventsOpacity = (scrollProgress - 0.49) / 0.03;
    else if (scrollProgress < 0.60) eventsOpacity = 1;
    else eventsOpacity = Math.max(0, 1 - (scrollProgress - 0.60) / 0.03);
  }

  // Events Golden Timeline Drawing Progress (draws line downward as user scrolls)
  const effectiveTimelineProgress = Math.min(1, Math.max(0, (scrollProgress - 0.492) / 0.098));

  // 4. Wedding Venues Opacity (0.63 - 0.76) — Inside mandapam with side pillars
  let venueOpacity = 0;
  if (scrollProgress >= 0.63 && scrollProgress < 0.76) {
    if (scrollProgress < 0.66) venueOpacity = (scrollProgress - 0.63) / 0.03;
    else if (scrollProgress < 0.73) venueOpacity = 1;
    else venueOpacity = Math.max(0, 1 - (scrollProgress - 0.73) / 0.03);
  }

  // 5. Digital Invitation Opacity (0.76 - 0.88) — Zooming into sanctum
  let invitationOpacity = 0;
  if (scrollProgress >= 0.76 && scrollProgress < 0.88) {
    if (scrollProgress < 0.79) invitationOpacity = (scrollProgress - 0.76) / 0.03;
    else if (scrollProgress < 0.85) invitationOpacity = 1;
    else invitationOpacity = Math.max(0, 1 - (scrollProgress - 0.85) / 0.03);
  }

  // 6. Blessings Tree Opacity (0.88 - 0.97) — Courtyard flanked by the two temples
  let treeOpacity = 0;
  if (scrollProgress >= 0.88 && scrollProgress < 0.97) {
    if (scrollProgress < 0.91) treeOpacity = (scrollProgress - 0.88) / 0.03;
    else treeOpacity = 1;
  }

  // 7. Footer Opacity (0.97 - 1.00)
  let footerOpacity = 0;
  if (scrollProgress >= 0.97) {
    footerOpacity = Math.min(1, (scrollProgress - 0.97) / 0.02);
  }

  const events = WEDDING_CONFIG.events;

  return (
    <section
      ref={runwayRef}
      id="home"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[1200vh] bg-[#F6EDDC] select-none p-0 m-0"
    >
      {/* ── ANCHORS FOR NAVBAR INSTANT SCROLLING ── */}
      <div id="couple" className="absolute top-[16%] left-0 w-full h-[1px] pointer-events-none" />
      <div id="events" className="absolute top-[49%] left-0 w-full h-[1px] pointer-events-none" />
      <div id="venue" className="absolute top-[64%] left-0 w-full h-[1px] pointer-events-none" />
      <div id="invitation" className="absolute top-[77%] left-0 w-full h-[1px] pointer-events-none" />
      <div id="blessing-tree" className="absolute top-[89%] left-0 w-full h-[1px] pointer-events-none" />

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── STICKY 100VH MOVIE VIEWPORT — ZERO PAGE SCROLL, 100% MOVIE CAMERA ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between items-center select-none">

        {/* ── 1. CONTINUOUS SANDALWOOD TEMPLE BACKGROUND & CAMERA ── */}
        <div
          className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden"
          style={{
            transform: `scale(${templeScale}) translate3d(calc(${templeX}% + ${mousePos.x * -10}px), ${mousePos.y * -6}px, 0px) rotateY(${mousePos.x * 0.6}deg)`,
            transformOrigin: '50% 60%',
            transition: 'transform 0.15s ease-out',
          }}
        >
          {/* Authentic Dravidian Temple Architecture (Desktop) */}
          <div className="hidden md:block absolute inset-0">
            <img
              src="/assets/temple_hero_clean_v3.png"
              alt="Dravidian Temple Sandalwood Pillars"
              className="w-full h-full object-cover object-center select-none"
            />
          </div>

          {/* Mobile: Symmetrical Dravidian Temple Architecture exactly matching target reference */}
          <div className="block md:hidden absolute inset-0 overflow-hidden pointer-events-none select-none">
            <img
              src="/assets/temple_hero_mobile_v3.png"
              alt="Dravidian Temple Towers"
              className="w-full h-full object-cover object-center select-none"
            />
          </div>

          {/* Golden Sunbeam Aura (Desktop only, hidden on mobile to avoid oval patch) */}
          <div
            className="hidden md:block absolute inset-0 pointer-events-none"
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
                  transform: `translate3d(${mousePos.x * p.depth}px, ${mousePos.y * p.depth}px, ${p.depth}px)`,
                }}
              />
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════ */}
        {/* ── SCENE 1: HERO ENTRANCE (Vignesh & Pavithra Announcement) ── */}
        {/* ══════════════════════════════════════════════════════════════════════ */}
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-between pt-13 xs:pt-15 sm:pt-18 pb-[20vh] sm:pb-[22vh] md:justify-center md:py-0 px-3 sm:px-4 transition-all duration-300"
          style={{
            opacity: heroOpacity,
            transform: `translate3d(0, ${heroTranslateY}px, 0)`,
            pointerEvents: heroPointerEvents,
          }}
        >
          {/* Hero Content Wrapper: Vertically distributed on mobile to align with temple architecture */}
          <div className="relative w-full max-w-xl mx-auto text-center px-2 sm:px-4 flex flex-col items-center justify-between h-full md:h-auto md:space-y-2">
            
            {/* 1. TOP INVOCATION: Ganesha Crest & Sacred Sanskrit Mantra */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 xs:w-13 xs:h-13 sm:w-14 sm:h-14 mx-auto mb-1">
                <img
                  src="/assets/ganesha-authentic.png"
                  alt="Lord Ganesha Motif"
                  className="w-full h-full object-contain"
                />
              </div>

              <p className="font-serif-royal text-[11px] xs:text-xs sm:text-sm font-bold tracking-[0.24em] text-[#8C4525] uppercase">
                OM SHRI GANESHAYA NAMAH
              </p>

              {/* Exquisite 5-Petal Golden Lotus Divider Motif */}
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

            {/* 2. MAJESTIC NAMES & SUBTITLE: Bold, Large, Royal Serif matching Target Mockup */}
            <div className="flex flex-col items-center text-center my-0.5 sm:my-1">
              <h1 className="font-serif-royal text-[29px] xs:text-[33px] sm:text-4xl md:text-5xl font-bold tracking-wider text-[#7A281E] leading-tight uppercase">
                C. VIGNESH
              </h1>
              
              <div className="flex items-center justify-center space-x-3 my-0.5 sm:my-1">
                <div className="h-[1px] w-12 xs:w-16 sm:w-20 bg-[#C49A58]/80" />
                <span className="font-serif-royal text-xl sm:text-2xl font-light text-[#C49A58]">
                  &amp;
                </span>
                <div className="h-[1px] w-12 xs:w-16 sm:w-20 bg-[#C49A58]/80" />
              </div>

              <h1 className="font-serif-royal text-[29px] xs:text-[33px] sm:text-4xl md:text-5xl font-bold tracking-wider text-[#7A281E] leading-tight uppercase">
                S. PAVITHRA
              </h1>

              {/* Invitation Subtitle: Wrapped into two centered lines with max-w ~320px */}
              <p className="font-cormorant italic text-[15px] xs:text-[16px] sm:text-base md:text-lg text-[#5A4535] mt-2 mb-1 sm:mt-2.5 sm:mb-2 max-w-[310px] xs:max-w-[330px] sm:max-w-[360px] mx-auto text-center leading-snug font-semibold">
                Together with the family we cordially invite you to celebrate our wedding.
              </p>
            </div>

            {/* 3. COUNTDOWN & DATE: Rounded Pill Cards & Golden Lotus Divider */}
            <div className="flex flex-col items-center text-center">
              {/* Live Countdown Timer (Large numbers in rounded gold-bordered cards) */}
              <div className="my-1 sm:my-2 flex items-center justify-center space-x-2 xs:space-x-2.5 sm:space-x-3 text-[#45352A]">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Mins', value: timeLeft.minutes },
                  { label: 'Secs', value: timeLeft.seconds },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center bg-[#FFFDF9]/95 border border-[#D4A359]/75 rounded-2xl px-2.5 py-1.5 xs:px-3 xs:py-2 min-w-[58px] xs:min-w-[64px] sm:min-w-[70px] shadow-xs"
                  >
                    <span className="font-serif-royal text-2xl xs:text-[26px] sm:text-3xl font-bold text-[#7A281E] leading-none mb-1">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-serif-royal uppercase tracking-wider text-[#6E5D4F] leading-none font-semibold">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Subtle Golden Lotus Divider Motif 2 */}
              <div className="flex items-center justify-center space-x-2 my-1 sm:my-1.5">
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

              {/* Date line */}
              <p className="font-serif-royal text-xs sm:text-sm font-bold tracking-[0.2em] text-[#45352A] uppercase pt-0.5">
                MONDAY, 14 DECEMBER 2026
              </p>
            </div>



          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════ */}
        {/* ── SCENE 2A: COUPLE TOGETHER (Center Sanctum Between Pillars) ── */}
        {/* ══════════════════════════════════════════════════════════════════════ */}
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 transition-all duration-300"
          style={{
            opacity: coupleOpacity,
            transform: coupleOpacity > 0 ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(30px)',
            pointerEvents: coupleOpacity > 0.5 ? 'auto' : 'none',
          }}
        >
          <div className="flex flex-col items-center max-w-lg w-full text-center">
            <div className="relative group mb-3 sm:mb-4">
              <div className="absolute -inset-2 sm:-inset-2.5 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-[#C49A58]/70 shadow-2xl" />
              <div className="w-48 h-64 sm:w-60 sm:h-80 md:w-68 md:h-88 rounded-[1.8rem] sm:rounded-[2.2rem] overflow-hidden border-3 sm:border-4 border-[#C49A58] shadow-2xl bg-[#FFFDF9]">
                <img
                  src="/assets/couple/couple_together.jpg"
                  alt="C. Vignesh & S. Pavithra"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            <div className="bg-[#FFFDF9]/92 border border-[#C49A58]/70 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md max-w-sm sm:max-w-md w-full">
              <h2 className="font-serif-royal text-xl sm:text-3xl font-bold text-[#45352A]">
                Vignesh &amp; Pavithra
              </h2>
              <div className="w-10 sm:w-12 h-[1.5px] bg-[#C49A58] mx-auto my-1.5 sm:my-2" />
              <p className="font-cormorant italic text-sm sm:text-lg text-[#98502F] font-semibold">
                &ldquo;Two hearts, one beautiful beginning.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════ */}
        {/* ── SCENE 2B: GROOM VIGNESH (Left Sandalwood Pillar) ── */}
        {/* ══════════════════════════════════════════════════════════════════════ */}
        <div
          className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-12 transition-all duration-300"
          style={{
            opacity: groomOpacity,
            transform: groomOpacity > 0 ? 'scale(1) translateX(0)' : 'scale(0.92) translateX(-30px)',
            pointerEvents: groomOpacity > 0.5 ? 'auto' : 'none',
          }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-12 md:gap-16 w-full max-w-4xl">
            {/* Groom Photo Framed by Left Pillar */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-2 sm:-inset-2.5 rounded-[2rem] sm:rounded-[2.4rem] border-2 border-[#C49A58]/70 shadow-2xl" />
              <div className="w-44 h-56 sm:w-60 sm:h-80 md:w-64 md:h-88 rounded-[1.8rem] sm:rounded-[2.2rem] overflow-hidden border-3 sm:border-4 border-[#C49A58] shadow-2xl bg-[#FFFDF9]">
                <img
                  src="/assets/couple/vignesh.jpg"
                  alt="C. Vignesh — Groom"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-14 sm:h-16 rounded-b-[1.8rem] sm:rounded-b-[2.2rem] bg-gradient-to-t from-[#2B1A0F]/85 to-transparent pointer-events-none" />
              <div className="absolute bottom-1.5 sm:bottom-2 left-0 right-0 text-center">
                <span className="text-white font-serif-royal text-[11px] sm:text-xs font-bold tracking-widest uppercase drop-shadow-md">
                  Groom
                </span>
              </div>
            </div>

            {/* Groom Royal Quote */}
            <div className="max-w-sm sm:max-w-none text-center sm:text-left bg-[#FFFDF9]/92 border border-[#C49A58]/60 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl backdrop-blur-md">
              <span className="text-[9px] sm:text-[10px] font-serif-royal uppercase tracking-widest text-[#98502F] font-bold block mb-0.5 sm:mb-1">
                ✦ The Groom
              </span>
              <h3 className="font-serif-royal text-2xl sm:text-4xl font-bold text-[#45352A] mb-1 sm:mb-2">
                C. Vignesh
              </h3>
              <div className="w-10 sm:w-12 h-[1.5px] bg-[#C49A58] mb-2 sm:mb-3 mx-auto sm:mx-0" />
              <p className="font-cormorant italic text-base sm:text-2xl text-[#98502F] font-medium leading-snug sm:leading-relaxed">
                &ldquo;Thoughtful, devoted,<br className="hidden sm:inline" /> and ever-gracious.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════ */}
        {/* ── SCENE 2C: BRIDE PAVITHRA (Right Sandalwood Pillar) ── */}
        {/* ══════════════════════════════════════════════════════════════════════ */}
        <div
          className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-12 transition-all duration-300"
          style={{
            opacity: brideOpacity,
            transform: brideOpacity > 0 ? 'scale(1) translateX(0)' : 'scale(0.92) translateX(30px)',
            pointerEvents: brideOpacity > 0.5 ? 'auto' : 'none',
          }}
        >
          <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-3 sm:gap-12 md:gap-16 w-full max-w-4xl">
            {/* Bride Royal Quote */}
            <div className="max-w-sm sm:max-w-none text-center sm:text-right bg-[#FFFDF9]/92 border border-[#C49A58]/60 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl backdrop-blur-md">
              <span className="text-[9px] sm:text-[10px] font-serif-royal uppercase tracking-widest text-[#98502F] font-bold block mb-0.5 sm:mb-1">
                ✦ The Bride
              </span>
              <h3 className="font-serif-royal text-2xl sm:text-4xl font-bold text-[#45352A] mb-1 sm:mb-2">
                S. Pavithra
              </h3>
              <div className="w-10 sm:w-12 h-[1.5px] bg-[#C49A58] mb-2 sm:mb-3 mx-auto sm:ml-auto sm:mr-0" />
              <p className="font-cormorant italic text-base sm:text-2xl text-[#98502F] font-medium leading-snug sm:leading-relaxed">
                &ldquo;Graceful, radiant,<br className="hidden sm:inline" /> and full of warmth.&rdquo;
              </p>
            </div>

            {/* Bride Photo Framed by Right Pillar */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-2 sm:-inset-2.5 rounded-[2rem] sm:rounded-[2.4rem] border-2 border-[#C49A58]/70 shadow-2xl" />
              <div className="w-44 h-56 sm:w-60 sm:h-80 md:w-64 md:h-88 rounded-[1.8rem] sm:rounded-[2.2rem] overflow-hidden border-3 sm:border-4 border-[#C49A58] shadow-2xl bg-[#FFFDF9]">
                <img
                  src="/assets/couple/pavithra.jpg"
                  alt="S. Pavithra — Bride"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-14 sm:h-16 rounded-b-[1.8rem] sm:rounded-b-[2.2rem] bg-gradient-to-t from-[#2B1A0F]/85 to-transparent pointer-events-none" />
              <div className="absolute bottom-1.5 sm:bottom-2 left-0 right-0 text-center">
                <span className="text-white font-serif-royal text-[11px] sm:text-xs font-bold tracking-widest uppercase drop-shadow-md">
                  Bride
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── SCENE 3 BACKDROP WASH & BOTANICAL CORNERS (Exact Match to Reference Mockup) ── */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
          style={{ opacity: eventsOpacity }}
        >
          {/* Desktop: Soft Parchment Wash covering center & right, keeping left temple HD clear */}
          <div
            className="hidden md:block absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(251, 246, 238, 0) 0%, rgba(251, 246, 238, 0) 22%, rgba(251, 246, 238, 0.88) 30%, rgba(250, 245, 236, 0.98) 42%, rgba(250, 245, 236, 0.98) 100%)',
            }}
          />
          {/* Mobile: Gentle Vignette keeping BOTH temple towers visible flanking the phone screen */}
          <div
            className="block md:hidden absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 95% 75% at 50% 50%, rgba(251, 246, 238, 0.85) 0%, rgba(251, 246, 238, 0.45) 55%, transparent 95%)',
            }}
          />

          {/* White Jasmine & Plumeria Blossom Cluster at base of left temple */}
          <div className="absolute bottom-2 left-2 sm:left-6 z-10 pointer-events-none select-none drop-shadow-md">
            <svg width="135" height="100" viewBox="0 0 135 100" fill="none">
              <path d="M12 90 C 18 70, 38 65, 48 75 C 38 85, 22 95, 12 90 Z" fill="#4B6336" />
              <path d="M42 95 C 48 75, 68 70, 78 80 C 68 90, 52 100, 42 95 Z" fill="#5E7A44" />
              <path d="M28 80 C 38 60, 58 55, 68 65 C 58 75, 38 85, 28 80 Z" fill="#6B8A4E" />
              <g transform="translate(32, 62)">
                {[0, 72, 144, 216, 288].map((rot, i) => (
                  <ellipse key={i} cx="0" cy="-10" rx="4.5" ry="8" fill="#FFFDF9" stroke="#E5D8C4" strokeWidth="0.6" transform={`rotate(${rot})`} />
                ))}
                <circle cx="0" cy="0" r="3" fill="#E6AF2E" />
                <circle cx="0" cy="0" r="1.5" fill="#C49A58" />
              </g>
              <g transform="translate(64, 72)">
                {[0, 72, 144, 216, 288].map((rot, i) => (
                  <ellipse key={i} cx="0" cy="-8" rx="3.5" ry="6.5" fill="#FAF5EC" stroke="#E5D8C4" strokeWidth="0.6" transform={`rotate(${rot})`} />
                ))}
                <circle cx="0" cy="0" r="2.5" fill="#E6AF2E" />
              </g>
              <g transform="translate(20, 84)">
                {[0, 72, 144, 216, 288].map((rot, i) => (
                  <ellipse key={i} cx="0" cy="-7" rx="3" ry="5.5" fill="#FFFDF9" stroke="#E5D8C4" strokeWidth="0.6" transform={`rotate(${rot})`} />
                ))}
                <circle cx="0" cy="0" r="2" fill="#E6AF2E" />
              </g>
            </svg>
          </div>

          {/* Top-Right Cascading Botanical Leaves */}
          <div className="absolute top-0 right-0 pointer-events-none select-none z-10 opacity-90">
            <svg width="230" height="190" viewBox="0 0 230 190" fill="none">
              <path d="M230 0 C 190 20, 160 60, 150 110 C 145 135, 130 150, 110 165" stroke="#7A8B63" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M190 30 C 160 45, 140 80, 130 110" stroke="#8CA073" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M150 110 C 130 95, 115 105, 120 120 C 135 125, 145 120, 150 110 Z" fill="#6B8A4E" opacity="0.85" />
              <path d="M170 80 C 150 65, 140 75, 145 90 C 160 95, 168 90, 170 80 Z" fill="#7A9A5B" opacity="0.9" />
              <path d="M200 40 C 180 30, 170 40, 175 55 C 190 60, 198 50, 200 40 Z" fill="#5D7A41" opacity="0.85" />
              <path d="M110 165 C 95 150, 85 160, 90 172 C 102 176, 108 172, 110 165 Z" fill="#8CA073" opacity="0.85" />
              <path d="M130 110 C 115 100, 105 110, 110 122 C 122 126, 128 120, 130 110 Z" fill="#6B8A4E" opacity="0.8" />
              <path d="M185 70 C 170 60, 160 70, 165 82 C 178 86, 182 80, 185 70 Z" fill="#95AC7C" opacity="0.85" />
              <path d="M220 15 C 200 10, 192 22, 198 32 C 210 35, 218 26, 220 15 Z" fill="#5D7A41" opacity="0.9" />
              <path d="M160 135 C 145 125, 135 135, 140 148 C 152 152, 158 145, 160 135 Z" fill="#7A9A5B" opacity="0.8" />
            </svg>
          </div>

          {/* Bottom-Right Botanical Leaves Branch */}
          <div className="absolute bottom-0 right-0 pointer-events-none select-none z-10 opacity-85">
            <svg width="210" height="150" viewBox="0 0 210 150" fill="none">
              <path d="M210 150 C 170 140, 140 115, 120 80 C 110 60, 95 50, 80 42" stroke="#7A8B63" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M120 80 C 105 95, 95 85, 100 72 C 112 68, 118 72, 120 80 Z" fill="#6B8A4E" opacity="0.85" />
              <path d="M145 105 C 130 120, 120 110, 125 98 C 138 94, 142 98, 145 105 Z" fill="#7A9A5B" opacity="0.9" />
              <path d="M175 130 C 160 142, 150 132, 155 120 C 168 116, 172 122, 175 130 Z" fill="#5D7A41" opacity="0.85" />
              <path d="M80 42 C 65 55, 58 47, 62 35 C 75 32, 78 37, 80 42 Z" fill="#8CA073" opacity="0.85" />
            </svg>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════ */}
        {/* ── SCENE 3: EVENTS TIMELINE (Cinematic 3D Video Experience - Clear Temple Architecture) ── */}
        {/* ══════════════════════════════════════════════════════════════════════ */}
        <div
          className="absolute inset-0 z-15 flex flex-col items-center md:items-end justify-center pt-1 xs:pt-2 sm:pt-4 md:pt-6 pb-1 sm:pb-4 px-2 xs:px-3 sm:px-6 md:pr-8 lg:pr-12 xl:pr-16 md:pl-[24vw] transition-all duration-300 select-none overflow-y-auto md:overflow-hidden scrollbar-none"
          style={{
            opacity: eventsOpacity,
            transform: eventsOpacity > 0 ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(24px)',
            pointerEvents: eventsOpacity > 0.5 ? 'auto' : 'none',
          }}
        >
          {/* Background: Pure Dravidian Temple Architecture from Sticky Background + Corner Botanicals */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
            {/* Ultra-Subtle Warm Golden Aura (Keeps background temple 100% clear & sharp!) */}
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255, 238, 190, 0.15) 0%, transparent 80%)',
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
                  <circle cx="0" cy="0" r="2" fill="#FDE047" />
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

            {/* Bottom-Right Corner Floral Bouquet (Mirrored Pink Lotus & Foliage for Mobile Symmetry) */}
            <div className="block md:hidden absolute bottom-0 right-0 pointer-events-none select-none z-10 opacity-85 sm:opacity-95 drop-shadow-sm scale-x-[-1]">
              <svg width="150" height="120" viewBox="0 0 150 120" fill="none" className="w-24 h-20 sm:w-36 sm:h-30">
                <path d="M0 120 C 20 95, 40 90, 55 102 C 45 115, 25 125, 0 120 Z" fill="#5E7A44" opacity="0.85" />
                <path d="M25 120 C 45 80, 70 85, 78 98 C 65 110, 40 120, 25 120 Z" fill="#4B6336" opacity="0.8" />
                <path d="M0 90 C 20 65, 45 68, 52 80 C 40 92, 15 100, 0 90 Z" fill="#6B8A4E" opacity="0.85" />
                <path d="M40 110 C 60 70, 85 75, 95 90 C 80 105, 55 115, 40 110 Z" fill="#7A9A5B" opacity="0.85" />
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
              </svg>
            </div>

            {/* Subtle Floating Sacred Jasmine Petals with 3D Depth */}
            {[
              { left: '12%', delay: '0s', dur: '12s', size: 'w-2.5 h-3.5', color: 'bg-white/90', depth: 15 },
              { left: '28%', delay: '3s', dur: '14s', size: 'w-3 h-4', color: 'bg-gradient-to-br from-[#FFFDF9] to-[#FDE047]/25', depth: 25 },
              { left: '72%', delay: '1.5s', dur: '13s', size: 'w-2.5 h-3.5', color: 'bg-white/90', depth: 12 },
              { left: '86%', delay: '4s', dur: '15s', size: 'w-3 h-4', color: 'bg-gradient-to-br from-[#FFFDF9] to-[#FDA4AF]/25', depth: 20 },
            ].map((p, i) => (
              <div
                key={i}
                className={`absolute top-0 ${p.size} rounded-full ${p.color} border border-[#C49A58]/35 shadow-2xs animate-float-petal`}
                style={{
                  left: p.left,
                  animationDelay: p.delay,
                  animationDuration: p.dur,
                  transform: `translate3d(${mousePos.x * (p.depth / 2)}px, ${mousePos.y * (p.depth / 2)}px, 0px)`,
                }}
              />
            ))}
          </div>

          {/* ── 3D CAMERA CONTENT CANVAS (Right-Aligned to Clear Left Temple Tower) ── */}
          <div
            className="relative z-10 w-full max-w-xl md:max-w-3xl lg:max-w-[880px] xl:max-w-[980px] 2xl:max-w-[1040px] mx-auto md:mr-0 flex flex-col items-center justify-center my-auto transition-transform duration-200 ease-out self-center md:self-end"
            style={{
              transform: `translate3d(${mousePos.x * -6}px, ${mousePos.y * -4}px, 0px) rotateX(${mousePos.y * -0.8}deg) rotateY(${mousePos.x * 1.0}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Desktop Editorial Header (Hidden on Mobile) */}
            <div className="hidden md:block relative z-10 text-center mb-2 sm:mb-3 max-w-2xl mx-auto px-2 shrink-0">
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

              {/* Animated Drawing Golden Line */}
              <div
                className="absolute left-6 top-[165px] h-[2.5px] bg-gradient-to-r from-[#D4A359] via-[#E6B86A] to-[#98502F] shadow-[0_0_14px_rgba(212,163,89,0.9)] z-10 transition-all duration-300 ease-out"
                style={{ width: `${Math.min(96, Math.max(12, effectiveTimelineProgress * 96))}%` }}
              />

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
                  const isActive = effectiveTimelineProgress >= 0.15;
                  return (
                    <div key={ev.id} className="relative flex flex-col items-center group">
                      {/* Top Jharokha Arch Picture */}
                      <div className="w-full h-[165px] flex items-end justify-center overflow-hidden pb-1 transition-transform duration-300 group-hover:scale-[1.02]">
                        <img
                          src="/assets/events/arch_ooty_hd.png"
                          alt="Engagement - Nilgiri Hills & Ooty Heritage Train"
                          className="w-auto h-full max-h-[160px] object-contain drop-shadow-md select-none transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      {/* Lotus Node on the Timeline */}
                      <div className="relative z-20 -my-4 flex items-center justify-center">
                        <div
                          className={`w-8 h-8 rounded-full bg-[#FFFDF9] border-2 border-[#D4A359] shadow-md flex items-center justify-center transition-all duration-300 p-0.5 ${
                            isActive
                              ? 'ring-4 ring-[#D4A359]/40 border-[#98502F] scale-110 shadow-[0_0_14px_rgba(212,163,89,0.7)]'
                              : 'opacity-90'
                          }`}
                        >
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
                  const isActive = effectiveTimelineProgress >= 0.45;
                  return (
                    <div key={ev.id} className="relative flex flex-col items-center group">
                      {/* Top Jharokha Arch Picture (Slightly taller canopy) */}
                      <div className="w-full h-[165px] flex items-end justify-center overflow-hidden pb-1 transition-transform duration-300 group-hover:scale-[1.02]">
                        <img
                          src="/assets/events/arch_mandapam_hd.png"
                          alt="Sacred Muhurtham Mandapam"
                          className="w-auto h-full max-h-[175px] object-contain drop-shadow-lg select-none scale-105 transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>

                      {/* Lotus Node on the Timeline */}
                      <div className="relative z-20 -my-4 flex items-center justify-center">
                        <div
                          className={`w-8 h-8 rounded-full bg-[#FFFDF9] border-2 border-[#98502F] shadow-md flex items-center justify-center transition-all duration-300 p-0.5 ${
                            isActive
                              ? 'ring-4 ring-amber-500/50 scale-110 shadow-[0_0_18px_rgba(234,88,12,0.6)]'
                              : 'opacity-90'
                          }`}
                        >
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
                  const isActive = effectiveTimelineProgress >= 0.75;
                  return (
                    <div key={ev.id} className="relative flex flex-col items-center group">
                      {/* Top Jharokha Arch Picture */}
                      <div className="w-full h-[165px] flex items-end justify-center overflow-hidden pb-1 transition-transform duration-300 group-hover:scale-[1.02]">
                        <img
                          src="/assets/events/arch_madurai_hd.png"
                          alt="Reception - Madurai Meenakshi Temple Gopuram"
                          className="w-auto h-full max-h-[160px] object-contain drop-shadow-md select-none transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      {/* Lotus Node on the Timeline */}
                      <div className="relative z-20 -my-4 flex items-center justify-center">
                        <div
                          className={`w-8 h-8 rounded-full bg-[#FFFDF9] border-2 border-[#D4A359] shadow-md flex items-center justify-center transition-all duration-300 p-0.5 ${
                            isActive
                              ? 'ring-4 ring-[#D4A359]/40 border-[#98502F] scale-110 shadow-[0_0_14px_rgba(212,163,89,0.7)]'
                              : 'opacity-90'
                          }`}
                        >
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
            <div className="hidden md:flex items-center justify-center space-x-2 sm:space-x-3 mt-2.5 sm:mt-3 text-center">
              <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent via-[#C49A58] to-[#C49A58]" />
              <span className="text-xs sm:text-sm text-[#C49A58]">🪷</span>
              <p className="font-cormorant italic text-[11px] sm:text-xs md:text-sm text-[#766B60] tracking-wide">
                A journey of love, tradition &amp; togetherness
              </p>
              <span className="text-xs sm:text-sm text-[#C49A58]">🪷</span>
              <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent via-[#C49A58] to-[#C49A58]" />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════ */}
        {/* ── SCENE 4: WEDDING VENUES (The Sacred Destinations - Exact Mockup Match) ── */}
        {/* ══════════════════════════════════════════════════════════════════════ */}
        <div
          className="absolute inset-0 z-15 flex flex-col items-center justify-center px-4 transition-all duration-300"
          style={{
            opacity: venueOpacity,
            transform: venueOpacity > 0 ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(30px)',
            pointerEvents: venueOpacity > 0.5 ? 'auto' : 'none',
          }}
        >
          {/* White Jasmine & Plumeria Blossom Clusters at base of BOTH temples */}
          <div className="absolute bottom-2 left-2 sm:left-6 z-10 pointer-events-none select-none drop-shadow-md">
            <svg width="135" height="100" viewBox="0 0 135 100" fill="none">
              <path d="M12 90 C 18 70, 38 65, 48 75 C 38 85, 22 95, 12 90 Z" fill="#4B6336" />
              <path d="M42 95 C 48 75, 68 70, 78 80 C 68 90, 52 100, 42 95 Z" fill="#5E7A44" />
              <path d="M28 80 C 38 60, 58 55, 68 65 C 58 75, 38 85, 28 80 Z" fill="#6B8A4E" />
              <g transform="translate(32, 62)">
                {[0, 72, 144, 216, 288].map((rot, i) => (
                  <ellipse key={i} cx="0" cy="-10" rx="4.5" ry="8" fill="#FFFDF9" stroke="#E5D8C4" strokeWidth="0.6" transform={`rotate(${rot})`} />
                ))}
                <circle cx="0" cy="0" r="3" fill="#E6AF2E" />
                <circle cx="0" cy="0" r="1.5" fill="#C49A58" />
              </g>
              <g transform="translate(64, 72)">
                {[0, 72, 144, 216, 288].map((rot, i) => (
                  <ellipse key={i} cx="0" cy="-8" rx="3.5" ry="6.5" fill="#FAF5EC" stroke="#E5D8C4" strokeWidth="0.6" transform={`rotate(${rot})`} />
                ))}
                <circle cx="0" cy="0" r="2.5" fill="#E6AF2E" />
              </g>
              <g transform="translate(20, 84)">
                {[0, 72, 144, 216, 288].map((rot, i) => (
                  <ellipse key={i} cx="0" cy="-7" rx="3" ry="5.5" fill="#FFFDF9" stroke="#E5D8C4" strokeWidth="0.6" transform={`rotate(${rot})`} />
                ))}
                <circle cx="0" cy="0" r="2" fill="#E6AF2E" />
              </g>
            </svg>
          </div>

          <div className="absolute bottom-2 right-2 sm:right-6 z-10 pointer-events-none select-none drop-shadow-md scale-x-[-1]">
            <svg width="135" height="100" viewBox="0 0 135 100" fill="none">
              <path d="M12 90 C 18 70, 38 65, 48 75 C 38 85, 22 95, 12 90 Z" fill="#4B6336" />
              <path d="M42 95 C 48 75, 68 70, 78 80 C 68 90, 52 100, 42 95 Z" fill="#5E7A44" />
              <path d="M28 80 C 38 60, 58 55, 68 65 C 58 75, 38 85, 28 80 Z" fill="#6B8A4E" />
              <g transform="translate(32, 62)">
                {[0, 72, 144, 216, 288].map((rot, i) => (
                  <ellipse key={i} cx="0" cy="-10" rx="4.5" ry="8" fill="#FFFDF9" stroke="#E5D8C4" strokeWidth="0.6" transform={`rotate(${rot})`} />
                ))}
                <circle cx="0" cy="0" r="3" fill="#E6AF2E" />
                <circle cx="0" cy="0" r="1.5" fill="#C49A58" />
              </g>
              <g transform="translate(64, 72)">
                {[0, 72, 144, 216, 288].map((rot, i) => (
                  <ellipse key={i} cx="0" cy="-8" rx="3.5" ry="6.5" fill="#FAF5EC" stroke="#E5D8C4" strokeWidth="0.6" transform={`rotate(${rot})`} />
                ))}
                <circle cx="0" cy="0" r="2.5" fill="#E6AF2E" />
              </g>
              <g transform="translate(20, 84)">
                {[0, 72, 144, 216, 288].map((rot, i) => (
                  <ellipse key={i} cx="0" cy="-7" rx="3" ry="5.5" fill="#FFFDF9" stroke="#E5D8C4" strokeWidth="0.6" transform={`rotate(${rot})`} />
                ))}
                <circle cx="0" cy="0" r="2" fill="#E6AF2E" />
              </g>
            </svg>
          </div>

          <div className="relative z-10 max-w-4xl lg:max-w-5xl w-full mx-auto px-2 py-0 text-center">
            {/* Header */}
            <div className="mb-2 sm:mb-3">
              <div className="flex justify-center mb-1">
                <svg width="26" height="15" viewBox="0 0 26 15" fill="none" className="text-[#C49A58]">
                  <path d="M13 1 C11 5 7 7 2 8 C7 9 11 11 13 15 C15 11 19 9 24 8 C19 7 15 5 13 1 Z" fill="#C49A58" opacity="0.9" />
                  <circle cx="13" cy="8" r="1.5" fill="#98502F" />
                </svg>
              </div>
              <div className="inline-flex items-center space-x-2 bg-[#FFFDF9]/95 border border-[#C49A58]/70 px-4 py-0.5 rounded-full shadow-2xs mb-1">
                <span className="text-xs text-[#C49A58]">✦</span>
                <span className="text-[10px] font-serif-royal font-bold uppercase tracking-widest text-[#98502F]">
                  Wedding Venues
                </span>
                <span className="text-xs text-[#C49A58]">✦</span>
              </div>
              <h2 className="font-serif-royal text-xl sm:text-3xl lg:text-4xl font-bold text-[#45352A] tracking-normal mb-0.5">
                Our Sacred Venues
              </h2>
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-1 sm:mb-2">
                <div className="h-[1px] w-6 sm:w-16 bg-gradient-to-r from-transparent to-[#C49A58]/70" />
                <p className="font-cormorant italic text-xs sm:text-sm text-[#766B60]">
                  Two beautiful venues, one blessed celebration
                </p>
                <div className="h-[1px] w-6 sm:w-16 bg-gradient-to-l from-transparent to-[#C49A58]/70" />
              </div>
            </div>

            {/* Stack venue cards on mobile and show them side-by-side on desktop. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 lg:gap-6 w-full text-left pb-1">
              {WEDDING_CONFIG.venues.map((venue) => {
                const isOoty = venue.id === 'ooty-venue';
                const isCopied = copiedId === venue.id;

                return (
                  <div
                    key={venue.id}
                    className="bg-[#FFFDF9]/92 border border-[#C49A58]/70 rounded-2xl sm:rounded-[2rem] p-2.5 sm:p-5 shadow-xl backdrop-blur-md flex flex-col justify-between text-left hover:scale-[1.01] transition-all"
                  >
                    <div>
                      <div className="mb-1.5 sm:mb-3 flex h-20 sm:h-36 items-center justify-center overflow-hidden rounded-xl border border-[#E5D8C4] bg-[#FAF5EC] p-1.5">
                        <img
                          src={isOoty ? '/assets/venues/ooty-mandapam.png' : '/assets/venues/gt-palace.png'}
                          alt={`${venue.name} venue`}
                          className="h-full w-full object-contain object-center"
                        />
                      </div>

                      {/* Card Header Row */}
                      <div className="flex items-center justify-between mb-1 sm:mb-2.5">
                        <span className="text-[9px] sm:text-[10px] font-serif-royal font-bold uppercase tracking-wider text-[#98502F] bg-[#FAF5EC] px-3 sm:px-3.5 py-0.5 rounded-full border border-[#C49A58]">
                          {isOoty ? '🛕 Ooty Muhurtham' : '🏛️ Madurai Reception'}
                        </span>
                        <span className="text-base sm:text-lg">👑</span>
                      </div>

                      <h3 className="font-serif-royal text-sm sm:text-xl font-bold text-[#45352A] leading-snug mb-1">
                        {venue.name}
                      </h3>

                      <div className="flex items-center space-x-1.5 text-[10px] sm:text-xs text-[#766B60] font-medium mb-1.5 sm:mb-3">
                        <MapPin className="w-3.5 h-3.5 text-[#C49A58] shrink-0" />
                        <span>{venue.landmark}</span>
                      </div>

                      {/* Address Box with Copy Button */}
                      <div className="bg-[#FAF5EC]/90 border border-[#E5D8C4] rounded-xl p-2 sm:p-3 mb-1.5 sm:mb-3 text-[10px] sm:text-xs flex items-start justify-between gap-2">
                        <div className="flex items-start space-x-2">
                          <MapPin className="w-3.5 h-3.5 text-[#98502F] shrink-0 mt-0.5" />
                          <p className="text-[#45352A] font-medium leading-relaxed">{venue.address}</p>
                        </div>
                        <button
                          onClick={() => handleCopyAddress(venue.id, venue.address)}
                          className="shrink-0 p-1.5 text-[#98502F] hover:bg-white rounded-md cursor-pointer transition-colors"
                          title="Copy address"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>


                    </div>

                    {/* Full Width Google Maps Button */}
                    <button
                      onClick={() => handleGetDirections(venue.directionsUrl)}
                      className="w-full inline-flex items-center justify-center space-x-2 py-1.5 sm:py-2.5 px-4 bg-gradient-to-r from-[#D48B28] to-[#98502F] hover:brightness-105 text-white rounded-full text-[10px] sm:text-xs font-serif-royal font-bold uppercase tracking-wider shadow-md cursor-pointer transition-all"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#FFF1B8]" />
                      <span>Open in Google Maps</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════ */}
        {/* ── SCENE 5: DIGITAL INVITATION (The Royal Patrika with PDF & 3D Tilt) ── */}
        {/* ══════════════════════════════════════════════════════════════════════ */}
        <div
          className="absolute inset-0 z-15 flex flex-col items-center justify-center px-3 sm:px-4 transition-all duration-300"
          style={{
            opacity: invitationOpacity,
            transform: invitationOpacity > 0 ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(40px)',
            pointerEvents: invitationOpacity > 0.5 ? 'auto' : 'none',
          }}
        >
          <div className="max-w-2xl w-full mx-auto px-1 sm:px-2 py-1 text-center">
            {/* Header with user's exact instruction: (Hover to tilt · Click to view full screen) */}
            <div className="text-center mb-2 sm:mb-3">
              <div className="flex justify-center mb-0.5 sm:mb-1">
                <svg width="24" height="14" viewBox="0 0 24 14" fill="none" className="text-[#C49A58]">
                  <path d="M12 1 C10 5 7 7 2 8 C7 9 10 11 12 14 C14 11 17 9 22 8 C17 7 14 5 12 1 Z" fill="#C49A58" opacity="0.9" />
                  <circle cx="12" cy="7.5" r="1.5" fill="#98502F" />
                </svg>
              </div>

              <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-[#FFFDF9]/95 border border-[#C49A58]/70 px-3.5 py-0.5 rounded-full shadow-2xs mb-1">
                <span className="text-[10px] sm:text-xs text-[#C49A58]">✦</span>
                <span className="text-[9px] sm:text-[10px] font-serif-royal font-bold uppercase tracking-widest text-[#98502F]">
                  Official Wedding Invitation
                </span>
                <span className="text-[10px] sm:text-xs text-[#C49A58]">✦</span>
              </div>

              <h2 className="font-serif-royal text-xl sm:text-3xl font-bold text-[#45352A]">
                The Royal Patrika
              </h2>

            </div>



            {/* The 3D Interactive Tilt Invitation Card */}
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
              className="relative cursor-pointer group mx-auto max-w-[270px] xs:max-w-[310px] sm:max-w-[350px] md:max-w-[370px] rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#FFFDF9] border-2 sm:border-3 border-[#C49A58] shadow-2xl transition-transform duration-200 ease-out select-none"
              style={{
                transform: `perspective(1000px) rotateY(${invitationTilt.x}deg) rotateX(${invitationTilt.y}deg) scale(${isInvitationHovered ? 1.02 : 1})`,
                transformStyle: 'preserve-3d',
              }}
              title="Click to view full screen"
            >
              {/* Corner Ornaments */}
              <CornerOrnament position="top-left" className="absolute top-2 left-2 w-6 h-6 opacity-75 pointer-events-none" />
              <CornerOrnament position="top-right" className="absolute top-2 right-2 w-6 h-6 opacity-75 pointer-events-none" />
              <CornerOrnament position="bottom-left" className="absolute bottom-2 left-2 w-6 h-6 opacity-75 pointer-events-none" />
              <CornerOrnament position="bottom-right" className="absolute bottom-2 right-2 w-6 h-6 opacity-75 pointer-events-none" />

              {/* Rendered PDF Page Image */}
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-inner border border-[#E5D8C4] bg-white aspect-[894/1258]">
                <img
                  src={INVITATION_PAGES[invitationPageIndex].image}
                  alt={`Wedding Invitation - ${INVITATION_PAGES[invitationPageIndex].title}`}
                  className="w-full h-full object-contain pointer-events-none"
                />

                {/* Specular golden light sheen tracking mouse */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-35 transition-opacity group-hover:opacity-55"
                  style={{
                    background: `radial-gradient(circle 240px at ${50 + invitationTilt.x * 3}% ${50 - invitationTilt.y * 3}%, rgba(255,245,215,0.7) 0%, transparent 80%)`,
                  }}
                />

              </div>

              {/* Prev / Next Page Chevrons on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setInvitationPageIndex((prev) => (prev > 0 ? prev - 1 : INVITATION_PAGES.length - 1));
                }}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#FFFDF9]/95 border border-[#C49A58] text-[#98502F] flex items-center justify-center opacity-80 hover:opacity-100 shadow-md cursor-pointer transition-all"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setInvitationPageIndex((prev) => (prev < INVITATION_PAGES.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#FFFDF9]/95 border border-[#C49A58] text-[#98502F] flex items-center justify-center opacity-80 hover:opacity-100 shadow-md cursor-pointer transition-all"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-2.5 sm:mt-3">
<a
                href="/assets/invitation/wedding_invitation.pdf"
                download="C-Vignesh-and-S-Pavithra-Wedding-Invitation.pdf"
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#FFFDF9] hover:bg-[#FAF5EC] border border-[#C49A58] text-[#45352A] rounded-full text-xs font-serif-royal font-bold shadow-xs cursor-pointer transition-all active:scale-98"
              >
                <Download className="w-3.5 h-3.5 text-[#98502F]" />
                <span>Download PDF</span>
              </a>

              <button
                onClick={handleShareWhatsApp}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full text-xs font-serif-royal font-bold shadow-xs cursor-pointer transition-all active:scale-98"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════ */}
        {/* ── SCENE 6: POST YOUR BLESSINGS (Blessings Cards Showcase) ── */}
        {/* ══════════════════════════════════════════════════════════════════════ */}
        <div
          className="absolute inset-0 z-15 flex flex-col items-center justify-center px-3 sm:px-6 transition-all duration-300"
          style={{
            opacity: treeOpacity,
            transform: treeOpacity > 0 ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(30px)',
            pointerEvents: treeOpacity > 0.5 ? 'auto' : 'none',
          }}
        >
          {/* White Jasmine & Plumeria Blossom Clusters at base of BOTH temples */}
          <div className="absolute bottom-2 left-2 sm:left-6 z-10 pointer-events-none select-none drop-shadow-md">
            <svg width="135" height="100" viewBox="0 0 135 100" fill="none">
              <path d="M12 90 C 18 70, 38 65, 48 75 C 38 85, 22 95, 12 90 Z" fill="#4B6336" />
              <path d="M42 95 C 48 75, 68 70, 78 80 C 68 90, 52 100, 42 95 Z" fill="#5E7A44" />
              <path d="M28 80 C 38 60, 58 55, 68 65 C 58 75, 38 85, 28 80 Z" fill="#6B8A4E" />
              <g transform="translate(32, 62)">
                {[0, 72, 144, 216, 288].map((rot, i) => (
                  <ellipse key={i} cx="0" cy="-10" rx="4.5" ry="8" fill="#FFFDF9" stroke="#E5D8C4" strokeWidth="0.6" transform={`rotate(${rot})`} />
                ))}
                <circle cx="0" cy="0" r="3" fill="#E6AF2E" />
                <circle cx="0" cy="0" r="1.5" fill="#C49A58" />
              </g>
              <g transform="translate(64, 72)">
                {[0, 72, 144, 216, 288].map((rot, i) => (
                  <ellipse key={i} cx="0" cy="-8" rx="3.5" ry="6.5" fill="#FAF5EC" stroke="#E5D8C4" strokeWidth="0.6" transform={`rotate(${rot})`} />
                ))}
                <circle cx="0" cy="0" r="2.5" fill="#E6AF2E" />
              </g>
              <g transform="translate(20, 84)">
                {[0, 72, 144, 216, 288].map((rot, i) => (
                  <ellipse key={i} cx="0" cy="-7" rx="3" ry="5.5" fill="#FFFDF9" stroke="#E5D8C4" strokeWidth="0.6" transform={`rotate(${rot})`} />
                ))}
                <circle cx="0" cy="0" r="2" fill="#E6AF2E" />
              </g>
            </svg>
          </div>

          <div className="absolute bottom-2 right-2 sm:right-6 z-10 pointer-events-none select-none drop-shadow-md scale-x-[-1]">
            <svg width="135" height="100" viewBox="0 0 135 100" fill="none">
              <path d="M12 90 C 18 70, 38 65, 48 75 C 38 85, 22 95, 12 90 Z" fill="#4B6336" />
              <path d="M42 95 C 48 75, 68 70, 78 80 C 68 90, 52 100, 42 95 Z" fill="#5E7A44" />
              <path d="M28 80 C 38 60, 58 55, 68 65 C 58 75, 38 85, 28 80 Z" fill="#6B8A4E" />
              <g transform="translate(32, 62)">
                {[0, 72, 144, 216, 288].map((rot, i) => (
                  <ellipse key={i} cx="0" cy="-10" rx="4.5" ry="8" fill="#FFFDF9" stroke="#E5D8C4" strokeWidth="0.6" transform={`rotate(${rot})`} />
                ))}
                <circle cx="0" cy="0" r="3" fill="#E6AF2E" />
                <circle cx="0" cy="0" r="1.5" fill="#C49A58" />
              </g>
              <g transform="translate(64, 72)">
                {[0, 72, 144, 216, 288].map((rot, i) => (
                  <ellipse key={i} cx="0" cy="-8" rx="3.5" ry="6.5" fill="#FAF5EC" stroke="#E5D8C4" strokeWidth="0.6" transform={`rotate(${rot})`} />
                ))}
                <circle cx="0" cy="0" r="2.5" fill="#E6AF2E" />
              </g>
              <g transform="translate(20, 84)">
                {[0, 72, 144, 216, 288].map((rot, i) => (
                  <ellipse key={i} cx="0" cy="-7" rx="3" ry="5.5" fill="#FFFDF9" stroke="#E5D8C4" strokeWidth="0.6" transform={`rotate(${rot})`} />
                ))}
                <circle cx="0" cy="0" r="2" fill="#E6AF2E" />
              </g>
            </svg>
          </div>

          <div className="max-w-5xl w-full mx-auto max-h-[88vh] overflow-y-auto px-2 py-1 flex flex-col items-center">
            {/* Header */}
            <div className="text-center mb-2 sm:mb-3">
              <div className="flex justify-center mb-0.5 sm:mb-1">
                <svg width="24" height="14" viewBox="0 0 24 14" fill="none" className="text-[#C49A58]">
                  <path d="M12 1 C10 5 7 7 2 8 C7 9 10 11 12 14 C14 11 17 9 22 8 C17 7 14 5 12 1 Z" fill="#C49A58" opacity="0.9" />
                  <circle cx="12" cy="7.5" r="1.5" fill="#98502F" />
                </svg>
              </div>
              <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-[#FFFDF9]/95 border border-[#C49A58]/70 px-3.5 py-0.5 rounded-full shadow-2xs mb-1">
                <span className="text-[10px] sm:text-xs text-[#C49A58]">✦</span>
                <span className="text-[9px] sm:text-[10px] font-serif-royal font-bold uppercase tracking-widest text-[#98502F]">
                  Sacred Wedding Blessings
                </span>
                <span className="text-[10px] sm:text-xs text-[#C49A58]">✦</span>
              </div>
              <h2 className="font-serif-royal text-xl sm:text-3xl lg:text-4xl font-bold text-[#45352A] mb-0.5 sm:mb-1">
                Post Your Blessings
              </h2>
              <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                <div className="h-[1px] w-6 sm:w-16 bg-gradient-to-r from-transparent to-[#C49A58]/70" />
                <p className="font-cormorant italic text-xs sm:text-sm text-[#766B60]">
                  Leave your heartfelt prayers, wishes and love for Vignesh &amp; Pavithra
                </p>
                <div className="h-[1px] w-6 sm:w-16 bg-gradient-to-l from-transparent to-[#C49A58]/70" />
              </div>
            </div>

            {/* Post Your Blessings Hero Action Card */}
            <div className="bg-[#FFFDF9]/92 border-2 border-[#C49A58] rounded-2xl sm:rounded-[2rem] p-3.5 sm:p-5 shadow-xl backdrop-blur-md max-w-2xl w-full mb-2.5 sm:mb-3.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-center sm:text-left">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 p-1 rounded-2xl bg-[#FAF5EC] border border-[#C49A58]/80 flex items-center justify-center">
                  <img src="/assets/ganesha-authentic.png" alt="Ganesha" className="w-full h-full object-contain" />
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

              <button
                onClick={onPlantBlessingClick}
                className="inline-flex items-center space-x-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-[#D48B28] via-[#B87333] to-[#98502F] hover:brightness-110 active:scale-98 text-white font-serif-royal font-bold text-[11px] sm:text-xs uppercase tracking-wider rounded-full shadow-md cursor-pointer transition-all shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFF1B8]" />
                <span>Post Your Blessings</span>
              </button>
            </div>

            {/* Live Blessing Count */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-3 px-1">
              <span className="text-[10px] sm:text-[11px] font-serif-royal font-semibold text-[#766B60] sm:ml-auto">
                🌸 {blessings.length} Sacred Blessings Received
              </span>
            </div>

            {/* Blessings Cards Showcase Grid */}
            <div className="w-full max-h-[36vh] sm:max-h-[50vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                {blessings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-[#FFFDF9]/92 border border-[#C49A58]/70 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md backdrop-blur-md flex flex-col text-left hover:scale-[1.01] transition-all"
                    >
                      <span className="font-serif-royal font-bold text-[10px] sm:text-[11px] text-[#98502F] mb-2">
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
        </div>

        {/* ══════════════════════════════════════════════════════════════════════ */}
        {/* ── SCENE 7: ROYAL CLOSING FOOTER ── */}
        {/* ══════════════════════════════════════════════════════════════════════ */}
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 pt-12 pb-5 sm:px-8 sm:pt-16 sm:pb-8 transition-all duration-300 pointer-events-none"
          style={{
            opacity: footerOpacity,
            pointerEvents: footerOpacity > 0.5 ? 'auto' : 'none',
          }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse 52% 72% at 50% 48%, rgba(255, 247, 226, 0.9) 0%, rgba(255, 247, 226, 0.72) 58%, rgba(255, 247, 226, 0) 100%)',
          }} />
          <div className="relative z-10 w-full max-w-3xl h-full mx-auto flex flex-col items-center justify-between text-center py-1 sm:py-2">
            <div className="w-full flex flex-col items-center gap-1 sm:gap-2">
              <div className="md:hidden w-12 h-12">
                <img
                  src="/assets/ganesha-authentic.png"
                  alt="Pillayar"
                  className="w-full h-full object-contain drop-shadow-sm"
                />
              </div>
              <div className="hidden md:block w-10 h-10 sm:w-16 sm:h-16">
                <img src="/assets/ganesha-authentic.png" alt="Ganesha" className="w-full h-full object-contain drop-shadow-sm" />
              </div>

              <p className="font-serif-royal text-[9px] sm:text-xs font-semibold tracking-[0.2em] text-[#B87320]">
                ✿ &nbsp; WITH THE BLESSINGS OF OUR ELDERS &nbsp; ✿
              </p>
            </div>

            <div className="w-full flex flex-col items-center gap-1 sm:gap-2">
              <h4 className="max-w-full whitespace-nowrap font-serif-royal text-xl sm:text-2xl font-bold tracking-wide leading-tight text-[#8C321A]">
                C. Vignesh &amp; S. Pavithra
              </h4>

              <div className="flex items-center justify-center gap-2 sm:gap-4 w-full max-w-sm">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C49A58]" />
                <p className="font-serif-royal text-[10px] sm:text-sm font-bold tracking-[0.18em] text-[#7D321B]">
                  14 DECEMBER 2026
                </p>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C49A58]" />
              </div>

              <p className="max-w-xl font-cormorant text-xl italic leading-tight sm:text-3xl md:text-4xl text-[#85321D]">
                A beautiful beginning,
                <br />
                made memorable by you.
              </p>

              <p className="max-w-md font-cormorant text-sm italic leading-snug sm:text-lg text-[#6E5038]">
                Thank you for being part of our special day
                <br className="hidden sm:block" />
                {' '}and blessing our journey ahead.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 sm:pt-2">
                <button
                  onClick={handleShareWhatsApp}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-[#9B401D] to-[#7D2D16] text-white rounded-full text-[10px] sm:text-xs font-serif-royal font-bold shadow-md cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Invitation</span>
                </button>
                <button
                  onClick={() => scrollToAnchor(0)}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#FFF6E5]/90 border border-[#C49A58] text-[#71351F] rounded-full text-[10px] sm:text-xs font-serif-royal font-bold shadow-sm cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#98502F]" />
                  <span>Back to Beginning</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center gap-0.5 leading-tight pb-1 sm:pb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-[#C49A58]">✿</span>
                <p className="font-serif-royal text-[8px] sm:text-[10px] font-semibold tracking-[0.16em] text-[#9A4A20]">
                  A LITTLE ARTISTRY, A LASTING MEMORY
                </p>
                <span className="text-sm text-[#C49A58]">✿</span>
              </div>
              <p className="font-cormorant text-xs sm:text-base italic text-[#76533A]">
                Envisioned with care by
              </p>
              <p className="font-serif-royal text-sm sm:text-lg font-semibold tracking-wide text-[#8C321A]">
                Sridevi ♡
              </p>
            </div>
          </div>
        </div>

      </div>

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
              <p className="text-amber-200/80 font-serif-royal text-xs">
                Page {invitationPageIndex + 1} of {INVITATION_PAGES.length}: {INVITATION_PAGES[invitationPageIndex].title} ({INVITATION_PAGES[invitationPageIndex].subtitle})
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
    </section>
  );
};
