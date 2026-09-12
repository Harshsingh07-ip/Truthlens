import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldOff,
  EyeOff,
  Lock,
  Flame,
  AlertOctagon,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  FileCheck,
  Zap,
  Info,
  LifeBuoy,
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface ZeroKnowledgeVaultProps {
  onEnableZeroKnowledgeMode: () => void;
  isIncognitoActive: boolean;
  onToggleIncognito: (active: boolean) => void;
}

export const ZeroKnowledgeVault: React.FC<ZeroKnowledgeVaultProps> = ({
  onEnableZeroKnowledgeMode,
  isIncognitoActive,
  onToggleIncognito,
}) => {
  const [hasCopiedHash, setHasCopiedHash] = useState(false);
  const [expandedResource, setExpandedResource] = useState<string | null>(null);

  const victimAssistanceResources = [
    {
      id: 'stopncii',
      name: 'StopNCII.org',
      badge: 'Global Non-Profit Initiative',
      description:
        'Operated by the Revenge Porn Helpline / SWGfL. Generates cryptographic perceptual image hashes locally on your device without uploading your actual photos, sharing hashes with participating tech companies (Meta, TikTok, Reddit, OnlyFans, etc.) to proactively block distribution.',
      url: 'https://stopncii.org',
      features: ['Local Device Hashing', 'No Raw Image Upload', 'Direct Platform Blocklist'],
    },
    {
      id: 'takeitdown',
      name: 'Take It Down (NCMEC)',
      badge: 'Official Youth / Under-18 Protection',
      description:
        'Operated by the National Center for Missing & Exploited Children (NCMEC). Protects individuals under 18 from non-consensual explicit images and deepfakes by creating direct hash signatures to purge content across web providers.',
      url: 'https://takeitdown.ncmec.org',
      features: ['Federal & International Wire', 'Minor Safety Enforcement', 'Immediate Takedown Notices'],
    },
    {
      id: 'cybercivilrights',
      name: 'Cyber Civil Rights Initiative (CCRI)',
      badge: 'Legal & Victim Advocacy',
      description:
        'Provides pro-bono legal guidance, emergency victim hotlines, and statutory resources for victims of non-consensual deepfake pornography, online extortion, and unauthorized synthetic media.',
      url: 'https://cybercivilrights.org',
      features: ['24/7 Helpline', 'Legal Victim Consultation', 'Digital Evidence Preservation Guidelines'],
    },
  ];

  return (
    <section id="zero-knowledge-vault" className="py-12 border-t border-slate-800/80 bg-gradient-to-b from-[#04060a] via-rose-950/10 to-[#04060a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Banner Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-rose-500/30 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-data bg-rose-500/15 border border-rose-500/40 text-rose-300 font-semibold uppercase tracking-wider">
                  <EyeOff className="w-3.5 h-3.5" /> Zero-Knowledge Private Intake
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono-data bg-slate-800/80 text-slate-300 border border-slate-700">
                  <Lock className="w-3 h-3 text-cyan-400" /> Ephemeral In-Memory Execution
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-mono-data text-slate-100 tracking-tight">
                Confidential Deepfake Victim & Intimate Media Intake
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                If you or someone you know has been targeted with non-consensual deepfake pornography, synthetic blackmail, or malicious intimate face-swaps, you can analyze the material here under <strong className="text-rose-300 font-semibold">guaranteed Zero-Knowledge protocols</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono-data">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                  <ShieldOff className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200 block">No Account Tied</span>
                    <span className="text-slate-400 text-[11px]">Identity is stripped before processing. Zero user linking.</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                  <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200 block">Immediate Auto-Burn</span>
                    <span className="text-slate-400 text-[11px]">Never saved to Firestore, database logs, or server disks.</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200 block">Client-Side Evidence Hash</span>
                    <span className="text-slate-400 text-[11px]">Generate tamper-proof cryptographic proofs for legal counsel.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Toggle */}
            <div className="lg:col-span-4 flex flex-col justify-center p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div>
                <span className="text-xs font-mono-data uppercase text-slate-400 tracking-wider block mb-1">
                  Private Session Status
                </span>
                <div className="text-sm font-bold font-mono-data text-slate-200 flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${isIncognitoActive ? 'bg-rose-500 animate-pulse' : 'bg-slate-600'}`} />
                  <span>{isIncognitoActive ? 'Zero-Knowledge Mode Active' : 'Standard Session Mode'}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-normal">
                Activating this mode ensures upcoming searches and uploads are processed anonymously and burned immediately upon report delivery.
              </p>

              <button
                onClick={() => {
                  onToggleIncognito(!isIncognitoActive);
                  soundFx.playScanPing();
                }}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono-data font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border ${
                  isIncognitoActive
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 hover:bg-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                    : 'bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <EyeOff className="w-4 h-4" />
                <span>{isIncognitoActive ? 'Deactivate Incognito' : 'Enable Zero-Knowledge Mode'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Legal & Removal Directives */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold font-mono-data uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-rose-400" />
                <span>Authorized Removal & Protection Networks</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Official third-party initiatives that facilitate emergency takedowns and cross-platform hash blocking
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {victimAssistanceResources.map((res) => (
              <div
                key={res.id}
                className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 hover:border-rose-500/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono-data px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20">
                      {res.badge}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 mb-1.5 font-mono-data flex items-center gap-1.5">
                    {res.name}
                  </h4>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {res.description}
                  </p>

                  <div className="space-y-1.5 mb-4">
                    {res.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] font-mono-data text-slate-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 text-xs font-mono-data text-slate-200 hover:text-rose-300 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Visit {res.name}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
