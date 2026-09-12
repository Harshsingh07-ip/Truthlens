import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  AlertTriangle,
  Flame,
  HelpCircle,
  Download,
  Share2,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Layers,
  Eye,
  Activity,
  Play,
  Pause,
  Copy,
  Check,
  FileCheck,
  Clock,
  Globe,
  Radio,
  FileText,
  Sliders,
} from 'lucide-react';
import { VerificationResult, ImageRegionMarker, ContentType } from '../types';
import { soundFx } from '../utils/audio';

interface AnalysisResultsScreenProps {
  result: VerificationResult;
  onReset: () => void;
}

export const AnalysisResultsScreen: React.FC<AnalysisResultsScreenProps> = ({
  result,
  onReset,
}) => {
  const [activeImageLayer, setActiveImageLayer] = useState<'composite' | 'ela' | 'raw'>('composite');
  const [selectedMarker, setSelectedMarker] = useState<ImageRegionMarker | null>(
    result.imageMarkers?.[0] || null
  );
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeVideoTime, setActiveVideoTime] = useState(4.2);

  // Status visual scheme
  const getStatusTheme = () => {
    switch (result.status) {
      case 'verified':
        return {
          color: '#10b981',
          bg: 'bg-emerald-950/40',
          border: 'border-emerald-500/40',
          text: 'text-emerald-400',
          ring: '#10b981',
          icon: ShieldCheck,
        };
      case 'uncertain':
        return {
          color: '#f59e0b',
          bg: 'bg-amber-950/40',
          border: 'border-amber-500/40',
          text: 'text-amber-400',
          ring: '#f59e0b',
          icon: HelpCircle,
        };
      case 'suspicious':
        return {
          color: '#f97316',
          bg: 'bg-orange-950/40',
          border: 'border-orange-500/40',
          text: 'text-orange-400',
          ring: '#f97316',
          icon: AlertTriangle,
        };
      case 'ai_generated':
      default:
        return {
          color: '#ef4444',
          bg: 'bg-rose-950/40',
          border: 'border-rose-500/40',
          text: 'text-rose-400',
          ring: '#ef4444',
          icon: Flame,
        };
    }
  };

  const theme = getStatusTheme();
  const StatusIcon = theme.icon;

  const copyHash = () => {
    navigator.clipboard.writeText(result.hashSha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const toggleAudio = () => {
    setAudioPlaying(!audioPlaying);
    if (!audioPlaying) soundFx.playScanPing();
  };

  return (
    <div id="analysis-results-screen" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-300 hover:text-white text-xs font-mono-data transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Scan Another Asset</span>
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-mono-data text-cyan-400 truncate max-w-xs">
            {result.id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/80 text-slate-300 hover:text-white text-xs font-mono-data transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Evidence</span>
          </button>
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono-data font-medium transition-all shadow-[0_0_15px_rgba(0,240,255,0.15)]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Dossier</span>
          </button>
        </div>
      </div>

      {/* Main Verdict Card with Circular Progress Scanner */}
      <div
        className={`relative rounded-2xl p-6 sm:p-8 border ${theme.border} ${theme.bg} backdrop-blur-xl mb-8 overflow-hidden`}
      >
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 forensics-grid opacity-25 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Circular Scanner Gauge */}
          <div className="relative flex items-center justify-center shrink-0">
            {/* Circular Radar Background */}
            <svg className="w-48 h-48 sm:w-56 sm:h-56 -rotate-90 transform">
              {/* Outer tick ring */}
              <circle
                cx="50%"
                cy="50%"
                r="82"
                className="stroke-slate-800"
                strokeWidth="2"
                fill="transparent"
                strokeDasharray="4 8"
              />
              {/* Track */}
              <circle
                cx="50%"
                cy="50%"
                r="74"
                className="stroke-slate-900"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Animated Progress Indicator */}
              <motion.circle
                cx="50%"
                cy="50%"
                r="74"
                stroke={theme.color}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 74}
                initial={{ strokeDashoffset: 2 * Math.PI * 74 }}
                animate={{
                  strokeDashoffset:
                    2 * Math.PI * 74 * (1 - result.confidenceScore / 100),
                }}
                transition={{ duration: 1.6, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>

            {/* Inner Content of Scanner */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <span className="text-[11px] font-mono-data uppercase tracking-widest text-slate-400">
                Confidence
              </span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-4xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
                  {result.confidenceScore}
                </span>
                <span className="text-xl font-heading text-cyan-400 font-bold">%</span>
              </div>
              <span
                className={`text-xs font-mono-data font-semibold mt-1 px-2 py-0.5 rounded-full border ${theme.border} ${theme.bg} ${theme.text}`}
              >
                {result.verdictLabel}
              </span>
            </div>
          </div>

          {/* Verdict Description & Target Overview */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/80 text-xs font-mono-data text-slate-300 mb-3">
              <StatusIcon className={`w-4 h-4 ${theme.text}`} />
              <span>Forensic Classification:</span>
              <strong className={theme.text}>{result.verdictLabel}</strong>
            </div>

            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight mb-3">
              {result.targetTitle}
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4 max-w-2xl">
              {result.summary}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-mono-data text-slate-400">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{new Date(result.timestamp).toLocaleTimeString()} UTC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>Engine: {result.engineUsed || 'Gemini 3.8 Flash'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Hash Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content-Specific Forensic Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left Column: Visual/Audio/Timeline Inspector (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Image Inspection Module */}
          {result.contentType === 'image' && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-heading font-bold text-white text-base">
                    Artifact Matrix & Region Overlay
                  </h3>
                </div>

                {/* Layer Selector */}
                <div className="inline-flex p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono-data">
                  <button
                    onClick={() => setActiveImageLayer('composite')}
                    className={`px-2.5 py-1 rounded ${
                      activeImageLayer === 'composite'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Anomalies
                  </button>
                  <button
                    onClick={() => setActiveImageLayer('ela')}
                    className={`px-2.5 py-1 rounded ${
                      activeImageLayer === 'ela'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ELA Heatmap
                  </button>
                  <button
                    onClick={() => setActiveImageLayer('raw')}
                    className={`px-2.5 py-1 rounded ${
                      activeImageLayer === 'raw'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Original
                  </button>
                </div>
              </div>

              {/* Image Preview Canvas with Interactive Hotspots */}
              <div className="relative rounded-lg overflow-hidden bg-black border border-slate-800 aspect-video flex items-center justify-center">
                <img
                  src={
                    result.targetPreviewUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
                  }
                  alt="Forensic Inspect"
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    activeImageLayer === 'ela'
                      ? 'filter invert contrast-150 hue-rotate-180 brightness-75'
                      : ''
                  }`}
                />

                {/* ELA Overlay Effect */}
                {activeImageLayer === 'ela' && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/30 via-violet-500/20 to-transparent mix-blend-color-dodge pointer-events-none">
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-cyan-500/60 text-cyan-300 text-[10px] font-mono-data">
                      Error Level Analysis: High Compression Disparity
                    </span>
                  </div>
                )}

                {/* Bounding Box Markers */}
                {activeImageLayer === 'composite' &&
                  result.imageMarkers?.map((marker) => {
                    const isSelected = selectedMarker?.id === marker.id;
                    return (
                      <div
                        key={marker.id}
                        onClick={() => setSelectedMarker(marker)}
                        style={{
                          left: `${marker.x}%`,
                          top: `${marker.y}%`,
                          width: `${marker.width}%`,
                          height: `${marker.height}%`,
                        }}
                        className={`absolute border-2 transition-all cursor-pointer rounded ${
                          isSelected
                            ? 'border-rose-500 bg-rose-500/25 shadow-[0_0_15px_#ef4444]'
                            : 'border-orange-400/80 bg-orange-400/15 hover:border-rose-400'
                        }`}
                      >
                        <span className="absolute -top-5 left-0 px-1.5 py-0.5 rounded bg-black/90 text-rose-300 text-[9px] font-mono-data border border-rose-500/50 whitespace-nowrap shadow-md">
                          {marker.anomalyType}
                        </span>
                      </div>
                    );
                  })}
              </div>

              {/* Selected Marker Diagnostic Details */}
              {selectedMarker && (
                <div className="mt-4 p-3.5 rounded-lg border border-slate-800 bg-slate-900/60 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-heading font-semibold text-white">
                        {selectedMarker.label}
                      </span>
                      <span className="text-[10px] font-mono-data px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/60">
                        {selectedMarker.severity.toUpperCase()} RISK
                      </span>
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      {selectedMarker.notes}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono-data text-cyan-400 whitespace-nowrap">
                    {selectedMarker.anomalyType}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Video Timeline Scrubber Module */}
          {result.contentType === 'video' && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <h3 className="font-heading font-bold text-white text-base">
                    Temporal Frame Breakdown & Landmark Sync
                  </h3>
                </div>
                <span className="text-xs font-mono-data text-slate-400">
                  Total Duration: 00:15.0
                </span>
              </div>

              {/* Timeline scrubber bar */}
              <div className="relative h-12 bg-slate-900 rounded-lg p-1.5 border border-slate-800 flex items-center gap-1 mb-4 overflow-hidden">
                {result.videoSegments?.map((seg, idx) => {
                  const widthPct = ((seg.endSeconds - seg.startSeconds) / 15) * 100;
                  const isFlagged = seg.status === 'deepfake' || seg.status === 'suspicious';
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveVideoTime(seg.startSeconds)}
                      style={{ width: `${widthPct}%` }}
                      className={`h-full rounded cursor-pointer transition-all relative group flex items-center justify-center text-[10px] font-mono-data font-bold ${
                        seg.status === 'deepfake'
                          ? 'bg-rose-950 border border-rose-500 text-rose-300'
                          : seg.status === 'suspicious'
                          ? 'bg-amber-950 border border-amber-500 text-amber-300'
                          : 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-400'
                      }`}
                    >
                      <span>{seg.status === 'deepfake' ? 'ALTERED' : 'CLEAN'}</span>
                    </div>
                  );
                })}

                {/* Scrubber head */}
                <div
                  style={{ left: `${(activeVideoTime / 15) * 100}%` }}
                  className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_#00f0ff] pointer-events-none"
                />
              </div>

              {/* Video Keyframe Segment findings */}
              <div className="space-y-2">
                {result.videoSegments?.map((seg, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-slate-800/80 bg-slate-900/40 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono-data text-slate-400">
                        {seg.startSeconds}s - {seg.endSeconds}s:
                      </span>
                      <span className="text-slate-200">{seg.anomalyDescription}</span>
                    </div>
                    <span
                      className={`font-mono-data text-[10px] px-2 py-0.5 rounded ${
                        seg.status === 'deepfake'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {seg.confidence}% Conf.
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audio Waveform Module */}
          {result.contentType === 'audio' && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-violet-400" />
                  <h3 className="font-heading font-bold text-white text-base">
                    Acoustic Waveform & Spectral Anomalies
                  </h3>
                </div>

                <button
                  onClick={toggleAudio}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/40 text-xs font-mono-data transition-colors"
                >
                  {audioPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause Analysis</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Play Track</span>
                    </>
                  )}
                </button>
              </div>

              {/* Dynamic Waveform Simulation */}
              <div className="h-28 rounded-lg bg-slate-900/90 border border-slate-800 p-4 flex items-center justify-between gap-1 mb-4 overflow-hidden">
                {Array.from({ length: 42 }).map((_, i) => {
                  const isAnomalyZone = (i >= 12 && i <= 18) || (i >= 26 && i <= 32);
                  const baseHeight = 20 + ((i * 17) % 65);
                  return (
                    <div
                      key={i}
                      style={{
                        height: audioPlaying
                          ? `${Math.max(15, (baseHeight + (i % 5) * 10) % 100)}%`
                          : `${baseHeight}%`,
                      }}
                      className={`w-1.5 rounded-full transition-all duration-150 ${
                        isAnomalyZone
                          ? 'bg-rose-500 shadow-[0_0_8px_#ef4444]'
                          : 'bg-cyan-500/60'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Flagged Audio Segments */}
              <div className="space-y-2">
                {result.audioSegments?.map((seg, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-slate-800 bg-slate-900/50 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono-data text-slate-400">
                        {seg.startSeconds}s – {seg.endSeconds}s:
                      </span>
                      <span className="text-slate-200 font-medium">{seg.anomalyType}</span>
                    </div>
                    <span className="text-[10px] font-mono-data px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                      {seg.risk.toUpperCase()} PROBABILITY
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* News & Claim Sources & Chronology Module */}
          {result.contentType === 'news_claim' && (
            <div className="space-y-6">
              {/* Sources Cards */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-heading font-bold text-white text-base">
                      Cross-Referenced Source Intelligence
                    </h3>
                  </div>
                  <span className="text-xs font-mono-data text-slate-400">
                    {result.sources?.length || 0} Registered Corroborations
                  </span>
                </div>

                <div className="space-y-3">
                  {result.sources?.map((source, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-semibold text-white text-sm">
                            {source.publication}
                          </span>
                          <span className="text-[10px] font-mono-data text-slate-500">
                            • {source.date}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-mono-data px-2 py-0.5 rounded ${
                              source.reportingStance === 'confirms'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : source.reportingStance === 'debunks'
                                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {source.reportingStance.toUpperCase()}
                          </span>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-400 hover:text-cyan-400"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        {source.summary}
                      </p>

                      <div className="mt-2 flex items-center gap-3 text-[11px] font-mono-data text-slate-500">
                        <span>Credibility: {source.credibility}</span>
                        <span>•</span>
                        <span>Trust Score: {source.credibilityScore}/100</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Source Timeline Component */}
              {result.timeline && result.timeline.length > 0 && (
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-heading font-bold text-white text-base">
                      Origin & Spread Chronology
                    </h3>
                  </div>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                    {result.timeline.map((event, idx) => (
                      <div key={idx} className="relative">
                        <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-4 ring-slate-950" />
                        <div className="flex items-center justify-between gap-2 text-xs font-mono-data text-cyan-400 mb-0.5">
                          <span>{event.timestamp}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                            {event.spreadVelocity}
                          </span>
                        </div>
                        <h4 className="text-white text-sm font-heading font-medium">
                          {event.eventTitle} ({event.platformOrSource})
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {event.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cryptographic Metadata Audit Block */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-bold text-white text-sm flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                <span>Forensic Metadata & Provenance Audit</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono-data mb-3">
              <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">
                  Hardware Signature
                </span>
                <span className="text-slate-200 truncate block mt-0.5">
                  {result.metadataAudit.cameraModel || 'No Hardware EXIF Stamp'}
                </span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">
                  Software Profile
                </span>
                <span className="text-slate-200 truncate block mt-0.5">
                  {result.metadataAudit.softwareSignature || 'Unknown Pipeline'}
                </span>
              </div>
            </div>

            {/* SHA-256 Digest */}
            <div className="flex items-center justify-between gap-2 p-2 rounded bg-slate-900 border border-slate-800 text-xs font-mono-data">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-slate-500 text-[10px] uppercase shrink-0">
                  SHA-256:
                </span>
                <span className="text-slate-300 truncate">{result.hashSha256}</span>
              </div>
              <button
                onClick={copyHash}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white shrink-0"
              >
                {copiedHash ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: "Why this result?" Explanations & Indicators (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono-data uppercase tracking-wider mb-2">
                <Sliders className="w-3.5 h-3.5" />
                <span>Forensic Diagnostics</span>
              </div>

              <h3 className="text-xl font-heading font-bold text-white tracking-tight mb-4">
                Why this result?
              </h3>

              {/* Observable Indicators List */}
              <div className="space-y-3 mb-6">
                {result.whyThisResult.map((reason, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed"
                  >
                    <span className="text-cyan-400 font-bold shrink-0 mt-0.5">•</span>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>

              {/* Technical Indicator Metrics */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono-data uppercase text-slate-500 tracking-wider">
                  Technical Indicator Scores
                </h4>

                {result.forensicIndicators.map((ind) => (
                  <div
                    key={ind.id}
                    className="p-3 rounded-lg border border-slate-800 bg-slate-900/40 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-heading font-medium text-slate-200">
                        {ind.name}
                      </span>
                      <span
                        className={`text-[10px] font-mono-data px-1.5 py-0.5 rounded ${
                          ind.status === 'clean'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : ind.status === 'warning'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {ind.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-slate-400 text-[11px] mb-2">
                      {ind.description}
                    </p>

                    <div className="text-[10px] font-mono-data text-cyan-400/80 bg-slate-950/60 px-2 py-1 rounded border border-slate-800/60">
                      {ind.technicalDetails}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal / Fact-Checking Disclaimer */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 leading-relaxed">
              <strong className="text-slate-400">Forensic Notice:</strong> {result.disclaimer}
            </div>
          </div>
        </div>
      </div>

      {/* Printable / Downloadable Forensic Dossier Modal */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-slate-950 border border-cyan-500/40 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-mono-data font-bold">
                    TL
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white text-lg">
                      TruthLens Digital Forensic Dossier
                    </h3>
                    <p className="text-xs font-mono-data text-slate-400">
                      ID: {result.id} • Certified Integrity Record
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-slate-400 hover:text-white font-mono-data text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Printable Body */}
              <div className="space-y-4 text-xs sm:text-sm font-sans">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 font-mono-data text-xs block">Target Title</span>
                    <strong className="text-white">{result.targetTitle}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono-data text-xs block">Final Verdict</span>
                    <strong className={theme.text}>{result.verdictLabel} ({result.confidenceScore}%)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono-data text-xs block">Verification Date</span>
                    <span className="text-slate-300 font-mono-data">{new Date(result.timestamp).toUTCString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono-data text-xs block">Engine Model</span>
                    <span className="text-slate-300 font-mono-data">{result.engineUsed || 'Gemini 3.8 Flash'}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-heading font-bold text-white mb-1">Executive Summary</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">{result.summary}</p>
                </div>

                <div>
                  <h4 className="font-heading font-bold text-white mb-1">Key Forensic Evidence</h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300">
                    {result.whyThisResult.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded bg-slate-900 border border-slate-800 font-mono-data text-[11px] text-slate-400 break-all">
                  <span className="text-cyan-400 font-semibold block mb-0.5">Cryptographic SHA-256 Seal:</span>
                  {result.hashSha256}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white text-xs font-mono-data"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-heading font-bold text-xs hover:bg-cyan-400 transition-colors shadow-lg"
                >
                  Print / Save Official PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative"
            >
              <h3 className="font-heading font-bold text-white text-lg mb-2">
                Share Evidence Dossier
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Disseminate verified authenticity credentials with a tamper-evident link.
              </p>

              <div className="p-3 rounded-lg border border-slate-800 bg-slate-900 flex items-center justify-between text-xs font-mono-data mb-4">
                <span className="text-cyan-400 truncate">
                  https://truthlens.ai/v/{result.id}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://truthlens.ai/v/${result.id}`);
                    alert('Verification link copied to clipboard!');
                  }}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white shrink-0 ml-2"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-center mb-4">
                <span className="text-[10px] font-mono-data uppercase text-slate-500 block mb-1">
                  Embeddable Seal Preview
                </span>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/40 bg-cyan-950/50 text-cyan-300 text-xs font-mono-data">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified by TruthLens • {result.verdictLabel}</span>
                </div>
              </div>

              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono-data transition-colors"
              >
                Dismiss
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
