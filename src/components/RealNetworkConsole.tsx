import React, { useState } from 'react';
import {
  Send,
  Terminal,
  GitBranch,
  Globe,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Shield,
  Activity,
  Server,
  Cable,
  ArrowRight,
  Layers,
  Clock,
  RefreshCw,
} from 'lucide-react';
import type {
  ActiveFlow,
  NetworkLink,
  NetworkNode,
  PacketTransmissionResult,
  RealNetworkProbeResult,
  RoutingTableEntry,
  UserRole,
} from '../types';

interface RealNetworkConsoleProps {
  nodes: NetworkNode[];
  links: NetworkLink[];
  flows: ActiveFlow[];
  routingTables: Record<string, RoutingTableEntry[]>;
  recentPackets: PacketTransmissionResult[];
  selectedNode: NetworkNode;
  routingMode: 'ospf_shortest_path' | 'drl_autonomous';
  canExecuteCommands: boolean;
  activeRole: UserRole;
  onPacketTransmitted: (result: PacketTransmissionResult) => void;
  onRefreshState: () => void;
  onNotify: (msg: string) => void;
}

export const RealNetworkConsole: React.FC<RealNetworkConsoleProps> = ({
  nodes,
  links,
  flows,
  routingTables,
  recentPackets,
  selectedNode,
  routingMode,
  canExecuteCommands,
  onPacketTransmitted,
  onRefreshState,
  onNotify,
}) => {
  const [consoleTab, setConsoleTab] = useState<'packets' | 'flows' | 'fib' | 'internet'>('packets');

  // Packet transmitter state
  const [pktSource, setPktSource] = useState<string>('tok-01');
  const [pktDest, setPktDest] = useState<string>('fra-01');
  const [pktProtocol, setPktProtocol] = useState<'TCP' | 'UDP' | 'QUIC' | 'ICMP'>('TCP');
  const [pktTtl, setPktTtl] = useState<number>(16);
  const [pktPayload, setPktPayload] = useState<string>('GET /telemetry/frame-01 HTTP/1.1');
  const [isSendingPkt, setIsSendingPkt] = useState<boolean>(false);
  const [latestPacket, setLatestPacket] = useState<PacketTransmissionResult | null>(null);

  // Flow spawner & provisioning state
  const [flowSource, setFlowSource] = useState<string>('sjc-01');
  const [flowDest, setFlowDest] = useState<string>('lon-01');
  const [flowBw, setFlowBw] = useState<number>(25);
  const [flowProtocol, setFlowProtocol] = useState<'TCP' | 'UDP' | 'QUIC'>('QUIC');
  const [flowClass, setFlowClass] = useState<'ultra_low_latency' | 'high_throughput' | 'resilient'>('ultra_low_latency');

  const [newNodeId, setNewNodeId] = useState<string>('mia-01');
  const [newNodeName, setNewNodeName] = useState<string>('MiamiIXP');
  const [newNodePeer, setNewNodePeer] = useState<string>('atl-01');
  const [newLinkFrom, setNewLinkFrom] = useState<string>('sjc-01');
  const [newLinkTo, setNewLinkTo] = useState<string>('chi-01');

  // Real Internet Probe state
  const [probeHost, setProbeHost] = useState<string>('cloudflare.com');
  const [probePort, setProbePort] = useState<number>(443);
  const [isProbing, setIsProbing] = useState<boolean>(false);
  const [probeError, setProbeError] = useState<string | null>(null);
  const [probeResult, setProbeResult] = useState<RealNetworkProbeResult | null>(null);

  const displayedPacket = latestPacket || recentPackets[0] || null;
  const selectedFib = routingTables[selectedNode.id] || [];

  const handleSendPacket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingPkt(true);
    try {
      const res = await fetch('/api/v1/network/packet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: pktSource,
          destinationId: pktDest,
          protocol: pktProtocol,
          ttl: pktTtl,
          payload: pktPayload,
        }),
      });
      const data: PacketTransmissionResult = await res.json();
      setLatestPacket(data);
      onPacketTransmitted(data);
      if (data.delivered) {
        onNotify(`Packet ${data.packetId} delivered across ${data.hops.length - 1} hops (${data.totalRttMs}ms RTT)`);
      } else {
        onNotify(`Packet ${data.packetId} dropped: ${data.failureReason}`);
      }
    } catch {
      onNotify('Failed to transmit packet to network engine.');
    } finally {
      setIsSendingPkt(false);
    }
  };

  const handleSpawnFlow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canExecuteCommands) {
      onNotify('Permission Denied: Elevate to NetworkAdmin or EdgeEngineer to provision flows.');
      return;
    }
    try {
      await fetch('/api/v1/network/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: flowSource,
          destinationId: flowDest,
          bandwidthGbps: flowBw,
          protocol: flowProtocol,
          trafficClass: flowClass,
        }),
      });
      onRefreshState();
      onNotify(`Provisioned live ${flowBw} Gbps ${flowProtocol} flow (${flowSource} -> ${flowDest}).`);
    } catch {
      onNotify('Failed to spawn flow.');
    }
  };

  const handleTerminateFlow = async (flowId: string) => {
    if (!canExecuteCommands) {
      onNotify('Permission Denied: Elevate role to terminate active flows.');
      return;
    }
    try {
      const res = await fetch(`/api/v1/network/flow/${encodeURIComponent(flowId)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Request failed');
      onRefreshState();
      onNotify(`Terminated flow ${flowId}.`);
    } catch {
      onNotify('Failed to terminate flow: backend temporarily unreachable.');
    }
  };

  const handleAddNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canExecuteCommands) {
      onNotify('Permission Denied: Elevate role to provision router PoPs.');
      return;
    }
    try {
      const res = await fetch('/api/v1/network/node', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newNodeId,
          name: newNodeName,
          region: 'Edge-Live',
          connectToId: newNodePeer,
          capacityGbps: 100,
          linkLatencyMs: 14.5,
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      onRefreshState();
      onNotify(`Provisioned live PoP ${newNodeId} peered with ${newNodePeer}.`);
    } catch {
      onNotify('Failed to provision router PoP: backend temporarily unreachable.');
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canExecuteCommands) {
      onNotify('Permission Denied: Elevate role to provision fiber trunks.');
      return;
    }
    try {
      const res = await fetch('/api/v1/network/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromId: newLinkFrom,
          toId: newLinkTo,
          capacityGbps: 100,
          baseLatencyMs: 19.5,
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      onRefreshState();
      onNotify(`Provisioned physical fiber link ${newLinkFrom} <-> ${newLinkTo}.`);
    } catch {
      onNotify('Failed to provision fiber link: backend temporarily unreachable.');
    }
  };

  const handleRunInternetProbe = async (targetOverride?: string, portOverride?: number) => {
    const target = targetOverride ?? probeHost;
    const port = portOverride ?? probePort;
    if (targetOverride) setProbeHost(targetOverride);
    if (portOverride) setProbePort(portOverride);

    setIsProbing(true);
    setProbeError(null);
    try {
      const res = await fetch('/api/v1/network/probe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, port }),
      });
      const data = await res.json();
      if (!res.ok) {
        setProbeError(data.error || 'Probe failed');
      } else {
        setProbeResult(data);
      }
    } catch {
      setProbeError('Unable to reach server probe endpoint');
    } finally {
      setIsProbing(false);
    }
  };

  return (
    <div className="mt-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl overflow-hidden">
      {/* Console Header & Sub-navigation */}
      <div className="p-4 sm:px-6 border-b border-slate-800 bg-slate-950/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white font-mono">
              Live Packet Fabric & Real Network Diagnostics
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Server-authoritative hop-by-hop routing, live flow tables, and real DNS/TCP/TLS/HTTP internet probes
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setConsoleTab('packets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center space-x-1.5 transition-all ${
              consoleTab === 'packets'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/25'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Packet & Traceroute</span>
          </button>

          <button
            onClick={() => setConsoleTab('flows')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center space-x-1.5 transition-all ${
              consoleTab === 'flows'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/25'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Flows & Provision ({flows.length})</span>
          </button>

          <button
            onClick={() => setConsoleTab('fib')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center space-x-1.5 transition-all ${
              consoleTab === 'fib'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/25'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Router FIB ({selectedNode.id})</span>
          </button>

          <button
            onClick={() => setConsoleTab('internet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center space-x-1.5 transition-all ${
              consoleTab === 'internet'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Live Internet Probe</span>
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {/* TAB 1: PACKET TRANSMITTER & HOP-BY-HOP TRACEROUTE */}
        {consoleTab === 'packets' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form onSubmit={handleSendPacket} className="lg:col-span-4 space-y-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs font-mono font-bold text-cyan-300">Transmit Live Packet</span>
                <span className="text-[10px] font-mono text-slate-400">
                  Mode: {routingMode === 'drl_autonomous' ? 'DRL Q-Routing' : 'OSPF Shortest'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Source PoP</label>
                  <select
                    value={pktSource}
                    onChange={(e) => setPktSource(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                  >
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.id} ({n.name.split(' ')[0]})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Destination PoP</label>
                  <select
                    value={pktDest}
                    onChange={(e) => setPktDest(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                  >
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.id} ({n.name.split(' ')[0]})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Protocol</label>
                  <select
                    value={pktProtocol}
                    onChange={(e) => setPktProtocol(e.target.value as 'TCP' | 'UDP' | 'QUIC' | 'ICMP')}
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="TCP">TCP</option>
                    <option value="QUIC">QUIC (HTTP/3)</option>
                    <option value="UDP">UDP</option>
                    <option value="ICMP">ICMP Echo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Initial TTL</label>
                  <input
                    type="number"
                    min={1}
                    max={64}
                    value={pktTtl}
                    onChange={(e) => setPktTtl(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Packet Payload Data</label>
                <input
                  type="text"
                  value={pktPayload}
                  onChange={(e) => setPktPayload(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-200 focus:border-cyan-500 focus:outline-none"
                  placeholder="Enter payload bytes to hash & forward..."
                />
              </div>

              <button
                type="submit"
                disabled={isSendingPkt}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingPkt ? 'Forwarding Through FIB...' : 'Transmit & Trace Packet'}</span>
              </button>
            </form>

            {/* Right: Hop-by-Hop FIB Forwarding Trace */}
            <div className="lg:col-span-8 space-y-4">
              {displayedPacket ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      {displayedPacket.delivered ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      )}
                      <span className="font-mono text-xs font-bold text-white">
                        {displayedPacket.packetId} • {displayedPacket.protocol}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                          displayedPacket.delivered
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {displayedPacket.delivered ? 'DELIVERED' : 'DROPPED'}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-slate-400 flex items-center space-x-3">
                      <span>
                        RTT: <strong className="text-cyan-300">{displayedPacket.totalRttMs} ms</strong>
                      </span>
                      <span>
                        Bytes: <strong className="text-slate-200">{displayedPacket.payloadBytes}B</strong>
                      </span>
                    </div>
                  </div>

                  {displayedPacket.failureReason && (
                    <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/70 text-xs font-mono text-rose-200">
                      Drop Cause: {displayedPacket.failureReason}
                    </div>
                  )}

                  {/* Hop table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-[11px]">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-800">
                          <th className="py-1.5 pr-3">Hop</th>
                          <th className="py-1.5 pr-3">Router PoP</th>
                          <th className="py-1.5 pr-3">IP Address</th>
                          <th className="py-1.5 pr-3">Wire</th>
                          <th className="py-1.5 pr-3">Queue</th>
                          <th className="py-1.5 pr-3">Arrival</th>
                          <th className="py-1.5 pr-3">TTL</th>
                          <th className="py-1.5">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        {displayedPacket.hops.map((hop) => (
                          <tr key={`${displayedPacket.packetId}-${hop.hopIndex}`} className="text-slate-200">
                            <td className="py-1.5 pr-3 text-slate-400">#{hop.hopIndex}</td>
                            <td className="py-1.5 pr-3 font-semibold text-cyan-300">{hop.nodeId}</td>
                            <td className="py-1.5 pr-3 text-slate-400">{hop.ip}</td>
                            <td className="py-1.5 pr-3">{hop.linkLatencyMs}ms</td>
                            <td className={`py-1.5 pr-3 ${hop.queueDelayMs > 2 ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                              +{hop.queueDelayMs}ms
                            </td>
                            <td className="py-1.5 pr-3 text-white">{hop.ingressTimeMs}ms</td>
                            <td className="py-1.5 pr-3">{hop.ttlRemaining}</td>
                            <td className="py-1.5">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] ${
                                  hop.status === 'delivered'
                                    ? 'bg-emerald-950 text-emerald-300'
                                    : hop.status === 'forwarded'
                                    ? 'bg-slate-900 text-cyan-300'
                                    : 'bg-rose-950 text-rose-300'
                                }`}
                              >
                                {hop.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="pt-2 border-t border-slate-900 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-500">
                    <span>SHA-256: {displayedPacket.sha256Checksum.slice(0, 32)}...</span>
                    <span>Payload: &ldquo;{displayedPacket.payloadPreview}&rdquo;</span>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs font-mono text-slate-400">
                  Transmit a packet from the left console to inspect real hop-by-hop FIB forwarding across the network.
                </div>
              )}

              {/* Recent Transmissions Strip */}
              {recentPackets.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {recentPackets.slice(0, 5).map((pkt) => (
                    <button
                      key={pkt.packetId}
                      onClick={() => setLatestPacket(pkt)}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono border flex items-center space-x-1.5 transition-colors ${
                        displayedPacket?.packetId === pkt.packetId
                          ? 'bg-cyan-950/70 border-cyan-600 text-cyan-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${pkt.delivered ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      <span>{pkt.packetId}</span>
                      <span className="text-slate-500">
                        {pkt.sourceId}→{pkt.destinationId}
                      </span>
                      <span className="text-cyan-300">{pkt.totalRttMs}ms</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE FLOWS & DYNAMIC TOPOLOGY PROVISIONING */}
        {consoleTab === 'flows' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Active Flows Table */}
              <div className="lg:col-span-8 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <span className="text-xs font-mono font-bold text-white">
                    Live Traffic Flows Traversing Backbone ({flows.length})
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Load determines link queueing & packet loss
                  </span>
                </div>

                <div className="overflow-x-auto max-h-72 overflow-y-auto">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-800">
                        <th className="py-1.5 pr-2">Flow ID</th>
                        <th className="py-1.5 pr-2">Proto</th>
                        <th className="py-1.5 pr-2">Rate</th>
                        <th className="py-1.5 pr-2">Active Routed Path</th>
                        <th className="py-1.5 pr-2">RTT</th>
                        <th className="py-1.5 pr-2">Pkts Fwd</th>
                        <th className="py-1.5"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {flows.map((flw) => (
                        <tr key={flw.id} className="text-slate-200">
                          <td className="py-2 pr-2 font-bold text-cyan-300">{flw.id}</td>
                          <td className="py-2 pr-2">{flw.protocol}</td>
                          <td className="py-2 pr-2 text-amber-300">{flw.bandwidthGbps} Gbps</td>
                          <td className="py-2 pr-2 text-[10px] text-slate-300">
                            {flw.path.length > 0 ? flw.path.join(' → ') : 'UNREACHABLE (DROPPED)'}
                          </td>
                          <td className="py-2 pr-2">{flw.currentLatencyMs}ms</td>
                          <td className="py-2 pr-2 text-emerald-400">{flw.packetsForwarded.toLocaleString()}</td>
                          <td className="py-2 text-right">
                            <button
                              onClick={() => handleTerminateFlow(flw.id)}
                              className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                              title="Terminate flow"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Spawn Flow Form */}
              <form onSubmit={handleSpawnFlow} className="lg:col-span-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-mono font-bold text-cyan-300 border-b border-slate-800 pb-2">
                  Spawn Persistent Traffic Flow
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Src PoP</label>
                    <select
                      value={flowSource}
                      onChange={(e) => setFlowSource(e.target.value)}
                      className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                    >
                      {nodes.map((n) => (
                        <option key={n.id} value={n.id}>{n.id}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Dst PoP</label>
                    <select
                      value={flowDest}
                      onChange={(e) => setFlowDest(e.target.value)}
                      className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                    >
                      {nodes.map((n) => (
                        <option key={n.id} value={n.id}>{n.id}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Bandwidth (Gbps)</label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={flowBw}
                      onChange={(e) => setFlowBw(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Protocol</label>
                    <select
                      value={flowProtocol}
                      onChange={(e) => setFlowProtocol(e.target.value as 'TCP' | 'UDP' | 'QUIC')}
                      className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                    >
                      <option value="QUIC">QUIC</option>
                      <option value="TCP">TCP</option>
                      <option value="UDP">UDP</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">Traffic Class</label>
                  <select
                    value={flowClass}
                    onChange={(e) => setFlowClass(e.target.value as 'ultra_low_latency' | 'high_throughput' | 'resilient')}
                    className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                  >
                    <option value="ultra_low_latency">ultra_low_latency</option>
                    <option value="high_throughput">high_throughput</option>
                    <option value="resilient">resilient</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center justify-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Inject Live Flow</span>
                </button>
              </form>
            </div>

            {/* Provision New Router Node or Fiber Link */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form onSubmit={handleAddNode} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-300">
                  <Server className="w-3.5 h-3.5" />
                  <span>Provision Live Router PoP</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newNodeId}
                    onChange={(e) => setNewNodeId(e.target.value)}
                    placeholder="mia-01"
                    className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                  />
                  <input
                    type="text"
                    value={newNodeName}
                    onChange={(e) => setNewNodeName(e.target.value)}
                    placeholder="Miami IXP"
                    className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                  />
                  <select
                    value={newNodePeer}
                    onChange={(e) => setNewNodePeer(e.target.value)}
                    className="px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                  >
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id}>Peer: {n.id}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-mono font-semibold"
                >
                  + Deploy Router & Converge FIB
                </button>
              </form>

              <form onSubmit={handleAddLink} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-mono font-bold text-purple-300">
                  <Cable className="w-3.5 h-3.5" />
                  <span>Provision New Fiber Trunk (100 Gbps)</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newLinkFrom}
                    onChange={(e) => setNewLinkFrom(e.target.value)}
                    className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                  >
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id}>From: {n.id}</option>
                    ))}
                  </select>
                  <select
                    value={newLinkTo}
                    onChange={(e) => setNewLinkTo(e.target.value)}
                    className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                  >
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id}>To: {n.id}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-xs font-mono font-semibold"
                >
                  + Connect Fiber Trunk
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: LIVE ROUTER FIB (FORWARDING INFORMATION BASE) */}
        {consoleTab === 'fib' && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-300">
                  Kernel Forwarding Information Base (FIB): {selectedNode.name} ({selectedNode.id})
                </span>
                <p className="text-[11px] font-mono text-slate-400">
                  Click any node on the topology map above to inspect its live next-hop routing table.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-900 border border-slate-700 text-emerald-300">
                Engine: {routingMode === 'drl_autonomous' ? 'DRL Q-Routing (Congestion-Aware)' : 'OSPF Shortest Path'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-800 text-[11px]">
                    <th className="py-2 pr-3">Destination</th>
                    <th className="py-2 pr-3">Next Hop</th>
                    <th className="py-2 pr-3">Hops</th>
                    <th className="py-2 pr-3">Est. One-Way</th>
                    <th className="py-2 pr-3">Metric Cost</th>
                    <th className="py-2">Full Resolved Path</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-[11px]">
                  {selectedFib.map((entry) => (
                    <tr key={entry.destinationId} className="text-slate-200">
                      <td className="py-2 pr-3 font-bold text-white">{entry.destinationId}</td>
                      <td className="py-2 pr-3 text-cyan-300 font-semibold">{entry.nextHopId}</td>
                      <td className="py-2 pr-3">{entry.hopCount}</td>
                      <td className="py-2 pr-3 text-emerald-400">{entry.estimatedLatencyMs} ms</td>
                      <td className="py-2 pr-3 text-slate-400">{entry.metricCost}</td>
                      <td className="py-2 text-slate-300">{entry.path.join(' → ')}</td>
                    </tr>
                  ))}
                  {selectedFib.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-rose-400">
                        Node isolated: all adjacent links are currently DOWN.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: REAL EXTERNAL INTERNET DIAGNOSTIC PROBE */}
        {consoleTab === 'internet' && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Real-World Internet Network Probe (Node.js DNS + TCP Socket + TLS + HTTP)
                  </span>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Executes live OS-level DNS resolution, 4x TCP SYN/ACK socket handshakes, TLS certificate inspection, and HTTPS TTFB from the server.
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {['cloudflare.com', 'google.com', 'github.com', '1.1.1.1', '8.8.8.8'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleRunInternetProbe(preset, 443)}
                      className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] font-mono text-cyan-300"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={probeHost}
                  onChange={(e) => setProbeHost(e.target.value)}
                  placeholder="Enter hostname or public IP (e.g. cloudflare.com)"
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:border-emerald-500 focus:outline-none"
                />
                <input
                  type="number"
                  min={1}
                  max={65535}
                  value={probePort}
                  onChange={(e) => setProbePort(Number(e.target.value))}
                  className="w-24 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  disabled={isProbing}
                  onClick={() => handleRunInternetProbe()}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center justify-center space-x-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isProbing ? 'animate-spin' : ''}`} />
                  <span>{isProbing ? 'Probing Live Host...' : 'Run Live Probe'}</span>
                </button>
              </div>

              {probeError && (
                <div className="p-3 rounded-lg bg-rose-950/70 border border-rose-800 text-xs font-mono text-rose-200">
                  Probe Error: {probeError}
                </div>
              )}
            </div>

            {probeResult && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* DNS Card */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-cyan-300">DNS Resolution</span>
                    <span className="text-emerald-400">{probeResult.dns.lookupTimeMs} ms</span>
                  </div>
                  {probeResult.dns.error ? (
                    <p className="text-rose-400 text-[11px]">{probeResult.dns.error}</p>
                  ) : (
                    <div className="space-y-1.5 text-[11px]">
                      <div>
                        <span className="text-slate-500">IPv4 (A): </span>
                        <span className="text-slate-200">{probeResult.dns.ipv4.join(', ') || 'None'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">IPv6 (AAAA): </span>
                        <span className="text-slate-200 break-all">{probeResult.dns.ipv6.slice(0, 2).join(', ') || 'None'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">NS: </span>
                        <span className="text-slate-400">{probeResult.dns.ns.slice(0, 2).join(', ') || 'N/A'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* TCP Socket Latency Card */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-emerald-300">TCP Handshake (:{probeResult.port})</span>
                    <span className="text-slate-300">{probeResult.tcpStats.lossPercent}% loss</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>Min: <strong className="text-white">{probeResult.tcpStats.minMs ?? '--'} ms</strong></div>
                    <div>Avg: <strong className="text-cyan-300">{probeResult.tcpStats.avgMs ?? '--'} ms</strong></div>
                    <div>Max: <strong className="text-white">{probeResult.tcpStats.maxMs ?? '--'} ms</strong></div>
                    <div>Jitter: <strong className="text-amber-300">{probeResult.tcpStats.jitterMs ?? '--'} ms</strong></div>
                  </div>
                  <div className="pt-2 border-t border-slate-900 space-y-1">
                    {probeResult.tcpProbes.map((p) => (
                      <div key={p.seq} className="flex justify-between text-[10px]">
                        <span className="text-slate-500">seq={p.seq} ({p.remoteAddress || probeResult.target})</span>
                        <span className={p.connected ? 'text-emerald-400' : 'text-rose-400'}>
                          {p.connected ? `${p.rttMs} ms` : p.error}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TLS & HTTP Card */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-purple-300">TLS & HTTP Timing</span>
                    <span className="text-slate-300">{probeResult.tls?.protocol || 'Plain'}</span>
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    {probeResult.tls?.supported && (
                      <>
                        <div>TLS Handshake: <strong className="text-emerald-400">{probeResult.tls.handshakeMs} ms</strong></div>
                        <div>Cipher: <span className="text-slate-300 break-all">{probeResult.tls.cipher}</span></div>
                        <div>Issuer: <span className="text-slate-400">{probeResult.tls.issuerO || 'N/A'}</span></div>
                      </>
                    )}
                    {probeResult.http && (
                      <div className="pt-2 border-t border-slate-900 space-y-1">
                        <div>
                          HTTP Status:{' '}
                          <strong className={probeResult.http.reachable ? 'text-cyan-300' : 'text-rose-400'}>
                            {probeResult.http.statusCode ?? 'ERR'} {probeResult.http.statusMessage || ''}
                          </strong>
                        </div>
                        <div>HTTP TTFB: <strong className="text-white">{probeResult.http.ttfbMs ?? '--'} ms</strong></div>
                        {probeResult.http.serverHeader && (
                          <div>Server: <span className="text-slate-400">{probeResult.http.serverHeader}</span></div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
