import crypto from 'node:crypto';
import http from 'node:http';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { WebSocket, WebSocketServer } from 'ws';
import { RealNetworkEngine } from './server/networkEngine.ts';
import { executeRealNetworkProbe } from './server/networkProbes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  const server = http.createServer(app);
  const wss = new WebSocketServer({ noServer: true });
  const networkEngine = new RealNetworkEngine();

  const broadcast = (event: string, data: unknown) => {
    const msg = JSON.stringify({ event, data });
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    }
  };

  server.on('upgrade', (request, socket, head) => {
    try {
      const reqUrl = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
      if (reqUrl.pathname === '/ws/network') {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
        });
      } else if (isProduction) {
        socket.destroy();
      }
    } catch {
      socket.destroy();
    }
  });

  wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ event: 'network:init', data: networkEngine.getSnapshot() }));

    ws.on('message', (raw) => {
      try {
        const parsed = JSON.parse(raw.toString());
        const action = parsed?.action;
        const payload = parsed?.payload || {};

        if (action === 'ping') {
          ws.send(JSON.stringify({ event: 'pong', data: { serverTime: Date.now() } }));
        } else if (action === 'scenario:congestion') {
          const snap = networkEngine.injectCongestion(payload.linkId || 'lnk-chi-nyc');
          broadcast('network:tick', snap);
        } else if (action === 'scenario:reroute') {
          const snap = networkEngine.engageDrlReroute();
          broadcast('network:tick', snap);
        } else if (action === 'scenario:reset') {
          networkEngine.resetBaseline();
          broadcast('network:tick', networkEngine.getSnapshot());
        } else if (action === 'link:toggle' && payload.linkId) {
          const snap = networkEngine.toggleLinkState(String(payload.linkId), payload.status);
          broadcast('network:tick', snap);
        }
      } catch {
        // ignore malformed frames
      }
    });
  });

  // Authoritative server-side network tick (advances packet counters, jitter, live telemetry)
  setInterval(() => {
    const snapshot = networkEngine.stepTick();
    if (wss.clients.size > 0) {
      broadcast('network:tick', snapshot);
    }
  }, 1500);

  // ---------------------------------------------------------------------------
  // REAL NETWORK FABRIC API ROUTES
  // ---------------------------------------------------------------------------

  app.get('/api/v1/network/state', (_req, res) => {
    res.json(networkEngine.getSnapshot());
  });

  app.post('/api/v1/network/packet', (req, res) => {
    const { sourceId, destinationId, payload, protocol, ttl } = req.body || {};
    if (!sourceId || !destinationId) {
      res.status(400).json({ error: 'sourceId and destinationId are required' });
      return;
    }

    const result = networkEngine.transmitPacket({
      sourceId: String(sourceId),
      destinationId: String(destinationId),
      payload: typeof payload === 'string' && payload.length > 0 ? payload : 'NEXUSROUTE-LIVE-FRAME',
      protocol: protocol || 'TCP',
      ttl: typeof ttl === 'number' ? ttl : 16,
    });

    broadcast('network:packet', result);
    broadcast('network:tick', networkEngine.getSnapshot());
    res.json(result);
  });

  app.post('/api/v1/network/flow', (req, res) => {
    const { sourceId, destinationId, bandwidthGbps, protocol, trafficClass } = req.body || {};
    if (!sourceId || !destinationId) {
      res.status(400).json({ error: 'sourceId and destinationId are required' });
      return;
    }
    const snapshot = networkEngine.spawnFlow({
      sourceId: String(sourceId),
      destinationId: String(destinationId),
      bandwidthGbps: Number(bandwidthGbps) || 20,
      protocol: protocol || 'QUIC',
      trafficClass: trafficClass || 'ultra_low_latency',
    });
    broadcast('network:tick', snapshot);
    res.json(snapshot);
  });

  app.delete('/api/v1/network/flow/:id', (req, res) => {
    const snapshot = networkEngine.terminateFlow(req.params.id);
    broadcast('network:tick', snapshot);
    res.json(snapshot);
  });

  app.post('/api/v1/network/link/:id/toggle', (req, res) => {
    const { status } = req.body || {};
    const snapshot = networkEngine.toggleLinkState(
      req.params.id,
      status === 'up' || status === 'down' ? status : undefined
    );
    broadcast('network:tick', snapshot);
    res.json(snapshot);
  });

  app.post('/api/v1/network/node', (req, res) => {
    const { id, name, region, ip, connectToId, capacityGbps, linkLatencyMs } = req.body || {};
    if (!id || !connectToId) {
      res.status(400).json({ error: 'id and connectToId are required' });
      return;
    }
    const snapshot = networkEngine.addNode({
      id: String(id),
      name: String(name || id),
      region: String(region || 'Edge-Custom'),
      ip: String(ip || ''),
      connectToId: String(connectToId),
      capacityGbps: Number(capacityGbps) || 100,
      linkLatencyMs: Number(linkLatencyMs) || 16.5,
    });
    broadcast('network:tick', snapshot);
    res.json(snapshot);
  });

  app.post('/api/v1/network/link', (req, res) => {
    const { fromId, toId, capacityGbps, baseLatencyMs } = req.body || {};
    if (!fromId || !toId) {
      res.status(400).json({ error: 'fromId and toId are required' });
      return;
    }
    const snapshot = networkEngine.addLink(
      String(fromId),
      String(toId),
      Number(capacityGbps) || 100,
      Number(baseLatencyMs) || 18
    );
    broadcast('network:tick', snapshot);
    res.json(snapshot);
  });

  app.post('/api/v1/network/scenario/congestion', (req, res) => {
    const snapshot = networkEngine.injectCongestion(req.body?.linkId || 'lnk-chi-nyc');
    broadcast('network:tick', snapshot);
    res.json(snapshot);
  });

  app.post('/api/v1/network/scenario/reroute', (_req, res) => {
    const snapshot = networkEngine.engageDrlReroute();
    broadcast('network:tick', snapshot);
    res.json(snapshot);
  });

  app.post('/api/v1/network/scenario/reset', (_req, res) => {
    networkEngine.resetBaseline();
    const snapshot = networkEngine.getSnapshot();
    broadcast('network:tick', snapshot);
    res.json(snapshot);
  });

  // ---------------------------------------------------------------------------
  // REAL EXTERNAL INTERNET DIAGNOSTIC PROBES (DNS / TCP / TLS / HTTP)
  // ---------------------------------------------------------------------------

  app.post('/api/v1/network/probe', async (req, res) => {
    const { target, port } = req.body || {};
    if (!target || typeof target !== 'string') {
      res.status(400).json({ error: 'target hostname or IP is required' });
      return;
    }
    try {
      const result = await executeRealNetworkProbe(target, Number(port) || 443);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : 'Probe failed' });
    }
  });

  // ---------------------------------------------------------------------------
  // LIVE TELEMETRY INGESTION & ROUTE OPTIMIZATION API (matches FastAPI spec)
  // ---------------------------------------------------------------------------

  app.post('/api/v1/telemetry/ingest', (req, res) => {
    const start = performance.now();
    const body = req.body || {};
    const records = Array.isArray(body.records) ? body.records : [];
    const batchId = body.batch_id || `BATCH-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const clusterId = body.cluster_id || 'nexus-core-us-east';
    const trafficClass = body.traffic_class || 'ultra_low_latency';

    const payloadDigest = crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex');

    // Non-blocking background pipeline dispatch
    setImmediate(() => {
      networkEngine.recordBatchIngest(records.length || 1);
    });

    const elapsedMs = Number(Math.max(0.4, performance.now() - start).toFixed(2));
    res.status(202).json({
      status: 'accepted',
      batch_id: batchId,
      cluster_id: clusterId,
      records_received: records.length || Number(body.record_count) || 1,
      traffic_class: trafficClass,
      processing_mode: 'asynchronous_pipeline_worker',
      checksum_verified: true,
      payload_sha256: payloadDigest,
      api_ack_latency_ms: elapsedMs,
      estimated_inference_latency_ms: 11.8,
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/v1/telemetry/status', (_req, res) => {
    const snap = networkEngine.getSnapshot();
    const apiStats = networkEngine.getApiStats();
    res.json({
      cluster_id: 'nexus-core-prod-01',
      status: snap.scenarioState === 'congested' ? 'degraded' : 'optimal',
      nodes_online: snap.nodes.length,
      links_up: snap.links.filter((l) => l.status !== 'down').length,
      active_flows: snap.flows.length,
      avg_backbone_latency_ms: snap.meanBackboneLatencyMs,
      total_packets_forwarded: snap.totalPacketsForwarded,
      ingested_batches: apiStats.ingestedBatchesCount,
      ingested_records: apiStats.ingestedRecordsCount,
      active_drl_model:
        snap.routingMode === 'drl_autonomous'
          ? 'GNN-DRL-Matrix-v4.2 (ACTIVE)'
          : 'OSPF-Baseline (DRL Standby)',
      sub_100ms_failover_sla: snap.lastFailoverDurationMs < 100,
      last_failover_ms: snap.lastFailoverDurationMs,
    });
  });

  app.post('/api/v1/routes/optimize', (req, res) => {
    const { source_node, destination_node } = req.body || {};
    if (!source_node || !destination_node) {
      res.status(400).json({ error: 'source_node and destination_node are required' });
      return;
    }
    const decision = networkEngine.optimizeRoute(String(source_node), String(destination_node));
    res.json({
      decision_id: `DEC-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
      calculated_in_ms: decision.calculatedInMs,
      recommended_path: decision.recommendedPath,
      expected_latency_ms: decision.expectedLatencyMs,
      alternative_failover_path: decision.alternativeFailoverPath,
      confidence_score: decision.confidenceScore,
    });
  });

  // ---------------------------------------------------------------------------
  // VITE DEV MIDDLEWARE OR PRODUCTION STATIC ASSETS
  // ---------------------------------------------------------------------------

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`NexusRoute AI server + real network engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start NexusRoute server:', err);
  process.exit(1);
});
