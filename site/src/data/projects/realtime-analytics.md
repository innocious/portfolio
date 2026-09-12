---
title: Privacy-First Realtime Analytics
summary: A lightweight event pipeline that reports live traffic without third-party trackers, resilient to backend downtime via an edge-buffered click beacon.
role: Backend & edge
timeframe: "2025"
stack: ["Cloudflare Workers", "D1", "TypeScript", "Umami"]
demoUrl: https://demo.example.com/analytics
walkthroughUrl: https://www.youtube.com/watch?v=dQw4w9WgXcQ
featured: true
order: 2
---

## The problem

Self-hosted analytics dies with its host. When the origin VM is down for
maintenance — or stuck waiting on cloud capacity — every event in that window is
lost, and the dashboards lie by omission.

## Approach

- A **Cloudflare Worker** receives click/pageview beacons at the edge and writes
  them to **D1**, so collection survives origin downtime entirely.
- Events reconcile into the self-hosted dashboard when the origin returns.
- No cookies, no cross-site identifiers — aggregate counts only.

## Outcome

Zero data loss across origin outages, sub-50 ms beacon acknowledgement from the
edge, and a compliance story that fits on an index card.

> Representative case study using illustrative data.
