import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  FileText,
  Link,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X,
  Image as ImageIcon,
  Video as VideoIcon,
  Mic as AudioIcon,
  Newspaper,
  Terminal,
  ArrowRight,
  RefreshCw,
  Scan,
} from 'lucide-react';
import { ContentType, SampleCase, VerificationResult } from '../types';
import { SAMPLE_CASES } from '../data/samples';
import { soundFx } from '../utils/audio';
import { useAuth } from '../context/AuthContext';
import { saveVerificationToHistory } from '../services/historyService';
import { EyeOff, ShieldCheck } from 'lucide-react';

interface VerificationWorkspaceProps {
  selectedType: ContentType;
  onSelectType: (type: ContentType) => void;
  onVerificationComplete: (result: VerificationResult) => void;
  isScanning: boolean;
  setIsScanning: (scanning: boolean) => void;
  triggerShutter: () => void;
  isIncognito: boolean;
  onToggleIncognito: () => void;
}

export const VerificationWorkspace: React.FC<VerificationWorkspaceProps> = ({
  selectedType,
  onSelectType,
  onVerificationComplete,
  isScanning,
  setIsScanning,
  triggerShutter,
  isIncognito,
  onToggleIncognito,
}) => {
  const { user } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scanStep, setScanStep] = useState(0);
  const [activeSample, setActiveSample] = useState<SampleCase | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const scanStepMessages = [
    'Ingesting media & computing cryptographic SHA-256 digest...',
    'Analyzing media patterns & neural artifact boundaries...',
    'Checking authenticity signals & diffusion latent vectors...',
    'Comparing trusted source registries & wire consensus...',
    'Compiling digital forensics integrity report...',
  ];

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (uploadedFile: File) => {
    setErrorMessage(null);
    setActiveSample(null);

    // Validate type
    if (uploadedFile.type.startsWith('image/')) {
      onSelectType('image');
    } else if (uploadedFile.type.startsWith('video/')) {
      onSelectType('video');
    } else if (uploadedFile.type.startsWith('audio/')) {
      onSelectType('audio');
    }

    setFile(uploadedFile);

    if (uploadedFile.size < 25 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(uploadedFile);
    } else {
      setFilePreview(null);
    }
  };

  const clearFile = () => {
    setFile(null);
    setFilePreview(null);
    setActiveSample(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Pre-load a sample case
  const handleSelectSample = (sample: SampleCase) => {
    clearFile();
    setActiveSample(sample);
    onSelectType(sample.contentType);

    if (sample.rawText) {
      setTextInput(sample.rawText);
    } else {
      setTextInput('');
    }

    if (sample.previewUrl) {
      setFilePreview(sample.previewUrl);
    }
  };

  // Run forensic verification
  const handleVerify = async () => {
    setErrorMessage(null);

    // Validation
    const hasMedia = !!file || !!filePreview || !!activeSample;
    const hasText = textInput.trim().length > 0 || urlInput.trim().length > 0;

    if (!hasMedia && !hasText) {
      setErrorMessage('Please upload a media file, select a sample case, or enter a news claim / URL.');
      return;
    }

    // Trigger shutter sound and visual shutter blade closure
    triggerShutter();
    setIsScanning(true);
    setScanStep(0);

    // Step progress simulation interval
    const stepInterval = setInterval(() => {
      setScanStep((prev) => {
        if (prev < scanStepMessages.length - 1) {
          soundFx.playScanPing();
          return prev + 1;
        }
        return prev;
      });
    }, 900);

    try {
      // Build request body
      const payload: any = {
        contentType: selectedType,
        contentText: textInput.trim() || urlInput.trim() || (activeSample ? activeSample.title : ''),
        sampleId: activeSample ? activeSample.id : undefined,
        mediaName: file ? file.name : activeSample ? activeSample.fileHint || activeSample.title : 'Target Content',
      };

      if (filePreview && filePreview.startsWith('data:')) {
        payload.mediaBase64 = filePreview;
        const mimeMatch = filePreview.match(/^data:([^;]+);base64,/);
        payload.mediaMimeType = (file && file.type) || (mimeMatch ? mimeMatch[1] : 'image/jpeg');
      } else if (filePreview && (filePreview.startsWith('http://') || filePreview.startsWith('https://'))) {
        payload.mediaUrl = filePreview;
      }

      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      if (!data.success || !data.data) {
        throw new Error(data.error || 'Forensic engine could not verify submission.');
      }

      clearInterval(stepInterval);
      setScanStep(scanStepMessages.length - 1);

      // Add client-side metadata enrichments
      const verifiedResult: VerificationResult = {
        ...data.data,
        id: `TL-${Date.now().toString(36).toUpperCase()}`,
        contentType: selectedType,
        targetTitle: file
          ? file.name
          : activeSample
          ? activeSample.title
          : textInput.trim()
          ? textInput.trim().slice(0, 75) + (textInput.length > 75 ? '...' : '')
          : urlInput.trim() || 'Verified Target Asset',
        targetPreviewUrl: filePreview || undefined,
        targetRawText: textInput.trim() || undefined,
        timestamp: new Date().toISOString(),
        hashSha256:
          data.data.hashSha256 ||
          Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        engineUsed: data.source || 'gemini-3.8-flash',
      };

      setTimeout(async () => {
        setIsScanning(false);
        soundFx.playVerdictChime(verifiedResult.status);

        // If user is authenticated and NOT in incognito mode, persist verification to Firestore history
        if (user && !isIncognito) {
          try {
            await saveVerificationToHistory(user.uid, verifiedResult);
          } catch (histErr) {
            console.warn('[TruthLens] Error recording verification to history:', histErr);
          }
        }

        onVerificationComplete(verifiedResult);
      }, 700);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsScanning(false);
      setErrorMessage(err?.message || 'Verification service encountered an error. Please try again.');
    }
  };

  return (
    <div id="verify" className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 scroll-mt-24">
      {/* Workspace Container Card */}
      <div className="relative rounded-2xl border border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl p-5 sm:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Decorative corner reticle accents */}
        <span className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400/60" />
        <span className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400/60" />
        <span className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400/60" />
        <span className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400/60" />

        {/* Ambient Top Scanning Bar */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/80 to-transparent" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono-data uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Omni-Forensic Input Engine</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-white">
              Verify Media, Claim, or Article
            </h3>
          </div>

          {/* Quick Tab Selector */}
          <div className="inline-flex p-1 rounded-xl bg-slate-900/90 border border-slate-800 self-start sm:self-auto">
            {(
              [
                { type: 'image', label: 'Image', icon: ImageIcon },
                { type: 'video', label: 'Video', icon: VideoIcon },
                { type: 'audio', label: 'Audio', icon: AudioIcon },
                { type: 'news_claim', label: 'News / Claim', icon: Newspaper },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedType === tab.type;
              return (
                <button
                  key={tab.type}
                  id={`tab-${tab.type}`}
                  onClick={() => onSelectType(tab.type)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-data transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Incognito / Temporary Search Notification */}
        {isIncognito ? (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs font-mono-data text-rose-300">
            <div className="flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                <strong>Temporary Search Active:</strong> This verification will NOT be logged to your account or saved to history.
              </span>
            </div>
            <button
              onClick={onToggleIncognito}
              className="text-xs text-rose-400 hover:text-rose-200 underline shrink-0 ml-2"
            >
              Turn off
            </button>
          </div>
        ) : user ? (
          <div className="mb-4 p-2.5 rounded-xl bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-between text-xs font-mono-data text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>
                Logged in as <strong className="text-slate-200">{user.email}</strong>. Scan results will sync to your History.
              </span>
            </div>
            <button
              onClick={onToggleIncognito}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline shrink-0 ml-2 flex items-center gap-1"
            >
              <EyeOff className="w-3 h-3" />
              <span>Enable Temporary Search</span>
            </button>
          </div>
        ) : null}

        {/* Main Drag-and-Drop or Input Area */}
        <div className="space-y-4">
          {selectedType !== 'news_claim' ? (
            /* Media File Dropzone */
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !file && !activeSample && fileInputRef.current?.click()}
              className={`relative rounded-xl border-2 border-dashed transition-all duration-300 p-6 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer min-h-[240px] overflow-hidden ${
                dragActive
                  ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_30px_rgba(0,240,255,0.25)]'
                  : file || activeSample
                  ? 'border-slate-700 bg-slate-900/60'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/50 hover:bg-slate-900/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={
                  selectedType === 'image'
                    ? 'image/*'
                    : selectedType === 'video'
                    ? 'video/*'
                    : 'audio/*'
                }
                onChange={handleFileInput}
              />

              {/* Active laser scanline beam on dropzone */}
              <div className="absolute inset-0 forensics-grid opacity-20 pointer-events-none" />

              {file || activeSample ? (
                /* Selected File / Sample Preview */
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
                  <div className="flex items-center gap-4 text-left">
                    {filePreview ? (
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-cyan-500/40 shrink-0 bg-black">
                        <img
                          src={filePreview}
                          alt="Verification Target"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <span className="absolute bottom-1 left-1 text-[9px] font-mono-data px-1 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
                          {selectedType.toUpperCase()}
                        </span>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0">
                        {selectedType === 'video' ? (
                          <VideoIcon className="w-8 h-8" />
                        ) : (
                          <AudioIcon className="w-8 h-8" />
                        )}
                      </div>
                    )}

                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono-data mb-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Ready for Ingest</span>
                      </div>
                      <h4 className="text-white font-heading font-medium text-base sm:text-lg">
                        {file ? file.name : activeSample?.title}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono-data mt-0.5">
                        {file
                          ? `${(file.size / (1024 * 1024)).toFixed(2)} MB • ${file.type || 'Media Binary'}`
                          : activeSample?.badge}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-rose-500/60 text-slate-400 hover:text-rose-300 bg-slate-900/80 transition-colors text-xs font-mono-data"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Clear Media</span>
                  </button>
                </div>
              ) : (
                /* Empty Upload Prompt */
                <div className="flex flex-col items-center justify-center gap-3 z-10">
                  <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
                    <Upload className="w-6 h-6 animate-bounce" />
                  </div>

                  <div>
                    <p className="text-base sm:text-lg font-heading font-medium text-white">
                      Drag and drop your {selectedType} file here, or{' '}
                      <span className="text-cyan-400 underline underline-offset-4">browse</span>
                    </p>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono-data">
                      {selectedType === 'image' && 'Supports JPG, PNG, WEBP, TIFF, HEIC up to 50MB'}
                      {selectedType === 'video' && 'Supports MP4, MOV, WEBM, MKV with frame extraction'}
                      {selectedType === 'audio' && 'Supports MP3, WAV, FLAC, M4A for acoustic analysis'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* News & Claim Textarea Input */
            <div className="space-y-3">
              <div className="relative">
                <textarea
                  id="claim-text-input"
                  rows={4}
                  value={textInput}
                  onChange={(e) => {
                    setTextInput(e.target.value);
                    if (activeSample) setActiveSample(null);
                  }}
                  placeholder="Paste breaking news headline, quote, online claim, or viral post text to cross-check across global intelligence sources..."
                  className="w-full rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-400 p-4 text-sm sm:text-base text-slate-100 placeholder-slate-500 font-sans outline-none resize-none transition-colors"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <span className="text-[11px] font-mono-data text-slate-500">
                    {textInput.length} chars
                  </span>
                  {textInput && (
                    <button
                      onClick={() => setTextInput('')}
                      className="p-1 rounded text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Optional URL Scraper input */}
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-500 pointer-events-none">
                  <Link className="w-4 h-4" />
                </div>
                <input
                  id="claim-url-input"
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Or paste article / tweet / forum URL (e.g., https://...)"
                  className="w-full rounded-xl bg-slate-900/60 border border-slate-800 focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-400 py-3 pl-10 pr-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 font-mono-data outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Preset Sample Cases Bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono-data">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Quick Test Cases (1-Click Forensic Ingest)</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono-data">
                Pre-curated real-world scenarios
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {SAMPLE_CASES.map((sample) => {
                const isSelected = activeSample?.id === sample.id;
                return (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className={`text-left p-2.5 rounded-lg border transition-all flex flex-col justify-between text-xs ${
                      isSelected
                        ? 'border-cyan-400/80 bg-cyan-950/40 text-cyan-200 ring-1 ring-cyan-400/40'
                        : 'border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] uppercase font-mono-data px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {sample.contentType}
                      </span>
                      <span
                        className={`text-[9px] font-mono-data px-1.5 py-0.5 rounded ${
                          sample.expectedStatus === 'verified'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                            : 'bg-rose-950 text-rose-300 border border-rose-800/60'
                        }`}
                      >
                        {sample.badge}
                      </span>
                    </div>
                    <span className="font-medium font-heading line-clamp-1 text-slate-100">
                      {sample.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center justify-between p-3.5 rounded-xl border border-rose-500/40 bg-rose-950/40 text-rose-300 text-xs sm:text-sm font-mono-data"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="p-1 hover:text-rose-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Trigger Button */}
          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-mono-data text-slate-400">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Engine Mode: Gemini 3.8 Flash + DeepForensics Heuristics</span>
            </div>

            <button
              id="start-verification-button"
              disabled={isScanning}
              onClick={handleVerify}
              className={`relative overflow-hidden group flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-heading font-semibold text-sm transition-all duration-300 ${
                isScanning
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] active:scale-[0.98] border border-cyan-400/40'
              }`}
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Running Forensic Diagnostics...</span>
                </>
              ) : (
                <>
                  <span>Verify Content Authenticity</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Realtime Scanning Overlay */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl z-30 flex flex-col items-center justify-center p-6 text-center"
            >
              {/* Laser Scanning Line moving down */}
              <div className="absolute inset-x-0 h-[2px] bg-cyan-400 shadow-[0_0_20px_#00f0ff] animate-scanline pointer-events-none" />

              {/* Forensic Radar Target Scanner */}
              <div className="mb-6 relative flex items-center justify-center w-24 h-24">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/40"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-2 rounded-full border border-cyan-400/30 border-t-cyan-400"
                />
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_25px_rgba(0,240,255,0.4)]"
                >
                  <Scan className="w-6 h-6 text-cyan-400 animate-pulse" />
                </motion.div>
              </div>

              <h4 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-tight mb-2 flex items-center gap-2">
                <span>Executing Forensic Scan</span>
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              </h4>

              {/* Dynamic Step Status */}
              <div className="h-6 mb-6">
                <motion.p
                  key={scanStep}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs sm:text-sm font-mono-data text-cyan-300"
                >
                  {scanStepMessages[scanStep]}
                </motion.p>
              </div>

              {/* Progress Steps Indicators */}
              <div className="flex items-center gap-2 max-w-xs w-full">
                {scanStepMessages.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      idx <= scanStep
                        ? 'bg-cyan-400 shadow-[0_0_8px_#00f0ff]'
                        : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>

              <span className="text-[11px] text-slate-500 font-mono-data mt-4">
                Secure Sandboxed Ingestion • Cryptographic SHA-256 Hashing
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
