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
  connectedTo: string[];
}

export interface NetworkLink {
  from: string;
  to: string;
  utilizationPercent: number;
  latencyMs: number;
  isCongested: boolean;
  isFailoverActive: boolean;
}

export interface AnomalyEvent {
  id: string;
  timestamp: string;
  nodeId: string;
  type: 'CONGESTION_HOTSPOT' | 'PACKET_DROP_SPIKE' | 'DDOS_SYN_FLOOD' | 'BGP_FLAP_DETECTED' | 'LATENCY_DRIFT';
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
