---
title: FPGA USB Image Proxy Display System
summary: A hardware appliance that safely previews USB drives. A Cyclone V SoC reads only BMP images from a USB stick and shows them over VGA, so the drive never touches a general-purpose PC. Custom VHDL VGA controller plus an ARM/Linux decoder.
role: Solo (VHDL design, SoC integration, HPS software, verification)
timeframe: "2026"
course: ENGI 9865, Advanced Digital Systems, Memorial University of Newfoundland
categories: [digital-systems, embedded]
stack: [VHDL, Verilog, Intel Cyclone V SoC, Quartus Prime, Platform Designer, ModelSim, C, Embedded Linux, DE10-Standard]
highlights:
  - Designed a 640x480 at 60 Hz VGA controller in VHDL using ASM-chart methodology, pixel-clock generation, horizontal and vertical timing counters, sync generation, and a frame-buffer reader.
  - Built a heterogeneous Cyclone V SoC system in Platform Designer, with the ARM Hard Processor System and the FPGA fabric sharing a dual-port on-chip RAM frame buffer over the lightweight HPS-to-FPGA bridge.
  - Wrote an embedded-Linux C program that enumerates USB mass storage, parses 24-bit BMP files, converts BGR24 to RGB565, and writes the frame buffer, with a frame-ready handshake that prevents display tearing.
  - Implemented RGB565 to RGB888 color expansion by bit replication and 7-segment status feedback for system state.
  - Verified every VHDL module with an 11-case ModelSim testbench covering timing accuracy, addressing, color expansion, and boundary conditions.
links:
  - { label: "Project report (DOCX)", url: "/projects/fpga/report.docx" }
  - { label: "Proposal & design (PDF)", url: "/projects/fpga/proposal.pdf" }
  - { label: "Slides (PPTX)", url: "/projects/fpga/slides.pptx" }
featured: true
order: 1
---

## Overview

Plugging a USB stick into a computer is a routine act that carries real risk:
the drive can carry malware that infects the host the moment it mounts. This
project builds a dedicated piece of hardware that sidesteps that risk. A Cyclone V
SoC on a Terasic DE10-Standard board reads only BMP image files from a USB drive
and displays them over VGA. Nothing on the drive executes, and no general-purpose
PC is ever exposed. The motivating scenario was marine navigation, where crews
must load map images from USB sticks that could be corrupted.

## The idea

Treat the display as a proxy. The device can do exactly one thing with a USB
drive: find an image and show it. Everything else on the stick is irrelevant and
untouched. That narrow capability is the security property.

## Architecture

The design is a producer-consumer split across the two halves of the Cyclone V:

- **HPS (ARM Cortex-A9, embedded Linux) is the producer.** It enumerates the USB
  drive through standard Linux drivers, locates the first BMP, parses the 24-bit
  header, converts each pixel from BGR24 to RGB565, and writes the decoded image
  into a shared frame buffer.
- **FPGA fabric is the consumer.** A VHDL VGA controller continuously reads the
  frame buffer and drives the ADV7123 DAC to produce a stable 640x480 at 60 Hz
  picture.

The two halves meet at a **dual-port on-chip RAM** frame buffer: the HPS writes
through the lightweight HPS-to-FPGA bridge on port 1 while the FPGA reads on
port 2, so both run at once without bus contention. A 1-bit `frame_ready` status
register is the handshake: the FPGA shows black until the HPS finishes writing,
which prevents tearing.

## The VHDL controller

A single VHDL entity, designed with ASM-chart methodology, handles clock
generation (25 MHz pixel clock from the 50 MHz board clock), free-running
horizontal (0 to 799) and vertical (0 to 524) timing counters, active-low sync
generation, frame-buffer address calculation (`y * 320 + x`) with the on-chip
memory's one-clock read latency pipelined, RGB565 to RGB888 expansion by
replicating the most significant bits, and the 7-segment status display.

## Verification

Every module was simulated in a ModelSim testbench with 11 test cases: reset
behavior, VGA timing (HSYNC period of 800 pixel clocks, VSYNC pulse of 2 lines),
blanking outside the visible region, frame-buffer addressing, color expansion,
the frame-ready flag, region boundaries, and the status display. Hardware testing
confirmed the 7-segment display transitions from "--no" to "dOnE" once an image
loads, and the pipeline renders known color patterns correctly.

## What I took from it

This was a full heterogeneous SoC design: partitioning a problem across a CPU and
custom hardware, integrating them through Platform Designer and a memory-mapped
bridge, and meeting real-time video timing in VHDL. It also reframed a security
problem as a hardware-capability problem, where safety comes from what the device
physically cannot do.
