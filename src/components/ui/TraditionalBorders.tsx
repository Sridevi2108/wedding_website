import React from 'react';

export const GoldDivider: React.FC<{ className?: string }> = ({ className = 'my-8' }) => {
  return (
    <div className={`flex items-center justify-center space-x-3 ${className}`}>
      <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-r from-transparent via-[#C49A58] to-[#98502F]" />
      
      {/* Central South Indian Paisley / Lotus Motif */}
      <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#C49A58]">
        <circle cx="16" cy="10" r="3" fill="#98502F" />
        <circle cx="16" cy="10" r="6" stroke="#C49A58" strokeWidth="1" strokeDasharray="2 1" />
        <path d="M7 10 C10 6 13 8 16 10 C13 12 10 14 7 10 Z" fill="#C49A58" opacity="0.8" />
        <path d="M25 10 C22 6 19 8 16 10 C19 12 22 14 25 10 Z" fill="#C49A58" opacity="0.8" />
        <circle cx="3" cy="10" r="1.5" fill="#98502F" />
        <circle cx="29" cy="10" r="1.5" fill="#98502F" />
      </svg>

      <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-l from-transparent via-[#C49A58] to-[#98502F]" />
    </div>
  );
};

export const KolamMandala: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-16 h-16',
  size = 64,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="46" stroke="#E5D8C4" strokeWidth="1.2" />
      <circle cx="50" cy="50" r="38" stroke="#C49A58" strokeWidth="1" strokeDasharray="3 2" />
      <circle cx="50" cy="50" r="10" stroke="#98502F" strokeWidth="1.2" fill="#FAF5EC" />
      
      {/* 8-Petal Kolam Symmetry */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
        <g key={idx} transform={`rotate(${angle} 50 50)`}>
          <path
            d="M50 18 C46 28 46 36 50 40 C54 36 54 28 50 18 Z"
            stroke="#C49A58"
            strokeWidth="1.2"
            fill="#FFFDF9"
          />
          <circle cx="50" cy="14" r="2" fill="#98502F" />
        </g>
      ))}
      <circle cx="50" cy="50" r="3" fill="#98502F" />
    </svg>
  );
};

export const CornerOrnament: React.FC<{
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}> = ({ position = 'top-left', className = 'w-14 h-14' }) => {
  let rotation = '';
  if (position === 'top-right') rotation = 'scale-x-[-1]';
  if (position === 'bottom-left') rotation = 'scale-y-[-1]';
  if (position === 'bottom-right') rotation = 'scale-[-1]';

  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${rotation} pointer-events-none text-[#C49A58]`}
      aria-hidden="true"
    >
      <path d="M4 56 V10 C4 6.68629 6.68629 4 10 4 H56" stroke="#C49A58" strokeWidth="1.5" />
      <path d="M10 50 V16 C10 12.6863 12.6863 10 16 10 H50" stroke="#E5D8C4" strokeWidth="1" />
      
      {/* Paisley flourish inside corner */}
      <path
        d="M16 16 C24 16 28 20 28 28 C28 34 22 36 18 32 C15 29 16 24 20 24 C24 24 24 20 20 20 C18 20 16 22 16 26"
        stroke="#98502F"
        strokeWidth="1.2"
        fill="none"
      />
      <circle cx="8" cy="8" r="2.5" fill="#98502F" />
      <circle cx="16" cy="16" r="1.5" fill="#C49A58" />
    </svg>
  );
};

export const JasmineGarlandHeader: React.FC<{ className?: string }> = ({ className = 'w-full' }) => {
  return (
    <div className={`overflow-hidden h-7 flex items-center justify-center opacity-85 select-none ${className}`}>
      <svg
        viewBox="0 0 1200 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full min-w-[800px]"
      >
        <path d="M0 12 Q 300 18 600 12 Q 900 6 1200 12" stroke="#98502F" strokeWidth="0.8" opacity="0.4" />
        
        {Array.from({ length: 48 }).map((_, i) => {
          const x = i * 25 + 12;
          const y = 12 + Math.sin(i * 0.45) * 3;
          const isMarigold = i % 5 === 0;
          return (
            <g key={i} transform={`translate(${x}, ${y})`}>
              {isMarigold ? (
                // Orange marigold flower (Chendumalli)
                <g>
                  <circle cx="0" cy="0" r="4.5" fill="#C49A58" stroke="#98502F" strokeWidth="0.7" />
                  <circle cx="0" cy="0" r="2" fill="#98502F" />
                </g>
              ) : (
                // White jasmine bud (Madurai Gundu Malli)
                <g>
                  <ellipse cx="-1.5" cy="0" rx="2.5" ry="3.5" fill="#FFFDF9" stroke="#E5D8C4" strokeWidth="0.6" transform="rotate(-15)" />
                  <ellipse cx="1.5" cy="0" rx="2.5" ry="3.5" fill="#FAF5EC" stroke="#E5D8C4" strokeWidth="0.6" transform="rotate(15)" />
                  <circle cx="0" cy="2.5" r="1" fill="#7A8B63" opacity="0.8" />
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

{/* ── Twin Royal Elephants with Sacred Lotus Motif (Gaja Lakshmi Tradition - Sketch Picture 3) ── */}
export const TwinElephantsLotusMotif: React.FC<{ className?: string }> = ({ className = 'w-full max-w-sm mx-auto' }) => {
  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 320 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto text-[#C49A58]"
      >
        {/* Left Royal Elephant facing right with trunk raised */}
        <g transform="translate(40, 10)">
          {/* Caparison & Body */}
          <path
            d="M 55 55 C 55 58 50 60 45 60 C 40 60 40 50 40 45 C 38 48 35 60 30 60 C 25 60 25 45 25 40 C 20 40 10 38 8 28 C 6 18 18 12 28 10 C 38 8 48 12 52 18 C 55 15 62 10 70 12 C 78 14 80 22 75 30 C 72 34 68 36 68 42 C 68 46 72 45 76 38 C 78 34 82 25 80 20 C 79 17 84 15 86 18 C 88 22 84 32 80 40 C 76 48 68 54 62 55 Z"
            fill="#FFFDF9"
            stroke="#98502F"
            strokeWidth="1.8"
          />
          {/* Royal Howdah / Blanket */}
          <path
            d="M 28 18 C 34 16 44 16 50 20 C 48 28 46 36 44 42 C 38 42 32 40 28 36 Z"
            fill="#98502F"
            opacity="0.85"
          />
          <path d="M 30 22 L 48 24 M 32 30 L 46 32 M 34 38 L 44 38" stroke="#FFF1B8" strokeWidth="1" />
          {/* Ear */}
          <path
            d="M 52 18 C 48 22 46 30 52 34 C 56 32 58 24 55 19 Z"
            fill="#FAF5EC"
            stroke="#98502F"
            strokeWidth="1.2"
          />
          {/* Eye */}
          <circle cx="62" cy="20" r="1.5" fill="#98502F" />
          {/* Tusk */}
          <path d="M 66 32 C 72 32 76 28 78 24" stroke="#C49A58" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Center Sacred Kalasam & Blooming Lotus */}
        <g transform="translate(160, 42)">
          {/* Kalasam base */}
          <path
            d="M -12 18 C -16 10 -14 0 0 -4 C 14 0 16 10 12 18 Z"
            fill="#FFFDF9"
            stroke="#C49A58"
            strokeWidth="1.8"
          />
          <ellipse cx="0" cy="18" rx="10" ry="2.5" fill="#98502F" />
          <path d="M -8 10 Q 0 14 8 10" stroke="#C49A58" strokeWidth="1" />
          {/* Mango Leaves on Kalasam */}
          <path d="M -8 -2 C -14 -10 -8 -16 0 -18 C 8 -16 14 -10 8 -2 Z" fill="#7A8B63" opacity="0.8" />
          {/* Coconut on Kalasam */}
          <circle cx="0" cy="-14" r="5" fill="#98502F" />
          <circle cx="0" cy="-14" r="2" fill="#FFF1B8" />

          {/* Golden Lotus Petals Blooming */}
          <path
            d="M 0 -22 C -6 -28 -14 -26 -16 -18 C -14 -10 -6 -6 0 -8 C 6 -6 14 -10 16 -18 C 14 -26 6 -28 0 -22 Z"
            fill="#FAF5EC"
            stroke="#C49A58"
            strokeWidth="1.2"
          />
          <path d="M 0 -24 C -4 -32 4 -32 0 -24 Z" fill="#98502F" />
        </g>

        {/* Right Royal Elephant facing left with trunk raised */}
        <g transform="translate(280, 10) scale(-1, 1)">
          {/* Body */}
          <path
            d="M 55 55 C 55 58 50 60 45 60 C 40 60 40 50 40 45 C 38 48 35 60 30 60 C 25 60 25 45 25 40 C 20 40 10 38 8 28 C 6 18 18 12 28 10 C 38 8 48 12 52 18 C 55 15 62 10 70 12 C 78 14 80 22 75 30 C 72 34 68 36 68 42 C 68 46 72 45 76 38 C 78 34 82 25 80 20 C 79 17 84 15 86 18 C 88 22 84 32 80 40 C 76 48 68 54 62 55 Z"
            fill="#FFFDF9"
            stroke="#98502F"
            strokeWidth="1.8"
          />
          {/* Blanket */}
          <path
            d="M 28 18 C 34 16 44 16 50 20 C 48 28 46 36 44 42 C 38 42 32 40 28 36 Z"
            fill="#98502F"
            opacity="0.85"
          />
          <path d="M 30 22 L 48 24 M 32 30 L 46 32 M 34 38 L 44 38" stroke="#FFF1B8" strokeWidth="1" />
          {/* Ear */}
          <path
            d="M 52 18 C 48 22 46 30 52 34 C 56 32 58 24 55 19 Z"
            fill="#FAF5EC"
            stroke="#98502F"
            strokeWidth="1.2"
          />
          {/* Eye */}
          <circle cx="62" cy="20" r="1.5" fill="#98502F" />
          {/* Tusk */}
          <path d="M 66 32 C 72 32 76 28 78 24" stroke="#C49A58" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

{/* ── South Indian Wedding Mandapam Arch with Banana Trees & Mango Thoranam (Sketch Picture 2) ── */}
export const MandapamEntranceArch: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      {/* ── Traditional South Indian Roof Canopy with Mango Leaves & Jasmine Garlands ── */}
      <div className="relative w-full overflow-hidden select-none mb-6">
        <svg
          viewBox="0 0 1000 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto text-[#98502F]"
        >
          {/* Mandapam Sloped Temple Roof Arch */}
          <path
            d="M 40 85 L 500 15 L 960 85"
            stroke="#C49A58"
            strokeWidth="4"
            fill="none"
          />
          <path
            d="M 45 92 L 500 24 L 955 92"
            stroke="#98502F"
            strokeWidth="2"
            strokeDasharray="6 3"
            fill="none"
          />

          {/* Roof Crest Ornament at Peak */}
          <g transform="translate(500, 15)">
            <circle cx="0" cy="-6" r="6" fill="#C49A58" stroke="#98502F" strokeWidth="1.5" />
            <path d="M -4 -6 L 0 -14 L 4 -6 Z" fill="#98502F" />
            <circle cx="0" cy="-14" r="2.5" fill="#FFF1B8" />
          </g>

          {/* Hanging Traditional Maavilai (Mango Leaves) Thoranam */}
          {Array.from({ length: 32 }).map((_, idx) => {
            const ratio = idx / 31;
            const x = 50 + ratio * 900;
            // Roof y curve: peaks at 500
            const y = ratio <= 0.5 ? 85 - (ratio / 0.5) * 70 : 15 + ((ratio - 0.5) / 0.5) * 70;
            const isMarigold = idx % 4 === 0;

            return (
              <g key={idx} transform={`translate(${x}, ${y + 6})`}>
                {/* Mango leaf pointing downward */}
                <path
                  d="M 0 0 C -4 10 -5 18 0 25 C 5 18 4 10 0 0 Z"
                  fill={idx % 2 === 0 ? '#4A6B35' : '#5E8544'}
                  stroke="#385226"
                  strokeWidth="0.8"
                />
                {isMarigold && (
                  <circle cx="0" cy="27" r="3.5" fill="#D97706" stroke="#92400E" strokeWidth="0.6" />
                )}
              </g>
            );
          })}

          {/* Scalloped Festoon Frills below roof */}
          {Array.from({ length: 12 }).map((_, idx) => {
            const startX = 60 + idx * 75;
            const endX = startX + 75;
            const startY =
              idx < 6
                ? 85 - ((idx * 75) / 450) * 65
                : 20 + (((idx - 6) * 75) / 450) * 65;
            const endY =
              idx < 5
                ? 85 - (((idx + 1) * 75) / 450) * 65
                : idx === 5
                ? 20
                : 20 + (((idx - 5) * 75) / 450) * 65;
            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2 + 12;

            return (
              <path
                key={idx}
                d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`}
                stroke="#C49A58"
                strokeWidth="1.5"
                fill="none"
              />
            );
          })}
        </svg>
      </div>

      {/* ── Left & Right Sacred Banana Trees (Vazhai Maram) ── */}
      <div className="hidden lg:block absolute -left-8 top-16 bottom-8 w-20 pointer-events-none select-none z-10">
        <svg viewBox="0 0 100 450" fill="none" className="w-full h-full text-[#4A6B35]">
          {/* Banana Tree Trunk */}
          <path d="M 45 440 L 48 120 C 48 100 52 100 52 120 L 55 440 Z" fill="#6B5336" stroke="#4A3B27" strokeWidth="1.5" />
          {/* Banana Bunch (Vazhaikkai) */}
          <g transform="translate(48, 140)">
            <ellipse cx="0" cy="8" rx="8" ry="12" fill="#5B7A3C" stroke="#3D5326" strokeWidth="1" />
            <circle cx="2" cy="18" r="4" fill="#98502F" />
          </g>
          {/* Big Banana Leaves Fan Out */}
          <path d="M 50 120 C 30 70 -5 80 -15 130 C -5 135 25 110 50 120 Z" fill="#5E8544" stroke="#385226" strokeWidth="1.5" />
          <path d="M 50 115 C 60 50 95 60 110 110 C 95 120 70 105 50 115 Z" fill="#4A6B35" stroke="#385226" strokeWidth="1.5" />
          <path d="M 50 125 C 20 120 -10 160 0 210 C 15 190 35 150 50 125 Z" fill="#6B964E" stroke="#385226" strokeWidth="1.5" />
          <path d="M 50 130 C 80 130 110 170 95 220 C 80 195 65 160 50 130 Z" fill="#5B7A3C" stroke="#385226" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="hidden lg:block absolute -right-8 top-16 bottom-8 w-20 pointer-events-none select-none z-10 scale-x-[-1]">
        <svg viewBox="0 0 100 450" fill="none" className="w-full h-full text-[#4A6B35]">
          <path d="M 45 440 L 48 120 C 48 100 52 100 52 120 L 55 440 Z" fill="#6B5336" stroke="#4A3B27" strokeWidth="1.5" />
          <g transform="translate(48, 140)">
            <ellipse cx="0" cy="8" rx="8" ry="12" fill="#5B7A3C" stroke="#3D5326" strokeWidth="1" />
            <circle cx="2" cy="18" r="4" fill="#98502F" />
          </g>
          <path d="M 50 120 C 30 70 -5 80 -15 130 C -5 135 25 110 50 120 Z" fill="#5E8544" stroke="#385226" strokeWidth="1.5" />
          <path d="M 50 115 C 60 50 95 60 110 110 C 95 120 70 105 50 115 Z" fill="#4A6B35" stroke="#385226" strokeWidth="1.5" />
          <path d="M 50 125 C 20 120 -10 160 0 210 C 15 190 35 150 50 125 Z" fill="#6B964E" stroke="#385226" strokeWidth="1.5" />
          <path d="M 50 130 C 80 130 110 170 95 220 C 80 195 65 160 50 130 Z" fill="#5B7A3C" stroke="#385226" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Children inside Mandapam */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
