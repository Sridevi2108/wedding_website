import React from 'react';

interface SvgProps {
  className?: string;
  color?: string;
  accent?: string;
}

export const TempleGopuram: React.FC<SvgProps> = ({
  className = 'w-32 h-64',
  color = '#C49A58',
  accent = '#98502F',
}) => {
  return (
    <svg
      viewBox="0 0 160 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Top 7 Kalasams (Finials) */}
      <g stroke={color} strokeWidth="1.5" fill="none">
        <path d="M80 8 L80 18 M74 18 H86 L80 12 Z" fill={color} fillOpacity="0.2" />
        <path d="M68 12 L68 20 M63 20 H73 L68 15 Z" fill={color} fillOpacity="0.15" />
        <path d="M92 12 L92 20 M87 20 H97 L92 15 Z" fill={color} fillOpacity="0.15" />
        <path d="M56 16 L56 24 M51 24 H61 L56 19 Z" fill={color} fillOpacity="0.1" />
        <path d="M104 16 L104 24 M99 24 H109 L104 19 Z" fill={color} fillOpacity="0.1" />
      </g>

      {/* Gopuram Top Dome / Sikhara Ridge */}
      <path
        d="M45 28 C60 22 100 22 115 28 C120 32 120 38 115 42 H45 C40 38 40 32 45 28 Z"
        stroke={color}
        strokeWidth="1.8"
        fill="#FFFDF9"
      />
      <path d="M50 35 H110" stroke={accent} strokeWidth="1" strokeDasharray="3 2" />

      {/* Tier 1 (Apex Tier) */}
      <path
        d="M48 42 L42 66 H118 L112 42 Z"
        stroke={color}
        strokeWidth="1.5"
        fill="#FAF5EC"
      />
      {/* Mini shrine niches Tier 1 */}
      <rect x="58" y="47" width="10" height="15" rx="2" stroke={accent} strokeWidth="1" fill="#FFFDF9" />
      <rect x="75" y="45" width="10" height="17" rx="2" stroke={color} strokeWidth="1.2" fill="#FFFDF9" />
      <rect x="92" y="47" width="10" height="15" rx="2" stroke={accent} strokeWidth="1" fill="#FFFDF9" />

      {/* Tier 2 */}
      <path
        d="M40 68 L34 98 H126 L120 68 Z"
        stroke={color}
        strokeWidth="1.5"
        fill="#FFFDF9"
      />
      <path d="M38 72 H122" stroke={color} strokeWidth="1" />
      {/* Mini niches */}
      <rect x="48" y="75" width="12" height="18" rx="2" stroke={accent} strokeWidth="1" />
      <rect x="66" y="74" width="12" height="19" rx="2" stroke={color} strokeWidth="1.2" />
      <rect x="82" y="74" width="12" height="19" rx="2" stroke={color} strokeWidth="1.2" />
      <rect x="100" y="75" width="12" height="18" rx="2" stroke={accent} strokeWidth="1" />

      {/* Tier 3 */}
      <path
        d="M32 100 L25 136 H135 L128 100 Z"
        stroke={color}
        strokeWidth="1.5"
        fill="#FAF5EC"
      />
      <path d="M30 104 H130" stroke={color} strokeWidth="1" />
      <circle cx="45" cy="118" r="5" stroke={accent} strokeWidth="1" fill="#FFFDF9" />
      <circle cx="68" cy="118" r="5" stroke={color} strokeWidth="1" fill="#FFFDF9" />
      <circle cx="92" cy="118" r="5" stroke={color} strokeWidth="1" fill="#FFFDF9" />
      <circle cx="115" cy="118" r="5" stroke={accent} strokeWidth="1" fill="#FFFDF9" />

      {/* Tier 4 */}
      <path
        d="M23 138 L16 180 H144 L137 138 Z"
        stroke={color}
        strokeWidth="1.6"
        fill="#FFFDF9"
      />
      <path d="M21 144 H139" stroke={color} strokeWidth="1" />
      {/* Decorative Dravidian cornices */}
      <path d="M25 158 C35 152 45 152 55 158 C65 152 75 152 85 158 C95 152 105 152 115 158 C125 152 135 152 140 158" stroke={accent} strokeWidth="1" />

      {/* Tier 5 */}
      <path
        d="M14 182 L7 232 H153 L146 182 Z"
        stroke={color}
        strokeWidth="1.6"
        fill="#FAF5EC"
      />
      <path d="M12 188 H148" stroke={color} strokeWidth="1.2" />
      {/* Sculpted pillar details */}
      <line x1="30" y1="192" x2="30" y2="228" stroke={accent} strokeWidth="1.2" />
      <line x1="50" y1="192" x2="50" y2="228" stroke={color} strokeWidth="1" />
      <line x1="80" y1="192" x2="80" y2="228" stroke={color} strokeWidth="1.5" />
      <line x1="110" y1="192" x2="110" y2="228" stroke={color} strokeWidth="1" />
      <line x1="130" y1="192" x2="130" y2="228" stroke={accent} strokeWidth="1.2" />

      {/* Main Base Structure (Maha Mandapam / Gateway) */}
      <path
        d="M5 234 L3 320 H157 L155 234 Z"
        stroke={color}
        strokeWidth="1.8"
        fill="#FFFDF9"
      />

      {/* Grand Dravidian Temple Archway (Dwaram) */}
      <path
        d="M52 320 V265 C52 250 108 250 108 265 V320"
        stroke={accent}
        strokeWidth="2.2"
        fill="#FAF5EC"
      />
      <path
        d="M58 320 V270 C58 260 102 260 102 270 V320"
        stroke={color}
        strokeWidth="1"
        fill="#F4ECE1"
      />

      {/* Pillars flanking the gateway */}
      <rect x="25" y="244" width="12" height="76" stroke={color} strokeWidth="1.2" fill="#FAF5EC" />
      <rect x="123" y="244" width="12" height="76" stroke={color} strokeWidth="1.2" fill="#FAF5EC" />
      <path d="M22 244 H40 M22 320 H40 M120 244 H138 M120 320 H138" stroke={color} strokeWidth="1.5" />

      {/* Temple plinth base (Adhisthana) */}
      <rect x="0" y="320" width="160" height="15" stroke={color} strokeWidth="1.8" fill="#FAF5EC" />
      <rect x="6" y="335" width="148" height="18" stroke={color} strokeWidth="1.5" fill="#FFFDF9" />
      <path d="M0 327 H160" stroke={accent} strokeWidth="1" strokeDasharray="4 2" />
    </svg>
  );
};
