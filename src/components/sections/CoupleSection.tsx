import React, { useState } from 'react';
import { ArrowRight, MapPin, Calendar, Heart, X } from 'lucide-react';

interface CoupleSectionProps {
  onReadStoryClick?: () => void;
  onViewEventsClick?: () => void;
  onViewVenuesClick?: () => void;
  onViewInvitationClick?: () => void;
  onExploreTreeClick?: () => void;
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({
  onReadStoryClick,
  onViewEventsClick = () => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' }),
  onViewVenuesClick = () => document.getElementById('venue')?.scrollIntoView({ behavior: 'smooth' }),
  onViewInvitationClick = () => document.getElementById('invitation')?.scrollIntoView({ behavior: 'smooth' }),
  onExploreTreeClick = () => document.getElementById('blessing-tree')?.scrollIntoView({ behavior: 'smooth' }),
}) => {
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  const handleReadStory = () => {
    if (onReadStoryClick) {
      onReadStoryClick();
    } else {
      setIsStoryOpen(true);
    }
  };

  return (
    <section className="relative w-full bg-[#FAF5EC] py-16 px-4 sm:px-6 lg:px-8 border-t border-[#E8DEC9]">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-4">
          <span className="text-xs font-serif-royal font-semibold uppercase tracking-widest text-[#98502F]">
            Royal Celebrations
          </span>
          <h2 className="font-serif-royal text-3xl sm:text-4xl font-bold text-[#45352A] mt-1">
            Our Wedding Celebrations
          </h2>
          <div className="w-16 h-[1px] bg-[#C49A58] mx-auto mt-2" />
        </div>

        {/* ── Love Story Modal ── */}
        {isStoryOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#45352A]/80 backdrop-blur-sm animate-fadeIn"
            onClick={() => setIsStoryOpen(false)}
          >
            <div
              className="relative bg-[#FFFDF9] border-2 border-[#C49A58] rounded-3xl p-8 sm:p-12 max-w-xl w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsStoryOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-[#766B60] hover:text-[#98502F] rounded-full hover:bg-[#FAF5EC] cursor-pointer"
                aria-label="Close story"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-center mb-6">
                <Heart className="w-8 h-8 text-[#98502F] fill-[#98502F]/30 mx-auto mb-2" />
                <h3 className="font-serif-royal text-2xl font-bold text-[#45352A]">Their Love Story</h3>
                <div className="w-12 h-[1px] bg-[#C49A58] mx-auto mt-2" />
              </div>
              <div className="space-y-4 font-cormorant text-base text-[#6E6053] leading-relaxed">
                <p>
                  Vignesh and Pavithra&apos;s story began with a chance meeting that felt nothing short of destiny. Two kind souls drawn together by shared values, laughter, and a love for family.
                </p>
                <p>
                  What started as quiet conversations grew into a bond built on trust, understanding, and deep respect. Through every season, they stood by each other — growing together, dreaming together.
                </p>
                <p className="font-semibold text-[#98502F] italic text-lg">
                  &ldquo;And now, they invite you to witness the most beautiful chapter of their journey — a Royal South Indian Wedding.&rdquo;
                </p>
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => {
                    setIsStoryOpen(false);
                    onViewEventsClick();
                  }}
                  className="inline-flex items-center space-x-1.5 px-5 py-2 bg-[#98502F] hover:bg-[#7d3f23] text-white rounded-full text-xs font-serif-royal font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <span>View Wedding Events</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Summary Cards Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {/* Left Card: The Couple bio & Story */}
          <div className="bg-[#FFFDF9] border border-[#E8DEC9] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="flex-1 text-left">
                <h3 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#45352A]">
                  The Couple
                </h3>
                <p className="font-cormorant italic text-base text-[#7A3E1D] mt-0.5 mb-4">
                  Two souls, one journey
                </p>

                <p className="text-xs sm:text-sm text-[#6E6053] leading-relaxed mb-6">
                  Vignesh and Pavithra&apos;s journey is a beautiful blend of love, trust and togetherness. From kindred conversations to shared dreams, they continue to build a life filled with happiness and hope.
                </p>

                <button
                  onClick={handleReadStory}
                  className="inline-flex items-center space-x-1.5 px-5 py-2 bg-[#FFFDF9] hover:bg-[#F4ECE0] border border-[#C49A58] text-[#45352A] rounded-full text-xs font-serif-royal font-semibold transition-all cursor-pointer"
                >
                  <span>Read Their Story</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#7A3E1D]" />
                </button>
              </div>

              {/* Portrait side: Pavithra photo */}
              <div className="w-36 sm:w-44 shrink-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute -inset-1.5 rounded-2xl border-2 border-[#C49A58]/60 pointer-events-none z-10" />
                  <img
                    src="/assets/couple/pavithra.jpg"
                    alt="S. Pavithra"
                    className="w-full rounded-2xl drop-shadow-md object-cover"
                    style={{ aspectRatio: '3/4', objectPosition: 'center top' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: Events Timeline */}
          <div className="bg-[#FFFDF9] border border-[#E8DEC9] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#45352A]">
                Events Timeline
              </h3>
              <p className="font-cormorant italic text-base text-[#7A3E1D] mt-0.5 mb-6">
                Three beautiful celebrations
              </p>

              <div className="space-y-5 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-[1px] before:bg-[#E8DEC9]">
                {/* Event 1: Engagement */}
                <div className="relative flex items-start space-x-4 pl-1">
                  <div className="w-7 h-7 rounded-full bg-[#FAF5EC] border-2 border-[#C49A58] flex items-center justify-center text-[#7A3E1D] shrink-0 z-10 shadow-2xs">
                    <span className="text-xs">💍</span>
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="font-serif-royal text-sm font-bold text-[#45352A]">
                      Engagement
                    </h4>
                    <p className="text-[11px] text-[#766B60]">
                      Sunday, 13 December 2026 • 6:00 PM onwards
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-medium bg-[#F5EDE1] text-[#7A3E1D] px-2 py-0.5 rounded-md">
                      Venue details to be announced
                    </span>
                  </div>
                </div>

                {/* Event 2: Muhurtham */}
                <div className="relative flex items-start space-x-4 pl-1">
                  <div className="w-7 h-7 rounded-full bg-[#FAF5EC] border-2 border-[#C49A58] flex items-center justify-center text-[#7A3E1D] shrink-0 z-10 shadow-2xs">
                    <span className="text-xs">🛕</span>
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="font-serif-royal text-sm font-bold text-[#45352A]">
                      Muhurtham
                    </h4>
                    <p className="text-[11px] text-[#766B60]">
                      Monday, 14 December 2026 • 6:15 AM – 7:15 AM
                    </p>
                    <p className="text-[11px] text-[#45352A] font-medium mt-0.5">
                      Sri Srinivasa Perumal Kalyana Mandapam, Ooty
                    </p>
                  </div>
                </div>

                {/* Event 3: Reception */}
                <div className="relative flex items-start space-x-4 pl-1">
                  <div className="w-7 h-7 rounded-full bg-[#FAF5EC] border-2 border-[#C49A58] flex items-center justify-center text-[#7A3E1D] shrink-0 z-10 shadow-2xs">
                    <span className="text-xs">🏛️</span>
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="font-serif-royal text-sm font-bold text-[#45352A]">
                      Reception
                    </h4>
                    <p className="text-[11px] text-[#766B60]">
                      Tuesday, 15 December 2026 • 6:00 PM onwards
                    </p>
                    <p className="text-[11px] text-[#45352A] font-medium mt-0.5">
                      GT Palace Thirumana Mandapam, Madurai
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E8DEC9] flex justify-end">
              <button
                onClick={onViewEventsClick}
                className="inline-flex items-center space-x-1.5 text-xs font-serif-royal font-semibold text-[#7A3E1D] hover:text-[#98502F] transition-colors cursor-pointer"
              >
                <span>Full Event Details &amp; Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Lower 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Venue */}
          <div className="bg-[#FFFDF9] border border-[#E8DEC9] rounded-2xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-full h-24 rounded-xl overflow-hidden mb-3 border border-[#E8DEC9]">
                <img
                  src="/assets/generated/thumb_venue.png"
                  alt="Venue thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center space-x-1.5 mb-1 text-[#45352A]">
                <MapPin className="w-4 h-4 text-[#7A3E1D]" />
                <h4 className="font-serif-royal text-sm font-bold">Venue</h4>
              </div>
              <p className="text-xs text-[#6E6053] leading-relaxed mb-4">
                Explore the wedding venues and directions to help you plan your visit.
              </p>
            </div>
            <button
              onClick={onViewVenuesClick}
              className="inline-flex items-center justify-center space-x-1 w-full py-1.5 bg-[#FFFDF9] hover:bg-[#FAF5EC] border border-[#C49A58] text-[#45352A] rounded-full text-xs font-serif-royal font-semibold transition-all cursor-pointer"
            >
              <span>View Venues</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#7A3E1D]" />
            </button>
          </div>

          {/* Card 2: Invitation */}
          <div className="bg-[#FFFDF9] border border-[#E8DEC9] rounded-2xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-full h-24 rounded-xl overflow-hidden mb-3 border border-[#E8DEC9]">
                <img
                  src="/assets/generated/thumb_invitation.png"
                  alt="Invitation thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center space-x-1.5 mb-1 text-[#45352A]">
                <Calendar className="w-4 h-4 text-[#7A3E1D]" />
                <h4 className="font-serif-royal text-sm font-bold">Invitation</h4>
              </div>
              <p className="text-xs text-[#6E6053] leading-relaxed mb-4">
                View and share the digital invitation with your loved ones.
              </p>
            </div>
            <button
              onClick={onViewInvitationClick}
              className="inline-flex items-center justify-center space-x-1 w-full py-1.5 bg-[#FFFDF9] hover:bg-[#FAF5EC] border border-[#C49A58] text-[#45352A] rounded-full text-xs font-serif-royal font-semibold transition-all cursor-pointer"
            >
              <span>View Invitation</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#7A3E1D]" />
            </button>
          </div>

          {/* Card 3: Blessings Tree */}
          <div className="bg-[#FFFDF9] border border-[#E8DEC9] rounded-2xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-full h-24 rounded-xl overflow-hidden mb-3 border border-[#E8DEC9]">
                <img
                  src="/assets/generated/thumb_tree.png"
                  alt="Blessings Tree thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center space-x-1.5 mb-1 text-[#45352A]">
                <span className="text-sm">🍂</span>
                <h4 className="font-serif-royal text-sm font-bold">Blessings Tree</h4>
              </div>
              <p className="text-xs text-[#6E6053] leading-relaxed mb-4">
                Share your wishes and be a part of our journey.
              </p>
            </div>
            <button
              onClick={onExploreTreeClick}
              className="inline-flex items-center justify-center space-x-1 w-full py-1.5 bg-[#FFFDF9] hover:bg-[#FAF5EC] border border-[#C49A58] text-[#45352A] rounded-full text-xs font-serif-royal font-semibold transition-all cursor-pointer"
            >
              <span>Explore Tree</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#7A3E1D]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
