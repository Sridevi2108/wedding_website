import React from 'react';

interface VilakkuProps {
  className?: string;
  size?: number;
}

export const KuthuVilakku: React.FC<VilakkuProps> = ({
  className = 'w-16 h-36',
  size = 140,
}) => {
  return (
    <svg
      viewBox="0 0 80 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ height: size, width: (size * 80) / 180 }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF1B8" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#C49A58" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#98502F" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Annapakshi / Swan Top Finial */}
      <path
        d="M40 8 C43 8 46 11 44 15 C42 18 45 22 47 22 C49 22 50 19 50 16 C53 20 50 25 46 27 C44 28 41 27 40 29 C39 27 36 28 34 27 C30 25 27 20 30 16 C30 19 31 22 33 22 C35 22 38 18 36 15 C34 11 37 8 40 8 Z"
        fill="#C49A58"
        stroke="#98502F"
        strokeWidth="1"
      />

      {/* Flame top glow */}
      <circle cx="40" cy="30" r="12" fill="url(#flameGlow)" />
      {/* Central Flame */}
      <path
        d="M40 20 C42 25 44 29 42 33 C41 35 39 35 38 33 C36 29 38 25 40 20 Z"
        fill="#FFDF85"
        stroke="#C49A58"
        strokeWidth="0.8"
      />

      {/* Upper Oil Basin (Thattu) */}
      <ellipse cx="40" cy="36" rx="14" ry="4" fill="#FAF5EC" stroke="#C49A58" strokeWidth="1.2" />
      <path d="M26 36 C26 42 54 42 54 36" stroke="#98502F" strokeWidth="1" fill="#FFFDF9" />

      {/* 5 Wick Flames Glow */}
      <circle cx="28" cy="34" r="3" fill="#FFDF85" opacity="0.8" />
      <circle cx="34" cy="36" r="3" fill="#FFDF85" opacity="0.8" />
      <circle cx="40" cy="37" r="3.5" fill="#FFDF85" opacity="0.9" />
      <circle cx="46" cy="36" r="3" fill="#FFDF85" opacity="0.8" />
      <circle cx="52" cy="34" r="3" fill="#FFDF85" opacity="0.8" />

      {/* Stem Tier 1 */}
      <rect x="37" y="42" width="6" height="24" rx="2" fill="#FAF5EC" stroke="#C49A58" strokeWidth="1" />
      <ellipse cx="40" cy="54" rx="8" ry="3" fill="#FFFDF9" stroke="#98502F" strokeWidth="1" />

      {/* Middle Beaded Ring (Rudraksham / Kalasam Ring) */}
      <ellipse cx="40" cy="68" rx="12" ry="4" fill="#FAF5EC" stroke="#C49A58" strokeWidth="1.2" />

      {/* Stem Tier 2 (Slender neck) */}
      <path d="M36 72 L35 110 H45 L44 72 Z" fill="#FAF5EC" stroke="#C49A58" strokeWidth="1" />
      <ellipse cx="40" cy="90" rx="9" ry="3.5" fill="#FFFDF9" stroke="#98502F" strokeWidth="0.8" />
      <ellipse cx="40" cy="112" rx="15" ry="5" fill="#FAF5EC" stroke="#C49A58" strokeWidth="1.2" />

      {/* Stem Tier 3 to Base */}
      <path d="M34 116 L31 145 H49 L46 116 Z" fill="#FAF5EC" stroke="#C49A58" strokeWidth="1" />
      <line x1="33" y1="130" x2="47" y2="130" stroke="#98502F" strokeWidth="1" />

      {/* Multi-tiered Plinth Base (Peedam) */}
      <ellipse cx="40" cy="148" rx="22" ry="6" fill="#FAF5EC" stroke="#C49A58" strokeWidth="1.5" />
      <ellipse cx="40" cy="158" rx="28" ry="8" fill="#FFFDF9" stroke="#98502F" strokeWidth="1.5" />
      <ellipse cx="40" cy="168" rx="33" ry="9" fill="#FAF5EC" stroke="#C49A58" strokeWidth="1.8" />

      {/* Base engraving rings */}
      <ellipse cx="40" cy="164" rx="30" ry="7" stroke="#C49A58" strokeWidth="0.8" strokeDasharray="2 2" />
    </svg>
  );
};
