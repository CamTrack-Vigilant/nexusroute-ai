import React, { useState } from 'react';
import { 
  Network, 
  ShieldAlert, 
  GitFork, 
  Cpu, 
  Activity, 
  Zap, 
  CheckCircle2, 
  ArrowUpRight,
  Workflow,
  Sliders,
  Database,
  Search
} from 'lucide-react';

export const ProductSuite: React.FC = () => {
  const [activeProduct, setActiveProduct] = useState<number>(0);

  const products = [
    {
      id: 'routing-engine',
      title: 'Autonomous Traffic Routing Engine',
      category: 'Core DRL Optimizer',
      summary: 'Continuous topology matrix learning with dynamic bandwidth allocation and proactive rerouting before buffers saturate.',
      bullets: [
        'Trained on diverse carrier matrices: Internet2, ATT-MPLS, and custom multi-cloud transit graphs.',
        'Graph Convolutional Networks (GCN) coupled with Deep Q-Networks (DQN) for predictive multi-path allocation.',
        'Eliminates micro-burst congestion hotspots 400ms prior to queue tail-drops.',
        'Dynamic flow-table re-indexing without disruptive BGP route flap dampening.'
      ],
      technicalSpec: {
        modelArchitecture: 'Graph Neural Network (GNN) + Deep Q-Learning',
        trainingTopology: 'Internet2 9-Node Core, ATT-MPLS 25-Node Multi-Hop',
        inferenceLatency: '< 18.2 ms at 100K active concurrent flows',
        trafficClasses: 'Ultra-Low-Latency (VoIP/HFT), High-Throughput (CDN/Backups), Resilient'
      },
      badgeColor: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'edge-telemetry',
      title: 'Intelligent Edge Telemetry & Security',
      category: 'Agentless Observability Layer',
      summary: 'Kernel-level non-invasive packet flow monitoring, latency jitter tracking, and integrated anomaly intrusion signature analysis.',
      bullets: [
        'Agentless eBPF-inspired telemetry layer with zero overhead on existing forwarding silicon.',
        'Microsecond-resolution RTT tracking across peering PoPs and IXP interconnects.',
        'Embedded isolation forest and lightweight autoencoders detecting DDoS SYN floods and anomalous transit shifts.',
        'Cryptographic telemetry verification (SHA-256 payload integrity check) on every ingestion packet.'
      ],
      technicalSpec: {
        probeResolution: '100 microseconds per sampled microflow',
        telemetryOverhead: '< 0.08% CPU utilization on edge switch ASIC control planes',
        threatSignatures: 'SYN flood, BGP hijack route leak, link flapping, buffer bloat',
        dataProtocol: 'Protobuf / Async REST & gRPC streaming'
      },
      badgeColor: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'topology-planner',
      title: 'Self-Healing Topology Planner',
      category: 'Resilience & Placement Engine',
      summary: 'Graph-heuristic optimization for optimal SDN controller placement and instant sub-100ms failover routing.',
      bullets: [
        'Automated controller placement minimizing worst-case propagation delays across distributed datacenters.',
        'Instant sub-100ms deterministic failover: pre-computed graph alternatives activated without wait-and-see probing.',
        'Synthetic link-failure simulator validating N-1 and N-2 catastrophic fiber cut scenarios.',
        'Automated state snapshotting and rollback safety guarantees.'
      ],
      technicalSpec: {
        failoverSLA: '< 84 ms deterministic recovery (Industry avg: 1.2 - 3.5s)',
        simulationEngine: 'Graph-heuristic A* with DRL reward penalty for multi-hop hops',
        placementAlgorithm: 'K-Medoids & Spectral Graph Partitioning',
        snapshotInterval: 'Automated periodic snapshots + pre-reroute immutable state checkpoints'
      },
      badgeColor: 'from-emerald-500 to-teal-600'
    }
  ];

  return (
    <section id="products" className="py-16 bg-slate-950 border-b border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 text-xs font-mono mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>CORE PRODUCTS & TECHNICAL STACK</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Architected for Sub-Millisecond Precision
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            Three synergistic pillars uniting edge intelligence, deep reinforcement learning, and deterministic graph resilience.
          </p>
        </div>

        {/* Product Selection Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {products.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setActiveProduct(idx)}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeProduct === idx
                  ? 'bg-slate-900 text-white border-2 border-cyan-500/80 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900/40 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeProduct === idx ? 'bg-cyan-400' : 'bg-slate-600'}`}></span>
              <span>0{idx + 1}. {p.title.split(' ')[0]} {p.title.split(' ')[1]}</span>
            </button>
          ))}
        </div>

        {/* Active Product Detailed Display */}
        <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Description */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  {products[activeProduct].category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {products[activeProduct].title}
                </h3>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  {products[activeProduct].summary}
                </p>
              </div>

              {/* Bullets */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Engineering Capabilities</h4>
                {products[activeProduct].bullets.map((bullet, i) => (
                  <div key={i} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Technical Specification Sheet */}
            <div className="lg:col-span-5 rounded-xl bg-slate-950 border border-slate-800 p-5 shadow-inner">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs font-mono text-slate-400">
                <span className="flex items-center space-x-1.5 text-cyan-300">
                  <Workflow className="w-3.5 h-3.5" />
                  <span>SPECIFICATION MATRIX</span>
                </span>
                <span className="text-emerald-400 text-[11px]">BENCHMARKED</span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                {Object.entries(products[activeProduct].technicalSpec).map(([key, val]) => (
                  <div key={key} className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80">
                    <p className="text-[10px] text-slate-400 uppercase">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="font-semibold text-slate-200 mt-0.5 text-[11px] sm:text-xs">
                      {val}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Verification Suite</span>
                <span className="text-cyan-400">Mininet & Internet2 Real Topology</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
