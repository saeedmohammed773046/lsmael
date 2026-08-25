import React from 'react';

interface IsmailLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'horizontal';
  theme?: 'dark' | 'light' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function IsmailLogo({
  className = '',
  variant = 'full',
  theme = 'light',
  size = 'md',
}: IsmailLogoProps) {
  const isDark = theme === 'dark';
  const isGold = theme === 'gold';

  const goldPrimary = '#D4AF37';
  const goldSecondary = '#AA7C11';
  const darkColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDark ? '#E6CA65' : '#8C6B14';

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  // 1. Pure Graphic Tent + Dallah + 2 Cups SVG Icon
  const TentIcon = (
    <svg
      viewBox="0 0 160 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${iconSizes[size]} transition-transform duration-300 group-hover:scale-105`}
    >
      {/* Gradients */}
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D061" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#996515" />
        </linearGradient>
      </defs>

      {/* Tent Top Finial */}
      <path
        d="M80 6 C80 6 82 12 82 16 C82 18 81 20 80 22 C79 20 78 18 78 16 C78 12 80 6 80 6 Z"
        fill="url(#goldGrad)"
      />
      <circle cx="80" cy="10" r="2.5" fill="url(#goldGrad)" />

      {/* Main Tent Canopy Roof */}
      <path
        d="M80 22 Q115 32 145 52 L145 62 Q115 42 80 32 Q45 42 15 62 L15 52 Q45 32 80 22 Z"
        fill="url(#goldGrad)"
      />
      <path
        d="M80 22 L80 32 M50 29 L50 39 M110 29 L110 39"
        stroke={darkColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Decorative Scallop Valance */}
      <path
        d="M15 62 Q25 68 35 62 Q45 68 55 62 Q65 68 75 62 Q80 65 85 62 Q95 68 105 62 Q115 68 125 62 Q135 68 145 62"
        stroke="url(#goldGrad)"
        strokeWidth="2.5"
        fill="none"
      />

      {/* Tent Side Columns & Draped Curtains */}
      <path
        d="M20 64 L20 120 M140 64 L140 120"
        stroke={darkColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Outer Drapes */}
      <path
        d="M20 64 Q35 90 24 120 M140 64 Q125 90 136 120"
        stroke="url(#goldGrad)"
        strokeWidth="2"
        fill="none"
      />

      {/* Central Royal Grand Arch */}
      <path
        d="M42 120 L42 85 Q42 62 80 62 Q118 62 118 85 L118 120"
        stroke="url(#goldGrad)"
        strokeWidth="3.5"
        fill={isDark ? '#0D0D0D' : '#FAFAF7'}
      />
      <path
        d="M48 120 L48 88 Q48 68 80 68 Q112 68 112 88 L112 120"
        stroke={darkColor}
        strokeWidth="1"
        strokeDasharray="2 3"
        fill="none"
      />

      {/* Hospitality: Arabic Tea Dallah (Center) */}
      <g transform="translate(68, 74)">
        {/* Dallah Lid & Finial */}
        <path d="M12 2 Q12 0 12 0 Q12 0 12 2 L10 7 L14 7 Z" fill="url(#goldGrad)" />
        <ellipse cx="12" cy="7" rx="3.5" ry="1.5" fill="url(#goldGrad)" />
        
        {/* Dallah Neck */}
        <path d="M10 7 L9 15 L15 15 L14 7 Z" fill="url(#goldGrad)" />
        
        {/* Dallah Spout */}
        <path
          d="M9 13 Q1 9 0 4 Q-1 12 7 19"
          stroke="url(#goldGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Dallah Handle */}
        <path
          d="M15 12 Q24 15 22 26 Q20 33 16 32"
          stroke="url(#goldGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Dallah Body */}
        <path
          d="M9 15 Q6 24 6 28 Q6 34 12 35 Q18 34 18 28 Q18 24 15 15 Z"
          fill="url(#goldGrad)"
        />
        <path
          d="M8 35 L7 38 L17 38 L16 35 Z"
          fill="url(#goldGrad)"
        />
        {/* Dallah Base Ring */}
        <ellipse cx="12" cy="38" rx="6" ry="1.5" fill="url(#goldGrad)" />
      </g>

      {/* Hospitality: Right Tea Cup (Finjan) */}
      <g transform="translate(100, 102)">
        <path d="M2 0 L10 0 L9 10 Q6 13 3 10 Z" fill="url(#goldGrad)" />
        <ellipse cx="6" cy="11" rx="4" ry="1" fill="url(#goldGrad)" />
        {/* Steam */}
        <path d="M4 -2 Q6 -4 4 -7 M7 -2 Q9 -4 7 -7" stroke="url(#goldGrad)" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
      </g>

      {/* Hospitality: Left Tea Cup (Finjan) */}
      <g transform="translate(48, 102)">
        <path d="M2 0 L10 0 L9 10 Q6 13 3 10 Z" fill="url(#goldGrad)" />
        <ellipse cx="6" cy="11" rx="4" ry="1" fill="url(#goldGrad)" />
        {/* Steam */}
        <path d="M4 -2 Q6 -4 4 -7 M7 -2 Q9 -4 7 -7" stroke="url(#goldGrad)" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
      </g>

      {/* Ground Baseline */}
      <path
        d="M10 120 L150 120"
        stroke="url(#goldGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{TentIcon}</div>;
  }

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 group ${className}`}>
        {TentIcon}
        <div className="flex flex-col text-right">
          <span
            className="font-extrabold tracking-tight font-sans leading-none"
            style={{
              color: darkColor,
              fontSize: size === 'sm' ? '1.1rem' : size === 'lg' ? '1.8rem' : '1.4rem',
            }}
          >
            إسماعيل
          </span>
          <span
            className="font-bold tracking-wider leading-tight mt-1"
            style={{
              color: subtextColor,
              fontSize: size === 'sm' ? '0.65rem' : size === 'lg' ? '0.85rem' : '0.75rem',
            }}
          >
            للأفراح والمناسبات ومستلزماتها
          </span>
        </div>
      </div>
    );
  }

  // Default 'full' stacked emblem
  return (
    <div className={`flex flex-col items-center text-center group ${className}`}>
      {TentIcon}
      <div className="mt-1 flex flex-col items-center">
        <span
          className="font-black tracking-tight font-sans leading-tight"
          style={{
            color: darkColor,
            fontSize: size === 'sm' ? '1.25rem' : size === 'lg' ? '2.25rem' : '1.75rem',
          }}
        >
          إسماعيل
        </span>
        <span
          className="font-bold tracking-wider leading-tight mt-0.5"
          style={{
            color: subtextColor,
            fontSize: size === 'sm' ? '0.7rem' : size === 'lg' ? '0.95rem' : '0.8rem',
          }}
        >
          للأفراح والمناسبات ومستلزماتها
        </span>
      </div>
    </div>
  );
}
