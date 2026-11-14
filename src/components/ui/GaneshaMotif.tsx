import React from 'react';

interface GaneshaProps {
  className?: string;
  size?: number;
}

export const GaneshaMotif: React.FC<GaneshaProps> = ({
  className = 'w-24 h-24 mx-auto',
  size = 96,
}) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Golden halo / Prabhavali backdrop */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-[#C49A58]"
      >
        <circle cx="50" cy="50" r="46" stroke="#E5D8C4" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="42" stroke="#C49A58" strokeWidth="1.2" opacity="0.6" />
        
        {/* Crown (Kireedam) */}
        <path
          d="M42 24 L50 10 L58 24 Z"
          fill="#FAF5EC"
          stroke="#C49A58"
          strokeWidth="1.5"
        />
        <circle cx="50" cy="14" r="2" fill="#98502F" />
        <path d="M44 20 H56" stroke="#98502F" strokeWidth="1.2" />

        {/* Sacred Tilak / Namam on forehead */}
        <path d="M48 27 V35" stroke="#98502F" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M52 27 V35" stroke="#98502F" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="50" cy="37" r="1.5" fill="#98502F" />

        {/* Ears */}
        {/* Left Ear */}
        <path
          d="M38 32 C26 30 24 45 36 50 C38 51 40 46 39 42"
          stroke="#C49A58"
          strokeWidth="1.6"
          fill="#FFFDF9"
          strokeLinecap="round"
        />
        {/* Right Ear */}
        <path
          d="M62 32 C74 30 76 45 64 50 C62 51 60 46 61 42"
          stroke="#C49A58"
          strokeWidth="1.6"
          fill="#FFFDF9"
          strokeLinecap="round"
        />

        {/* Divine Eyes */}
        <path d="M41 38 C43 37 46 38 46 40" stroke="#45352A" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M54 40 C54 38 57 37 59 38" stroke="#45352A" strokeWidth="1.2" strokeLinecap="round" />

        {/* Tusk */}
        <path d="M44 48 L39 49" stroke="#C49A58" strokeWidth="1.8" strokeLinecap="round" />
        {/* Broken Tusk */}
        <path d="M56 48 L58 48.5" stroke="#C49A58" strokeWidth="1.8" strokeLinecap="round" />

        {/* Elegant curved Trunk (Valampuri / Idampuri Grace) */}
        <path
          d="M48 40 C48 55 56 60 56 66 C56 71 50 72 47 69 C44 66 45 61 49 61"
          stroke="#98502F"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Modakam (Sweet Laddu in trunk) */}
        <circle cx="50" cy="61" r="2.5" fill="#C49A58" stroke="#98502F" strokeWidth="0.8" />

        {/* Lotus Petals Base */}
        <g stroke="#C49A58" strokeWidth="1.2" fill="#FAF5EC">
          <path d="M50 82 C44 76 34 78 30 84 C38 86 46 84 50 82 Z" />
          <path d="M50 82 C56 76 66 78 70 84 C62 86 54 84 50 82 Z" />
          <path d="M50 80 C46 73 54 73 50 80 Z" fill="#98502F" />
        </g>
      </svg>
    </div>
  );
};
