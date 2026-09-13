---
title: "Verifying Asynchronous UIs: A Three-Technique Study"
summary: A software verification case study on a real, unmodified observability dashboard (Uptime Kuma). I put its WebSocket-driven UI through three verification techniques, a static code walkthrough, an automated Playwright E2E suite in CI, and session-based exploratory testing, and measured what each one actually catches.
role: Team of two (with Kelechukwu Ede). Verification design, Playwright suite and CI, static walkthrough, and reporting.
timeframe: "2026"
course: ENGI 9839, Software Verification and Validation, Memorial University of Newfoundland
categories: [qa, software]
stack: [Playwright, "E2E testing", Static code review, Exploratory testing, GitHub Actions, Node.js, "Vue 3", Socket.io]
repoUrl: https://github.com/innocious/SVV-Project
highlights:
  - Designed an honest, controlled comparison of three implementation-phase verification techniques on the real, unmodified Uptime Kuma 1.23.9, recording every genuine defect and the effort each technique cost rather than seeding artificial faults.
  - Built an automated Playwright end-to-end suite (one-time auth, deterministic monitor seeding, live-status and reconnect checks) wired into a GitHub Actions pipeline that starts the system under test and re-runs on every commit, publishing an HTML report as the single source of truth.
  - Ran a structured static walkthrough of the asynchronous state layer and found the deepest logic faults, an unbounded list, a reconnect race, and a clear-then-refill window that briefly renders a healthy monitor as Unknown.
  - Used session-based exploratory testing with Whittaker's City Tours to surface user-facing faults the other techniques missed, including a layout overflow and a frozen cloned monitor.
  - Catalogued nine genuine defects (plus one documented false alarm) with anomaly class, severity, and exact source locations, and delivered an evidence-based recommendation that the techniques are complementary.
links:
  - { label: "Project report (DOCX)", url: "/projects/svv/report.docx" }
  - { label: "Topic proposal (PDF)", url: "/projects/svv/proposal.pdf" }
  - { label: "Slides (PPTX)", url: "/projects/svv/slides.pptx" }
featured: true
order: 1
---

## What this project actually is

This is not a "built a feature" project. It is a piece of verification
engineering: a rigorous, honest study of how you test software whose user
interface changes on its own. Real-time dashboards mutate their state
asynchronously in response to WebSocket events, so updates can arrive late, out
of order, or be lost on a reconnect, and the interface can quietly show stale
state. That makes them genuinely hard to verify. The question I set out to answer
with my teammate was: for this kind of asynchronous interface, which verification
technique actually catches the bugs, and what does each one uniquely contribute?

## The design

To keep the comparison honest, we did not inject artificial faults. We took a
real, widely used, unmodified application, Uptime Kuma 1.23.9 (Vue 3, Node.js,
Socket.io), pinned the exact version so the code we read is byte-identical to the
code the tests run, and applied three techniques to it, logging every genuine
defect each one found along with the effort spent:

- **T1, static walkthrough.** A structured, line-by-line reading of the
  asynchronous state layer (`socket.js` and the heartbeat pipeline), reasoning
  about races, unbounded growth, and missing guards without running the code.
- **T2, automated dynamic E2E (Playwright).** A suite that drives a real browser
  against the running app, seeds deterministic monitors, and probes live-status
  and reconnect behaviour, run continuously in CI.
- **T3, session-based exploratory testing.** Time-boxed, chartered sessions using
  Whittaker's City Tours to explore the running app with intent.

## The automated pipeline

The dynamic results are not a manual run on one laptop. A GitHub Actions workflow
starts Uptime Kuma in a container on every push, waits until it is reachable,
runs the Playwright suite against it, and uploads the HTML report as an artifact,
green in about ninety seconds. That pipeline run, not a screenshot, is the source
of truth for the dynamic results, which is exactly the repeatability the other two
techniques cannot offer.

## What we found

Nine genuine defects across the three techniques, plus one candidate we
investigated and honestly recorded as a false alarm:

- **Static review found the most, and the deepest (7).** An important-heartbeat
  list that grows without bound, a reconnect that empties both state lists before
  refilling them, and the visible symptom of that gap, a healthy monitor flashing
  grey as Unknown, among others. These are internal, timing-dependent faults that
  are nearly impossible to trigger on demand.
- **Exploratory testing found the user-facing faults the others missed (3).** A
  400-character monitor name that overflows a table, and a cloned monitor whose
  heartbeat bar stays frozen with no cue why.
- **The Playwright suite confirmed one defect and, more importantly, verified
  correct behaviour repeatably (1).** Against a mature application most checks
  pass, and that is the point: it is the only technique that re-runs on every
  commit with no human, catching the day a behaviour breaks.

## The result

No single technique dominated. Each caught a class of defect the others
structurally could not, and two defects were caught by more than one technique.
The honest, defensible conclusion is complementarity: read the code to find deep
timing faults, automate the confirmed behaviours in CI so they cannot regress,
and explore to catch what nobody thought to assert. A green test is evidence only
when the test is sound, we watched a reconnect test pass incorrectly until we
added an explicit wait, which is its own lesson about trusting automation.

## Why it matters for QA

The project demonstrates the full arc of a verification engineer's work:
choosing a strategy, building trustworthy automated tests in a pipeline, reading
code adversarially for concurrency faults, exploring like a user, and reasoning
about evidence and its threats to validity rather than chasing a single metric.
