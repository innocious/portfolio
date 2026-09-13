---
title: FPGA Gesture Recognition on a Cyclone V SoC
summary: A real-time orientation and gesture-recognition system on the DE10-Standard. An ADXL345 accelerometer feeds the ARM HPS, which computes pitch and roll and hands integer angles to custom VHDL on the FPGA that classifies orientation and drives live 7-segment output.
role: Team of two (with Avijit Hazra). My part, top-level and datapath design, the Platform Designer bridge, the HPS C code, report, and presentation.
timeframe: "2026"
course: ENGI 9865, Advanced Digital Systems, Memorial University of Newfoundland
categories: [digital-systems, embedded]
stack: [VHDL, Intel Cyclone V SoC, DE10-Standard, Quartus Prime, Platform Designer, ModelSim, C, I2C, ADXL345]
highlights:
  - Built a real-time orientation and gesture-recognition system on the DE10-Standard (Cyclone V SoC), turning live ADXL345 accelerometer data into orientation states (up, down, left, right, front, back) plus pitch and roll angles.
  - Partitioned the design across the ARM HPS and the FPGA fabric, the HPS reads the sensor over I2C and computes pitch and roll with atan2, then writes integer angles to the FPGA across the HPS-to-FPGA bridge, keeping heavy floating-point math off the fabric.
  - Designed the top-level and datapath, built the Platform Designer bridge, and wrote the HPS C code; the FPGA side runs a threshold-based state machine and a BCD 7-segment angle display in VHDL.
  - Chose the tangent formulation over sine or cosine because tan is far more sensitive near 90 degrees, and averaged 8 samples every 50 ms to smooth human-speed motion against a 50 MHz clock.
  - Verified the hardware with a self-checking ModelSim testbench and synthesized in Quartus Prime for Cyclone V, avoiding the floating-point "can't fit" error (11802) by offloading atan2 to the HPS.
links:
  - { label: "Project report (DOCX)", url: "/projects/fpga-gesture/report.docx" }
  - { label: "Proposal & design (PDF)", url: "/projects/fpga-gesture/proposal.pdf" }
  - { label: "Slides (PPTX)", url: "/projects/fpga-gesture/slides.pptx" }
featured: true
order: 1
---

## Overview

This project reads how a board is being held and turns that into meaning in real
time. An ADXL345 accelerometer on the Terasic DE10-Standard senses gravity along
three axes, and the system translates those readings into human-readable
orientation (up, down, left, right, front, back) and precise pitch and roll
angles, shown live on the 7-segment displays. The same primitive is the
foundation for richer applications such as sign-language recognition and drone
control.

## How the work is split across the chip

The Cyclone V is a heterogeneous SoC: an ARM Hard Processor System next to FPGA
fabric. The design uses each for what it is best at.

- **HPS (C on the ARM).** Reads raw X, Y, Z from the ADXL345 over I2C, then
  computes pitch and roll with `atan2`. It writes the resulting integer angles to
  the FPGA through the HPS-to-FPGA bridge as parallel I/O.
- **FPGA (VHDL).** Receives the angle and axis data, runs a threshold-based state
  machine to classify orientation, converts angles to binary-coded decimal, and
  drives the 7-segment displays without flicker.

Keeping the trigonometry on the HPS was a deliberate architectural choice: doing
`atan2` in floating-point VHDL blew past the fabric's resources and produced
Quartus's "can't fit design" error (11802), so offloading it to the processor
kept the hardware small and deterministic.

## Design decisions worth noting

- **Tangent, not sine or cosine.** Sine flattens out near 90 degrees (about 0.99
  at 80 degrees) and is symmetric across the 0 to 180 degree range, which makes it
  ambiguous. Tangent stays sensitive where it matters, so pitch and roll are
  computed as `tan(pitch) = x/z` and `tan(roll) = y/z`.
- **Sampling for human motion.** The HPS updates registers every 50 ms, and the
  FPGA averages 8 samples before deciding, because a person moves far slower than
  the 50 MHz clock and raw readings are noisy.
- **Thresholds from the datasheet.** At 3.9 mg per LSB, 1 g is about 256 counts,
  so a threshold of +/-200 counts cleanly separates each tilt direction.

## Verification and synthesis

The VHDL was verified in ModelSim with a self-checking testbench that drives the
angle-display module with known values (for example, confirming that -45 degrees
is decoded with the correct sign and BCD digits) within the 50 MHz clock domain.
The full design was synthesized in Quartus Prime for the Cyclone V, with the
HPS-offload decision keeping it comfortably within the device's resources.

## My contribution

Working with Avijit Hazra, I led the initial top-level and datapath design, built
the Platform Designer bridge between the HPS and the FPGA, and wrote the HPS C
code that reads the sensor and computes the angles, and I co-authored the report
and presentation. Avijit led the gesture logic and ASM charts, the VHDL
implementation and DE10 synthesis, and the build configuration.
