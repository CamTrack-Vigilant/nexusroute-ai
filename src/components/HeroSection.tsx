import React from 'react';
import { 
  ArrowRight, 
  Terminal, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  Network, 
  Shield, 
  Server, 
  Layers,
  Sparkles,
  GitBranch,
  Clock
} from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (tab: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-900 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900/60">
      {/* Precision Grid Background with Radial Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-700/60 text-cyan-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>STEALTH PROTOTYPING • PRE-SEED DEEP-TECH</span>
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono">
            <GitBranch className="w-3.5 h-3.5 text-blue-400" />
            <span>Multi-Topology GNN Matrices (Internet2, ATT-MPLS)</span>
          </div>
        </div>

        {/* Hero Title & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Autonomous, Self-Healing <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
                Network Backbones
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              NexusRoute AI replaces rigid, static routing protocols with deep reinforcement learning 
              and agentless edge observability. Eliminate congestion hotspots before packet drops occur, 
              reduce end-to-end latency by up to <strong className="text-cyan-300 font-semibold">41%</strong>, and execute instant 
              <strong className="text-cyan-300 font-semibold"> sub-100ms failovers</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center space-x-2 group"
              >
                <span>Launch Live Telemetry Engine</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('fastapi')}
                className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 font-mono text-xs sm:text-sm font-medium transition-all flex items-center space-x-2"
              >
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>FastAPI Telemetry Schema</span>
              </button>

              <button
                onClick={() => onNavigate('waitlist')}
                className="px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-cyan-800/40 text-cyan-300 text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Join Early-Access Program</span>
              </button>
            </div>

            {/* Founder & Validation Line */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-slate-800 border border-cyan-600/40 flex items-center justify-center font-mono text-cyan-400 font-bold">
                  TB
                </div>
                <div>
                  <p className="font-semibold text-slate-200">Thabang Nhlokoma Buthelezi</p>
                  <p className="text-[11px] text-slate-400">Founder & Lead Engineer, NexusRoute Labs</p>
                </div>
              </div>
              <span className="hidden sm:inline text-slate-600">•</span>
              <div className="flex items-center space-x-1.5 text-emerald-400 font-mono text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero-Overhead Agentless Probing</span>
              </div>
            </div>
          </div>

          {/* Interactive Live Matrix Snapshot Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-2xl backdrop-blur-sm relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-mono text-slate-300 font-medium">CORE-BACKBONE-SIMULATOR</span>
                </div>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                  DRL v4.2 Active
                </span>
              </div>

              {/* Topology Micro Visualization */}
              <div className="relative h-44 rounded-xl bg-slate-950 border border-slate-800/80 p-3 overflow-hidden flex flex-col justify-between">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Topology: Internet2 / ATT-MPLS</span>
                  <span className="text-emerald-400">Jitter: 0.22ms</span>
                </div>

                {/* Animated micro nodes */}
                <div className="relative h-24 flex items-center justify-between px-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-500/80 flex items-center justify-center text-[10px] font-mono font-bold text-blue-300 shadow-md shadow-blue-500/20">
                      SEA
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 mt-1">14.2ms</span>
                  </div>

                  <div className="flex-1 px-2 relative">
                    <div className="h-0.5 bg-slate-800 w-full relative">
                      <div className="absolute top-0 left-0 h-full w-1/3 bg-cyan-400 animate-[pulse_1.5s_infinite]"></div>
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-cyan-300">
                        84 Gbps Dynamic Flow
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-lg bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center text-[10px] font-mono font-bold text-cyan-200 shadow-lg shadow-cyan-400/30">
                      CHI
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 mt-1">18.6ms</span>
                  </div>

                  <div className="flex-1 px-2 relative">
                    <div className="h-0.5 bg-slate-800 w-full relative">
                      <div className="absolute top-0 right-0 h-full w-1/2 bg-blue-400 animate-[pulse_2s_infinite]"></div>
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-blue-300">
                        110 Gbps Core
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-500/80 flex items-center justify-center text-[10px] font-mono font-bold text-blue-300 shadow-md">
                      NYC
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 mt-1">12.3ms</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                  <span className="text-slate-400">Autonomous Congestion Reroute:</span>
                  <span className="text-emerald-300 font-bold">Latency reduced by -38.4%</span>
                </div>
              </div>

              {/* Real-time stats grid inside card */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800 text-xs">
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <p className="text-[10px] text-slate-400">Failover Execution</p>
                  <p className="font-mono font-bold text-sm text-cyan-300">64 ms <span className="text-[10px] font-normal text-emerald-400">(SLA &lt;100ms)</span></p>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <p className="text-[10px] text-slate-400">Packet Loss Mitigation</p>
                  <p className="font-mono font-bold text-sm text-emerald-400">0.001% <span className="text-[10px] font-normal text-slate-400">(-99.4%)</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Telemetry Metrics Strip */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-800/50 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-400">Latency Reduction</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-xl sm:text-2xl font-mono font-bold text-white">-41.2%</p>
            <p className="text-[11px] text-slate-400 mt-0.5">vs. Static Dijkstra / OSPF</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-800/50 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-400">Failover Latency</span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl sm:text-2xl font-mono font-bold text-emerald-400">&lt; 84 ms</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Sub-100ms Graph-Heuristic</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-800/50 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-400">Telemetry Ingestion</span>
              <Cpu className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-xl sm:text-2xl font-mono font-bold text-white">4.8M pkt/s</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Async FastAPI & Non-blocking</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-800/50 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-400">Backbone Uptime</span>
              <Shield className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-xl sm:text-2xl font-mono font-bold text-purple-300">99.999%</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Carrier-grade resilience</p>
          </div>
        </div>
      </div>
    </section>
  );
};
