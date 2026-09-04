import React, { useState } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Send, 
  FileCode, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  Play,
  Flame,
  Activity,
  Code2
} from 'lucide-react';
import { FASTAPI_CODE_SNIPPET } from '../data/mockData';

export const FastApiExplorer: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'code' | 'schema' | 'tester'>('tester');
  
  // Interactive Tester State
  const [batchSize, setBatchSize] = useState<number>(10);
  const [clusterId, setClusterId] = useState<string>('nexus-core-us-east');
  const [trafficClass, setTrafficClass] = useState<string>('ultra_low_latency');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [responseLog, setResponseLog] = useState<any>({
    status: 202,
    statusText: 'Accepted',
    responseTimeMs: 3.4,
    body: {
      status: 'accepted',
      batch_id: 'BATCH-8F92E10A',
      records_received: 10,
      processing_mode: 'asynchronous_pipeline',
      checksum_verified: true,
      estimated_inference_latency_ms: 12.4
    }
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(FASTAPI_CODE_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSimulateRequest = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      const randomBatch = 'BATCH-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      const mockElapsed = Number((2.8 + Math.random() * 2.2).toFixed(1));
      
      setResponseLog({
        status: 202,
        statusText: 'Accepted',
        responseTimeMs: mockElapsed,
        body: {
          status: 'accepted',
          batch_id: randomBatch,
          cluster_id: clusterId,
          records_received: batchSize,
          traffic_class: trafficClass,
          processing_mode: 'asynchronous_pipeline_worker',
          checksum_verified: true,
          estimated_inference_latency_ms: Number((11.2 + Math.random() * 3).toFixed(1)),
          timestamp: new Date().toISOString()
        }
      });
    }, 450);
  };

  return (
    <section id="fastapi" className="py-16 bg-slate-950 border-b border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 text-xs font-mono mb-3">
              <Terminal className="w-3.5 h-3.5" />
              <span>PRODUCTION FASTAPI ROUTE & TELEMETRY SCHEMAS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Asynchronous Telemetry Ingestion Architecture
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl">
              High-throughput asynchronous FastAPI microservice schema engineered for receiving real-time edge telemetry 
              batches and executing sub-100ms deep reinforcement learning routing decisions.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyCode}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono font-medium flex items-center space-x-2 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-cyan-400" />
                  <span>Copy Complete Python main.py</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('tester')}
            className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold flex items-center space-x-2 transition-all ${
              activeTab === 'tester'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Interactive Ingestion Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold flex items-center space-x-2 transition-all ${
              activeTab === 'code'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>FastAPI Python Source Code</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold flex items-center space-x-2 transition-all ${
              activeTab === 'schema'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Endpoints Specification</span>
          </button>
        </div>

        {/* Tab 1: Interactive Ingestion Tester */}
        {activeTab === 'tester' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Controls */}
            <div className="lg:col-span-5 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-white text-base font-mono flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-cyan-400" />
                  <span>Telemetry Payload Dispatcher</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  HTTP 202 Async Pipeline
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Target Cluster / AS Identifier</label>
                <input
                  type="text"
                  value={clusterId}
                  onChange={(e) => setClusterId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Edge Batch Telemetry Records: <span className="text-cyan-400 font-bold">{batchSize} nodes</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={batchSize}
                  onChange={(e) => setBatchSize(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>1 node</span>
                  <span>50 nodes</span>
                  <span>100 nodes (Max batch)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Traffic Routing Class</label>
                <select
                  value={trafficClass}
                  onChange={(e) => setTrafficClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="ultra_low_latency">ultra_low_latency (VoIP, HFT, Gaming)</option>
                  <option value="high_throughput">high_throughput (CDN, Cloud Backups)</option>
                  <option value="resilient">resilient (Multi-Hop High Redundancy)</option>
                </select>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Endpoint:</span>
                  <span className="text-cyan-300 font-bold">POST /api/v1/telemetry/ingest</span>
                </div>
                <div className="flex justify-between">
                  <span>Background Execution:</span>
                  <span className="text-emerald-400">FastAPI BackgroundTasks</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Response SLA:</span>
                  <span className="text-slate-300">&lt; 5.0 ms</span>
                </div>
              </div>

              <button
                onClick={handleSimulateRequest}
                disabled={isSending}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-bold shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all"
              >
                {isSending ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>Transmitting Telemetry Batch...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Batch Ingestion Request</span>
                  </>
                )}
              </button>
            </div>

            {/* Right Live Response */}
            <div className="lg:col-span-7 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                      {responseLog.status} {responseLog.statusText}
                    </span>
                    <span className="text-slate-400">Latency: <strong className="text-cyan-300">{responseLog.responseTimeMs} ms</strong></span>
                  </div>
                  <span className="text-slate-400 text-[11px]">Async Background Dispatch: ACK</span>
                </div>

                <p className="text-xs font-mono text-slate-400 mb-2">Ingestion Receipt (JSON Response Body):</p>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto">
                  <pre className="text-xs font-mono text-cyan-300">
                    {JSON.stringify(responseLog.body, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
                <div className="flex items-center space-x-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Payload Integrity Verified (SHA-256)</span>
                </div>
                <span>DRL Reward Loop: Updated</span>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Full Python Code */}
        {activeTab === 'code' && (
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
              <span>main.py (FastAPI Async Telemetry Engine)</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 text-xs font-mono text-slate-300 overflow-x-auto max-h-[500px] scrollbar-thin">
              <code>{FASTAPI_CODE_SNIPPET}</code>
            </pre>
          </div>
        )}

        {/* Tab 3: Endpoints Specification Summary */}
        {activeTab === 'schema' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono text-xs font-bold">
                  POST
                </span>
                <span className="font-mono text-xs text-white font-semibold">/api/v1/telemetry/ingest</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Asynchronously ingests telemetry probe arrays from up to 5,000 edge nodes. Returns 202 Accepted within 4ms.
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-400 space-y-1 border-t border-slate-800">
                <p>Status: <span className="text-emerald-400">202 Accepted</span></p>
                <p>Payload: BatchTelemetryIngestRequest</p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-xs font-bold">
                  GET
                </span>
                <span className="font-mono text-xs text-white font-semibold">/api/v1/telemetry/status</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Returns cluster health, backbone latency averages, active GNN weights version, and sub-100ms failover status.
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-400 space-y-1 border-t border-slate-800">
                <p>Status: <span className="text-emerald-400">200 OK</span></p>
                <p>Payload: ClusterHealthStatus</p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono text-xs font-bold">
                  POST
                </span>
                <span className="font-mono text-xs text-white font-semibold">/api/v1/routes/optimize</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Executes deep reinforcement learning graph inference to calculate optimal next-hop paths and backup routes.
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-400 space-y-1 border-t border-slate-800">
                <p>Status: <span className="text-emerald-400">200 OK</span></p>
                <p>Inference Time: &lt; 20 ms</p>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
