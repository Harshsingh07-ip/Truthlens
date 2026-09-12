import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  History,
  Trash2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  FileQuestion,
  Sparkles,
  Calendar,
  Hash,
  Search,
  CheckCircle2,
  RefreshCw,
  LogOut,
  User,
  ShieldAlert,
  Ghost,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getUserVerificationHistory,
  deleteHistoryItem,
  clearAllUserHistory,
  HistoryItem,
} from '../services/historyService';
import { soundFx } from '../utils/audio';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHistoryItem?: (item: HistoryItem) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  onSelectHistoryItem,
}) => {
  const { user, logout } = useAuth();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const items = await getUserVerificationHistory(user.uid);
      setHistoryItems(items);
    } catch (e) {
      console.error('Failed to load history:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchHistory();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user) return;
    try {
      await deleteHistoryItem(user.uid, id);
      setHistoryItems((prev) => prev.filter((item) => item.id !== id));
      soundFx.playScanPing();
    } catch (err) {
      console.error('Failed to delete history item:', err);
    }
  };

  const handleClearAll = async () => {
    if (!user || historyItems.length === 0) return;
    if (!window.confirm('Are you sure you want to permanently clear your entire search and verification history?')) {
      return;
    }
    try {
      await clearAllUserHistory(user.uid);
      setHistoryItems([]);
      soundFx.playScanPing();
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  const filteredItems = historyItems.filter((item) => {
    const matchesSearch =
      item.targetTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.verdictLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.contentType === filterType;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-data bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3" /> Genuine
          </span>
        );
      case 'ai_generated':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-data bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-3 h-3" /> Deepfake
          </span>
        );
      case 'suspicious':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-data bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" /> Manipulated
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-data bg-slate-500/10 text-slate-400 border border-slate-500/30">
            <FileQuestion className="w-3 h-3" /> Uncertain
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative z-10 w-full max-w-xl h-full bg-slate-950 border-l border-slate-800/90 p-5 sm:p-6 flex flex-col shadow-2xl text-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-mono-data tracking-wide text-slate-100">
                Investigation History
              </h2>
              <p className="text-xs text-slate-400">
                {user?.email} • {historyItems.length} records saved
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchHistory}
              title="Refresh"
              className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-900 border border-slate-800"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-mono-data text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
            >
              Close
            </button>
          </div>
        </div>

        {/* User Account Info Bar */}
        <div className="my-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs font-mono-data">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold">
              {user?.displayName ? user.displayName[0].toUpperCase() : user?.email?.[0].toUpperCase() || 'U'}
            </div>
            <div>
              <div className="font-semibold text-slate-200">{user?.displayName || 'Authenticated Analyst'}</div>
              <div className="text-[11px] text-slate-500 truncate max-w-[200px]">{user?.email}</div>
            </div>
          </div>

          <button
            onClick={async () => {
              await logout();
              onClose();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="space-y-2 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, claim, or verdict..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 font-mono-data"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono-data text-slate-400">
            {['all', 'image', 'video', 'audio', 'news_claim'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded-lg border uppercase transition-colors whitespace-nowrap ${
                  filterType === t
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 font-semibold'
                    : 'bg-slate-900/50 border-slate-800/80 hover:text-slate-200'
                }`}
              >
                {t === 'all' ? 'All Types' : t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Records List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {loading ? (
            <div className="py-16 text-center">
              <RefreshCw className="w-6 h-6 animate-spin text-cyan-400 mx-auto mb-2" />
              <p className="text-xs font-mono-data text-slate-400">Loading your forensic history...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl p-6">
              <Ghost className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-400 mb-1">No search history recorded</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchTerm
                  ? 'No past investigations matched your search filter.'
                  : 'Verifications performed while logged in are automatically securely logged here for your reference.'}
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-cyan-500/40 transition-all hover:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getStatusBadge(item.status)}
                    <span className="text-[10px] font-mono-data text-slate-500 uppercase px-1.5 py-0.5 rounded bg-slate-800/60">
                      {item.contentType}
                    </span>
                    <span className="text-[10px] font-mono-data text-cyan-400">
                      {item.confidenceScore}% Confidence
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    title="Delete record"
                    className="p-1 rounded text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="text-xs font-semibold text-slate-200 line-clamp-1 mb-1 font-mono-data">
                  {item.targetTitle}
                </h4>

                <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                  {item.summary}
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono-data text-slate-500 pt-2 border-t border-slate-800/60">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[9px] text-slate-600">
                    <Hash className="w-2.5 h-2.5" />
                    <span>{item.hashSha256 ? item.hashSha256.slice(0, 10) : 'HASH'}...</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {filteredItems.length > 0 && (
          <div className="pt-4 mt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-[11px] font-mono-data text-slate-500">
              Showing {filteredItems.length} of {historyItems.length} records
            </span>
            <button
              onClick={handleClearAll}
              className="text-rose-400 hover:text-rose-300 font-mono-data text-xs flex items-center gap-1 hover:underline"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear All History</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
