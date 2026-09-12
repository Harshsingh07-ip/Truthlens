import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../utils/audio';

interface CameraLensLogoProps {
  status?: 'idle' | 'scanning' | 'verified' | 'uncertain' | 'suspicious' | 'ai_generated';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isScanning?: boolean;
  triggerShutter?: number;
  showText?: boolean;
  showShadow?: boolean;
  continuous?: boolean;
  className?: string;
  onClick?: () => void;
}

// Precomputed 6 camera shutter blades matching the minimal vector logo
const SHUTTER_BLADES = [
  {
    d: "M 76.41 34.75 A 30.5 30.5 0 0 1 76.41 65.25 L 45.63 54.81 L 51.98 56.19 Z",
    pivotX: 76.41,
    pivotY: 34.75,
  },
  {
    d: "M 76.41 65.25 A 30.5 30.5 0 0 1 50.00 80.50 L 43.65 48.61 L 45.63 54.81 Z",
    pivotX: 76.41,
    pivotY: 65.25,
  },
  {
    d: "M 50.00 80.50 A 30.5 30.5 0 0 1 23.59 65.25 L 48.02 43.81 L 43.65 48.61 Z",
    pivotX: 50.00,
    pivotY: 80.50,
  },
  {
    d: "M 23.59 65.25 A 30.5 30.5 0 0 1 23.59 34.75 L 54.37 45.19 L 48.02 43.81 Z",
    pivotX: 23.59,
    pivotY: 65.25,
  },
  {
    d: "M 23.59 34.75 A 30.5 30.5 0 0 1 50.00 19.50 L 56.35 51.39 L 54.37 45.19 Z",
    pivotX: 23.59,
    pivotY: 34.75,
  },
  {
    d: "M 50.00 19.50 A 30.5 30.5 0 0 1 76.41 34.75 L 51.98 56.19 L 56.35 51.39 Z",
    pivotX: 50.00,
    pivotY: 19.50,
  },
];

export const CameraLensLogo: React.FC<CameraLensLogoProps> = ({
  status = 'idle',
  size = 'md',
  isScanning = false,
  triggerShutter = 0,
  showText = true,
  showShadow = true,
  continuous = true,
  className = '',
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isShutterClosed, setIsShutterClosed] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Size mapping (enlarged for prominence and clarity)
  const dimensions = {
    sm: { width: 50, height: 53, textSize: 'text-base', subSize: 'text-[10px]' },
    md: { width: 74, height: 78, textSize: 'text-xl', subSize: 'text-xs' },
    lg: { width: 110, height: 116, textSize: 'text-2xl', subSize: 'text-xs' },
    xl: { width: 156, height: 164, textSize: 'text-3xl', subSize: 'text-sm' },
  }[size];

  // Glow color selection based on verification state
  const getGlowColor = () => {
    if (isScanning || status === 'scanning') return '#00f0ff'; // Cyan
    if (status === 'verified') return '#10b981'; // Emerald Green
    if (status === 'uncertain') return '#f59e0b'; // Amber
    if (status === 'suspicious' || status === 'ai_generated') return '#ef4444'; // Red/Orange-red
    return '#24a0ed'; // Blue brand color
  };

  const glowColor = getGlowColor();

  // Trigger shutter snap function (closes fully, plays sound, flashes, then springs wide open)
  const snapShutter = (customHoldMs = 170) => {
    setIsShutterClosed(true);
    setFlashActive(true);
    soundFx.playShutter();

    // Reset flash quickly
    setTimeout(() => {
      setFlashActive(false);
    }, 80);

    // Spring wide open with bounce
    setTimeout(() => {
      setIsShutterClosed(false);
    }, customHoldMs);
  };

  // Initial load intro shutter animation
  useEffect(() => {
    const introTimer = setTimeout(() => {
      snapShutter(200);
    }, 500);

    return () => clearTimeout(introTimer);
  }, []);

  // External trigger prop listener
  useEffect(() => {
    if (triggerShutter > 0) {
      snapShutter(220);
    }
  }, [triggerShutter]);

  // Periodic shutter capture cycles during scanning
  useEffect(() => {
    if (isScanning) {
      // Immediate snap on start
      snapShutter(180);

      // Repeat burst snap every 1100ms
      scanIntervalRef.current = setInterval(() => {
        snapShutter(170);
      }, 1100);
    } else {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
      setIsShutterClosed(false);
    }

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [isScanning]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!isScanning) {
      snapShutter(220);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    snapShutter(260);
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      id="truthlens-brand-logo"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`inline-flex items-center gap-3 select-none cursor-pointer group transition-transform ${className}`}
      title="TruthLens Home — Click to return to home page"
    >
      <div
        className="relative flex items-center justify-center"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        {/* Outer ambient glow halo based on state */}
        <motion.div
          animate={{
            boxShadow: isScanning
              ? `0 0 32px 8px ${glowColor}80`
              : isHovered
              ? `0 0 26px 6px ${glowColor}60`
              : `0 0 16px 2px ${glowColor}30`,
            scale: isScanning ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: isScanning ? 1.4 : 0.25,
            repeat: isScanning ? Infinity : 0,
            ease: 'easeInOut',
          }}
          className="absolute inset-2 rounded-2xl pointer-events-none"
        />

        {/* Minimal Camera Shutter SVG Logo matching user reference image */}
        <svg
          viewBox="0 0 100 104"
          className="w-full h-full relative z-10 overflow-visible filter drop-shadow-[0_4px_14px_rgba(0,0,0,0.7)]"
        >
          <defs>
            {/* Shutter Blade Vibrant Blue Gradient */}
            <linearGradient id="shutterBladeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#24a0ed" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            {/* Dark Camera Body Gradient */}
            <linearGradient id="cameraBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e2738" />
              <stop offset="50%" stopColor="#111827" />
              <stop offset="100%" stopColor="#0b0f19" />
            </linearGradient>

            {/* Flash glint gradient */}
            <radialGradient id="shutterFlash" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="35%" stopColor="#7dd3fc" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#0284c7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Circular clip for aperture iris (enlarged for bigger lens aperture) */}
            <clipPath id="apertureCircularClip">
              <circle cx="50" cy="50" r="32" />
            </clipPath>
          </defs>

          {/* Soft Ground Shadow Ellipse beneath the camera body */}
          {showShadow && (
            <motion.ellipse
              cx="50"
              cy="100"
              rx="24"
              ry="2.6"
              fill="#000000"
              animate={
                continuous
                  ? {
                      rx: [24, 24, 20.5, 20.5, 25, 24],
                      opacity: [0.35, 0.35, 0.6, 0.6, 0.3, 0.35],
                    }
                  : {
                      opacity: isShutterClosed ? 0.6 : 0.35,
                      rx: isShutterClosed ? 20.5 : 24,
                    }
              }
              transition={
                continuous
                  ? {
                      duration: 1.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      times: [0, 0.22, 0.42, 0.6, 0.78, 1],
                    }
                  : { duration: 0.16 }
              }
            />
          )}

          {/* Camera Body Housing (Sleek minimalist squircle with subtle camera grip curves) */}
          <motion.path
            d="M 28 8 C 40 10.5 60 10.5 72 8 C 88 8 92 14 92 28 C 89.5 40 89.5 60 92 72 C 92 86 88 92 72 92 C 60 89.5 40 89.5 28 92 C 12 92 8 86 8 72 C 10.5 60 10.5 40 8 28 C 8 14 12 8 28 8 Z"
            fill="url(#cameraBodyGrad)"
            stroke="#334155"
            strokeWidth="0.8"
            animate={
              continuous
                ? {
                    scale: [1, 1, 0.96, 0.96, 1.02, 1],
                    y: [0, 0, 0.6, 0.6, -0.3, 0],
                  }
                : {
                    scale: isShutterClosed ? 0.96 : isHovered ? 1.02 : 1,
                    y: isShutterClosed ? 0.6 : 0,
                  }
            }
            transition={
              continuous
                ? {
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    times: [0, 0.22, 0.42, 0.6, 0.78, 1],
                  }
                : {
                    type: 'spring',
                    stiffness: 450,
                    damping: 20,
                  }
            }
            style={{ transformOrigin: '50px 50px' }}
          />

          {/* Crisp Pure White Outer Housing Ring (enlarged for prominent lens presence) */}
          <circle
            cx="50"
            cy="50"
            r="34.5"
            fill="#ffffff"
            className="filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
          />

          {/* Inner Circular Base (White aperture iris background revealed when shutter opens fully) */}
          <circle
            cx="50"
            cy="50"
            r="32"
            fill="#ffffff"
          />

          {/* 6 Blue Shutter Blades with Full Opening and Full Closing Fast Continuous Animation */}
          <g clipPath="url(#apertureCircularClip)">
            {SHUTTER_BLADES.map((blade, idx) => (
              <motion.g
                key={idx}
                style={{
                  transformOrigin: `${blade.pivotX}px ${blade.pivotY}px`,
                }}
                animate={
                  continuous
                    ? {
                        // Snappy cycle: wide open -> rapid full close -> hold shut -> rapid spring wide open -> settle
                        rotate: [-36, -36, 26, 26, -40, -36],
                        scale: [0.82, 0.82, 1.28, 1.28, 0.80, 0.82],
                      }
                    : {
                        rotate: isShutterClosed ? 26 : -36,
                        scale: isShutterClosed ? 1.28 : 0.82,
                      }
                }
                transition={
                  continuous
                    ? {
                        duration: 1.2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        times: [0, 0.22, 0.42, 0.6, 0.78, 1],
                      }
                    : {
                        type: 'spring',
                        stiffness: 420,
                        damping: 22,
                        mass: 0.6,
                      }
                }
              >
                <path
                  d={blade.d}
                  fill="url(#shutterBladeGradient)"
                  stroke="#ffffff"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
              </motion.g>
            ))}

            {/* Airtight Center Iris Diaphragm Seal (guarantees 100% full zero-gap closure when shut) */}
            <motion.circle
              cx="50"
              cy="50"
              r="14"
              fill="url(#shutterBladeGradient)"
              stroke="#ffffff"
              strokeWidth="2.2"
              animate={
                continuous
                  ? {
                      scale: [0, 0, 1.1, 1.1, 0, 0],
                      opacity: [0, 0, 1, 1, 0, 0],
                    }
                  : {
                      scale: isShutterClosed ? 1.1 : 0,
                      opacity: isShutterClosed ? 1 : 0,
                    }
              }
              transition={
                continuous
                  ? {
                      duration: 1.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      times: [0, 0.24, 0.42, 0.6, 0.76, 1],
                    }
                  : { duration: 0.14 }
              }
              pointerEvents="none"
            />
          </g>

          {/* Subtle Front Glass Reflection Sheen */}
          <path
            d="M 28 26 C 38 18, 62 18, 72 26 C 60 22, 40 22, 28 26 Z"
            fill="#ffffff"
            opacity="0.3"
            pointerEvents="none"
          />

          {/* Shutter Exposure Flash Glint (synchronous optical flash at the exact instant of full closure) */}
          {continuous ? (
            <motion.circle
              cx="50"
              cy="50"
              r="30"
              fill="url(#shutterFlash)"
              animate={{
                opacity: [0, 0, 0.95, 0.95, 0, 0],
                scale: [0.3, 0.3, 1.2, 1.2, 0.3, 0.3],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
                times: [0, 0.38, 0.44, 0.56, 0.64, 1],
              }}
              pointerEvents="none"
            />
          ) : (
            <AnimatePresence>
              {flashActive && (
                <motion.circle
                  cx="50"
                  cy="50"
                  r="30"
                  fill="url(#shutterFlash)"
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1.15 }}
                  exit={{ opacity: 0, scale: 1.4 }}
                  transition={{ duration: 0.12, ease: 'easeOut' }}
                  pointerEvents="none"
                />
              )}
            </AnimatePresence>
          )}

          {/* Subtle Technical Markings when in scanning mode */}
          {isScanning && (
            <motion.circle
              cx="50"
              cy="50"
              r="34"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="1.2"
              strokeDasharray="4 4"
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '50px 50px' }}
              pointerEvents="none"
            />
          )}
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-heading font-extrabold tracking-tight text-white group-hover:text-cyan-400 transition-colors ${dimensions.textSize}`}
            >
              Truth<span className="text-[#24a0ed] group-hover:text-cyan-300">Lens</span>
            </span>
            <span className="text-[10px] uppercase font-mono-data px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 tracking-wider">
              AI Forensics
            </span>
          </div>
          <span
            className={`text-slate-400 font-mono-data tracking-tight -mt-0.5 flex items-center gap-1.5 ${dimensions.subSize}`}
          >
            <span>Digital Authenticity Engine</span>
            <span
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                isScanning
                  ? 'bg-cyan-400 animate-ping'
                  : status === 'verified'
                  ? 'bg-emerald-400'
                  : status === 'uncertain'
                  ? 'bg-amber-400'
                  : status === 'suspicious' || status === 'ai_generated'
                  ? 'bg-rose-500'
                  : 'bg-[#24a0ed]'
              }`}
            />
          </span>
        </div>
      )}
    </div>
  );
};

