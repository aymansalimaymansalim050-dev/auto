import React from 'react';

export type ThreeDIconType = 'search' | 'sell' | 'compare' | 'secure' | 'messages' | 'dashboard';

interface ThreeDIconProps {
  name: ThreeDIconType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  glow?: boolean;
}

export const ThreeDIcon: React.FC<ThreeDIconProps> = ({
  name,
  size = 'md',
  className = '',
  glow = true,
}) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const pxMap = {
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64,
  };

  const dim = pxMap[size];

  // Futuristic 3D isometric & studio-lit vector rendering
  const renderIcon = () => {
    switch (name) {
      case 'search':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="searchBaseGrad" x1="12" y1="12" x2="52" y2="52">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
              <linearGradient id="lensReflect" x1="16" y1="16" x2="36" y2="36">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#60a5fa" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#1e40af" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            {/* 3D Drop Shadow Ring */}
            <ellipse cx="28" cy="48" rx="14" ry="4" fill="rgba(15,23,42,0.6)" filter="blur(2px)" />
            {/* 3D Handle */}
            <path
              d="M38 38 L54 54 C56 56 56 60 54 62 C52 64 48 64 46 62 L30 46"
              stroke="#1e293b"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M38 38 L54 54 C55 55 55 58 54 59 C53 60 50 60 49 59 L33 43"
              stroke="#64748b"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Bezel Ring 3D */}
            <circle cx="28" cy="28" r="18" fill="url(#searchBaseGrad)" />
            <circle cx="28" cy="27" r="15" fill="#0f172a" />
            <circle cx="28" cy="27" r="14" fill="url(#lensReflect)" />
            {/* Specular Glint */}
            <path
              d="M20 20 C24 16 30 16 34 18"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeOpacity="0.85"
            />
            <circle cx="24" cy="23" r="1.5" fill="#ffffff" />
          </svg>
        );

      case 'sell':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="sellGoldGrad" x1="16" y1="8" x2="48" y2="56">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="45%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="tagMetal" x1="20" y1="12" x2="44" y2="40">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <ellipse cx="32" cy="54" rx="16" ry="4" fill="rgba(15,23,42,0.6)" filter="blur(2px)" />
            {/* 3D Key / Tag Geometry */}
            <path
              d="M18 20 C18 15 22 11 27 11 L42 11 C47 11 51 15 51 20 L51 40 C51 45 47 49 42 49 L27 49 C22 49 18 45 18 40 Z"
              fill="url(#sellGoldGrad)"
            />
            {/* Inner Recessed plate */}
            <rect x="22" y="15" width="25" height="30" rx="3" fill="#1e1b4b" stroke="url(#tagMetal)" strokeWidth="1.5" />
            {/* Car key/sign symbol */}
            <circle cx="34.5" cy="24" r="5" fill="#fbbf24" />
            <path d="M34.5 29 L34.5 40 M31 34 L38 34" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
            {/* Metallic rim reflection */}
            <path d="M22 14 L44 14" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8" />
          </svg>
        );

      case 'compare':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="compGradA" x1="8" y1="14" x2="30" y2="50">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
              <linearGradient id="compGradB" x1="34" y1="14" x2="56" y2="50">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#4338ca" />
              </linearGradient>
            </defs>
            <ellipse cx="32" cy="54" rx="18" ry="4" fill="rgba(15,23,42,0.6)" filter="blur(2px)" />
            {/* Left 3D Panel */}
            <rect x="10" y="16" width="18" height="32" rx="4" fill="url(#compGradA)" />
            <rect x="12" y="18" width="14" height="12" rx="2" fill="#0f172a" opacity="0.6" />
            <line x1="14" y1="36" x2="24" y2="36" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
            <line x1="14" y1="41" x2="20" y2="41" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />

            {/* Right 3D Panel floating forward */}
            <rect x="34" y="12" width="20" height="36" rx="4" fill="url(#compGradB)" />
            <rect x="37" y="15" width="14" height="14" rx="2" fill="#0f172a" opacity="0.6" />
            <line x1="39" y1="35" x2="50" y2="35" stroke="#c7d2fe" strokeWidth="2" strokeLinecap="round" />
            <line x1="39" y1="40" x2="46" y2="40" stroke="#c7d2fe" strokeWidth="2" strokeLinecap="round" />

            {/* Connecting VS Badge */}
            <circle cx="32" cy="30" r="7" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
            <path d="M30 28 L32 32 L34 28" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      case 'secure':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="shield3D" x1="14" y1="8" x2="50" y2="56">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="100%" stopColor="#064e3b" />
              </linearGradient>
              <linearGradient id="shieldRim" x1="16" y1="12" x2="48" y2="48">
                <stop offset="0%" stopColor="#a7f3d0" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>
            <ellipse cx="32" cy="54" rx="16" ry="4" fill="rgba(15,23,42,0.6)" filter="blur(2px)" />
            {/* 3D Shield Base */}
            <path
              d="M32 10 L48 16 C48 32 42 45 32 50 C22 45 16 32 16 16 Z"
              fill="url(#shield3D)"
            />
            {/* Rim Highlight */}
            <path
              d="M32 13 L45 18 C45 31 40 42 32 46 C24 42 19 31 19 18 Z"
              fill="#064e3b"
              stroke="url(#shieldRim)"
              strokeWidth="1.5"
            />
            {/* Central 3D Checkmark & Padlock */}
            <path
              d="M26 28 L30 32 L38 23"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M22 17 L32 13" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8" />
          </svg>
        );

      case 'messages':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="msgGradA" x1="12" y1="12" x2="46" y2="46">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
              <linearGradient id="msgGradB" x1="24" y1="20" x2="54" y2="52">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>
            <ellipse cx="32" cy="54" rx="16" ry="4" fill="rgba(15,23,42,0.6)" filter="blur(2px)" />
            {/* Back Bubble */}
            <path
              d="M14 26 C14 18 20 12 30 12 C40 12 48 18 48 26 C48 34 40 40 30 40 L22 44 L24 38 C18 36 14 31 14 26 Z"
              fill="url(#msgGradA)"
            />
            {/* Front Bubble with Depth */}
            <path
              d="M22 34 C22 28 28 22 38 22 C48 22 54 28 54 34 C54 40 48 46 38 46 L30 50 L32 44 C26 42 22 38 22 34 Z"
              fill="url(#msgGradB)"
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            {/* Message Dots */}
            <circle cx="32" cy="34" r="2" fill="#ffffff" />
            <circle cx="38" cy="34" r="2" fill="#ffffff" />
            <circle cx="44" cy="34" r="2" fill="#ffffff" />
            <path d="M26 25 C30 23 36 23 42 25" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7" />
          </svg>
        );

      case 'dashboard':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="dashA" x1="12" y1="12" x2="30" y2="30">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="dashB" x1="34" y1="12" x2="52" y2="30">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
              <linearGradient id="dashC" x1="12" y1="34" x2="52" y2="52">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
            <ellipse cx="32" cy="54" rx="16" ry="4" fill="rgba(15,23,42,0.6)" filter="blur(2px)" />
            {/* 3D Isometric SaaS Cards */}
            <rect x="12" y="12" width="18" height="18" rx="4" fill="url(#dashA)" />
            <line x1="16" y1="21" x2="26" y2="21" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.9" />

            <rect x="34" y="12" width="18" height="18" rx="4" fill="url(#dashB)" />
            <circle cx="43" cy="21" r="3.5" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.9" />

            <rect x="12" y="34" width="40" height="16" rx="4" fill="url(#dashC)" />
            {/* Micro Sparkline */}
            <path
              d="M17 44 L25 40 L33 43 L41 38 L47 41"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-110 ${sizeMap[size]} ${className}`}
    >
      {glow && (
        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md -z-10" />
      )}
      {renderIcon()}
    </div>
  );
};
