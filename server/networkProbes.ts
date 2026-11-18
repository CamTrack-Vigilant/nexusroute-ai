import dns from 'node:dns/promises';
import net from 'node:net';
import tls from 'node:tls';
import https from 'node:https';
import http from 'node:http';
import { performance } from 'node:perf_hooks';
import type {
  RealDnsResult,
  RealHttpInfo,
  RealNetworkProbeResult,
  RealTcpProbeSample,
  RealTlsInfo,
} from '../src/types/index.ts';

function isBlockedIp(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower === '::1' || lower.startsWith('fe80:') || lower.startsWith('fc') || lower.startsWith('fd')) {
    return true;
  }
  const parts = ip.split('.').map(Number);
  if (parts.length === 4 && parts.every((n) => !Number.isNaN(n))) {
    const [a, b] = parts;
    if (a === 127 || a === 10 || a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
  }
  return false;
}

export function sanitizeTargetHost(raw: string): string {
  let clean = raw.trim();
  clean = clean.replace(/^https?:\/\//i, '');
  clean = clean.split('/')[0].split('?')[0].split('#')[0];
  clean = clean.replace(/:\d+$/, '');
  if (!clean || clean.length > 253 || !/^[a-zA-Z0-9.-]+$/.test(clean)) {
    throw new Error('Invalid hostname or IPv4 address format');
  }
  if (clean === 'localhost' || clean.endsWith('.local') || clean.endsWith('.internal')) {
    throw new Error('Local or internal hostnames are restricted for external probing');
  }
  if (net.isIP(clean) && isBlockedIp(clean)) {
    throw new Error('Private/loopback/metadata IP ranges are restricted');
  }
  return clean;
}

export async function runRealDnsLookup(hostname: string): Promise<RealDnsResult> {
  const start = performance.now();
  const result: RealDnsResult = {
    hostname,
    lookupTimeMs: 0,
    ipv4: [],
    ipv6: [],
    cname: [],
    mx: [],
    ns: [],
  };

  if (net.isIPv4(hostname)) {
    result.ipv4 = [hostname];
    result.lookupTimeMs = 0.1;
    return result;
  }

  try {
    const [v4, v6, mx, ns] = await Promise.allSettled([
      dns.resolve4(hostname),
      dns.resolve6(hostname),
      dns.resolveMx(hostname),
      dns.resolveNs(hostname),
    ]);

    if (v4.status === 'fulfilled') result.ipv4 = v4.value;
    if (v6.status === 'fulfilled') result.ipv6 = v6.value;
    if (mx.status === 'fulfilled') result.mx = mx.value.slice(0, 4);
    if (ns.status === 'fulfilled') result.ns = ns.value.slice(0, 4);

    if (result.ipv4.length === 0 && result.ipv6.length === 0) {
      const fallback = await dns.lookup(hostname);
      if (fallback.family === 4) result.ipv4 = [fallback.address];
      if (fallback.family === 6) result.ipv6 = [fallback.address];
    }

    for (const ip of [...result.ipv4, ...result.ipv6]) {
      if (isBlockedIp(ip)) {
        throw new Error(`Resolved address ${ip} falls inside restricted range`);
      }
    }
  } catch (err) {
    result.error = err instanceof Error ? err.message : 'DNS resolution failed';
  }

  result.lookupTimeMs = Number((performance.now() - start).toFixed(2));
  return result;
}

async function singleTcpProbe(host: string, port: number, seq: number, timeoutMs = 3500): Promise<RealTcpProbeSample> {
  return new Promise((resolve) => {
    const start = performance.now();
    const socket = net.createConnection({ host, port, timeout: timeoutMs });
    let settled = false;

    const finish = (sample: RealTcpProbeSample) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(sample);
    };

    socket.on('connect', () => {
      const rtt = Number((performance.now() - start).toFixed(2));
      finish({
        seq,
        connected: true,
        rttMs: rtt,
        remoteAddress: socket.remoteAddress,
        port,
      });
    });

    socket.on('timeout', () => {
      finish({ seq, connected: false, rttMs: null, port, error: `Timeout (${timeoutMs}ms)` });
    });

    socket.on('error', (err) => {
      finish({ seq, connected: false, rttMs: null, port, error: err.message });
    });
  });
}

async function runRealTlsProbe(host: string, port: number): Promise<RealTlsInfo> {
  if (port !== 443 && port !== 8443 && port !== 993 && port !== 465) {
    return { supported: false, handshakeMs: null, error: `TLS skipped for non-TLS port ${port}` };
  }

  return new Promise((resolve) => {
    const start = performance.now();
    const socket = tls.connect(
      {
        host,
        port,
        servername: net.isIP(host) ? undefined : host,
        rejectUnauthorized: false,
        timeout: 4000,
      },
      () => {
        const handshakeMs = Number((performance.now() - start).toFixed(2));
        const cipher = socket.getCipher();
        const cert = socket.getPeerCertificate();
        const protocol = socket.getProtocol() ?? undefined;
        const authorized = socket.authorized;
        const rawCN = cert?.subject?.CN;
        const rawIssuer = cert?.issuer?.O || cert?.issuer?.CN;
        socket.end();
        resolve({
          supported: true,
          handshakeMs,
          protocol,
          cipher: cipher?.name,
          subjectCN: Array.isArray(rawCN) ? rawCN[0] : rawCN,
          issuerO: Array.isArray(rawIssuer) ? rawIssuer[0] : rawIssuer,
          validTo: cert?.valid_to,
          authorized,
        });
      }
    );

    socket.on('timeout', () => {
      socket.destroy();
      resolve({ supported: false, handshakeMs: null, error: 'TLS handshake timeout' });
    });

    socket.on('error', (err) => {
      socket.destroy();
      resolve({ supported: false, handshakeMs: null, error: err.message });
    });
  });
}

async function runRealHttpProbe(host: string, port: number): Promise<RealHttpInfo | null> {
  if (port !== 443 && port !== 80) return null;
  const proto = port === 443 ? 'https' : 'http';
  const url = `${proto}://${host}/`;

  return new Promise((resolve) => {
    const start = performance.now();
    const client = port === 443 ? https : http;
    const req = client.request(
      url,
      {
        method: 'HEAD',
        timeout: 4000,
        headers: { 'User-Agent': 'NexusRoute-EdgeProbe/1.4' },
      },
      (res) => {
        const ttfbMs = Number((performance.now() - start).toFixed(2));
        res.resume();
        resolve({
          reachable: true,
          url,
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          ttfbMs,
          serverHeader: typeof res.headers.server === 'string' ? res.headers.server : undefined,
          contentType: typeof res.headers['content-type'] === 'string' ? res.headers['content-type'] : undefined,
        });
      }
    );

    req.on('timeout', () => {
      req.destroy();
      resolve({ reachable: false, url, ttfbMs: null, error: 'HTTP HEAD timeout' });
    });

    req.on('error', (err) => {
      resolve({ reachable: false, url, ttfbMs: null, error: err.message });
    });

    req.end();
  });
}

export async function executeRealNetworkProbe(rawTarget: string, port = 443): Promise<RealNetworkProbeResult> {
  const target = sanitizeTargetHost(rawTarget);
  const safePort = Math.max(1, Math.min(65535, Math.round(port)));

  const dnsResult = await runRealDnsLookup(target);
  const connectHost = dnsResult.ipv4[0] || target;

  // Run 4 sequential TCP handshake probes to measure real RTT & jitter
  const tcpProbes: RealTcpProbeSample[] = [];
  if (!dnsResult.error || dnsResult.ipv4.length > 0 || dnsResult.ipv6.length > 0) {
    for (let seq = 1; seq <= 4; seq++) {
      tcpProbes.push(await singleTcpProbe(connectHost, safePort, seq));
    }
  }

  const rtts = tcpProbes.filter((p) => p.connected && p.rttMs !== null).map((p) => p.rttMs as number);
  const minMs = rtts.length ? Number(Math.min(...rtts).toFixed(2)) : null;
  const maxMs = rtts.length ? Number(Math.max(...rtts).toFixed(2)) : null;
  const avgMs = rtts.length ? Number((rtts.reduce((a, b) => a + b, 0) / rtts.length).toFixed(2)) : null;
  const jitterMs =
    rtts.length > 1
      ? Number(
          (
            rtts.slice(1).reduce((acc, v, idx) => acc + Math.abs(v - rtts[idx]), 0) /
            (rtts.length - 1)
          ).toFixed(2)
        )
      : 0;

  const [tlsInfo, httpInfo] = await Promise.all([
    rtts.length > 0 ? runRealTlsProbe(target, safePort) : Promise.resolve(null),
    rtts.length > 0 ? runRealHttpProbe(target, safePort) : Promise.resolve(null),
  ]);

  return {
    target,
    port: safePort,
    timestamp: new Date().toISOString(),
    dns: dnsResult,
    tcpProbes,
    tcpStats: {
      sent: tcpProbes.length,
      received: rtts.length,
      lossPercent: tcpProbes.length ? Number((((tcpProbes.length - rtts.length) / tcpProbes.length) * 100).toFixed(1)) : 100,
      minMs,
      avgMs,
      maxMs,
      jitterMs,
    },
    tls: tlsInfo,
    http: httpInfo,
  };
}
