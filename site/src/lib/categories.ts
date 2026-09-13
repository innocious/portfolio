// Project categories. A project's first category is its primary (used for
// grouping); the rest are shown as secondary tags. Only categories that have
// at least one project are rendered.
export type Category = { id: string; label: string; blurb: string; icon: string };

export const categories: Category[] = [
  { id: 'devops', label: 'DevOps', blurb: 'Delivery pipelines, automation, and release engineering.', icon: 'server' },
  { id: 'sre', label: 'Site Reliability', blurb: 'Keeping systems available, observable, and recoverable.', icon: 'gauge' },
  { id: 'platform', label: 'Platform & Cloud', blurb: 'Cloud infrastructure and the platforms teams build on.', icon: 'cloud' },
  { id: 'embedded', label: 'Embedded Systems', blurb: 'Firmware, RTOS, and real-time systems on microcontrollers.', icon: 'chip' },
  { id: 'mlops', label: 'MLOps & Edge ML', blurb: 'Training, quantizing, and deploying models, including on-device.', icon: 'brain' },
  { id: 'digital-systems', label: 'Digital Systems & FPGA', blurb: 'Hardware design with VHDL and Verilog.', icon: 'chip' },
  { id: 'qa', label: 'QA & Testing', blurb: 'Test strategy, automation, and quality engineering.', icon: 'flask' },
  { id: 'cloud-dev', label: 'Cloud Development', blurb: 'Building cloud-native applications and services.', icon: 'cloud' },
  { id: 'software', label: 'Software Engineering', blurb: 'General software design and implementation.', icon: 'code' },
];

export const categoryLabel = (id: string): string =>
  categories.find((c) => c.id === id)?.label ?? id;

export const categoryIcon = (id: string): string =>
  categories.find((c) => c.id === id)?.icon ?? 'code';
