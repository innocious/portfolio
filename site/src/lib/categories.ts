// Project categories. A project's first category is its primary (used for
// grouping); the rest are shown as secondary tags. Only categories that have
// at least one project are rendered.
export type Category = { id: string; label: string; blurb: string };

export const categories: Category[] = [
  { id: 'devops', label: 'DevOps', blurb: 'Delivery pipelines, automation, and release engineering.' },
  { id: 'sre', label: 'Site Reliability', blurb: 'Keeping systems available, observable, and recoverable.' },
  { id: 'platform', label: 'Platform & Cloud', blurb: 'Cloud infrastructure and the platforms teams build on.' },
  { id: 'embedded', label: 'Embedded Systems', blurb: 'Firmware, RTOS, and real-time systems on microcontrollers.' },
  { id: 'mlops', label: 'MLOps & Edge ML', blurb: 'Training, quantizing, and deploying models, including on-device.' },
  { id: 'digital-systems', label: 'Digital Systems & FPGA', blurb: 'Hardware design with VHDL and Verilog.' },
  { id: 'qa', label: 'QA & Testing', blurb: 'Test strategy, automation, and quality engineering.' },
  { id: 'cloud-dev', label: 'Cloud Development', blurb: 'Building cloud-native applications and services.' },
  { id: 'software', label: 'Software Engineering', blurb: 'General software design and implementation.' },
];

export const categoryLabel = (id: string): string =>
  categories.find((c) => c.id === id)?.label ?? id;
