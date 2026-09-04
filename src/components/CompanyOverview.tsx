import React from 'react';
import { 
  Building2, 
  Target, 
  Users, 
  Compass, 
  Cpu, 
  ShieldCheck, 
  Binary, 
  Sparkles, 
  CheckCircle,
  Network,
  Award,
  Globe2,
  TerminalSquare
} from 'lucide-react';

export const CompanyOverview: React.FC = () => {
  return (
    <section className="py-16 bg-slate-950 border-b border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 text-xs font-mono mb-3">
              <Building2 className="w-3.5 h-3.5" />
              <span>COMPANY DOSSIER & PROFILE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineering Autonomous Backbones at NexusRoute Labs
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md mt-3 md:mt-0 font-normal">
            Grounded in real-world systems engineering, deep reinforcement learning, and distributed network theory.
          </p>
        </div>

        {/* Founder & Stage Spotlight Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Identity & Stage Card */}
          <div className="lg:col-span-7 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">Entity Identity</span>
                <h3 className="text-2xl font-bold text-white mt-1">NexusRoute AI</h3>
                <p className="text-xs text-slate-400 font-mono">Operating as NexusRoute Labs • Deep-Tech Research</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium">
                  Pre-seed • Stealth Prototyping
                </span>
              </div>
            </div>

            {/* Core Mission */}
            <div className="py-6 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <span>Core Mission</span>
              </div>
              <p className="text-slate-200 text-base leading-relaxed">
                To build the next generation of autonomous, self-healing network backbones using deep reinforcement 
                learning and edge observability, eliminating congestion hotspots and reducing packet latency across 
                complex distributed networks.
              </p>
            </div>

            {/* Founder Profile */}
            <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center font-mono font-bold text-white text-lg shadow-md shadow-cyan-600/30">
                  TB
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Thabang Nhlokoma Buthelezi</h4>
                  <p className="text-xs text-cyan-300 font-medium">Founder & Lead Systems Engineer</p>
                  <p className="text-[11px] text-slate-400">Specialization: Autonomous Traffic Engineering & Edge Telemetry</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Research Prototyping & Patents Pending</span>
              </div>
            </div>
          </div>

          {/* Operational Directives & Philosophy */}
          <div className="lg:col-span-5 rounded-2xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-3">
                <TerminalSquare className="w-4 h-4" />
                <span>Operational Directives</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Technically Rigorous. Direct. Grounded in Silicon.
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                NexusRoute AI rejects buzzwords in favor of verifiable network simulation metrics, 
                asynchronous telemetry streaming, and deterministic sub-100ms failover proofs tested against 
                standard topologies like Internet2 and ATT-MPLS.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center space-x-2 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Agentless non-invasive kernel packet probing</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Sub-100ms deterministic graph-heuristic failovers</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Open-core benchmarking suites for academic research</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Status: Stealth R&D</span>
              <span className="text-cyan-400">Location: Global Distributed</span>
            </div>
          </div>
        </div>

        {/* Dual Target Audience & Market Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Segment 1: Enterprise B2B */}
          <div className="rounded-xl bg-slate-900/40 border border-slate-800 p-6 hover:border-slate-700 transition-colors">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-blue-950/80 border border-blue-700/50 flex items-center justify-center text-blue-400">
                <Globe2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Enterprise B2B Infrastructure</h4>
                <p className="text-xs text-slate-400">Mission-critical distributed backbones</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              Engineered for telecommunications providers, mid-to-large Internet Service Providers (ISPs), 
              automated logistics distribution hubs, and distributed multi-cloud enterprises suffering from 
              unpredictable link congestion and transit billing spikes.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono">
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">Tier-1 & Tier-2 ISPs</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">Multi-Cloud Interconnects</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">Financial Low-Latency Extranets</span>
            </div>
          </div>

          {/* Segment 2: Developer & Research Ecosystem */}
          <div className="rounded-xl bg-slate-900/40 border border-slate-800 p-6 hover:border-slate-700 transition-colors">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-700/50 flex items-center justify-center text-cyan-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Developer & Research Ecosystem</h4>
                <p className="text-xs text-slate-400">Open-core tooling & benchmarking APIs</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              Empowering network engineers, distributed systems researchers, and university labs with 
              open-core graph simulation testbeds, reproducible reinforcement learning weights, and 
              Pydantic-validated telemetry pipelines.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono">
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">Internet2 & Mininet Suites</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">FastAPI Ingestion SDK</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">GNN Graph-Gym Sandboxes</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
