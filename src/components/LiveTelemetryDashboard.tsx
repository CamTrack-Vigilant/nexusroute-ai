import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  Zap, 
  RefreshCw, 
  Play, 
  RotateCcw, 
  ShieldCheck, 
  Server, 
  Sliders, 
  TrendingDown,
  Clock,
  Wifi,
  Radio,
  Lock,
  ArrowRight
} from 'lucide-react';
import { NetworkNode, AnomalyEvent, UserRole } from '../types';
import { INITIAL_NODES, INITIAL_ANOMALIES } from '../data/mockData';

interface DashboardProps {
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
}

export const LiveTelemetryDashboard: React.FC<DashboardProps> = ({
  activeRole,
  setActiveRole,
}) => {
  const [nodes, setNodes] = useState<NetworkNode[]>(INITIAL_NODES);
  const [anomalies, setAnomalies] = useState<AnomalyEvent[]>(INITIAL_ANOMALIES);
  const [selectedNode, setSelectedNode] = useState<NetworkNode>(INITIAL_NODES[2]); // Default Chicago
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [scenarioState, setScenarioState] = useState<'normal' | 'congested' | 'failed' | 'rerouted'>('normal');
  const [failoverLatencyTimer, setFailoverLatencyTimer] = useState<number>(64);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canExecuteCommands = activeRole === 'NetworkAdmin' || activeRole === 'EdgeEngineer';

  // Live telemetry pulse simulator
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          // slight random jitter around baseline
          const jitter = (Math.random() - 0.5) * 0.4;
          let currentLat = node.currentLatencyMs;

          if (scenarioState === 'normal') {
            currentLat = Math.max(8, Number((node.baselineLatencyMs + jitter).toFixed(1)));
          }

          return {
            ...node,
            currentLatencyMs: currentLat,
            throughputGbps: Math.min(
              node.capacityGbps,
              Number((node.throughputGbps + (Math.random() - 0.5) * 2).toFixed(1))
            )
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating, scenarioState]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Scenario 1: Inject Congestion Hotspot
  const handleInjectCongestion = () => {
    if (!canExecuteCommands) {
      showNotification('Permission Denied: Switch to NetworkAdmin or EdgeEngineer to mutate topology.');
      return;
    }

    setScenarioState('congested');
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === 'chi-01') {
          return {
            ...n,
            status: 'congested',
            currentLatencyMs: 44.8,
            packetLossPercent: 1.4,
            throughputGbps: 148.0
          };
        }
        if (n.id === 'nyc-01') {
          return {
            ...n,
            status: 'degraded',
            currentLatencyMs: 38.2,
            packetLossPercent: 0.8
          };
        }
        return n;
      })
    );

    const newAnomaly: AnomalyEvent = {
      id: `ANM-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
      nodeId: 'chi-01',
      type: 'CONGESTION_HOTSPOT',
      severity: 'critical',
      mitigationStatus: 'monitoring',
      latencyDelta: '+26.2ms spike on Chicago-NYC trunk',
      actionTaken: 'Buffer bloat detected. Queuing GNN dynamic reroute policy...'
    };

    setAnomalies((prev) => [newAnomaly, ...prev.slice(0, 5)]);
    showNotification('Congestion Hotspot Injected: Chicago Hub experiencing 148 Gbps microflow burst!');
  };

  // Scenario 2: Autonomous DRL Reroute
  const handleAutonomousReroute = () => {
    if (!canExecuteCommands) {
      showNotification('Permission Denied: Switch to NetworkAdmin to execute routing policies.');
      return;
    }

    const calculatedTime = Math.floor(58 + Math.random() * 22);
    setFailoverLatencyTimer(calculatedTime);
    setScenarioState('rerouted');

    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === 'chi-01') {
          return {
            ...n,
            status: 'optimal',
            currentLatencyMs: 19.1,
            packetLossPercent: 0.001,
            throughputGbps: 94.0
          };
        }
        if (n.id === 'dal-01') {
          return {
            ...n,
            throughputGbps: 112.5 // Absorbed bypass
          };
        }
        if (n.id === 'nyc-01') {
          return {
            ...n,
            status: 'optimal',
            currentLatencyMs: 12.5,
            packetLossPercent: 0.001
          };
        }
        return n;
      })
    );

    const mitigationAnomaly: AnomalyEvent = {
      id: `DRL-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
      nodeId: 'chi-01',
      type: 'LATENCY_DRIFT',
      severity: 'low',
      mitigationStatus: 'mitigated',
      latencyDelta: '-25.7ms recovery',
      actionTaken: `Autonomous GNN rerouted 48 Gbps through Dallas bypass in ${calculatedTime}ms (SLA <100ms)`
    };

    setAnomalies((prev) => [mitigationAnomaly, ...prev.slice(0, 5)]);
    showNotification(`Autonomous DRL Rebalancing executed in ${calculatedTime}ms! Congestion eliminated.`);
  };

  // Scenario 3: Trigger Physical Link Cut
  const handleTriggerFiberCut = () => {
    if (!canExecuteCommands) {
      showNotification('Permission Denied: Switch to NetworkAdmin or EdgeEngineer to trigger failover test.');
      return;
    }

    setScenarioState('failed');
    const failoverMs = Math.floor(62 + Math.random() * 18);
    setFailoverLatencyTimer(failoverMs);

    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === 'sjc-01') {
          return {
            ...n,
            status: 're-routing',
            currentLatencyMs: 14.5
          };
        }
        return n;
      })
    );

    const failoverAnomaly: AnomalyEvent = {
      id: `FLV-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
      nodeId: 'sjc-01',
      type: 'BGP_FLAP_DETECTED',
      severity: 'critical',
      mitigationStatus: 'mitigated',
      latencyDelta: 'Link Cut -> Instant Backup Active',
      actionTaken: `Self-Healing Planner executed sub-100ms failover switchover in ${failoverMs}ms`
    };

    setAnomalies((prev) => [failoverAnomaly, ...prev.slice(0, 5)]);
    showNotification(`Fiber Cut Simulated: Self-Healing Topology Planner recovered link in ${failoverMs}ms.`);
  };

  // Reset to Baseline
  const handleResetBaseline = () => {
    setScenarioState('normal');
    setNodes(INITIAL_NODES);
    setSelectedNode(INITIAL_NODES[2]);
    showNotification('Topology restored to optimal baseline.');
  };

  return (
    <section id="dashboard" className="py-16 bg-slate-950 border-b border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Toast alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 border border-cyan-500/80 shadow-2xl text-xs font-mono text-cyan-200 flex items-center space-x-2 animate-bounce">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 text-xs font-mono mb-3">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>INTERNET2 & ATT-MPLS LIVE TELEMETRY MATRIX</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Real-Time Edge Telemetry & Topology Engine
            </h2>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleInjectCongestion}
              disabled={!canExecuteCommands}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 transition-all ${
                canExecuteCommands 
                  ? 'bg-amber-950/70 border border-amber-700/60 text-amber-300 hover:bg-amber-900/80' 
                  : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Inject Congestion Hotspot</span>
            </button>

            <button
              onClick={handleTriggerFiberCut}
              disabled={!canExecuteCommands}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 transition-all ${
                canExecuteCommands 
                  ? 'bg-rose-950/70 border border-rose-700/60 text-rose-300 hover:bg-rose-900/80' 
                  : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              <span>Simulate Fiber Cut</span>
            </button>

            <button
              onClick={handleAutonomousReroute}
              disabled={!canExecuteCommands}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold flex items-center space-x-1.5 transition-all ${
                canExecuteCommands 
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30' 
                  : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>DRL Autonomous Reroute</span>
            </button>

            <button
              onClick={handleResetBaseline}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset baseline"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Role permission alert if read-only */}
        {!canExecuteCommands && (
          <div className="mb-6 p-3 rounded-xl bg-slate-900/90 border border-amber-500/40 text-xs font-mono text-amber-300 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Current Role is <strong>{activeRole}</strong> (Observation Mode). Switch role to execute topology perturbations.</span>
            </div>
            <button
              onClick={() => setActiveRole('NetworkAdmin')}
              className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-semibold"
            >
              Elevate to NetworkAdmin
            </button>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Network Map View (8 Cols) */}
          <div className="lg:col-span-8 rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-2xl flex flex-col justify-between">
            
            {/* Top Bar of Topology Card */}
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 text-xs font-mono text-slate-400 gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-white font-semibold">Internet2 Carrier Core Topology</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">9 Edge PoPs</span>
              </div>
              
              <div className="flex items-center space-x-3 text-[11px]">
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Optimal</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>Congested</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  <span>DRL Reroute</span>
                </div>
              </div>
            </div>

            {/* Interactive SVG Topology Map */}
            <div className="relative w-full h-80 sm:h-96 my-4 bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden select-none">
              
              {/* Subtle map grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b14_1px,transparent_1px),linear-gradient(to_bottom,#1e293b14_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

              {/* Status Watermark */}
              <div className="absolute bottom-3 left-3 text-[10px] font-mono text-slate-500 pointer-events-none">
                <div>SCENARIO: {scenarioState.toUpperCase()}</div>
                <div>FAILOVER SLA: &lt; 100ms DETERMINISTIC</div>
              </div>

              {/* SVG Link lines between connected nodes */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {nodes.map((node) =>
                  node.connectedTo.map((targetId) => {
                    const targetNode = nodes.find((n) => n.id === targetId);
                    if (!targetNode || node.id > targetId) return null;

                    const isLinkCongested = 
                      (node.id === 'chi-01' && targetId === 'nyc-01') ||
                      (node.id === 'nyc-01' && targetId === 'chi-01');

                    const isReroutedBypass = 
                      (node.id === 'chi-01' && targetId === 'dal-01') ||
                      (node.id === 'dal-01' && targetId === 'atl-01');

                    let strokeColor = '#334155'; // default slate-700
                    let strokeWidth = 1.5;
                    let strokeDash = 'none';

                    if (scenarioState === 'congested' && isLinkCongested) {
                      strokeColor = '#f59e0b'; // amber
                      strokeWidth = 3;
                      strokeDash = '4 4';
                    } else if (scenarioState === 'rerouted' && isReroutedBypass) {
                      strokeColor = '#06b6d4'; // cyan
                      strokeWidth = 3;
                    } else if (scenarioState === 'failed' && (node.id === 'sjc-01' || targetId === 'sjc-01')) {
                      strokeColor = '#ec4899'; // pink/purple failover
                      strokeWidth = 2.5;
                    }

                    return (
                      <line
                        key={`${node.id}-${targetId}`}
                        x1={`${node.x}%`}
                        y1={`${node.y}%`}
                        x2={`${targetNode.x}%`}
                        y2={`${targetNode.y}%`}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDash}
                        className="transition-all duration-300"
                      />
                    );
                  })
                )}
              </svg>

              {/* Render Node Points */}
              {nodes.map((node) => {
                const isSelected = selectedNode.id === node.id;
                let ringColor = 'border-slate-700';
                let dotColor = 'bg-emerald-400';

                if (node.status === 'congested') {
                  dotColor = 'bg-amber-400 animate-ping';
                  ringColor = 'border-amber-500 ring-2 ring-amber-500/50';
                } else if (node.status === 're-routing') {
                  dotColor = 'bg-purple-400 animate-pulse';
                  ringColor = 'border-purple-500 ring-2 ring-purple-500/50';
                } else if (node.status === 'degraded') {
                  dotColor = 'bg-rose-400';
                  ringColor = 'border-rose-500';
                }

                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-1 rounded-xl transition-all group focus:outline-none z-10 ${
                      isSelected ? 'scale-125 z-20' : 'hover:scale-110'
                    }`}
                  >
                    <div className={`px-2.5 py-1.5 rounded-lg bg-slate-900/95 border ${ringColor} shadow-xl flex items-center space-x-1.5 backdrop-blur-sm cursor-pointer`}>
                      <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                      <span className="text-[11px] font-mono font-bold text-white group-hover:text-cyan-300">
                        {node.id.split('-')[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[9px] font-mono text-center text-slate-400 mt-0.5 whitespace-nowrap">
                      {node.currentLatencyMs}ms
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Performance Comparison Ticker */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <p className="text-[10px] text-slate-400">Mean RTT Latency</p>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className="text-base font-bold text-cyan-300">16.4 ms</span>
                  <span className="text-[10px] text-emerald-400 flex items-center">
                    <TrendingDown className="w-3 h-3 mr-0.5" />
                    -41.2%
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <p className="text-[10px] text-slate-400">Sub-100ms Failover Record</p>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className="text-base font-bold text-emerald-400">{failoverLatencyTimer} ms</span>
                  <span className="text-[10px] text-slate-400">SLA: &lt;100ms</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <p className="text-[10px] text-slate-400">Active Packet Drop Rate</p>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className="text-base font-bold text-purple-300">0.001%</span>
                  <span className="text-[10px] text-slate-400">Carrier grade</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Node Telemetry Inspector & Anomaly Stream (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Node Telemetry Card */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">Edge Switch Inspector</span>
                  <h3 className="font-bold text-white text-base">{selectedNode.name}</h3>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                  selectedNode.status === 'optimal' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {selectedNode.status}
                </span>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Node IP:</span>
                  <span className="text-slate-200">{selectedNode.ip}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Current RTT:</span>
                  <span className="text-cyan-300 font-bold">{selectedNode.currentLatencyMs} ms</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Baseline Target:</span>
                  <span className="text-slate-400">{selectedNode.baselineLatencyMs} ms</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Throughput Load:</span>
                  <span className="text-white">{selectedNode.throughputGbps} / {selectedNode.capacityGbps} Gbps</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Observed Loss:</span>
                  <span className="text-emerald-400 font-semibold">{selectedNode.packetLossPercent}%</span>
                </div>
              </div>

              {/* Bandwidth bar */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>Capacity Utilization</span>
                  <span>{Math.round((selectedNode.throughputGbps / selectedNode.capacityGbps) * 100)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      (selectedNode.throughputGbps / selectedNode.capacityGbps) > 0.85 ? 'bg-amber-500' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${Math.min(100, (selectedNode.throughputGbps / selectedNode.capacityGbps) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Real-time Anomaly Stream */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white text-xs font-mono">Edge Anomaly & Reroute Feed</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {anomalies.map((item) => (
                  <div key={item.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="text-cyan-300 font-semibold">{item.id}</span>
                      <span>{item.timestamp}</span>
                    </div>
                    <p className="text-slate-200 font-medium leading-tight mb-1">
                      {item.actionTaken}
                    </p>
                    <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                      <span>Node: {item.nodeId}</span>
                      <span className="text-emerald-400 font-bold">{item.latencyDelta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
