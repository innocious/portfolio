#!/usr/bin/env node
// Probe the backend services listed in site/src/data/status.targets.json and
// write site/src/data/status.json. Run on a schedule by the status-update
// workflow, which then rebuilds and redeploys the static site so the public
// status page reflects reality. No dependencies — uses Node's global fetch.

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const TARGETS = resolve(root, 'site/src/data/status.targets.json');
const OUT = resolve(root, 'site/src/data/status.json');

const TIMEOUT_MS = 5000;
const DEGRADED_MS = 300; // reachable but slow -> "degraded"

async function probe(url) {
  // Unconfigured placeholder endpoints report offline rather than erroring.
  if (!url || url.includes('example.com')) {
    return { state: 'offline', latencyMs: null };
  }
  const started = Date.now();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { method: 'GET', redirect: 'follow', signal: ctrl.signal });
    const latencyMs = Date.now() - started;
    const ok = res.status >= 200 && res.status < 400;
    if (!ok) return { state: 'offline', latencyMs };
    return { state: latencyMs > DEGRADED_MS ? 'degraded' : 'online', latencyMs };
  } catch {
    return { state: 'offline', latencyMs: null };
  } finally {
    clearTimeout(timer);
  }
}

const cfg = JSON.parse(await readFile(TARGETS, 'utf8'));

const services = [];
for (const svc of cfg.services) {
  const { state, latencyMs } = await probe(svc.url);
  services.push({ name: svc.name, state, latencyMs });
}

// The service flagged `gate` decides the headline backend state (default: first).
const gate = cfg.services.find((s) => s.gate) ?? cfg.services[0];
const gateState = services.find((s) => s.name === gate.name)?.state ?? 'offline';

const status = {
  generatedAt: new Date().toISOString(),
  backend: {
    state: gateState,
    activeHost: cfg.activeHost ?? 'arm',
    note: cfg.notes?.[gateState] ?? '',
  },
  services,
};

await writeFile(OUT, JSON.stringify(status, null, 2) + '\n', 'utf8');
console.log(`status: backend=${gateState}; ${services.map((s) => `${s.name}=${s.state}`).join(', ')}`);
