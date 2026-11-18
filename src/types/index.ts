export type UserRole = 'NetworkAdmin' | 'EdgeEngineer' | 'ResearchAnalyst' | 'ReadOnlyObserver';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  apiKey: string;
  tokenExpires: string;
}

export interface NetworkNode {
  id: string;
  name: string;
  region: string;
  x: number;
  y: number;
  ip: string;
  status: 'optimal' | 'congested' | 're-routing' | 'degraded';
  currentLatencyMs: number;
  baselineLatencyMs: number;
  packetLossPercent: number;
  throughputGbps: number;
  capacityGbps: number;
  queueDepthPackets?: number;
  connectedTo: string[];
}

export interface NetworkLink {
  id: string;
  from: string;
  to: string;
  capacityGbps: number;
  activeLoadGbps: number;
  utilizationPercent: number;
  baseLatencyMs: number;
  latencyMs: number;
  packetLossRate: number;
  status: 'up' | 'congested' | 'down';
  isCongested: boolean;
  isFailoverActive: boolean;
}

export interface RoutingTableEntry {
  destinationId: string;
  nextHopId: string;
  metricCost: number;
  estimatedLatencyMs: number;
  hopCount: number;
  path: string[];
  mode: 'shortest_path' | 'drl_q_routing';
}

export interface ActiveFlow {
  id: string;
  sourceId: string;
  destinationId: string;
  protocol: 'TCP' | 'UDP' | 'QUIC';
  trafficClass: 'ultra_low_latency' | 'high_throughput' | 'resilient';
  bandwidthGbps: number;
  path: string[];
  currentLatencyMs: number;
  packetsForwarded: number;
  packetsDropped: number;
  status: 'active' | 'rerouted' | 'dropped';
  createdAt: string;
}

export interface PacketHopRecord {
  hopIndex: number;
  nodeId: string;
  nodeName: string;
  ip: string;
  ingressTimeMs: number;
  egressTimeMs: number;
  linkLatencyMs: number;
  queueDelayMs: number;
  ttlRemaining: number;
  status: 'forwarded' | 'delivered' | 'dropped_congestion' | 'dropped_link_down' | 'dropped_ttl';
}

export interface PacketTransmissionResult {
  packetId: string;
  sourceId: string;
  destinationId: string;
  protocol: 'TCP' | 'UDP' | 'QUIC' | 'ICMP';
  payloadPreview: string;
  payloadBytes: number;
  sha256Checksum: string;
  initialTtl: number;
  delivered: boolean;
  totalRttMs: number;
  pathTaken: string[];
  hops: PacketHopRecord[];
  failureReason?: string;
  timestamp: string;
}

export interface NetworkEngineSnapshot {
  tick: number;
  timestamp: string;
  routingMode: 'ospf_shortest_path' | 'drl_autonomous';
  scenarioState: 'normal' | 'congested' | 'failed' | 'rerouted';
  lastFailoverDurationMs: number;
  totalPacketsForwarded: number;
  totalPacketsDropped: number;
  meanBackboneLatencyMs: number;
  activePacketDropRatePct: number;
  nodes: NetworkNode[];
  links: NetworkLink[];
  flows: ActiveFlow[];
  anomalies: AnomalyEvent[];
  routingTables: Record<string, RoutingTableEntry[]>;
  recentPackets: PacketTransmissionResult[];
}

export interface AnomalyEvent {
  id: string;
  timestamp: string;
  nodeId: string;
  type: 'CONGESTION_HOTSPOT' | 'PACKET_DROP_SPIKE' | 'DDOS_SYN_FLOOD' | 'BGP_FLAP_DETECTED' | 'LATENCY_DRIFT' | 'LINK_DOWN' | 'DRL_REROUTE';
  severity: 'low' | 'medium' | 'critical';
  mitigationStatus: 'mitigated' | 'rerouting' | 'monitoring';
  latencyDelta: string;
  actionTaken: string;
}

export interface WaitlistSubmission {
  id: string;
  name: string;
  workEmail: string;
  company: string;
  roleTitle: string;
  tier: 'isp_telco' | 'multicloud_enterprise' | 'academic_research' | 'logistics_hub';
  trafficScale: '< 10 Gbps' | '10 - 100 Gbps' | '100 Gbps - 1 Tbps' | '> 1 Tbps';
  interestArea: string;
  submittedAt: string;
  priorityPassId: string;
}

export interface BackupSnapshot {
  id: string;
  timestamp: string;
  snapshotType: 'automated_cron' | 'pre_reroute_snapshot' | 'manual_admin';
  sizeMb: number;
  sha256Hash: string;
  stateMatrixVersion: string;
  status: 'verified' | 'restoring' | 'archived';
}

export interface RealDnsResult {
  hostname: string;
  lookupTimeMs: number;
  ipv4: string[];
  ipv6: string[];
  cname: string[];
  mx: { exchange: string; priority: number }[];
  ns: string[];
  error?: string;
}

export interface RealTcpProbeSample {
  seq: number;
  connected: boolean;
  rttMs: number | null;
  remoteAddress?: string;
  port: number;
  error?: string;
}

export interface RealTlsInfo {
  supported: boolean;
  handshakeMs: number | null;
  protocol?: string;
  cipher?: string;
  subjectCN?: string;
  issuerO?: string;
  validTo?: string;
  authorized?: boolean;
  error?: string;
}

export interface RealHttpInfo {
  reachable: boolean;
  url: string;
  statusCode?: number;
  statusMessage?: string;
  ttfbMs: number | null;
  serverHeader?: string;
  contentType?: string;
  error?: string;
}

export interface RealNetworkProbeResult {
  target: string;
  port: number;
  timestamp: string;
  dns: RealDnsResult;
  tcpProbes: RealTcpProbeSample[];
  tcpStats: {
    sent: number;
    received: number;
    lossPercent: number;
    minMs: number | null;
    avgMs: number | null;
    maxMs: number | null;
    jitterMs: number | null;
  };
  tls: RealTlsInfo | null;
  http: RealHttpInfo | null;
}
