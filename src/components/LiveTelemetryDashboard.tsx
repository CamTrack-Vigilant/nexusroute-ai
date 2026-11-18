import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Activity,
  AlertTriangle,
  Zap,
  RotateCcw,
  ShieldCheck,
  TrendingDown,
  Radio,
  Lock,
  Wifi,
  Scissors,
} from 'lucide-react';
import type {
  ActiveFlow,
  AnomalyEvent,
  NetworkLink,
  NetworkNode,
  NetworkEngineSnapshot,
  PacketTransmissionResult,
  RoutingTableEntry,
  UserRole,
} from '../types';
import { INITIAL_NODES, INITIAL_ANOMALIES } from '../data/mockData';
import { RealNetworkConsole } from './RealNetworkConsole';

interface DashboardProps {
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
}

export const LiveTelemetryDashboard: React.FC<DashboardProps> = ({
  activeRole,
  setActiveRole,
}) => {
  const [nodes, setNodes] = useState<NetworkNode[]>(INITIAL_NODES);
  const [links, setLinks] = useState<NetworkLink[]>([]);
  const [flows, setFlows] = useState<ActiveFlow[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyEvent[]>(INITIAL_ANOMALIES);
  const [routingTables, setRoutingTables] = useState<Record<string, RoutingTableEntry[]>>({});
  const [recentPackets, setRecentPackets] = useState<PacketTransmissionResult[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('chi-01');
  const [scenarioState, setScenarioState] = useState<'normal' | 'congested' | 'failed' | 'rerouted'>('normal');
  const [routingMode, setRoutingMode] = useState<'ospf_shortest_path' | 'drl_autonomous'>('ospf_shortest_path');
  const [failoverLatencyTimer, setFailoverLatencyTimer] = useState<number>(42.6);
  const [meanBackboneLatency, setMeanBackboneLatency] = useState<number>(16.4);
  const [packetDropRatePct, setPacketDropRatePct] = useState<number>(0.02);
  const [totalPacketsForwarded, setTotalPacketsForwarded] = useState<number>(14820);
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [highlightedPacketPath, setHighlightedPacketPath] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canExecuteCommands = activeRole === 'NetworkAdmin' || activeRole === 'EdgeEngineer';

  const applySnapshot = useCallback((snap: NetworkEngineSnapshot) => {
    setNodes(snap.nodes);
    setLinks(snap.links);
    setFlows(snap.flows);
    setAnomalies(snap.anomalies);
    setRoutingTables(snap.routingTables);
    setRecentPackets(snap.recentPackets);
    setScenarioState(snap.scenarioState);
    setRoutingMode(snap.routingMode);
    setFailoverLatencyTimer(snap.lastFailoverDurationMs);
    setMeanBackboneLatency(snap.meanBackboneLatencyMs);
    setPacketDropRatePct(snap.activePacketDropRatePct);
    setTotalPacketsForwarded(snap.totalPacketsForwarded);
  }, []);

  const fetchLatestState = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/network/state');
      if (res.ok) {
        const snap: NetworkEngineSnapshot = await res.json();
        applySnapshot(snap);
      }
    } catch {
      // ignore transient network failure
    }
  }, [applySnapshot]);

  useEffect(() => {
    let unmounted = false;
    fetchLatestState();

    const connectWs = () => {
      if (unmounted) return;
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/network`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!unmounted) setWsConnected(true);
      };

      ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data);
          if (msg.event === 'network:init' || msg.event === 'network:tick') {
            applySnapshot(msg.data as NetworkEngineSnapshot);
          } else if (msg.event === 'network:packet') {
            const pkt = msg.data as PacketTransmissionResult;
            if (pkt.pathTaken.length >= 2) {
              setHighlightedPacketPath(pkt.pathTaken);
              setTimeout(() => setHighlightedPacketPath([]), 3500);
            }
          }
        } catch {
          // ignore malformed messages
        }
      };

      ws.onclose = () => {
        if (!unmounted) {
          setWsConnected(false);
          reconnectTimerRef.current = setTimeout(connectWs, 2000);
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connectWs();

    return () => {
      unmounted = true;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [applySnapshot, fetchLatestState]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0] || INITIAL_NODES[2];

  const executeMutation = async (
    url: string,
    body: Record<string, unknown> | undefined,
    wsAction: string,
    wsPayload: Record<string, unknown>
  ): Promise<NetworkEngineSnapshot | null> => {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (res.ok) {
        const snap: NetworkEngineSnapshot = await res.json();
        applySnapshot(snap);
        return snap;
      }
    } catch {
      // Fallback to live WebSocket channel if HTTP proxy request failed transiently
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: wsAction, payload: wsPayload }));
      return null;
    }

    showNotification('Network backend is reconnecting. Please retry in a moment.');
    return null;
  };

  const handleInjectCongestion = async () => {
    if (!canExecuteCommands) {
      showNotification('Permission Denied: Switch to NetworkAdmin or EdgeEngineer to mutate topology.');
      return;
    }
    const snap = await executeMutation(
      '/api/v1/network/scenario/congestion',
      { linkId: 'lnk-chi-nyc' },
      'scenario:congestion',
      { linkId: 'lnk-chi-nyc' }
    );
    if (snap || (wsRef.current && wsRef.current.readyState === WebSocket.OPEN)) {
      showNotification('Live Congestion Burst Injected: Chicago <-> NYC trunk saturated with microflows.');
    }
  };

  const handleAutonomousReroute = async () => {
    if (!canExecuteCommands) {
      showNotification('Permission Denied: Switch to NetworkAdmin to execute routing policies.');
      return;
    }
    const snap = await executeMutation(
      '/api/v1/network/scenario/reroute',
      undefined,
      'scenario:reroute',
      {}
    );
    if (snap) {
      showNotification(`Autonomous DRL Q-Routing converged all FIBs in ${snap.lastFailoverDurationMs}ms!`);
    } else if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      showNotification('Autonomous DRL Q-Routing engaged across all PoPs.');
    }
  };

  const handleToggleLink = async (linkId: string) => {
    if (!canExecuteCommands) {
      showNotification('Permission Denied: Switch to NetworkAdmin or EdgeEngineer to sever/restore fiber trunks.');
      return;
    }
    const snap = await executeMutation(
      `/api/v1/network/link/${encodeURIComponent(linkId)}/toggle`,
      {},
      'link:toggle',
      { linkId }
    );
    if (snap) {
      const changed = snap.links.find((l) => l.id === linkId);
      showNotification(
        changed?.status === 'down'
          ? `Fiber Cut: ${changed.from} <-> ${changed.to} severed! Failover converged in ${snap.lastFailoverDurationMs}ms.`
          : `Fiber Restored: ${changed?.from} <-> ${changed?.to} back online.`
      );
    }
  };

  const handleTriggerFiberCut = async () => {
    await handleToggleLink('lnk-sjc-dal');
  };

  const handleResetBaseline = async () => {
    const snap = await executeMutation(
      '/api/v1/network/scenario/reset',
      undefined,
      'scenario:reset',
      {}
    );
    if (snap || (wsRef.current && wsRef.current.readyState === WebSocket.OPEN)) {
      setSelectedNodeId('chi-01');
      showNotification('Server network fabric restored to clean baseline.');
    }
  };

  const isEdgeInPath = (a: string, b: string, path: string[]) => {
    for (let i = 0; i < path.length - 1; i++) {
      if ((path[i] === a && path[i + 1] === b) || (path[i] === b && path[i + 1] === a)) {
        return true;
      }
    }
    return false;
  };

  const selectedNodeLinks = links.filter((l) => l.from === selectedNode.id || l.to === selectedNode.id);

  return (
    <section id="dashboard" className="py-16 bg-slate-950 border-b border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Toast alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 border border-cyan-500/80 shadow-2xl text-xs font-mono text-cyan-200 flex items-center space-x-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 text-xs font-mono mb-3">
              <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>
                {wsConnected ? 'LIVE WEBSOCKET NETWORK ENGINE CONNECTED' : 'CONNECTING TO KERNEL NETWORK FABRIC...'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Real-Time Packet Fabric &amp; Live Network Engine
            </h2>
          </div>

          {/* Interactive Server-Backed Controls */}
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
              <span>Inject Burst Hotspot</span>
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
              <span>Toggle SJC-DAL Fiber</span>
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
              <span>Engage DRL Q-Routing</span>
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
              <span>Current Role is <strong>{activeRole}</strong> (Observation Mode). Switch role to mutate network fabric.</span>
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
                <Wifi className={`w-4 h-4 ${wsConnected ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className="text-white font-semibold">Live Multi-PoP Routing Matrix</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {nodes.length} PoPs • {links.filter((l) => l.status !== 'down').length}/{links.length} Trunks Up
                </span>
              </div>

              <div className="flex items-center space-x-3 text-[11px]">
                <span className={`px-2 py-0.5 rounded font-semibold ${
                  routingMode === 'drl_autonomous'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {routingMode === 'drl_autonomous' ? 'MODE: DRL Q-ROUTING' : 'MODE: OSPF SHORTEST'}
                </span>
              </div>
            </div>

            {/* Interactive SVG Topology Map */}
            <div className="relative w-full h-80 sm:h-96 my-4 bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden select-none">

              {/* Subtle map grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b14_1px,transparent_1px),linear-gradient(to_bottom,#1e293b14_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

              {/* Status Watermark */}
              <div className="absolute bottom-3 left-3 text-[10px] font-mono text-slate-500 pointer-events-none z-10">
                <div>STATE: {scenarioState.toUpperCase()} • PACKETS FWD: {totalPacketsForwarded.toLocaleString()}</div>
                <div>CLICK ANY LINK TO SEVER / RESTORE • CLICK ANY NODE FOR LIVE FIB</div>
              </div>

              {/* SVG Links with clickable hit area & live utilization */}
              <svg className="absolute inset-0 w-full h-full">
                {links.map((link) => {
                  const fromNode = nodes.find((n) => n.id === link.from);
                  const toNode = nodes.find((n) => n.id === link.to);
                  if (!fromNode || !toNode) return null;

                  const inPacketTrace = isEdgeInPath(link.from, link.to, highlightedPacketPath);
                  let strokeColor = '#334155';
                  let strokeWidth = 2;
                  let strokeDash = 'none';

                  if (link.status === 'down') {
                    strokeColor = '#f43f5e';
                    strokeWidth = 2;
                    strokeDash = '5 5';
                  } else if (inPacketTrace) {
                    strokeColor = '#22d3ee';
                    strokeWidth = 4;
                  } else if (link.isCongested) {
                    strokeColor = '#f59e0b';
                    strokeWidth = 3.5;
                    strokeDash = '6 3';
                  } else if (link.isFailoverActive) {
                    strokeColor = '#06b6d4';
                    strokeWidth = 3;
                  } else if (link.activeLoadGbps > 0) {
                    strokeColor = '#0ea5e9';
                    strokeWidth = 2.2;
                  }

                  const midX = (fromNode.x + toNode.x) / 2;
                  const midY = (fromNode.y + toNode.y) / 2;

                  return (
                    <g
                      key={link.id}
                      onClick={() => handleToggleLink(link.id)}
                      className="cursor-pointer group"
                    >
                      {/* Invisible wider click target */}
                      <line
                        x1={`${fromNode.x}%`}
                        y1={`${fromNode.y}%`}
                        x2={`${toNode.x}%`}
                        y2={`${toNode.y}%`}
                        stroke="transparent"
                        strokeWidth={14}
                      />
                      <line
                        x1={`${fromNode.x}%`}
                        y1={`${fromNode.y}%`}
                        x2={`${toNode.x}%`}
                        y2={`${toNode.y}%`}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDash}
                        className="transition-all duration-300"
                      />
                      {/* Animated packet pulse when carrying active traffic */}
                      {link.status !== 'down' && link.activeLoadGbps > 0 && (
                        <circle r={inPacketTrace ? 4 : 2.5} fill={inPacketTrace ? '#67e8f9' : '#38bdf8'}>
                          <animateMotion
                            dur={link.isCongested ? '2.4s' : '1.1s'}
                            repeatCount="indefinite"
                            path={`M ${(fromNode.x / 100) * 800} ${(fromNode.y / 100) * 384} L ${(toNode.x / 100) * 800} ${(toNode.y / 100) * 384}`}
                          />
                        </circle>
                      )}
                      {/* Link Utilization Tag */}
                      <text
                        x={`${midX}%`}
                        y={`${midY}%`}
                        dy="-4"
                        textAnchor="middle"
                        className="fill-slate-400 text-[9px] font-mono pointer-events-none"
                      >
                        {link.status === 'down' ? 'DOWN' : `${Math.round(link.utilizationPercent)}%`}
                      </text>
                    </g>
                  );
                })}
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
                    onClick={() => setSelectedNodeId(node.id)}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-1 rounded-xl transition-all group focus:outline-none z-10 ${
                      isSelected ? 'scale-125 z-20' : 'hover:scale-110'
                    }`}
                  >
                    <div className={`px-2.5 py-1.5 rounded-lg bg-slate-900/95 border ${ringColor} shadow-xl flex items-center space-x-1.5 backdrop-blur-sm cursor-pointer`}>
                      <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                      <span className="text-[11px] font-mono font-bold text-white group-hover:text-cyan-300">
                        {node.id.toUpperCase()}
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
                <p className="text-[10px] text-slate-400">Live Mean PoP RTT</p>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className="text-base font-bold text-cyan-300">{meanBackboneLatency} ms</span>
                  <span className="text-[10px] text-emerald-400 flex items-center">
                    <TrendingDown className="w-3 h-3 mr-0.5" />
                    Live Graph
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <p className="text-[10px] text-slate-400">Last FIB Failover Convergence</p>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className="text-base font-bold text-emerald-400">{failoverLatencyTimer} ms</span>
                  <span className="text-[10px] text-slate-400">SLA: &lt;100ms</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <p className="text-[10px] text-slate-400">Active Trunk Loss Rate</p>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className={`text-base font-bold ${packetDropRatePct > 0.5 ? 'text-amber-400' : 'text-purple-300'}`}>
                    {packetDropRatePct}%
                  </span>
                  <span className="text-[10px] text-slate-400">{flows.length} Active Flows</span>
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
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">Live Router Inspector</span>
                  <h3 className="font-bold text-white text-base">{selectedNode.name}</h3>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                  selectedNode.status === 'optimal'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {selectedNode.status}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Node IP:</span>
                  <span className="text-slate-200">{selectedNode.ip}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Current RTT:</span>
                  <span className="text-cyan-300 font-bold">{selectedNode.currentLatencyMs} ms</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Queue Depth:</span>
                  <span className="text-slate-200">{selectedNode.queueDepthPackets ?? 12} pkts</span>
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

              {/* Adjacent Fiber Links Control */}
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5">
                <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Adjacent Fiber Trunks (Click to Toggle)</div>
                {selectedNodeLinks.map((lnk) => {
                  const peer = lnk.from === selectedNode.id ? lnk.to : lnk.from;
                  return (
                    <button
                      key={lnk.id}
                      onClick={() => handleToggleLink(lnk.id)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-600 text-[11px] font-mono transition-colors"
                    >
                      <span className="text-slate-200 flex items-center space-x-1.5">
                        <Scissors className="w-3 h-3 text-slate-400" />
                        <span>↔ {peer}</span>
                      </span>
                      <span className={lnk.status === 'down' ? 'text-rose-400 font-bold' : lnk.isCongested ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                        {lnk.status === 'down' ? 'DOWN' : `${lnk.utilizationPercent}% (${lnk.latencyMs}ms)`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Real-time Anomaly Stream */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white text-xs font-mono">Kernel Event &amp; Reroute Feed</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>

              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
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

        {/* Full Live Packet Fabric, Flow Provisioner, Router FIB & Real Internet Probe */}
        <RealNetworkConsole
          nodes={nodes}
          links={links}
          flows={flows}
          routingTables={routingTables}
          recentPackets={recentPackets}
          selectedNode={selectedNode}
          routingMode={routingMode}
          canExecuteCommands={canExecuteCommands}
          activeRole={activeRole}
          onPacketTransmitted={(pkt) => {
            if (pkt.pathTaken.length >= 2) {
              setHighlightedPacketPath(pkt.pathTaken);
              setTimeout(() => setHighlightedPacketPath([]), 3500);
            }
            fetchLatestState();
          }}
          onRefreshState={fetchLatestState}
          onNotify={showNotification}
        />

      </div>
    </section>
  );
};
