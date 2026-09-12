import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Shield, Sparkles, CheckCircle2, ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  onVerifyClick: () => void;
  onHowItWorksClick: () => void;
  triggerShutter: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onVerifyClick,
  onHowItWorksClick,
  triggerShutter,
}) => {
  return (
    <div className="relative overflow-hidden pt-12 pb-8 sm:pt-20 sm:pb-12 text-center">
      {/* Subtle animated background with floating media frames, waveforms, and network nodes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-[120px] rounded-full" />
        
        {/* Floating media frame 1 */}
        <motion.div
          animate={{
            y: [-10, 10, -10],
            rotate: [-2, 2, -2],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden xl:block absolute top-20 left-12 w-48 h-32 rounded-xl border border-cyan-500/20 bg-slate-950/60 backdrop-blur-md p-3 shadow-xl"
        >
          <div className="flex items-center justify-between text-[10px] font-mono-data text-cyan-400 mb-2">
            <span>ELA_LAYER_01</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <div className="w-full h-16 rounded bg-slate-900/90 border border-slate-800 flex items-center justify-center text-slate-600 font-mono-data text-[10px]">
            [DIFFUSION_GRID_SCAN]
          </div>
        </motion.div>

        {/* Floating waveform frame 2 */}
        <motion.div
          animate={{
            y: [12, -12, 12],
            rotate: [2, -2, 2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="hidden xl:block absolute top-28 right-12 w-52 h-36 rounded-xl border border-violet-500/20 bg-slate-950/60 backdrop-blur-md p-3 shadow-xl"
        >
          <div className="flex items-center justify-between text-[10px] font-mono-data text-violet-400 mb-2">
            <span>VOCODER_FILTER</span>
            <span>16.0 kHz</span>
          </div>
          <div className="flex items-end justify-between h-16 gap-1 px-1">
            {[40, 65, 80, 45, 90, 70, 30, 85, 50, 95, 60, 40].map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className="w-2 rounded-t bg-gradient-to-t from-violet-600 to-cyan-400"
              />
            ))}
          </div>
        </motion.div>
      </div>

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
        {/* Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono-data mb-6 shadow-[0_0_20px_rgba(0,240,255,0.15)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Next-Generation Digital Forensics & Truth Intelligence</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold text-white tracking-tight leading-[1.1] mb-6"
        >
          See Beyond <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400">
            What You’re Shown.
          </span>
        </motion.h1>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8"
        >
          Verify images, videos, audio, news, and online claims with AI-powered analysis and source intelligence.
        </motion.p>

        {/* Call to action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        >
          <button
            onClick={onVerifyClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-heading font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,240,255,0.35)] hover:shadow-[0_0_40px_rgba(0,240,255,0.5)] active:scale-95 transition-all"
          >
            <span>Verify Content</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onHowItWorksClick}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-heading font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all"
          >
            <span>How It Works</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Quick Credibility Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono-data border-t border-slate-800/80 pt-6 max-w-xl mx-auto">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Multi-Modal Deepfake Detection</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>50K+ Source Registry</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Zero-Retention Privacy</span>
          </div>
        </div>
      </div>
    </div>
  );
};
