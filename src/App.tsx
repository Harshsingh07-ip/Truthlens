import React, { useState, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { VerificationWorkspace } from './components/VerificationWorkspace';
import { CoreVerificationCards } from './components/CoreVerificationCards';
import { AnalysisResultsScreen } from './components/AnalysisResultsScreen';
import { HowItWorks } from './components/HowItWorks';
import { ZeroKnowledgeVault } from './components/ZeroKnowledgeVault';
import { TrustPrivacySection } from './components/TrustPrivacySection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ContentType, VerificationResult } from './types';
import { useAuth } from './context/AuthContext';
import { HistoryItem } from './services/historyService';

export default function App() {
  const [selectedType, setSelectedType] = useState<ContentType>('image');
  const [isScanning, setIsScanning] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [shutterTriggerCount, setShutterTriggerCount] = useState(0);

  // Auth & History State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);

  // Temporary / Incognito Mode State
  const [isIncognito, setIsIncognito] = useState(false);

  const workspaceRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const triggerShutter = () => {
    setShutterTriggerCount((prev) => prev + 1);
  };

  const handleScrollToVerify = () => {
    const el = document.getElementById('verify');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToZeroKnowledge = () => {
    const el = document.getElementById('zero-knowledge-vault');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectModuleType = (type: ContentType) => {
    setSelectedType(type);
    handleScrollToVerify();
  };

  const handleVerificationComplete = (result: VerificationResult) => {
    setVerificationResult(result);
    // Smooth scroll up to results screen
    setTimeout(() => {
      const el = document.getElementById('analysis-results-screen');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const handleReset = () => {
    setVerificationResult(null);
    handleScrollToVerify();
  };

  const handleGoHome = () => {
    setVerificationResult(null);
    setIsScanning(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    // Reconstruct result from history record
    const loadedResult: VerificationResult = {
      id: item.id,
      contentType: item.contentType as ContentType,
      targetTitle: item.targetTitle,
      targetPreviewUrl: item.targetPreviewUrl,
      targetRawText: item.targetRawText,
      timestamp: item.timestamp,
      hashSha256: item.hashSha256,
      status: item.status as any,
      verdictLabel: item.verdictLabel as any,
      confidenceScore: item.confidenceScore,
      summary: item.summary,
      whyThisResult: [
        'Restored from your authenticated forensic history archive.',
        `Original verdict classified as ${item.verdictLabel} (${item.confidenceScore}% confidence).`,
      ],
      forensicIndicators: [],
      metadataAudit: {
        hashSha256: item.hashSha256,
      },
      disclaimer:
        'Archived verification record retrieved from your account history in Firestore.',
      engineUsed: item.engineUsed || 'TruthLens AI',
    };

    setHistoryDrawerOpen(false);
    handleVerificationComplete(loadedResult);
  };

  return (
    <div className="min-h-screen bg-[#04060a] text-slate-100 relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 forensics-grid opacity-30 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#04060a]/60 to-[#04060a] pointer-events-none z-0" />

      {/* Forensic Top Bar & Navigation */}
      <Navbar
        onVerifyClick={handleScrollToVerify}
        onGoHome={handleGoHome}
        triggerShutter={triggerShutter}
        onOpenAuth={() => {
          setAuthModalMode('signin');
          setAuthModalOpen(true);
        }}
        onOpenHistory={() => {
          if (!user) {
            setAuthModalMode('signin');
            setAuthModalOpen(true);
          } else {
            setHistoryDrawerOpen(true);
          }
        }}
        isIncognito={isIncognito}
        onToggleIncognito={() => setIsIncognito((prev) => !prev)}
        onOpenZeroKnowledge={handleScrollToZeroKnowledge}
        verificationStatus={
          isScanning
            ? 'scanning'
            : verificationResult
            ? verificationResult.status
            : 'idle'
        }
      />

      {/* Main Content Flow */}
      <main className="relative z-10">
        {/* Results Screen or Standard Hero */}
        {verificationResult ? (
          <div className="pt-6">
            <AnalysisResultsScreen
              result={verificationResult}
              onReset={handleReset}
            />
          </div>
        ) : (
          <>
            <HeroSection
              onVerifyClick={handleScrollToVerify}
              onHowItWorksClick={handleScrollToHowItWorks}
              triggerShutter={triggerShutter}
            />

            {/* Omni Drag-and-Drop Verification Workspace */}
            <div ref={workspaceRef}>
              <VerificationWorkspace
                selectedType={selectedType}
                onSelectType={setSelectedType}
                onVerificationComplete={handleVerificationComplete}
                isScanning={isScanning}
                setIsScanning={setIsScanning}
                triggerShutter={triggerShutter}
                isIncognito={isIncognito}
                onToggleIncognito={() => setIsIncognito((prev) => !prev)}
              />
            </div>
          </>
        )}

        {/* 3D Core Verification Options */}
        <CoreVerificationCards
          selectedType={selectedType}
          onSelectType={handleSelectModuleType}
        />

        {/* Confidential Zero-Knowledge Intake & Victim Assistance Vault */}
        <ZeroKnowledgeVault
          onEnableZeroKnowledgeMode={() => {
            setIsIncognito(true);
            handleScrollToVerify();
          }}
          isIncognitoActive={isIncognito}
          onToggleIncognito={(active) => setIsIncognito(active)}
        />

        {/* Verification Architecture & Flow Pipeline */}
        <HowItWorks />

        {/* Trust, Ethics & Privacy Standards */}
        <TrustPrivacySection />

        {/* Final Call to Action */}
        <FinalCtaSection
          onStartVerifying={handleScrollToVerify}
          triggerShutter={triggerShutter}
        />
      </main>

      {/* Forensic Footer */}
      <Footer onGoHome={handleGoHome} />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      {/* History Slideout Drawer */}
      <HistoryDrawer
        isOpen={historyDrawerOpen}
        onClose={() => setHistoryDrawerOpen(false)}
        onSelectHistoryItem={handleSelectHistoryItem}
      />
    </div>
  );
}
