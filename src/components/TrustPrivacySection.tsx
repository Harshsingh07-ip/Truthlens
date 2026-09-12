import React from 'react';
import { ShieldCheck, Lock, EyeOff, ServerOff, FileCheck2, Scale } from 'lucide-react';

export const TrustPrivacySection: React.FC = () => {
  const pillars = [
    {
      icon: EyeOff,
      title: 'Zero-Retention Policy',
      description:
        'Uploaded media and text submissions are stored in volatile RAM during forensic inspection and deleted automatically post-analysis. We never train public AI models on user assets.',
    },
    {
      icon: Lock,
      title: 'Cryptographic Hashing',
      description:
        'Binary files generate SHA-256 digests on ingest. Provenance audits verify C2PA Content Credentials without retaining copies of your original files.',
    },
    {
      icon: ServerOff,
      title: 'Isolated Memory Sandbox',
      description:
        'All neural deconstructions and frequency decomposition routines execute in restricted sandboxes with enterprise TLS 1.3 encryption at rest and in transit.',
    },
    {
      icon: Scale,
      title: 'Independent Decision Support',
      description:
        'TruthLens empowers human judgment. Our algorithmic scores provide objective statistical indicators and should always be paired with primary source evaluation.',
    },
  ];

  return (
    <section id="trust-privacy" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20">
      <div className="relative rounded-2xl border border-slate-800 bg-slate-950/70 p-6 sm:p-10 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 forensics-grid opacity-20 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono-data uppercase tracking-widest mb-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Security & Ethics</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
                Privacy-First Analysis. Your Content is Protected.
              </h2>
            </div>
            <div className="text-xs font-mono-data text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 self-start md:self-auto">
              SOC 2 Compliant Protocol Simulation • TLS 1.3
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/70 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-semibold text-white text-base mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Legal / Ethical Advisory Box */}
          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/60 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs text-slate-400">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <p className="leading-relaxed">
              <strong className="text-slate-200">Advisory Notice:</strong> TruthLens is a digital verification aid designed to assist researchers, journalists, and individuals in assessing digital media veracity. Automated forensic outputs are probabilistic indicators and do not constitute definitive judicial testimony or replace professional human fact-checking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
