import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Image, Video, Mic, Newspaper, ChevronRight, ShieldCheck, Activity, Search, Cpu } from 'lucide-react';
import { ContentType } from '../types';

interface CoreVerificationCardsProps {
  onSelectType: (type: ContentType) => void;
  selectedType: ContentType;
}

interface CardData {
  type: ContentType;
  title: string;
  badge: string;
  icon: React.ElementType;
  description: string;
  accentColor: string;
  borderColor: string;
  glowColor: string;
  specs: { label: string; value: string }[];
  detects: string[];
}

export const CoreVerificationCards: React.FC<CoreVerificationCardsProps> = ({
  onSelectType,
  selectedType,
}) => {
  const cards: CardData[] = [
    {
      type: 'image',
      title: 'Image Deepfake Detection',
      badge: 'Visual Forensics',
      icon: Image,
      description: 'Scrutinizes pixel-level sensor noise, Fourier frequency transforms, and corneal reflection symmetry.',
      accentColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      glowColor: 'rgba(6, 182, 212, 0.4)',
      specs: [
        { label: 'Technique', value: 'Error Level Analysis (ELA)' },
        { label: 'Latency', value: '~1.2s neural pass' },
        { label: 'Precision', value: '99.2% on Diffusion' },
      ],
      detects: [
        'Midjourney & Stable Diffusion artifacts',
        'Pupil reflection & shadow misalignment',
        'Clone-stamp & splicing boundaries',
        'EXIF & C2PA credential tampering',
      ],
    },
    {
      type: 'video',
      title: 'Video Deepfake Detection',
      badge: 'Temporal Integrity',
      icon: Video,
      description: 'Tracks temporal landmark cohesion, blink rate anomalies, and optical flow phoneme-lip synchronization.',
      accentColor: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      glowColor: 'rgba(59, 130, 246, 0.4)',
      specs: [
        { label: 'Technique', value: '3D Mesh Optical Flow' },
        { label: 'Keyframes', value: '60 fps deconstruction' },
        { label: 'Audio Sync', value: '±15ms tolerance' },
      ],
      detects: [
        'Face-swap mask edge bleeding',
        'Micro-expression & blink suppression',
        'Generative video temporal flickering',
        'Desynchronized audio-to-viseme track',
      ],
    },
    {
      type: 'audio',
      title: 'Audio Deepfake Detection',
      badge: 'Acoustic Forensics',
      icon: Mic,
      description: 'Deconstructs harmonic resonance, phase discontinuities, and artificial vocoder spectral frequency cutoffs.',
      accentColor: 'text-violet-400',
      borderColor: 'border-violet-500/30',
      glowColor: 'rgba(139, 92, 246, 0.4)',
      specs: [
        { label: 'Technique', value: 'Mel-Frequency Cepstral' },
        { label: 'Range', value: '20 Hz – 48,000 Hz' },
        { label: 'Profiling', value: 'Neural Vocoder Fingerprint' },
      ],
      detects: [
        'Voice cloning model signatures',
        '16kHz artificial spectral shelf drop',
        'Absence of natural biological breathing',
        'Phase jump splice discontinuities',
      ],
    },
    {
      type: 'news_claim',
      title: 'News & Claim Verification',
      badge: 'Source Intelligence',
      icon: Newspaper,
      description: 'Cross-checks breaking headlines across 50,000+ verified wires, tracking origin chronology and sentiment manipulation.',
      accentColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      specs: [
        { label: 'Corpus', value: 'Global Wire Registry' },
        { label: 'Origin', value: 'Chronological Mapping' },
        { label: 'Grounding', value: 'Google Search & AP/Reuters' },
      ],
      detects: [
        'Fabricated quotes & phantom treaties',
        'Coordinated bot network amplification',
        'Out-of-context historical recycling',
        'Deceptive clickbait sentiment surges',
      ],
    },
  ];

  return (
    <div id="core-verification-options" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono-data uppercase tracking-widest mb-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>Forensic Capabilities</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white tracking-tight">
            Multi-Modal Authenticity Analysis
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-1 max-w-2xl">
            Choose a specialized digital forensic module or feed content directly into the omni-scanner.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-mono-data bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Active Neural Heuristics: v4.2.8</span>
        </div>
      </div>

      {/* Grid of 4 Interactive 3D Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;
          const isSelected = selectedType === card.type;

          return (
            <TiltCard
              key={card.type}
              card={card}
              isSelected={isSelected}
              onSelect={() => onSelectType(card.type)}
            />
          );
        })}
      </div>
    </div>
  );
};

// 3D Card Sub-Component with dynamic mouse perspective
const TiltCard: React.FC<{
  card: CardData;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ card, isSelected, onSelect }) => {
  const Icon = card.icon;
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const limit = 9;
    setRotX(-((y - centerY) / centerY) * limit);
    setRotY(((x - centerX) / centerX) * limit);
  };

  const handleMouseLeave = () => {
    setRotX(0);
    setRotY(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      style={{
        perspective: 900,
      }}
      className="h-full"
    >
      <motion.div
        id={`card-${card.type}`}
        onClick={onSelect}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: rotX,
          rotateY: rotY,
          scale: isSelected ? 1.02 : isHovered ? 1.015 : 1,
          translateZ: isHovered || isSelected ? 12 : 0,
        }}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 300,
          mass: 0.3,
        }}
        style={{
          boxShadow: isSelected
            ? `0 14px 40px -10px ${card.glowColor}`
            : isHovered
            ? `0 10px 30px -10px ${card.glowColor}`
            : '0 4px 20px -5px rgba(0,0,0,0.5)',
        }}
        className={`relative flex flex-col justify-between rounded-xl p-5 sm:p-6 transition-all duration-300 cursor-pointer overflow-hidden border ${
          isSelected
            ? `${card.borderColor} bg-slate-900/90 ring-1 ring-cyan-400/50`
            : isHovered
            ? 'border-slate-700 bg-slate-900/80'
            : 'border-slate-800/80 bg-slate-950/60'
        }`}
      >
        {/* Subtle grid pattern inside card */}
        <div className="absolute inset-0 forensics-grid opacity-30 pointer-events-none" />

        {/* Ambient Top Glow Line */}
        <div
          className={`absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300 ${
            isSelected || isHovered ? 'opacity-100' : 'opacity-20'
          }`}
          style={{
            background: `linear-gradient(90deg, transparent, ${card.accentColor.includes('cyan') ? '#00f0ff' : card.accentColor.includes('blue') ? '#3b82f6' : card.accentColor.includes('violet') ? '#a855f7' : '#10b981'}, transparent)`,
          }}
        />

        {/* Top Header */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-11 h-11 rounded-lg flex items-center justify-center border transition-all duration-300 ${
                isSelected || isHovered
                  ? 'bg-slate-800 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>

            <span className="text-[11px] font-mono-data px-2 py-0.5 rounded-full border border-slate-800 bg-slate-900/70 text-slate-400">
              {card.badge}
            </span>
          </div>

          <h3 className="text-lg font-heading font-semibold text-white tracking-tight mb-2 flex items-center gap-1.5">
            {card.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
            {card.description}
          </p>
        </div>

        {/* Specifications Pill Bar */}
        <div className="relative z-10 border-t border-slate-800/80 pt-3.5 mt-auto">
          <div className="grid grid-cols-3 gap-1.5 mb-3 text-center">
            {card.specs.map((spec, i) => (
              <div key={i} className="bg-slate-900/60 rounded px-1.5 py-1 border border-slate-800/60">
                <div className="text-[9px] uppercase font-mono-data text-slate-500 tracking-wider">
                  {spec.label}
                </div>
                <div className="text-[10px] font-mono-data text-slate-200 font-medium truncate">
                  {spec.value}
                </div>
              </div>
            ))}
          </div>

          {/* Expanded Detects Indicators (revealed or accented on hover/active) */}
          <motion.div
            animate={{
              height: isHovered || isSelected ? 'auto' : 0,
              opacity: isHovered || isSelected ? 1 : 0,
              marginTop: isHovered || isSelected ? 8 : 0,
            }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden space-y-1.5"
          >
            <div className="text-[10px] uppercase font-mono-data text-cyan-400 font-semibold tracking-wider mb-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Target Signals</span>
            </div>
            {card.detects.map((det, idx) => (
              <div
                key={idx}
                className="text-[11px] text-slate-300 flex items-start gap-1.5 font-sans leading-tight"
              >
                <span className="text-cyan-400 font-bold">•</span>
                <span>{det}</span>
              </div>
            ))}
          </motion.div>

          {/* Action trigger button */}
          <div className="mt-3 flex items-center justify-between text-xs font-mono-data pt-2 border-t border-slate-800/50">
            <span
              className={`transition-colors ${
                isSelected ? 'text-cyan-300 font-medium' : 'text-slate-400'
              }`}
            >
              {isSelected ? 'Engine Selected' : 'Configure Scanner'}
            </span>
            <ChevronRight
              className={`w-4 h-4 transition-transform ${
                isSelected
                  ? 'text-cyan-400 translate-x-1'
                  : isHovered
                  ? 'text-slate-200 translate-x-0.5'
                  : 'text-slate-600'
              }`}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
