import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UploadCloud, Cpu, Globe, CheckCircle2, ChevronRight, Binary, ShieldAlert } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      step: '01',
      title: 'Ingest & Hash',
      subtitle: 'Upload or Paste Content',
      icon: UploadCloud,
      color: '#00f0ff',
      description:
        'Upload images, videos, audio recordings, or paste viral news claims. TruthLens computes an immutable cryptographic SHA-256 fingerprint in an isolated client sandbox.',
      technicalDetails:
        'Client-side zero-retention memory buffer • C2PA metadata validation • Binary integrity validation',
    },
    {
      step: '02',
      title: 'Neural Deconstruction',
      subtitle: 'AI Artifact & Latent Analysis',
      icon: Cpu,
      color: '#3b82f6',
      description:
        'Multi-layer forensic models inspect sensor noise patterns, frequency discrepancies, facial landmark jitter, and neural vocoder voice-cloning frequencies.',
      technicalDetails:
        'Gemini 3.8 Flash multimodal reasoning • Error Level Analysis (ELA) • Discrete Cosine Transform (DCT) • Mel-Frequency Spectrograms',
    },
    {
      step: '03',
      title: 'Cross-Intelligence',
      subtitle: 'Source Cross-Checking',
      icon: Globe,
      color: '#8b5cf6',
      description:
        'For news claims and media provenance, the engine queries verified global wire registries (AP, Reuters, AFP) to trace historical origins and coordinated amplification.',
      technicalDetails:
        'Google Search factual grounding • Chronological spread mapping • Reverse image perceptual hash databases',
    },
    {
      step: '04',
      title: 'Forensic Verdict',
      subtitle: 'Clear Verification Result',
      icon: CheckCircle2,
      color: '#10b981',
      description:
        'Receive a transparent probabilistic confidence score, annotated artifact regions, source reliability breakdown, and an exportable tamper-evident dossier.',
      technicalDetails:
        'Confidence score (0–100%) • Annotated bounding box overlay • Official PDF/JSON forensic report generation',
    },
  ];

  return (
    <section id="how-it-works" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono-data mb-3">
          <Binary className="w-3.5 h-3.5" />
          <span>Verification Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
          How TruthLens Verifies Authenticity
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2">
          A four-stage forensic pipeline combining advanced neural heuristics, frequency transforms, and real-time wire intelligence.
        </p>
      </div>

      {/* Interactive Process Pipeline */}
      <div className="relative">
        {/* Continuous Flowing Connection Line (visible on desktop) */}
        <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 -translate-y-8 bg-gradient-to-r from-cyan-500/20 via-blue-500/30 to-emerald-500/20 z-0" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {steps.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeStep === index;

            return (
              <motion.div
                key={index}
                onClick={() => setActiveStep(index)}
                whileHover={{ y: -4 }}
                className={`relative rounded-xl p-6 transition-all duration-300 cursor-pointer border flex flex-col justify-between ${
                  isActive
                    ? 'border-cyan-500/60 bg-slate-900/90 shadow-[0_10px_30px_rgba(0,240,255,0.15)] ring-1 ring-cyan-400/40'
                    : 'border-slate-800/80 bg-slate-950/60 hover:bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                {/* Step Number Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono-data font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    STEP {item.step}
                  </span>
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-colors ${
                      isActive
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Step Titles */}
                <div>
                  <h4 className="text-lg font-heading font-bold text-white tracking-tight mb-1">
                    {item.title}
                  </h4>
                  <div className="text-xs font-mono-data text-cyan-400 mb-2">
                    {item.subtitle}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Technical Underpinnings Drawer */}
                <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] font-mono-data text-slate-500">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase mb-0.5">
                    Forensic Methods:
                  </span>
                  <span className="line-clamp-2">{item.technicalDetails}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
