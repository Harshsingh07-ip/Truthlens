export type ContentType = 'image' | 'video' | 'audio' | 'news_claim';

export type VerificationStatus = 'verified' | 'uncertain' | 'suspicious' | 'ai_generated';

export type VerdictLabel = 
  | 'Verified Genuine'
  | 'Likely Genuine'
  | 'Potentially Misleading'
  | 'Manipulated / Edited'
  | 'AI-Generated / Deepfake'
  | 'Needs More Evidence'
  | 'False / Fabricated';

export interface ForensicIndicator {
  id: string;
  category: 'visual_artifacts' | 'frequency_domain' | 'audio_harmonics' | 'metadata_provenance' | 'semantic_consistency' | 'source_cross_check';
  name: string;
  score: number; // 0 to 100 risk or deviation
  status: 'clean' | 'warning' | 'flagged';
  description: string;
  technicalDetails: string;
}

export interface ImageRegionMarker {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
  label: string;
  anomalyType: 
    | 'Diffusion Boundary'
    | 'Symmetry Inconsistency'
    | 'GAN Grid Artifact'
    | 'Clone Stamp / Splicing'
    | 'Pupil Reflection Mismatch'
    | 'Spectral Inconsistency';
  severity: 'low' | 'medium' | 'high';
  notes: string;
}

export interface VideoSegment {
  startSeconds: number;
  endSeconds: number;
  status: 'normal' | 'suspicious' | 'deepfake';
  anomalyDescription: string;
  confidence: number;
}

export interface AudioSegment {
  startSeconds: number;
  endSeconds: number;
  anomalyType: 
    | 'Vocoder Splicing'
    | 'Phase Discontinuity'
    | 'Acoustic Room Mismatch'
    | 'Synthetic Breath Pattern';
  risk: 'low' | 'medium' | 'high';
}

export interface SourceIntelligence {
  publication: string;
  url: string;
  date: string;
  credibility: 'High' | 'Medium' | 'Low' | 'State-Affiliated';
  credibilityScore: number;
  summary: string;
  reportingStance: 'confirms' | 'debunks' | 'neutral' | 'unrelated';
}

export interface TimelineEvent {
  timestamp: string;
  platformOrSource: string;
  eventTitle: string;
  description: string;
  spreadVelocity: 'Viral Surge' | 'Moderate' | 'Isolated';
}

export interface MetadataAudit {
  cameraModel?: string;
  softwareSignature?: string;
  compressionProfile?: string;
  domainOrigin?: string;
  audioSampleRate?: string;
  resolution?: string;
  hashSha256?: string;
}

export interface VerificationResult {
  id: string;
  contentType: ContentType;
  targetTitle: string;
  targetPreviewUrl?: string;
  targetRawText?: string;
  timestamp: string;
  hashSha256: string;
  status: VerificationStatus;
  verdictLabel: VerdictLabel;
  confidenceScore: number;
  summary: string;
  whyThisResult: string[];
  forensicIndicators: ForensicIndicator[];
  imageMarkers?: ImageRegionMarker[];
  videoSegments?: VideoSegment[];
  audioSegments?: AudioSegment[];
  sources?: SourceIntelligence[];
  timeline?: TimelineEvent[];
  metadataAudit: MetadataAudit;
  disclaimer: string;
  engineUsed?: string;
}

export interface SampleCase {
  id: string;
  contentType: ContentType;
  title: string;
  badge: string;
  description: string;
  expectedStatus: VerificationStatus;
  previewUrl?: string;
  rawText?: string;
  fileHint?: string;
}
