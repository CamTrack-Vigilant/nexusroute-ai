import { NetworkNode, AnomalyEvent, BackupSnapshot } from '../types';

export const INITIAL_NODES: NetworkNode[] = [
  {
    id: 'sea-01',
    name: 'Seattle IXP',
    region: 'US-West',
    x: 15,
    y: 22,
    ip: '198.32.176.4',
    status: 'optimal',
    currentLatencyMs: 14.2,
    baselineLatencyMs: 13.8,
    packetLossPercent: 0.001,
    throughputGbps: 84.5,
    capacityGbps: 100,
    connectedTo: ['sjc-01', 'chi-01']
  },
  {
    id: 'sjc-01',
    name: 'San Jose PoP',
    region: 'US-West',
    x: 18,
    y: 58,
    ip: '198.32.176.18',
    status: 'optimal',
    currentLatencyMs: 9.8,
    baselineLatencyMs: 10.1,
    packetLossPercent: 0.000,
    throughputGbps: 92.1,
    capacityGbps: 120,
    connectedTo: ['sea-01', 'dal-01', 'tok-01']
  },
  {
    id: 'chi-01',
    name: 'Chicago Hub',
    region: 'US-Midwest',
    x: 48,
    y: 35,
    ip: '198.32.176.55',
    status: 'optimal',
    currentLatencyMs: 18.6,
    baselineLatencyMs: 19.0,
    packetLossPercent: 0.002,
    throughputGbps: 110.4,
    capacityGbps: 150,
    connectedTo: ['sea-01', 'nyc-01', 'dal-01', 'atl-01']
  },
  {
    id: 'dal-01',
    name: 'Dallas Core',
    region: 'US-South',
    x: 44,
    y: 72,
    ip: '198.32.176.72',
    status: 'optimal',
    currentLatencyMs: 15.4,
    baselineLatencyMs: 15.2,
    packetLossPercent: 0.001,
    throughputGbps: 76.8,
    capacityGbps: 100,
    connectedTo: ['sjc-01', 'chi-01', 'atl-01']
  },
  {
    id: 'atl-01',
    name: 'Atlanta Backbone',
    region: 'US-East',
    x: 62,
    y: 65,
    ip: '198.32.176.90',
    status: 'optimal',
    currentLatencyMs: 16.1,
    baselineLatencyMs: 16.5,
    packetLossPercent: 0.003,
    throughputGbps: 68.2,
    capacityGbps: 100,
    connectedTo: ['chi-01', 'dal-01', 'nyc-01']
  },
  {
    id: 'nyc-01',
    name: 'New York Metro',
    region: 'US-East',
    x: 75,
    y: 32,
    ip: '198.32.176.104',
    status: 'optimal',
    currentLatencyMs: 12.3,
    baselineLatencyMs: 12.0,
    packetLossPercent: 0.001,
    throughputGbps: 135.6,
    capacityGbps: 160,
    connectedTo: ['chi-01', 'atl-01', 'lon-01']
  },
  {
    id: 'lon-01',
    name: 'London Transatlantic',
    region: 'EU-West',
    x: 88,
    y: 28,
    ip: '195.66.225.1',
    status: 'optimal',
    currentLatencyMs: 68.4,
    baselineLatencyMs: 69.1,
    packetLossPercent: 0.004,
    throughputGbps: 74.9,
    capacityGbps: 100,
    connectedTo: ['nyc-01', 'fra-01']
  },
  {
    id: 'fra-01',
    name: 'Frankfurt Central',
    region: 'EU-Central',
    x: 93,
    y: 48,
    ip: '80.81.192.1',
    status: 'optimal',
    currentLatencyMs: 76.5,
    baselineLatencyMs: 78.0,
    packetLossPercent: 0.002,
    throughputGbps: 88.0,
    capacityGbps: 100,
    connectedTo: ['lon-01']
  },
  {
    id: 'tok-01',
    name: 'Tokyo Transpacific',
    region: 'AP-East',
    x: 6,
    y: 75,
    ip: '203.181.248.1',
    status: 'optimal',
    currentLatencyMs: 98.2,
    baselineLatencyMs: 104.5,
    packetLossPercent: 0.005,
    throughputGbps: 52.4,
    capacityGbps: 80,
    connectedTo: ['sjc-01']
  }
];

export const INITIAL_ANOMALIES: AnomalyEvent[] = [
  {
    id: 'ANM-9021',
    timestamp: 'Just now',
    nodeId: 'chi-01',
    type: 'CONGESTION_HOTSPOT',
    severity: 'medium',
    mitigationStatus: 'mitigated',
    latencyDelta: '+12.4ms -> -18.2ms',
    actionTaken: 'Autonomous GNN rerouted 42 Gbps to Dallas bypass in 64ms'
  },
  {
    id: 'ANM-9018',
    timestamp: '4 mins ago',
    nodeId: 'nyc-01',
    type: 'PACKET_DROP_SPIKE',
    severity: 'low',
    mitigationStatus: 'mitigated',
    latencyDelta: '+4.1ms -> 0.0ms',
    actionTaken: 'Agentless edge telemetry throttled burst microflows automatically'
  },
  {
    id: 'ANM-9012',
    timestamp: '18 mins ago',
    nodeId: 'sjc-01',
    type: 'BGP_FLAP_DETECTED',
    severity: 'critical',
    mitigationStatus: 'mitigated',
    latencyDelta: '+45.0ms -> -42.8ms',
    actionTaken: 'Graph-heuristic failover planner triggered sub-100ms multi-path route'
  }
];

export const INITIAL_BACKUPS: BackupSnapshot[] = [
  {
    id: 'SNP-2026-0904-01',
    timestamp: 'Today, 14:00 UTC',
    snapshotType: 'automated_cron',
    sizeMb: 42.8,
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    stateMatrixVersion: 'v2.4.1-matrix-int2',
    status: 'verified'
  },
  {
    id: 'SNP-2026-0904-02',
    timestamp: 'Today, 13:00 UTC',
    snapshotType: 'pre_reroute_snapshot',
    sizeMb: 42.6,
    sha256Hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
    stateMatrixVersion: 'v2.4.0-matrix-int2',
    status: 'verified'
  },
  {
    id: 'SNP-2026-0904-03',
    timestamp: 'Today, 12:00 UTC',
    snapshotType: 'automated_cron',
    sizeMb: 41.9,
    sha256Hash: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
    stateMatrixVersion: 'v2.3.9-matrix-mpls',
    status: 'verified'
  }
];

export const FASTAPI_CODE_SNIPPET = `"""
NexusRoute AI - Autonomous Traffic Routing Engine & Telemetry Ingestion Layer
Production-Ready Async FastAPI Service with Batch Processing & Sub-100ms Inference
Founder & Lead Architect: Thabang Nhlokoma Buthelezi | NexusRoute Labs
"""

from fastapi import FastAPI, BackgroundTasks, HTTPException, Depends, status, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, IPvAnyAddress, field_validator
from typing import List, Optional, Dict, Any
from datetime import datetime
import asyncio
import hashlib
import uuid
import time
import logging

# Configure structured telemetry logger
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("nexusroute.telemetry")

app = FastAPI(
    title="NexusRoute AI Telemetry & Autonomous Routing Engine",
    description="High-throughput asynchronous telemetry ingestion and real-time reinforcement learning routing optimizer.",
    version="1.4.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------------
# PYDANTIC SCHEMAS (V2 Compliant)
# -----------------------------------------------------------------------------

class LatencyProbe(BaseModel):
    target_node_id: str = Field(..., description="Target node identifier (e.g., chi-01, nyc-01)")
    rtt_latency_ms: float = Field(..., ge=0.0, le=5000.0, description="Round trip time in milliseconds")
    jitter_ms: float = Field(0.0, ge=0.0, description="Jitter variation in milliseconds")
    packet_loss_rate: float = Field(0.0, ge=0.0, le=1.0, description="Observed loss ratio [0.0 - 1.0]")

class EdgeNodeTelemetry(BaseModel):
    node_id: str = Field(..., description="Unique edge switch / IXP identifier")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="UTC measurement timestamp")
    ingress_gbps: float = Field(..., ge=0.0, description="Current ingress bandwidth in Gbps")
    egress_gbps: float = Field(..., ge=0.0, description="Current egress bandwidth in Gbps")
    buffer_utilization_pct: float = Field(..., ge=0.0, le=100.0, description="Queue buffer utilization %")
    cpu_utilization_pct: float = Field(..., ge=0.0, le=100.0, description="Edge node CPU %")
    active_flows: int = Field(..., ge=0, description="Active flow count tracked by agentless probe")
    probes: List[LatencyProbe] = Field(default_factory=list, description="Array of neighbor latency probes")

class BatchTelemetryIngestRequest(BaseModel):
    batch_id: str = Field(default_factory=lambda: f"BATCH-{uuid.uuid4().hex[:8].upper()}")
    cluster_id: str = Field("nexus-core-us-east", description="Logical cluster / AS number")
    sent_at: datetime = Field(default_factory=datetime.utcnow)
    payload_hash: Optional[str] = Field(None, description="SHA-256 payload integrity signature")
    records: List[EdgeNodeTelemetry] = Field(..., min_length=1, max_length=5000)

class IngestionReceipt(BaseModel):
    status: str = "accepted"
    batch_id: str
    records_received: int
    processing_mode: str = "asynchronous_pipeline"
    checksum_verified: bool
    estimated_inference_latency_ms: float

class ClusterHealthStatus(BaseModel):
    cluster_id: str
    status: str = "healthy"
    nodes_online: int
    avg_backbone_latency_ms: float
    congestion_events_last_hour: int
    active_drl_model: str = "GNN-DRL-Matrix-v4.2"
    sub_100ms_failover_sla: bool = True
    uptime_percentage: float = 99.999

class RouteOptimizationRequest(BaseModel):
    source_node: str
    destination_node: str
    traffic_class: str = Field("ultra_low_latency", description="ultra_low_latency | high_throughput | resilient")
    required_bandwidth_gbps: float

class RouteOptimizationResponse(BaseModel):
    decision_id: str
    calculated_in_ms: float
    recommended_path: List[str]
    expected_latency_ms: float
    alternative_failover_path: List[str]
    confidence_score: float

# -----------------------------------------------------------------------------
# ASYNC BACKGROUND WORKER PIPELINE
# -----------------------------------------------------------------------------

async def process_telemetry_batch_worker(batch: BatchTelemetryIngestRequest):
    """
    Simulates asynchronous stream ingestion into time-series cache & GNN topology graph.
    Runs non-blocking in the background to guarantee high-throughput under heavy link load.
    """
    start = time.perf_counter()
    logger.info(f"Ingesting batch {batch.batch_id} with {len(batch.records)} edge records...")
    # Simulate matrix feature extraction & reinforcement learning reward update
    await asyncio.sleep(0.015) 
    elapsed = (time.perf_counter() - start) * 1000
    logger.info(f"Batch {batch.batch_id} processed successfully in {elapsed:.2f}ms. Updated DRL topology state.")

# -----------------------------------------------------------------------------
# API ROUTE HANDLERS
# -----------------------------------------------------------------------------

@app.post(
    "/api/v1/telemetry/ingest",
    response_model=IngestionReceipt,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Ingest batch telemetry from edge nodes asynchronously"
)
async def ingest_telemetry_batch(
    payload: BatchTelemetryIngestRequest,
    background_tasks: BackgroundTasks,
    x_api_key: Optional[str] = Header(None, alias="X-Nexus-API-Key")
):
    """
    Accepts high-frequency telemetry batches from agentless edge nodes.
    Dispatches ingestion to background pipeline for sub-millisecond API ack.
    """
    # Enforce background dispatch to maintain sub-5ms API response latency
    background_tasks.add_task(process_telemetry_batch_worker, payload)
    
    return IngestionReceipt(
        status="accepted",
        batch_id=payload.batch_id,
        records_received=len(payload.records),
        processing_mode="asynchronous_pipeline",
        checksum_verified=True,
        estimated_inference_latency_ms=12.4
    )

@app.get(
    "/api/v1/telemetry/status",
    response_model=ClusterHealthStatus,
    summary="Real-time cluster health and autonomous routing status"
)
async def get_telemetry_status():
    """
    Returns live telemetry metrics, active GNN model version, and backbone SLA status.
    """
    return ClusterHealthStatus(
        cluster_id="nexus-core-prod-01",
        status="optimal",
        nodes_online=9,
        avg_backbone_latency_ms=16.4,
        congestion_events_last_hour=0,
        active_drl_model="GNN-DRL-Matrix-v4.2 (Internet2/ATT-MPLS)",
        sub_100ms_failover_sla=True,
        uptime_percentage=99.999
    )

@app.post(
    "/api/v1/routes/optimize",
    response_model=RouteOptimizationResponse,
    summary="Request DRL autonomous rerouting decision"
)
async def optimize_route(request: RouteOptimizationRequest):
    """
    Deep reinforcement learning inference endpoint for proactive traffic engineering.
    """
    start = time.perf_counter()
    # Simulated GNN inference logic
    await asyncio.sleep(0.02)
    elapsed_ms = (time.perf_counter() - start) * 1000

    return RouteOptimizationResponse(
        decision_id=f"DEC-{uuid.uuid4().hex[:8].upper()}",
        calculated_in_ms=round(elapsed_ms, 2),
        recommended_path=[request.source_node, "chi-01", "nyc-01", request.destination_node],
        expected_latency_ms=24.1,
        alternative_failover_path=[request.source_node, "dal-01", "atl-01", request.destination_node],
        confidence_score=0.984
    )
`;
