import React, { useState } from 'react';
import { CameraLensLogo } from './CameraLensLogo';
import {
  Volume2,
  VolumeX,
  History,
  User,
  LogIn,
  EyeOff,
  Shield,
  ShieldCheck,
  LifeBuoy,
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onVerifyClick: () => void;
  triggerShutter: () => void;
  verificationStatus?: 'idle' | 'scanning' | 'verified' | 'uncertain' | 'suspicious' | 'ai_generated';
  onGoHome?: () => void;
  onOpenAuth: () => void;
  onOpenHistory: () => void;
  isIncognito: boolean;
  onToggleIncognito: () => void;
  onOpenZeroKnowledge: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onVerifyClick,
  triggerShutter,
  verificationStatus = 'idle',
  onGoHome,
  onOpenAuth,
  onOpenHistory,
  isIncognito,
  onToggleIncognito,
  onOpenZeroKnowledge,
}) => {
  const [isMuted, setIsMuted] = useState(soundFx.isMuted);
  const { user } = useAuth();

  const toggleSound = () => {
    soundFx.isMuted = !soundFx.isMuted;
    setIsMuted(soundFx.isMuted);
    if (!soundFx.isMuted) soundFx.playScanPing();
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-[4.75rem] sm:h-20 py-2 flex items-center justify-between gap-3">
        {/* Brand with Camera Lens Logo */}
        <div className="flex items-center gap-3">
          <CameraLensLogo
            status={verificationStatus}
            size="md"
            onClick={() => {
              triggerShutter();
              if (onGoHome) {
                onGoHome();
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          />
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-mono-data text-slate-300">
          <button
            onClick={() => {
              if (onGoHome) {
                onGoHome();
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="hover:text-cyan-400 transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => scrollTo('core-verification-options')}
            className="hover:text-cyan-400 transition-colors"
          >
            Modules
          </button>
          <button
            onClick={() => scrollTo('how-it-works')}
            className="hover:text-cyan-400 transition-colors"
          >
            How It Works
          </button>
          <button
            onClick={onOpenZeroKnowledge}
            className="hover:text-rose-400 text-rose-300/90 transition-colors flex items-center gap-1"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Confidential Intake</span>
          </button>
          <button
            onClick={() => scrollTo('trust-privacy')}
            className="hover:text-cyan-400 transition-colors"
          >
            Security & Privacy
          </button>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Temporary / Incognito Mode Quick Toggle */}
          <button
            onClick={onToggleIncognito}
            title={
              isIncognito
                ? 'Temporary Search Mode Active: Zero logs saved'
                : 'Enable Temporary Search (Incognito)'
            }
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono-data transition-all flex items-center gap-1.5 ${
              isIncognito
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.3)] font-semibold'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <EyeOff className={`w-3.5 h-3.5 ${isIncognito ? 'text-rose-400' : ''}`} />
            <span className="hidden sm:inline">
              {isIncognito ? 'Incognito' : 'Temporary'}
            </span>
          </button>

          {/* User Account / Login Button */}
          {user ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenHistory}
                title="View Verification History"
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono-data text-slate-200 hover:text-cyan-300 transition-all flex items-center gap-1.5"
              >
                <History className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline">History</span>
              </button>

              <button
                onClick={onOpenHistory}
                title={`Logged in as ${user.email}`}
                className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-xs font-bold font-mono-data hover:scale-105 transition-transform"
              >
                {user.displayName ? user.displayName[0].toUpperCase() : user.email?.[0].toUpperCase() || 'U'}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono-data text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>Log In</span>
              </button>
            </div>
          )}

          {/* Sound FX Toggle Button */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute Forensic Audio Effects' : 'Mute Audio Effects'}
            className="p-2 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-cyan-400 hover:border-slate-700 transition-colors text-xs"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Direct Launch CTA */}
          <button
            onClick={onVerifyClick}
            className="hidden sm:inline-flex px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 text-xs font-mono-data font-semibold transition-all shadow-[0_0_15px_rgba(0,240,255,0.15)]"
          >
            Scanner
          </button>
        </div>
      </div>
    </header>
  );
};
