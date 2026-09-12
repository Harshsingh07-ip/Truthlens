import { db } from '../lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  writeBatch,
  limit,
} from 'firebase/firestore';
import { VerificationResult } from '../types';

export interface HistoryItem {
  id: string;
  targetTitle: string;
  contentType: string;
  verdictLabel: string;
  status: string;
  confidenceScore: number;
  summary: string;
  hashSha256: string;
  timestamp: string;
  targetPreviewUrl?: string;
  targetRawText?: string;
  engineUsed?: string;
}

export async function saveVerificationToHistory(
  userId: string,
  result: VerificationResult
): Promise<string> {
  const colRef = collection(db, 'users', userId, 'history');
  const record = {
    userId,
    targetTitle: result.targetTitle || 'Verification Target',
    contentType: result.contentType,
    verdictLabel: result.verdictLabel,
    status: result.status,
    confidenceScore: result.confidenceScore,
    summary: result.summary || '',
    hashSha256: result.hashSha256 || '',
    timestamp: result.timestamp || new Date().toISOString(),
    // Don't save large base64 strings directly in Firestore document to save document limits
    targetPreviewUrl: result.targetPreviewUrl && !result.targetPreviewUrl.startsWith('data:')
      ? result.targetPreviewUrl
      : undefined,
    targetRawText: result.targetRawText ? result.targetRawText.slice(0, 500) : undefined,
    engineUsed: result.engineUsed || 'TruthLens AI',
  };

  const docRef = await addDoc(colRef, record);
  return docRef.id;
}

export async function getUserVerificationHistory(
  userId: string,
  maxRecords: number = 50
): Promise<HistoryItem[]> {
  const colRef = collection(db, 'users', userId, 'history');
  const q = query(colRef, orderBy('timestamp', 'desc'), limit(maxRecords));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<HistoryItem, 'id'>),
  }));
}

export async function deleteHistoryItem(userId: string, recordId: string): Promise<void> {
  const docRef = doc(db, 'users', userId, 'history', recordId);
  await deleteDoc(docRef);
}

export async function clearAllUserHistory(userId: string): Promise<void> {
  const colRef = collection(db, 'users', userId, 'history');
  const snap = await getDocs(colRef);
  const batch = writeBatch(db);
  snap.docs.forEach((d) => {
    batch.delete(d.ref);
  });
  await batch.commit();
}
