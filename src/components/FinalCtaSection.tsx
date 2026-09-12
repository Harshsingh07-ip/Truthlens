import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface FinalCtaSectionProps {
  onStartVerifying: () => void;
  triggerShutter: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  onStartVerifying,
  triggerShutter,
}) => {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-20">
      <div className="relative rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-[#04060a] p-8 sm:p-14 text-center overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,240,255,0.15)]">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 forensics-grid opacity-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
          {/* Forensic Shield Icon Badge */}
          <div className="mb-6 w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.25)]">
            <ShieldCheck className="w-7 h-7 text-cyan-400" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-white tracking-tight mb-4">
            Don’t Just See It. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400">
              Verify It.
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-lg leading-relaxed">
            Protect your information diet against AI-generated hallucinations, coordinated disinformation campaigns, and deceptive media clones.
          </p>

          <button
            onClick={onStartVerifying}
            className="group px-9 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-heading font-bold text-base sm:text-lg flex items-center gap-3 shadow-[0_0_35px_rgba(0,240,255,0.4)] hover:shadow-[0_0_50px_rgba(0,240,255,0.6)] active:scale-95 transition-all"
          >
            <span>Start Verifying</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <span className="text-xs font-mono-data text-slate-500 mt-5">
            Instant multi-modal analysis • No credit card required • Privacy guaranteed
          </span>
        </div>
      </div>
    </section>
  );
};
