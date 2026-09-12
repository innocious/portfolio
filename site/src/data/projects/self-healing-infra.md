---
title: Self-Healing Free-Tier Cloud Platform
summary: A portfolio backend that provisions itself on scarce free-tier ARM capacity, fails over to an always-available fallback host, and keeps its public status honest.
role: Solo — architecture, IaC, CI/CD
timeframe: "2026"
stack: ["Terraform", "Oracle Cloud", "GitHub Actions", "Docker", "Caddy"]
demoUrl: https://demo.example.com/infra
walkthroughUrl: https://www.youtube.com/watch?v=dQw4w9WgXcQ
featured: true
order: 1
---

## The problem

Free-tier ARM compute (Oracle's Ampere A1) is the best hardware you can get for
nothing — and almost never available. Provisioning attempts fail with "out of
host capacity" for days at a time. A portfolio that depends on that box being up
is a portfolio that's down most of the time.

## Approach

The front end is fully decoupled from the backend and hosted on an always-on
static platform, so the site itself never goes down. The backend is treated as
*intermittent by design*:

- **Terraform** describes the whole footprint — network, a small always-available
  x86 fallback host, and the coveted ARM host — with free-tier ceilings enforced
  as variable validations so a misconfigured apply can't start billing.
- **A scheduled GitHub Actions workflow** keeps retrying the ARM instance,
  cycling availability domains and stepping the CPU/memory request down until
  Oracle has capacity to give, then stops once the box exists.
- **Graceful degradation** — every live-demo link falls back to a recorded
  walkthrough whenever the backend is offline, driven by a status file the CI
  refreshes.

## Outcome

The public URL is up 100% of the time; the interactive demo is up whenever
capacity allows; and the [status page](/status) always tells the truth about
which is which.

> Representative case study using illustrative data.
