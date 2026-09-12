import React from 'react';
import { Shield, Lock, Terminal, Cpu } from 'lucide-react';

interface FooterProps {
  onGoHome?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onGoHome }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 text-slate-400 text-xs font-mono-data py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand */}
          <div className="md:col-span-2">
            <button
              onClick={onGoHome || (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}
              className="flex items-center gap-2 mb-3 cursor-pointer group text-left"
              title="Return to Home"
            >
              <span className="font-heading font-extrabold text-lg text-white group-hover:text-cyan-400 transition-colors">
                Truth<span className="text-[#24a0ed] group-hover:text-cyan-300">Lens</span>
              </span>
              <span className="text-[10px] uppercase font-mono-data px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 tracking-wider">
                AI Forensics
              </span>
            </button>
            <p className="text-slate-400 text-xs sm:text-sm font-sans max-w-md leading-relaxed mb-4">
              TruthLens is an AI-powered digital forensics and cybersecurity intelligence platform dedicated to verifying images, videos, audio clips, news headlines, and online claims.
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-cyan-400" />
                <span>Zero-Retention Ingestion</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>SHA-256 Provenance</span>
              </span>
            </div>
          </div>

          {/* Col 2: Supported Modalities */}
          <div>
            <h4 className="text-white font-heading font-semibold text-sm mb-3">
              Forensic Modalities
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs font-sans">
              <li>Diffusion Artifact Analysis</li>
              <li>Error Level Analysis (ELA)</li>
              <li>Temporal Facial Landmark Jitter</li>
              <li>Neural Vocoder Acoustic Profiling</li>
              <li>Global Wire Intelligence Cross-Checking</li>
            </ul>
          </div>

          {/* Col 3: Standards & Provenance */}
          <div>
            <h4 className="text-white font-heading font-semibold text-sm mb-3">
              Standards & Protocols
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs font-sans">
              <li>C2PA Content Credentials</li>
              <li>Google GenAI (Gemini 3.8 Flash)</li>
              <li>PRNU Sensor Noise Profiling</li>
              <li>Mel-Frequency Spectrogram Analysis</li>
              <li>Open Fact-Checking Network Guidelines</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} TruthLens Forensic Labs. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>All Neural Heuristics Operational</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
