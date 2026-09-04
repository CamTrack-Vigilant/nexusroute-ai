import React, { useState } from 'react';
import { 
  Layers, 
  Cpu, 
  Database, 
  Share2, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  Server
} from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(2);

  const stages = [
    {
      id: 0,
      name: 'Agentless Edge Ingestion',
      subtitle: 'eBPF Kernel Probes & Packet Hooks',
      icon: Server,
      latencyBudget: '0.2 ms',
      tech: 'FastAPI Async Ingest / eBPF non-blocking stream',
      description: 'Collects microflow RTT, buffer occupancy, and packet loss without inserting software agents onto customer forwarding switches.',
      payloadExample: {
        node_id: 'chi-01',
        ingress_gbps: 110.4,
        buffer_utilization: '41.2%',
        probes_sampled: 1240
      }
    },
    {
      id: 1,
      name: 'SHA-256 Verifier & Stream Buffer',
      subtitle: 'Non-Blocking High-Throughput Queue',
      icon: ShieldCheck,
      latencyBudget: '1.4 ms',
      tech: 'In-Memory Async Ring Buffer (4.8M pkt/sec)',
      description: 'Verifies telemetry payload integrity against tampering, computes batch hash, and formats topology adjacency matrices.',
      payloadExample: {
        batch_id: 'BATCH-8F92E',
        hash_verified: true,
        cluster_as: 'AS-2914',
        checksum: 'e3b0c442...verified'
      }
    },
    {
      id: 2,
      name: 'DRL & Graph Neural Network Engine',
      subtitle: 'Deep Q-Routing & Matrix Optimization',
      icon: Cpu,
      latencyBudget: '16.8 ms',
      tech: 'PyTorch / GNN Graph-Gym trained on Internet2 & ATT-MPLS',
      description: 'Evaluates entire multi-hop topology graph simultaneously. Predicts bottlenecks 400ms ahead and assigns optimal flow path weights.',
      payloadExample: {
        model_version: 'GNN-DRL-Matrix-v4.2',
        reward_discount: 0.99,
        optimal_path: ['sea-01', 'chi-01', 'nyc-01'],
        latency_reduction: '-38.4%'
      }
    },
    {
      id: 3,
      name: 'Self-Healing Topology Planner',
      subtitle: 'Sub-100ms Failover & Controller Placement',
      icon: Share2,
      latencyBudget: '8.4 ms',
      tech: 'Graph-heuristic A* / Pre-computed Failover Tables',
      description: 'Calculates optimal SDN controller placement and programs backup paths ready for instant sub-100ms failover upon physical link cut.',
      payloadExample: {
        failover_state: 'ARMED',
        precomputed_alternatives: 3,
        failover_sla: '< 84 ms'
      }
    },
    {
      id: 4,
      name: 'Dynamic Flow-Table Dispatch',
      subtitle: 'Zero-Flap Forwarding Updates',
      icon: Zap,
      latencyBudget: '3.2 ms',
      tech: 'P4 / OpenFlow / gNMI Telemetry & Rules',
      description: 'Pushes targeted flow rule updates to edge routing silicon with zero route-flapping and zero micro-loop formation.',
      payloadExample: {
        rules_pushed: 42,
        route_flap_rate: '0.0000%',
        rebalancing_ack: 'SUCCESS'
      }
    }
  ];

  return (
    <section id="architecture" className="py-16 bg-slate-950 border-b border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 text-xs font-mono mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>SYSTEM ARCHITECTURE PIPELINE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            End-to-End Autonomous Routing Pipeline
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            Click any stage in the ingestion pipeline to inspect real-time data flow, latency budget, and payload contracts.
          </p>
        </div>

        {/* Pipeline Horizontal Step Visualizer */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = activeStage === idx;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(idx)}
                className={`p-4 rounded-xl text-left transition-all relative border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-500/50'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-cyan-400 font-semibold">STAGE 0{idx + 1}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {stage.latencyBudget}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-cyan-500 text-white shadow-md' : 'bg-slate-800 text-slate-300'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-white leading-tight">
                      {stage.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {stage.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-cyan-400">
                  <span>Inspect Spec</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Deep-Dive Card */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
                <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                  STAGE 0{activeStage + 1} INSPECTION
                </span>
                <span>Latency Budget: {stages[activeStage].latencyBudget}</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                {stages[activeStage].name}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {stages[activeStage].description}
              </p>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-400">
                <span className="text-slate-500">Core Subsystem:</span>{' '}
                <span className="text-cyan-300 font-semibold">{stages[activeStage].tech}</span>
              </div>
            </div>

            {/* Stage Mock JSON Payload Viewer */}
            <div className="lg:col-span-5 rounded-xl bg-slate-950 border border-slate-800 p-4 shadow-inner">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
                <span className="text-cyan-400">Live Memory Buffer Frame</span>
                <span className="text-emerald-400 text-[11px]">E2EE Verified</span>
              </div>
              <pre className="text-[11px] font-mono text-cyan-200 overflow-x-auto p-2 bg-slate-900/50 rounded-lg border border-slate-800/80">
                {JSON.stringify(stages[activeStage].payloadExample, null, 2)}
              </pre>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
