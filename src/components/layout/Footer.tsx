import React from 'react';
import { Share2, ChevronUp } from 'lucide-react';
import { GoldDivider } from '../ui/TraditionalBorders';

interface FooterProps {
  onNavClick?: (sectionId: string) => void;
  onAdminClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavClick = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }),
  onAdminClick,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = () => {
    const text = `🌸 *Wedding of C. Vignesh & S. Pavithra* - 14 December 2026\n\n${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: 'C. Vignesh & S. Pavithra Wedding',
        text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <footer className="relative bg-[#FAF5EC] border-t-2 border-[#E5D8C4] pt-14 pb-10 px-4 sm:px-8 text-center text-[#45352A] overflow-hidden select-none">
      {/* ── Left & Right Temple Pillars Framing the Footer (Sketch Picture 3) ── */}
      <div className="absolute bottom-0 left-0 w-24 sm:w-40 pointer-events-none opacity-20 sm:opacity-25 z-0 overflow-hidden mix-blend-multiply">
        <img
          src="/assets/temple_hd_left.png"
          alt="Temple Pillar Left"
          className="h-full w-full object-cover object-bottom"
        />
      </div>
      <div className="absolute bottom-0 right-0 w-24 sm:w-40 pointer-events-none opacity-20 sm:opacity-25 z-0 overflow-hidden mix-blend-multiply">
        <img
          src="/assets/temple_hd_right.png"
          alt="Temple Pillar Right"
          className="h-full w-full object-cover object-bottom"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        {/* Divine Ganesha Emblem */}
        <div className="flex justify-center">
          <img
            src="/assets/ganesha-authentic.png"
            alt="Lord Ganesha"
            className="w-12 h-12 object-contain opacity-95 drop-shadow-xs"
          />
        </div>

        {/* Closing Note (Sketch Picture 3 bottom: Vignesh & Pavithra) */}
        <div>
          <p className="font-cormorant italic text-base text-[#766B60]">
            With the Blessings of the Almighty and our beloved families
          </p>
          <h4 className="font-serif-royal text-2xl sm:text-4xl font-bold tracking-wide text-[#98502F] mt-1.5 mb-1">
            C. Vignesh <span className="font-cormorant italic text-xl sm:text-2xl text-[#C49A58]">&amp;</span> S. Pavithra
          </h4>
          <GoldDivider className="my-3" />
          <p className="font-cormorant text-xs sm:text-sm text-[#6E6053]">
            Thank you for being an eternal part of our auspicious beginning.
          </p>
        </div>

        {/* Links row matching navigation */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-serif-royal text-[#766B60] pt-2">
          <span className="font-bold text-[#45352A]">14 December 2026</span>
          <span>|</span>
          <button onClick={() => onNavClick('home')} className="hover:text-[#98502F] cursor-pointer">Home</button>
          <button onClick={() => onNavClick('events')} className="hover:text-[#98502F] cursor-pointer">Events Timeline</button>
          <button onClick={() => onNavClick('venue')} className="hover:text-[#98502F] cursor-pointer">Wedding Venues</button>
          <button onClick={() => onNavClick('invitation')} className="hover:text-[#98502F] cursor-pointer">Digital Invitation</button>
          <button onClick={() => onNavClick('blessing-tree')} className="hover:text-[#98502F] cursor-pointer">Blessings Tree</button>
        </div>

        {/* Share Button & Back to Top row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E8DEC9]/70 text-xs">
          <p className="text-[11px] font-cormorant italic text-[#98502F]">
            May divine grace, laughter, and eternal love fill your lives.
          </p>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#FFFDF9] hover:bg-[#FAF5EC] border-2 border-[#C49A58] rounded-full text-xs font-serif-royal font-bold text-[#45352A] shadow-xs cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#98502F]" />
              <span>Share Wedding Invitation</span>
            </button>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center space-x-1 px-3.5 py-2 bg-[#FFFDF9] hover:bg-[#FAF5EC] border border-[#E5D8C4] rounded-full text-xs font-serif-royal text-[#766B60] hover:text-[#45352A] cursor-pointer"
            >
              <ChevronUp className="w-3.5 h-3.5 text-[#C49A58]" />
              <span>Back to Top</span>
            </button>

            {onAdminClick && (
              <button
                onClick={onAdminClick}
                className="text-[11px] text-[#A29688] hover:text-[#98502F] p-1 cursor-pointer"
                title="Admin Moderation"
              >
                🔒
              </button>
            )}
          </div>
        </div>

        {/* Copyright */}
        <p className="text-[10px] font-serif-royal text-[#9E9182] pt-2">
          © 2026 Vignesh &amp; Pavithra. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
