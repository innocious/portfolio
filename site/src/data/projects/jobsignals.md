---
title: "JobSignals: An Agentic AI Job-Application System"
summary: "My main project, built end to end: an agentic application on FastAPI and the Anthropic Claude API that reads a resume once, then for any posting tailors the experience, drafts a genuinely human cover letter, researches the company from cited public sources, and tracks every application, with a person approving every claim so nothing is fabricated."
role: "Solo. Full-stack design, the agentic pipeline, prompt engineering, and an offline test suite."
timeframe: "2026"
categories: [ai, cloud-dev, software]
stack: [Python, FastAPI, "Anthropic Claude API", Pydantic, SQLite, Uvicorn, Jinja2, python-docx, pdfplumber, trafilatura, Ollama, pytest]
repoUrl: https://github.com/innocious/jobsignals
highlights:
  - Built an end-to-end agentic application on FastAPI and the Anthropic Claude API that turns a resume plus a job posting into a tailored, ATS-safe resume and a human-sounding cover letter, with the candidate approving every change before it lands.
  - Designed a two-model strategy, a fast low-cost Claude model for parsing and tailoring and a stronger one for the final letter, paired with anti-AI-tone prompt engineering so the writing reads like a person, not a template or a machine.
  - Engineered trust guardrails so the system cannot fabricate on a candidate's behalf, tailoring only re-emphasizes what is already in the resume, the final document is assembled deterministically with no model in the apply step, and every company fact is summarized only from public pages it actually fetched and is cited.
  - Made the LLM backend pluggable across Claude, a local Ollama option, and an offline heuristic backend, so the entire pipeline and the pytest suite run with no API key and no network.
  - Ingested Canada Job Bank CSV exports through a background importer over SQLite in WAL mode to keep the UI responsive, and generated single-column DOCX and PDF that parse correctly in real applicant tracking systems.
featured: true
order: 0
---

## Overview

JobSignals is the project I have invested the most in, designed and built end to
end on my own. It attacks a real, tedious problem: applying to jobs well is slow,
and applying fast is usually applying badly. A strong application means
re-tailoring a resume to each posting's language, writing a cover letter that
does not read like a template or like AI, judging whether you even qualify,
learning enough about the company to sound genuine, and tracking dozens of open
applications at once. JobSignals compresses that loop into a multi-step agentic
pipeline, and keeps a human in control of every claim, so the output is something
the candidate can stand behind in an interview.

## The agentic pipeline

The system is a sequence of specialized steps rather than a single prompt. Each
stage has a narrow job, a typed input, and a typed output:

- **Parse once.** An uploaded resume (PDF text via `pdfplumber`, or DOCX) is
  extracted into structured, editable data.
- **Bring in jobs** by pasting text, giving a URL, or uploading a bulk CSV such
  as a Canada Job Bank export. Bulk imports run in the background so the
  interface stays responsive.
- **Tailor with a human gate.** For a chosen role the system re-emphasizes the
  candidate's real experience in the posting's own language, then shows a
  before-and-after diff approved change by change. Nothing enters a document
  without a click.
- **Research the company.** It fetches the company's own site and Wikipedia,
  distils them into short, cited fact cards, and feeds those into the letter so
  it references real specifics.
- **Write the letter, then assemble deterministically.** The draft is generated,
  edited by the candidate, and then the final document is built by code, not by a
  model.

## Two models, and an anti-AI tone

The most interesting design decision is a **two-model strategy**. Parsing and
tailoring run on a fast, low-cost Claude model because they are high-volume and
well-structured; the cover letter, the single highest-stakes piece of writing,
runs on a stronger model. Structured outputs (Pydantic schemas used directly as
the parse targets) keep the machine-readable steps reliable.

On top of that sits deliberate **prompt engineering for tone**. Generated writing
tends to announce itself, clichés, em-dash pileups, a flat uniform rhythm. The
letter prompt is engineered against exactly those tells, so the result sounds
human. This "anti-AI-tone" work is the difference between output a candidate
sends as-is and output they have to rewrite.

## Why it can be trusted

An application tool that invents credentials is worse than useless, so JobSignals
is built so it *cannot* fabricate:

- **Grounded tailoring.** Suggestions only re-emphasize what is already in the
  resume. Any skill or claim that cannot be matched against the resume's own
  vocabulary is flagged for review, never silently added.
- **No model in the apply step.** Once changes are approved, the final document
  is assembled deterministically, so nothing drifts between what was reviewed and
  what gets saved.
- **Grounded, cited company facts.** The research step summarizes only the public
  text it actually fetched and cites each source; anything it cannot ground is
  dropped rather than invented. It honors `robots.txt` and never scrapes gated
  aggregators.

## Pluggable backends and an offline test suite

The LLM sits behind an interface with three interchangeable backends: **Claude**
for production quality, a local **Ollama** option for the high-volume, lower-
stakes bulk parsing, and a dependency-free **heuristic backend** that needs no
model, key, or network. That last one is what makes the project properly
testable: a `pytest` suite covers the tailoring diff, the grounding guardrails,
document generation, and the web routes, and it runs **entirely offline**. Being
able to evaluate the agent's behaviour without live API calls keeps development
fast and the tests deterministic.

## Data and documents

State lives in SQLite run in WAL mode, so page reads and the background CSV
import do not block each other. The document layer uses `python-docx` with custom
document XML for section rules, tab stops, and page numbers, plus a density pass
that holds the resume to its intended page count, then LibreOffice converts to
PDF. The output is deliberately a clean single-column layout, the format that
parses correctly in the applicant tracking systems most employers run, rather
than a pretty two-column design that quietly breaks them.

## My contribution

Everything here is mine: the problem framing, the agentic architecture, the
two-model and anti-AI-tone strategy, the grounding guardrails, the pluggable-
backend design that enables offline testing, and the full FastAPI application
from data model to document generation.
