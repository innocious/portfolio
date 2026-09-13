---
title: Predictive Maintenance with Edge ML on NuttX
summary: On-device motor-vibration anomaly detection. An INT8 TensorFlow Lite Micro model runs as a real-time task pipeline on the NuttX RTOS targeting an STM32F407, simulated in Renode.
role: Solo (design, model training, RTOS integration, evaluation)
timeframe: "2026"
course: ENGI 9875, Special Topics in Embedded Systems, Memorial University of Newfoundland
categories: [embedded, mlops]
stack: [C, "C++", NuttX RTOS, TensorFlow Lite Micro, STM32F407, Renode, Python, Keras, POSIX]
highlights:
  - Deployed an INT8-quantized neural network (2.6 KB model, 708 bytes of runtime RAM) with TFLite Micro on the NuttX RTOS and an STM32F407, simulated in Renode.
  - Structured the system as a three-task real-time pipeline (sampling, inference, alert) with rate-monotonic priorities; measured utilization 0.18 against the 0.78 schedulability bound.
  - Used POSIX message queues to decouple sampling from inference, a counting semaphore to protect the shared anomaly log, and an event-driven notification semaphore for zero-poll alerts.
  - Reached 100% classification accuracy across 20 test batches (5 Hz normal vs 20 Hz bearing-fault), using 13% of flash and 708 bytes of the tensor arena.
  - Solved a NuttX vs TFLite C++/C-math incompatibility with a 90-line compatibility shim (namespace injection, float overloads, macro wrapping, overload disambiguation) force-included at build time.
links:
  - { label: "Project report (DOCX)", url: "/projects/nuttx/report.docx" }
  - { label: "Proposal (PDF)", url: "/projects/nuttx/proposal.pdf" }
  - { label: "Slides (PPTX)", url: "/projects/nuttx/slides.pptx" }
featured: true
order: 1
---

## Overview

Industrial equipment rarely fails without warning. This project detects that
warning on the device itself: a small neural network watches motor vibration and
raises an alert the moment the signature drifts from healthy to a bearing fault.
Everything runs in C on the NuttX real-time operating system, on an STM32F407
microcontroller simulated in Renode, with no cloud and no network in the loop.

## The problem

Threshold-based monitoring misses the subtle degradation that precedes a
catastrophic failure, and shipping raw sensor data to the cloud for inference
adds latency and a network dependency you cannot rely on. The alternative is edge
machine learning: run the model on the microcontroller. That trades a networking
problem for three embedded ones, memory, numerical compatibility, and real-time
scheduling, which is exactly what this project works through.

## System architecture

The application is a three-stage pipeline, each stage a POSIX thread with an
explicit priority following rate-monotonic principles:

- **Sampling task (priority 110):** generates vibration data at 100 Hz,
  quantizes it to INT8, and sends batches down a message queue.
- **Inference task (priority 100):** receives batches, runs the TFLite Micro
  model, scores the result, and signals the alert task on an anomaly.
- **Alert task (priority 90):** blocks on a semaphore, wakes only when signalled,
  reads the shared log, and issues the maintenance alert.

Applying rate-monotonic analysis, total CPU utilization is 0.18, well under the
0.78 bound for three tasks, so the pipeline meets its deadlines with wide margin.

## Real-time services

- **POSIX message queue** (`/ml_vib_queue`, capacity 5) decouples the producer
  from the consumer so sampling never stalls when a batch takes longer to score.
- **Counting semaphore** (`g_log_sem`) guards the shared anomaly log against
  corruption from concurrent read and write across tasks, with a minimal
  critical section.
- **Notification semaphore** (`g_alert_sem`) implements zero-overhead alerting:
  the alert task consumes no CPU while idle and is woken directly by the
  inference task, avoiding polling.

## The machine learning

A binary classifier (one hidden layer of 16 ReLU units, sigmoid output) was
trained offline in Keras on 4,000 batches of time-domain samples, then
post-training INT8 quantized with a representative dataset. The result is a
2,608-byte model, small enough to embed in flash as a C header, running under 1 KB
of RAM at inference.

## The hard part: making TFLite Micro speak NuttX

TFLite Micro assumes a full C++ standard library where `std::round`, `std::pow`,
`std::sqrt` and friends live in the `std` namespace. NuttX ships only a minimal C
`math.h` in the global namespace with no float overloads, so the library would
not compile or link. The fix was a 90-line compatibility shim
(`nuttx_math_shim.h`) that injects the C math functions into `std`, adds inline
float overloads to satisfy function-pointer type matches, wraps the
macro-defined `isnan`/`isinf`/`signbit`, and disambiguates overloaded calls like
`pow`. It is force-included via the compiler's `-include` flag, so no third-party
source was modified. A second issue, a linker error for a `MicroPrintf` symbol
stripped in non-debug builds, was resolved by enabling `CONFIG_TFLITEMICRO_DEBUG`.

## Results

Tested in Renode over 20 batches, 10 normal (5 Hz sine) and 10 bearing-fault
(20 Hz whine), the system classified every batch correctly: 100% accuracy. The
full NuttX image is 138 KB of flash (13%), and the tensor arena uses just 708
bytes of its 8 KB allocation, leaving generous headroom.

## What I learned

Embedded C++ is not desktop C++: `#include <cmath>` only gives you `std::round`
when a full standard library is present, and RTOSes often ship minimal C
wrappers. The `-include` flag is a clean way to inject compatibility without
touching vendor code. And INT8 quantization is remarkably effective, a
sub-3 KB model hit perfect accuracy here while using under 1 KB of runtime memory.

## Future work

Implement a full NuttX character device driver (`/dev/accel0`) so the sampling
task reads through `open()`/`read()`, swap the binary classifier for an
autoencoder to detect anomalies without labelled fault data, deploy on physical
STM32F4 hardware with a MEMS accelerometer, and add FFT features for richer fault
discrimination.
