import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Database, 
  KeyRound, 
  FileCheck, 
  RefreshCw, 
  DownloadCloud, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { BackupSnapshot, UserRole } from '../types';
import { INITIAL_BACKUPS } from '../data/mockData';

interface SecurityAndBackupsProps {
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
}

export const SecurityAndBackups: React.FC<SecurityAndBackupsProps> = ({
  activeRole,
  setActiveRole,
}) => {
  const [backups, setBackups] = useState<BackupSnapshot[]>(INITIAL_BACKUPS);
  const [isCreatingSnapshot, setIsCreatingSnapshot] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Simulated dynamic API key
  const [apiKey, setApiKey] = useState<string>('nr_live_sec_99a84f18d7b32c0e81a943');

  const permissions: Record<UserRole, {
    canInjectCongestion: boolean;
    canRerouteDRL: boolean;
    canTriggerBackups: boolean;
    canViewRawTelemetry: boolean;
    canGenerateKeys: boolean;
  }> = {
    NetworkAdmin: {
      canInjectCongestion: true,
      canRerouteDRL: true,
      canTriggerBackups: true,
      canViewRawTelemetry: true,
      canGenerateKeys: true,
    },
    EdgeEngineer: {
      canInjectCongestion: false,
      canRerouteDRL: true,
      canTriggerBackups: true,
      canViewRawTelemetry: true,
      canGenerateKeys: true,
    },
    ResearchAnalyst: {
      canInjectCongestion: false,
      canRerouteDRL: false,
      canTriggerBackups: false,
      canViewRawTelemetry: true,
      canGenerateKeys: false,
    },
    ReadOnlyObserver: {
      canInjectCongestion: false,
      canRerouteDRL: false,
      canTriggerBackups: false,
      canViewRawTelemetry: false,
      canGenerateKeys: false,
    }
  };

  const handleCreateSnapshot = () => {
    if (!permissions[activeRole].canTriggerBackups) {
      setStatusNotice('Permission Denied: Must have NetworkAdmin or EdgeEngineer privileges.');
      setTimeout(() => setStatusNotice(null), 3500);
      return;
    }

    setIsCreatingSnapshot(true);
    setTimeout(() => {
      setIsCreatingSnapshot(false);
      const newSnapshot: BackupSnapshot = {
        id: `SNP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10 + Math.random() * 89)}`,
        timestamp: 'Just now',
        snapshotType: 'manual_admin',
        sizeMb: 43.1,
        sha256Hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        stateMatrixVersion: 'v2.4.2-verified',
        status: 'verified'
      };
      setBackups([newSnapshot, ...backups]);
      setStatusNotice('Snapshot created and cryptographic SHA-256 verified successfully.');
      setTimeout(() => setStatusNotice(null), 3500);
    }, 600);
  };

  const handleGenerateNewKey = () => {
    const newKey = 'nr_live_sec_' + Array.from({ length: 22 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setApiKey(newKey);
    setStatusNotice('New HMAC bearer token rotated and committed to vault.');
    setTimeout(() => setStatusNotice(null), 3500);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <section id="security" className="py-16 bg-slate-950 border-b border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 text-xs font-mono mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CARRIER-GRADE SECURITY & IMMUTABLE BACKUPS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              End-to-End Encryption & Automated State Snapshots
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl">
              Zero-trust telemetry encryption (TLS 1.3 / AES-GCM-256), fine-grained multi-role access control, 
              and hourly cryptographic state matrix replication for uninterrupted high availability.
            </p>
          </div>

          {statusNotice && (
            <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-700 text-xs font-mono text-cyan-200 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>{statusNotice}</span>
            </div>
          )}
        </div>

        {/* 3 Security Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-cyan-400">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-mono">End-to-End Encryption (E2EE)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              All edge probe packets and control plane signals are encrypted with AES-256-GCM. 
              Payloads include signed cryptographic nonces preventing replay and man-in-the-middle attacks.
            </p>
            <div className="pt-2 text-[11px] font-mono text-emerald-400 flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>TLS 1.3 Enforced • Zero-Plaintext Transmission</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-700/50 flex items-center justify-center text-blue-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-mono">Multi-Role Administrative RBAC</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Strict separation of concerns between Network Admins (topology mutation), Edge Engineers 
              (telemetry monitoring), and Research Fellows (read-only benchmarks).
            </p>
            <div className="pt-2 text-[11px] font-mono text-cyan-300 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Active Identity: {activeRole}</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-700/50 flex items-center justify-center text-purple-400">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-mono">Automated State Snapshots</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Deterministic state checkpointing every 60 minutes and prior to any dynamic DRL rerouting. 
              Enables zero-downtime rollbacks with sub-second state recovery.
            </p>
            <div className="pt-2 text-[11px] font-mono text-purple-300 flex items-center space-x-1.5">
              <FileCheck className="w-3.5 h-3.5" />
              <span>3 Immutable Checkpoints Online</span>
            </div>
          </div>

        </div>

        {/* Interactive Snapshot Manager & Cryptographic Token Vault */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Snapshots Table (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-base font-mono">Topology State Snapshot Registry</h3>
              </div>
              <button
                onClick={handleCreateSnapshot}
                disabled={isCreatingSnapshot}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold flex items-center space-x-1.5 shadow-md transition-all"
              >
                {isCreatingSnapshot ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Replicating...</span>
                  </>
                ) : (
                  <>
                    <DownloadCloud className="w-3.5 h-3.5" />
                    <span>Create State Snapshot</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-3">
              {backups.map((b) => (
                <div key={b.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">{b.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-emerald-300 border border-emerald-800/60 font-semibold">
                      {b.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-400 text-[11px] my-1">
                    <span>Timestamp: {b.timestamp}</span>
                    <span>Matrix: {b.stateMatrixVersion}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-500 flex items-center justify-between">
                    <span className="truncate max-w-[280px]">SHA-256: {b.sha256Hash}</span>
                    <span className="text-cyan-400">{b.sizeMb} MB</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RBAC Key Vault (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <KeyRound className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-bold text-white text-base font-mono">Cryptographic Access Token</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                  {activeRole}
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                Include this bearer token in the <code className="text-cyan-300">X-Nexus-API-Key</code> header 
                for authenticated telemetry ingestion and autonomous routing commands.
              </p>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 mb-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Token ID:</span>
                  <button
                    onClick={handleCopyKey}
                    className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-[11px]"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="font-mono text-xs text-emerald-400 mt-1 break-all bg-slate-900 p-2 rounded border border-slate-800/80">
                  {apiKey}
                </p>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <p className="text-slate-400 font-semibold mb-1">Effective Role Permissions:</p>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Inject Network Hotspot:</span>
                  <span className={permissions[activeRole].canInjectCongestion ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                    {permissions[activeRole].canInjectCongestion ? 'ENABLED' : 'RESTRICTED'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Autonomous DRL Rebalancing:</span>
                  <span className={permissions[activeRole].canRerouteDRL ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                    {permissions[activeRole].canRerouteDRL ? 'ENABLED' : 'RESTRICTED'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Create Database Snapshots:</span>
                  <span className={permissions[activeRole].canTriggerBackups ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                    {permissions[activeRole].canTriggerBackups ? 'ENABLED' : 'RESTRICTED'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={handleGenerateNewKey}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Rotate Secret Key</span>
              </button>
              <span className="text-[11px] font-mono text-slate-500">Cross-Platform Compatible</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
